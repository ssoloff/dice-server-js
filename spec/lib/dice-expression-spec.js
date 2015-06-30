/*
 * Copyright (c) 2015 Steven Soloff
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

"use strict";

require("../../lib/number-polyfills");

var _ = require("underscore");
var dice = require("../../lib/dice");
var diceTest = require("./dice-test");

describe("diceExpression", function () {
    var d3;
    var three;
    var four;

    beforeEach(function () {
        d3 = diceTest.createDieThatRollsEachSideSuccessively(3);
        three = dice.expression.forConstant(3);
        four = dice.expression.forConstant(4);
    });

    describe(".forAddition", function () {
        describe("when augend expression is falsy", function () {
            it("should throw exception", function () {
                expect(function () {
                    dice.expression.forAddition(undefined, three);
                }).toThrow();
            });
        });

        describe("when addend expression is falsy", function () {
            it("should throw exception", function () {
                expect(function () {
                    dice.expression.forAddition(four, undefined);
                }).toThrow();
            });
        });

        describe(".evaluate", function () {
            it("should return result with value equal to sum of augend and addend", function () {
                var expression = dice.expression.forAddition(four, three);
                expect(expression.evaluate()).toBeExpressionResultWithValue(7);
            });

            it("should evaluate subexpressions", function () {
                var expression = dice.expression.forAddition(dice.expression.forAddition(four, three), three);
                expect(expression.evaluate()).toBeExpressionResultWithValue(10);
            });
        });
    });

    describe(".forConstant", function () {
        describe("when constant is not a number", function () {
            it("should throw exception", function () {
                expect(function () {
                    dice.expression.forConstant(undefined);
                }).toThrow();
                expect(function () {
                    dice.expression.forConstant("3");
                }).toThrow();
            });
        });

        describe(".evaluate", function () {
            it("should return result with value equal to constant", function () {
                var expression = dice.expression.forConstant(5);
                expect(expression.evaluate()).toBeExpressionResultWithValue(5);
            });
        });
    });

    describe(".forDie", function () {
        describe("when die is falsy", function () {
            it("should throw exception", function () {
                expect(function () {
                    dice.expression.forDie(undefined);
                }).toThrow();
            });
        });

        describe(".evaluate", function () {
            it("should return result with value equal to die", function () {
                var expression = dice.expression.forDie(d3);
                expect(expression.evaluate()).toBeExpressionResultWithValue(d3);
            });
        });
    });

    describe(".forDivision", function () {
        describe("when dividend expression is falsy", function () {
            it("should throw exception", function () {
                expect(function () {
                    dice.expression.forDivision(undefined, three);
                }).toThrow();
            });
        });

        describe("when divisor expression is falsy", function () {
            it("should throw exception", function () {
                expect(function () {
                    dice.expression.forDivision(four, undefined);
                }).toThrow();
            });
        });

        describe(".evaluate", function () {
            it("should return result with value equal to quotient of dividend and divisor", function () {
                var expression = dice.expression.forDivision(three, four);
                expect(expression.evaluate()).toBeExpressionResultWithValue(0.75);
            });

            it("should evaluate subexpressions", function () {
                var expression = dice.expression.forDivision(dice.expression.forDivision(three, four), four);
                expect(expression.evaluate()).toBeExpressionResultWithValue(0.1875);
            });
        });
    });

    describe(".forFunctionCall", function () {
        function f() {
            function sum(first, second) {
                return first + second;
            }
            return 42 + _.toArray(arguments).reduce(sum, 0);
        }

        describe("when function name is falsy", function () {
            it("should throw exception", function () {
                expect(function () {
                    dice.expression.forFunctionCall(undefined, f, []);
                }).toThrow();
            });
        });

        describe("when function is falsy", function () {
            it("should throw exception", function () {
                expect(function () {
                    dice.expression.forFunctionCall("f", undefined, []);
                }).toThrow();
            });
        });

        describe("when function argument list expressions is falsy", function () {
            it("should throw exception", function () {
                expect(function () {
                    dice.expression.forFunctionCall("f", f, undefined);
                }).toThrow();
            });
        });

        describe(".evaluate", function () {
            describe("when zero arguments specified", function () {
                it("should return result with value equal to function return value", function () {
                    var expression = dice.expression.forFunctionCall("f", f, []);
                    expect(expression.evaluate()).toBeExpressionResultWithValue(42);
                });
            });

            describe("when one argument specified", function () {
                it("should return result with value equal to function return value", function () {
                    var expression = dice.expression.forFunctionCall("f", f, [three]);
                    expect(expression.evaluate()).toBeExpressionResultWithValue(45);
                });
            });

            describe("when two arguments specified", function () {
                it("should return result with value equal to function return value", function () {
                    var expression = dice.expression.forFunctionCall("f", f, [three, four]);
                    expect(expression.evaluate()).toBeExpressionResultWithValue(49);
                });
            });
        });
    });

    describe(".forMultiplication", function () {
        describe("when multiplicand expression is falsy", function () {
            it("should throw exception", function () {
                expect(function () {
                    dice.expression.forMultiplication(undefined, three);
                }).toThrow();
            });
        });

        describe("when multiplier expression is falsy", function () {
            it("should throw exception", function () {
                expect(function () {
                    dice.expression.forMultiplication(four, undefined);
                }).toThrow();
            });
        });

        describe(".evaluate", function () {
            it("should return result with value equal to product of multiplicand and multiplier", function () {
                var expression = dice.expression.forMultiplication(four, three);
                expect(expression.evaluate()).toBeExpressionResultWithValue(12);
            });

            it("should evaluate subexpressions", function () {
                var expression = dice.expression.forMultiplication(dice.expression.forMultiplication(four, three), three);
                expect(expression.evaluate()).toBeExpressionResultWithValue(36);
            });
        });
    });

    describe(".forRoll", function () {
        describe("when count is not a number", function () {
            it("should throw exception", function () {
                expect(function () {
                    dice.expression.forRoll(undefined, d3);
                }).toThrow();
                expect(function () {
                    dice.expression.forRoll("3", d3);
                }).toThrow();
            });
        });

        describe("when count less than one", function () {
            it("should throw exception", function () {
                expect(function () {
                    dice.expression.forRoll(0, d3);
                }).toThrowError(RangeError);
                expect(function () {
                    dice.expression.forRoll(Number.MIN_SAFE_INTEGER, d3);
                }).toThrowError(RangeError);
            });
        });

        describe("when die is falsy", function () {
            it("should throw exception", function () {
                expect(function () {
                    dice.expression.forRoll(3, undefined);
                }).toThrow();
            });
        });

        describe("when count equals one", function () {
            describe(".evaluate", function () {
                it("should return result with value equal to single die roll", function () {
                    var expression = dice.expression.forRoll(1, d3);
                    expect(expression.evaluate()).toBeExpressionResultWithValue(1);
                });
            });
        });

        describe("when count greater than one", function () {
            describe(".evaluate", function () {
                it("should return result with value equal to sum of multiple die rolls", function () {
                    var expression = dice.expression.forRoll(4, d3);
                    expect(expression.evaluate()).toBeExpressionResultWithValue(7);
                });
            });
        });
    });

    describe(".forSubtraction", function () {
        describe("when minuend expression is falsy", function () {
            it("should throw exception", function () {
                expect(function () {
                    dice.expression.forSubtraction(undefined, three);
                }).toThrow();
            });
        });

        describe("when subtrahend expression is falsy", function () {
            it("should throw exception", function () {
                expect(function () {
                    dice.expression.forSubtraction(four, undefined);
                }).toThrow();
            });
        });

        describe(".evaluate", function () {
            it("should return result with value equal to difference between minuend and subtrahend", function () {
                var expression = dice.expression.forSubtraction(four, three);
                expect(expression.evaluate()).toBeExpressionResultWithValue(1);
            });

            it("should evaluate subexpressions", function () {
                var expression = dice.expression.forSubtraction(dice.expression.forSubtraction(four, three), three);
                expect(expression.evaluate()).toBeExpressionResultWithValue(-2);
            });
        });
    });
});

