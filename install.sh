#!/bin/bash
if [ "$1" = "" ]; then
  echo "Please provide a project name"
  exit 1
fi
if [ "$2" = "" ]; then
  echo "Please provide a domain name you own"
  exit 1
fi

DIR=$(dirname "$BASH_SOURCE")

cd "$DIR"

rm -rf .git

if [ "$3" != "" ]; then
  grep -rfl 'grandstackkit' k8s/ | xargs sed -i 's/registry.digitalocean.com/grandstack-kit/$3/g'
fi

grep -R --exclude-dir=node_modules -rl 'grandstack-kit' api/ | xargs sed -i "" "s/grandstack-kit/$1/g"
grep -R --exclude-dir=node_modules -rl 'grandstack-kit' client/ | xargs sed -i "" "s/grandstack-kit/$1/g"
grep -R --exclude-dir=node_modules -rl 'grandstack-kit' k8s/ | xargs sed -i "" "s/grandstack-kit/$1/g"
grep -R --exclude-dir=node_modules -rl 'grandstack-kit' server/ | xargs sed -i "" "s/grandstack-kit/$1/g"

grep -R --exclude-dir=node_modules -rl 'domain.com' api/ | xargs sed -i "" "s/domain.com/$2/g"
grep -R --exclude-dir=node_modules -rl 'domain.com' client/ | xargs sed -i "" "s/domain.com/$2/g"
grep -R --exclude-dir=node_modules -rl 'domain.com' k8s/ | xargs sed -i "" "s/domain.com/$2/g"
grep -R --exclude-dir=node_modules -rl 'domain.com' server/ | xargs sed -i "" "s/domain.com/$2/g"

(cd api && yarn && yarn build && cd ..)
(cd client && yarn && yarn build && cd ..)
(cd server && yarn && yarn build && cd ..)

cd server
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
cd ..
rm redis-stable.tar.gz
cd ..

cd scripts
chmod u+x build-image.sh
chmod u+x publish-image.sh
chmod u+x start-image.sh
chmod u+x yield-image.sh
cd ..

git init
cd ..

mv {$DIR,$1}
cd "$1"
