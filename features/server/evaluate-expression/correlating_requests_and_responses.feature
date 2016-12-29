#
# Copyright (c) 2016 Steven Soloff
#
# This is free software: you can redistribute it and/or modify it under the
# terms of the MIT License (https://opensource.org/licenses/MIT).
# This software comes with ABSOLUTELY NO WARRANTY.
#

Feature: Correlating requests and responses
  In order to know which request triggered a specific response
  As a tool developer
  I want the response to specify the originating request ID as its correlation ID

Scenario: Correlating requests and responses
  Given a request with the ID "aaaa-bbbb-cccc"
    And a request with the expression "5"
  When the evaluate expression service is invoked
  Then the response should contain the correlation ID "aaaa-bbbb-cccc"
