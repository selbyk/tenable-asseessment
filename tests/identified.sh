#!/bin/bash
testing="Are we authenticated?"
regex=".*Status:([0-9]+)!:!.*"
response=$(curl --write-out "Status:%{http_code}!:!\n" --header "Authorization: Bearer $AUTH" "localhost:4443/auth/me")
[[ $response =~ $regex ]]
status="${BASH_REMATCH[1]}"
TEST_TESULT=0

if [ "$status" == "200" ]
then
  regex=".*username\":\"(.+)[^\"].*"
  [[ $response =~ $regex ]]
  TEST_TESULT="${BASH_REMATCH[1]}"
else
  TEST_TESULT=0
fi
