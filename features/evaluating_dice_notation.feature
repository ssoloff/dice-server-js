Feature: Evaluating dice notation
In order to streamline game play
As a user
I want to be able to evaluate a dice notation expression

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

