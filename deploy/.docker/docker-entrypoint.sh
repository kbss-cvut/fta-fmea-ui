#!/usr/bin/env sh
set -eu

envsubst '${FTA_FMEA_BASENAME} ${FTA_FMEA_API_URL} ${FTA_FMEA_ADMIN_REGISTRATION_ONLY} ${FTA_FMEA_TITLE}' < /etc/nginx/config.js.template > /usr/share/nginx/html/config.js

exec "$@"
