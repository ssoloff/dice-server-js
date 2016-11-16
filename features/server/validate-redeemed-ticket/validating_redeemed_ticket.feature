#
# Copyright (c) 2016 Steven Soloff
#
# This is free software: you can redistribute it and/or modify it under the
# terms of the MIT License (https://opensource.org/licenses/MIT).
# This software comes with ABSOLUTELY NO WARRANTY.
#

Feature: Validating a redeemed a ticket
  In order to use a player's evaluation of a dice notation expression
  As a game master
  I want to validate a redeemed ticket provided by a player

Scenario: Successfully validating a redeemed ticket
  Given a redeemed ticket
  When the validate redeemed ticket service is invoked
  Then the response should indicate success

Scenario: Failing to validate a redeemed ticket with an invalid signature
  Given a redeemed ticket with an invalid signature
  When the validate redeemed ticket service is invoked
  Then the response should indicate failure
