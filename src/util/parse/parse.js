import regulars from "./regularDefine";
import TOKEN_TYPE from "./tokenDefine";

function parse(string) {}

function lexer(string) {
  const len = string.length;
  const result = [];
  let tokens = string.match(token);
  if (tokens) {
    const [,token1, token2] = tokens;
    if(regulars.integer.test(token1))
      result.push(new Map().set(TOKEN_TYPE.integer,token1))
  }
  // while(true){
  //   let tokens = string.match(token)
  //   if(tokens){
  //     const [,token1,token2] = tokens
  //     console.log(token1,token2)
  //   }
  //   break
  // }
  // console.log(string.match(token)[1])
  return true;
}

module.exports = lexer;
