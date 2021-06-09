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

export {
  doEventIfOwner,
  throttler
}
