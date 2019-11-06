function Logger(id) {
  function _logger() {
    this.element = document.getElementById(id);
    return this;
  };

  _logger.prototype = {
    clear() {
      this.element.textContent = '';
    },

    log(message) {
      this.element.textContent = [this.element.textContent, message].filter(Boolean).join('\n');
    }
  };

  return new _logger();
};
