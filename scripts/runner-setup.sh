#!/bin/sh

language=$1

echo "Starting dockerd"
dockerd > /var/log/dockerd.log 2>&1 &

while ! docker info > /dev/null 2>&1; do
  echo "Waiting for docker daemon to start..."
  sleep 0.1
done

echo "Installing make"
apk add --no-cache make

echo "Building runner"
if [ -z $language ]; then
  make image
else
  make image-$language
fi

echo "Removing make"
apk del make

echo "Cleaning up docker images"
docker rmi node:alpine alpine:3
docker image prune -f

echo "Cleaning up dockerd"
kill $(cat /var/run/docker.pid)
kill $(cat /run/docker/containerd/containerd.pid)
rm -f /var/run/docker.pid
rm -f /run/docker/containerd/containerd.pid

echo "Removing all build files"
rm -r *

echo "Finished runner setup"
