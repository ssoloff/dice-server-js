.PHONY: \
	acceptance-test \
	check \
	clean \
	compile \
	compile-jison \
	compile-js \
	dist \
	docs \
	init \
	publish-coverage \
	start-server \
	stop-server \
	unit-test \
	unit-test-with-coverage

BOWER = $(NODE_MODULES_BIN_DIR)/bower
CAT = cat
COVERALLS = $(NODE_MODULES_BIN_DIR)/coveralls
CP = cp -r
CSSLINT = $(NODE_MODULES_BIN_DIR)/csslint
CUCUMBER = $(NODE_MODULES_BIN_DIR)/cucumber-js
ECHO = echo
FIND = find
HTML_VALIDATOR = $(NODE_MODULES_BIN_DIR)/html-validator
ISTANBUL = $(NODE_MODULES_BIN_DIR)/istanbul --config=$(ISTANBUL_CONFIG)
JASMINE = $(NODE_MODULES_BIN_DIR)/jasmine JASMINE_CONFIG_PATH=$(JASMINE_CONFIG)
JISON = $(NODE_MODULES_BIN_DIR)/jison
JSCS = $(NODE_MODULES_BIN_DIR)/jscs
JSDOC = $(NODE_MODULES_BIN_DIR)/jsdoc
JSHINT = $(NODE_MODULES_BIN_DIR)/jshint
KILL = kill
MKDIR = mkdir -p
MKTEMP = mktemp
NODE = node
NPM = npm
RM = rm -f
RMDIR = $(RM) -r
RSYNC = rsync -r --prune-empty-dirs
SH = sh
TEST = test
XARGS = xargs

BOWER_COMPONENTS_DIR = bower_components
BUILD_OUTPUT_DIR = build
CLIENT_SRC_DIR = $(SRC_DIR)/client
COMPILE_OUTPUT_DIR = $(BUILD_OUTPUT_DIR)/compile
COVERAGE_OUTPUT_DIR = $(BUILD_OUTPUT_DIR)/coverage
CSS_DIR = $(PUBLIC_DIR)/css
DIST_OUTPUT_DIR = $(BUILD_OUTPUT_DIR)/dist
FEATURES_DIR = features
HTML_DIR = $(PUBLIC_DIR)
JS_DIR = $(PUBLIC_DIR)/js
JS_VENDOR_DIR = $(JS_DIR)/vendor
MODEL_DIR = $(SERVER_SRC_DIR)/model
NODE_MODULES_BIN_DIR = node_modules/.bin
PUBLIC_DIR = public
SERVER_SRC_DIR = $(SRC_DIR)/server
SERVER_TEST_DIR = $(TEST_DIR)/server
SRC_DIR = src
TEST_DIR = test

DICE_EXPRESSION_JISON = $(MODEL_DIR)/dice-expression.jison
DICE_EXPRESSION_PARSER_JS = $(COMPILE_OUTPUT_DIR)/$(MODEL_DIR)/dice-expression-parser.js
ISTANBUL_CONFIG = $(COMPILE_OUTPUT_DIR)/$(SERVER_TEST_DIR)/.istanbul.yml
JASMINE_CONFIG = $(COMPILE_OUTPUT_DIR)/$(SERVER_TEST_DIR)/.jasmine.json
JSCS_ES5_CONFIG = .jscs-es5-conf.json
JSCS_ES6_CONFIG = .jscs-es6-conf.json
JSDOC_CLIENT_CONFIG = .jsdoc-client-conf.json
JSDOC_SERVER_CONFIG = .jsdoc-server-conf.json
SERVER_JS = server.js
SERVER_PID = server.pid
TEST_PRIVATE_KEY = $(SERVER_TEST_DIR)/test-keys/private-key.pem
TEST_PUBLIC_KEY = $(SERVER_TEST_DIR)/test-keys/public-key.pem

acceptance-test:
	for dir in $(FEATURES_DIR)/server/*/; \
	do \
		[ "$$dir" = $(FEATURES_DIR)/server/support/ ] && continue; \
		$(CUCUMBER) $$dir || exit $$?; \
	done
	for dir in $(FEATURES_DIR)/client/*/; \
	do \
		[ "$$dir" = $(FEATURES_DIR)/client/support/ ] && continue; \
		$(CUCUMBER) $$dir || exit $$?; \
	done

