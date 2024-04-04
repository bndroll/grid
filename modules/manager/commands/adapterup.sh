#!/bin/bash

docker build --tag 'adapter' ../adapter

if [ "$(docker ps -a -q -f name=adapter)" ]; then
    docker stop adapter
    docker rm adapter
fi

docker run --name adapter -p 0.0.0.0:4321:4321/tcp --restart=unless-stopped -d 'adapter'
