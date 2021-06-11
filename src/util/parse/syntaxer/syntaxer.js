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

import TOKEN_TYPE from "../lexer/tokenDefine";
import { syntaxError } from "./error";

const context = {
  nodeStack: [],
  parenthesesNodeStack: [],
  previousToken: null,
  previousNode: null,
  currentToken: null,
  candidateNode: null,
  inParentheses: false
};

function parse(tokens) {
  context.candidateNode = tokens.next;
  context.currentToken = tokens.next;
  context.nodeStack = [];
  context.parenthesesNodeStack = [];
  while (context.candidateNode) {
    let result = expression(context.candidateNode);
    if (result) {
      context.nodeStack.push(result);
    }
  }
  console.log(context.nodeStack);
}

function expression(token) {
  if (isLogarithm(token)) {
    if (token.next.type !== TOKEN_TYPE.TT_LPARNET)
      throw "function of unaryOpNode must along with left parentheses";
    let unaryNode;
    if (token.type === TOKEN_TYPE.TT_LN) {
      unaryNode = new lnNode("lnFunction");
    } else if (token.type === TOKEN_TYPE.TT_LG) {
      unaryNode = new lgNode("lgFunction");
    } else if (token.type === TOKEN_TYPE.TT_LOG) {
      unaryNode = new logNode("logFunction");
    }
    unaryNode.exp = expression(token.next);
    return unaryNode;
  }
  if (token.type === TOKEN_TYPE.TT_LPARNET) {
    context.inParentheses = true;
    context.candidateNode = token.next;
    let _nodeStack = context.nodeStack;
    context.nodeStack = [];
    while (context.candidateNode.type !== TOKEN_TYPE.TT_RPARNET) {
      //context.previousToken = token;
      context.nodeStack.push(expression(context.candidateNode));
    }
    context.candidateNode = context.candidateNode.next;
    let _nodeStack1 = context.nodeStack[0];
    context.previousNode = _nodeStack1;
    context.nodeStack = _nodeStack;
    return _nodeStack1;
  }
  if (token.type === TOKEN_TYPE.TT_INT || token.type === TOKEN_TYPE.TT_FLOAT) {
    context.candidateNode = token.next;
    context.previousToken = token;
    if (token.next && token.next.type === TOKEN_TYPE.TT_EXPONENT) {
      let exponentNode = new ExponentNode(token.type);
      exponentNode.value = token.value;
      exponentNode.exponent = expression(token.next.next);
      context.candidateNode = token.next.next;
      context.previousToken = token.next;
      return exponentNode;
    }
    return (context.previousNode = new NumberNode(token.type, token.value));
  }
  if (token.type === TOKEN_TYPE.TT_PLUS || token.type === TOKEN_TYPE.TT_SUB) {
    let operationNode = new OperationNode(token.type);
    if (
      context.previousToken &&
      (context.previousToken.type === TOKEN_TYPE.TT_PLUS ||
        context.previousToken.type === TOKEN_TYPE.TT_SUB ||
        context.previousToken.type == TOKEN_TYPE.TT_LPARNET)
    ) {
      //一元操作符
      let unaryNode;
      if (token.type == TOKEN_TYPE.TT_SUB) {
        unaryNode = new MinusNode("minus");
      } else if (token.type == TOKEN_TYPE.TT_PLUS) {
        unaryNode = new positiveNode("positive");
      }
      unaryNode.exp = expression(token.next);
      return unaryNode;
    }
    operationNode.left = context.nodeStack.pop();
    operationNode.left.parent = operationNode;
    context.previousToken = token;
    operationNode.right = expression(token.next);
    operationNode.right.parent = operationNode;
    return operationNode;
  }
  if (token.type === TOKEN_TYPE.TT_MUL || token.type === TOKEN_TYPE.TT_DIV) {
    let operationNode = new OperationNode(token.type);
    let shouldReturn = false;
    if (context.previousNode && context.previousNode.parent) {
      context.previousNode.parent.right = operationNode;
      operationNode.left = context.previousNode;
      context.previousNode.parent = operationNode;
    } else {
      shouldReturn = true;
      operationNode.left = context.nodeStack.pop();
      operationNode.left.parent = operationNode;
    }
    operationNode.right = expression(token.next);
    operationNode.right.parent = operationNode;
    return shouldReturn ? operationNode : null;
  }
}

// function unaryOp(token) {
//   const nextToken = token.next;
//   if (
//     isFourOperation(nextToken) ||
//     isLogarithm(nextToken) ||
//     isTrigonometry(nextToken) ||
//     isRightParentheses(nextToken)
//   )
//     throw syntaxError("syntax analysis error");
//   const logarithmNode = new LogarithmNode(token.type);
//   if (isLeftParentheses(nextToken)) {
//     logarithmNode.exp = expression(nextToken);
//   }
//   if (isNumber(nextToken)) {
//     logarithmNode.exp = expression(nextToken);
//   }
//   return logarithmNode;
// }

function LogarithmNode(type, exp) {
  this.type = type;
  this.exp = exp;
  this.parent = null;
}

function ExponentNode(type, value, exponent, parent) {
  this.type = type;
  this.value = value;
  this.exponent = exponent;
  this.parent = parent;
}

function MinusNode(type, exp) {
  this.type = type;
  this.exp = exp;
  this.parent = null;
}
function positiveNode(type, exp) {
  this.type = type;
  this.exp = exp;
  this.parent = null;
}

function lnNode(type, exp) {
  this.type = type;
  this.exp = exp;
  this.parent = null;
}
function lgNode(type, exp) {
  this.type = type;
  this.exp = exp;
  this.parent = null;
}
function logNode(type, exp) {
  this.type = type;
  this.exp = exp;
  this.parent = null;
}

function unaryOpNode(type, exp) {
  this.type = type;
  this.exp = exp;
  this.parent = null;
}

function OperationNode(type, left, right) {
  this.type = type;
  this.left = left;
  this.right = right;
  this.parent = null;
}

function NumberNode(type, value) {
  this.type = type;
  this.value = value;
  this.parent = null;
}

function isFourOperation(token) {
  const type = token.type;
  return (
    type === TOKEN_TYPE.TT_PLUS ||
    type === TOKEN_TYPE.TT_SUB ||
    type === TOKEN_TYPE.TT_MUL ||
    type === TOKEN_TYPE.TT_DIV
  );
}

function isLogarithm(token) {
  const type = token.type;
  return (
    type === TOKEN_TYPE.TT_LOG ||
    type === TOKEN_TYPE.TT_LN ||
    type === TOKEN_TYPE.TT_LG
  );
}

function isTrigonometry(token) {
  const type = token.type;
  return (
    type === TOKEN_TYPE.TT_SIN ||
    type === TOKEN_TYPE.TT_COS ||
    type === TOKEN_TYPE.TT_TAN ||
    type === TOKEN_TYPE.TT_COT
  );
}

function isLeftParentheses(token) {
  const type = token.type;
  return type === TOKEN_TYPE.TT_LPARNET;
}

function isRightParentheses(token) {
  const type = token.type;
  return type === TOKEN_TYPE.TT_RPARNET;
}

function isNumber(token) {
  const type = token.type;
  return type === TOKEN_TYPE.TT_INT || type === TOKEN_TYPE.TT_FLOAT;
}

module.exports = parse;
