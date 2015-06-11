.PHONY: all check test

all: check test

check:
	jshint .
	jscs **/*.js

test:
	jasmine

