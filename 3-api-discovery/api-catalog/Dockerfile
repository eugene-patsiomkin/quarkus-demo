FROM node:lts-slim  AS deps

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package* ./
RUN npm install

FROM node:lts-slim  AS builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
COPY --from=deps /usr/src/app/node_modules ./node_modules
RUN npm run build

FROM node:lts-slim  AS runner

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/.next ./.next

EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]