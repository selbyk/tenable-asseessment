#!/bin/bash
# Run forever if it's installed, else start with node
iojs --use_strict --es_staging --harmony --harmony_modules --harmony_arrow_functions index.js
