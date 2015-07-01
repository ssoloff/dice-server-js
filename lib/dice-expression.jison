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
IDENTIFIER          [_A-Za-z][_0-9A-Za-z]*
PERCENT             [%]
POSITIVE_INTEGER    [1-9][0-9]*

%%

\s+                                                 /* skip whitespace */
","                                                 return "COMMA"
{POSITIVE_INTEGER}d({POSITIVE_INTEGER}|{PERCENT})   return "DICE_ROLL_LITERAL"
d({POSITIVE_INTEGER}|{PERCENT})                     return "DIE_LITERAL"
{IDENTIFIER}                                        return "IDENTIFIER"
{DIGIT}+                                            return "INTEGER_LITERAL"
"("                                                 return "LPAREN"
"-"                                                 return "MINUS"
"+"                                                 return "PLUS"
")"                                                 return "RPAREN"
"/-"                                                return "SLASH_MINUS"
"/+"                                                return "SLASH_PLUS"
"//"                                                return "SLASH_SLASH"
"/~"                                                return "SLASH_TILDE"
"/"                                                 return "SLASH"
"*"                                                 return "STAR"
.                                                   throw "illegal character"
<<EOF>>                                             return "EOF"

/lex

%left PLUS MINUS
%left STAR SLASH SLASH_SLASH
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

ArgumentList
    : /* empty */
        {
            $$ = [];
        }
    | Expression
        {
            $$ = [$1];
        }
    | ArgumentList COMMA Expression
        {
            $$.push($3);
        }
    ;

Expression
    : AdditiveExpression
    ;

FunctionCall
    : IDENTIFIER LPAREN ArgumentList RPAREN
        {
            $$ = createFunctionCallExpression(yy.__context, $1, $3);
        }
    ;

Literal
    : DIE_LITERAL
        {
            var sides = Number($1.substr(1));
            $$ = createDieExpression(yy.__context, sides);
        }
    | DICE_ROLL_LITERAL
        {
            var components = $1.split("d");
            var count = Number(components[0]);
            var sides = (components[1] === "%") ? 100 : Number(components[1]);
            $$ = createFunctionCallExpression(yy.__context, "sum", [
                createFunctionCallExpression(yy.__context, "roll", [
                    diceExpression.forConstant(count),
                    createDieExpression(yy.__context, sides)
                ])
            ]);
        }
    | INTEGER_LITERAL
        {
            var constant = Number($1);
            $$ = diceExpression.forConstant(constant);
        }
    ;

MultiplicativeExpression
    : MultiplicativeExpression STAR PrimaryExpression
        {
            $$ = diceExpression.forMultiplication($1, $3);
        }
    | MultiplicativeExpression SLASH PrimaryExpression
        {
            $$ = diceExpression.forDivision($1, $3);
        }
    | MultiplicativeExpression SLASH_SLASH PrimaryExpression
        {
            $$ = createFunctionCallExpression(yy.__context, "trunc", [diceExpression.forDivision($1, $3)]);
        }
    | MultiplicativeExpression SLASH_TILDE PrimaryExpression
        {
            $$ = createFunctionCallExpression(yy.__context, "round", [diceExpression.forDivision($1, $3)]);
        }
    | MultiplicativeExpression SLASH_MINUS PrimaryExpression
        {
            $$ = createFunctionCallExpression(yy.__context, "floor", [diceExpression.forDivision($1, $3)]);
        }
    | MultiplicativeExpression SLASH_PLUS PrimaryExpression
        {
            $$ = createFunctionCallExpression(yy.__context, "ceil", [diceExpression.forDivision($1, $3)]);
        }
    | PrimaryExpression
    ;

PrimaryExpression
    : Literal
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

%%

var DiceBag = require("./dice-bag");
var diceExpression = require("./dice-expression");
var diceExpressionFunctions = require("./dice-expression-functions");

function createDefaultContext() {
    return {
        bag: new DiceBag(),
        functions: {}
    };
}

function createDieExpression(context, sides) {
    return diceExpression.forDie(context.bag.d(sides));
}

function createFunctionCallExpression(context, name, argumentListExpressions) {
    var func = context.functions[name] || diceExpressionFunctions[name];
    return diceExpression.forFunctionCall(name, func, argumentListExpressions);
}

function createParser(context) {
    var parser = new Parser();
    parser.yy.__context = context || createDefaultContext();
    return parser;
}

module.exports.create = createParser;
module.exports.createDefaultContext = createDefaultContext;

