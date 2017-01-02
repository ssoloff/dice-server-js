#
# Copyright (c) 2015-2017 Steven Soloff
#
# This is free software: you can redistribute it and/or modify it under the
# terms of the MIT License (https://opensource.org/licenses/MIT).
# This software comes with ABSOLUTELY NO WARRANTY.
#

Feature: Issuing a ticket
  In order to ask a player to evaluate a dice notation expression
  As a game master
  I want to issue a ticket to the player that defines the dice notation expression to be evaluated

Scenario Outline: Successfully issuing a ticket
  Given a request with the expression "<expression>"
    And a request with the random number generator named "<random number generator>"
    And a request with the description "<description>"
  When the issue ticket service is invoked
  Then the response should indicate success
    And the response should contain the expression text "<expression>"
    And the response should contain the random number generator named "<random number generator>"
    And the response should contain the description "<description>"
    And the response should contain a ticket identifier
    And the response should contain a link to the redeem ticket service
  Examples:
    | expression | random number generator | description |
    | 42         | uniform                 |             |
    | 3d6        | constantMax             | attack roll |

Scenario: Failing to issue a ticket due to an invalid expression
  Given a request with the expression "<<INVALID>>"
  When the issue ticket service is invoked
  Then the response should indicate failure

Scenario: Failing to issue a ticket due to an unknown random number generator
  Given a request with the expression "42"
    And a request with the random number generator named "<<UNKNOWN>>"
  When the issue ticket service is invoked
  Then the response should indicate failure
