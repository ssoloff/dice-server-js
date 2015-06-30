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

Scenario: Evaluating the multiplication of constants
Given a request with the expression "4*3"
When the evaluate service is invoked
Then the response should contain the expression result text "4 * 3"
    And the response should contain the expression result value 12

Scenario: Evaluating the division of constants
Given a request with the expression "3/4"
When the evaluate service is invoked
Then the response should contain the expression result text "3 / 4"
    And the response should contain the expression result value 0.75

Scenario: Evaluating dice rolls
Given a request with the expression "3d6"
    And a request with the random number generator named "constantMax"
When the evaluate service is invoked
Then the response should contain the expression result text "[(6, 6, 6): 6 + 6 + 6]"
    And the response should contain the expression result value 18

Scenario: Evaluating the addition of dice rolls and constants
Given a request with the expression "3d6+4"
    And a request with the random number generator named "constantMax"
When the evaluate service is invoked
Then the response should contain the expression result text "[(6, 6, 6): 6 + 6 + 6] + 4"
    And the response should contain the expression result value 22

Scenario: Evaluating the subtraction of dice rolls and constants
Given a request with the expression "3d6-4"
    And a request with the random number generator named "constantMax"
When the evaluate service is invoked
Then the response should contain the expression result text "[(6, 6, 6): 6 + 6 + 6] - 4"
    And the response should contain the expression result value 14

Scenario: Evaluating the multiplication of dice rolls and constants
Given a request with the expression "4*3d6"
    And a request with the random number generator named "constantMax"
When the evaluate service is invoked
Then the response should contain the expression result text "4 * [(6, 6, 6): 6 + 6 + 6]"
    And the response should contain the expression result value 72

Scenario: Evaluating the division of dice rolls and constants
Given a request with the expression "3d6/4"
    And a request with the random number generator named "constantMax"
When the evaluate service is invoked
Then the response should contain the expression result text "[(6, 6, 6): 6 + 6 + 6] / 4"
    And the response should contain the expression result value 4.5

Scenario Outline: Rounding fractional values
Given a request with the expression "<expression>"
    And a request with the random number generator named "constantMax"
When the evaluate service is invoked
Then the response should contain the expression result value <value>
Examples:
| expression   | value |
| ceil(1/2)    | 1     |
| floor(1/2)   | 0     |
| round(1/3)   | 0     |
| round(1/2)   | 1     |
| trunc(1/2)   | 0     |
| trunc(3d6/4) | 4     |

