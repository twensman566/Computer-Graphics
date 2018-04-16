// object1.js

//  Program to draw a green square on a red background
//  in the center of the canvas
//  Adapted from Angel & Shreiner 2D Sierpinski Gasket program
//  and from Whitford Holey's Swiss Flag program
//  by J. Andrew Whitford Holey, January 11, 2016


var gl;
var points = [];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the square
    //

    // Left side of top left chevron
    
    var vertices = [
        vec2( 0.0, 0.0 ), //  0 
        vec2(  0.0, -0.4 ), //  1
        vec2(  0.4,  0.0 ), //  2
        vec2( 0.32,  0.4 ), //  3
	   vec2(-0.32, 0.4),	   //  4
        vec2(-0.4,0.0) 	//  5
    ];


	var verticesTriangle = [
		vec2(0.0 , 0.97), //  0
		vec2(-0.9, 0.4),  //  1  
		vec2(-0.6, -0.85), //  2
		vec2(0.6, -0.85),  //  3
		vec2(0.9, 0.4)    //  4
		]
	
	

    // Pentagon
    points.push( vertices[ 0] );
    points.push( vertices[ 1] );
    points.push( vertices[ 2] );
	
    points.push( vertices[ 3] );
    points.push( vertices[ 4] );
    points.push( vertices[ 5] );
    points.push( vertices[ 1] );

	
	
	
	//Triangles
	points.push(verticesTriangle [ 0]);
	points.push(vertices[ 3]);
	points.push(vertices[ 4]);

	points.push(verticesTriangle [ 1]);
	points.push(vertices[ 4]);
	points.push(vertices[ 5]);

	points.push(verticesTriangle [ 2]);
	points.push(vertices[ 5]);
	points.push(vertices[ 1]);

	points.push(verticesTriangle [ 3]);
	points.push(vertices[ 1]);
	points.push(vertices[ 2]);
	
	points.push(verticesTriangle [ 4]);
	points.push(vertices[ 2]);
	points.push(vertices[ 3]);



	
	
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.2, 0.0, 0.2, 1.0 ); // black background

    
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate our shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {
    var startPentagon     = 0;
    var numPentagonPoints = 7;
    var startTriangle = numPentagonPoints ;
    var numTriaPoints = 15;
    var yellow = vec4( 0.3, 0.3, 0.3, 1.0 );
    

	
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLE_FAN, startPentagon, numPentagonPoints);
	
    
    // draw the triangle
    //gl.uniform4fv(currentColorLoc, yellow );
    gl.drawArrays( gl.TRIANGLES, startTriangle, numTriaPoints );

}
