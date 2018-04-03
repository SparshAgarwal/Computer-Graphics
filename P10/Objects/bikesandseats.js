
var grobjects = grobjects || [];

var star = undefined;
var Spinningstar = undefined;

(function() {
    "use strict";

                var shaderProgram = undefined;
    var buffers = undefined;
    var vposdata = [];
    var vnormaldata = [];

        star = function star(name, position, sizel,sizeb,sizeh, color, thetaX,thetaY,thetaZ) {
        this.name = name;
        this.position = position || [0,0,0];
        this.sizel = sizel || 1.0;
        this.sizeb = sizeb || 1.0;
        this.sizeh = sizeh || 1.0;
        this.color = color || [.7,.8,.9];
        this.thetaX = thetaX || 0;
        this.thetaY = thetaY || 0;
        this.thetaZ = thetaZ || 0;
    }

    function drawDiamond(diamondVerts,diamondTris) {
        for (var i=0; i<diamondTris.length; i++ ) {

            var t=diamondTris[i];
            var p1 = diamondVerts[t[0]];
            var p2 = diamondVerts[t[1]];
            var p3 = diamondVerts[t[2]];
            vposdata = vposdata.concat(p1);
            vposdata = vposdata.concat(p2);
            vposdata = vposdata.concat(p3);

                        var v3 = twgl.v3;
            var e1 = v3.subtract(p1,p2);
            var e2 = v3.subtract(p1,p3);
            var n = Array.prototype.slice.call(v3.normalize(v3.cross(e1,e2)));
                        vnormaldata = vnormaldata.concat(n);
            vnormaldata = vnormaldata.concat(n);
            vnormaldata = vnormaldata.concat(n);
        }
    }
    star.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        var diamondVerts = [
                [-0.5,  0.0,  -0.5],                   [ 0.0,  0.0,  -0.5],                   [ 0.5,  0.0,  -0.5],                   [ 0.0,  1.0,   0.0],                   [-0.5,  0.0,  -0.5],                   [ 0.0,  0.0,  -0.5],                   [ 0.5,  0.0,  -0.5],                   [ 0.0,  -1.0,  0.0],                   [-0.5,  0.0,  -0.5],                   [-0.5,  0.0,   0.0],                   [-0.5,  0.0,   0.5],                   [ 0.0,  1.0,   0.0],                   [-0.5,  0.0,  -0.5],                   [-0.5,  0.0,   0.0],                   [-0.5,  0.0,   0.5],                   [ 0.0,  -1.0,  0.0],                   [-0.5,  0.0,   0.5],                   [ 0.0,  0.0,   0.5],                   [ 0.5,  0.0,   0.5],                   [ 0.0,  1.0,   0.0],                   [-0.5,  0.0,   0.5],                   [ 0.0,  0.0,   0.5],                   [ 0.5,  0.0,   0.5],                   [ 0.0,  -1.0,  0.0],                   [ 0.5,  0.0,   0.5],                   [ 0.5,  0.0,   0.0],                   [ 0.5,  0.0,  -0.5],                   [ 0.0,  1.0,   0.0],                   [ 0.5,  0.0,   0.5],                   [ 0.5,  0.0,   0.0],                   [ 0.5,  0.0,  -0.5],                   [ 0.0,  -1.0,  0.0]                    ];
        var diamondTris = [
                     [1, 0, 3],
                     [1, 2, 3],
                     [5, 4, 7],
                     [5, 6, 7],
                     [9, 8, 11],
                     [9, 10, 11],
                     [13, 12, 15],
                     [13, 14, 15],
                     [17, 16, 19],
                     [17, 18, 19],
                     [21, 20, 23],
                     [21, 22, 23],
                     [25, 24, 27],
                     [25, 26, 27],
                     [29, 28, 31],
                     [29, 30, 31]];
                                
        drawDiamond(diamondVerts,diamondTris);
                        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: vposdata },
                vnormal : {numComponents:3, data: vnormaldata}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
            };
            // console.log(arrays)
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    star.prototype.draw = function(drawingState) {
                var modelM = twgl.m4.scaling([this.sizel,this.sizeb,this.sizeh]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        twgl.m4.rotateX(modelM, this.thetaX, modelM);
        twgl.m4.rotateY(modelM, this.thetaY, modelM);
        twgl.m4.rotateZ(modelM, this.thetaZ, modelM);
                var gl = drawingState.gl;


        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    star.prototype.center = function(drawingState) {
        return this.position;
    }


                                                                                                                            

})();

// grobjects.push(new star("bike1",[-4.25,0.15, 0.65],0.3,.3,.3,[0.7,0,0],0,0,1.5714) );
// grobjects.push(new star("bike2",[-4.25,0.15, 2.15],0.3,.3,.3,[0.7,0,0],0,0,1.5714) );
// grobjects.push(new star("bike3",[-4.25,0.15, 3.65],0.3,.3,.3,[0.7,0,0],0,0,1.5714) );
// grobjects.push(new star("bike4",[ 4.25,0.15,-0.65],0.3,.3,.3,[0.7,0,0],0,0,1.5714) );
// grobjects.push(new star("bike5",[ 4.25,0.15, 0.85],0.3,.3,.3,[0.7,0,0],0,0,1.5714) );
// grobjects.push(new star("bike6",[ 4.25,0.15, 2.35],0.3,.3,.3,[0.7,0,0],0,0,1.5714) );
// grobjects.push(new star("bike7",[-2.35,0.15, 4.25],0.3,.3,.3,[0.7,0,0],0,1.5714,1.5714) );
// grobjects.push(new star("bike8",[-0.85,0.15, 4.25],0.3,.3,.3,[0.7,0,0],0,1.5714,1.5714) );
// grobjects.push(new star("bike9",[ 0.65,0.15, 4.25],0.3,.3,.3,[0.7,0,0],0,1.5714,1.5714) );
// grobjects.push(new star("bike10",[ 2.15,0.15, 4.25],0.3,.3,.3,[0.7,0,0],0,1.5714,1.5714) );
// grobjects.push(new star("bike11",[ 3.65,0.15, 4.25],0.3,.3,.3,[0.7,0,0],0,1.5714,1.5714) );
grobjects.push(new star("seat1",[ 1.00,0.01, 0.00],0.23,0.23,0.23,[.7,.8,.9],0,3*0.78539816339,1.5714) );
grobjects.push(new star("seat2",[-1.00,0.01, 0.00],0.23,0.23,0.23,[.7,.8,.9],0,0.78539816339,1.5714) );
grobjects.push(new star("seat3",[ 1.00,0.01, 2.00],0.23,0.23,0.23,[.7,.8,.9],0,0.78539816339,1.5714) );
grobjects.push(new star("seat4",[-1.00,0.01, 2.00],0.23,0.23,0.23,[.7,.8,.9],0,3*0.78539816339,1.5714) );

