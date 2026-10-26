# Página estática servida pelo nginx (usado no deploy pelo Easypanel).
# Só entram os arquivos públicos: docs/ e COMO-USAR.html ficam de fora.
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY index.html config.js /usr/share/nginx/html/
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY assets /usr/share/nginx/html/assets

EXPOSE 80
