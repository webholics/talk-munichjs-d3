#!/bin/sh

BASEDIR=$(dirname $0)

open "http://localhost:8888/shells/onstage.html#../index.html"
cd BASEDIR
python -m SimpleHTTPServer 8888