#!/bin/bash
testing="User Login"
regex=".*Status:([0-9]+)!:!.*"
response=$(curl --write-out "Status:%{http_code}!:!\n" "localhost:4443/auth/identify" --data '{ "credentials":{"username":"selby.kendrick","password":"thisisntsecure"} }')
[[ $response =~ $regex ]]
status="${BASH_REMATCH[1]}"
TEST_TESULT=0

if [ "$status" -eq "200" ]
then
  regex=".*token\":\"(.+)\"}.*"
  [[ $response =~ $regex ]]
  TEST_TESULT="${BASH_REMATCH[1]}"
else
  TEST_TESULT=0
fi
