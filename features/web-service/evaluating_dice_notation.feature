Feature: Evaluating dice notation via web service
In order to simplify tool development
As a tool developer
I want to be able to evaluate a dice notation expression via a web service

Scenario: Evaluating well-formed expressions
Given a request with the expression "5"
When the evaluate service is invoked
Then the response should be
    """
    {
        "expression": {
            "text": "5"
        },
        "expressionResult": {
            "text": "5",
            "value": 5
        },
        "randomNumberGenerator": {
            "name": "uniform"
        }
    }
    """

Scenario: Evaluating malformed expressions
Given a request with the expression "<<INVALID>>"
When the evaluate service is invoked
Then the response should be
    """
    {
        "error": {
            "message": "illegal character"
        }
    }
    """

Scenario: Evaluating constants
Given a request with the expression "5"
When the evaluate service is invoked
Then the response should contain the expression result text "5"
    And the response should contain the expression result value 5

Scenario: Evaluating the addition of constants
Given a request with the expression "4+3"
When the evaluate service is invoked
Then the response should contain the expression result text "4 + 3"
    And the response should contain the expression result value 7

Scenario: Evaluating the subtraction of constants
Given a request with the expression "4-3"
When the evaluate service is invoked
Then the response should contain the expression result text "4 - 3"
    And the response should contain the expression result value 1

Scenario: Evaluating dice rolls
Given a request with the expression "3d6"
    And a request with the random number generator named "constantMax"
When the evaluate service is invoked
Then the response should contain the expression result text "6 [d6] + 6 [d6] + 6 [d6]"
    And the response should contain the expression result value 18

Scenario: Evaluating the addition of dice rolls and constants
Given a request with the expression "3d6+4"
    And a request with the random number generator named "constantMax"
When the evaluate service is invoked
Then the response should contain the expression result text "6 [d6] + 6 [d6] + 6 [d6] + 4"
    And the response should contain the expression result value 22

Scenario: Evaluating the subtraction of dice rolls and constants
Given a request with the expression "3d6-4"
    And a request with the random number generator named "constantMax"
When the evaluate service is invoked
Then the response should contain the expression result text "6 [d6] + 6 [d6] + 6 [d6] - 4"
    And the response should contain the expression result value 14

