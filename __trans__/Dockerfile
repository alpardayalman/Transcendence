FROM python:3.11.6-bullseye
RUN apt-get update -y && apt-get upgrade -y && apt-get update -y
# RUN apt-get install -y python3.11 python-pip
# RUN export PATH="/usr/local/bin/python3.11:$PATH"
COPY ./transcendence /transcendence
WORKDIR /transcendence
COPY ./requirements.txt /requirements.txt
COPY ./start.sh ./start.sh

RUN chmod +x manage.py

RUN pip install -r /requirements.txt
RUN pip list
RUN python manage.py migrate
EXPOSE 8000

ENTRYPOINT ["/bin/bash", "start.sh"]
# CMD ["gunicorn", "transcendence.wsgi:application", "--bind", "0.0.0.0:6969"]