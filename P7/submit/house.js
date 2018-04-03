
var grobjects = grobjects || [];

var House = undefined;
var SpinningHouse = undefined;

(function() {
    "use strict";

                var shaderProgram = undefined;
    var buffers = undefined;

        House = function House(name, position, size, color, theta) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [1,1,0];
        this.theta = theta || 0;
    }
    House.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
                if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5, .5,-.5,        -.5,-.5,-.5,  .5, .5,-.5, -.5, .5,-.5,                        -.5,-.5, .5,  .5,-.5, .5,  .5, .5, .5,        -.5,-.5, .5,  .5, .5, .5, -.5, .5, .5,                        -.5,-.5,-.5,  .5,-.5,-.5,  .5,-.5, .5,        -.5,-.5,-.5,  .5,-.5, .5, -.5,-.5, .5,                        -.5,.5,-.5,  .5,.5,-.5,  .5,1.0, 0,        -.5,.5,-.5,  .5,1.0, 0, -.5,1.0, 0,                        -.5,.5,.5,  .5,.5,.5,  .5,1.0, 0,        -.5,.5,.5,  .5,1.0, 0, -.5,1.0, 0,                                                                -.5,-.5,-.5, -.5, .5,-.5, -.5, .5, .5,        -.5,-.5,-.5, -.5, .5, .5, -.5,-.5, .5,                        -.5,.5,-.5, -.5, .5,.5, -.5, 1.0, 0.0,        -.5,.5,-.5, -.5, .5, .5, -.5,1.0, 0.0,                         .5,-.5,-.5,  .5, .5,-.5,  .5, .5, .5,         .5,-.5,-.5,  .5, .5, .5,  .5,-.5, .5,                          .5,.5,-.5,  .5, .5,.5,  .5, 1.0, 0.0,         .5,.5,-.5,  .5, .5, .5,  .5,1.0, 0.0                     ] },
                vnormal : {numComponents:3, data: [
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,-1, 0,1,-1, 0,1,-1,        0,1,-1, 0,1,-1, 0,1,-1,
                    0,1,1, 0,1,1, 0,1,1,        0,1,1, 0,1,1, 0,1,1,
                                        -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0
                ]}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    House.prototype.draw = function(drawingState) {
                var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
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
    House.prototype.center = function(drawingState) {
        return this.position;
    }


            SpinningHouse = function SpinningHouse(name, position, size, color, axis) {
        House.apply(this,arguments);
        this.axis = axis || 'X';
    }
    SpinningHouse.prototype = Object.create(House.prototype);
    SpinningHouse.prototype.draw = function(drawingState) {
                var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        var theta = Number(drawingState.realtime)/200.0;
        if (this.axis == 'X') {
            twgl.m4.rotateX(modelM, theta, modelM);
        } else if (this.axis == 'Z') {
            twgl.m4.rotateZ(modelM, theta, modelM);
        } else {
            twgl.m4.rotateY(modelM, theta, modelM);
        }
        twgl.m4.setTranslation(modelM,this.position,modelM);
                var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    SpinningHouse.prototype.center = function(drawingState) {
        return this.position;
    }


})();

grobjects.push(new House("house1",[-4.25,0.5,   0],1) );
grobjects.push(new House("house2",[-4.25,0.5, 1.5],1) );
grobjects.push(new House("house3",[-4.25,0.5,   3],1) );
grobjects.push(new House("house4",[ 4.25,0.5,   0],1) );
grobjects.push(new House("house5",[ 4.25,0.5, 1.5],1) );
grobjects.push(new House("house6",[ 4.25,0.5,   3],1) );
grobjects.push(new House("house7",[-3.00,0.5, 4.25],1,[1,1,0],1.5714) );
grobjects.push(new House("house8",[-1.50,0.5, 4.25],1,[1,1,0],1.5714) );
grobjects.push(new House("house9",[ 0.00,0.5, 4.25],1,[1,1,0],1.5714) );
grobjects.push(new House("house10",[ 1.50,0.5, 4.25],1,[1,1,0],1.5714) );
grobjects.push(new House("house11",[ 3.00,0.5, 4.25],1,[1,1,0],1.5714) );

