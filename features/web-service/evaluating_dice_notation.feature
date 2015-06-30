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

Scenario Outline: Evaluating arithmetic expressions with constants
    Given a request with the expression "<expression>"
    When the evaluate service is invoked
    Then the response should contain the expression result text "<result text>"
        And the response should contain the expression result value <result value>
    Examples:
        | expression | result text | result value       |
        | 4+3        | 4 + 3       | 7                  |
        | 3+4        | 3 + 4       | 7                  |
        | 4-3        | 4 - 3       | 1                  |
        | 3-4        | 3 - 4       | -1                 |
        | 4*3        | 4 * 3       | 12                 |
        | 3*4        | 3 * 4       | 12                 |
        | 4/3        | 4 / 3       | 1.3333333333333333 |
        | 3/4        | 3 / 4       | 0.75               |

Scenario Outline: Evaluating dice rolls
    Given a request with the expression "<expression>"
        And a request with the random number generator named "constantMax"
    When the evaluate service is invoked
    Then the response should contain the expression result text "<result text>"
        And the response should contain the expression result value <result value>
    Examples:
        | expression | result text            | result value |
        | 3d6        | [(6, 6, 6): 6 + 6 + 6] | 18           |
        | d10        | [(10): 10]             | 10           |
        | d%         | [(100): 100]           | 100          |

Scenario Outline: Evaluating arithmetic expressions with dice rolls and constants
    Given a request with the expression "<expression>"
        And a request with the random number generator named "constantMax"
    When the evaluate service is invoked
    Then the response should contain the expression result text "<result text>"
        And the response should contain the expression result value <result value>
    Examples:
        | expression | result text                | result value |
        | 3d6+4      | [(6, 6, 6): 6 + 6 + 6] + 4 | 22           |
        | 3d6-4      | [(6, 6, 6): 6 + 6 + 6] - 4 | 14           |
        | 4*3d6      | 4 * [(6, 6, 6): 6 + 6 + 6] | 72           |
        | 3d6/4      | [(6, 6, 6): 6 + 6 + 6] / 4 | 4.5          |

Scenario Outline: Rounding fractional values
    Given a request with the expression "<expression>"
        And a request with the random number generator named "constantMax"
    When the evaluate service is invoked
    Then the response should contain the expression result text "<result text>"
        And the response should contain the expression result value <result value>
    Examples:
        | expression   | result text                            | result value |
        | ceil(1/2)    | [ceil(1 / 2): 1]                       | 1            |
        | floor(1/2)   | [floor(1 / 2): 0]                      | 0            |
        | round(1/3)   | [round(1 / 3): 0]                      | 0            |
        | round(1/2)   | [round(1 / 2): 1]                      | 1            |
        | trunc(1/2)   | [trunc(1 / 2): 0]                      | 0            |
        | trunc(3d6/4) | [trunc([(6, 6, 6): 6 + 6 + 6] / 4): 4] | 4            |

