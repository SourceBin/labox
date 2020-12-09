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

WORKDIR /usr/bin

COPY --from=builder /home/labox/dist/global.sh .
RUN sh global.sh

COPY --from=builder /home/labox/dist/packages.sh .
RUN bash packages.sh

COPY --from=builder /home/labox/dist/setup.sh .
RUN bash setup.sh

COPY --from=builder /home/labox/dist .

WORKDIR /home/labox
USER labox
