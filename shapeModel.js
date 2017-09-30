'use strict'

var Shape = function(_name = null, _geometry = null, _marker = null){
  this.name = _name;
  this.geometry = _geometry;
  this.marker = _marker;
}

Shape.prototype.getGeometry = function(){
  return this.geometry;
}

Shape.prototype.setMarker = function(_marker){
  this.marker = _marker;
}
