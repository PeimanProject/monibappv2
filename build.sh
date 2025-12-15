#!/bin/bash 

echo "Build!"

git stash
git pull
yarn
yarn build
pm2 restart ecosystem.config.js