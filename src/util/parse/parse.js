import regulars from "./regularDefine";
import TOKEN_TYPE from "./tokenDefine";
import { trimAllWhiteSpace } from "../main";
import tokenParseError from "./error";

function parse(string) {}

function lexer(string) {
  const len = string.length;
  const result = [];
  let parseFlag = 1;
  let isEnd = false;
  string = trimAllWhiteSpace(string);
  while (parseFlag) {
    parseFlag &= 0;
    string = string.replace(regulars.token, (match, $1, $2, $3) => {
      parseFlag |= 1;
      const [token1, , token3] = [$1, $2, $3];
      if (regulars.integer.test(token1))
        result.push(new Map().set(TOKEN_TYPE.integer, token1));
      if (regulars.float.test(token1))
        result.push(new Map().set(TOKEN_TYPE.float, token1));
      if (token3) result.push(new Map().set(TOKEN_TYPE[token3], token3));
      if (!token3) isEnd = true;
      return "";
    });
  }
  if (!isEnd) throw tokenParseError("something error in lexer");
  console.log(result);
  return isEnd ? true : false;
}

module.exports = lexer;