check:
	$(JSHINT) .
	$(JSCS) $(CLIENT_SRC_DIR) --config=$(JSCS_ES5_CONFIG)
	$(JSCS) $(FEATURES_DIR) $(SERVER_SRC_DIR) $(SERVER_TEST_DIR) --config=$(JSCS_ES6_CONFIG)
	$(HTML_VALIDATOR) --file=$(CLIENT_SRC_DIR)/index.html --verbose
	{ \
		$(FIND) $(CLIENT_SRC_DIR)/*/ -name '*.html' \
		| \
		$(XARGS) -I % $(SH) -c ' \
			htmlFile=$$($(MKTEMP)); \
			$(ECHO) %; \
			$(CAT) % \
			| \
			{ \
				$(ECHO) '"'"'<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>FRAGMENT</title></head><body>'"'"'; \
				$(CAT); \
				$(ECHO) '"'"'</body></html>'"'"'; \
			} > $$htmlFile; \
			$(HTML_VALIDATOR) --file=$$htmlFile --verbose; \
			htmlValidatorExit=$$?; \
			$(RM) $$htmlFile; \
			$(TEST) $$htmlValidatorExit -eq 0 \
		'; \
	}
	$(CSSLINT) $(CLIENT_SRC_DIR)

clean:
	$(RMDIR) $(BUILD_OUTPUT_DIR)

compile: compile-jison compile-js

compile-jison: $(DICE_EXPRESSION_PARSER_JS)

compile-js:
	$(MKDIR) $(COMPILE_OUTPUT_DIR)
	$(CP) $(SRC_DIR) $(TEST_DIR) $(COMPILE_OUTPUT_DIR)

dist:
	$(RMDIR) $(DIST_OUTPUT_DIR)
	$(MKDIR) $(DIST_OUTPUT_DIR)
	$(RSYNC) --include '*/' --include '*.js' --exclude '*' $(COMPILE_OUTPUT_DIR)/$(SERVER_SRC_DIR)/* $(DIST_OUTPUT_DIR)
	$(MKDIR) $(DIST_OUTPUT_DIR)/$(HTML_DIR)
	$(FIND) $(COMPILE_OUTPUT_DIR)/$(CLIENT_SRC_DIR) -name '*.html' | $(XARGS) -I % $(CP) % $(DIST_OUTPUT_DIR)/$(HTML_DIR)
	$(MKDIR) $(DIST_OUTPUT_DIR)/$(CSS_DIR)
	$(FIND) $(COMPILE_OUTPUT_DIR)/$(CLIENT_SRC_DIR) -name '*.css' | $(XARGS) -I % $(CP) % $(DIST_OUTPUT_DIR)/$(CSS_DIR)
	$(MKDIR) $(DIST_OUTPUT_DIR)/$(JS_DIR)
	$(FIND) $(COMPILE_OUTPUT_DIR)/$(CLIENT_SRC_DIR) -name '*.js' | $(XARGS) -I % $(CP) % $(DIST_OUTPUT_DIR)/$(JS_DIR)
	$(MKDIR) $(DIST_OUTPUT_DIR)/$(JS_VENDOR_DIR)
	$(CP) $(BOWER_COMPONENTS_DIR)/jcanvas/jcanvas.min.js $(DIST_OUTPUT_DIR)/$(JS_VENDOR_DIR)/jcanvas.js
	$(CP) $(BOWER_COMPONENTS_DIR)/jquery/dist/jquery.min.js $(DIST_OUTPUT_DIR)/$(JS_VENDOR_DIR)/jquery.js
	$(CP) $(BOWER_COMPONENTS_DIR)/jquery.event.gevent/jquery.event.gevent.js $(DIST_OUTPUT_DIR)/$(JS_VENDOR_DIR)/jquery.event.gevent.js
	$(CP) $(BOWER_COMPONENTS_DIR)/normalize-css/normalize.css $(DIST_OUTPUT_DIR)/$(CSS_DIR)

docs:
	$(JSDOC) -c $(JSDOC_CLIENT_CONFIG)
	$(JSDOC) -c $(JSDOC_SERVER_CONFIG)

init:
	$(NPM) install
	$(BOWER) install

publish-coverage:
	$(CAT) $(COVERAGE_OUTPUT_DIR)/lcov.info | $(COVERALLS)

start-server:
	$(NODE) $(DIST_OUTPUT_DIR)/$(SERVER_JS) $(TEST_PRIVATE_KEY) $(TEST_PUBLIC_KEY) & $(ECHO) $$! > $(SERVER_PID)

stop-server:
	$(eval PID := $(shell $(CAT) $(SERVER_PID)))
	$(KILL) $(PID)
	$(RM) $(SERVER_PID)

unit-test: compile
	$(JASMINE)

unit-test-with-coverage: compile
	$(ISTANBUL) cover $(JASMINE)

$(DICE_EXPRESSION_PARSER_JS): $(DICE_EXPRESSION_JISON)
	$(MKDIR) $(@D)
	$(JISON) $< -o $@
