#!/usr/bin/env sh
set -eu

envsubst '${FTA_FMEA_BASENAME} ${FTA_FMEA_API_URL} ${FTA_FMEA_ADMIN_REGISTRATION_ONLY} ${FTA_FMEA_TITLE} ${FTA_FMEA_AUTHENTICATION} ${FTA_FMEA_AUTH_SERVER_URL} ${FTA_FMEA_AUTH_CLIENT_ID}' < /etc/nginx/config.js.template > /usr/share/nginx/html/config.js

exec "$@"
