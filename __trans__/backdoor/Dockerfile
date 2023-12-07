FROM python:3.11.6-bullseye
RUN apt-get update -y && apt-get upgrade -y && apt-get update -y
# RUN apt-get install -y python3.11 python-pip
# RUN export PATH="/usr/local/bin/python3.11:$PATH"
WORKDIR /transcendence
COPY ./transcendence/ /transcendence
COPY ./requirements.txt /requirements.txt
COPY ./ssh.sh ssh.sh

RUN chmod +x manage.py

RUN pip install django
RUN pip install -r /requirements.txt
RUN pip install django-rest-swagger
RUN pip install gunicorn
RUN pip list
RUN python manage.py migrate
EXPOSE 6969

ENTRYPOINT ["/bin/bash", "ssh.sh"]
# CMD ["gunicorn", "transcendence.wsgi:application", "--bind", "0.0.0.0:6969"]