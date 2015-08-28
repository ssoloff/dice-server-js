Feature: Issuing a ticket
    In order to ask a player to evaluate a dice notation expression
    As a game master
    I want to issue a ticket to the player that defines the dice notation expression to be evaluated

Scenario Outline: Issuing a ticket
    Given a request with the expression "<expression>"
        And a request with the description "<description>"
    When the issue ticket service is invoked
    Then the response should contain the expression text "<expression>"
        And the response should contain the description "<description>"
        And the response should contain a ticket identifier
    Examples:
        | expression | description |
        | 5          | attack roll |
        | 42         |             |

Scenario: Issuing a ticket with an invalid expression
    Given a request with the expression "<<INVALID>>"
    When the issue ticket service is invoked
    Then the response should contain a failure

