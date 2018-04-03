/**
 * Created by gleicher on 10/9/15.
 */
/*
 a second example object for graphics town
 check out "simplest" first

 the cube is more complicated since it is designed to allow making many cubes

 we make a constructor function that will make instances of cubes - each one gets
 added to the grobjects list

 we need to be a little bit careful to distinguish between different kinds of initialization
 1) there are the things that can be initialized when the function is first defined
    (load time)
 2) there are things that are defined to be shared by all cubes - these need to be defined
    by the first init (assuming that we require opengl to be ready)
 3) there are things that are to be defined for each cube instance
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var House = undefined;
var SpinningHouse = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Houses
    House = function House(name, position, size, color, theta) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [1,1,0];
        this.theta = theta || 0;
    }
    House.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5, .5,-.5,        -.5,-.5,-.5,  .5, .5,-.5, -.5, .5,-.5,    // z = 0
                    -.5,-.5, .5,  .5,-.5, .5,  .5, .5, .5,        -.5,-.5, .5,  .5, .5, .5, -.5, .5, .5,    // z = 1
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5,-.5, .5,        -.5,-.5,-.5,  .5,-.5, .5, -.5,-.5, .5,    // y = 0
                    -.5,.5,-.5,  .5,.5,-.5,  .5,1.0, 0,        -.5,.5,-.5,  .5,1.0, 0, -.5,1.0, 0,    // y = 
                    -.5,.5,.5,  .5,.5,.5,  .5,1.0, 0,        -.5,.5,.5,  .5,1.0, 0, -.5,1.0, 0,    // y = 
                    //-.5,.5,-.5,  .5,.5,-.5,  .5,.5, .5,        -.5,.5,-.5,  .5,.5, .5, -.5,.5, .5,    // y =
                    //-.5, .5,-.5,  .5, .5,-.5,  .5, .5, .5,        -.5, .5,-.5,  .5, .5, .5, -.5, .5, .5,    // y = 1
                    -.5,-.5,-.5, -.5, .5,-.5, -.5, .5, .5,        -.5,-.5,-.5, -.5, .5, .5, -.5,-.5, .5,    // x = 0
                    -.5,.5,-.5, -.5, .5,.5, -.5, 1.0, 0.0,        -.5,.5,-.5, -.5, .5, .5, -.5,1.0, 0.0,    // x = 0
                     .5,-.5,-.5,  .5, .5,-.5,  .5, .5, .5,         .5,-.5,-.5,  .5, .5, .5,  .5,-.5, .5,     // x = 1
                     .5,.5,-.5,  .5, .5,.5,  .5, 1.0, 0.0,         .5,.5,-.5,  .5, .5, .5,  .5,1.0, 0.0     // x = 1
                ] },
                vnormal : {numComponents:3, data: [
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,-1, 0,1,-1, 0,1,-1,        0,1,-1, 0,1,-1, 0,1,-1,
                    0,1,1, 0,1,1, 0,1,1,        0,1,1, 0,1,1, 0,1,1,
                    // 0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0
                ]}
                //,
                // vcolor:{numComponents: 3, data:[
                //     0.1, 0.1, 0.1, //0
                //     1.0, 1.0, 1.0, //5
                //     0.1, 0.1, 0.1, //1
                //     0.1, 0.1, 0.1, //4
                //     0.1, 0.1, 0.1, //0
                //     1.0, 1.0, 1.0, //5
                //     0.1, 0.1, 0.1, //1
                //     0.0, 0.0, 0.0, //9
                //     0.1, 0.1, 0.1, //0
                //     1.0, 1.0, 1.0, //6
                //     0.1, 0.1, 0.1, //2
                //     0.1, 0.1, 0.1, //4
                //     0.1, 0.1, 0.1, //0
                //     1.0, 1.0, 1.0, //6
                //     0.1, 0.1, 0.1, //2
                //     0.0, 0.0, 0.0, //9
                //     0.1, 0.1, 0.1, //2
                //     1.0, 1.0, 1.0, //8
                //     0.1, 0.1, 0.1, //3
                //     0.1, 0.1, 0.1, //4
                //     0.1, 0.1, 0.1, //2
                //     1.0, 1.0, 1.0, //8
                //     0.1, 0.1, 0.1, //3
                //     0.0, 0.0, 0.0, //9
                //     0.1, 0.1, 0.1, //3
                //     1.0, 1.0, 1.0, //7
                //     0.1, 0.1, 0.1, //1
                //     0.1, 0.1, 0.1, //4
                //     0.1, 0.1, 0.1, //3
                //     1.0, 1.0, 1.0, //7
                //     0.1, 0.1, 0.1, //1
                //     0.0, 0.0, 0.0, //9
                //     0.1, 0.1, 0.1, //3
                //     1.0, 1.0, 1.0, //7
                //     0.1, 0.1, 0.1, //1
                //     0.0, 0.0, 0.0, //9
                //     0.1, 0.1, 0.1, //4
                //     0.1, 0.1, 0.1, //3
                //     1.0, 1.0, 1.0, //7
                //     0.1, 0.1, 0.1, //1
                //     0.0, 0.0, 0.0, //9
                //     0.1, 0.1, 0.1, //3
                //     1.0, 1.0, 1.0, //7
                //     0.1, 0.1, 0.1, //1
                //     0.0, 0.0, 0.0, //9
                //     0.1, 0.1, 0.1, //4
                //     0.1, 0.1, 0.1, //3
                //     1.0, 1.0, 1.0, //7
                //     0.1, 0.1, 0.1, //1
                //     0.0, 0.0, 0.0, //9
                //     0.1, 0.1, 0.1, //3
                //     1.0, 1.0, 1.0, //7
                //     0.1, 0.1, 0.1, //1
                //     0.0, 0.0, 0.0  //9
                //     ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    House.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        twgl.m4.rotateY(modelM, this.theta, modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
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


    ////////
    // constructor for Houses
    SpinningHouse = function SpinningHouse(name, position, size, color, axis) {
        House.apply(this,arguments);
        this.axis = axis || 'X';
    }
    SpinningHouse.prototype = Object.create(House.prototype);
    SpinningHouse.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
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
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
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

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
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
//grobjects.push(new House("cube2",[ 2,0.5,   0],1, [1,1,0]));
// grobjects.push(new House("cube3",[ 0, 0.5, -2],1 , [0,1,1]));
// grobjects.push(new House("cube4",[ 0,0.5,   2],1));

// grobjects.push(new SpinningHouse("scube 1",[-2,0.5, -2],1) );
// grobjects.push(new SpinningHouse("scube 2",[-2,0.5,  2],1,  [1,0,0], 'Y'));
// grobjects.push(new SpinningHouse("scube 3",[ 2,0.5, -2],1 , [0,0,1], 'Z'));
// grobjects.push(new SpinningHouse("scube 4",[ 2,0.5,  2],1));
