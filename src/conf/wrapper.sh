#!/bin/bash

systemctl start api.service;

/usr/sbin/nginx -g 'daemon off;';
