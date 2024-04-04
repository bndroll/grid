#!/bin/bash

if [ ! "$(docker network ls -q -f name=grid)" ]; then
    docker network create -d bridge grid
fi

PS3="please enter a command: "
commands=("adapter up" "node up" "distributor up" "hello" "quit")
select c in "${commands[@]}"
do
    case $c in
        "adapter up")
            ./commands/adapterup.sh
            ;;
        "node up")
            ./commands/nodeup.sh
            ;;
        "distributor up")
            ./commands/distributorup.sh
            ;;
        "hello")
            echo "hello from grid app"
            ;;
        "quit")
            break
            ;;
        *) echo "invalid option $REPLY";;
    esac
done
