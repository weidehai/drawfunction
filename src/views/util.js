function ensureCancelrequestAnimation(fn) {
  this.stopAction = true;
  if (this.drawFunctonTask) clearTimeout(this.drawFunctonTask);
  if (!isFunction(fn))
    throw `ensureCancelrequestAnimation require a function argument,bu get a ${typeof fn}`;
  fn.call(this);
  this.drawFunctonTask = setTimeout(() => {
    this.stopAction = false;
    this.drawFuncton();
  }, 200);
},
