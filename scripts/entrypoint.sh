#!/bin/sh

# start dockerd
dockerd > /var/log/dockerd.log 2>&1 &

# execute cmd
exec "$@"
