Feature: Evaluating dice notation via web UI
In order to simplify game play
As a player
I want to be able to evaluate a dice notation expression via a web UI

Scenario: Evaluating well-formed expressions
Given the home page is open
    And the random number generator name is "constantMax"
When the expression "3d6+4" is evaluated
Then an expression result should be displayed
    And the evaluated expression text should be "3d6 + 4"
    And the expression result text should be "[(6, 6, 6): 6 + 6 + 6] + 4"
    And the expression result value should be "22"
    And an error message should not be displayed

Scenario: Evaluating malformed expressions
Given the home page is open
When the expression "<<INVALID>>" is evaluated
Then an expression result should not be displayed
    And an error message should be displayed

Scenario: Evaluating empty expressions
Given the home page is open
When the expression "" is evaluated
Then an error message should not be displayed

Scenario: Pressing ENTER should cause evaluation
Given the home page is open
When the expression "5" is entered
    And the ENTER key is pressed
Then the evaluated expression text should be "5"
    And the expression result text should be "5"
    And the expression result value should be "5"

Scenario: Stale results are removed when an error occurs
Given the home page is open
When the expression "5" is evaluated
    And the expression "<<INVALID>>" is evaluated
Then an expression result should not be displayed

Scenario: Stale error messages are hidden
Given the home page is open
When the expression "<<INVALID>>" is evaluated
    And the expression "5" is evaluated
Then an expression result should be displayed
    And an error message should not be displayed

