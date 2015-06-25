Feature: Specifying a custom random number generator
In order to make testing deterministic
As a tester
I want to be able to specify a custom random number generator when evaluating dice notation

Scenario: Using the default random number generator
Given a request with the expression "3d6"
    And a request with an unspecified random number generator
When the evaluate service is invoked
Then the response should contain the random number generator name "uniform"

Scenario: Using the uniform random number generator
Given a request with the expression "3d6"
    And a request with the random number generator named "uniform"
When the evaluate service is invoked
Then the response should contain the random number generator name "uniform"

Scenario: Using an unknown random number generator
Given a request with the expression "3d6"
    And a request with the random number generator named "<<UNKNOWN>>"
When the evaluate service is invoked
Then the response should contain an error

