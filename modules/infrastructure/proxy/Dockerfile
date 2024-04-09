FROM nginx:1.13
COPY ./proxy/nginx.conf /etc/nginx/nginx.conf
COPY ./proxy/adapter.conf.template /etc/nginx/conf.d/adapter.conf.template
EXPOSE 80
CMD ["envsubst < /etc/nginx/conf.d/adapter.conf.template", ">", "/etc/nginx/conf.d/default.conf", "&&", "nginx", "-g", "daemon off;"]
