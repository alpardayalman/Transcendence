FROM postgres:13

ENV POSTGRES_DB=postgres
ENV POSTGRES_USER=admini
ENV POSTGRES_PASSWORD=mypass
ENV POSTGRES_HOST_AUTH_METHOD=trust

EXPOSE 5432

RUN pg_createcluster 13 main --start
RUN service postgresql start
