FROM postgres:13

# Veritabanı adını ve kullanıcı adını ayarla
ENV POSTGRES_DB=postgres
ENV POSTGRES_USER=admini
ENV POSTGRES_PASSWORD=mypass
ENV POSTGRES_HOST_AUTH_METHOD=trust

# Docker imajı oluşturulduğunda çalıştırılacak SQL dosyalarını kopyala

# PostgreSQL'in varsayılan bağlantı noktası
EXPOSE 5432

RUN pg_createcluster 13 main --start
RUN service postgresql start

