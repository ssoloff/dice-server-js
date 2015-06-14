.PHONY: all check docs test

all: check docs test

check:
	jshint .
	jscs **/*.js

docs:
	jsdoc -c jsdoc-conf.json

test:
	jasmine

