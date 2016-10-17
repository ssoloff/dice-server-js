#
# Copyright (c) 2016 Steven Soloff
#
# This is free software: you can redistribute it and/or modify it under the
# terms of the MIT License (https://opensource.org/licenses/MIT).
# This software comes with ABSOLUTELY NO WARRANTY.
#

Feature: Redeeming a ticket repeatedly
    In order to prevent a player from continuously redeeming a ticket until they get a desired result
    As a game master
    I want to ensure redeeming a ticket repeatedly produces the same result

Scenario: Redeeming a ticket that has already been redeemed
    Given a ticket that has already been redeemed
    When the redeem ticket service is invoked
    Then the response should indicate success
        And the response should equal the previous response
