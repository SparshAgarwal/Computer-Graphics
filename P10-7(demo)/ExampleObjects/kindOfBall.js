/**
 * Created by gleicher on 10/9/15.
 */
/*
 a second example object for graphics town
 check out "simplest" first

 the ball is more complicated since it is designed to allow making many balls

 we make a constructor function that will make instances of balls - each one gets
 added to the grobjects list

 we need to be a little bit careful to distinguish between different kinds of initialization
 1) there are the things that can be initialized when the function is first defined
    (load time)
 2) there are things that are defined to be shared by all balls - these need to be defined
    by the first init (assuming that we require opengl to be ready)
 3) there are things that are to be defined for each ball instance
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var Ball = undefined;
var SpinningBall = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all balls - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;
    var vposdata = [];
    var vnormaldata = [];

    // constructor for Balls
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

            // compute the normal
            var v3 = twgl.v3;
            var e1 = v3.subtract(p1,p2);
            var e2 = v3.subtract(p1,p3);
            var n = Array.prototype.slice.call(v3.normalize(v3.cross(e1,e2)));
            // console.log(n)
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
        // console.log(vnormaldata);
        // create the shaders once - for all balls
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: vposdata },
                vnormal : {numComponents:3, data: vnormaldata}
                // vpos : { numComponents: 3, data: [
                //     -.5,-.5,-.5,  .5,-.5,-.5,  .5, .5,-.5,        -.5,-.5,-.5,  .5, .5,-.5, -.5, .5,-.5,    // z = 0
                //     -.5,-.5, .5,  .5,-.5, .5,  .5, .5, .5,        -.5,-.5, .5,  .5, .5, .5, -.5, .5, .5,    // z = 1
                //     -.5,-.5,-.5,  .5,-.5,-.5,  .5,-.5, .5,        -.5,-.5,-.5,  .5,-.5, .5, -.5,-.5, .5,    // y = 0
                //     -.5, .5,-.5,  .5, .5,-.5,  .5, .5, .5,        -.5, .5,-.5,  .5, .5, .5, -.5, .5, .5,    // y = 1
                //     -.5,-.5,-.5, -.5, .5,-.5, -.5, .5, .5,        -.5,-.5,-.5, -.5, .5, .5, -.5,-.5, .5,    // x = 0
                //      .5,-.5,-.5,  .5, .5,-.5,  .5, .5, .5,         .5,-.5,-.5,  .5, .5, .5,  .5,-.5, .5     // x = 1
                // ] },
                // vnormal : {numComponents:3, data: [
                //     0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                //     0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                //     0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                //      0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                //     -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                //     1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0
                // ]}
                // ,
                // vcolors:{numComponents: 3, data:[
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
                //     0.0, 0.0, 0.0  //9
                //     ]}
                    
            };
            console.log(arrays)
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    Ball.prototype.draw = function(drawingState) {
        // we make a model matrix to place the ball in the world
        var modelM = twgl.m4.scaling([this.sizel,this.sizeb,this.sizeh]);
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
    Ball.prototype.center = function(drawingState) {
        return this.position;
    }


    // ////////
    // // constructor for Balls
    // SpinningBall = function SpinningBall(name, position, size, color, axis) {
    //     Ball.apply(this,arguments);
    //     this.axis = axis || 'X';
    // }
    // SpinningBall.prototype = Object.create(Ball.prototype);
    // SpinningBall.prototype.draw = function(drawingState) {
    //     // we make a model matrix to place the ball in the world
    //     var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
    //     var theta = Number(drawingState.realtime)/200.0;
    //     if (this.axis == 'X') {
    //         twgl.m4.rotateX(modelM, theta, modelM);
    //     } else if (this.axis == 'Z') {
    //         twgl.m4.rotateZ(modelM, theta, modelM);
    //     } else {
    //         twgl.m4.rotateY(modelM, theta, modelM);
    //     }
    //     twgl.m4.setTranslation(modelM,this.position,modelM);
    //     // the drawing coce is straightforward - since twgl deals with the GL stuff for us
    //     var gl = drawingState.gl;
    //     gl.useProgram(shaderProgram.program);
    //     twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
    //     twgl.setUniforms(shaderProgram,{
    //         view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
    //         ballcolor:this.color, model: modelM });
    //     twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    // };
    // SpinningBall.prototype.center = function(drawingState) {
    //     return this.position;
    // }


})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of balls, just don't load this file.
grobjects.push(new Ball("ball1",[-4.25,3.5,-4.25],1.5,1.5,1.5) );
// grobjects.push(new Ball("ball1",[-4.25,0.5, 1.5],1) );
// grobjects.push(new Ball("ball1",[-4.25,0.5,   3],1) );
// grobjects.push(new Ball("ball1",[ 4.25,0.5,   0],1) );
// grobjects.push(new Ball("ball1",[ 4.25,0.5, 1.5],1) );
// grobjects.push(new Ball("ball1",[ 4.25,0.5,   3],1) );
// grobjects.push(new Ball("ball1",[-3.00,0.5, 4.25],1,[1,0,0],1.5714) );
// grobjects.push(new Ball("ball1",[-1.50,0.5, 4.25],1,[1,0,0],1.5714) );
// grobjects.push(new Ball("ball1",[ 0.00,0.5, 4.25],1,[1,0,0],1.5714) );
// grobjects.push(new Ball("ball1",[ 1.50,0.5, 4.25],1,[1,0,0],1.5714) );
// grobjects.push(new Ball("ball1",[ 3.00,0.5, 4.25],1,[1,0,0],1.5714) );
//grobjects.push(new Ball("ball2",[ 2,0.5,   0],1, [1,1,0]));
// grobjects.push(new Ball("ball3",[ 0, 0.5, -2],1 , [0,1,1]));
// grobjects.push(new Ball("ball4",[ 0,0.5,   2],1));

// grobjects.push(new SpinningBall("sball 1",[-2,0.5, -2],1) );
// grobjects.push(new SpinningBall("sball 2",[-2,0.5,  2],1,  [1,0,0], 'Y'));
// grobjects.push(new SpinningBall("sball 3",[ 2,0.5, -2],1 , [0,0,1], 'Z'));
// grobjects.push(new SpinningBall("sball 4",[ 2,0.5,  2],1));
