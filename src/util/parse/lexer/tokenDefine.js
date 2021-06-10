const TOKEN_TYPE = {
  TT_INT: "int",
  TT_FLOAT: "float",
  TT_PLUS: "plus",
  TT_SUB: "sub",
  TT_MUL: "mul",
  TT_DIV: "div",
  TT_EXPONENT: "exponent",
  TT_SIN: "sin",
  TT_COS: "cos",
  TT_TAN: "tan",
  TT_COT: "cot",
  TT_LN: "ln",
  TT_LG: "lg",
  TT_LOG: "log",
  TT_LPARNET: "lparent",
  TT_RPARNET: "rparent"
};

const operatorToBuiltin = {
  TT_SIN: "Math.sin",
  TT_COS: "Math.cos",
  TT_TAN: "Math.tan",
  TT_COT: "Math.sin/Math.cos",
  TT_LN: "Math.log",
  TT_LG: "Math.log(10)/Math.log()",
  TT_LOG: "Math.log(10)/Math.log()",
  TT_EXPONENT: "Math.pow()"
};

export default TOKEN_TYPE;
