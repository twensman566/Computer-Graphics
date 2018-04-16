// object2.js

//  Program to draw a green square and a blue triangle
//  Adapted from Angel & Shreiner 2D Sierpinski Gasket program
//  and from Whitford Holey's object2 program
//  by J. Andrew Whitford Holey, January 11, 2016


var gl;
var points = [];
var currentColorLoc;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the stamp.
    //



    points       = [];
    k = 64;
    var origin   = vec2((0.0-.6666666)/3.66666, (0.0+1) /2);
    var start    = vec2((1.0-.6666666)/3.666666, (0.0+1)/2);
    var p1       = start;
    var theta    = 2.0 * Math.PI / k;
    
    for (j = 1; j < k; j++) {
        var p2 = vec2((Math.cos(j * theta)-.6666666)/3.666666, (Math.sin(j * theta)+1)/2.);
        points.push(origin);
        points.push(p1);
        points.push(p2);
        p1 = p2;
    }
    points.push(origin);
    points.push(p1);
    points.push(start);





    //Upper L
    var quadVertices = [
        vec2(  -1.0,  1.0  ), //  0
        vec2(  -1.0,  0.90 ), //  1
        vec2(  -0.6,  1.0  ), //  2
        vec2(  -0.6,  0.90 ), //  3
    ];
   //MiddleL
    var middleL = [
		vec2(  -.90 , .93 ), //0
		vec2(  -.90 , 0.0 ), //1
		vec2(  -0.7 , 0.0 ), //2
		vec2(  -0.7 , .93 ), //3
	];

  //Lower L
	var lowerL = [
		vec2(  -1.0 , 0.15 ), //0
		vec2(  -1.0 , 0.0 ), //1
		vec2(  -0.5 , 0.15 ), //2
		vec2(  -0.5 , 0.0 ), //3
	];



    // Set up the UpperL
    points.push( quadVertices[ 0] );
    points.push( quadVertices[ 1] );
    points.push( quadVertices[ 2] );

    points.push( quadVertices[ 1] );
    points.push( quadVertices[ 2] );
    points.push( quadVertices[ 3] );

    // Set up the MiddleL
    points.push( middleL [ 0] );
    points.push( middleL [ 1] );
    points.push( middleL [ 2] );
    points.push( middleL [ 0] );
    points.push( middleL [ 2] );
    points.push( middleL [ 3] );

  
    // Set lowerL
    points.push( lowerL [ 0] );
    points.push( lowerL [ 1] );
    points.push( lowerL [ 2] );
    points.push( lowerL [ 3] );
    points.push( lowerL [ 1] );
    points.push( lowerL [ 2] );
    
    // Set TriangleL
    var TriangleL= [
		vec2(  -0.65 , 0.0 ), //0
		vec2(  -0.45 , 0.0 ), //1
		vec2(  -0.45 , 0.35), //2
	];
    points.push( TriangleL[ 0] );
    points.push( TriangleL[ 1] );
    points.push( TriangleL[ 2] );

    // Set EndL

        var EndL= [
		vec2(  -0.45 , 0.25 ), //0
		vec2(  -0.50 , 0.25 ), //1
		vec2(  -0.50 , 0.4  ), //2
		vec2(  -0.45 , 0.4  )  //3
	];
    points.push( EndL[ 0] );
    points.push( EndL[ 1] );
    points.push( EndL[ 3] );
    points.push( EndL[ 3] );
    points.push( EndL[ 1] );
    points.push( EndL[ 2] );

	

	var TopV =[
		vec2(  -1.0 ,  0  ), //0
		vec2(  -1.0 , -.09), //1
		vec2(  -0.68, -.09), //2
		vec2(  -0.68, 0.0 ) //3
	];
    points.push( TopV [ 0] );
    points.push( TopV [ 1] );
    points.push( TopV [ 3] );
    points.push( TopV [ 3] );
    points.push( TopV [ 1] );
    points.push( TopV [ 2] );

	var leftV =[
		vec2(  -.95 , -.09 ), //0
		vec2(  -.75 , -1.0 ), //1
		vec2(  -.65 , -.65 ), //2
		vec2(  -.75 , -.09 ), //3
];


    points.push( leftV [ 0] );
    points.push( leftV [ 1] );
    points.push( leftV [ 3] );
    points.push( leftV [ 3] );
    points.push( leftV [ 1] );
    points.push( leftV [ 2] );






	var rightV =[
		vec2(  -.75 , -1.0 ), //0
		vec2(  -.70 , -1.0 ), //1
		vec2(  -.50 , -.09 ), //2
		vec2(  -.55 , -.09 ), //3
];


    points.push( rightV [ 0] );
    points.push( rightV [ 1] );
    points.push( rightV [ 3] );
    points.push( rightV [ 3] );
    points.push( rightV [ 1] );
    points.push( rightV [ 2] );

	var rightTopV =[
		vec2(  -.60 , 0.0   ), //0
		vec2(  -.60 , -0.09 ), //1
		vec2(  -.45 , -0.09 ), //2
		vec2(  -.45 , 0.0   ), //3
];


    points.push( rightTopV [ 0] );
    points.push( rightTopV [ 1] );
    points.push( rightTopV [ 3] );
    points.push( rightTopV [ 3] );
    points.push( rightTopV [ 1] );
    points.push( rightTopV [ 2] );


