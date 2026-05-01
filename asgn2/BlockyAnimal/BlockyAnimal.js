// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

const POINT = 0;
const TRIANGLE =  1;
const CIRCLE =  2;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedSeg = 10;
let g_selectedType = POINT;

let g_globalAngle = 0;
let g_upperLeg1Angle = 0;
let g_lowerLeg1Angle = 0;
let g_paw1Angle = 0;

let g_upperLeg1Animation=false;
let g_lowerLeg1Animation=false;
let g_paw1Animation=false;

function addActionsForHtmlUI(){

  document.getElementById('animationUpperLeg1OffButton').onclick = function() {g_upperLeg1Animation = false; };
  document.getElementById('animationUpperLeg1OnButton').onclick = function() {g_upperLeg1Animation = true; };

  document.getElementById('animationLowerLeg1OffButton').onclick = function() {g_lowerLeg1Animation = false; };
  document.getElementById('animationLowerLeg1OnButton').onclick = function() {g_lowerLeg1Animation = true; };

  document.getElementById('animationPaw1OffButton').onclick = function() {g_paw1Animation = false; };
  document.getElementById('animationPaw1OnButton').onclick = function() {g_paw1Animation = true; };

  document.getElementById('UpperLeg1Slider').addEventListener('mousemove', function() {g_upperLeg1Angle=this.value; renderAllShapes();} )
  document.getElementById('LowerLeg1Slider').addEventListener('mousemove', function() {g_lowerLeg1Angle=this.value; renderAllShapes();} )
  document.getElementById('Paw1Slider').addEventListener('mousemove', function() {g_paw1Angle=this.value; renderAllShapes();} )

  document.getElementById('angleSlider').addEventListener('mousemove', function() {g_globalAngle=this.value; renderAllShapes();} )

} 

function main() {

  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  //canvas.onmousemove = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  requestAnimationFrame(tick);
}

var g_shapesList = [];

function click(ev) {
  
  let [x,y] = convertCoordinatesEventsToGL(ev);

  let point;

  if(g_selectedType == POINT){
    point = new Point();
  }
  else if(g_selectedType == TRIANGLE){
    point = new Triangle();
  }
  else{
    point = new Circle();
    point.segments=g_selectedSeg;
  }

  point.position=[x,y];
  point.color=g_selectedColor.slice();
  point.size=g_selectedSize;

  g_shapesList.push(point);

  // Store the coordinates to g_points array
  //g_points.push([x, y]);

  //g_colors.push(g_selectedColor.slice());

  //g_sizes.push(g_selectedSize);

  // Store the coordinates to g_points array
  //if (x >= 0.0 && y >= 0.0) {      // First quadrant
  //  g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  //} else if (x < 0.0 && y < 0.0) { // Third quadrant
  //  g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  //} else {                         // Others
  //  g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  //}

  renderAllShapes();

}

var g_startTime=performance.now()/1000;
var g_seconds=performance.now()/1000-g_startTime;
function tick(){
  g_seconds=performance.now()/1000-g_startTime;
  //console.log(g_seconds);

  updateAnimationAngles();
  renderAllShapes();
  requestAnimationFrame(tick);
}

function convertCoordinatesEventsToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function updateAnimationAngles(){
  if(g_upperLeg1Animation){
    g_upperLeg1Angle = (45*Math.sin(g_seconds));
  }
  if(g_lowerLeg1Animation){
    g_lowerLeg1Angle = (45*Math.sin(3*g_seconds));
  }
  if(g_paw1Animation){
    g_paw1Angle = (45*Math.sin(7*g_seconds));
  }
}

