#!/bin/bash
# ./fixcss.sh
# Usage: ./fixcss.sh <file.css> <keep backup: 1 or 0>

# Lets fix some CSS
cat $1 | grep --quiet -i "\\\9" && {
  echo "CSS invalid, attempting to fix"
  rm $1.bak -f
  echo "Creating backup..."
  mv $1 $1.bak
  echo "Replacing invalid string..."
  cat $1.bak | sed -r s/\\\\9/\\\\9;/g | tee $1 1> /dev/null
  cat $1 | grep --quiet -i "\\\9" && {
    echo "CSS still invalid, sorry =/"
    echo "Replacing original file..."
    rm $1 -f
    mv $1.bak $1
  } || echo "Good to go =)"
  $2 || echo "Removing backup..." && rm $1.bak -f
} || echo "Not broken, don't worry about it"
