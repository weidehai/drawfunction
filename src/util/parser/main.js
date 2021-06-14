import { tokenRegular } from "./regularDefine";
import handler from './handler'

function tokenPaser(string) {
  let results = [];
  let isContinue = false;
  while (string) {
    isContinue = false;
    string = string.replace(tokenRegular, (match, $1) => {
      isContinue = true;
      results.push(match);
      return "";
    });
    if (!isContinue && string) throw "illegal expression";
  }
  return buildChild(results);
}

function buildChild(tokenList) {
  let results = [];
  let token = tokenList.shift();
  while (token) {
    if (token === "(") {
      let childExpression = "";
      token = tokenList.shift();
      let leftParentheses = 1;
      let rightParentheses = 0;
      while (token) {
        if (token === "(") leftParentheses++;
        if (token === ")") rightParentheses++;
        if (leftParentheses === rightParentheses) break;
        childExpression += token;
        token = tokenList.shift();
      }
      if (leftParentheses !== rightParentheses)
        throw "leftParentheses and leftParentheses are mismatching";
      results.push(tokenPaser(childExpression));
    } else {
      results.push(token);
    }
    token = tokenList.shift();
  }
  return results;
}

function expressionGenerator(tokenList) {
  const produceExpression = function(results) {
    results.unshift("(");
    results.push(")");
    return results.join("");
  };
  let results = [];
  let token = tokenList.shift();
  while (token) {
    if (Array.isArray(token)) {
      results.push(expressionGenerator(token));
      token = tokenList.shift();
      continue;
    }
    if(handler[token]){
      handler[token](results,tokenList,token)
    }else{
      results.push(token);
    }
    token = tokenList.shift();
  }
  return produceExpression(results)
}


function expressionParser(string){
  return expressionGenerator(tokenPaser(string))
}

export default expressionParser
export {expressionGenerator}
