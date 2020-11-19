###########
# Builder #
###########
FROM node:alpine AS builder

WORKDIR /home/labox

ARG LANGUAGE

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build $LANGUAGE

#########
# Image #
#########
FROM nestybox/alpine-docker

WORKDIR /home/labox

COPY --from=builder /home/labox/dist .
RUN sh install.sh

RUN find . -type f ! -name 'run.sh' -delete
