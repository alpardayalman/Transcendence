# apt-get install -y openssh-server sudo
# sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
# sed -i 's/#Port 22/Port 33333/' /etc/ssh/sshd_config
# service ssh restart
python /beta_test/manage.py migrate
python3 /beta_test/manage.py runserver 0.0.0.0:8000
# gunicorn transcendence.wsgi --bind 0.0.0.0:8000