#!/bin/bash
SCRIPTS=$(cd $PWD && cd .. && echo "$PWD/scripts")
IMAGE=$($SCRIPTS/yield-image.sh)
jq -r '{ dependencies: (.dependencies // {}), peerDependencies: (.peerDependencies // {}), devDependencies: (.devDependencies // {}) }' package.json > dependencies.json
echo "docker build -t $IMAGE ."
docker build -t "$IMAGE" .;
rm dependencies.json
