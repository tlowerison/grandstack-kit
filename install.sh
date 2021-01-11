#!/bin/bash

DIR=$(dirname "$BASH_SOURCE")
cd "$DIR"
PROJECT_NAME=$(basename "$PWD")
DOMAIN_LINE=$(grep "DOMAIN=" server/README.md)
IFS="=" read -r -a DOMAIN_ARRAY <<< "$DOMAIN_LINE"
DOMAIN=${DOMAIN_ARRAY[1]}

NEW_PROJECT_NAME="$PROJECT_NAME"
NEW_DOMAIN="$DOMAIN"
NEW_IMAGE_REPO=""

while test $# -gt 0; do
  case "$1" in
    -h|--help)
      echo "grandstack-kit/install.sh [options]"
      echo "  -p, --project-name PROJECT_NAME     find and replace all instances of 'grandstack-kit' with PROJECT_NAME"
      echo "                                          if the current project-name is 'grandstack-kit' and a different"
      echo "                                          project-name is provided, will reset git tracking"
      echo ""
      echo "  -d, --domain DOMAIN                 find and replace all instances of 'grandstack-kit.com' with DOMAIN"
      echo ""
      echo "  -i, --image-repo IMAGE_REPO         find and replace all instances of 'grandstackkit' with IMAGE_REPO"
      exit 0
      ;;
    -p|--project-name)
      shift
      if test $# -gt 0; then
        NEW_PROJECT_NAME="$1"
        shift
      else
        echo "error: no project-name specified"
        exit 1
      fi
      ;;
    -d|--domain)
      shift
      if test $# -gt 0; then
        NEW_DOMAIN="$1"
        shift
      else
        echo "error: no domain specified"
        exit 1
      fi
      ;;
    -i|--image-repo)
      shift
      if test $# -gt 0; then
        NEW_IMAGE_REPO="$1"
        shift
      else
        echo "error: no image-repo specified"
        exit 1
      fi
      ;;
  esac
done

if [ "$PROJECT_NAME" = "grandstack-kit" ] && [ "$NEW_PROJECT_NAME" != "grandstack-kit" ]; then
  mv .git ~/.Trash/.git
fi

if [ "$NEW_DOMAIN" != "$DOMAIN" ]; then
  grep -R --exclude-dir=node_modules -rl "$DOMAIN" api/ | LC_ALL=C xargs sed -i "" "s/$DOMAIN/$NEW_DOMAIN/g"
  grep -R --exclude-dir=node_modules -rl "$DOMAIN" client/ | LC_ALL=C xargs sed -i "" "s/$DOMAIN/$NEW_DOMAIN/g"
  grep -R --exclude-dir=node_modules -rl "$DOMAIN" k8s/ | LC_ALL=C xargs sed -i "" "s/$DOMAIN/$NEW_DOMAIN/g"
  grep -R --exclude-dir=node_modules -rl "$DOMAIN" server/ | LC_ALL=C xargs sed -i "" "s/$DOMAIN/$NEW_DOMAIN/g"
fi

if [ "$NEW_IMAGE_REPO" != "" ]; then
  grep -R -rl "grandstackkit" k8s/ | LC_ALL=C xargs sed -i "" "s/grandstackkit/$NEW_IMAGE_REPO/g"
fi

if [ "$NEW_PROJECT_NAME" != "$PROJECT_NAME" ]; then
  grep -R --exclude-dir=node_modules -rl "$PROJECT_NAME" api/ | LC_ALL=C  xargs sed -i "" "s/$PROJECT_NAME/$NEW_PROJECT_NAME/g"
  grep -R --exclude-dir=node_modules -rl "$PROJECT_NAME" client/ | LC_ALL=C xargs sed -i "" "s/$PROJECT_NAME/$NEW_PROJECT_NAME/g"
  grep -R --exclude-dir=node_modules -rl "$PROJECT_NAME" k8s/ | LC_ALL=C xargs sed -i "" "s/$PROJECT_NAME/$NEW_PROJECT_NAME/g"
  grep -R --exclude-dir=node_modules -rl "$PROJECT_NAME" server/ | LC_ALL=C xargs sed -i "" "s/$PROJECT_NAME/$NEW_PROJECT_NAME/g"
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

if [ ! -d "server/redis-stable" ]; then
  cd server
  wget http://download.redis.io/redis-stable.tar.gz
  tar xvzf redis-stable.tar.gz
  cd redis-stable
  make
  cd ..
  rm redis-stable.tar.gz
  cd ..
fi

cd scripts
chmod u+x build-image.sh
chmod u+x publish-image.sh
chmod u+x start-image.sh
chmod u+x yield-image.sh
cd ../..

if [ "$NEW_PROJECT_NAME" != "$PROJECT_NAME" ]; then
  mv {$PROJECT_NAME,$NEW_PROJECT_NAME}
  cd "$NEW_PROJECT_NAME"
fi

if [ "$PROJECT_NAME" = "grandstack-kit" ] && [ "$NEW_PROJECT_NAME" != "grandstack-kit" ]; then
  git init
fi
