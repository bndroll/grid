import { createLogger, format, Logger as WinstonLogger, transports } from 'winston';
import stringify from 'fast-safe-stringify';
import { customLogLevels, LogLevel } from './types';

export class Logger {
	private readonly logger: WinstonLogger;
	private readonly objectLogger: WinstonLogger;

	constructor(context?: string) {
		this.logger = createLogger({
			levels: customLogLevels.levels,
			transports: [
				new transports.Console({
					level: 'debug',
					format: format.combine(
						format.colorize({all: true, colors: customLogLevels.colors})
					)
				}),
			],
			format: format.combine(
				format.label({label: context ?? 'APP'}),
				format.timestamp({format: 'YYYY-MM-DD, HH:mm:ss'}),
				format.simple(),
				format.printf(({level, message, label, timestamp}) => {
					return `[GRID]  - ${timestamp.padEnd(23)} [${level}] [${label}]: ${message}`;
				})
			),
			exitOnError: false
		});
		this.objectLogger = createLogger({
			levels: customLogLevels.levels,
			transports: [
				new transports.Console({level: 'debug'}),
			],
			format: format.combine(
				format.prettyPrint(),
				format.simple(),
				format.printf(info => {
					if (info.message?.constructor === Object) {
						info.message = stringify(info.message, undefined, 2);
					}
					return `${info.message}`;
				})
			),
			exitOnError: false
		});
	}

	private logMessage(level: LogLevel, messages: any[]) {
		let logMessage = '';
		for (const message of messages) {
			if (typeof message === 'object') {
				this.logger.log(level, logMessage);
				logMessage = '';
				this.objectLogger.info(message);
				continue;
			}

			logMessage += logMessage ? (' ' + message) : message;
		}
		if (logMessage) {
			this.logger.log(level, logMessage);
		}
	}

	public error(...messages: any[]) {
		this.logMessage('error', messages);
	}

	public log(...messages: any[]) {
		this.logMessage('info', messages);
	}

	public warn(...messages: any[]) {
		this.logMessage('warn', messages);
	}

	public emerg(...messages: any[]) {
		this.logMessage('emerg', messages);
	}

	public debug(...messages: any[]) {
		this.logMessage('debug', messages);
	}
}
