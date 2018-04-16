

var canvas;
var gl;

var NumVertices  = 18;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis  = 2;
var theta = [ 0, 0, 0 ];
var run   = true;  // added by JAWH, 2018/02/01


var scaleFactor = [1,1,1];
var transFactor = [0,0,0];
var transFactory =[0,0,0];

var thetaLoc;
var transLoc;
var transLocy;
var scaleLoc;
var scale = 1;
var rotation;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    run = false;


    var scaleFactorChange = document.getElementById("scaleFactor");
var translationFactorChange = document.getElementById("translationFactor");
var translationFactoryChange   = document.getElementById("translationFactory");
var rotationFactorChange = document.getElementById("rotationFactor");
	
    scaleFactorChange.onchange = 
    function () {
       scale = parseInt(scaleFactorChange.value,10);
       scaleFactor = [scale/10,scale/10,scale/10];
     };
    translationFactorChange.onchange = 
    function () {
       var translation = parseInt(translationFactorChange.value,10);
       transFactor = [translation/10 ,translation/10 ,translation/10 ];
     };



    translationFactoryChange.onchange = 
    function () {
       var translationy = parseInt(translationFactoryChange.value,10);
       transFactory = [translationy/10 ,translationy/10 ,translationy/10 ];
     };




    rotationFactorChange.onchange = 
    function () {
       rotation = parseInt(rotationFactorChange.value,10);
       theta = [rotation ,rotation ,rotation ];
run = true;
     };


    colorCube();


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 1.0, 1.0, 1.0 );

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
    scaleLoc = gl.getUniformLocation(program, "scaleFactor");
    transLoc = gl.getUniformLocation(program, "transFactor");
    transLocy = gl.getUniformLocation(program, "transFactory");



    render();
}

function colorCube()
{
    //triangles( 1, 0, 3 );
    //triangles( 1, 3, 2 );
    triangles( 3, 0, 4, );
	triangles( 3, 4, 7 );
	triangles( 8, 0, 3);
	triangles( 8, 3, 7 );
	triangles( 8, 7, 4 );
	triangles( 8, 4, 0);
   // triangles( 2, 1, 5 );
    //triangles( 4, 5, 6 );
   // triangles( 5, 4, 0 );
	//triangles( 5, 1, 0);
	//triangles( 2, 3, 5 );
	//triangles( 3, 5, 4 );
}

function triangles(a, b, c )
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
gl.clear( gl.COLOR_BUFFER_BIT );

    if (run) theta[axis] += rotation;  // if (run) added by JAWH, 2018/02/01
    gl.uniform3fv(thetaLoc, theta);
    gl.uniform3fv( transLoc, transFactor);
    gl.uniform3fv(scaleLoc, scaleFactor);
    gl.uniform3fv( transLocy, transFactory);
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    requestAnimFrame( render );
run = false;

}
