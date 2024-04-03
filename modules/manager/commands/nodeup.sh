#!/bin/bash

echo "please enter a node name: "
read name

docker build --tag 'grid-node' ../node

if [ "$(docker ps -a -q -f name=$name)" ]; then
    docker stop $name
    docker rm $name
fi

docker run --name $name --restart=unless-stopped -d 'grid-node'
