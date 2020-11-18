###########
# Builder #
###########
FROM node:alpine AS builder

WORKDIR /home/labox

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

#########
# Image #
#########
FROM nestybox/alpine-docker

WORKDIR /home/labox

COPY --from=builder /home/labox/dist .
RUN sh install.sh

RUN find . -type f ! -name 'run.sh' -delete
