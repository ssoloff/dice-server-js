.PHONY: acceptance-test all build check clean coverage docs init publish-coverage start-app stop-app unit-test

BOWER = $(NODE_MODULES_BIN_DIR)/bower
CAT = cat
CD = cd
COVERALLS = $(NODE_MODULES_BIN_DIR)/coveralls
CSSLINT = $(NODE_MODULES_BIN_DIR)/csslint
CUCUMBER = $(NODE_MODULES_BIN_DIR)/cucumber-js
ECHO = echo
EMBER = $(NODE_MODULES_BIN_DIR)/ember
FIND = find
GREP = grep
HTML_VALIDATOR = $(NODE_MODULES_BIN_DIR)/html-validator
ISTANBUL = $(NODE_MODULES_BIN_DIR)/istanbul
JASMINE = $(NODE_MODULES_BIN_DIR)/jasmine
JISON = $(NODE_MODULES_BIN_DIR)/jison
JSCS = $(NODE_MODULES_BIN_DIR)/jscs
JSDOC = $(NODE_MODULES_BIN_DIR)/jsdoc
JSHINT = $(NODE_MODULES_BIN_DIR)/jshint
KILL = kill
NODE = node
NPM = npm
RM = rm -f
RMDIR = $(RM) -r
TEE = tee
TEST = test
XARGS = xargs

FEATURES_DIR = features
ISTANBUL_OUTPUT_DIR = coverage
JSDOC_OUTPUT_DIR = out
NODE_MODULES_BIN_DIR = node_modules/.bin
PUBLIC_DIR = public
# TODO: replace PUBLIC_TEST_DIR with PUBLIC_DIR when Ember UI complete
PUBLIC_TEST_DIR = public-test
SRC_DIR = lib
STYLES_DIR = $(PUBLIC_DIR)/styles
TEST_DIR = test
UI_DIR = ui

DICE_EXPRESSION_JISON = $(SRC_DIR)/dice-expression.jison
DICE_EXPRESSION_PARSER_JS = $(SRC_DIR)/dice-expression-parser.js
JSDOC_CONFIG = jsdoc-conf.json
SERVER_JS = server.js
SERVER_PID = server.pid
TEST_PRIVATE_KEY = $(TEST_DIR)/private-key.pem
TEST_PUBLIC_KEY = $(TEST_DIR)/public-key.pem

all: build check unit-test

acceptance-test:
	for dir in $(FEATURES_DIR)/services/*/; \
	do \
		[[ $$dir == $(FEATURES_DIR)/services/support/ ]] && continue; \
		$(CUCUMBER) $$dir || exit $$?; \
	done
	$(CUCUMBER) $(FEATURES_DIR)/ui

build: $(DICE_EXPRESSION_PARSER_JS) $(PUBLIC_TEST_DIR)

check: build
	$(JSHINT) .
	$(JSCS) .
	$(FIND) $(PUBLIC_DIR) -name "*.html" | $(XARGS) -I {} $(HTML_VALIDATOR) --file={} | $(TEE) /dev/tty | { $(GREP) -q -E "^(Error|Warning):"; $(TEST) $$? -eq 1; }
	$(CSSLINT) $(STYLES_DIR)

clean:
	$(RM) $(DICE_EXPRESSION_PARSER_JS)
	$(RMDIR) $(ISTANBUL_OUTPUT_DIR)
	$(RMDIR) $(JSDOC_OUTPUT_DIR)
	$(RMDIR) $(PUBLIC_TEST_DIR)

coverage:
	$(ISTANBUL) cover $(JASMINE) --captureExceptions

docs:
	$(JSDOC) -c $(JSDOC_CONFIG)

init:
	$(NPM) install
	$(CD) $(UI_DIR); $(NPM) install; $(BOWER) install

publish-coverage:
	$(CAT) $(ISTANBUL_OUTPUT_DIR)/lcov.info | $(COVERALLS)

start-server:
	$(NODE) $(SERVER_JS) $(TEST_PRIVATE_KEY) $(TEST_PUBLIC_KEY) & $(ECHO) $$! > $(SERVER_PID)

stop-server:
	$(eval PID := $(shell $(CAT) $(SERVER_PID)))
	$(KILL) $(PID)
	$(RM) $(SERVER_PID)

unit-test: build
	$(JASMINE)
	$(CD) $(UI_DIR); $(EMBER) test

$(DICE_EXPRESSION_PARSER_JS): $(DICE_EXPRESSION_JISON)
	$(JISON) $< -o $@

$(PUBLIC_TEST_DIR): $(shell find $(UI_DIR)/app $(UI_DIR)/public)
	$(CD) $(UI_DIR); $(EMBER) build --environment=production --output-path=../$(PUBLIC_TEST_DIR)

