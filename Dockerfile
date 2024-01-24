FROM node:20 AS BASE
WORKDIR /usr/src/app
COPY package.json package-lock.json ./

FROM base AS dependencies

RUN npm install
COPY ./ ./

FROM dependencies as build

RUN npm run build

# RELEASE STAGE
FROM nginx

COPY --from=build /usr/src/app/index.html /usr/share/nginx/html/index.html
COPY --from=build /usr/src/app/dist/index.js /usr/share/nginx/html/build/bundle.js

RUN chmod a+r -R /usr/share/nginx/html

COPY deploy/.docker/config.js.template /etc/nginx/config.js.template
COPY deploy/.docker/error.html /usr/share/nginx/html/error.html
COPY deploy/.docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
COPY deploy/.docker/docker-entrypoint.sh /
RUN chmod a+x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
