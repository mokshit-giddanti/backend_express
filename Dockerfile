FROM node:18-alpine
WORKDIR /
COPY package*.json ./
COPY . .
RUN npm install --force --legacy-peer-deps
CMD [ "npm", "start" ] 