class Cube{
    constructor(){
        this.type ='cube';
        this.color=[1.0,1.0,1.0,1.0];

        this.matrix = new Matrix4();
        this.normalMatrix = new Matrix4();
        this.textureNum=-2;

        this.cubeVerts32 = new Float32Array([
        0,0,0, 1,1,0, 1,0,0
        ,
        0,0,0, 0,1,0, 1,1,0
        ,
        0,1,0, 0,1,1, 1,1,1
        ,
        0,1,0, 1,1,1, 1,1,0
        ,
        1,1,0, 1,1,1, 1,0,0
        ,
        1,0,0, 1,1,1, 1,0,1
        ,
        0,1,0, 0,1,1, 0,0,0
        ,
        0,0,0, 0,1,1, 0,0,1
        ,
        0,0,0, 0,0,1, 1,0,1
        ,
        0,0,0, 1,0,1, 1,0,0
        ,
        0,0,1, 1,1,1, 1,0,1
        ,
        0,0,1, 0,1,1, 1,1,1
        ])

        this.cubeVerts = [
            0,0,0, 1,1,0, 1,0,0
            ,
            0,0,0, 0,1,0, 1,1,0
            ,
            0,1,0, 0,1,1, 1,1,1
            ,
            0,1,0, 1,1,1, 1,1,0
            ,
            1,1,0, 1,1,1, 1,0,0
            ,
            1,0,0, 1,1,1, 1,0,1
            ,
            0,1,0, 0,1,1, 0,0,0
            ,
            0,0,0, 0,1,1, 0,0,1
            ,
            0,0,0, 0,0,1, 1,0,1
            ,
            0,0,0, 1,0,1, 1,0,0
            ,
            0,0,1, 1,1,1, 1,0,1
            ,
            0,0,1, 0,1,1, 1,1,1
        ]
        
    }
    render(){
    var rgba = this.color;

    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // --- FRONT FACE ---
    drawTriangle3DUVNormal(
        [0,0,0,  1,1,0,  1,0,0], 
        [0,0,  1,1,  1,0],
        [0,0,-1, 0,0,-1, 0,0,-1]
    );
    drawTriangle3DUVNormal([0,0,0,  0,1,0,  1,1,0], [0,0,  0,1,  1,1], [0,0,-1,0,0,-1,0,0,-1]);

    // --- TOP FACE ---
    gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
    drawTriangle3DUVNormal([0,1,0,  0,1,1,  1,1,1], [0,0,  0,1,  1,1], [0,1,0,0,1,0,0,1,0]);
    drawTriangle3DUVNormal([0,1,0,  1,1,1,  1,1,0], [0,0,  1,1,  1,0], [0,1,0,0,1,0,0,1,0]);

    // --- RIGHT FACE ---
    gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
    drawTriangle3DUVNormal([1,1,0,  1,1,1,  1,0,0], [0,1,  1,1,  0,0], [1,0,0,1,0,0,1,0,0]);
    drawTriangle3DUVNormal([1,0,0,  1,1,1,  1,0,1], [0,0,  1,1,  1,0], [1,0,0,1,0,0,1,0,0]);

    // --- LEFT FACE ---
    gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
    drawTriangle3DUVNormal([0,1,0,  0,1,1,  0,0,0], [1,1,  0,1,  1,0], [-1,0,0,-1,0,0,-1,0,0]);
    drawTriangle3DUVNormal([0,0,0,  0,1,1,  0,0,1], [1,0,  0,1,  0,0], [-1,0,0,-1,0,0,-1,0,0]);

    // --- BOTTOM FACE ---
    gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]);
    drawTriangle3DUVNormal([0,0,0,  0,0,1,  1,0,1], [0,1,  0,0,  1,0], [0,-1,0,0,-1,0,0,-1,0]);
    drawTriangle3DUVNormal([0,0,0,  1,0,1,  1,0,0], [0,1,  1,0,  1,1], [0,-1,0,0,-1,0,0,-1,0]);

    // --- BACK FACE ---
    gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
    drawTriangle3DUVNormal([0,0,1,  1,1,1,  1,0,1], [0,0,  1,1,  1,0], [0,0,1,0,0,1,0,0,1]);
    drawTriangle3DUVNormal([0,0,1,  0,1,1,  1,1,1], [0,0,  0,1,  1,1], [0,0,1,0,0,1,0,0,1]);
    }
    renderfast(){
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, -2);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var allverts = [];

        allverts=allverts.concat([0,0,0,  1,1,0,  1,0,0]);
        allverts=allverts.concat([0,0,0,  0,1,0,  1,1,0]);

        allverts=allverts.concat([0,1,0,  0,1,1,  1,1,1]);
        allverts=allverts.concat([0,1,0,  1,1,1,  1,1,0]);

        allverts=allverts.concat([1,1,0,  1,1,1,  1,0,0]);
        allverts=allverts.concat([1,0,0,  1,1,1,  1,0,1]);


        allverts=allverts.concat([0,1,0,  0,1,1,  0,0,0]);
        allverts=allverts.concat([0,0,0,  0,1,1,  0,0,1]);

        allverts=allverts.concat([0,0,0,  0,0,1,  1,0,1]);
        allverts=allverts.concat([0,0,0,  1,0,1,  1,0,0]);

        allverts=allverts.concat([0,0,1,  1,1,1,  1,0,1]);
        allverts=allverts.concat([0,0,1,  0,1,1,  1,1,1]);

        drawTriangle3D(allverts);
        
    }
    renderfaster(){
        var rgba = this.color;
        //gl.uniform1i(u_whichTexture, -2);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        //if(g_vertexBuffer==null){
        initTriangle3D();
        //}

        //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.cubeVerts), gl.DYNAMIC_DRAW);
        gl.bufferData(gl.ARRAY_BUFFER, this.cubeVerts32, gl.DYNAMIC_DRAW);

        gl.drawArrays(gl.TRIANGLES,0, 36);

    }
}