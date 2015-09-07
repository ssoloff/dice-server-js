Feature: Validating a redeemed a ticket
    In order to use a player's evaluation of a dice notation expression
    As a game master
    I want to validate a redeemed ticket provided by a player

Scenario: Successfully validating a redeemed ticket
    Given a redeemed ticket
    When the validate redeemed ticket service is invoked
    Then the response should indicate success

