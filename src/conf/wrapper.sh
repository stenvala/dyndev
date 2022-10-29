#!/bin/bash

ls -la;

echo "Starting";

systemctl start api.service;

systemctl status api.service;

/usr/sbin/nginx -g 'daemon off;';

