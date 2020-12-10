FROM nestybox/alpine-docker

WORKDIR /home/labox

# TODO: don't copy runner.tar in a different layer
COPY runner.tar scripts/runner-setup.sh ./
RUN sh runner-setup.sh && rm runner-setup.sh

COPY server/package*.json ./
RUN apk add --no-cache npm && npm ci

COPY server .
CMD ["npm", "start"]

COPY scripts/entrypoint.sh .
ENTRYPOINT ["sh", "entrypoint.sh"]
