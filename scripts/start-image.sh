#!/bin/bash
SCRIPTS=$(cd $PWD && cd .. && echo "$PWD/scripts")
IMAGE=$($SCRIPTS/yield-image.sh)
source .env
echo "docker run -t -i --env-file .env -p $PORT:$PORT $IMAGE"
docker run -t -i --env-file .env -p "$PORT:$PORT" "$IMAGE"
