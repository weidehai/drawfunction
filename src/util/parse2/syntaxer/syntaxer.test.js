const parse = require('./syntaxer')
const lexer = require("../lexer/lexer");

test('test syntaxer',()=>{
  expect((()=>{
    const token = lexer.lexer("ln2 + 2 * 3 * ( 2 + 5 )")
    parse(token)
    return true
  })()).toBe(true)
})