//E
var leftTopE =[
		vec2(  -.45 , 0.0   ), //0
		vec2(  -.45 , -0.09 ), //1
		vec2(  -.33 , -0.12 ), //2
		vec2(  -.33 , 0.0   ), //3
];


    points.push( leftTopE [ 0] );
    points.push( leftTopE [ 1] );
    points.push( leftTopE [ 3] );
    points.push( leftTopE [ 3] );
    points.push( leftTopE [ 1] );
    points.push( leftTopE [ 2] );

var MiddleE=[
		vec2(  -.33 , 0.0   ), //0
		vec2(  -.33 , -1.0  ), //1
		vec2(  -.20 , -1.0  ), //2
		vec2(  -.20 , 0.0   ), //3
];

    points.push( MiddleE[ 0] );
    points.push( MiddleE[ 1] );
    points.push( MiddleE[ 3] );
    points.push( MiddleE[ 3] );
    points.push( MiddleE[ 1] );
    points.push( MiddleE[ 2] );

//BottomLeftE

var topE=[
		vec2(  -.20 ,     0   ), //0
		vec2(  -.20 , -0.10   ), //1
		vec2(     0 , -0.10   ), //2
		vec2(     0 ,     0   ), //3
];

    points.push( topE[ 0] );
    points.push( topE[ 1] );
    points.push( topE[ 3] );
    points.push( topE[ 3] );
    points.push( topE[ 1] );
    points.push( topE[ 2] );
	
//TopE
	var BottomLeftE=[
		vec2(  -.45 , -0.93   ), //0
		vec2(  -.45 , -1.0    ), //1
		vec2(  -.33 , -1.0    ), //2
		vec2(  -.33 , -0.90   ), //3
];

    points.push( BottomLeftE[ 0] );
    points.push( BottomLeftE[ 1] );
    points.push( BottomLeftE[ 3] );
    points.push( BottomLeftE[ 3] );
    points.push( BottomLeftE[ 1] );
    points.push( BottomLeftE[ 2] );

//MiddleE
	var MiddleE=[
		vec2(  -.20 , -0.45   ), //0
		vec2(  -.20 , -0.55   ), //1
		vec2(     0 , -0.55    ), //2
		vec2(     0 , -0.45   ), //3
];

    points.push( MiddleE[ 0] );
    points.push( MiddleE[ 1] );
    points.push( MiddleE[ 3] );
    points.push( MiddleE[ 3] );
    points.push( MiddleE[ 1] );
    points.push( MiddleE[ 2] );
	
//BottomE
	var BottomE=[		
		vec2(  -.20 , -0.90   ), //0
		vec2(  -.20 , -1.00   ), //1
		vec2(     0 , -1.00    ), //2
		vec2(     0 , -0.90   ), //3
		
];

    points.push( BottomE[ 0] );
    points.push( BottomE[ 1] );
    points.push( BottomE[ 3] );
    points.push( BottomE[ 3] );
    points.push( BottomE[ 1] );
    points.push( BottomE[ 2] );

//TopETriangle
		var TopTriangleE=[		
		vec2( -.05, 0.00   ), //0
		vec2(  .05, -.25   ), //1
		vec2(  .05, 0      ), //2
		
];
    points.push( TopTriangleE[ 0] );
    points.push( TopTriangleE[ 1] );
    points.push( TopTriangleE[ 2] );
	
