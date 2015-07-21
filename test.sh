#!/bin/bash
chmod +x -R ./tests
# Reset
Color_Off='\e[0m'       # Text Reset
Red='\e[0;31m'          # Red
Green='\e[0;32m'        # Green

username=selby.kendrick
password=thisisntsecure
AUTH=''

  ok () { printf "[$Green  OK  $Color_Off].... $testing\n"; }
fail () { printf "[$Red FAIL $Color_Off].... $testing\n"; }

. ./tests/login.sh
if [ "$TEST_TESULT" != "0" ]
then
  ok
  AUTH=$TEST_TESULT
else
  fail
fi

sleep 1

. ./tests/identified.sh
if [ "$TEST_TESULT" != "0" ]
then
  ok
else
  fail
fi

sleep 1

. ./tests/logout.sh
if [ "$TEST_TESULT" != "0" ]
then
  ok
else
  fail
fi


sleep 1

. ./tests/identified.sh
if [ "$TEST_TESULT" != "0" ]
then
  ok
else
  fail
fi
