FROM nestybox/alpine-docker

WORKDIR /home/labox

ARG LANGUAGE

COPY runner scripts/runner-setup.sh ./
RUN sh runner-setup.sh $LANGUAGE

COPY server/package*.json ./
RUN apk add --no-cache npm && npm ci

COPY server .
CMD ["npm", "start"]

COPY scripts/entrypoint.sh .
ENTRYPOINT ["sh", "entrypoint.sh"]