//TopERect
	var TopERect=[		
		vec2(  .02, 0.00   ), //0
		vec2(  .02, -.25   ), //1
		vec2(  .05, -.25   ), //2
		vec2(  .05, 0      ), //3
	]
	points.push( TopERect[ 0] );
    points.push( TopERect[ 1] );
    points.push( TopERect[ 3] );
    points.push( TopERect[ 3] );
    points.push( TopERect[ 1] );
    points.push( TopERect[ 2] );
	
	
	//BottomETriangle
		var BottomETriangle=[		
		vec2( -.05, -1.00  ), //0
		vec2(  .05, -.75   ), //1
		vec2(  .05, -1.00      ), //2
		
];
    points.push( BottomETriangle[ 0] );
    points.push( BottomETriangle[ 1] );
    points.push( BottomETriangle[ 2] );
	
	//BottomERect
	var BottomERect=[		
		vec2(  .02, -.75   ), //0
		vec2(  .02, -1.00  ), //1
		vec2(  .05, -1.00  ), //2
		vec2(  .05, -.75   ), //3
	]
	points.push( BottomERect[ 0] );
    points.push( BottomERect[ 1] );
    points.push( BottomERect[ 3] );
    points.push( BottomERect[ 3] );
    points.push( BottomERect[ 1] );
    points.push( BottomERect[ 2] );
	
	//MiddleETriangle
	var MiddleETriangle=[
		vec2(  -.07 , -0.50   ), //0
		vec2(     0 , -0.40   ), //1
		vec2(     0 , -0.60   ), //2

];

    points.push( MiddleETriangle[ 0] );
    points.push( MiddleETriangle[ 1] );
    points.push( MiddleETriangle[ 2] );

	
	
	var MiddleERect=[
		vec2(  -.018 , -0.40   ), //0
		vec2(  -.018 , -0.6    ), //1
		vec2(   .00  , -0.600  ), //2
		vec2(   .00  , -0.40   ), //3
];

    points.push( MiddleERect[ 0] );
    points.push( MiddleERect[ 1] );
    points.push( MiddleERect[ 3] );
    points.push( MiddleERect[ 3] );
    points.push( MiddleERect[ 1] );
    points.push( MiddleERect[ 2] );

	
	


	
    
	
	

	
	
	
	
	
   //First Green Rectangle Top Left
   var greenRect = [
		vec2(  -1.0  , 0.90 ), //0
		vec2(  -1.0  , 0.15 ), //1
		vec2(  -0.9 , 0.15 ), //2
		vec2(  -0.9 , 0.90 ),  //3
	];
	
    points.push( greenRect[ 0] );
    points.push( greenRect[ 1] );
    points.push( greenRect[ 2] );
    points.push( greenRect[ 3] );
    points.push( greenRect[ 2] );
    points.push( greenRect[ 0] );

   //Green Bottom Left
   var greenBottomLeft = [
		vec2(  -1.0  , -0.09 ), //0
		vec2(  -1.0  , -1.0  ), //1
		vec2(  -0.75 , -1.0  ), //2
		vec2(  -0.95 , -0.09 ), //3
	];
	
    points.push( greenBottomLeft [ 0] );
    points.push( greenBottomLeft [ 1] );
    points.push( greenBottomLeft [ 2] );
    points.push( greenBottomLeft [ 3] );
    points.push( greenBottomLeft [ 2] );
    points.push( greenBottomLeft [ 0] );

//GreenMiddle
   var GreenMiddle= [
		vec2(  -0.7  , -1.0   ), //0
		vec2(  -0.45 , -1.0   ), //1
		vec2(  -0.45 , -0.09  ), //2
		vec2(  -0.50 , -0.09  ), //3
	];

    points.push( GreenMiddle[ 0] );
    points.push( GreenMiddle[ 1] );
    points.push( GreenMiddle[ 2] );
    points.push( GreenMiddle[ 3] );
    points.push( GreenMiddle[ 2] );
    points.push( GreenMiddle[ 0] );

//GreenRightMiddle
   var GreenRightMiddle= [
		vec2(  -0.45  , -0.09  ), //0
		vec2(  -0.45  , -0.93  ), //1
		vec2(  -0.33  , -0.90  ), //2
		vec2(  -0.33  , -0.12  ), //3
	];

    points.push( GreenRightMiddle[ 0] );
    points.push( GreenRightMiddle[ 1] );
    points.push( GreenRightMiddle[ 2] );
    points.push( GreenRightMiddle[ 3] );
    points.push( GreenRightMiddle[ 2] );
    points.push( GreenRightMiddle[ 0] );




//GreenRectO

   var GreenRectO= [
		vec2(  -0.33  , 0.45  ), //0
		vec2(  -0.20  , 0.23  ), //1
		vec2(  -0.05  , 0.60  ), //2
		vec2(  -0.19  , 0.80  ), //3
	];

    points.push( GreenRectO[ 0] );
    points.push( GreenRectO[ 1] );
    points.push( GreenRectO[ 2] );
    points.push( GreenRectO[ 3] );
    points.push( GreenRectO[ 2] );
    points.push( GreenRectO[ 0] );





    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 1.0, 1.0 ); // Blue background

    
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate our shader variables with our data buffer
    
    var vPosition   = gl.getAttribLocation( program, "vPosition" );
    currentColorLoc = gl.getUniformLocation(program, "currentColor");
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {
    var L  = 0;
    var circlePoints = 192;
    var numLPoints = 114;

    var startTriangle = numLPoints + circlePoints;
    var numTriaPoints = 6;

    var red = vec4( 1.0, 0.0, 0.0, 1.0 );
    var blue  = vec4( 0.0, 0.0, 1.0, 1.0 );
    var green  = vec4( 0.0, 0.8, 0.0, 1.0 );

    // clear the canvas
    gl.clear( gl.COLOR_BUFFER_BIT );
    

    gl.uniform4fv( currentColorLoc, red );
    gl.drawArrays( gl.TRIANGLES, L, circlePoints);

    // draw the Love
    gl.uniform4fv( currentColorLoc, red );
    gl.drawArrays( gl.TRIANGLES, circlePoints , numLPoints );
    
    // draw the triangle
    gl.uniform4fv( currentColorLoc, green );
    gl.drawArrays( gl.TRIANGLES, startTriangle,30);
}
