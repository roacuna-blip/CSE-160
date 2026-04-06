// DrawTriangle.js (c) 2012 matsuda
let ctx;
let canvas;

function main() {  
  // Retrieve <canvas> element
  canvas = document.getElementById('cnv1');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  ctx = canvas.getContext('2d');
  clearCanvas();

}

function clearCanvas() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawVector(v, color){
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + v.elements[0] * 20, cy - v.elements[1] * 20);
  ctx.stroke();

}

function handleDrawEvent() {
  clearCanvas();

  const x1 = parseFloat(document.getElementById('xCoordV1').value);
  const y1 = parseFloat(document.getElementById('yCoordV1').value);
  const v1 = new Vector3([x1, y1, 0]);

  const x2 = parseFloat(document.getElementById('xCoordV2').value);
  const y2 = parseFloat(document.getElementById('yCoordV2').value);
  const v2 = new Vector3([x2, y2, 0]);

  drawVector(v1, "red");
  drawVector(v2, "blue");
}

function angleBetween(v1, v2) {
    const dotProd = Vector3.dot(v1, v2);
    const mag1 = v1.magnitude();
    const mag2 = v2.magnitude();

    if (mag1 === 0 || mag2 === 0) {
        console.warn("Cannot compute angle with zero vector");
        return 0;
    }

    let cosTheta = dotProd / (mag1 * mag2);
    cosTheta = Math.max(-1, Math.min(1, cosTheta));

    return Math.acos(cosTheta);
}

function areaTriangle(v1, v2) {
    const crossProd = Vector3.cross(v1, v2);
    return 0.5 * crossProd.magnitude();
}

function handleDrawOperationEvent(){

  clearCanvas();

  const x1 = parseFloat(document.getElementById('xCoordV1').value);
  const y1 = parseFloat(document.getElementById('yCoordV1').value);
  const v1 = new Vector3([x1, y1, 0]);

  const x2 = parseFloat(document.getElementById('xCoordV2').value);
  const y2 = parseFloat(document.getElementById('yCoordV2').value);
  const v2 = new Vector3([x2, y2, 0]);

  drawVector(v1, "red");
  drawVector(v2, "blue");

  const op = document.getElementById('operation').value;
  const s = parseFloat(document.getElementById('scalar').value);

  if (op === "add") {
    const v3 = new Vector3([...v1.elements]);
    v3.add(v2);
    drawVector(v3, "green");
  } else if (op === "sub") {
    const v3 = new Vector3([...v1.elements]);
    v3.sub(v2);
    drawVector(v3, "green");
  } else if (op === "mul") {
    const v3 = new Vector3([...v1.elements]).mul(s);
    const v4 = new Vector3([...v2.elements]).mul(s);
    drawVector(v3, "green");
    drawVector(v4, "green");
  } else if (op === "div") {
    const v3 = new Vector3([...v1.elements]).div(s);
    const v4 = new Vector3([...v2.elements]).div(s);
    drawVector(v3, "green");
    drawVector(v4, "green");
  } else if(op === "magnitude") {
    console.log("Magnitude of v1:", v1.magnitude());
    console.log("Magnitude of v2:", v2.magnitude());
  } else if (op === "normalize") {
    const v1Norm = new Vector3([...v1.elements]).normalize();
    const v2Norm = new Vector3([...v2.elements]).normalize();
    drawVector(v1Norm, "green");
    drawVector(v2Norm, "green");
  } else if(op === "angle") {
    const angleRad = angleBetween(v1, v2);
    const angleDeg = angleRad * (180 / Math.PI);
    console.log("Angle:", angleDeg);
  } else if(op === "area") {
    const area = areaTriangle(v1, v2);
    console.log("Area of the triangle:", area);
  }

}

