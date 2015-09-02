Feature: Signing a redeem ticket service response
    In order to verify no one has forged a redeemed ticket
    As a game master
    I want the service response to be signed

Scenario: Successfully redeeming a ticket
    Given a ticket with the expression "42"
    When the redeem ticket service is invoked
    Then the response should be signed

