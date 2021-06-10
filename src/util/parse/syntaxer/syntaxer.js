/*
factor:int|float|lparent|rparent|ln|lg|log|sin|cos|tan|cot|exponent
unaryOp:
  (ln|log|lg|sin|cos|tan|cot) lparent expression rparent
  (sub|plus) factor
  (ln|log|lg|sin|cos|tan|cot) unaryOp
  (ln|log|lg|sin|cos|tan|cot) factor
binaryOp:
  sub|plus|mul|div
expression:
  int | float
  unaryOp expression

*/

import TOKEN_TYPE from '../lexer/tokenDefine'
import {syntaxError} from './error'


function parse(tokens){
  for(let i=0;i<tokens.length;i++){
    if(tokens[i].type==TOKEN_TYPE.TT_LN){
      unaryOp(tokens[i],tokens[i+1])
    }
  }
}


function unaryOp(token,nextToken){
  if(isFourOperation(nextToken) || isLogarithm(nextToken) || isTrigonometry(nextToken)) throw syntaxError('syntax analysis error')

}


function isFourOperation(type){
  type === TOKEN_TYPE.TT_PLUS || type === TOKEN_TYPE.TT_SUB || type === TOKEN_TYPE.TT_MUL || type === TOKEN_TYPE.TT_DIV
}

function isLogarithm(){
  type === TOKEN_TYPE.TT_LOG || type === TOKEN_TYPE.TT_LN || type === TOKEN_TYPE.TT_LG
}


function isTrigonometry(){
  type === TOKEN_TYPE.TT_SIN || type === TOKEN_TYPE.TT_COS || type === TOKEN_TYPE.TT_TAN || type === TOKEN_TYPE.TT_COT
}














