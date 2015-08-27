Feature: Signing web service response
    In order to verify players have not forged the result of evaluating a dice expression
    As a game master
    I want the web service response to be signed

Scenario: Evaluating well-formed expressions
    Given a request with the expression "5"
    When the evaluate service is invoked
    Then the response should be signed

Scenario: Evaluating malformed expressions
    Given a request with the expression "<<INVALID>>"
    When the evaluate service is invoked
    Then the response should be signed

