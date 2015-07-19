#!/bin/bash
openssl genrsa -out ./certs/key.pem
openssl req -new -key ./certs/key.pem -out ./certs/csr.pem
openssl x509 -req -days 9999 -in ./certs/csr.pem -signkey ./certs/key.pem -out ./certs/cert.pem
rm ./certs/csr.pem
