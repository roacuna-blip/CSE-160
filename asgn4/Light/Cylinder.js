class Cylinder {
  constructor() {
    this.type = 'cylinder';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.segments = 12; // Higher number = smoother cylinder
  }

  render() {
    var rgba = this.color;
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    let angleStep = 360 / this.segments;
    
    for (var angle = 0; angle < 360; angle += angleStep) {
      let a1 = angle * Math.PI / 180;
      let a2 = (angle + angleStep) * Math.PI / 180;

      // Coordinates for the top circle (y = 1)
      let t1 = [Math.cos(a1), 1, Math.sin(a1)];
      let t2 = [Math.cos(a2), 1, Math.sin(a2)];

      // Coordinates for the bottom circle (y = 0)
      let b1 = [Math.cos(a1), 0, Math.sin(a1)];
      let b2 = [Math.cos(a2), 0, Math.sin(a2)];

      // --- Draw Side Walls (Two triangles per segment) ---
      gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
      drawTriangle3D([t1[0],t1[1],t1[2],  t2[0],t2[1],t2[2],  b1[0],b1[1],b1[2]]);
      drawTriangle3D([t2[0],t2[1],t2[2],  b2[0],b2[1],b2[2],  b1[0],b1[1],b1[2]]);

      // --- Draw Top Cap ---
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle3D([0, 1, 0,  t1[0],t1[1],t1[2],  t2[0],t2[1],t2[2]]);

      // --- Draw Bottom Cap ---
      gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
      drawTriangle3D([0, 0, 0,  b1[0],b1[1],b1[2],  b2[0],b2[1],b2[2]]);
    }
  }
}