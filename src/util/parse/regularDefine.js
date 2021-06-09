
// todo 指数，三角函数，对数的解析
const token = /^(\d+(\.(?=\d+))?\d*)\s*([\+\-\*\/]|$)/


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
