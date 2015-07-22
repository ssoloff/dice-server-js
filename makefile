.PHONY: acceptance-test all build check clean coverage docs publish-coverage start-app stop-app unit-test

CAT = cat
COVERALLS = node_modules/coveralls/bin/coveralls.js
CSSLINT = csslint
CUCUMBER = cucumber.js
ECHO = echo
FIND = find
GREP = grep
HTML_VALIDATOR = html-validator
ISTANBUL = istanbul
JASMINE = jasmine
JISON = jison
JSCS = jscs
JSDOC = node_modules/.bin/jsdoc
JSHINT = jshint
KILL = kill
NODE = node
RM = rm -f
RMDIR = $(RM) -r
TEE = tee
TEST = test
XARGS = xargs

ISTANBUL_OUTPUT_DIR = coverage
JSDOC_OUTPUT_DIR = out
PUBLIC_DIR = public
SRC_DIR = lib
STYLES_DIR = $(PUBLIC_DIR)/styles
TEST_DIR = test

APP_JS = app.js
APP_PID = app.pid
DICE_EXPRESSION_JISON = $(SRC_DIR)/dice-expression.jison
DICE_EXPRESSION_PARSER_JS = $(SRC_DIR)/dice-expression-parser.js
JSDOC_CONFIG = jsdoc-conf.json
TEST_PRIVATE_KEY = $(TEST_DIR)/private-key.pem
TEST_PUBLIC_KEY = $(TEST_DIR)/public-key.pem

all: build check unit-test

acceptance-test:
	$(CUCUMBER)

build: $(DICE_EXPRESSION_PARSER_JS)

check: build
	$(JSHINT) .
	$(JSCS) .

clean:
	$(RM) $(DICE_EXPRESSION_PARSER_JS)
	$(RMDIR) $(ISTANBUL_OUTPUT_DIR)
	$(RMDIR) $(JSDOC_OUTPUT_DIR)

coverage:
	$(ISTANBUL) cover $(JASMINE) --captureExceptions

docs:
	$(JSDOC) -c $(JSDOC_CONFIG)

publish-coverage:
	$(CAT) $(ISTANBUL_OUTPUT_DIR)/lcov.info | $(COVERALLS)

start-app:
	$(NODE) $(APP_JS) $(TEST_PRIVATE_KEY) $(TEST_PUBLIC_KEY) & $(ECHO) $$! > $(APP_PID)

stop-app:
	$(eval PID := $(shell $(CAT) $(APP_PID)))
	$(KILL) $(PID)
	$(RM) $(APP_PID)

unit-test: build
	$(JASMINE)

web-lint:
	$(FIND) $(PUBLIC_DIR) -name "*.html" | $(XARGS) -I {} $(HTML_VALIDATOR) --file={} | $(TEE) /dev/tty | { $(GREP) -q -E "^(Error|Warning):"; $(TEST) $$? -eq 1; }
	$(CSSLINT) $(STYLES_DIR)

$(DICE_EXPRESSION_PARSER_JS): $(DICE_EXPRESSION_JISON)
	$(JISON) $< -o $@

