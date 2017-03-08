#!/bin/bash

[ -z "$HOST" ] && HOST=app.local.corva.ai
export HOST=$HOST
export PORT=80

react-scripts start
