////////////////////////////////////////////////////////////////////////////////

/* COMP 3490 A1 Skeleton for Claw Machine (Barebones Edition) 
 * Note that you may make use of the skeleton provided, or start from scratch.
 * The choice is up to you.
 * Read the assignment directions carefully
 * Your claw mechanism should be created such that it is represented hierarchically
 * You might consider looking at THREE.Group and THREE.Object3D for reference
 * If you want to play around with the canvas position, or other HTML/JS level constructs
 * you are welcome to do so.


 /*global variables, coordinates, clock etc.  */
var camera, scene, renderer;
var cameraControls;

var clock = new THREE.Clock();

function fillScene() {
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );

	// Some basic default lighting - in A2 complexity will be added

	scene.add( new THREE.AmbientLight( 0x222222 ) );

	var light = new THREE.DirectionalLight( 0xffffff, 0.7 );
	light.position.set( 200, 500, 500 );

	scene.add( light );

	light = new THREE.DirectionalLight( 0xffffff, 0.9 );
	light.position.set( -200, -100, -400 );

	scene.add( light );

//A simple grid floor, the variables hint at the plane that this lies within
// Later on we might install new flooring.
 var gridXZ = new THREE.GridHelper(2000, 100, new THREE.Color(0xCCCCCC), new THREE.Color(0x888888));
 scene.add(gridXZ);

 //Visualize the Axes - Useful for debugging, can turn this off if desired
 var axes = new THREE.AxisHelper(150);
 axes.position.y = 1;
 scene.add(axes);

 drawClawMachine();
}

function drawClawMachine() {

	//////////////////////////////
	// Some simple material definitions - This may become more complex in A2

	var arcadeMachine = new THREE.Group();
	var frame = new THREE.Group();
	var crane = new THREE.Group();
	var cPanel = new THREE.Group();

	var bodyMaterial = new THREE.MeshLambertMaterial();
	bodyMaterial.color.setRGB( 0.5, 0.5, 0.5 );

	var base;

	// This is where the model gets created. Add the appropriate geometry to create your machine
	// You are not limited to using BoxGeometry, and likely want to use other types of geometry for pieces of your submission
	// Note that the actual shape, size and other factors are up to you, provided constraints listed in the assignment description are met
	

 //The base
	base = new THREE.Mesh(
		new THREE.BoxGeometry( 300, 400, 300 ), bodyMaterial );
	base.position.x = 0;
	base.position.y = 200;
	base.position.z = 0;
	frame.add( base );
	
standShape = new THREE.BoxGeometry( 25, 400, 25);

// A supporting arms
stand1 = new THREE.Mesh(
	standShape , bodyMaterial );
	stand1.position.x = 125;
	stand1.position.y = 600;
	stand1.position.z = 125;
	frame.add( stand1 );

stand2 = new THREE.Mesh(
	standShape , bodyMaterial );
	stand2.position.x = -125;
	stand2.position.y = 600;
	stand2.position.z = 125;
	frame.add( stand2 );

stand3 = new THREE.Mesh(
	standShape , bodyMaterial );
	stand3.position.x = -125;
	stand3.position.y = 600;
	stand3.position.z = -125;
	frame.add( stand3 );

stand4 = new THREE.Mesh(
	standShape , bodyMaterial );
	stand4.position.x = 125;
	stand4.position.y = 600;
	stand4.position.z = -125;
	frame.add( stand4 );

boxTop = new THREE.Mesh(
	new THREE.BoxGeometry( 300, 50, 300 ), bodyMaterial );
	boxTop.position.x = 0;
	boxTop.position.y = 800;
	boxTop.position.z = 0;
	frame.add( boxTop );

panel = new THREE.Mesh(
	new THREE.BoxGeometry( 250, 20, 150), bodyMaterial );
	panel.position.x = 0;
	panel.position.y = 300;
	panel.position.z = -150;
	cPanel.add( panel );

railShape = new THREE.BoxGeometry( 20, 20, 300 );

railL = new THREE.Mesh(
	railShape , bodyMaterial );
	railL.position.x = 125;
	railL.position.y = 700;
	railL.position.z = 0;
	crane.add( railL );

railR = new THREE.Mesh(
	railShape , bodyMaterial );
	railR.position.x = -railL.position.x;
	railR.position.y = railL.position.y;
	railR.position.z = railL.position.z;
	crane.add( railR );

railArm = new THREE.Group();
	
railB = new THREE.Mesh(
	new THREE.BoxGeometry( 300 , 20, 20 ), bodyMaterial );
	panel.position.x = 0;
	panel.position.y = 300;
	panel.position.z = 0;
	railArm.add( railB );

	railArm.position.y = 700;

	crane.add( railArm );

	arcadeMachine.add( frame );
	arcadeMachine.add( crane );
	arcadeMachine.add( cPanel );

	scene.add( arcadeMachine );

}

// Initialization. Define the size of the canvas and store the aspect ratio
// You can change these as well

function init() {
	var canvasWidth = window.innerWidth ||
	document.documentElement.clientWidth ||
	document.body.clientWidth;
	var canvasHeight = window.innerHeight ||
	document.documentElement.clientHeight ||
	document.body.clientHeight; // found in a stack overflow answer by confile
	var canvasRatio = canvasWidth / canvasHeight;

	// Set up a renderer. This will allow WebGL to make your scene appear
	renderer = new THREE.WebGLRenderer( { antialias: true } );

	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0xAAAAAA, 1.0 );

	// You also want a camera. The camera has a default position, but you most likely want to change this.
	// You'll also want to allow a viewpoint that is reminiscent of using the machine as described in the pdf
	// This might include a different position and/or a different field of view etc.
	camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 4000 );
	// Moving the camera with the mouse is simple enough - so this is provided. However, note that by default,
	// the keyboard moves the viewpoint as well
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	camera.position.set( -800, 600, -500);
	cameraControls.target.set(4,301,92);
}

	// We want our document object model (a javascript / HTML construct) to include our canvas
	// These allow for easy integration of webGL and HTML
function addToDOM() {
    var canvas = document.getElementById('canvas');
    canvas.appendChild(renderer.domElement);
}

	// This is a browser callback for repainting
	// Since you might change view, or move things
	// We cant to update what appears
function animate() {
	window.requestAnimationFrame(animate);
	render();
}

	// getDelta comes from THREE.js - this tells how much time passed since this was last called
	// This might be useful if time is needed to make things appear smooth, in any animation, or calculation
	// The following function stores this, and also renders the scene based on the defined scene and camera
function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);

	renderer.render(scene, camera);
}

	// Since we're such talented programmers, we include some exception handeling in case we break something
	// a try and catch accomplished this as it often does
	// The sequence below includes initialization, filling up the scene, adding this to the DOM, and animating (updating what appears)
try {
  init();
  fillScene();
  addToDOM();
  animate();
} catch(error) {
    console.log("You did something bordering on utter madness. Error was:");
    console.log(error);
}
