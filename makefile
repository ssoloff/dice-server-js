.PHONY: all build check clean docs test

CUCUMBER = cucumber.js
JASMINE = jasmine
JISON = jison
JSCS = jscs
JSDOC = jsdoc
JSHINT = jshint
RM = rm -f
RMDIR = $(RM) -r

JSDOC_OUTPUT_DIR = out
SRC_DIR = lib

DICE_EXPRESSION_JISON = $(SRC_DIR)/dice-expression.jison
DICE_EXPRESSION_PARSER_JS = $(SRC_DIR)/dice-expression-parser.js
JSDOC_CONFIG = jsdoc-conf.json

all: build check test docs

build: $(DICE_EXPRESSION_PARSER_JS)

check: build
	$(JSHINT) .
	$(JSCS) .

clean:
	$(RM) $(DICE_EXPRESSION_PARSER_JS)
	$(RMDIR) $(JSDOC_OUTPUT_DIR)

docs:
	$(JSDOC) -c $(JSDOC_CONFIG)

test: build
	$(JASMINE)
	$(CUCUMBER)

$(DICE_EXPRESSION_PARSER_JS): $(DICE_EXPRESSION_JISON)
	$(JISON) $< -o $@

