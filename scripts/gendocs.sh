#!/bin/bash
# ./gendocs.sh
# Usage: ./gendocs.sh <swagger.json> <target_dir>

# Gets directory script is running from
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
# Generate Docs
bootprint swagger $1 $2
# Fix invalid CSS
#$DIR/fixcss.sh $2/main.css
