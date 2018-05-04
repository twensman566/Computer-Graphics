"use strict";

var numDivisions = 5;

var index = 0;

var points = [];

var modelView = [];
var projection = [];

var Theta = new Array(3);

var axis =0;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var theta = [0, 0, 0];

var render, canvas, gl;
var program;

var flag = false;

var bezier = function(u) {
    var b =new Array(4);
    var a = 1-u;
    b[3] = a*a*a;
    b[2] = 3*a*a*u;
    b[1] = 3*a*u*u;
    b[0] = u*u*u;
    return b;
}

onload = function init()  {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 0.5, 0.0, 1.0, 1.0 );



    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    for(var i=0; i<numDivisions; i++) for(var j =0; j<numDivisions; j++) {
        points.push(data[i][j]);
        points.push(data[i+1][j]);
        points.push(data[i+1][j+1]);
        points.push(data[i][j]);
        points.push(data[i+1][j+1]);
        points.push(data[i][j+1]);
        index += 6;
        }
    }

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );


    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    projection = ortho(-2, 2, -2, 2, -20, 20);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "Projection"), false, flatten(projection));

    render();
}

render = function(){
            gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            if(flag) theta[axis] += 0.5;

            modelView = mat4();

            modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0]));
            modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0]));
            modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1]));


            gl.uniformMatrix4fv( gl.getUniformLocation(program, "ModelView"), false, flatten(modelView) );

            for(var i=0; i<index; i+=3) gl.drawArrays( gl.TRIANGLES, i, 3 );
            requestAnimFrame(render);
        }
