.PHONY: acceptance-test all build check clean coverage dist docs init publish-coverage start-app stop-app unit-test

BOWER = $(NODE_MODULES_BIN_DIR)/bower
CAT = cat
COVERALLS = $(NODE_MODULES_BIN_DIR)/coveralls
CP = cp -r
CSSLINT = $(NODE_MODULES_BIN_DIR)/csslint
CUCUMBER = $(NODE_MODULES_BIN_DIR)/cucumber-js
ECHO = echo
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
MKDIR = mkdir -p
NODE = node
NPM = npm
RM = rm -f
RMDIR = $(RM) -r
TEE = tee
TEST = test
XARGS = xargs

APP_DIR = app
BOWER_COMPONENTS_DIR = bower_components
DIST_DIR = dist
FEATURES_DIR = features
ISTANBUL_OUTPUT_DIR = coverage
JSDOC_OUTPUT_DIR = out
NODE_MODULES_BIN_DIR = node_modules/.bin
PUBLIC_DIR = public
SCRIPTS_DIR = $(PUBLIC_DIR)/scripts
SRC_DIR = lib
STYLES_DIR = $(PUBLIC_DIR)/styles
TEST_DIR = test

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

build: $(DICE_EXPRESSION_PARSER_JS)

check: build
	$(JSHINT) .
	$(JSCS) .
	$(FIND) $(PUBLIC_DIR) -name "*.html" | $(XARGS) -I {} $(HTML_VALIDATOR) --file={} | $(TEE) /dev/tty | { $(GREP) -q -E "^(Error|Warning):"; $(TEST) $$? -eq 1; }
	$(CSSLINT) $(STYLES_DIR)

clean:
	$(RM) $(DICE_EXPRESSION_PARSER_JS)
	$(RMDIR) $(ISTANBUL_OUTPUT_DIR)
	$(RMDIR) $(JSDOC_OUTPUT_DIR)
	$(RMDIR) $(DIST_DIR)

coverage:
	$(ISTANBUL) cover $(JASMINE) --captureExceptions

dist:
	$(RMDIR) $(DIST_DIR)
	$(MKDIR) $(DIST_DIR)
	$(CP) $(SERVER_JS) $(SRC_DIR) $(APP_DIR) $(PUBLIC_DIR) $(DIST_DIR)
	$(CP) $(BOWER_COMPONENTS_DIR)/jquery/dist/jquery.min.js $(DIST_DIR)/$(SCRIPTS_DIR)/jquery.js
	$(CP) $(BOWER_COMPONENTS_DIR)/reset-css/reset.css $(DIST_DIR)/$(STYLES_DIR)

docs:
	$(JSDOC) -c $(JSDOC_CONFIG)

init:
	$(NPM) install
	$(BOWER) install

publish-coverage:
	$(CAT) $(ISTANBUL_OUTPUT_DIR)/lcov.info | $(COVERALLS)

start-server:
	$(NODE) $(DIST_DIR)/$(SERVER_JS) $(TEST_PRIVATE_KEY) $(TEST_PUBLIC_KEY) & $(ECHO) $$! > $(SERVER_PID)

stop-server:
	$(eval PID := $(shell $(CAT) $(SERVER_PID)))
	$(KILL) $(PID)
	$(RM) $(SERVER_PID)

unit-test: build
	$(JASMINE)

$(DICE_EXPRESSION_PARSER_JS): $(DICE_EXPRESSION_JISON)
	$(JISON) $< -o $@

