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

%lex

DIGIT               [0-9]
PERCENT             [%]
POSITIVE_INTEGER    [1-9][0-9]*

%%

\s+                                                 /* skip whitespace */
{POSITIVE_INTEGER}?d({POSITIVE_INTEGER}|{PERCENT})  return 'DICE_LITERAL'
{DIGIT}+                                            return 'INTEGER_LITERAL'
"-"                                                 return 'MINUS'
"+"                                                 return 'PLUS'
"*"                                                 return 'STAR'
.                                                   throw 'illegal character'
<<EOF>>                                             return 'EOF'

/lex

%left PLUS MINUS
%left STAR
%start expressions

%%

expressions
    : expression EOF
        {
            return $1;
        }
    ;

expression
    : expression PLUS expression
        {
            $$ = diceExpression.forAddition($1, $3);
        }
    | expression MINUS expression
        {
            $$ = diceExpression.forSubtraction($1, $3);
        }
    | expression STAR expression
        {
            $$ = diceExpression.forMultiplication($1, $3);
        }
    | literal
    ;

literal
    : DICE_LITERAL
        {
            var components = yytext.split("d");
            var count = components[0] ? Number(components[0]) : 1;
            var sides = (components[1] === "%") ? 100 : Number(components[1]);
            $$ = diceExpression.forRoll(count, yy.__bag.d(sides));
        }
    | INTEGER_LITERAL
        {
            $$ = diceExpression.forConstant(Number(yytext));
        }
    ;

%%

var DiceBag = require("./dice-bag");
var diceExpression = require("./dice-expression");

module.exports.create = function (bag) {
    var parser = new Parser();
    parser.yy.__bag = bag || new DiceBag();
    return parser;
}

