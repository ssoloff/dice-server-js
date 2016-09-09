Feature: Enumerating dice via web service
    In order to visually represent a dice roll
    As a tool developer
    I want to enumerate the dice within a dice notation expression via a web service

Scenario Outline: Successfully enumerating dice
    Given a request with the expression "<expression>"
    When the enumerate dice service is invoked
    Then the response should indicate success
        And the response should contain the dice "<dice>"
    Examples:
        | expression       | dice          |
        | 1 + 1            |               |
        | 1d6 + 1          | 6             |
        | 3d6 + 2d4        | 4, 4, 6, 6, 6 |
        | trunc(1d42/4)    | 42            |

Scenario: Failing to enumerate dice due to an invalid expression
    Given a request with the expression "<<INVALID>>"
    When the enumerate dice service is invoked
    Then the response should indicate failure
