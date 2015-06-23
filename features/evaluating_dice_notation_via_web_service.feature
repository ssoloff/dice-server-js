Feature: Evaluating dice notation via web service
In order to simplify tool development
As a tool developer
I want to be able to evaluate a dice notation expression via a web service

Scenario: Evaluating constants
Given a request with the expression 5
When the roll service is invoked
Then the response should contain the expression result 5

Scenario: Evaluating the addition of constants
Given a request with the expression 4 + 3
When the roll service is invoked
Then the response should contain the expression result 7

Scenario: Evaluating the subtraction of constants
Given a request with the expression 4 - 3
When the roll service is invoked
Then the response should contain the expression result 1

