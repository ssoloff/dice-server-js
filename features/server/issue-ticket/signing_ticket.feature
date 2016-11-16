#
# Copyright (c) 2016 Steven Soloff
#
# This is free software: you can redistribute it and/or modify it under the
# terms of the MIT License (https://opensource.org/licenses/MIT).
# This software comes with ABSOLUTELY NO WARRANTY.
#

Feature: Signing a ticket
  In order to verify no one has forged a ticket
  As a game master
  I want the ticket to be signed

Scenario: Successfully issuing a ticket
  Given a request with the expression "42"
  When the issue ticket service is invoked
  Then the response should contain a signed ticket
