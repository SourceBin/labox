#!/bin/sh

echo "Starting dockerd"
dockerd > /var/log/dockerd.log 2>&1 &

while ! docker info > /dev/null 2>&1; do
  echo "Waiting for docker daemon to start..."
  sleep 0.1
done

echo "Loading runner"
docker load --input runner.tar
rm runner.tar

echo "Cleaning up dockerd"
kill $(cat /var/run/docker.pid)
kill $(cat /run/docker/containerd/containerd.pid)
rm -f /var/run/docker.pid
rm -f /run/docker/containerd/containerd.pid

echo "Finished runner setup"
