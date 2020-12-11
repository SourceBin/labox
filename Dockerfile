FROM nestybox/alpine-docker

WORKDIR /home/labox

ARG LANGUAGE
ENV LANGUAGE $LANGUAGE

COPY runner scripts/runner-setup.sh ./
RUN sh runner-setup.sh $LANGUAGE

COPY server/package*.json ./
RUN apk add --no-cache npm && npm ci

COPY scripts/entrypoint.sh .
ENTRYPOINT ["sh", "entrypoint.sh"]

COPY server .
CMD npm start $LANGUAGE
