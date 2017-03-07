/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const _ = require('underscore')
const diceExpressionTypeIds = require('./dice-expression-type-ids')

/**
 * Provides methods for creating dice expression results.
 *
 * @module dice-expression-result
 */
module.exports = {
  /**
   * Creates a new addition expression result.
   *
   * @param {module:dice-expression-result~ExpressionResult!} augendExpressionResult -
   *      The augend expression result.
   * @param {module:dice-expression-result~ExpressionResult!} addendExpressionResult -
   *      The addend expression result.
   *
   * @returns {module:dice-expression-result~AdditionExpressionResult!} The
   *      new addition expression result.
   *
   * @throws {Error} If `augendExpressionResult` is not defined or its value
   *      is not a number, or if `addendExpressionResult` is not defined or
   *      its value is not a number.
   */
  forAddition (augendExpressionResult, addendExpressionResult) {
    if (!augendExpressionResult) {
      throw new Error('augend expression result is not defined')
    } else if (!_.isNumber(augendExpressionResult.value)) {
      throw new Error('augend expression result value is not a number')
    } else if (!addendExpressionResult) {
      throw new Error('addend expression result is not defined')
    } else if (!_.isNumber(addendExpressionResult.value)) {
      throw new Error('addend expression result value is not a number')
    }

    /**
     * The result of an expression that adds two expressions.
     *
     * @namespace AdditionExpressionResult
     */
    return {
      /**
       * Visits the expression result.
       *
       * @memberOf module:dice-expression-result~AdditionExpressionResult
       *
       * @param {Function!} visit - The visitor callback.
       */
      accept (visit) {
        visit(this)
        augendExpressionResult.accept(visit)
        addendExpressionResult.accept(visit)
      },

      /**
       * The addend expression result.
       *
       * @memberOf module:dice-expression-result~AdditionExpressionResult
       *
       * @type {module:dice-expression-result~ExpressionResult!}
       */
      addendExpressionResult,

      /**
       * The augend expression result.
       *
       * @memberOf module:dice-expression-result~AdditionExpressionResult
       *
       * @type {module:dice-expression-result~ExpressionResult!}
       */
      augendExpressionResult,

      /**
       * The expression result type identifier.
       *
       * @memberOf module:dice-expression-result~AdditionExpressionResult
       *
       * @type {String!}
       */
      typeId: diceExpressionTypeIds.ADDITION,

      /**
       * The value of the evaluated expression.
       *
       * @memberOf module:dice-expression-result~AdditionExpressionResult
       *
       * @type {Number!}
       */
      value: augendExpressionResult.value + addendExpressionResult.value
    }
  },

  /**
   * Creates a new array expression result.
   *
   * @param {module:dice-expression-result~ExpressionResult[]!} expressionResults -
   *      The array of expression results.
   *
   * @returns {module:dice-expression-result~ArrayExpressionResult!} The new
   *      array expression result.
   *
   * @throws {Error} If `expressionResults` is not an array.
   */
  forArray (expressionResults) {
    if (!_.isArray(expressionResults)) {
      throw new Error('expression results is not an array')
    }

    /**
     * An expression result that acts as an array of expression results.
     *
     * @namespace ArrayExpressionResult
     */
    return {
      /**
       * Visits the expression result.
       *
       * @memberOf module:dice-expression-result~ArrayExpressionResult
       *
       * @param {Function!} visit - The visitor callback.
       */
      accept (visit) {
        visit(this)
        _.invoke(expressionResults, 'accept', visit)
      },

      /**
       * The array of expression results.
       *
       * @memberOf module:dice-expression-result~ArrayExpressionResult
       *
       * @type {module:dice-expression-result~ExpressionResult[]!}
       */
      expressionResults,

      /**
       * The expression result type identifier.
       *
       * @memberOf module:dice-expression-result~ArrayExpressionResult
       *
       * @type {String!}
       */
      typeId: diceExpressionTypeIds.ARRAY,

      /**
       * The value of the evaluated expression.
       *
       * @memberOf module:dice-expression-result~ArrayExpressionResult
       *
       * @type {Object[]!}
       */
      value: _.pluck(expressionResults, 'value')
    }
  },

  /**
   * Creates a new constant expression result.
   *
   * @param {Number!} constant - The constant.
   *
   * @returns {module:dice-expression-result~ConstantExpressionResult!} The
   *      new constant expression result.
   *
   * @throws {Error} If `constant` is not a number.
   */
  forConstant (constant) {
    if (!_.isNumber(constant)) {
      throw new Error('constant is not a number')
    }

    /**
     * An expression result that represents a constant value.
     *
     * @namespace ConstantExpressionResult
     */
    return {
      /**
       * Visits the expression result.
       *
       * @memberOf module:dice-expression-result~ConstantExpressionResult
       *
       * @param {Function!} visit - The visitor callback.
       */
      accept (visit) {
        visit(this)
      },

      /**
       * The expression result type identifier.
       *
       * @memberOf module:dice-expression-result~ConstantExpressionResult
       *
       * @type {String!}
       */
      typeId: diceExpressionTypeIds.CONSTANT,

      /**
       * The value of the evaluated expression.
       *
       * @memberOf module:dice-expression-result~ConstantExpressionResult
       *
       * @type {Number!}
       */
      value: constant
    }
  },

  /**
   * Creates a new die expression result.
   *
   * @param {module:dice-bag~Die!} die - The die.
   *
   * @returns {module:dice-expression-result~DieExpressionResult!} The new
   *      die expression result.
   *
   * @throws {Error} If `die` is not defined.
   */
  forDie (die) {
    if (!die) {
      throw new Error('die is not defined')
    }

    /**
     * An expression result that represents a die.
     *
     * @namespace DieExpressionResult
     */
    return {
      /**
       * Visits the expression result.
       *
       * @memberOf module:dice-expression-result~DieExpressionResult
       *
       * @param {Function!} visit - The visitor callback.
       */
      accept (visit) {
        visit(this)
      },

      /**
       * The expression result type identifier.
       *
       * @memberOf module:dice-expression-result~DieExpressionResult
       *
       * @type {String!}
       */
      typeId: diceExpressionTypeIds.DIE,

      /**
       * The value of the evaluated expression.
       *
       * @memberOf module:dice-expression-result~DieExpressionResult
       *
       * @type {module:dice-bag~Die!}
       */
      value: die
    }
  },

  /**
   * Creates a new division expression result.
   *
   * @param {module:dice-expression-result~ExpressionResult!} dividendExpressionResult -
   *      The dividend expression result.
   * @param {module:dice-expression-result~ExpressionResult!} divisorExpressionResult -
   *      The divisor expression result.
   *
   * @returns {module:dice-expression-result~DivisionExpressionResult!} The
   *      new division expression result.
   *
   * @throws {Error} If `dividendExpressionResult` is not defined or its
   *      value is not a number, or if `divisorExpressionResult` is not
   *      defined or its value is not a number.
   */
  forDivision (dividendExpressionResult, divisorExpressionResult) {
    if (!dividendExpressionResult) {
      throw new Error('dividend expression result is not defined')
    } else if (!_.isNumber(dividendExpressionResult.value)) {
      throw new Error('dividend expression result value is not a number')
    } else if (!divisorExpressionResult) {
      throw new Error('divisor expression result is not defined')
    } else if (!_.isNumber(divisorExpressionResult.value)) {
      throw new Error('divisor expression result value is not a number')
    }

    /**
     * The result of an expression that divides two expressions.
     *
     * @namespace DivisionExpressionResult
     */
    return {
      /**
       * Visits the expression result.
       *
       * @memberOf module:dice-expression-result~DivisionExpressionResult
       *
       * @param {Function!} visit - The visitor callback.
       */
      accept (visit) {
        visit(this)
        dividendExpressionResult.accept(visit)
        divisorExpressionResult.accept(visit)
      },

      /**
       * The dividend expression result.
       *
       * @memberOf module:dice-expression-result~DivisionExpressionResult
       *
       * @type {module:dice-expression-result~ExpressionResult!}
       */
      dividendExpressionResult,

      /**
       * The divisor expression result.
       *
       * @memberOf module:dice-expression-result~DivisionExpressionResult
       *
       * @type {module:dice-expression-result~ExpressionResult!}
       */
      divisorExpressionResult,

      /**
       * The expression result type identifier.
       *
       * @memberOf module:dice-expression-result~DivisionExpressionResult
       *
       * @type {String!}
       */
      typeId: diceExpressionTypeIds.DIVISION,

      /**
       * The value of the evaluated expression.
       *
       * @memberOf module:dice-expression-result~DivisionExpressionResult
       *
       * @type {Number!}
       */
      value: dividendExpressionResult.value / divisorExpressionResult.value
    }
  },

  /**
   * Creates a new function call expression result.
   *
   * @param {Object!} returnValue - The function return value.
   * @param {String!} name - The function name.
   * @param {module:dice-expression-result~ExpressionResult[]!} argumentListExpressionResults -
   *      The expression results that represent the arguments to the function
   *      call.
   *
   * @returns {module:dice-expression-result~FunctionCallExpressionResult!}
   *      The new function call expression result.
   *
   * @throws {Error} If `returnValue` is not defined or `null`, or if `name`
   *      is not a string, or if `argumentListExpressionResults` is not an
   *      array.
   */
  forFunctionCall (returnValue, name, argumentListExpressionResults) {
    if (returnValue === undefined || returnValue === null) {
      throw new Error('return value is not defined')
    } else if (!_.isString(name)) {
      throw new Error('name is not defined')
    } else if (!_.isArray(argumentListExpressionResults)) {
      throw new Error('argument list expression results is not an array')
    }

    /**
     * The result of an expression that calls a function.
     *
     * @namespace FunctionCallExpressionResult
     */
    return {
      /**
       * Visits the expression result.
       *
       * @memberOf module:dice-expression-result~FunctionCallExpressionResult
       *
       * @param {Function!} visit - The visitor callback.
       */
      accept (visit) {
        visit(this)
        _.invoke(argumentListExpressionResults, 'accept', visit)
      },

      /**
       * The expression results that represent the arguments to the
       * function call.
       *
       * @memberOf module:dice-expression-result~FunctionCallExpressionResult
       *
       * @type {module:dice-expression-result~ExpressionResult[]!}
       */
      argumentListExpressionResults,

      /**
       * The function name.
       *
       * @memberOf module:dice-expression-result~FunctionCallExpressionResult
       *
       * @type {String!}
       */
      name,

      /**
       * The expression result type identifier.
       *
       * @memberOf module:dice-expression-result~FunctionCallExpressionResult
       *
       * @type {String!}
       */
      typeId: diceExpressionTypeIds.FUNCTION_CALL,

      /**
       * The value of the evaluated expression.
       *
       * @memberOf module:dice-expression-result~FunctionCallExpressionResult
       *
       * @type {Object!}
       */
      value: returnValue
    }
  },

  /**
   * Creates a new group expression result.
   *
   * @param {module:dice-expression-result~ExpressionResult!} childExpressionResult -
   *      The expression result that is grouped.
   *
   * @returns {module:dice-expression-result~GroupExpressionResult!} The new
   *      group expression result.
   *
   * @throws {Error} If `childExpressionResult` is not defined.
   */
  forGroup (childExpressionResult) {
    if (!childExpressionResult) {
      throw new Error('child expression result is not defined')
    }

    /**
     * The result of an expression that groups another expression.
     *
     * @namespace GroupExpressionResult
     */
    return {
      /**
       * Visits the expression result.
       *
       * @memberOf module:dice-expression-result~GroupExpressionResult
       *
       * @param {Function!} visit - The visitor callback.
       */
      accept (visit) {
        visit(this)
        childExpressionResult.accept(visit)
      },

      /**
       * The expression result that is grouped.
       *
       * @memberOf module:dice-expression-result~GroupExpressionResult
       *
       * @type {module:dice-expression-result~ExpressionResult!}
       */
      childExpressionResult,

      /**
       * The expression result type identifier.
       *
       * @memberOf module:dice-expression-result~GroupExpressionResult
       *
       * @type {String!}
       */
      typeId: diceExpressionTypeIds.GROUP,

      /**
       * The value of the evaluated expression.
       *
       * @memberOf module:dice-expression-result~GroupExpressionResult
       *
       * @type {Object!}
       */
      value: childExpressionResult.value
    }
  },

  /**
   * Creates a new modulo expression result.
   *
   * @param {module:dice-expression-result~ExpressionResult!} dividendExpressionResult -
   *      The dividend expression result.
   * @param {module:dice-expression-result~ExpressionResult!} divisorExpressionResult -
   *      The divisor expression result.
   *
   * @returns {module:dice-expression-result~ModuloExpressionResult!} The new
   *      modulo expression resykt.
   *
   * @throws {Error} If `dividendExpressionResult` is not defined or its
   *      value is not a number, or if `divisorExpressionResult` is not
   *      defined or its value is not a number.
   */
  forModulo (dividendExpressionResult, divisorExpressionResult) {
    if (!dividendExpressionResult) {
      throw new Error('dividend expression result is not defined')
    } else if (!_.isNumber(dividendExpressionResult.value)) {
      throw new Error('dividend expression result value is not a number')
    } else if (!divisorExpressionResult) {
      throw new Error('divisor expression result is not defined')
    } else if (!_.isNumber(divisorExpressionResult.value)) {
      throw new Error('divisor expression result value is not a number')
    }

    /**
     * The result of an expression that modulos two expressions.
     *
     * @namespace ModuloExpressionResult
     */
    return {
      /**
       * Visits the expression result.
       *
       * @memberOf module:dice-expression-result~ModuloExpressionResult
       *
       * @param {Function!} visit - The visitor callback.
       */
      accept (visit) {
        visit(this)
        dividendExpressionResult.accept(visit)
        divisorExpressionResult.accept(visit)
      },

      /**
       * The dividend expression result.
       *
       * @memberOf module:dice-expression-result~ModuloExpressionResult
       *
       * @type {module:dice-expression-result~ExpressionResult!}
       */
      dividendExpressionResult,

      /**
       * The divisor expression result.
       *
       * @memberOf module:dice-expression-result~ModuloExpressionResult
       *
       * @type {module:dice-expression-result~ExpressionResult!}
       */
      divisorExpressionResult,

      /**
       * The expression result type identifier.
       *
       * @memberOf module:dice-expression-result~ModuloExpressionResult
       *
       * @type {String!}
       */
      typeId: diceExpressionTypeIds.MODULO,

      /**
       * The value of the evaluated expression.
       *
       * @memberOf module:dice-expression-result~ModuloExpressionResult
       *
       * @type {Number!}
       */
      value: dividendExpressionResult.value % divisorExpressionResult.value
    }
  },

  /**
   * Creates a new multiplication expression result.
   *
   * @param {module:dice-expression-result~ExpressionResult!} multiplicandExpressionResult -
   *      The multiplicand expression result.
   * @param {module:dice-expression-result~ExpressionResult!} multiplierExpressionResult -
   *      The multiplier expression result.
   *
   * @returns {module:dice-expression-result~MultiplicationExpressionResult!}
   *      The new multiplication expression result.
   *
   * @throws {Error} If `multiplicandExpressionResult` is not defined or its
   *      value is not a number, or if `multiplierExpressionResult` is not
   *      defined or its value is not a number.
   */
  forMultiplication (multiplicandExpressionResult, multiplierExpressionResult) {
    if (!multiplicandExpressionResult) {
      throw new Error('multiplicand expression result is not defined')
    } else if (!_.isNumber(multiplicandExpressionResult.value)) {
      throw new Error('multiplicand expression result value is not a number')
    } else if (!multiplierExpressionResult) {
      throw new Error('multiplier expression result is not defined')
    } else if (!_.isNumber(multiplierExpressionResult.value)) {
      throw new Error('multiplier expression result value is not a number')
    }

    /**
     * The result of an expression that multiplies two expressions.
     *
     * @namespace MultiplicationExpressionResult
     */
    return {
      /**
       * Visits the expression result.
       *
       * @memberOf module:dice-expression-result~MultiplicationExpressionResult
       *
       * @param {Function!} visit - The visitor callback.
       */
      accept (visit) {
        visit(this)
        multiplicandExpressionResult.accept(visit)
        multiplierExpressionResult.accept(visit)
      },

      /**
       * The multiplicand expression result.
       *
       * @memberOf module:dice-expression-result~MultiplicationExpressionResult
       *
       * @type {module:dice-expression-result~ExpressionResult!}
       */
      multiplicandExpressionResult,

      /**
       * The multiplier expression result.
       *
       * @memberOf module:dice-expression-result~MultiplicationExpressionResult
       *
       * @type {module:dice-expression-result~ExpressionResult!}
       */
      multiplierExpressionResult,

      /**
       * The expression result type identifier.
       *
       * @memberOf module:dice-expression-result~MultiplicationExpressionResult
       *
       * @type {String!}
       */
      typeId: diceExpressionTypeIds.MULTIPLICATION,

      /**
       * The value of the evaluated expression.
       *
       * @memberOf module:dice-expression-result~MultiplicationExpressionResult
       *
       * @type {Number!}
       */
      value: multiplicandExpressionResult.value * multiplierExpressionResult.value
    }
  },

  /**
   * Creates a new negative expression result.
   *
   * @param {module:dice-expression-result~ExpressionResult!} childExpressionResult -
   *      The result of the expression to be negated.
   *
   * @returns {module:dice-expression-result~NegativeExpressionResult!} The
   *      new negative expression result.
   *
   * @throws {Error} If `childExpressionResult` is not defined.
   */
  forNegative (childExpressionResult) {
    if (!childExpressionResult) {
      throw new Error('child expression result is not defined')
    }

    /**
     * The result of an expression that negates another expression.
     *
     * @namespace NegativeExpressionResult
     */
    return {
      /**
       * Visits the expression result.
       *
       * @memberOf module:dice-expression-result~NegativeExpressionResult
       *
       * @param {Function!} visit - The visitor callback.
       */
      accept (visit) {
        visit(this)
        childExpressionResult.accept(visit)
      },

      /**
       * The result of the expression to be negated.
       *
       * @memberOf module:dice-expression-result~NegativeExpressionResult
       *
       * @type {module:dice-expression-result~ExpressionResult!}
       */
      childExpressionResult,

      /**
       * The expression result type identifier.
       *
       * @memberOf module:dice-expression-result~NegativeExpressionResult
       *
       * @type {String!}
       */
      typeId: diceExpressionTypeIds.NEGATIVE,

      /**
       * The value of the evaluated expression.
       *
       * @memberOf module:dice-expression-result~NegativeExpressionResult
       *
       * @type {Object!}
       */
      value: -childExpressionResult.value
    }
  },

  /**
   * Creates a new positive expression result.
   *
   * @param {module:dice-expression-result~ExpressionResult!} childExpressionResult -
   *      The result of the expression to be applied.
   *
   * @returns {module:dice-expression-result~PositiveExpressionResult!} The
   *      new positive expression result.
   *
   * @throws {Error} If `childExpressionResult` is not defined.
   */
  forPositive (childExpressionResult) {
    if (!childExpressionResult) {
      throw new Error('child expression result is not defined')
    }

    /**
     * The result of an expression that applies another expression.
     *
     * @namespace PositiveExpressionResult
     */
    return {
      /**
       * Visits the expression result.
       *
       * @memberOf module:dice-expression-result~PositiveExpressionResult
       *
       * @param {Function!} visit - The visitor callback.
       */
      accept (visit) {
        visit(this)
        childExpressionResult.accept(visit)
      },

      /**
       * The result of the expression to be applied.
       *
       * @memberOf module:dice-expression-result~PositiveExpressionResult
       *
       * @type {module:dice-expression-result~ExpressionResult!}
       */
      childExpressionResult,

      /**
       * The expression result type identifier.
       *
       * @memberOf module:dice-expression-result~PositiveExpressionResult
       *
       * @type {String!}
       */
      typeId: diceExpressionTypeIds.POSITIVE,

      /**
       * The value of the evaluated expression.
       *
       * @memberOf module:dice-expression-result~PositiveExpressionResult
       *
       * @type {Object!}
       */
      value: childExpressionResult.value
    }
  },

  /**
   * Creates a new subtraction expression result.
   *
   * @param {module:dice-expression-result~ExpressionResult!} minuendExpressionResult -
   *      The minuend expression result.
   * @param {module:dice-expression-result~ExpressionResult!} subtrahendExpressionResult -
   *      The subtrahend expression result.
   *
   * @returns {module:dice-expression-result~SubtractionExpressionResult!}
   *      The new subtraction expression result.
   *
   * @throws {Error} If `minuendExpressionResult` is not defined or its value
   *      is not a number, or if `subtrahendExpressionResult` is not defined
   *      or its value is not a number.
   */
  forSubtraction (minuendExpressionResult, subtrahendExpressionResult) {
    if (!minuendExpressionResult) {
      throw new Error('minuend expression result is not defined')
    } else if (!_.isNumber(minuendExpressionResult.value)) {
      throw new Error('minuend expression result value is not a number')
    } else if (!subtrahendExpressionResult) {
      throw new Error('subtrahend expression result is not defined')
    } else if (!_.isNumber(subtrahendExpressionResult.value)) {
      throw new Error('subtrahend expression result value is not a number')
    }

    /**
     * The result of an expression that subtracts two expressions.
     *
     * @namespace SubtractionExpressionResult
     */
    return {
      /**
       * Visits the expression result.
       *
       * @memberOf module:dice-expression-result~SubtractionExpressionResult
       *
       * @param {Function!} visit - The visitor callback.
       */
      accept (visit) {
        visit(this)
        minuendExpressionResult.accept(visit)
        subtrahendExpressionResult.accept(visit)
      },

      /**
       * The minuend expression result.
       *
       * @memberOf module:dice-expression-result~SubtractionExpressionResult
       *
       * @type {module:dice-expression-result~ExpressionResult!}
       */
      minuendExpressionResult,

      /**
       * The subtrahend expression result.
       *
       * @memberOf module:dice-expression-result~SubtractionExpressionResult
       *
       * @type {module:dice-expression-result~ExpressionResult!}
       */
      subtrahendExpressionResult,

      /**
       * The expression result type identifier.
       *
       * @memberOf module:dice-expression-result~SubtractionExpressionResult
       *
       * @type {String!}
       */
      typeId: diceExpressionTypeIds.SUBTRACTION,

      /**
       * The value of the evaluated expression.
       *
       * @memberOf module:dice-expression-result~SubtractionExpressionResult
       *
       * @type {Number!}
       */
      value: minuendExpressionResult.value - subtrahendExpressionResult.value
    }
  }
}
