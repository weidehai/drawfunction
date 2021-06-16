import {
  doEventIfOwner,
  throttler,
  trimAllWhiteSpace,
  isFunction,
  arrayInsert,
  reliableFloatAdd
} from "../src/util/main";


test('reliableFloatAdd',()=>{
  expect(reliableFloatAdd(0.1,0.2)).toBe(0.3);
})
