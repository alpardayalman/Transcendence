python3 manage.py collectstatic --noinput
python3 manage.py makemigrations
python3 manage.py migrate
gunicorn Transcendence.wsgi:application --bind 0.0.0.0:8000