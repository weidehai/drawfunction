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



export {
  doEventIfOwner,
  throttler,
  trimAllWhiteSpace,
  isFunction,
  arrayInsert
}
