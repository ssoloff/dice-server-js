Feature: Signing service response
    In order to verify no one has forged the ticket
    As a game master
    I want the service response to be signed

Scenario: Issuing a successful ticket
    Given a request with the expression "5"
    When the issue ticket service is invoked
    Then the response should be signed

Scenario: Issuing a failed ticket
    Given a request with the expression "<<INVALID>>"
    When the issue ticket service is invoked
    Then the response should be signed

