FROM node:16-alpine as build

ENV NODE_ENV=production

RUN apk --no-cache --virtual .build add build-base python3 git

WORKDIR /usr/src/app

# copy in main package.json and yarn.lock
COPY package.json /usr/src/app/
RUN npm install --production

COPY . /usr/src/app

# Final stage
FROM node:16-alpine

ENV NODE_ENV=production
ENV DATABASE_URL=production

WORKDIR /usr/src/app
COPY --from=build /usr/src/app /usr/src/app
RUN npx prisma generate
RUN chmod +x startup.sh

CMD [ "startup.sh" ]
