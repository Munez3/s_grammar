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

  var modifierVertex = 7;

  createScene();

  loadProductions();


  var nextStep = document.getElementsByClassName('next')[0];
  // nextStep.addEventListener('click', searchN);
  nextStep.addEventListener('click', reset);
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

   function reset(){
      scene.children.pop();
      start();
   }

   function testing(object){
      var vertices = object.geometry.vertices;
      var points = [];
      var superPoints = [];
      for(var i=0; i<vertices.length; i++){
         points = [{v: vertices[i], index: i}];
         var x = vertices[i].x;
         var z = vertices[i].z;
         for(var j=i+1; j<vertices.length; j++){
            // if(vertices[j].x === x && vertices[j].z === z)
            //    points.push({v: vertices[j], index: j});
            if(vertices[j].z === z)
               points.push({v: vertices[j], index: j});
         }
         // console.log(points.length);
         // if(points.length === modifierVertex + 2){
         if(points.length >= modifierVertex + 2){
            // superPoints.push(points);
            // points = [{v: vertices[i], index: i}];
            if(Math.random() > 0.5){
               points.reverse();
            }
            var newP = modify(points);
            if(Math.random() > 0.5){
               newP.reverse();
            }

            // for(var k=0; k<modifierVertex; k++){
            for(var k=0; k<points.length-2; k++){
               vertices[points[k+1].index].x += newP[k][0];
               // vertices[points[k+1].index].y += newP[k][1];
               // vertices[points[k+1].index].z += newP[k][2];
               // vertices[points[k+1].index].y += newP[k][1];
            }
         }
      }
   }

   function modify(p){
      var newPoints = [];
      var t = 1/modifierVertex;
      var p1 = Math.round((Math.random() * 4));
      var p2 = Math.round((Math.random() * 4));
      var p3 = Math.round((Math.random() * 4));
      var p4 = Math.round((Math.random() * 4));

      // // console.log(p[0].v.x);
      // console.log(p1, p2, p3, p4);

      if(Math.random() > 0.9) p1 = -p1;
      if(Math.random() > 0.9) p2 = -p2;
      if(Math.random() > 0.5) p3 = -p3;
      if(Math.random() > 0.9) p4 = -p4;

      p1 = p[0].v.x + p1;
      p2 = p[0].v.x + p2;
      p3 = p[p.length-1].v.x + p3;
      p4 = p[p.length-1].v.x + p4;

      // if(Math.random() < 0.5){
         for(var i=0; i<p.length-2; i++){
            var x, y, z;
            x = Math.pow((1-t), 5) * p[0].v.x + Math.pow((1-t), 4) * p1 * t + Math.pow((1-t), 3) * p2 * Math.pow(t,2) + Math.pow((1-t),2) * Math.pow(t,3) * p3 + (1-t) * Math.pow(t,4) * p4 + Math.pow(t,5) * p[p.length-1].v.x;
            // y = Math.pow((1-t), 5) * p[0].v.y + Math.pow((1-t), 4) * p1 * t + Math.pow((1-t), 3) * p2 * Math.pow(t,2) + Math.pow((1-t),2) * Math.pow(t,3) * p3 + (1-t) * Math.pow(t,4) * p4 + Math.pow(t,5) * p[p.length-1].v.y;
            // z = Math.pow((1-t), 5) * p[0].v.z + Math.pow((1-t), 4) * p1 * t + Math.pow((1-t), 3) * p2 * Math.pow(t,2) + Math.pow((1-t),2) * Math.pow(t,3) * p3 + (1-t) * Math.pow(t,4) * p4 + Math.pow(t,5) * p[p.length-1].v.z;
            // y = Math.pow((1-t), 4) * p[0].v.y + Math.pow((1-t), 3) * p1 * t + Math.pow((1-t),2) * Math.pow(t,2) * p2 + (1-t) * Math.pow(t,3) * p3 + Math.pow(t,4) * p[p.length-1].v.y;
            // y = Math.pow((1-t), 3) * p[0].v.y + 3*Math.pow((1-t),2) * t * p1 + 3 * (1-t) * Math.pow(t,2) * p2 + Math.pow(t,3) * p[p.length-1].v.y;
            // y = (1+t) * p[0].v.y + t * p[p.length-1].v.y;
            // z = (1+t) * p[0].v.z + t * p[p.length-1].v.z;
            // console.log(x/(p[0].v.x*10), x);
            // console.log(x, y);
            newPoints.push([x/30]);
            // newPoints.push(new Array(x/30, y/60, z/10));
            t += 1/(p.length-2);
         }
      // }else{
      //    for(var i=0; i<modifierVertex/2; i++){
      //       var x, y, z;
      //       x = Math.pow((1-t), 3) * p[0].v.x + 3*Math.pow((1-t),2) * t * p1 + 3 * (1-t) * Math.pow(t,2) * p2 + Math.pow(t,3) * p[4].v.x;
      //       y = Math.pow((1-t), 3) * p[0].v.y + 3*Math.pow((1-t),2) * t * p1 + 3 * (1-t) * Math.pow(t,2) * p2 + Math.pow(t,3) * p[4].v.y;
      //       newPoints.push(new Array(x/100, y/50));
      //       t += 1/(modifierVertex/2);
      //    }
      //    newPoints.push(new Array(0, 0));
      //    for(var i=0; i<modifierVertex/2; i++){
      //       var x, y, z;
      //       x = Math.pow((1-t), 3) * p[4].v.x + 3*Math.pow((1-t),2) * t * p1 + 3 * (1-t) * Math.pow(t,2) * p2 + Math.pow(t,3) * p[p.length-1].v.x;
      //       y = Math.pow((1-t), 3) * p[4].v.y + 3*Math.pow((1-t),2) * t * p1 + 3 * (1-t) * Math.pow(t,2) * p2 + Math.pow(t,3) * p[p.length-1].v.y;
      //       newPoints.push(new Array(x/100, y/50));
      //       t += 1/(modifierVertex/2);
      //    }
      // }
      // console.log(newPoints);
      return newPoints;
   }

   function start(){
      loader.load('./start.obj').then(function(data){
         var group = new THREE.Group();

         for(var i=0, length = data.length; i< length; i++){
            var object = new THREE.Mesh(data[i].geometry, material);
            object.name = data[i].name;
            group.add(object);
         }
         scene.add(group);

         var flag = 1;
         while(flag){
            flag = searchN(flag);
         }
         // setTimeout(function(){
         // }, 300);

      });
   }

  function searchN(flag){
     flag = 0;
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

            if((left[0].geometry.vertices.length + left[1].geometry.vertices.length) === (first.geometry.vertices.length + sec.geometry.vertices.length)){
               // console.log('lol');
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
                  flag = 1;
                  return flag;
               }
            }
          }
        }
      }else{
        //search for mesh that mathes to left
         for(var j=0; j<currentShape.length; j++){
            if(left[0].geometry.vertices.length === currentShape[j].geometry.vertices.length){
               // console.log('nie lol');
               var curr = currentShape[j].geometry.clone();
               curr.center();
               for(var el=0; el<curr.vertices.length; el++){
                  curr.vertices[el].x = (curr.vertices[el].x.toFixed(3))/1;
                  curr.vertices[el].y = (curr.vertices[el].y.toFixed(3))/1;
               }
               // var box = new THREE.Box3().setFromObject( left[0] );

               // console.log(box.getCenter(), left[0].geometry, curr);

               //  console.log(left[0].name, left[0].geometry.vertices, currentShape[j].name, curr.vertices);
               if(curr.vertices.equals(left[0].geometry.vertices)){
                  swapShape(currentShape[j], productions[randArray[i]].right);
                  flag = 1;
                  return flag;
               }
            }
         }
      }
      counter++;
      randArray.splice(i, 1);
      // }
    }
    return flag;
  }

  function swapShape(oldShape, newShape){
    var box = new THREE.Box3().setFromObject(oldShape);
    var center = box.getCenter();

    var box2 = new THREE.Box3().setFromObject(newShape);
    var center2 = box2.getCenter();

    var height1 = box.max.y - box.min.y;
    var height2 = box2.max.y - box2.min.y;

    var diff = (height2 - height1) / 2;
    diff = (diff.toFixed(1)) / 1;
   //  console.log(box, height1, box2, height2, diff);

      if(diff <= 0.5){
         center.y += diff;
      }else if(diff <= 0.7){
         center.y += diff/2;
      }else{
         center.y += diff/4;
      }

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

      if(Math.random() > 0.4)
         testing(newS);

      // if(Math.random() > 0.9){
      //    if(Math.random() > 0.95){
      //       newS.rotation.x += Math.random();
      //    }
      //    if(Math.random() > 0.95){
      //       newS.rotation.y += Math.random();
      //    }
      //    if(Math.random() > 0.95){
      //       newS.rotation.z += Math.random();
      //    }
      // }

      scene.children[2].add(newS);
    }
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

    camera.position.z = 10;
  }

  function loadProductions(){
    loadJSON('./production.config.json').then(function(response){
      return JSON.parse(response);
    }).then(function(response){
      for(var i=0; i<response.productions.length; i++){
        Promise.all([load(response.productions[i].left), load(response.productions[i].right)]).then(function(production){
          productions.push(new Production(production[0], production[1]));
        });
      }
    }).then(function(){
      setTimeout(function(){
         start();
      }, 700);
    });
  }

  function load(src){
    return loader.load('./productions/'+src).then(function(data){
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
