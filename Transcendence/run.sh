python3 manage.py collectstatic --noinput
python3 manage.py makemigrations
python3 manage.py migrate
export DJANGO_SETTINGS_MODULE=Transcendence.settings
uvicorn Transcendence.asgi:application --host 0.0.0.0 --port 8000