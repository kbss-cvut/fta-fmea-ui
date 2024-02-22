#!/usr/bin/env sh
set -eu

envsubst '${API_URL} ${ADMIN_REGISTRATION_ONLY} ${TITLE}' < /etc/nginx/config.js.template > /usr/share/nginx/html/config.js

exec "$@"