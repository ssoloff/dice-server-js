Feature: Evaluating dice notation via web service
    In order to simplify tool development
    As a tool developer
    I want to be able to evaluate a dice notation expression via a web service

Background: The service produces deterministic results
    Given a request with the random number generator named "constantMax"

Scenario: Evaluating well-formed expressions
    Given a request with the expression "5"
    When the evaluate expression service is invoked
    Then the response should be
        """
        {
            "success": {
                "expression": {
                    "canonicalText": "5",
                    "text": "5"
                },
                "expressionResult": {
                    "text": "5",
                    "value": 5
                },
                "randomNumberGenerator": {
                    "name": "constantMax"
                }
            }
        }
        """

Scenario: Evaluating malformed expressions
    Given a request with the expression "<<INVALID>>"
    When the evaluate expression service is invoked
    Then the response should be
        """
        {
            "failure": {
                "message": "illegal character"
            }
        }
        """

Scenario: Evaluating constants
    Given a request with the expression "5"
    When the evaluate expression service is invoked
    Then the response should contain the expression result text "5"
        And the response should contain the expression result value 5

Scenario Outline: Evaluating expressions containing array literals
    Given a request with the expression "<expression>"
    When the evaluate expression service is invoked
    Then the response should contain the expression result text "<result text>"
        And the response should contain the expression result value <result value>
    Examples:
        | expression      | result text                | result value |
        | sum([1])        | [sum([1]) -> 1]            | 1            |
        | sum([1, 2])     | [sum([1, 2]) -> 3]         | 3            |
        | sum([1+1, 3-1]) | [sum([1 + 1, 3 - 1]) -> 4] | 4            |

Scenario Outline: Evaluating arithmetic expressions with constants
    Given a request with the expression "<expression>"
    When the evaluate expression service is invoked
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
        | 4%3        | 4 % 3       | 1                  |
        | 3%4        | 3 % 4       | 3                  |

Scenario Outline: Evaluating dice rolls
    Given a request with the expression "<expression>"
    When the evaluate expression service is invoked
    Then the response should contain the expression result text "<result text>"
        And the response should contain the expression result value <result value>
    Examples:
        | expression       | result text                             | result value |
        | 3d6              | [sum([roll(3, d6) -> [6, 6, 6]]) -> 18] | 18           |
        | 1d10             | [sum([roll(1, d10) -> [10]]) -> 10]     | 10           |
        | 1d%              | [sum([roll(1, d100) -> [100]]) -> 100]  | 100          |
        | sum(roll(2, d8)) | [sum([roll(2, d8) -> [8, 8]]) -> 16]    | 16           |

Scenario Outline: Evaluating modified dice rolls
    Given a request with the expression "<expression>"
    When the evaluate expression service is invoked
    Then the response should contain the expression result text "<result text>"
        And the response should contain the expression result value <result value>
    Examples:
        | expression                          | result text                                                                  | result value |
        | 2d6+L                               | [sum([cloneLowestRolls([roll(2, d6) -> [6, 6]], 1) -> [6, 6, 6]]) -> 18]     | 18           |
        | 2d6+2L                              | [sum([cloneLowestRolls([roll(2, d6) -> [6, 6]], 2) -> [6, 6, 6, 6]]) -> 24]  | 24           |
        | 2d6+H                               | [sum([cloneHighestRolls([roll(2, d6) -> [6, 6]], 1) -> [6, 6, 6]]) -> 18]    | 18           |
        | 2d6+2H                              | [sum([cloneHighestRolls([roll(2, d6) -> [6, 6]], 2) -> [6, 6, 6, 6]]) -> 24] | 24           |
        | 3d6-L                               | [sum([dropLowestRolls([roll(3, d6) -> [6, 6, 6]], 1) -> [6, 6]]) -> 12]      | 12           |
        | 3d6-2L                              | [sum([dropLowestRolls([roll(3, d6) -> [6, 6, 6]], 2) -> [6]]) -> 6]          | 6            |
        | 3d6-H                               | [sum([dropHighestRolls([roll(3, d6) -> [6, 6, 6]], 1) -> [6, 6]]) -> 12]     | 12           |
        | 3d6-2H                              | [sum([dropHighestRolls([roll(3, d6) -> [6, 6, 6]], 2) -> [6]]) -> 6]         | 6            |
        | sum(cloneLowestRolls([1, 6], 1))    | [sum([cloneLowestRolls([1, 6], 1) -> [1, 6, 1]]) -> 8]                       | 8            |
        | sum(cloneHighestRolls([1, 6], 1))   | [sum([cloneHighestRolls([1, 6], 1) -> [1, 6, 6]]) -> 13]                     | 13           |
        | sum(dropLowestRolls([1, 3, 6], 1))  | [sum([dropLowestRolls([1, 3, 6], 1) -> [3, 6]]) -> 9]                        | 9            |
        | sum(dropHighestRolls([1, 3, 6], 1)) | [sum([dropHighestRolls([1, 3, 6], 1) -> [1, 3]]) -> 4]                       | 4            |

