#!/bin/bash
testing="User logout"
regex=".*Status:([0-9]+)!:!.*"
response=$(curl --write-out "Status:%{http_code}!:!\n" --header "Authorization: Bearer $AUTH" "localhost:4443/auth/revoke")
[[ $response =~ $regex ]]
status="${BASH_REMATCH[1]}"
TEST_TESULT=0

if [ "$status" -eq "200" ]
then
  TEST_TESULT=1
else
  TEST_TESULT=0
fi
