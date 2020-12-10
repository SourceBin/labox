###########
# Builder #
###########
FROM node:alpine AS builder

WORKDIR /home/runner

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

COPY --from=builder /home/runner/dist/global.sh .
RUN sh global.sh

COPY --from=builder /home/runner/dist/packages.sh .
RUN bash packages.sh

COPY --from=builder /home/runner/dist/setup.sh .
RUN bash setup.sh

COPY --from=builder /home/runner/dist .

WORKDIR /home/runner
USER runner
