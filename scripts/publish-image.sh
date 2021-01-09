#!/bin/bash
SCRIPTS=$(cd $PWD && cd .. && echo "$PWD/scripts")
source "$SCRIPTS/.env"
IMAGE=$($SCRIPTS/yield-image.sh)
echo "docker tag $IMAGE $REGISTRY/$IMAGE && docker push $REGISTRY/$IMAGE"
docker tag "$IMAGE" "$REGISTRY/$IMAGE" && docker push "$REGISTRY/$IMAGE"
