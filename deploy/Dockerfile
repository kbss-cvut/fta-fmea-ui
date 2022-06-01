FROM node:16-alpine AS BASE
WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

ENV SERVER_URL="http://localhost:9999"
ENV CONTEXT="/fta-fmea"
ENV ADMIN_ONLY=false

RUN npm install
COPY ./ ./

RUN REACT_APP_BASE_API_URL=${SERVER_URL}/${CONTEXT}-server \
    REACT_APP_ADMIN_REGISTRATION_ONLY=${ADMIN_ONLY} \
    npm run build