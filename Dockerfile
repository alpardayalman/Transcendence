FROM nginx:latest
RUN apt-get update -y && apt-get upgrade -y && apt-get update -y
# COPY ./Transcendence /Transcendence
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /static
COPY ./index.html /static/
# COPY ./requirements.txt /requirements.txt

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]