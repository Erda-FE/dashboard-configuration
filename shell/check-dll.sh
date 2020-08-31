#!/usr/bin/env bash

dll_file='./public/dll.js'

if [ -f "$dll_file" ]; then
  echo 'dll exist😁'
else
  echo 'dll not exist, start to generate'
  eval "npm run dll"
fi
