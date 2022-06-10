#!/usr/bin/env sh
set -eu

envsubst '${BASE_API_URL} ${REACT_APP_ADMIN_REGISTRATION_ONLY}' < /etc/nginx/config.js.template > /var/www/config.js

exec "$@"