FROM postgres:13

# Veritabanı adını ve kullanıcı adını ayarla
ENV POSTGRES_HOST_AUTH_METHOD=trust

EXPOSE 5432

RUN pg_createcluster 13 main --start
RUN service postgresql start

