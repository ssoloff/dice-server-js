Feature: Evaluating dice notation via web UI
In order to simplify game play
As a player
I want to be able to evaluate a dice notation expression via a web UI

Scenario: Evaluating constants
Given the home page is open
When the expression 5 is evaluated
Then the result should be 5

Scenario: Evaluating the addition of constants
Given the home page is open
When the expression 4 + 3 is evaluated
Then the result should be 7

Scenario: Evaluating the subtraction of constants
Given the home page is open
When the expression 4 - 3 is evaluated
Then the result should be 1

Scenario: Pressing ENTER should cause evaluation
Given the home page is open
When the expression 5 is entered
    And the ENTER key is pressed
Then the result should be 5

Scenario: Evaluating well-formed expressions
Given the home page is open
When the expression 5 is evaluated
Then an error message should not be displayed

Scenario: Evaluating malformed expressions
Given the home page is open
When the expression <<INVALID>> is evaluated
Then an error message should be displayed

Scenario: Stale results are removed when an error occurs
Given the home page is open
When the expression 5 is evaluated
    And the expression <<INVALID>> is evaluated
Then the result should be empty

Scenario: Stale error messages are hidden
Given the home page is open
When the expression <<INVALID>> is evaluated
    And the expression 5 is evaluated
Then an error message should not be displayed

