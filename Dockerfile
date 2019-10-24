FROM node:12-alpine as packages
COPY package.json .
RUN yarn install

FROM node:12-alpine as builder
COPY . .
COPY --from=packages node_modules ./node_modules
RUN yarn build

FROM nginx:alpine as dist
WORKDIR /usr/share/nginx/html
COPY --from=builder dist .
