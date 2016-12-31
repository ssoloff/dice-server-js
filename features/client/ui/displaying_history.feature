#
# Copyright (c) 2016 Steven Soloff
#
# This is free software: you can redistribute it and/or modify it under the
# terms of the MIT License (https://opensource.org/licenses/MIT).
# This software comes with ABSOLUTELY NO WARRANTY.
#

Feature: Displaying dice expression evaluation history
  In order to easily reevaluate a previously-evaluated dice expression
  As a player
  I want to be able to view a history of my previously evaluated dice expressions

Background: The home page is open and produces deterministic results
  Given the home page is open
    And the random number generator name is "constantMax"

Scenario: Results table keeps a history of past evaluations
  When the expression "5" is evaluated
    And the expression "6" is evaluated
    And the results table contains 2 rows
  Then the 1st expression text should be "6"
    And the 1st expression canonical text should be "6"
    And the 1st expression result text should be "6"
    And the 1st expression result value should be "6"
    And the 2nd expression text should be "5"
    And the 2nd expression canonical text should be "5"
    And the 2nd expression result text should be "5"
    And the 2nd expression result value should be "5"

Scenario: Removing all results from the results table
  When the expression "5" is evaluated
    And the expression "6" is evaluated
    And the results table contains 2 rows
    And the remove all button is clicked
  Then the results table should be empty

Scenario: Reevaluating a result in the results table
  When the expression "5" is evaluated
    And the reevaluate button on the 1st row is clicked
    And the results table contains 2 rows
  Then the 1st expression text should be "5"
    And the 1st expression canonical text should be "5"
    And the 1st expression result text should be "5"
    And the 1st expression result value should be "5"
    And the 2nd expression text should be "5"
    And the 2nd expression canonical text should be "5"
    And the 2nd expression result text should be "5"
    And the 2nd expression result value should be "5"

Scenario: Removing a result from the results table
  When the expression "5" is evaluated
    And the expression "6" is evaluated
    And the results table contains 2 rows
    And the remove button on the 1st row is clicked
  Then the 1st expression text should be "5"
    And the 1st expression canonical text should be "5"
    And the 1st expression result text should be "5"
    And the 1st expression result value should be "5"
