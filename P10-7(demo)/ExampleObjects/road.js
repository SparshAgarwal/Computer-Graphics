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
var Road = undefined;
var SpinningRoad = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Roads
    Road = function Road(name, position, size, color, theta) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
        this.theta = theta || 0;
    }
    Road.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    -.5,0.,-.5,  .5,0.,-.5,  .5,0., .5,        -.5,0.,-.5,  .5,0., .5, -.5,0., .5    // y = 0
                ] },
                vnormal : {numComponents:3, data: [
                    0,1,0, 0,1,0, 0,1,0,     0,1,0, 0,1,0, 0,1,0
                ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    Road.prototype.draw = function(drawingState) {
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
    Road.prototype.center = function(drawingState) {
        return this.position;
    }



})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
grobjects.push(new Road("road1",[-3.25,0.01, -.5],1,[0,0,0]) );
grobjects.push(new Road("road2",[-3.25,0.01, 0.5],1,[0,0,0]) );
grobjects.push(new Road("road3",[-3.25,0.01, 1.5],1,[0,0,0]) );
grobjects.push(new Road("road4",[-3.25,0.01, 2.5],1,[0,0,0]) );
grobjects.push(new Road("road5",[-3.25,0.01, 3.25],1,[0,0,0]) );
grobjects.push(new Road("road6",[ 3.25,0.01, -.5],1,[0,0,0]) );
grobjects.push(new Road("road7",[ 3.25,0.01, 0.5],1,[0,0,0]) );
grobjects.push(new Road("road8",[ 3.25,0.01, 1.5],1,[0,0,0]) );
grobjects.push(new Road("road9",[ 3.25,0.01, 2.5],1,[0,0,0]) );
grobjects.push(new Road("road10",[ 3.25,0.01, 3.25],1,[0,0,0]) );
grobjects.push(new Road("road11",[-3.25,0.01, 3.25],1,[0,0,0]) );
grobjects.push(new Road("road12",[-2.25,0.01, 3.25],1,[0,0,0]) );
grobjects.push(new Road("road13",[-1.25,0.01, 3.25],1,[0,0,0]) );
grobjects.push(new Road("road14",[-0.25,0.01, 3.25],1,[0,0,0]) );
grobjects.push(new Road("road15",[ 0.75,0.01, 3.25],1,[0,0,0]) );
grobjects.push(new Road("road16",[ 1.75,0.01, 3.25],1,[0,0,0]) );
grobjects.push(new Road("road17",[ 2.75,0.01, 3.25],1,[0,0,0]) );
grobjects.push(new Road("road18",[ 3.25,0.01, 3.25],1,[0,0,0]) );
grobjects.push(new Road("lake1",[ 0.00,0.01, 0.25],1,[0,0,1]) );
grobjects.push(new Road("lake2",[ 0.75,0.01, 1.00],1,[0,0,1]) );
grobjects.push(new Road("lake3",[ 0.25,0.01, 0.75],1.532,[0,0,1],0.78539816339) );
grobjects.push(new Road("lake4",[-0.25,0.01, 0.75],1.532,[0,0,1],0.78539816339) );
grobjects.push(new Road("lake5",[ 0.25,0.01, 1.25],1.532,[0,0,1],0.78539816339) );
grobjects.push(new Road("lake6",[-0.25,0.01, 1.25],1.532,[0,0,1],0.78539816339) );
grobjects.push(new Road("lake7",[ 0.00,0.01, 1.00],1,[0,0,1]) );
grobjects.push(new Road("lake8",[-0.75,0.01, 1.00],1,[0,0,1]) );
grobjects.push(new Road("lake9",[ 0.00,0.01, 1.75],1,[0,0,1]) );
