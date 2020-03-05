FROM registry.access.redhat.com/ubi8/nodejs-10

USER root

# Install OS updates
RUN yum upgrade --disableplugin=subscription-manager -y \
 && yum clean --disableplugin=subscription-manager packages \
 && echo 'Finished installing dependencies'

 RUN groupadd --gid 1000 node \
  && useradd --uid 1000 --gid node --shell /bin/bash --create-home node

 RUN yum install --disableplugin=subscription-manager python2 -y
 RUN ln -s /usr/bin/python2 /usr/bin/python

# Install stack dependencies
WORKDIR /project
COPY ./package*.json ./
RUN npm install --production

# Install user-app dependencies
WORKDIR /project/user-app
COPY ./user-app/package*.json ./
RUN npm install --production

COPY . /project
RUN chown -hR node:node /project

# ESLint invocation
RUN npm install eslint \
    && echo 'module.exports = { \
    "env": { \
        "browser": false, \
        "commonjs": true, \
        "es6": true \
    }, \
    "extends": "eslint:recommended", \
    "globals": { \
        "Atomics": "readonly", \
        "SharedArrayBuffer": "readonly" \
    }, \
    "parserOptions": { \
        "ecmaVersion": 2018 \
    }, \
    "rules": { \
    } \
};' > .eslintrc.js \
    && echo 'test/*' >  .eslintignore \
    && ./node_modules/.bin/eslint /project/user-app

WORKDIR /project

ENV NODE_PATH=/project/user-app/node_modules

ENV NODE_ENV production
ENV PORT 3000

USER node

EXPOSE 3000
CMD ["npm", "start"]