Scenario Outline: Evaluating arithmetic expressions with dice rolls and constants
    Given a request with the expression "<expression>"
    When the evaluate expression service is invoked
    Then the response should contain the expression result text "<result text>"
        And the response should contain the expression result value <result value>
    Examples:
        | expression | result text                                                            | result value |
        | 3d6+4      | [sum([roll(3, d6) -> [6, 6, 6]]) -> 18] + 4                            | 22           |
        | 3d6-4      | [sum([roll(3, d6) -> [6, 6, 6]]) -> 18] - 4                            | 14           |
        | 4*3d6      | 4 * [sum([roll(3, d6) -> [6, 6, 6]]) -> 18]                            | 72           |
        | 3d6/4      | [sum([roll(3, d6) -> [6, 6, 6]]) -> 18] / 4                            | 4.5          |
        | 3d6%4      | [sum([roll(3, d6) -> [6, 6, 6]]) -> 18] % 4                            | 2            |
        | 1d%%3      | [sum([roll(1, d100) -> [100]]) -> 100] % 3                             | 1            |
        | 2d6-L-1    | [sum([dropLowestRolls([roll(2, d6) -> [6, 6]], 1) -> [6]]) -> 6] - 1   | 5            |
        | 1d6+L+1    | [sum([cloneLowestRolls([roll(1, d6) -> [6]], 1) -> [6, 6]]) -> 12] + 1 | 13           |

Scenario Outline: Rounding fractional values
    Given a request with the expression "<expression>"
    When the evaluate expression service is invoked
    Then the response should contain the expression result text "<result text>"
        And the response should contain the expression result value <result value>
    Examples:
        | expression   | result text                                               | result value |
        | ceil(1/2)    | [ceil(1 / 2) -> 1]                                        | 1            |
        | floor(1/2)   | [floor(1 / 2) -> 0]                                       | 0            |
        | round(1/3)   | [round(1 / 3) -> 0]                                       | 0            |
        | round(1/2)   | [round(1 / 2) -> 1]                                       | 1            |
        | trunc(1/2)   | [trunc(1 / 2) -> 0]                                       | 0            |
        | trunc(3d6/4) | [trunc([sum([roll(3, d6) -> [6, 6, 6]]) -> 18] / 4) -> 4] | 4            |

Scenario Outline: Evaluating grouped expressions
    Given a request with the expression "<expression>"
    When the evaluate expression service is invoked
    Then the response should contain the expression result text "<result text>"
        And the response should contain the expression result value <result value>
    Examples:
        | expression | result text                                       | result value |
        | 3*(2+1)    | 3 * (2 + 1)                                       | 9            |
        | (3d6+1)*2  | ([sum([roll(3, d6) -> [6, 6, 6]]) -> 18] + 1) * 2 | 38           |

Scenario Outline: Evaluating division expressions with extended divide and round operators
    Given a request with the expression "<expression>"
    When the evaluate expression service is invoked
    Then the response should contain the expression result text "<result text>"
        And the response should contain the expression result value <result value>
    Examples:
        | expression | result text                                               | result value |
        | 1 // 2     | [trunc(1 / 2) -> 0]                                       | 0            |
        | 3d6 // 4   | [trunc([sum([roll(3, d6) -> [6, 6, 6]]) -> 18] / 4) -> 4] | 4            |
        | 1 /~ 3     | [round(1 / 3) -> 0]                                       | 0            |
        | 1 /~ 2     | [round(1 / 2) -> 1]                                       | 1            |
        | 1 /- 2     | [floor(1 / 2) -> 0]                                       | 0            |
        | 1 /+ 2     | [ceil(1 / 2) -> 1]                                        | 1            |

Scenario Outline: Evaluating expressions with unary operators
    Given a request with the expression "<expression>"
    When the evaluate expression service is invoked
    Then the response should contain the expression result text "<result text>"
        And the response should contain the expression result value <result value>
    Examples:
        | expression | result text                              | result value |
        | -1         | -1                                       | -1           |
        | +1         | +1                                       | 1            |
        | -3d6       | -[sum([roll(3, d6) -> [6, 6, 6]]) -> 18] | -18          |

Scenario Outline: Evaluating expressions that result in non-finite values
    Given a request with the expression "<expression>"
    When the evaluate expression service is invoked
    Then the response should indicate failure
    Examples:
        | expression  |
        | d6          |
        | [1, 2, 3]   |
        | round(d6)   |
        | roll(3, d6) |

