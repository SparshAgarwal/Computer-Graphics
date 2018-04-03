

var grobjects = grobjects || [];


(function() {
    "use strict";

    var vertexSource = ""+
        "precision highp float;" +
        "attribute vec3 aPosition;" +
        "attribute vec2 aTexCoord;" +
        "varying vec2 vTexCoord;" +
        "uniform mat4 pMatrix;" +
        "uniform mat4 vMatrix;" +
        "uniform mat4 mMatrix;" +
        "void main(void) {" +
        "  gl_Position = pMatrix * vMatrix * mMatrix * vec4(aPosition, 1.0);" +
        "  vTexCoord = aTexCoord;" +
        "}";

    var fragmentSource = "" +
        "precision highp float;" +
        "varying vec2 vTexCoord;" +
        "uniform sampler2D uTexture;" +
        "void main(void) {" +
        "  gl_FragColor = texture2D(uTexture, vTexCoord);" +
        "}";


    var vertices = new Float32Array([
         0.5,  0.5,  0.0,
        -0.5,  0.5,  0.0,
        -0.5, -0.5,  0.0,

         0.5,  0.5,  0.0,
        -0.5, -0.5,  0.0,
         0.5, -0.5,  0.0

    ]);

    var uvs = new Float32Array([
       1.0, 1.0,
       0.0, 1.0,
       0.0, 0.0,

       1.0, 1.0,
       0.0, 0.0,
       1.0, 0.0
    ]);

        var createGLShader = function (gl, type, src) {
        var shader = gl.createShader(type)
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            console.log("warning: shader failed to compile!")
            console.log(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

        var image = new Image();
    image.src = "data:image/png;base64,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        var createGLProgram = function (gl, vSrc, fSrc) {
        var program = gl.createProgram();
        var vShader = createGLShader(gl, gl.VERTEX_SHADER, vSrc);
        var fShader = createGLShader(gl, gl.FRAGMENT_SHADER, fSrc);
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
            console.log("warning: program failed to link");
            return null;

        }
        return program;
    }

        var createGLBuffer = function (gl, data, usage) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return buffer;
    }

    var findAttribLocations = function (gl, program, attributes) {
        var out = {};
        for(var i = 0; i < attributes.length;i++){
            var attrib = attributes[i];
            out[attrib] = gl.getAttribLocation(program, attrib);
        }
        return out;
    }

    var findUniformLocations = function (gl, program, uniforms) {
        var out = {};
        for(var i = 0; i < uniforms.length;i++){
            var uniform = uniforms[i];
            out[uniform] = gl.getUniformLocation(program, uniform);
        }
        return out;
    }

    var enableLocations = function (gl, attributes) {
        for(var key in attributes){
            var location = attributes[key];
            gl.enableVertexAttribArray(location);
        }
    }

        var disableLocations = function (gl, attributes) {
        for(var key in attributes){
            var location = attributes[key];
            gl.disableVertexAttribArray(location);
        }
    }

            var createGLTexture = function (gl, image, flipY) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        if(flipY){
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        }
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,  gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

     var TexturedPlane = function () {
        this.name = "TexturedPlane"
        this.position = new Float32Array([0, 0, 0]);
        this.scale = new Float32Array([1, 1]);
        this.program = null;
        this.attributes = null;
        this.uniforms = null;
        this.buffers = [null, null]
        this.texture = null;
    }

    TexturedPlane.prototype.init = function (drawingState) {
        var gl = drawingState.gl;

        this.program = createGLProgram(gl, vertexSource, fragmentSource);
        this.attributes = findAttribLocations(gl, this.program, ["aPosition", "aTexCoord"]);
        this.uniforms = findUniformLocations(gl, this.program, ["pMatrix", "vMatrix", "mMatrix", "uTexture"]);

        this.texture = createGLTexture(gl, image, true);

        this.buffers[0] = createGLBuffer(gl, vertices, gl.STATIC_DRAW);
        this.buffers[1] = createGLBuffer(gl, uvs, gl.STATIC_DRAW);
    }

    TexturedPlane.prototype.center = function () {
        return this.position;
    }

    TexturedPlane.prototype.draw = function (drawingState) {
        var gl = drawingState.gl;

        gl.useProgram(this.program);
        gl.disable(gl.CULL_FACE);

        var modelM = twgl.m4.scaling([this.scale[0],this.scale[1], 1]);
        twgl.m4.setTranslation(modelM,this.position, modelM);

        gl.uniformMatrix4fv(this.uniforms.pMatrix, gl.FALSE, drawingState.proj);
        gl.uniformMatrix4fv(this.uniforms.vMatrix, gl.FALSE, drawingState.view);
        gl.uniformMatrix4fv(this.uniforms.mMatrix, gl.FALSE, modelM);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(this.uniforms.uTexture, 0);



        enableLocations(gl, this.attributes)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[0]);
        gl.vertexAttribPointer(this.attributes.aPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[1]);
        gl.vertexAttribPointer(this.attributes.aTexCoord, 2, gl.FLOAT, false, 0, 0);

        

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        disableLocations(gl, this.attributes);
    }


    var test = new TexturedPlane();
        test.position[1] = 3;
        test.scale = [2, 2];

    
})();