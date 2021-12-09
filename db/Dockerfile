FROM mariadb:10.5.11

# COPY ./db/mysql_init /docker-entrypoint-initdb.d
COPY ./db/mysql_conf/ /etc/mysql/conf.d

RUN usermod -u 1000 mysql && \
    mkdir -p /var/log/mysql && \
    chown mysql:root /var/log/mysql

