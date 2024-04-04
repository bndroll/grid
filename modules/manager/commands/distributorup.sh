#!/bin/bash

echo "please enter a distributor name: "
read name

docker build --tag 'distributor' ../distributor

if [ "$(docker ps -a -q -f name=$name)" ]; then
    docker stop $name
    docker rm $name
fi

docker run --name $name --restart=on-failure -d 'distributor'
