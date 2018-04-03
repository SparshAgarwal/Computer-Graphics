
var grobjects = grobjects || [];

var Copter = undefined;
var Helipad = undefined;


(function () {
    "use strict";

                var shaderProgram = undefined;
    var copterBodyBuffers = undefined;
    var copterRotorBuffers = undefined;
    var copterNumber = 0;
    var vposdata = [];
    var vnormaldata = [];

    var padBuffers = undefined;
    var padNumber = 0;

        Copter = function Copter(name) {
        this.name = "copter"+copterNumber++;
        this.position = [0,0,0];            this.color = [.9,.3,.4];
                this.orientation = 0;
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

    Copter.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
                var diamondVerts = [ [0,0,0], [1,0,0], [1,0,1], [0,0,1], [.5,.15,0], [.5,.15,1], [0,.15,.5], [1,.15,.5], [.5,-.15,0], [.5,-.15,1], [0,-.15,.5], [1,-.15,.5]];
        var diamondTris = [ [0,1,4], [0,1,8], [1,2,7], [1,2,11], [2,3,5], [2,3,9], [3,0,6], [3,0,10], [0,4,6], [0,8,10], 
                            [3,5,6], [3,9,10], [2,5,7], [2,9,11], [1,4,7] , [1,8,11], [4,5,7] ,[4,6,5], [8,9,11], [8,10,9] ];
        drawDiamond(diamondVerts,diamondTris);

                if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["helicopter-vs", "helicopter-fs"]);
        }
        if (!copterBodyBuffers) {
            var arrays = {
                vpos : { numComponents: 3, data: vposdata },
                vnormal : {numComponents:3, data: vnormaldata}
                                                                                                            };
            copterBodyBuffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);

            var rarrays = {
                vpos : {numcomponents:3, data: [0,.5,0, 1,.5,.1, 1,.5, -.1,
                                                0,.5,0, -1,.5,.1, -1,.5, -.1]},
                vnormal : {numcomponents:3, data: [0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0]},
                indices : [0,1,2, 3,4,5]
            };
            copterRotorBuffers = twgl.createBufferInfoFromArrays(drawingState.gl,rarrays);
        }
                        this.lastPad = randomHelipad();
        this.position = twgl.v3.add(this.lastPad.center(),[0,.5+this.lastPad.helipadAltitude,0]);
        this.state = 0;         this.wait = getRandomInt(250,750);
        this.lastTime = 0;

    };
    Copter.prototype.draw = function(drawingState) {
                        advance(this,drawingState);

                var modelM = twgl.m4.rotationY(this.orientation);
        twgl.m4.setTranslation(modelM,this.position,modelM);
                var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.setBuffersAndAttributes(gl,shaderProgram,copterBodyBuffers);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, copterBodyBuffers);
                    };
    Copter.prototype.center = function(drawingState) {
        return this.position;
    }


            Helipad = function Helipad(position) {
        this.name = "helipad"+padNumber++;
        this.position = position || [2,0.01,2];
        this.size = 1.0;
                this.helipad = true;
                        this.helipadAltitude = 0;
    }
    Helipad.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        var q = .25;  
                if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!padBuffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    -1,0,-1, -1,0,1, -.5,0,1, -.5,0,-1,
                    1,0,-1, 1,0,1, .5,0,1, .5,0,-1,
                    -.5,0,-.25, -.5,0,.25,.5,0,.25,.5,0, -.25

                ] },
                vnormal : {numComponents:3, data: [
                    0,1,0, 0,1,0, 0,1,0, 0,1,0,
                    0,1,0, 0,1,0, 0,1,0, 0,1,0,
                    0,1,0, 0,1,0, 0,1,0, 0,1,0
                ]},
                indices : [0,1,2, 0,2,3, 4,5,6, 4,6,7, 8,9,10, 8,10,11
                            ]
            };
            padBuffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    Helipad.prototype.draw = function(drawingState) {
                var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
                var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:[1,1,0], model: modelM });
        twgl.setBuffersAndAttributes(gl,shaderProgram,padBuffers);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, padBuffers);
    };
    Helipad.prototype.center = function(drawingState) {
        return this.position;
    }

                                                                                            

            var altitude = 3;
    var verticalSpeed = 3 / 1000;          var flyingSpeed = 3/1000;              var turningSpeed = 2/1000;         
        function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
        function randomHelipad(exclude) {
        var helipads = grobjects.filter(function(obj) {return (obj.helipad && (obj!=exclude))});
        if (!helipads.length) {
            throw("No Helipads for the helicopter!");
        }
        var idx = getRandomInt(0,helipads.length);
        return helipads[idx];
    }

        function advance(heli, drawingState) {
                if (!heli.lastTime) {
            heli.lastTime = drawingState.realtime;
            return;
        }
        var delta = drawingState.realtime - heli.lastTime;
        heli.lastTime = drawingState.realtime;

                switch (heli.state) {
            case 0:                 if (heli.wait > 0) { heli.wait -= delta; }
                else {                      heli.state = 1;
                    heli.wait = 0;
                }
                break;
            case 1:                 if (heli.position[1] < altitude) {
                    var up = verticalSpeed * delta;
                    heli.position[1] = Math.min(altitude,heli.position[1]+up);
                } else {                     var dest = randomHelipad(heli.lastPad);
                    heli.lastPad = dest;
                                        heli.dx = dest.position[0] - heli.position[0];
                    heli.dz = dest.position[2] - heli.position[2];
                    heli.dst = Math.sqrt(heli.dx*heli.dx + heli.dz*heli.dz);
                    if (heli.dst < .01) {
                                                heli.position[0] = dest.position[0];
                        heli.position[2] = dest.position[2];
                        heli.state = 4;
                     } else {
                        heli.vx = heli.dx / heli.dst;
                        heli.vz = heli.dz / heli.dst;
                    }
                    heli.dir = Math.atan2(heli.dx,heli.dz);
                    heli.state = 2;
                }
                break;
            case 2:                 var dtheta = heli.dir - heli.orientation;
                                if (Math.abs(dtheta) < .01) {
                    heli.state = 3;
                    heli.orientation = heli.dir;
                }
                var rotAmt = turningSpeed * delta;
                if (dtheta > 0) {
                    heli.orientation = Math.min(heli.dir,heli.orientation+rotAmt);
                } else {
                    heli.orientation = Math.max(heli.dir,heli.orientation-rotAmt);
                }
                break;
            case 3:                 if (heli.dst > .01) {
                    var go = delta * flyingSpeed;
                                        go = Math.min(heli.dst,go);
                    heli.position[0] += heli.vx * go;
                    heli.position[2] += heli.vz * go;
                    heli.dst -= go;
                } else {                     heli.position[0] = heli.lastPad.position[0];
                    heli.position[2] = heli.lastPad.position[2];
                    if (heli.lastPad ==  findObj("house1") || heli.lastPad ==  findObj("house5") || heli.lastPad ==  findObj("house9")){
                        heli.state = 1;
                    }
                    else{
                        heli.state = 4;
                    }
                }
                break;
            case 4:                 var destAlt = heli.lastPad.position[1] + .5 + heli.lastPad.helipadAltitude;
                if (heli.position[1] > destAlt) {
                    var down = delta * verticalSpeed;
                    heli.position[1] = Math.max(destAlt,heli.position[1]-down);
                } else {                     heli.state = 0;
                    heli.wait = getRandomInt(500,1000);
                }
                break;
        }
    }
})();


grobjects.push(new Copter());
grobjects.push(new Helipad([3,.001,-3]));

var acube = findObj("house1");
if (acube) {
    acube.helipad = true;
    acube.helipadAltitude = .5;
}
var acube = findObj("house5");
if (acube) {
    acube.helipad = true;
    acube.helipadAltitude = .5;
}
var acube = findObj("house9");
if (acube) {
    acube.helipad = true;
    acube.helipadAltitude = .5;
}
