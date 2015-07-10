Feature: Offering help
    In order to learn dice expression syntax
    As a player
    I want to be able to display help text

Background: The home page is open
    Given the home page is open

Scenario: Showing help text
    When the help link is clicked
    Then help should be displayed
        And the help link text should be "hide help"

Scenario: Hiding help text
    When the help link is clicked
        And the hide help link is clicked
    Then help should not be displayed
        And the help link text should be "help"

