/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const diceExpressionTypeIds = require('./dice-expression-type-ids')

/**
 * Provides utility methods for working with dice expression results.
 *
 * @module dice-expression-result-utils
 */
module.exports = {
  /**
   * Enumerates the die roll results contained in the specified expression
   * result.
   *
   * @param {module:dice-expression-result~ExpressionResult!} expressionResult -
   *      The expression result to examine.
   *
   * @returns {module:dice-expression-result-utils~DieRollResult[]!}
   *      An array containing the enumerated die roll results.
   *
   * @example
   * // returns [
   * //     {
   * //         sides: 6,
   * //         value: 2,
   * //     },
   * //     {
   * //         sides: 6,
   * //         value: 5,
   * //     },
   * //     {
   * //         sides: 4,
   * //         value: 3,
   * //     }
   * // ]
   * //
   * // (values may differ)
   * diceExpressionResultUtils.enumerateDieRollResults(diceExpressionParser.parse('2d6+1d4+1'))
   */
  enumerateDieRollResults (expressionResult) {
    const dieRollResults = []

    expressionResult.accept((expressionResult) => {
      if (expressionResult.typeId === diceExpressionTypeIds.FUNCTION_CALL && expressionResult.name === 'roll') {
        const dieRollValues = expressionResult.value
        const dieSides = expressionResult.argumentListExpressionResults[1].value.sides
        for (const dieRollValue of dieRollValues) {
          dieRollResults.push({
            sides: dieSides,
            value: dieRollValue
          })
        }
      }
    })
    return dieRollResults
  }
}
