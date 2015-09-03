Feature: Redeeming a ticket
    In order to fulfil a game master's request to evaluate a dice notation expression
    As a player
    I want to redeem a ticket issued by a game master

Background: The service produces deterministic results
    Given a ticket with the random number generator named "constantMax"

Scenario Outline: Successfully redeeming a ticket
    Given a ticket with the expression "<expression>"
        And a ticket with the description "<description>"
    When the redeem ticket service is invoked
    Then the response should contain the expression result text "<result text>"
        And the response should contain the expression result value <result value>
        And the response should contain the ticket description
        And the response should contain the ticket identifier
    Examples:
        | expression | result text                             | result value | description |
        | 42         | 42                                      | 42           | desc 1      |
        | 3+4        | 3 + 4                                   | 7            | desc 2      |
        | 3d6        | [sum([roll(3, d6) -> [6, 6, 6]]) -> 18] | 18           | desc 3      |

Scenario: Failing to redeem a ticket with an invalid signature
    Given a ticket with an invalid signature
    When the redeem ticket service is invoked
    Then the response should contain a failure

