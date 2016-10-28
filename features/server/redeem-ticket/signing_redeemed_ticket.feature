#
# Copyright (c) 2016 Steven Soloff
#
# This is free software: you can redistribute it and/or modify it under the
# terms of the MIT License (https://opensource.org/licenses/MIT).
# This software comes with ABSOLUTELY NO WARRANTY.
#

Feature: Signing a redeemed ticket
    In order to verify no one has forged a redeemed ticket
    As a game master
    I want the redeemed ticket to be signed

Scenario: Successfully redeeming a ticket
    Given a ticket
    When the redeem ticket service is invoked
    Then the response should contain a signed redeemed ticket
