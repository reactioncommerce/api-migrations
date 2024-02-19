# Largely based on https://github.com/reactioncommerce/docker-base/blob/trunk/images/node-dev/12.14.1-v3/Dockerfile 
FROM node:18.18.2-alpine

# hadolint ignore=DL3018
RUN apk --no-cache --update add bash curl less shadow su-exec tini vim make py3-pip g++ git
SHELL ["/bin/bash", "-o", "pipefail", "-o", "errexit", "-u", "-c"]

# Allow yarn/npm to create ./node_modules
RUN mkdir -p /usr/local/src/app && chown node:node /usr/local/src/app

# Install latest NPM
# RUN npm install -g npm@latest

WORKDIR /usr/local/src/app

COPY --chown=node:node ./ /usr/local/src/app

RUN npm i -g pnpm@8.11.0 && pnpm install && chmod +x /usr/local/src/app/scripts/entrypoint.sh

USER node
ENTRYPOINT ["tini", "--", "/usr/local/src/app/scripts/entrypoint.sh"]
LABEL com.reactioncommerce.name="reaction-api-migrations"
