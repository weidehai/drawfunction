
const token = /(\d+\.?\d+)\s*([\+\-\*\/\=])/


const whiteSpace = /\s/
const integer = /\d/
const float = /\d+\.\d+/
const operator = /[\+\-\*\/\=]/

const regulars = {
  whiteSpace,
  integer,
  operator,
  token
}

export default regulars
