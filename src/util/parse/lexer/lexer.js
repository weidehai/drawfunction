import { trimAllWhiteSpace } from "../../main";
import { tokenParseError } from "./error";
import createTokenMatcherChain from "./tokenMatcherChain";
import TOKEN_TYPE from "./tokenDefine";

function parser(string) {}

function Token(type = null, value = null, next = null) {
  this.type = type;
  this.value = value;
  this.next = next;
}

Token.prototype[Symbol.iterator] = function() {
  let node = this;
  return {
    next: function() {
      if (node.next) {
        node = node.next;
        return { value: node, done: false };
      }
      return { done: true };
    }
  };
};

function lexer(string) {
  const token = new Token();
  let tokenObj;
  let _token = token;
  string = trimAllWhiteSpace(string);
  const tokenMatcherChain = createTokenMatcherChain();
  do {
    tokenObj = tokenMatcherChain.doWork(string);
    if (tokenObj) {
      string = string.replace(tokenObj.token, "");
      _token.next = new Token(TOKEN_TYPE[tokenObj.type], tokenObj.token);
      _token = _token.next
      if (!string) break;
    } else {
      throw tokenParseError("illegal token matched in lexer");
    }
  } while (tokenObj);
  return token;
}

exports.lexer = lexer;
exports.Token = Token;
