// File: polygon.js

// Program to draw a rotating ovoid globe revolving around the line z = -x,
// with four pyramids below;
// allows the user to do a flyover of the scene.
// Adapted from Angel & Shreiner 2D Sierpinski Gasket, Color Cube programs
// and recursive sphere.
// by J. Andrew Whitford Holey, February 22, 2016

var canvas;
var gl;

// parameters for creating the globe
const divs          =  4; // number of recursive divisions
var   numBallPoints = 24; // actual value computed in init

// parameters for the globe transformation matrices
const sx = 0.4, sy = 0.2, sz = 0.2; // scale factors
const dx = 0.5, dy = 0.0, dz = 0.0; // translation factors

const xRotateDivs  = 180; // number of positions around the revolution
var   xRotatePos   =   0; // current position around the revolution
                          // (0 ... xRotateDivs - 1)

const revolveDivs  = 540; // number of positions around the revolution
var   revolvePos   =   0; // current position around the revolution
                          // (0 ... revolveDivs - 1)

const obliqueAngle = -45.0;  // degrees

// constant globe matrices
const zRotateScaleAndTranslate =
               mult(mult(translate(dx, dy, dz), scalem(sx, sy, sz)),
                    rotate(90.0, 0.0, 0.0, 1.0));
const obliqueRotate = rotate(obliqueAngle, 0.0, 1.0, 0.0);

// parameters for the pyramids (quad based)
const pyrBaseVerts   = 4;
var   pyrStart       = numBallPoints;    // actual value computed in init
var   numPyrPoints   = 6 * pyrBaseVerts; // actual value computed in init
const psx = 0.4, psy =  0.5, psz = 0.4;  // scale factors
const pdx = 0.7, pdy = -0.8, pdz = 0.7;  // translation factors
const pyrScale       = scalem(psx, psy, psz);

// Parameters for viewer position
const initViewerDist  =  4.0;
const minViewerDist   =  2.0;
const maxViewerDist   = 10.0;
const maxOffsetRatio  =  1.0;
const deltaViewerDist =  0.25;
const deltaOffset     =  0.1;
var   eye             = vec3(0.0, 0.0, initViewerDist);
const at              = vec3(0.0, 0.0, 0.0);
const up              = vec3(0.0, 1.0, 0.0);

// Fly-over parameters
var   flying          = false;
const flyDelta        = 0.01;
var   fdx, fdy, fdz;
const startEye        = vec3(0.0, 0.0, initViewerDist);
const startAt         = vec3(0.0, 0.0, 0.0);

// Projection transformation parameters
var   fieldOfViewY = 40.0,
      aspectRatio  =  1.0, // actual value set in init
      zNear        =  1.0,
      zFar         = 20.0;

var   runAnimation = false;
var   modelViewLoc;  // uniform location of the modelView matrix
var   projectionLoc; // uniform location of the projection matrix
var right = false;
var left = false;


