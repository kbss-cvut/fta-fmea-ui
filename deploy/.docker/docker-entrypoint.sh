#!/usr/bin/env sh
set -eu

envsubst '${VITE_API_URL} ${VITE_ADMIN_REGISTRATION_ONLY} ${VITE_TITLE}' < /etc/nginx/config.js.template > /usr/share/nginx/html/config.js

exec "$@"