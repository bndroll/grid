#!/bin/bash

PS3="please enter a command: "
commands=("adapter up" "distributor up" "node up" "node down" "hello" "quit")
select c in "${commands[@]}"
do
    case $c in
        "adapter up")
            ./commands/adapterup.sh
            ;;
        "distributor up")
            ./commands/distributorup.sh
            ;;
        "node up")
            ./commands/nodeup.sh
            ;;
        "node down")
            ./commands/nodedown.sh
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
