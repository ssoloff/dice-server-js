Feature: Signing service response
    In order to verify no one has forged a redeemed ticket
    As a game master
    I want the service response to be signed

Scenario: Successfully redeeming a ticket
    Given a request with the expression "5"
    When the redeem ticket service is invoked
    Then the response should be signed

Scenario: Failing to redeem a ticket
    Given a request with the expression "<<INVALID>>"
    When the redeem ticket service is invoked
    Then the response should be signed

