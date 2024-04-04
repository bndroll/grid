#!/bin/bash

echo "please enter count of node replicas to down: "
read count

docker ps -a --filter ancestor=grid-node --filter status=running -n "$count" | xargs docker stop > /dev/null 2>&1
docker ps -a --filter ancestor=grid-node -n "$count" | xargs docker rm > /dev/null 2>&1