window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");
    aspectRatio  =  canvas.width / canvas.height;
    
    gl = WebGLUtils.setupWebGL( canvas );
    if (!gl) { alert("WebGL isn't available"); }


    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 0.9, 0.75, 1.0); // light yellow background
    
    gl.enable(gl.DEPTH_TEST);
    
    //  Declare variables for points and colors
    var points = [];
    var colors = [];

    // Set up the globe
    numBallPoints    = spherichedron(divs, points);
    pyrStart         = numBallPoints;
    var minBallColor = vec3(0.2, 0.2, 0.2);
    var maxBallColor = vec3(1.0, 1.0, 1.0);
    for (i = 0; i < numBallPoints; i++) {
      var nextColor = vec4(0.0, 0.0, 0.0, 1.0);
      for (j = 0; j < 3; j++) {
        nextColor[j] = minBallColor[j] +
                       Math.random() * (maxBallColor[j] - minBallColor[j]);
      }
      colors.push(nextColor);
    }

    // Set up the pyramid
    numPyrPoints    = pyramid(points, pyrBaseVerts);
    var minPyrColor = vec3(0.4, 0.2, 0.0);
    var maxPyrColor = vec3(0.8, 0.4, 0.2);
    for (i = 0; i < numPyrPoints; i++) {
      var nextColor = vec4(0.0, 0.0, 0.0, 1.0);
      for (j = 0; j < 3; j++) {
        nextColor[j] = minPyrColor[j] +
                       Math.random() * (maxPyrColor[j] - minPyrColor[j]);
      }
      colors.push(nextColor);
    }

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewLoc  = gl.getUniformLocation(program, "model_view");
    projectionLoc = gl.getUniformLocation(program, "projection");
    
    //event listeners for buttons
    document.getElementById("startButton").onclick = function () {
      runAnimation = true;
      requestAnimFrame(render);
    };
    document.getElementById("stopButton").onclick = function () {
      runAnimation = false;
    };
    var offsetRatio;
    document.getElementById("leftButton").onclick = function () {
      offsetRatio = eye[0] / eye[2];
      if (offsetRatio > -maxOffsetRatio) {
        offsetRatio -= deltaOffset;
        eye[0] = eye[2] * offsetRatio;
      }
      if (!runAnimation) requestAnimFrame(render);
    };
    document.getElementById("rightButton").onclick = function () {
      offsetRatio = eye[0] / eye[2];
      if (offsetRatio < maxOffsetRatio) {
        offsetRatio += deltaOffset;
        eye[0] = eye[2] * offsetRatio;
      }
      if (!runAnimation) requestAnimFrame(render);
    };
    document.getElementById("downButton").onclick = function () {
      offsetRatio = eye[1] / eye[2];
      if (offsetRatio > -maxOffsetRatio) {
        offsetRatio -= deltaOffset;
        eye[1] = eye[2] * offsetRatio;
      }
      if (!runAnimation) requestAnimFrame(render);
    };
    document.getElementById("upButton").onclick = function () {
      offsetRatio = eye[1] / eye[2];
      if (offsetRatio < maxOffsetRatio) {
        offsetRatio += deltaOffset;
        eye[1] = eye[2] * offsetRatio;
      }
      if (!runAnimation) requestAnimFrame(render);
    };
    document.getElementById("inButton").onclick = function () {
      if (eye[2] > minViewerDist) {
        eye[2] -= deltaViewerDist;
        offsetRatio = eye[2] / (eye[2] + deltaViewerDist);
        eye[0] *= offsetRatio;
        eye[1] *= offsetRatio;
      }
      if (!runAnimation) requestAnimFrame(render);
    };
    document.getElementById("outButton").onclick = function () {
      if (eye[2] < maxViewerDist) {
        eye[2] += deltaViewerDist;
        offsetRatio = eye[2] / (eye[2] - deltaViewerDist);
        eye[0] *= offsetRatio;
        eye[1] *= offsetRatio;
      }
      if (!runAnimation) requestAnimFrame(render);
    };
    document.onkeydown = checkKey;
    function checkKey(e) {
    	e = e || window.event();
    	if(e.keyCode == '38') //forward
    	{
     		 flying    = true;
     		 var dvx   = at[0] - eye[0];
     		 var dvy   = at[1] - eye[1];
     		 var dvz   = at[2] - eye[2];
     		 var vDist = Math.sqrt(dvx*dvx + dvy*dvy + dvz*dvz);
     		 fdx       = flyDelta * dvx / vDist;
     		 fdy       = flyDelta * dvy / vDist;
     		 fdz       = flyDelta * dvz / vDist;
     		 requestAnimFrame(render);
 	 		 }
 	 		 
 	 	if(e.keyCode == '40')//backward
 	 	{
 	 	    flying    = true;
     		 var dvx   = at[0] + eye[0];
     		 var dvy   = at[1] + eye[1];
     		 var dvz   = at[2] + eye[2];
     		 var vDist = Math.sqrt(dvx*dvx + dvy*dvy + dvz*dvz);
     		 fdx       = flyDelta * dvx / vDist;
     		 fdy       = flyDelta * dvy / vDist;
     		 fdz       = flyDelta * dvz / vDist;
     		 requestAnimFrame(render);
 	 	}
 	 	if(e.keyCode == '39')//right
 	 	{
 	 	
 	 	 	 right    = true;
     		 var dvx   = at[0] + eye[0];
     		 var dvy   = at[1] + eye[1];
     		 var dvz   = at[2] + eye[2];
     		 var vDist = Math.sqrt(dvx*dvx + dvy*dvy + dvz*dvz);
     		 fdx       = flyDelta * dvx / vDist;
     		 fdy       = flyDelta * dvy / vDist;
     		 fdz       = flyDelta * dvz / vDist;
     		 requestAnimFrame(render);
 	 	}
 	 	if(e.keyCode == '37')//left
 	 	{
 	 	 	 left    = true;
     		 var dvx   = at[0] + eye[0];
     		 var dvy   = at[1] + eye[1];
     		 var dvz   = at[2] + eye[2];
     		 var vDist = Math.sqrt(dvx*dvx + dvy*dvy + dvz*dvz);
     		 fdx       = flyDelta * dvx / vDist;
     		 fdy       = flyDelta * dvy / vDist;
     		 fdz       = flyDelta * dvz / vDist;
     		 requestAnimFrame(render);
 	 	}
		 }	
    document.getElementById("resetButton").onclick = function () {
      for (i = 0; i < 3; i++) {
        eye[i] = startEye[i];
        at[i]  = startAt[i];
      }
      flying       = false
      runAnimation = false;
      
      requestAnimFrame(render);
    };
 
        
    render();
}

