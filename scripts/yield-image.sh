#!/bin/bash
echo $(jq -r '.name' package.json | ack -o '((?<=/)([A-z0-9_\-\/]*)|(^[A-z0-9_\-][A-z0-9_\-\/]*))'):$(jq -r '.version' package.json)
