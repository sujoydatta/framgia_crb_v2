function Events() {
  this.array = [];
  this.instance = null;
}

Events.getInstance = function() {
  if (this.instance == null) {
    this.instance = new Events();
  }

  return this.instance;
};

Events.prototype.add = function(newObject) {
  this.array.push(newObject);
};

Events.prototype.clear = function() {
  this.array = [];
};
