#!/usr/bin/env bash
if [ $1 == "local" ]
then
  docker-compose build
  docker-compose up 
else 
  NODE_ENV=$1 npm start
fi

