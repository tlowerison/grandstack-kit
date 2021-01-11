#!/bin/bash

DIR=$(dirname "$BASH_SOURCE")
cd "$DIR"
PREV_PROJECT_NAME=$(basename "$PWD")
DOMAIN_LINE=$(grep "DOMAIN=" server/README.md)
IFS="=" read -r -a DOMAIN_ARRAY <<< "$DOMAIN_LINE"
PREV_DOMAIN=${DOMAIN_ARRAY[1]}

PROJECT_NAME="$PREV_PROJECT_NAME"
DOMAIN="$PREV_DOMAIN"
IMAGE_REPO=""

while test $# -gt 0; do
  case "$1" in
    -h|--help)
      echo "grandstack-kit/install.sh [options]"
      echo "  -p, --project-name PROJECT_NAME     find and replace all instances of 'grandstack-kit' with PREV_PROJECT_NAME"
      echo "                                          if the current project-name is 'grandstack-kit' and a different"
      echo "                                          project-name is provided, will reset git tracking"
      echo ""
      echo "  -d, --domain DOMAIN                 find and replace all instances of 'grandstack-kit.com' with PREV_DOMAIN"
      echo ""
      echo "  -i, --image-repo IMAGE_REPO         find and replace all instances of 'grandstackkit' with PREV_IMAGE_REPO"
      exit 0
      ;;
    -p|--project-name)
      shift
      if test $# -gt 0; then
        PROJECT_NAME="$1"
        shift
      else
        echo "error: no project-name specified"
        exit 1
      fi
      ;;
    -d|--domain)
      shift
      if test $# -gt 0; then
        DOMAIN="$1"
        shift
      else
        echo "error: no domain specified"
        exit 1
      fi
      ;;
    -i|--image-repo)
      shift
      if test $# -gt 0; then
        IMAGE_REPO="$1"
        shift
      else
        echo "error: no image-repo specified"
        exit 1
      fi
      ;;
  esac
done

if [ "$PREV_PROJECT_NAME" = "grandstack-kit" ] && [ "$PROJECT_NAME" != "grandstack-kit" ]; then
  rm -rf .git
fi

if [ "$PROJECT_NAME" != "$PREV_PROJECT_NAME" ]; then
  cd ..
  mv {$PREV_PROJECT_NAME,$PROJECT_NAME}
  cd "$PROJECT_NAME"
fi

if [ "$DOMAIN" != "$PREV_DOMAIN" ]; then
  grep -R --exclude-dir=node_modules -rl "$PREV_DOMAIN" api/ | LC_ALL=C xargs sed -i "" "s/$PREV_DOMAIN/$DOMAIN/g"
  grep -R --exclude-dir=node_modules -rl "$PREV_DOMAIN" client/ | LC_ALL=C xargs sed -i "" "s/$PREV_DOMAIN/$DOMAIN/g"
  grep -R --exclude-dir=node_modules -rl "$PREV_DOMAIN" k8s/ | LC_ALL=C xargs sed -i "" "s/$PREV_DOMAIN/$DOMAIN/g"
  grep -R --exclude-dir=node_modules -rl "$PREV_DOMAIN" server/ | LC_ALL=C xargs sed -i "" "s/$PREV_DOMAIN/$DOMAIN/g"
fi

if [ "$IMAGE_REPO" != "" ]; then
  grep -R -rl "grandstackkit" k8s/ | LC_ALL=C xargs sed -i "" "s/grandstackkit/$IMAGE_REPO/g"
fi

if [ "$PROJECT_NAME" != "$PREV_PROJECT_NAME" ]; then
  grep -R --exclude-dir=node_modules -rl "$PREV_PROJECT_NAME" api/ | LC_ALL=C  xargs sed -i "" "s/$PREV_PROJECT_NAME/$PROJECT_NAME/g"
  grep -R --exclude-dir=node_modules -rl "$PREV_PROJECT_NAME" client/ | LC_ALL=C xargs sed -i "" "s/$PREV_PROJECT_NAME/$PROJECT_NAME/g"
  grep -R --exclude-dir=node_modules -rl "$PREV_PROJECT_NAME" k8s/ | LC_ALL=C xargs sed -i "" "s/$PREV_PROJECT_NAME/$PROJECT_NAME/g"
  grep -R --exclude-dir=node_modules -rl "$PREV_PROJECT_NAME" server/ | LC_ALL=C xargs sed -i "" "s/$PREV_PROJECT_NAME/$PROJECT_NAME/g"
fi

if [ ! -d "api/dist" ]; then
  cd api && yarn && yarn build && cd ..
fi

if [ ! -d "client/dist" ]; then
  cd client && yarn && yarn build && cd ..
fi

if [ ! -d "server/dist" ]; then
  cd server && yarn && yarn build && cd ..
fi

if [ ! -d "redis-stable" ]; then
  wget http://download.redis.io/redis-stable.tar.gz
  tar xvzf redis-stable.tar.gz
  rm redis-stable.tar.gz
  cd redis-stable
  make
  cd ..
fi

if [ -e "api/.env" ]; then
  grep "[A-Z_]*=" api/README.md > api/.env
fi

if [ -e "server/.env" ]; then
  grep "[A-Z_]*=" server/README.md > server/.env
fi

cd scripts
chmod u+x build-image.sh
chmod u+x publish-image.sh
chmod u+x start-image.sh
chmod u+x yield-image.sh
cd ../..

if [ "$PREV_PROJECT_NAME" = "grandstack-kit" ] && [ "$PROJECT_NAME" != "grandstack-kit" ]; then
  git init
fi
