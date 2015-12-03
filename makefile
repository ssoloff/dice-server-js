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
GREP = grep
HTML_VALIDATOR = $(NODE_MODULES_BIN_DIR)/html-validator
ISTANBUL = $(NODE_MODULES_BIN_DIR)/istanbul
JASMINE = $(NODE_MODULES_BIN_DIR)/jasmine JASMINE_CONFIG_PATH=$(JASMINE_CONFIG)
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
BUILD_OUTPUT_DIR = build
COMPILE_OUTPUT_DIR = $(BUILD_OUTPUT_DIR)/compile
DIST_OUTPUT_DIR = dist
FEATURES_DIR = features
ISTANBUL_OUTPUT_DIR = coverage
NODE_MODULES_BIN_DIR = node_modules/.bin
PUBLIC_DIR = public
SCRIPTS_DIR = $(PUBLIC_DIR)/scripts
SPEC_DIR = spec
SRC_DIR = lib
STYLES_DIR = $(PUBLIC_DIR)/styles
TEST_DIR = test

DICE_EXPRESSION_JISON = $(SRC_DIR)/dice-expression.jison
DICE_EXPRESSION_PARSER_JS = $(COMPILE_OUTPUT_DIR)/$(SRC_DIR)/dice-expression-parser.js
ISTANBUL_CONFIG = .istanbul.yml
JASMINE_CONFIG = jasmine.json
JSDOC_CONFIG = jsdoc-conf.json
SERVER_JS = server.js
SERVER_PID = server.pid
TEST_PRIVATE_KEY = $(TEST_DIR)/private-key.pem
TEST_PUBLIC_KEY = $(TEST_DIR)/public-key.pem

acceptance-test:
	for dir in $(FEATURES_DIR)/services/*/; \
	do \
		[ "$$dir" = $(FEATURES_DIR)/services/support/ ] && continue; \
		$(CUCUMBER) $$dir || exit $$?; \
	done
	$(CUCUMBER) $(FEATURES_DIR)/ui

check:
	$(JSHINT) .
	$(JSCS) .
	$(FIND) $(PUBLIC_DIR) -name "*.html" | $(XARGS) -I {} $(HTML_VALIDATOR) --file={} | $(TEE) /dev/tty | { $(GREP) -q -E "^(Error|Warning):"; $(TEST) $$? -eq 1; }
	$(CSSLINT) $(STYLES_DIR)

clean:
	$(RMDIR) $(BUILD_OUTPUT_DIR)
	$(RMDIR) $(DIST_OUTPUT_DIR)
	$(RMDIR) $(ISTANBUL_OUTPUT_DIR)

compile: compile-jison compile-js

compile-jison: $(DICE_EXPRESSION_PARSER_JS)

compile-js:
	$(MKDIR) $(COMPILE_OUTPUT_DIR)
	$(CP) $(SERVER_JS) $(APP_DIR) $(PUBLIC_DIR) $(SPEC_DIR) $(TEST_DIR) $(COMPILE_OUTPUT_DIR)
	$(FIND) $(SRC_DIR) -name "*.js" | $(XARGS) -I {} $(CP) {} $(COMPILE_OUTPUT_DIR)/$(SRC_DIR)

dist:
	$(RMDIR) $(DIST_OUTPUT_DIR)
	$(MKDIR) $(DIST_OUTPUT_DIR)
	$(CP) $(COMPILE_OUTPUT_DIR)/$(SERVER_JS) $(COMPILE_OUTPUT_DIR)/$(APP_DIR) $(COMPILE_OUTPUT_DIR)/$(PUBLIC_DIR) $(COMPILE_OUTPUT_DIR)/$(SRC_DIR) $(DIST_OUTPUT_DIR)
	$(CP) $(BOWER_COMPONENTS_DIR)/jquery/dist/jquery.min.js $(DIST_OUTPUT_DIR)/$(SCRIPTS_DIR)/jquery.js
	$(CP) $(BOWER_COMPONENTS_DIR)/reset-css/reset.css $(DIST_OUTPUT_DIR)/$(STYLES_DIR)

docs:
	$(JSDOC) -c $(JSDOC_CONFIG)

init:
	$(NPM) install
	$(BOWER) install

publish-coverage:
	$(CAT) $(ISTANBUL_OUTPUT_DIR)/lcov.info | $(COVERALLS)

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

