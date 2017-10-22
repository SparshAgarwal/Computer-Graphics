
var xsize = 400;
var ysize = 400;
var m4 = twgl.m4;
var v3 = twgl.v3;

var sliders = [ ["speed",0,5,2],
    ["fov",10,90,60],["lookAtX",-10,10,0],["lookAtY",-10,10,0],["lookAtZ",-10,10,0],
    ["lookFromX",-10,10,0], ["lookFromY",-10,10,5],["lookFromZ",-10,10,10],
    ["perspective",0,1,1]
];

sliders.forEach(function(s) {
    "use strict";
    document.write("<span style='display: inline-block; width: 80px;'>"+s[0]+"</span>")
    document.write("<input id=\""+s[0]+"\" type=\"range\" width=\"300\" " + "min=\"" + s[1] +"\" "  + "max=\"" + s[2] +"\" "  + "></input><br/>");
});


function toRadians(a) { "use strict"; return a/180*Math.PI; }

function setup() {
    "use strict";

    var mySliders = {};
    var myCanvas = document.getElementById("myCanvas");
    var context = myCanvas.getContext('2d');

    var painter = new Painter(myCanvas);
        var cb = document.getElementById("cb");
        var ns = document.getElementById("ns");
    ns.checked=false;

    var ab = new ArcBall(myCanvas);

    var diamondVerts = [ [0,0,0], [1,0,0], [1,0,1], [0,0,1], [.5,.5,0], [.5,.5,1], [0,.5,.5], [1,.5,.5], [.5,-.5,0], [.5,-.5,1], [0,-.5,.5], [1,-.5,.5]];
    var diamondTris = [ [0,1,4], [0,1,8], [1,2,7], [1,2,11], [2,3,5], [2,3,9], [3,0,6], [3,0,10], [0,4,6], [0,8,10], [3,5,6], [3,9,10], [2,5,7], [2,9,11], [1,4,7] , [1,8,11], [4,5,7] ,[4,6,5], [8,9,11], [8,10,9] ];

    function drawDiamond(viewProj,model, rbase,gbase,bbase, triemph) {
        rbase = rbase || 0;
        bbase = bbase || 0;
        gbase = gbase || 0;
        triemph = triemph || 0;
        model = model || m4.identity();
        var dir = v3.normalize([0,2,1]);
        for (var i=0; i<diamondTris.length; i++ ) {

            var t=diamondTris[i];
            var p1 = m4.transformPoint(model,diamondVerts[t[0]]);
            var p2 = m4.transformPoint(model,diamondVerts[t[1]]);
            var p3 = m4.transformPoint(model,diamondVerts[t[2]]);

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

    var starVerts = [ [0,0,0], [.1,0,0], [.05,.0866,0],[.05,-.0866,0]];
    var starTris = [ [0,1,2], [0,1,3]];
    function drawStar(viewProj,model, rbase,gbase,bbase, triemph) {
        rbase = rbase || 0;
        bbase = bbase || 0;
        gbase = gbase || 0;
        triemph = triemph || 0;
        model = model || m4.identity();
        var dir = v3.normalize([0,2,1]);
        for (var i=0; i<starTris.length; i++ ) {

            var t=starTris[i];
            var p1 = m4.transformPoint(model,starVerts[t[0]]);
            var p2 = m4.transformPoint(model,starVerts[t[1]]);
            var p3 = m4.transformPoint(model,starVerts[t[2]]);

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
        myCanvas.width = myCanvas.width;
        context.beginPath();
        context.rect(0, 0, 500, 500);
        context.fillStyle = "black";
        context.fill();

        var viewport = m4.scaling([xsize/2,-ysize/2,1]);
        m4.setTranslation(viewport,[xsize/2,ysize/2,0],viewport);

        var projM;
        if (mySliders.perspective.value > 0) {
            var fov = toRadians(mySliders.fov.value);
            projM = m4.perspective(fov, 1, 0.1, 100);
        } else {
            projM = m4.scaling([.1,.1,1]);
        }
        var lookAtPt = [mySliders.lookAtX.value, mySliders.lookAtY.value, mySliders.lookAtZ.value];
        var lookFromPt = [mySliders.lookFromX.value, mySliders.lookFromY.value, mySliders.lookFromZ.value];
        var lookatI = m4.lookAt(lookFromPt, lookAtPt, [0,1,0]);
        var lookatM = m4.inverse(lookatI);

        // the whole transform
        var viewii = m4.multiply(ab.getMatrix(),lookatM);
        var viewi = m4.multiply(viewii,projM);
        var view = m4.multiply(viewi,viewport);


        painter.clear();


        var ctr1 = m4.translation([2, 0, 0]);
        var ctr2 = m4.translation([3.5, 0, 0]);
        var ctr3 = m4.translation([6, 0, 0]);
        var ctr4 = m4.translation([-0.05, 0, 0]);

        var r =255;
        var g =255;
        var b =255;

        drawDiamond(view,                                                   m4.translation([.5,.5,.5]), r,g,0*b, 5);
        drawDiamond(view, m4.multiply(m4.multiply(ctr1,m4.rotationY(theta)), m4.translation([1,.5,1]) ), 72,72,72, 2);
        drawDiamond(view, m4.multiply(m4.multiply(ctr2,m4.rotationY(-theta*1.3)), m4.translation([1,.5,1]) ), 255,165,0, 0);
        drawDiamond(view, m4.multiply(m4.multiply(ctr3,m4.rotationY(theta*1.2)), m4.translation([1,.5,1]) ), 0,128,255, 0);
        drawStar(view, m4.multiply(m4.multiply(ctr4,m4.rotationY(theta*10)), m4.translation([6,4,6]) ), 255,255,255, 0);
        drawStar(view, m4.multiply(m4.multiply(ctr4,m4.rotationY(theta*10)), m4.translation([-2,5,4]) ), 255,255,255, 0);
        drawStar(view, m4.multiply(m4.multiply(ctr4,m4.rotationY(theta*10)), m4.translation([6,-4,3]) ), 255,255,255, 0);
        drawStar(view, m4.multiply(m4.multiply(ctr4,m4.rotationY(theta*10)), m4.translation([7,-2,-6]) ), 255,255,255, 0);
        drawStar(view, m4.multiply(m4.multiply(ctr4,m4.rotationY(theta*10)), m4.translation([-4,-2,4]) ), 255,255,255, 0);
        drawStar(view, m4.multiply(m4.multiply(ctr4,m4.rotationY(theta*10)), m4.translation([4,5,-3]) ), 255,255,255, 0);
        drawStar(view, m4.multiply(m4.multiply(ctr4,m4.rotationY(theta*10)), m4.translation([-3,-5,4]) ), 255,255,255, 0);

        theta += +mySliders.speed.value / 50;

        if (cb.checked) {
            painter.wireframe();
        } else {
            painter.render(ns.checked);
        }
        window.requestAnimationFrame(draw);;

    }

    sliders.forEach(function(s) {
        var sl = document.getElementById(s[0]);
        sl.value = s[3];
        mySliders[s[0]] = sl;
    });

    window.requestAnimationFrame(draw);;
}
window.onload = setup;