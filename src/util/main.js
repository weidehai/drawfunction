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




export {
  doEventIfOwner,
  throttler,
  trimAllWhiteSpace,
  isFunction
}
