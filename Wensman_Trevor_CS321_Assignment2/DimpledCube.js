"use strict";

var canvas;
var gl;

var NumVertices  = 72;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis  = 0;
var theta = [ 0, 0, 0 ];
var run   = true;  // added by JAWH, 2018/02/01

var thetaLoc;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

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

    thetaLoc = gl.getUniformLocation(program, "theta");

    //event listeners for buttons

    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };
    // added by JAWH, 2018/02/01
    document.getElementById( "sButton" ).onclick = function () {
        run = !run;
    };

    render();
}

function colorCube()
{
    quad( 10, 1, 2, 3 );
	quad( 10, 1, 5, 6 );
    //quad( 2, 3, 7, 6 );
    //quad( 3, 0, 4, 7 );
    //quad( 6, 5, 1, 2 );
    //quad( 4, 5, 6, 7 );
    quad( 10, 5, 6, 7);
    quad( 10, 5, 4, 7);

	quad(  9,  2, 1, 0);
	quad(  9,  2, 3, 0);
//quad( 5, 4, 0, 1 );
   


    quad( 8, 6, 7, 3 );
    quad( 7, 3, 8, 8 );
    quad( 8, 6, 2, 3 );
    quad( 6, 2, 8, 8 );
    

    

    quad( 9, 0, 4, 5 );
    quad( 9, 0, 1, 5 );
}

function quad(a, b, c, d)
{
    var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),//0
        vec4( -0.5,  0.5,  0.5, 1.0 ),//1
        vec4(  0.5,  0.5,  0.5, 1.0 ),//2
        vec4(  0.5, -0.5,  0.5, 1.0 ),//3
        vec4( -0.5, -0.5, -0.5, 1.0 ),//4
        vec4( -0.5,  0.5, -0.5, 1.0 ),//5
        vec4(  0.5,  0.5, -0.5, 1.0 ),//6
        vec4(  0.5, -0.5, -0.5, 1.0 ),//7


        
        vec4(  0.0,  0.0,  0.0, 1.0 ),//8
        vec4(  0.0,  0.0,  0.0, 1.0 ),//9
		vec4(  0.0,  0.0,  0.0, 1.0 ) //10
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 0.6, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 0.7, 0.0, 1.0 ],  // orange
        [ 0.0, 0.0, 0.0, 1.0 ]   // black

    ];

    // We need to parition the quad into two triangles in order //for
    // WebGL to be able to render it.  In this case, we create //two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        // for interpolated colored faces use:
        //colors.push( vertexColors[indices[i]] );
		
        // for solid colored faces use:
        colors.push(vertexColors[i]);

    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (run) theta[axis] += 2.0;  // if (run) added by JAWH, 2018/02/01
    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    requestAnimFrame( render );
}
