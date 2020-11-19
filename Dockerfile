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
FROM alpine:3

WORKDIR /home/labox

COPY --from=builder /home/labox/dist/install.sh .
RUN sh install.sh

COPY --from=builder /home/labox/dist .
RUN sh finish.sh

USER labox
