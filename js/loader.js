'use strict'
var Loader = function(){
  var loader = new THREE.OBJLoader();

  var load = function(src){
    return new Promise(function(resolve, reject){
      loader.load(src, function(object){
        var geometry;
        var data = [];

        var box = new THREE.Box3().setFromObject( object );
        var verticalCenter = box.getCenter().y;
        verticalCenter = (verticalCenter.toFixed(3))/1;
      //   console.log(box, object, verticalCenter);

      //   console.log(box, object, verticalCenter);

        object.traverse(function(child){
          if(child instanceof THREE.Mesh){
            var curr = {};
            geometry = new THREE.Geometry().fromBufferGeometry( child.geometry );

            geometry.computeFaceNormals();
            geometry.mergeVertices();
            geometry.computeVertexNormals();
            // geometry.center();

            for(var i=0; i<geometry.vertices.length; i++){
              geometry.vertices[i].x = (geometry.vertices[i].x.toFixed(3))/1;
              geometry.vertices[i].y = (geometry.vertices[i].y.toFixed(3))/1 - verticalCenter;
              geometry.vertices[i].z = (geometry.vertices[i].z.toFixed(3))/1;
            }
            // console.log(geometry);
            child.geometry = geometry;
            // child.position.y = -verticalCenter;

            child.updateMatrix();
            child.geometry.applyMatrix(child.matrix);
            child.matrix.identity();
            child.geometry.verticesNeedUpdate = true;

            curr.name = child.name
            curr.geometry = child.geometry;
            data.push(curr);
          }
        });
        resolve(data);
      });
    });
  }

  return{
    load: load
  }
}
