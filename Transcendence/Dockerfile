FROM ubuntu:latest
WORKDIR /usr/src/app
RUN apt-get update && apt-get upgrade -y
RUN apt-get install python3 -y
RUN apt-get install pip -y
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN python3 -m pip install --upgrade pip
COPY ./requirements.txt .
RUN python3 -m pip install -r requirements.txt
COPY . .