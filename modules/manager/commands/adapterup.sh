#!/bin/bash

echo "please enter count of adapter replicas to up (1-5): "
read -r count

docker build --tag 'adapter' ../adapter &>/dev/null

START_PORT=8010
END_PORT=8014

function find_unused_port {
  for ((port = START_PORT; port < END_PORT + 1; port++)); do
    if ! docker ps -a --filter "expose=$port/tcp" | grep -q "$port"; then
      echo "$port"
      return
    fi
  done

  echo "No ports available in the range $START_PORT-$END_PORT" >&2
  return 1
}

if [ "$(docker ps -a --filter name=db --filter status=running | wc -l)" -eq 1 ]; then
  docker-compose -f ../infrastructure/docker-compose.yml up db -d --build
fi

if [ "$(docker ps -a --filter name=proxy --filter status=running | wc -l)" -eq 1 ]; then
  docker-compose -f ../infrastructure/docker-compose.yml up proxy -d --build
fi

for i in $(eval echo "{1..$count}"); do
  PORT=$(find_unused_port)

  if [ -n "$PORT" ]; then
      rnd=$(tr -dc a-z0-9 </dev/urandom | head -c 10; echo)
      docker run --name "$rnd" --restart=unless-stopped -p "$PORT":"$PORT" --env APP_PORT="$PORT" -d 'adapter' &>/dev/null
      echo "Started new instance on port $PORT"
  else
      echo "Failed to start new instance: No available ports"
      exit 1
  fi
done

