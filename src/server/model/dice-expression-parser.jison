/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

%lex

DIGIT               [0-9]
IDENTIFIER          [_A-Za-z][_0-9A-Za-z]*
PERCENT             [%]
POSITIVE_INTEGER    [1-9][0-9]*

%%

\s+                                                                               /* skip whitespace */
","                                                                               return 'COMMA'
{POSITIVE_INTEGER}d({POSITIVE_INTEGER}|{PERCENT})([-+]{POSITIVE_INTEGER}?[HL])?   return 'DICE_ROLL_LITERAL'
d({POSITIVE_INTEGER}|{PERCENT})                                                   return 'DIE_LITERAL'
{IDENTIFIER}                                                                      return 'IDENTIFIER'
{DIGIT}+                                                                          return 'INTEGER_LITERAL'
"("                                                                               return 'LPAREN'
"["                                                                               return 'LSQUAREBRACE'
"-"                                                                               return 'MINUS'
"%"                                                                               return 'PERCENT'
"+"                                                                               return 'PLUS'
")"                                                                               return 'RPAREN'
"]"                                                                               return 'RSQUAREBRACE'
"/-"                                                                              return 'SLASH_MINUS'
"/+"                                                                              return 'SLASH_PLUS'
"//"                                                                              return 'SLASH_SLASH'
"/~"                                                                              return 'SLASH_TILDE'
"/"                                                                               return 'SLASH'
"*"                                                                               return 'STAR'
.                                                                                 throw new Error('illegal character')
<<EOF>>                                                                           return 'EOF'

/lex

%left PLUS MINUS
%left STAR SLASH SLASH_SLASH SLASH_TILDE SLASH_PLUS SLASH_MINUS PERCENT
%start Program

%%

AdditiveExpression
  : AdditiveExpression PLUS MultiplicativeExpression
    {
      $$ = diceExpression.forAddition($1, $3);
    }
  | AdditiveExpression MINUS MultiplicativeExpression
    {
      $$ = diceExpression.forSubtraction($1, $3);
    }
  | MultiplicativeExpression
  ;

ArrayLiteral
  : LSQUAREBRACE ExpressionList RSQUAREBRACE
    {
      $$ = diceExpression.forArray($2);
    }
  ;

Expression
  : AdditiveExpression
  ;

ExpressionList
  : /* empty */
    {
      $$ = [];
    }
  | Expression
    {
      $$ = [$1];
    }
  | ExpressionList COMMA Expression
    {
      $$.push($3);
    }
  ;

FunctionCall
  : IDENTIFIER LPAREN ExpressionList RPAREN
    {
      $$ = diceExpressionParserUtils.createFunctionCallExpression(yy.__context, $1, $3);
    }
  ;

Literal
  : DIE_LITERAL
    {
      $$ = diceExpressionParserUtils.createDieExpression(yy.__context, $1);
    }
  | DICE_ROLL_LITERAL
    {
      $$ = diceExpressionParserUtils.createDiceRollExpression(yy.__context, $1);
    }
  | INTEGER_LITERAL
    {
      const constant = Number($1);
      $$ = diceExpression.forConstant(constant);
    }
  ;

MultiplicativeExpression
  : MultiplicativeExpression STAR UnaryExpression
    {
      $$ = diceExpression.forMultiplication($1, $3);
    }
  | MultiplicativeExpression SLASH UnaryExpression
    {
      $$ = diceExpression.forDivision($1, $3);
    }
  | MultiplicativeExpression SLASH_SLASH UnaryExpression
    {
      $$ = diceExpressionParserUtils.createFunctionCallExpression(yy.__context, 'trunc', [diceExpression.forDivision($1, $3)]);
    }
  | MultiplicativeExpression SLASH_TILDE UnaryExpression
    {
      $$ = diceExpressionParserUtils.createFunctionCallExpression(yy.__context, 'round', [diceExpression.forDivision($1, $3)]);
    }
  | MultiplicativeExpression SLASH_MINUS UnaryExpression
    {
      $$ = diceExpressionParserUtils.createFunctionCallExpression(yy.__context, 'floor', [diceExpression.forDivision($1, $3)]);
    }
  | MultiplicativeExpression SLASH_PLUS UnaryExpression
    {
      $$ = diceExpressionParserUtils.createFunctionCallExpression(yy.__context, 'ceil', [diceExpression.forDivision($1, $3)]);
    }
  | MultiplicativeExpression PERCENT UnaryExpression
    {
      $$ = diceExpression.forModulo($1, $3);
    }
  | UnaryExpression
  ;

PrimaryExpression
  : Literal
  | ArrayLiteral
  | FunctionCall
  | LPAREN Expression RPAREN
    {
      $$ = diceExpression.forGroup($2);
    }
  ;

Program
  : Expression EOF
    {
      return $1;
    }
  ;

UnaryExpression
  : PLUS PrimaryExpression
    {
      $$ = diceExpression.forPositive($2);
    }
  | MINUS PrimaryExpression
    {
      $$ = diceExpression.forNegative($2);
    }
  | PrimaryExpression
  ;

%%

const diceExpression = require('./dice-expression');
const diceExpressionParserUtils = require('./dice-expression-parser-utils');

function createParser(context) {
  const parser = new Parser();
  parser.yy.__context = context || diceExpressionParserUtils.createDefaultContext();
  return parser;
}

module.exports = {
  create: createParser,
  createDefaultContext: diceExpressionParserUtils.createDefaultContext
};
