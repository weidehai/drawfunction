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

const AST = []
let candidateNode = null
function parse(tokens){
  candidateNode = tokens.next
  while(candidateNode){
    AST.push(expression(candidateNode))
  }
  console.log(AST)
}

function expression(token){
  console.log(token)
  if(token.type===TOKEN_TYPE.TT_LN){
    return unaryOp(token)
  }
  if(token.type===TOKEN_TYPE.TT_LPARNET){

  }
  if(token.type===TOKEN_TYPE.TT_INT || token.type===TOKEN_TYPE.TT_FLOAT){
    candidateNode = token.next
    return new NumberNode(token.type,token.value)
  }
  if(token.type===TOKEN_TYPE.TT_PLUS || token.type===TOKEN_TYPE.TT_SUB){
    const operationNode = new OperationNode(token.type)
    operationNode.left = AST.pop()
    operationNode.right = expression(token.next)
    return operationNode
  }
}


function unaryOp(token){
  const nextToken = token.next
  if(isFourOperation(nextToken) || isLogarithm(nextToken) || isTrigonometry(nextToken) || isRightParentheses(nextToken)) throw syntaxError('syntax analysis error')
  const logarithmNode = new LogarithmNode(token.type)
  if(isLeftParentheses(nextToken)){
    logarithmNode.exp = expression(nextToken)
  }
  if(isNumber(nextToken)){
    logarithmNode.exp = expression(nextToken)
  }
  return logarithmNode
}


function LogarithmNode(type,exp){
  this.type = type
  this.exp = exp
}

function OperationNode(type,left,right){
  this.type = type
  this.left = left
  this.right = right
}

function NumberNode(type,value){
  this.type = type
  this.value = value
}


function isFourOperation(token){
  const type = token.type
  return type === TOKEN_TYPE.TT_PLUS || type === TOKEN_TYPE.TT_SUB || type === TOKEN_TYPE.TT_MUL || type === TOKEN_TYPE.TT_DIV
}

function isLogarithm(token){
  const type = token.type
  return type === TOKEN_TYPE.TT_LOG || type === TOKEN_TYPE.TT_LN || type === TOKEN_TYPE.TT_LG
}


function isTrigonometry(token){
  const type = token.type
  return type === TOKEN_TYPE.TT_SIN || type === TOKEN_TYPE.TT_COS || type === TOKEN_TYPE.TT_TAN || type === TOKEN_TYPE.TT_COT
}

function isLeftParentheses(token){
  const type = token.type
  return type === TOKEN_TYPE.TT_LPARNET
}

function isRightParentheses(token){
  const type = token.type
  return type === TOKEN_TYPE.TT_RPARNET
}

function isNumber(token){
  const type = token.type
  return type === TOKEN_TYPE.TT_INT || type === TOKEN_TYPE.TT_FLOAT
}


module.exports = parse













