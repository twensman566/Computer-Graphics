/*
 * File: bezierPointsNormals.js
 */

/**
 * This file contains JavaScript functions to divide a Bezier curve,
 * to divide a Bezier patch, and to draw points from a Bezier patch.
 * These functions render points and normals but not texture coordinates.
 * These functions assume definitions in the file MV.js provided with
 * the Angel & Shreiner graphics text.
 *
 * @author  all code from Angel & Shreiner, _Interactive Computer Graphics_,
 *          7th Edition, adapted by J. Andrew Whitford Holey to include normals
 * @version March 31, 2016
 */


/**
 * Returns the vec3 normal vector of the three specified vec3 or vec4 points
 */
function triangleNormal(p1, p2, p3) {
  var v1 = vec3(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]);
  var v2 = vec3(p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]);
  return normalize(cross(v1, v2));
}


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
 * of the Bezier patch p into the global array points and normals
 * for the points into the global array normals.
 * If smooth, then it computes separate normals for each corner,
 * based on the adjacent control points;
 * otherwise, it computes the average normal based on the four corners.
 * If flipped, it negates all the normal vectors to allow for both
 * orientations of drawing.
 */
function drawPatch(p, smooth, flipped) {

  var n00, n03, n30, n33;
  if (smooth) {
    if (!flipped) {
      n00 = triangleNormal(p[0][0], p[0][1], p[1][0]);
      n03 = triangleNormal(p[0][3], p[1][3], p[0][2]);
      n30 = triangleNormal(p[3][0], p[2][0], p[3][1]);
      n33 = triangleNormal(p[3][3], p[3][2], p[2][3]);
    } else { // smooth && flipped
      n00 = negate(triangleNormal(p[0][0], p[0][1], p[1][0]));
      n03 = negate(triangleNormal(p[0][3], p[1][3], p[0][2]));
      n30 = negate(triangleNormal(p[3][0], p[2][0], p[3][1]));
      n33 = negate(triangleNormal(p[3][3], p[3][2], p[2][3]));
    }
  } else { // !smooth
    n00 = normalize(mix(triangleNormal(p[0][0], p[0][3], p[3][0]),
                        triangleNormal(p[3][3], p[3][0], p[0][3]),
                        0.5));
    if (flipped) n00 = negate(n00);
    n03 = n00;
    n30 = n00;
    n33 = n00;
  }
    
  points.push(p[0][0]);
  normals.push(n00);
  points.push(p[0][3]);
  normals.push(n03);
  points.push(p[3][3]);
  normals.push(n33);

  points.push(p[0][0]);
  normals.push(n00);
  points.push(p[3][3]);
  normals.push(n33);
  points.push(p[3][0]);
  normals.push(n30);

  return;
}


/**
 * Recursively divides a Bezier patch p count times into four
 * subpatches;
 * when count reaches 0, it calls drawPatch on each subpatch to
 * put six points representing two triangles into the array points.
 * The parameter p should be a 4 X 4 X 4 array of coordinates, that is,
 * four rows of four columns of vec4 points.
 * If smooth, then it computes separate normals for each corner,
 * based on the adjacent control points;
 * otherwise, it computes the average normal based on the four corners.
 * If flipped, it negates all the normal vectors to allow for both
 * orientations of drawing.
 */
dividePatch = function (p, count, smooth, flipped) {

  if (count <= 0) {
    drawPatch(p, smooth, flipped);
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
    dividePatch(q, count - 1, smooth, flipped);
    dividePatch(r, count - 1, smooth, flipped);
    dividePatch(s, count - 1, smooth, flipped);
    dividePatch(t, count - 1, smooth, flipped);
  }

  return;
}

