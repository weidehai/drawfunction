function doEventIfOwner(owner,event,fn){
  if(owner===event.target){
    event.stopPropagation()
    event.preventDefault()
    fn({event})
  }
}

function throttler(fn,delay){
  let pre = Date.now();
  return function(...rest){
    if(Date.now()-pre>delay)
      fn(...rest),pre = Date.now()
  }
}

function trimAllWhiteSpace(string){
  return string.replace(/\s+/g,"")
}

function isFunction(fn){
  return typeof fn === 'function'
}


function arrayInsert(index,value,arr){
  let right = arr.splice(index)
  right.unshift(value)
  return arr.concat(right)
}

function reliableFloatAdd(){
  let _agrs = arguments
  let maxTail = 0
  let maxLen = 0
  function getMaxScale(){
    Array.prototype.map.call(_agrs,(value)=>{
      maxLen = Math.max(maxLen,value.toString().replace('.','').length)
      let tail =  value.toString().split('.')[1]
      if(tail){
        maxTail = Math.max(tail.length,maxTail)
      }
    })
    return maxTail
  }
  function transform(value){
    return +value.toString().replace('.','').padEnd(maxLen,0)
  }
  let scale = Math.pow(10,getMaxScale())
  let r = Array.prototype.reduce.call(arguments,(accumulate,value)=>{
    return accumulate + transform(value)
  },0)/scale
  return r
}


export {
  doEventIfOwner,
  throttler,
  trimAllWhiteSpace,
  isFunction,
  arrayInsert,
  reliableFloatAdd
}
