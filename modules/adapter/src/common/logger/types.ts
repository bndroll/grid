export type LogLevel = 'info' | 'error' | 'warn' | 'emerg' | 'debug';
export type LogLevelOptions = { levels: Record<LogLevel, number>, colors: Record<LogLevel, string> };

export const customLogLevels: LogLevelOptions = {
	levels: {
		emerg: 0,
		error: 1,
		warn: 2,
		info: 3,
		debug: 4
	},
	colors: {
		emerg: 'magenta',
		error: 'red',
		warn: 'yellow',
		info: 'green',
		debug: 'blue'
	}
};
