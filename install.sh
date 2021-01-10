#!/bin/bash
rm -rf .git

if [ "$3" != "" ]; then
  grep -rfl 'grandstackkit' k8s/ | xargs sed -i 's/registry.digitalocean.com/grandstack-kit/$3/g'
fi

mv ../{grandstack-kit,$1}

grep -rl 'grandstack-kit' api/ | xargs sed -i "s/grandstack-kit/$1/g"
grep -rl 'grandstack-kit' client/ | xargs sed -i "s/grandstack-kit/$1/g"
grep -rl 'grandstack-kit' k8s/ | xargs sed -i "s/grandstack-kit/$1/g"
grep -rl 'grandstack-kit' server/ | xargs sed -i "s/grandstack-kit/$1/g"

grep -rl 'domain.com' api/ | xargs sed -i "s/domain.com/$2/g"
grep -rl 'domain.com' client/ | xargs sed -i "s/domain.com/$2/g"
grep -rl 'domain.com' k8s/ | xargs sed -i "s/domain.com/$2/g"
grep -rl 'domain.com' server/ | xargs sed -i "s/domain.com/$2/g"

cd api && yarn && yarn build && cd ..
cd client && yarn && yarn build && cd ..
cd server && yarn && yarn build && cd ..

cd server
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
cd ../..

cd scripts
chmod u+x build-image.sh
chmod u+x publish-image.sh
chmod u+x start-image.sh
chmod u+x yield-image.sh
cd ..

git init
