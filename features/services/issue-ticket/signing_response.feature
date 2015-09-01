Feature: Signing an issue ticket service response
    In order to verify no one has forged the ticket
    As a game master
    I want the service response to be signed

Scenario: Successfully issuing a ticket
    Given a request with the expression "5"
    When the issue ticket service is invoked
    Then the response should be signed

Scenario: Failing to issue a ticket
    Given a request with the expression "<<INVALID>>"
    When the issue ticket service is invoked
    Then the response should be signed

