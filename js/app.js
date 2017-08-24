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
   var requestId = undefined;
   var przeskalowanie = 15;  
   var pointsAmount = 8;
   var bezierParameters = [
      {min: 0, max: 0},
      {min: -1.5/przeskalowanie, max: 3/przeskalowanie},
      {min: -3.75/przeskalowanie, max: 4.75/przeskalowanie},
      {min: -2.5/przeskalowanie, max: 2.25/przeskalowanie},
      {min: -2/przeskalowanie, max: 4.75/przeskalowanie},
      {min: -3.5/przeskalowanie, max: 11/przeskalowanie},
      {min: -3/przeskalowanie, max: 3.25/przeskalowanie},
      {min: -5/przeskalowanie, max: 2.25/przeskalowanie},
      {min: -3.75/przeskalowanie, max: 3.75/przeskalowanie},
      {min: -2.5/przeskalowanie, max: 3.25/przeskalowanie},
      {min: -2/przeskalowanie, max: 1/przeskalowanie},
      {min: -3.5/przeskalowanie, max: -3/przeskalowanie},
      {min: -2.25/przeskalowanie, max: 1/przeskalowanie}
   ];

   var modifierVertex = 7;

   createScene();
   loadProductions();

   var nextStep = document.getElementsByClassName('next')[0];
   var rotate = document.getElementsByClassName('rotate')[0];
   // nextStep.addEventListener('click', searchN);
   nextStep.addEventListener('click', reset);
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

   function render(){
     requestId = requestAnimationFrame(render);
     renderer.render(scene, camera);
   }
   render();

   function toggleRotation(){
      requestId = requestAnimationFrame(toggleRotation);
      renderer.render(scene, camera);
      scene.children[2].rotation.y += 0.01;
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
       i = (i == randArray.length) ? i-1: i;

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
       var newGeometry = newShape.children[i].geometry.clone();

       newS.geometry = newGeometry;
       newS.position.x = center.x;
       newS.position.y = center.y;

      //  if(Math.random() > 0.4)
          modify(newS);
       scene.children[2].add(newS);
     }
   }

   function modify(object){
      var vertices = object.geometry.vertices;
      var box = new THREE.Box3().setFromObject(object);
      var boxCenter = box.getCenter();
      var minX = box.min.x - boxCenter.x;
      var maxX = box.max.x - boxCenter.x;
      var points = [];
      var done = [];
      for(var i=0; i<vertices.length; i++){
         if( (vertices[i].x === minX || vertices[i].x === maxX) && done.indexOf(vertices[i].x) === -1){
            done.push(vertices[i].x);
            points = [{v: vertices[i], index: i}];
            var x = vertices[i].x;
            var z = vertices[i].z;
            for(var j=i+1; j<vertices.length; j++){
               if(vertices[j].x === x && vertices[j].z === z)
                  points.push({v: vertices[j], index: j});
               // if(vertices[j].x === x)
               //    points.push({v: vertices[j], index: j});
            }
            // console.log(points, object);
            if(points.length >= 9){
               points.sort(function(a,b){
                  return a.v.y - b.v.y;
               });

               var k= pointsAmount;
               while(typeof points[k] !== 'undefined'){
                  points[3*(k/pointsAmount)].v.x += (Math.random() * (bezierParameters[3*(k/pointsAmount)].max + Math.abs(bezierParameters[3*(k/pointsAmount)].min))) + bezierParameters[3*(k/pointsAmount)].min;
                  k += pointsAmount;
               }
               // console.log(points);
               var newP = calculateBezier(points);
               if(Math.random() > 0.5) newP.reverse();

               for(var k=0; k<newP.length/(pointsAmount-1); k++){
                  points[pointsAmount*k+1].v.x += newP[(pointsAmount-1)*k];
                  points[pointsAmount*k+2].v.x += newP[(pointsAmount-1)*k+1];
                  points[pointsAmount*k+3].v.x += newP[(pointsAmount-1)*k+2];
                  points[pointsAmount*k+4].v.x += newP[(pointsAmount-1)*k+3];
                  points[pointsAmount*k+5].v.x += newP[(pointsAmount-1)*k+4];
                  points[pointsAmount*k+6].v.x += newP[(pointsAmount-1)*k+5];
                  points[pointsAmount*k+7].v.x += newP[(pointsAmount-1)*k+6];
               }
               // console.log(newP, points);

               //dostosowanie calego boku zolnierza
               var zPoints = [];
               for(var j=i+1; j<vertices.length; j++){
                  if(vertices[j].x === x && vertices[j].z !== z)
                     zPoints.push({v: vertices[j], index: j});
               }
               zPoints.sort(function(a,b){
                  return a.v.z - b.v.z;
               });

               var sameArrays = [];
               for(var m=0; m<Math.floor(zPoints.length/points.length); m++){
                  sameArrays.push(zPoints.slice(points.length * m, points.length * m + points.length));
               }

               for(var m=0; m<sameArrays.length; m++){
                  sameArrays[m].sort(function(a,b){
                     return a.v.y - b.v.y;
                  });
               }
               for(var m=0; m<sameArrays.length; m++){
                  for(var b=0; b<sameArrays[m].length; b++){
                     sameArrays[m][b].v.x = points[b].v.x;
                  }
               }
            }
         }
      }
   }

   function calculateBezier(p){
      var newPoints = [];
      var p1, p2, x;

      var splices = Math.floor(p.length / pointsAmount);
      for(var i=0; i<splices; i++){
         var t = 1/pointsAmount;
         p1 = (Math.random() * (bezierParameters[3*i+1].max + Math.abs(bezierParameters[3*i+1].min))) + bezierParameters[3*i+1].min;
         p2 = (Math.random() * (bezierParameters[3*i+2].max + Math.abs(bezierParameters[3*i+2].min))) + bezierParameters[3*i+2].min;

         for(var j=0; j<(pointsAmount-1); j++){
            //sklejone krzywe bezier 3 stopnia
            //x0(1-t)^3 + 3tx1(1-t)^2 + 3t^2x2(1-t) + t^3x3
            x = p[pointsAmount*i].v.x*Math.pow((1-t), 3) + 3 * p1 * t * Math.pow((1-t), 2) + 3 * p2 * Math.pow(t, 2) * (1-t) + p[pointsAmount*i+pointsAmount].v.x * Math.pow(t, 3);
            newPoints.push(x/10);
            // newPoints.push(new Array(x/30, y/60, z/10));
            t += 1/pointsAmount;
         }
      }


      // console.log(newPoints);
      return newPoints;
   }


})();