function renderAllShapes(){

  var globalRotMat  = new Matrix4().rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var body = new Cube();
  body.color = [0.4,0.2,0.0,1.0];
  body.matrix.translate(-0.5,-.3,0.0);
  body.matrix.scale(0.9,.6,.5);
  body.render();

  
  
  var upperLeg1 = new Cylinder();
  upperLeg1.color = [0.3,0.2,0.0,1.0];
  upperLeg1.matrix.translate(.3,-.5,.1);
  upperLeg1.matrix.scale(0.1,.2,.1);

  upperLeg1.matrix.rotate(-g_upperLeg1Angle,0,0,1);

  var upperLeg1CoordinatesMat=new Matrix4(upperLeg1.matrix);
  upperLeg1.render();
  
  var lowerLeg1 = new Cylinder();
  lowerLeg1.color = [0.3,0.2,0.0,1.0];
  lowerLeg1.matrix = upperLeg1CoordinatesMat;
  lowerLeg1.matrix.translate(0,-.9,0);
  lowerLeg1.matrix.rotate(g_lowerLeg1Angle,0,0,1);
  var lowerLeg1CoordinatesMat=new Matrix4(lowerLeg1.matrix);
  lowerLeg1.render();

  var paw1 = new Cube();
  paw1.color = [0.3,0.2,0.0,1.0];
  paw1.matrix = lowerLeg1CoordinatesMat;
  paw1.matrix.rotate(g_paw1Angle,0,0,1);
  paw1.matrix.translate(-1,-.5,-1);
  paw1.matrix.scale(3,.5,2);
  paw1.render();
  
  var upperLeg2 = new Cylinder();
  upperLeg2.color = [0.3,0.2,0.0,1.0];
  upperLeg2.matrix.translate(-.4,-.5,.1);
  upperLeg2.matrix.scale(0.1,.2,.1);
  upperLeg2.render();

  var lowerLeg2 = new Cylinder();
  lowerLeg2.color = [0.3,0.2,0.0,1.0];
  lowerLeg2.matrix.translate(-.4,-.7,.1);
  lowerLeg2.matrix.scale(0.1,.2,.1);
  lowerLeg2.render();

  
  var paw2 = new Cube();
  paw2.color = [0.3,0.2,0.0,1.0];
  paw2.matrix.translate(-.5,-.8,0);
  paw2.matrix.scale(0.3,.1,.2);
  paw2.render();

  var upperLeg3 = new Cylinder();
  upperLeg3.color = [0.3,0.2,0.0,1.0];
  upperLeg3.matrix.translate(-.4,-.5,.4);
  upperLeg3.matrix.scale(0.1,.2,.1);
  upperLeg3.render();

  var lowerLeg3 = new Cylinder();
  lowerLeg3.color = [0.3,0.2,0.0,1.0];
  lowerLeg3.matrix.translate(-.4,-.7,.4);
  lowerLeg3.matrix.scale(0.1,.2,.1);
  lowerLeg3.render();

  var paw3 = new Cube();
  paw3.color = [0.3,0.2,0.0,1.0];
  paw3.matrix.translate(-.5,-.8,.3);
  paw3.matrix.scale(0.3,.1,.2);
  paw3.render();

  var upperLeg4 = new Cylinder();
  upperLeg4.color = [0.3,0.2,0.0,1.0];
  upperLeg4.matrix.translate(.3,-.5,.4);
  upperLeg4.matrix.scale(0.1,.4,.1);
  upperLeg4.render();

  var lowerLeg4 = new Cylinder();
  lowerLeg4.color = [0.3,0.2,0.0,1.0];
  lowerLeg4.matrix.translate(.3,-.7,.4);
  lowerLeg4.matrix.scale(0.1,.2,.1);
  lowerLeg4.render();
  
  var paw4 = new Cube();
  paw4.color = [0.3,0.2,0.0,1.0];
  paw4.matrix.translate(.2,-.8,.3);
  paw4.matrix.scale(0.3,.1,.2);
  paw4.render();

  var neck1 = new Cylinder();
  neck1.color = [0.4,0.2,0.0,1.0];
  neck1.matrix.translate(.32,.24,.25);
  neck1.matrix.rotate(30,1,0,-30);
  neck1.matrix.scale(0.1,.1,.1);
  neck1.render();

  var neck2 = new Cylinder();
  neck2.color = [0.4,0.2,0.0,1.0];
  neck2.matrix.translate(.49,.28,.25);
  neck2.matrix.rotate(90,1,0,30);
  neck2.matrix.scale(0.1,.2,.1);
  neck2.render();

  var head = new Cube();
  head.color = [0.4,0.2,0.0,1.0];
  head.matrix.translate(.49,.1,0);
  head.matrix.scale(0.3,.4,.6);
  head.render();

  var leftEar = new Cube();
  leftEar.color = [0.4,0.2,0.0,1.0];
  leftEar.matrix.translate(.47,.32,-.12);
  leftEar.matrix.scale(.2,.3,.1);
  leftEar.matrix.rotate(20, 1, 0, 0); 
  leftEar.matrix.rotate(-30, 0, 0, 1);
  leftEar.matrix.translate(-0.2, 0, .11);
  leftEar.render();

  var rightEar = new Cube();
  rightEar.color = [0.4,0.2,0.0,1.0];
  rightEar.matrix.translate(.47,.1,.63);
  rightEar.matrix.scale(.2,.3,.1);
  rightEar.matrix.rotate(-20, 1, 0, 0); 
  rightEar.matrix.rotate(30, 0, 0, 1);
  rightEar.render();

  var mouth = new Cube();
  mouth.color = [0.4,0.2,0.0,1.0];
  mouth.matrix.translate(.78,.1,.19);
  mouth.matrix.scale(0.3,.2,.3);
  mouth.render();

  var tongue = new Cube();
  tongue.color = [1.0, 0.5, 0.5, 1.0];
  tongue.matrix.translate(1,.1,.28);
  tongue.matrix.scale(0.3,.05,.14);
  tongue.render();

  var nose = new Cube();
  nose.color = [0.1, 0.1, 0.1, 1.0];
  nose.matrix.translate(1,.2,.28);
  nose.matrix.scale(0.1,.1,.14);
  nose.render();

  var leftEye = new Cylinder();
  leftEye.color = [0.1, 0.1, 0.1, 1.0];
  leftEye.matrix.translate(.8,.4,.19);
  leftEye.matrix.scale(.05,.05,.05);
  leftEye.matrix.rotate(90,1,0,0);
  leftEye.matrix.rotate(90,0,0,1);
  leftEye.render();

  
  var rightEye = new Cylinder();
  rightEye.color = [0.1, 0.1, 0.1, 1.0];
  rightEye.matrix.translate(.8,.4,.47);
  rightEye.matrix.scale(.05,.05,.05);
  rightEye.matrix.rotate(90,1,0,0);
  rightEye.matrix.rotate(90,0,0,1);
  rightEye.render();

  var tail = new Cube();
  tail.color = [0.4,0.2,0.0,1.0];
  tail.matrix.translate(-.73,.1,0);
  tail.matrix.scale(0.6,.1,.1);
  tail.matrix.rotate(30,0,0,1);
  tail.render();




  /*
  var yellow = new Cube();
  yellow.color = [1.0,1.0,0.0,1.0];
  yellow.matrix.setTranslate(0, -.5, 0);
  yellow.matrix.rotate(-5,1,0,0);

  yellow.matrix.rotate(-g_yellowAngle,0,0,1);

  var yellowCoordinatesMat=new Matrix4(yellow.matrix);
  yellow.matrix.scale(0.25,.7,.5);
  yellow.matrix.translate(-.5,0,0.0);
  yellow.render();

  var magenta = new Cube();
  magenta.color = [1,0,1,1];
  magenta.matrix = yellowCoordinatesMat;
  magenta.matrix.translate(0,0.65,0);
  magenta.matrix.rotate(g_magentaAngle,0,0,1);
  magenta.matrix.scale(0.3,.3,.3);
  magenta.matrix.translate(-.5,0,-0.001);
  magenta.render();

  */


}
