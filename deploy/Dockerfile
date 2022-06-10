FROM node:16-alpine AS BASE
WORKDIR /usr/src/app
COPY package.json package-lock.json ./

ENV SERVER_URL="http://localhost:9999"
ENV CONTEXT="fta-fmea"
ENV ADMIN_ONLY=false

FROM base AS dependencies

RUN npm install
COPY ./ ./

#RUN sed -i "s|BASE_API_URL=.*$|BASE_API_URL=$SERVER_URL/$CONTEXT|" .env.prod
#RUN sed -i "s|REACT_APP_ADMIN_REGISTRATION_ONLY=.*$|REACT_APP_ADMIN_REGISTRATION_ONLY=${ADMIN_ONLY}|" .env.prod

FROM dependencies as build

RUN npm run build

# RELEASE STAGE
FROM nginx

COPY --from=build /usr/src/app/public/index.html /usr/share/nginx/html/index.html
COPY --from=build /usr/src/app/public/build/bundle.js /usr/share/nginx/html/build/bundle.js

RUN chmod a+r -R /usr/share/nginx/html

COPY .docker/docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
