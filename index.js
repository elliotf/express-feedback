function feedback(req, res, next){
  if (!res.locals || res.message) {
    return next();
  }

  function addMessage(type, message) {
    var list = this.locals.messages = this.locals.messages || []

    list.push({
      type: type, text: message
    });
  };
  //['warning', 'error', 'info', 'success'].forEach(function(level){
  ['error', 'warning', 'info', 'success'].forEach(function(level){
    addMessage[level] = function(message){
      res.message(level, message);
    }
  });

  addMessage.err  = addMessage.error;
  addMessage.warn = addMessage.warning;
  addMessage.win  = addMessage.success;

  res.message = addMessage;

  next();
}

module.exports = feedback;
