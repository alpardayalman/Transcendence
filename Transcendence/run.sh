python3 manage.py collectstatic --noinput
python3 manage.py makemigrations
python3 manage.py migrate
# gunicorn Transcendence.wsgi:application --bind 0.0.0.0:8000
# python3 manage.py runserver
daphne Transcendence.asgi:application --bind 0.0.0.0 --port 8000
# django-admin runserver
