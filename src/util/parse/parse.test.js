const lexer = require('./parse')

test('lexer string 10+2=12',()=>{
  expect(lexer('10+2=12')).toBe(true)
})
