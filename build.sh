#!/bin/bash

rebuild=0
no_cache=0

while getopts "rc" opt; do
  case $opt in
    r)
      rebuild=1
      ;;
    c)
      no_cache=1
      ;;
  esac
done

echo $language

if [ -f "runner.tar" ] && [ $rebuild -eq 0 ]; then
  echo "Skipping runner rebuild"
else
  echo "Building runner image"
  (cd runner && make image)

  echo "Creating runner.tar"
  docker save runner > runner.tar
fi

echo "Building image"
docker build \
  -t labox \
  `if [ $no_cache -eq 1 ]; then echo "--no-cache"; fi` \
  .
