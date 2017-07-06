'use strict'

Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
      return false;
    // compare lengths - can save a lot of time
    if (this.length != array.length)
      return false;

    for (var i = 0, l=this.length; i < l; i++) {
      // if(this[i].x !== array[i].x || this[i].y !== array[i].y || this[i].z !== array[i].z)
      if(this[i].x !== array[i].x || this[i].y !== array[i].y)
        return false;
    }
  return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

var App = (function(){
  var scene, camera, renderer;
  var loader = new Loader();
  var material = new THREE.MeshLambertMaterial({color: 0x666666 });
  var shapes = [];
  var productions = [];

  createScene();

  loadProductions();


  var nextStep = document.getElementsByClassName('next')[0];
  nextStep.addEventListener('click', searchN);
  var rotate = document.getElementsByClassName('rotate')[0];
  rotate.addEventListener('click', toggleRotation);

   window.addEventListener('mousewheel', function(e){
      // console.log(scene.children[2]);
      if(e.wheelDelta < 0 ){
         camera.position.z += 1;
      }else if(e.wheelDelta > 0){
         camera.position.z -= 1;
      }

      render();
   });

  function start(){
      loader.load(location.href+'productions/start.obj').then(function(data){
      var group = new THREE.Group();

      for(var i=0, length = data.length; i< length; i++){
        var object = new THREE.Mesh(data[i].geometry, material);
        object.name = data[i].name;
        group.add(object);
      }
      scene.add(group);
    });
  }

  function searchN(){
    var currentShape = scene.children[2].children;
    var randArray = [];
    for(var i=0; i<productions.length; i++){
      randArray.push(i);
    }

    var counter = 0;
    while(randArray.length > 0){
      var i  = Math.floor(Math.random() * (randArray.length));
      i = i == randArray.length ? i-1: i;
      // for(var i=0; i<productions.length; i++){
      var left = productions[randArray[i]].left.children;
      // console.log(left);

      if(left.length > 1){
        for(var j=0; j<currentShape.length-1; j++){
          var first = currentShape[j].clone();
              first.geometry = currentShape[j].geometry.clone();

          for(var k=j+1; k<currentShape.length; k++){
            var sec = currentShape[k].clone();
                sec.geometry = currentShape[k].geometry.clone();

            var group = new THREE.Group();
            group.add(first);
            group.add(sec);
            var box = new THREE.Box3().setFromObject(group);
            var center = box.getCenter();

            for(var el=0; el<first.geometry.vertices.length; el++){
              first.geometry.vertices[el].x -= center.x;
              first.geometry.vertices[el].y -= center.y;
            }

            // first.position.y = -y;
            // first.position.x = -x;
            first.updateMatrix();
            first.geometry.applyMatrix(first.matrix);
            first.matrix.identity();
            first.geometry.verticesNeedUpdate = true;


            for(var el=0; el<sec.geometry.vertices.length; el++){
              sec.geometry.vertices[el].x -= center.x ;
              sec.geometry.vertices[el].y -= center.y;
            }
            // sec.position.y = -y;
            // sec.position.x = -x;
            sec.updateMatrix();
            sec.geometry.applyMatrix(sec.matrix);
            sec.matrix.identity();
            sec.geometry.verticesNeedUpdate = true;

            // console.log(first, sec);


            if((first.geometry.vertices.equals(left[0].geometry.vertices) && sec.geometry.vertices.equals(left[1].geometry.vertices)) ||
               (first.geometry.vertices.equals(left[1].geometry.vertices) && sec.geometry.vertices.equals(left[0].geometry.vertices))){
              var oldShape = new THREE.Group();
              oldShape.add(currentShape[j], currentShape[k]);
              swapShape(oldShape, productions[randArray[i]].right);
              return;
            }
          }
        }
      }else{
        //search for mesh that mathes to left
        for(var j=0; j<currentShape.length; j++){
          var curr = currentShape[j].geometry.clone();
          curr.center();

         //  console.log(left[0].name, left[0].geometry.vertices, currentShape[j].name, curr.vertices);
          if(curr.vertices.equals(left[0].geometry.vertices)){
            swapShape(currentShape[j], productions[randArray[i]].right);
            return;
          }
        }
      }
      counter++;
      randArray.splice(i, 1);
      // }
    }
  }

  function swapShape(oldShape, newShape){
    var box = new THREE.Box3().setFromObject(oldShape);
    var center = box.getCenter();

    if(oldShape.type === "Group"){
      scene.children[2].remove(oldShape.children[0]);
      scene.children[2].remove(oldShape.children[1]);
    }else{
      scene.children[2].remove(oldShape);
    }

    for(var i=0; i<newShape.children.length; i++){
      var newS = newShape.children[i].clone();
      newS.position.x = center.x;
      newS.position.y = center.y;
      // newS.position.z = center.z;
      scene.children[2].add(newS);
    }

   //  console.log(scene);
  }
  function render(){
     requestId = requestAnimationFrame(render);
     renderer.render(scene, camera);
  }

  render();

   var requestId = undefined;
   function toggleRotation(){
      requestId = requestAnimationFrame(toggleRotation);
      renderer.render(scene, camera);
      scene.children[2].rotation.y += 0.01;
   }

  function createScene(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth-4, window.innerHeight-4 );
    document.body.appendChild( renderer.domElement );

    var ambient = new THREE.AmbientLight( 0xffffff );
    scene.add( ambient );

   //  var directionalLight = new THREE.DirectionalLight( 0xffffff );
   //  directionalLight.position.set( 0, 0, 1 );
   //  scene.add( directionalLight );

    var light = new THREE.HemisphereLight( 0xffffff, 0x080820, 1 );
    scene.add( light );

    camera.position.z = 20;
  }

  function loadProductions(){
    loadJSON(location.href+'production.config.json').then(function(response){
      return JSON.parse(response);
    }).then(function(response){
      for(var i=0; i<response.productions.length; i++){
        Promise.all([load(response.productions[i].left), load(response.productions[i].right)]).then(function(production){
          productions.push(new Production(production[0], production[1]));
        });
      }
    }).then(function(){
      start();
    });
  }

  function load(src){
    return loader.load(location.href+'productions/'+src).then(function(data){
      var group = new THREE.Group();

      for(var i=0, length = data.length; i< length; i++){
        var object = new THREE.Mesh(data[i].geometry, material);
        object.name = data[i].name;
        group.add(object);
      }
      return group;
    });
  }

  function loadJSON(src) {
    return new Promise(function(resolve, reject){
      var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
      xobj.open('GET', src, true);
      xobj.onreadystatechange = function () {
       if (xobj.readyState == 4 && xobj.status == "200") {
         resolve(xobj.responseText);
       }
     };
     xobj.send(null);
    });
  }

})();
