/*
 * File: bezierPointsOnly.js
 */

/**
 * This file contains JavaScript functions to divide a Bezier curve,
 * to divide a Bezier patch, and to draw points from a Bezier patch.
 * These functions render points only without computing normals or
 * assigning texture coordinates.
 * These functions assume definitions in the file MV.js provided with
 * the Angel & Shreiner graphics text.
 *
 * @author  all code from Angel & Shreiner, _Interactive Computer Graphics_, 7th Edition
 * @version March 31, 2016
 */


/**
 * Divides c into left (l) and right (r) curve data, where
 * c is a vec4 containing Bezier curve data points, and
 * l and r are (uninitialized) vec4 objects.
 * and data in l and r is overwritten.
 */
function divideCurve(c, r, l) {

   var mid = mix(c[1], c[2], 0.5);

   l[0] = vec4(c[0]);
   l[1] = mix(c[0], c[1], 0.5);
   l[2] = mix(l[1], mid,  0.5);


   r[3] = vec4(c[3]);
   r[2] = mix(c[2], c[3], 0.5);
   r[1] = mix(mid,  r[2], 0.5);

   r[0] = mix(l[2], r[1], 0.5);
   l[3] = vec4(r[0]);
 
   return;
}


/**
 * Pushes vec4 coordinates for two triangles, bounded by the corners
 * of the Bezier patch p into the global array points.
 */
function drawPatch(p) {
    
    points.push(p[0][0]);
    points.push(p[0][3]);
    points.push(p[3][3]);
    points.push(p[0][0]);
    points.push(p[3][3]);
    points.push(p[3][0]);

    return;
}


/**
 * Recursively divides a Bezier patch p count times into four
 * subpatches;
 * when count reaches 0, it calls drawPatch on each subpatch to
 * put six points representing two triangles into the array points.
 * The parameter p should be a 4 X 4 X 4 array of coordinates, that is,
 * four rows of four columns of vec4 points.
 */
dividePatch = function (p, count) {

  if (count <= 0) {
    drawPatch(p);
  } else {
   
    var a = mat4();
    var b = mat4();
    var q = mat4();
    var r = mat4();
    var s = mat4();
    var t = mat4();

    // subdivide curves in u direction, transpose results, divide
    // in u direction again (equivalent to subdivision in v)

    for (var k = 0; k < 4; ++k) {

      var pp = p[k];
      var aa = vec4();
      var bb = vec4();
                
      divideCurve(pp, aa, bb);
                                
      a[k] = vec4(aa);
      b[k] = vec4(bb);
    }

    a = transpose(a);
    b = transpose(b);
  
    for (var k = 0; k < 4; ++k) {
      var pp = vec4(a[k]);
      var aa = vec4();
      var bb = vec4();

      divideCurve(pp, aa, bb);

      q[k] = vec4(aa);
      r[k] = vec4(bb);
    }

    for (var k = 0; k < 4; ++k) {
      var pp = vec4(b[k]);
      var aa = vec4();
      var bb = vec4();
                
      divideCurve(pp, aa, bb);
                                
      s[k] = vec4(aa);
      t[k] = vec4(bb);       
    }

    // recursive division of 4 resulting patches
    dividePatch(q, count - 1);
    dividePatch(r, count - 1);
    dividePatch(s, count - 1);
    dividePatch(t, count - 1);
  }

  return;
}

