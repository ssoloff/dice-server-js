.PHONY: acceptance-test all build check clean docs start-app stop-app unit-test

CAT = cat
CSSLINT = csslint
CUCUMBER = cucumber.js
ECHO = echo
FIND = find
HTML_VALIDATOR = html-validator
JASMINE = jasmine
JISON = jison
JSCS = jscs
JSDOC = jsdoc
JSHINT = jshint
KILL = kill
NODE = node
RM = rm -f
RMDIR = $(RM) -r
XARGS = xargs

JSDOC_OUTPUT_DIR = out
PUBLIC_DIR = public
SRC_DIR = lib
STYLES_DIR = $(PUBLIC_DIR)/styles

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

web-lint:
	$(FIND) $(PUBLIC_DIR) -name "*.html" | $(XARGS) -I {} $(HTML_VALIDATOR) --file={}
	$(CSSLINT) $(STYLES_DIR)

$(DICE_EXPRESSION_PARSER_JS): $(DICE_EXPRESSION_JISON)
	$(JISON) $< -o $@

