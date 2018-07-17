#!/usr/bin/env bash

docker rm -f VIBES
docker rmi -f vibes
docker build -t vibes .
docker run --name VIBES -d -p 3010:3010 -p 8282:8282 -p 8383:8383 vibes