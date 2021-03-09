FROM node:lts-slim
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 7763
CMD ["npm", "run", "start"]