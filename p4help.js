/**
 * Created by gleicher on 9/25/15.
 *
 * Note: this program is not meant to be looked at by 559 students - they should write it
 * themselves!
 *
 * So the quality of the code is lacking. Everything is simple.
 */

// stuff to do to make initial stuff
// here instead of in HTML
// yes, the writeln is yucky but easy

// these should really get used
var xsize = 400;
var ysize = 400;

// these are the sliders I want
var sliders = [ ["speed",0,5,2],
    ["fov",10,90,60],["lookAtX",-10,10,0],["lookAtY",-10,10,0],["lookAtZ",-10,10,0],
    ["lookFromX",-10,10,0], ["lookFromY",-10,10,5],["lookFromZ",-10,10,10],
    ["perspective",0,1,1]
];
// make the sliders
sliders.forEach(function(s) {
    "use strict";
    document.write("<span style='display: inline-block; width: 80px;'>"+s[0]+"</span>")
    document.write("<input id=\""+s[0]+"\" type=\"range\" width=\"300\" " + "min=\"" + s[1] +"\" "  + "max=\"" + s[2] +"\" "  + "></input><br/>");
});

// have twgl handy
var m4 = twgl.m4;
var v3 = twgl.v3;

// to help with debugging
function say(str) { document.writeln(str); }
function br() { say("<br/>"); }
function writePoint(p) {
  say("["+p[0]+","+p[1]+","+p[2]+"] <br/>");
}

function toRadians(a) { "use strict"; return a/180*Math.PI; }

// the actual guts
function myApp() {
    "use strict";

    var mySliders = {};
    var myCanvas = document.getElementById("myCanvas");
    var context = myCanvas.getContext('2d');
    var painter = new Painter(myCanvas);
        var cb = document.getElementById("cb");
        var ns = document.getElementById("ns");
    ns.checked=false;

    var ab = new ArcBall(myCanvas);

    var cubeVerts = [ [0,0,0], [1,0,0], [1,0,1], [0,0,1], [.5,1,.5], [.5,-1,.5] ];
    var cubeTris = [
                     [0,1,4], 
                     [1,2,4],
                     [2,3,4],
                     [3,0,4],
                     [0,1,5], 
                     [1,2,5],
                     [2,3,5],
                     [3,0,5]
                    ];

    function drawCube(viewProj,model, rbase,gbase,bbase, triemph) {
        rbase = rbase || 0;
        bbase = bbase || 0;
        gbase = gbase || 0;
        triemph = triemph || 0;
        model = model || m4.identity();
        var dir = v3.normalize([0,2,1]);
        for (var i=0; i<cubeTris.length; i++ ) {

            var t=cubeTris[i];
            var p1 = m4.transformPoint(model,cubeVerts[t[0]]);
            var p2 = m4.transformPoint(model,cubeVerts[t[1]]);
            var p3 = m4.transformPoint(model,cubeVerts[t[2]]);

            // compute the normal
            var e1 = v3.subtract(p1,p2);
            var e2 = v3.subtract(p1,p3);
            var n = v3.normalize(v3.cross(e1,e2));

            var p1 = m4.transformPoint(viewProj,p1);
            var p2 = m4.transformPoint(viewProj,p2);
            var p3 = m4.transformPoint(viewProj,p3);

            var r, g,b;

            r = rbase + (i%2) ;
            g = gbase + (i%2) ;
            b = bbase;

            var l = .3 + Math.abs(v3.dot(n,dir));
            r = r*l;
            g = g*l;
            b = b*l;

            var color = "rgb("+Math.round(r)+","+Math.round(g)+","+Math.round(b)+")";


            painter.triangle(p1,p2,p3, color);
        };

    }

    var theta = 0;
    function draw() {
        // hack to clear the canvas fast
        myCanvas.width = myCanvas.width;

        // set a reasonable viewport
        var viewport = m4.scaling([xsize/2,-ysize/2,1]);
        m4.setTranslation(viewport,[xsize/2,ysize/2,0],viewport);
        // writePoint(m4.transformPoint(viewport,[0,0,0]));
        // writePoint(m4.transformPoint(viewport,[.5,.5,0]));

        // get the projection   
        var projM;
        if (mySliders.perspective.value > 0) {
            var fov = toRadians(mySliders.fov.value);
            projM = m4.perspective(fov, 1, 0.1, 100);
        } else {
            projM = m4.scaling([.1,.1,1]);
        }
        // don't forget... lookat give the CAMERA matrix, not the view matrix
        var lookAtPt = [mySliders.lookAtX.value, mySliders.lookAtY.value, mySliders.lookAtZ.value];
        var lookFromPt = [mySliders.lookFromX.value, mySliders.lookFromY.value, mySliders.lookFromZ.value];
        var lookatI = m4.lookAt(lookFromPt, lookAtPt, [0,1,0]);
        var lookatM = m4.inverse(lookatI);

        // the whole transform
        var viewii = m4.multiply(ab.getMatrix(),lookatM);
        var viewi = m4.multiply(viewii,projM);
        var view = m4.multiply(viewi,viewport);


        painter.clear();

        // draw a groundplane - a 5x5 checkerboard
        // var x,z;
        // for(x=-2; x<2; x+=1) {
        //     for(z=-2; z<2; z+=1) {
        //         var corner1 = m4.transformPoint(view, [x, 0, z]);
        //         var corner2 = m4.transformPoint(view, [x, 0, z+1]);
        //         var corner3 = m4.transformPoint(view, [x +1, 0, z + 1]);
        //         var corner4 = m4.transformPoint(view, [x +1, 0, z]);
        //         painter.triangle(corner1,corner2,corner3,((x+z)%2) ? "#888" : "#CCC");
        //         painter.triangle(corner1,corner3,corner4,((x+z)%2) ? "#999" : "#DDD");
        //     }
        // }

        var ctr1 = m4.translation([2, 0, 0]);
        var ctr2 = m4.translation([3.5, 0, 0]);
        var ctr3 = m4.translation([6, 0, 0]);

        var r =100;
        var g =100;
        var b =100;

        drawCube(view,                                                   m4.translation([.5,.5,.5]), r,0*g,0*b, 5);
        drawCube(view, m4.multiply(m4.multiply(ctr1,m4.rotationY(theta)), m4.translation([1,.5,1]) ), r,0.3*g,0.3*b, 2);
        drawCube(view, m4.multiply(m4.multiply(ctr2,m4.rotationY(-theta*1.3)), m4.translation([1,.5,1]) ), 0*r,.5*g,.5*b, 0);
        drawCube(view, m4.multiply(m4.multiply(ctr3,m4.rotationY(theta*1.2)), m4.translation([1,.5,1]) ));

        theta += +mySliders.speed.value / 50;

        if (cb.checked) {
            painter.wireframe();
        } else {
            painter.render(ns.checked);
        }
        window.requestAnimationFrame(draw);;

    }

    // set up the sliders before drawing
    sliders.forEach(function(s) {
        var sl = document.getElementById(s[0]);
        sl.value = s[3];
        mySliders[s[0]] = sl;
    });

    window.requestAnimationFrame(draw);;
}
window.onload = myApp();