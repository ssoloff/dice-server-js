/*
 * Copyright (c) 2016 Steven Soloff
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
            var constant = Number($1);
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

var diceExpression = require('./dice-expression');
var diceExpressionParserUtils = require('./dice-expression-parser-utils');

function createParser(context) {
    var parser = new Parser();

    parser.yy.__context = context || diceExpressionParserUtils.createDefaultContext();
    return parser;
}

module.exports = {
    create: createParser,
    createDefaultContext: diceExpressionParserUtils.createDefaultContext
};
