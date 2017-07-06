'use strict'

var App = (function(){
  var scene, camera, renderer;

  createScene();

  var loader = new THREE.OBJLoader();
  // loader.load( '/models/start.obj', function ( object ) {
  //   var material = new THREE.MeshLambertMaterial({color: 0x666666 });
  //   var geoArr = [];
  //   var name;
  //   var geometry;
  //
  //   object.traverse( function ( child ) {
  //     if ( child instanceof THREE.Mesh ) {
  //       child.material = material;
  //       geometry = new THREE.Geometry().fromBufferGeometry( child.geometry );
  //
  //       geometry.computeFaceNormals();
  //       geometry.mergeVertices();
  //       geometry.computeVertexNormals();
  //
  //       geometry.center();
  //       console.log(geometry);
  //       child.geometry = new THREE.BufferGeometry().fromGeometry( geometry );
  //       geoArr.push(geometry.vertices);
  //       name = child.name;
  //    }
  //   });
  //   object.geo = geoArr;
  //   object.name = name;
  //   console.log(object);
  //   scene.add( object );
  //
  //       var box = new THREE.Box3().setFromObject( object );
  //       console.log( box.min, box.max, box.getSize(), box.getCenter() );
  // } );
//   loader.load( '/models/n_hand_r.obj', function ( object ) {
//     var material = new THREE.MeshLambertMaterial({color: 0x666666 });
//     var geoArr = [];
//     var name;
//     var geometry;
// var t;
//     object.traverse( function ( child ) {
//       if ( child instanceof THREE.Mesh ) {
//         child.material = material;
//         geometry = new THREE.Geometry().fromBufferGeometry( child.geometry );
//
//         geometry.computeFaceNormals();
//         geometry.mergeVertices();
//         geometry.computeVertexNormals();
//
//         geometry.center();
//
//         child.geometry = new THREE.BufferGeometry().fromGeometry( geometry );
//         geoArr.push(geometry.vertices);
//         t = geometry;
//
//         t.computeBoundingSphere();
//         t.computeBoundingBox();
//         console.log(t.boundingSphere);
//         console.log(t.boundingBox);
//         name = child.name;
//
//      }
//     });
//     var test = new THREE.Mesh(t, material);
//     console.log(test);
//     console.log(object);
//
//     object.geo = geoArr;
//     object.name = name;
//     // console.log(object);
//     scene.add( test );
//     scene.add( object );
//     window.test = test;
//     test.position.x = 4;
//     var box = new THREE.Box3().setFromObject( test );
//     console.log( box.min, box.max, box.getSize(), box.getCenter());
//     var box = new THREE.Box3().setFromObject( object );
//     console.log( box.min, box.max, box.getSize(), box.getCenter());
//   } );

  function render(){
    requestAnimationFrame( render );

    window.object.rotation.y += 0.01;
    renderer.render( scene, camera );
  }
  //
  var geometry = new THREE.Geometry();

  var holes = [];
  var triangles;

  geometry.vertices = [
    new THREE.Vector3(-2,0,0),
    new THREE.Vector3(2,0,0),
    new THREE.Vector3(0,2,0),
    new THREE.Vector3(-2,0,2),
    new THREE.Vector3(2,0,2),
    new THREE.Vector3(0,2,2)
  ];

  // geometry.faces = [
  //   new THREE.Face3(1,2,0),
  //   new THREE.Face3(0,2,3),
  //   new THREE.Face3(3,2,5),
  //   new THREE.Face3(3,5,4),
  //   new THREE.Face3(4,5,1),
  //   new THREE.Face3(1,5,2)
  // ]


  triangles = THREE.ShapeUtils.triangulateShape( geometry.vertices, holes );
console.log(triangles);
  for( var i = 0; i < triangles.length; i++ ){
    geometry.faces.push( new THREE.Face3( triangles[i][0], triangles[i][1], triangles[i][2] ));
  }

  var extrusionSettings = {
      amount: 5,
      bevelEnabled: false,
      material: 0,
      extrudeMaterial: 1
  };

  var geometry = new THREE.ExtrudeGeometry( geometry, extrusionSettings );
  // geom.faces.push( new THREE.Face3( 0, 1, 2) );
  // geom.faces.push( new THREE.Face3( 3, 4, 5) );
  // geom.computeFaceNormals();
  // geom.computeVertexNormals();
  // console.log(geom);
  //
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  geometry.center();
  console.log(geometry);
  var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({color: 0x666666 }) );
  console.log(object);
  window.object = object;
  scene.add(object);
  render();

// var starPoints = [];
//
// starPoints.push( new THREE.Vector2 (  0,  0 ) );
// starPoints.push( new THREE.Vector2 (   5,  0 ) );
// starPoints.push( new THREE.Vector2 (  2.5,  5 ) );
//
// var starShape = new THREE.Shape( starPoints );
//
// var extrusionSettings = {
//     amount: 5,
//     bevelEnabled: false,
//     material: 0,
//     extrudeMaterial: 1
// };
//
// var starGeometry = new THREE.ExtrudeGeometry( starShape, extrusionSettings );
//
// var materialFront = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
// var materialSide = new THREE.MeshBasicMaterial( { color: 0xff8800 } );
// var materialArray = [ materialFront, materialSide ];
// var starMaterial = new THREE.MultiMaterial(materialArray);
//
// starGeometry.center();
// console.log(starGeometry);
//
// var object = new THREE.Mesh( starGeometry, starMaterial );
// scene.add(object);



  function createScene(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var ambient = new THREE.AmbientLight( 0xffffff );
    scene.add( ambient );

    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 0, 0, 1 );
    scene.add( directionalLight );

    camera.position.z = 20;
  }
})();
