'use strict'

var Production = function(_leftSide = null, _rightSide = null){
  this.left = _leftSide;
  this.right = _rightSide;
}

Production.prototype.getLeft = function(){
  return this.left;
}

Production.prototype.getRight = function(){
  return this.right;
}
