Feature: Redeeming a ticket
    In order to fulfil a game master's request to evaluate a dice notation expression
    As a player
    I want to redeem a ticket issued by a game master

Scenario Outline: Successfully redeeming a ticket
    Given a request with the expression "<expression>"
        And a request with the description "<description>"
    When the redeem ticket service is invoked
    Then the response should contain the expression result text "<result text>"
        And the response should contain the expression result value <result value>
        And the response should contain the description "<description>"
        And the response should contain the ticket identifier
    Examples:
        | expression | result text                             | result value | description |
        | 42         | 42                                      | 42           | desc 1      |
        | 3+4        | 3 + 4                                   | 7            | desc 2      |
        | 3d6        | [sum([roll(3, d6) -> [6, 6, 6]]) -> 18] | 18           | desc 3      |

Scenario: Failing to redeem a ticket
    Given a request with the expression "<<INVALID>>"
    When the redeem ticket service is invoked
    Then the response should contain a failure

