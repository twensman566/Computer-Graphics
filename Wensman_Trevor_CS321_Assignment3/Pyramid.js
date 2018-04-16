

var canvas;
var gl;

var NumVertices  = 18;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis  = 0;
var theta = [ 0, 0, 0 ];
var run   = true;  // added by JAWH, 2018/02/01





var runAnimation = false;
var viewer;
var thetaLoc;
var scale = 1;
var scaleFactorChange;
var modelViewLoc;  // uniform location of the modelView matrix
const initViewerDist  =  4.0;
const minViewerDist   =  2.0;
const maxViewerDist   = 10.0;
const maxOffsetRatio  =  1.0;
const deltaViewerDist =  0.25;
const deltaOffset     =  0.1;
var eye             = vec3(0.0, 0.0, initViewerDist);
var at              = vec3(0.0, 0.0, 0.0);
var up              = vec3(0.0, 1.0, 0.0);

// Projection transformation parameters
const viewFactor = 1.5;
var   xLeft   = -viewFactor, xRight =  viewFactor,
      yBottom = -viewFactor, yTop   =  viewFactor,
      zNear   =  initViewerDist - viewFactor,
      zFar    =  initViewerDist + viewFactor;

var projectionLoc;  // uniform location of the projection matrix

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
	
    scaleFactorChange = document.getElementById("leftButton");
	


    


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
	colorCube(scale);
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

	
	
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	modelViewLoc  = gl.getUniformLocation(program, "model_view");
	projectionLoc = gl.getUniformLocation(program, "projection");
    thetaLoc = gl.getUniformLocation(program, "theta");
    scaleFactorChange.onchange = function () {
       eye[0]= -parseInt(scaleFactorChange.value,10)/10; };
	rightButtonChange = document.getElementById("rightButton");
     rightButtonChange.onchange = function () {
       eye[0]=  parseInt(rightButtonChange.value,10)/10; };
    
	
	
	
	
	
	
	
	 downButtonChange = document.getElementById("downButton");
     downButtonChange.onchange = function () {
       eye[1]= -parseInt(downButtonChange.value,10)/10; };

	 upButtonChange = document.getElementById("upButton");
     upButtonChange.onchange = function () {
       eye[1]= parseInt(upButtonChange.value,10)/10; };

	   
	   	 inButtonChange = document.getElementById("inButton");
     inButtonChange.onchange = function () {
       var change = parseInt(inButtonChange.value,10)/10; 
	   eye[0] = change;
	   eye[1] = change;
	   };

	   	 outButtonChange = document.getElementById("outButton");
     outButtonChange.onchange = function () {
       var change = parseInt(outButtonChange.value,10)/10; 
	   eye[0] = -change;
	   eye[1] = -change;
	   
	   };


    render();
}

function colorCube(scaler)
{
    //triangles( 1, 0, 3 );
    //triangles( 1, 3, 2 );
    triangles( 3, 0, 4, scaler);
	triangles( 3, 4, 7 , scaler);
	triangles( 8, 0, 3 , scaler);
	triangles( 8, 3, 7 , scaler);
	triangles( 8, 7, 4 , scaler);
	triangles( 8, 4, 0 , scaler);
   // triangles( 2, 1, 5 );
    //triangles( 4, 5, 6 );
   // triangles( 5, 4, 0 );
	//triangles( 5, 1, 0, scaler);
	//triangles( 2, 3, 5 , scaler);
	//triangles( 3, 5, 4 , scaler);
}

function triangles(a, b, c, s )
{
    var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),//0--+
        vec4( -0.5,  0.5,  0.5, 1.0 ),//1-++
        vec4(  0.5,  0.5,  0.5, 1.0 ),//2+++
        vec4(  0.5, -0.5,  0.5, 1.0 ),//3+-+
        vec4( -0.5, -0.5, -0.5, 1.0 ),//4---
        vec4( -0.5,  0.5, -0.5, 1.0 ),//5+-+
        vec4(  0.5,  0.5, -0.5, 1.0 ),//6++-
        vec4(  0.5, -0.5, -0.5, 1.0 ),//7+--
	   vec4(  0.0,  0.2,  0.0 , 1.0 ) //8top
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ],  // white
		[ 1.0, 0.7, 0.0, 1.0 ]   // orange
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]]);
        // for interpolated colored faces use:
        //colors.push( vertexColors[indices[i]] );

        // for solid colored faces use:
        colors.push(vertexColors[i]);

    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	var projection = ortho(xLeft, xRight, yBottom, yTop, zNear, zFar);
	gl.uniformMatrix4fv(projectionLoc, false, flatten(projection));
	
	
	viewer = lookAt(eye, at, up);

    gl.uniformMatrix4fv(modelViewLoc, false, flatten(viewer));
	
	
    if (run) theta[axis] += 2.0+ scale;  // if (run) added by JAWH, 2018/02/01
    gl.uniform3fv(thetaLoc, theta);
    //gl.uniformMatrix4fv(projection);
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    requestAnimFrame( render );
}
