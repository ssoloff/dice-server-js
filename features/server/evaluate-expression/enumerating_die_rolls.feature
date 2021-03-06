#
# Copyright (c) 2015-2017 Steven Soloff
#
# This is free software: you can redistribute it and/or modify it under the
# terms of the MIT License (https://opensource.org/licenses/MIT).
# This software comes with ABSOLUTELY NO WARRANTY.
#

Feature: Enumerating die rolls
  In order to visually represent die rolls
  As a tool developer
  I want to enumerate the die rolls associated with evaluating a dice notation expression

Background: The service produces deterministic results
  Given a request with the random number generator named "constantMax"

Scenario Outline: Enumerating die rolls
  Given a request with the expression "<expression>"
  When the evaluate expression service is invoked
  Then the response should contain the die roll results "<JSON die roll results>"
  Examples:
    | expression | JSON die roll results                                                          |
    | 1+1        | []                                                                             |
    | 1d6+1      | [{"sides": 6, "value": 6}]                                                     |
    | 2d6+1d4    | [{"sides": 6, "value": 6}, {"sides": 6, "value": 6}, {"sides": 4, "value": 4}] |
    | d%         | [{"sides": 10, "value": 10}, {"sides": 10, "value": 10}]                       |
