const lexer = require('./parse')

test('lexer string 10+2',()=>{
  expect(lexer('10 + 2 + 90* 20 / 10 - 9')).toBe(true)
})
