FROM node:10-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R jenkins-admin:jenkins-admin /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER jenkins-admin

RUN npm install

COPY --chown=jenkins-admin:jenkins-admin . .

EXPOSE 4000

CMD [ "node", "app.js" ]
