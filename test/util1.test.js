import {
  reliableFloatAdd
} from "../src/util/main";


test('reliableFloatAdd',()=>{
  expect(reliableFloatAdd(-4.8,0.01)).toBe(-4.79);
})
