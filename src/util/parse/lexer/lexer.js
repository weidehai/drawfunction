import { trimAllWhiteSpace } from "../main";
import {tokenParseError} from "./error";
import createTokenMatcherChain from './tokenMatcherChain'
import TOKEN_TYPE from "./tokenDefine";


function parser(string) {

}

function lexer(string) {
  let tokenObj
  let result = []
  string = trimAllWhiteSpace(string);
  const tokenMatcherChain = createTokenMatcherChain()
  do{
    tokenObj = tokenMatcherChain.doWork(string)
    if(tokenObj){
      string = string.replace(tokenObj.token,'')
      result.push({type:TOKEN_TYPE[tokenObj.type],value:tokenObj.token})
      if(!string) break
    }else{
      throw tokenParseError('illegal token matched in lexer')
    }
  }while(tokenObj)
  console.log(result)
  return true
}



module.exports = lexer;
