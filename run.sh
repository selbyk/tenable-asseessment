#!/bin/bash
# Run forever if it's installed, else start with node
command -v forever >/dev/null 2>&1 && forever -w index.js --harmony || node index.js --harmony