function render()
{
  // clear the window
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // set up projection matrix
  var projection = perspective(fieldOfViewY, aspectRatio, zNear, zFar);
  gl.uniformMatrix4fv(projectionLoc, false, flatten(projection));

  // set up view position
  var viewer = lookAt(eye, at, up);

  // Set up globe
  // set up the rotation matrix
  var xRotationAngle = xRotatePos * 360.0 / xRotateDivs;
  var xRotation      = rotate(xRotationAngle, 1.0, 0.0, 0.0);

  // set up the revolution matrix
  var revolveAngle     = revolvePos * 360.0 / revolveDivs;
  var revolutionRotate = rotate(revolveAngle, 0.0, 0.0, 1.0);

  // set up the model_view matrix
  var mv = mult(mult(mult(viewer, obliqueRotate), revolutionRotate),
                mult(xRotation, zRotateScaleAndTranslate));

  gl.uniformMatrix4fv(modelViewLoc, false, flatten(mv));
  gl.drawArrays(gl.TRIANGLES, 0, numBallPoints);

  // Set up pyramids
  // right front pyramid
  var pyrTranslate = translate(pdx, pdy, pdz);
  mv = mult(mult(viewer, pyrTranslate),
            mult(pyrScale, rotate(45.0, 0.0, 1.0, 0.0)));
  gl.uniformMatrix4fv(modelViewLoc, false, flatten(mv));
  gl.drawArrays(gl.TRIANGLES, pyrStart, numPyrPoints);

  // right rear pyramid
  pyrTranslate = translate(pdx, pdy, -pdz);
  mv = mult(mult(viewer, pyrTranslate),
            mult(pyrScale, rotate(135.0, 0.0, 1.0, 0.0)));
  gl.uniformMatrix4fv(modelViewLoc, false, flatten(mv));
  gl.drawArrays(gl.TRIANGLES, pyrStart, numPyrPoints);

  // left front pyramid
  pyrTranslate = translate(-pdx, pdy, pdz);
  mv = mult(mult(viewer, pyrTranslate),
            mult(pyrScale, rotate(225.0, 0.0, 1.0, 0.0)));
  gl.uniformMatrix4fv(modelViewLoc, false, flatten(mv));
  gl.drawArrays(gl.TRIANGLES, pyrStart, numPyrPoints);

  // left rear pyramid
  pyrTranslate = translate(-pdx, pdy, -pdz);
  mv = mult(mult(viewer, pyrTranslate),
            mult(pyrScale, rotate(315.0, 0.0, 1.0, 0.0)));
  gl.uniformMatrix4fv(modelViewLoc, false, flatten(mv));
  gl.drawArrays(gl.TRIANGLES, pyrStart, numPyrPoints);

  if (runAnimation) {
    // set up new animation frame
    xRotatePos = (xRotatePos + 1) % xRotateDivs;
    revolvePos = (revolvePos + 1) % revolveDivs;
  }
  if (flying) {
    // move viewer ahead
    eye[0] += fdx;
    eye[1] += fdy;
    eye[2] += fdz;
    at[0]  += fdx;
    at[1]  += fdy;
    at[2]  += fdz;
    flying = false;
    if (eye[2] < -1.0) flying = false;
    
    
  }
  if(right){
  eye[0] += .1;
  at[0]  += .1;
  right = false;
  }
  if(left)
  {
  eye[0] -= .05;
  at[0]  -= .05;
  left = false;
  }
  if (runAnimation || flying || right) {
    requestAnimFrame(render);
  }

}

