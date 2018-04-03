
var grobjects = grobjects || [];

var Ball = undefined;

(function() {
    "use strict";

                var shaderProgram = undefined;
    var buffers = undefined;
    var vposdata = [];
    var vnormaldata = [];

        Ball = function Ball(name, position, sizel,sizeb,sizeh, color, theta) {
        this.name = name;
        this.position = position || [0,0,0];
        this.sizel = sizel || 1.0;
        this.sizeb = sizeb || 1.0;
        this.sizeh = sizeh || 1.0;
        this.color = color || [.7,.8,.9];
        this.theta = theta || 0;
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
    Ball.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        var diamondVerts = [ [0,0,0], [1,0,0], [1,0,1], [0,0,1], [.5,.5,0], [.5,.5,1], [0,.5,.5], [1,.5,.5], [.5,-.5,0], [.5,-.5,1], [0,-.5,.5], [1,-.5,.5]];
        var diamondTris = [ [0,1,4], [0,1,8], [1,2,7], [1,2,11], [2,3,5], [2,3,9], [3,0,6], [3,0,10], [0,4,6], [0,8,10], 
                            [3,5,6], [3,9,10], [2,5,7], [2,9,11], [1,4,7] , [1,8,11], [4,5,7] ,[4,6,5], [8,9,11], [8,10,9] ];
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
    Ball.prototype.draw = function(drawingState) {
                var modelM = twgl.m4.scaling([this.sizel,this.sizeb,this.sizeh]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        twgl.m4.rotateY(modelM, this.theta, modelM);
                var gl = drawingState.gl;


        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Ball.prototype.center = function(drawingState) {
        return this.position;
    }


                                                                                                                            

})();

grobjects.push(new Ball("ball1",[-4.25,3.5,-4.25],1.5,1.5,1.5,[0.0,100.0/255,0.0]) );

