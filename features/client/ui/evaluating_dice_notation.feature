#
# Copyright (c) 2015-2017 Steven Soloff
#
# This is free software: you can redistribute it and/or modify it under the
# terms of the MIT License (https://opensource.org/licenses/MIT).
# This software comes with ABSOLUTELY NO WARRANTY.
#

Feature: Evaluating dice notation via web UI
  In order to simplify game play
  As a player
  I want to be able to evaluate a dice notation expression via a web UI

Background: The home page is open and produces deterministic results
  Given the home page is open
    And the random number generator name is "constantMax"

Scenario: Evaluating well-formed expressions
  When the expression "3d6+4" is evaluated
  Then the expression text should be "3d6+4"
    And the expression canonical text should be "sum(roll(3, d6)) + 4"
    And the expression result text should be "[sum([roll(3, d6) -> [6, 6, 6]]) -> 18] + 4"
    And the expression result value should be "22"
    And an error message should not be displayed

Scenario: Evaluating malformed expressions
  When the expression "<<INVALID>>" is evaluated
  Then an error message should be displayed

Scenario: Evaluating empty expressions
  When the expression "" is evaluated
  Then an error message should not be displayed

Scenario: Pressing ENTER should cause evaluation
  When the expression "5" is entered
    And the ENTER key is pressed
  Then the expression text should be "5"
    And the expression canonical text should be "5"
    And the expression result text should be "5"
    And the expression result value should be "5"

Scenario: Results are not modified when an error occurs
  When the expression "5" is evaluated
    And the expression "<<INVALID>>" is evaluated
  Then the expression text should be "5"
    And the expression canonical text should be "5"
    And the expression result text should be "5"
    And the expression result value should be "5"

Scenario: Stale error messages are hidden
  When the expression "<<INVALID>>" is evaluated
    And the expression "5" is evaluated
  Then an error message should not be displayed

Scenario Outline: Rounding mode
  When the rounding mode is "<rounding mode>"
    And the expression "<expression>" is evaluated
  Then the expression text should be "<text>"
    And the expression canonical text should be "<canonical text>"
    And the expression result text should be "<result text>"
    And the expression result value should be "<result value>"
  Examples:
    | rounding mode | expression | text       | canonical text | result text         | result value |
    | None          | 3/2        | 3/2        | 3 / 2          | 3 / 2               | 1.5          |
    | Truncate      | 3/2        | trunc(3/2) | trunc(3 / 2)   | [trunc(3 / 2) -> 1] | 1            |
    | Floor         | 3/2        | floor(3/2) | floor(3 / 2)   | [floor(3 / 2) -> 1] | 1            |
    | Ceiling       | 3/2        | ceil(3/2)  | ceil(3 / 2)    | [ceil(3 / 2) -> 2]  | 2            |
    | Nearest       | 3/2        | round(3/2) | round(3 / 2)   | [round(3 / 2) -> 2] | 2            |
