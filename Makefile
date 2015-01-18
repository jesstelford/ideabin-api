# node modules in executable path
PATH := node_modules/.bin:$(PATH)

# OSX requires this variable exported so that PATH is also exported.
SHELL := /bin/bash

# directories used throught targets
test_dir            := test


# These targets don't produce any output
.PHONY: test lint

# first / default target to perform all other targets
all: test

test:
	@mocha --recursive $(test_dir)

generate-certs:
	@openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -nodes -days 365
	@echo "Generated private key key.pem, and certificate cert.pem"

lint:
	@eslint --ignore-path .gitignore ./
