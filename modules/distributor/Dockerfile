FROM node:20-alpine as build
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine as production
WORKDIR /app
COPY --from=build /app .
CMD ["npm", "start"]
