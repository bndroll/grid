#!/bin/bash

echo "please enter count of node replicas to up: "
read count

docker build --tag 'grid-node' ../node

for i in $(eval echo "{1..$count}")
do
    rnd=$(tr -dc a-z0-9 </dev/urandom | head -c 10; echo)
    docker run --name "$rnd" --restart=unless-stopped -d 'grid-node'
done
