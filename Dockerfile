# Largely based on https://github.com/reactioncommerce/docker-base/blob/trunk/images/node-dev/12.14.1-v3/Dockerfile 
FROM node:12.14.1-alpine

# hadolint ignore=DL3018
RUN apk --no-cache --update add bash curl less shadow su-exec tini vim python2 make git
SHELL ["/bin/bash", "-o", "pipefail", "-o", "errexit", "-u", "-c"]

# Allow yarn/npm to create ./node_modules
RUN mkdir -p /usr/local/src/app && chown node:node /usr/local/src/app

# Install latest NPM
RUN npm install -g npm@latest

COPY . /usr/local/src/app

WORKDIR /usr/local/src/app

RUN npm install

USER root

ENTRYPOINT ["tini", "--", "/usr/local/src/app/scripts/entrypoint.sh"]