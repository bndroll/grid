#!/bin/bash

echo "please enter count of adapter replicas to down: "
read count

docker ps -a --filter ancestor=adapter --filter status=running -n "$count" | xargs docker stop > /dev/null 2>&1
docker ps -a --filter ancestor=adapter -n "$count" | xargs docker rm > /dev/null 2>&1
