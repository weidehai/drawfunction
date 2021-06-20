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
  function getMaxScale(){
    Array.prototype.map.call(_agrs,(value)=>{
      let tail =  value.toString().split('.')[1]
      if(tail){
        maxTail = Math.max(tail.length,maxTail)
      }
    })
    return maxTail
  }
  function transform(value){
    function zeroGenerator(n){
      let str = ''
      if(n<0) return
      while(n){
        str += '0'
        n--
      }
      return str
    }
    let fraction = value.toString().split('.')[1]
    let fractionLen = 0
    if(fraction){
      fractionLen = fraction.length
    }
    return +(value.toString().replace('.','')+zeroGenerator(maxTail-fractionLen))
  }
  let scale = Math.pow(10,getMaxScale())
  return Array.prototype.reduce.call(arguments,(accumulate,value)=>{
    return accumulate + transform(value)
  },0)/scale
}


export {
  doEventIfOwner,
  throttler,
  trimAllWhiteSpace,
  isFunction,
  arrayInsert,
  reliableFloatAdd
}
