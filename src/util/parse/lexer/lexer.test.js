const lexer = require('./lexer')

test('lexer string',()=>{
  expect(lexer('ln2 + 2 + (90* -20.10 / 10{}] - 9.129102) + 10^2 + ln2 + sin3')).toBe(true)
})
