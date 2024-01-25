FROM node:20-alpine AS BASE
WORKDIR /usr/src/app
COPY package.json package-lock.json ./

FROM base AS dependencies
RUN npm install
COPY ./ ./

FROM dependencies as build
RUN npm run build

# RELEASE STAGE
FROM nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html/
RUN chmod a+r -R /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
