.PHONY: acceptance-test all build check clean docs start-app stop-app unit-test

CAT = cat
CUCUMBER = cucumber.js
ECHO = echo
JASMINE = jasmine
JISON = jison
JSCS = jscs
JSDOC = jsdoc
JSHINT = jshint
KILL = kill
NODE = node
RM = rm -f
RMDIR = $(RM) -r

JSDOC_OUTPUT_DIR = out
SRC_DIR = lib

APP_JS = app.js
APP_PID = app.pid
DICE_EXPRESSION_JISON = $(SRC_DIR)/dice-expression.jison
DICE_EXPRESSION_PARSER_JS = $(SRC_DIR)/dice-expression-parser.js
JSDOC_CONFIG = jsdoc-conf.json

all: build check unit-test docs

acceptance-test:
	$(CUCUMBER)

build: $(DICE_EXPRESSION_PARSER_JS)

check: build
	$(JSHINT) .
	$(JSCS) .

clean:
	$(RM) $(DICE_EXPRESSION_PARSER_JS)
	$(RMDIR) $(JSDOC_OUTPUT_DIR)

docs:
	$(JSDOC) -c $(JSDOC_CONFIG)

start-app:
	$(NODE) $(APP_JS) & $(ECHO) $$! > $(APP_PID)

stop-app:
	$(eval PID := $(shell $(CAT) $(APP_PID)))
	$(KILL) $(PID)
	$(RM) $(APP_PID)

unit-test: build
	$(JASMINE)

$(DICE_EXPRESSION_PARSER_JS): $(DICE_EXPRESSION_JISON)
	$(JISON) $< -o $@

