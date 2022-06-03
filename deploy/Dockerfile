FROM node:16-alpine AS BASE
WORKDIR /usr/src/app

COPY ../package.json ./
COPY ../package-lock.json ./

ENV SERVER_URL="http://localhost:9999"
ENV CONTEXT="/fta-fmea"
ENV ADMIN_ONLY=false

FROM base AS dependencies

RUN npm install
COPY ./ ./

FROM dependencies as build

RUN REACT_APP_BASE_API_URL=${SERVER_URL}/${CONTEXT}-server \
    REACT_APP_ADMIN_REGISTRATION_ONLY=${ADMIN_ONLY} \
    npm run build

# RELEASE STAGE
FROM nginx

COPY --from=build /usr/src/app/public/build /usr/share/nginx/html
RUN chmod a+r -R /usr/share/nginx/html
