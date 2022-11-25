FROM python:3.10

RUN apt-get update
RUN apt-get -y install nginx
RUN apt-get -y install systemctl

# Install backend
WORKDIR /backend
COPY ./requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade -r /backend/requirements.txt
RUN mkdir /backend/api
COPY ./api /backend/api
COPY ./shared /backend/shared
COPY ./dto /backend/dto
COPY ./handler_api.py /backend/handler_api.py
COPY ./conf/api.service /etc/systemd/system/api.service
RUN systemctl enable api.service

# Install frontend
WORKDIR /ui
COPY ./ui/dist/app ./

# Configure nginx
COPY ./conf/nginx /etc/nginx/sites-available/default

RUN nginx -t

RUN chown www-data:www-data -R /backend

COPY ./conf/wrapper.sh /var/wrapper.sh
RUN chmod 755 /var/wrapper.sh

EXPOSE 80/tcp

WORKDIR /var/log/journal
CMD ["/var/wrapper.sh"]

