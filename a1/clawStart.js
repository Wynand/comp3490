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
var keyboard;
var camera, scene, renderer;
var cameraControls;
var updates = new Array();

var clock = new THREE.Clock();

var view = 1;

xrot = 0;
zrot = 0;

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
	var clawMachine = makeClawMachine();
	scene.add( clawMachine );
} // drawClawMachine

function makeClawMachine(){
	var arcadeMachine = new THREE.Group();
	var bodyMaterial = new THREE.MeshLambertMaterial();
	bodyMaterial.color.setRGB( 0.5, 0.5, 0.5 );

	var frame = makeFrame( bodyMaterial );
	var crane = makeCrane( bodyMaterial ); // will move up/down
		crane.position.y = 700; 

	updates.push(

		function(){
			var craneRef = crane;
			if(keyboard.pressed("e") && craneRef.position.y < 700){
				crane.position.y += 1;
			} else if(craneRef.position.y > 500 && (keyboard.pressed("q") || keyboard.pressed("space")) ){
				crane.position.y += -1;
			}
		}

	);

	var cPanel = makeControlPanel( bodyMaterial );
		cPanel.position.y = 300;
		cPanel.position.z = -200;

	var prizeBucket = makeChute( bodyMaterial );
		prizeBucket.position.y = 420;
		prizeBucket.position.x = -75;
		prizeBucket.position.z = -75;

	var prizeChute = makeChute( bodyMaterial );
		prizeChute.rotateX(1);
		prizeChute.position.y = 200;
		prizeChute.position.x = -75;
		prizeChute.position.z = -150;

	arcadeMachine.add( frame );
	arcadeMachine.add( crane );
	arcadeMachine.add( cPanel ); 
	arcadeMachine.add( prizeBucket );
	arcadeMachine.add( prizeChute );

	return arcadeMachine;
}

function makeControlPanel( bodyMaterial ){
	var cPanel = new THREE.Group();	

		panel = new THREE.Mesh( new THREE.BoxGeometry( 250, 20, 100), bodyMaterial );
			panel.position.x = 0;
			panel.position.y = 0;
			panel.position.z = 0;
		cPanel.add( panel );
		var jContainer = new THREE.Group(); // should rotate
			joyStick = new THREE.Mesh( new THREE.BoxGeometry( 10, 80, 10), bodyMaterial );
				joyStick.position.y = 40;
			jContainer.add( joyStick );	
				jContainer.position.x = -75;
				jContainer.position.y = 10;
				jContainer.position.z = 0;

			updates.push(

				function(){
					var jRef = jContainer;
					var rot = 0.3;

					jRef.rotateX(-xrot);
					xrot = 0;
					jRef.rotateZ(-zrot);
					zrot = 0;

					if(keyboard.pressed("d") || keyboard.pressed("right")){
						zrot += rot;
					} 

					if(keyboard.pressed("a") || keyboard.pressed("left")){
						zrot += -rot;
					} 

					jRef.rotateZ(zrot);

					if(keyboard.pressed("w") || keyboard.pressed("up")){
						xrot += rot;
					} 

					if(keyboard.pressed("s") || keyboard.pressed("down")){
						xrot += -rot;
					}  

					jRef.rotateX(xrot);
				}

			);

		cPanel.add( jContainer );

	return cPanel;
}

function makeFrame( bodyMaterial ){
	var frame = new THREE.Group();

		var base = new THREE.Mesh( new THREE.BoxGeometry( 300, 400, 300 ), bodyMaterial );
			base.position.x = 0;
			base.position.y = 200;
			base.position.z = 0;
		frame.add( base );
		
		stands = makeStands( bodyMaterial );
			stands.position.y = 600;
		frame.add( stands );
		
		glass = makeGlass();
			glass.position.y = 600;
		frame.add( glass );

		boxTop = new THREE.Mesh(
			new THREE.BoxGeometry( 300, 50, 300 ), bodyMaterial );
			boxTop.position.x = 0;
			boxTop.position.y = 800;
			boxTop.position.z = 0;
		frame.add( boxTop );

	return frame;
}

function makeGlass(){
	glassMaterial = new THREE.MeshLambertMaterial({transparent: true});
		glassMaterial.opacity = 0.1;
		glassMaterial.color.setRGB(70,130,180);

	var glass = new THREE.Group();

		dist = 148;
		shapeFB = new THREE.BoxGeometry( 2 , 400 , 300 );
		shapeLR = new THREE.BoxGeometry( 300 , 400 , 2 );

		panef = new THREE.Mesh( shapeLR, glassMaterial );
			panef.position.z = -dist;

		paneb = new THREE.Mesh( shapeLR, glassMaterial );
			paneb.position.z = dist;

		panel = new THREE.Mesh( shapeFB, glassMaterial );
			panel.position.x = -dist;

		paner = new THREE.Mesh( shapeFB, glassMaterial );
			paner.position.x = dist;

		glass.add( panef );
		glass.add( paneb );
		glass.add( panel );
		glass.add( paner );

	return glass;

}

function makeChute( bodyMaterial ){
	var chute = new THREE.Group();
		var sideLR = new THREE.BoxGeometry( 4, 80, 80);
		var sideFB = new THREE.BoxGeometry( 80, 80, 4);
		var disp = 38;

		var front = new THREE.Mesh( sideFB, bodyMaterial );
			front.position.z = -disp;
		chute.add( front );

		var back = new THREE.Mesh( sideFB, bodyMaterial );
			back.position.z = disp;
		chute.add( back );

		var left = new THREE.Mesh( sideLR, bodyMaterial );
			left.position.x = -disp;
		chute.add( left );

		var right = new THREE.Mesh( sideLR, bodyMaterial );
			right.position.x = disp;
		chute.add( right );

	return chute;
}

function makeStands( bodyMaterial ){
	var bars = new THREE.Group();

		var barShape = new THREE.BoxGeometry( 25, 400, 25);
		disp = 125;
		left = -disp;
		right = disp;
		front = -disp;
		back = disp;

		bar1 = new THREE.Mesh( barShape , bodyMaterial );
			bar1.position.x = left;
			bar1.position.z = front;

		bar2 = new THREE.Mesh( barShape , bodyMaterial );
			bar2.position.x = right;
			bar2.position.z = front;

		bar3 = new THREE.Mesh( barShape , bodyMaterial );
			bar3.position.x = left;
			bar3.position.z = back;

		bar4 = new THREE.Mesh( barShape , bodyMaterial );
			bar4.position.x = right;
			bar4.position.z = back;

		bars.add( bar1 );
		bars.add( bar2 );
		bars.add( bar3 );
		bars.add( bar4 );

	return bars;
} 

function makeCrane( bodyMaterial ){
	var crane = new THREE.Group();

		railShape = new THREE.BoxGeometry( 20, 20, 300 );

		railL = new THREE.Mesh(
			railShape , bodyMaterial );
			railL.position.x = 125;
			railL.position.y = 0;
			railL.position.z = 0;
		crane.add( railL );

		railR = new THREE.Mesh(
			railShape , bodyMaterial );
			railR.position.x = -railL.position.x;
			railR.position.y = railL.position.y;
			railR.position.z = railL.position.z;
		crane.add( railR );

		railArm = makeRailArm( bodyMaterial ); // this will move forward and backward

			updates.push(

				function(){
					var railRef = railArm;
					var max = 100;
					if((keyboard.pressed("w") || keyboard.pressed("up")) && railRef.position.z < max){
						railRef.position.z += 1;
					} else if((keyboard.pressed("s") || keyboard.pressed("down")) && railRef.position.z > -max){
						railRef.position.z += -1;
					}
				}

			);

		crane.add( railArm );

	return crane;
}

function makeRailArm( bodyMaterial ){

	railArm = new THREE.Group();

		railB = new THREE.Mesh(
			new THREE.BoxGeometry( 300 , 20, 20 ), bodyMaterial );
		railArm.add( railB );

		hangingArm = makeHangingArm( bodyMaterial ); // this will move right/left
			hangingArm.position.y = -20;
			updates.push(

				function(){
					var haRef = hangingArm;
					var max = 125;
					if((keyboard.pressed("a") || keyboard.pressed("left")) && haRef.position.x < max){
						haRef.position.x += 1;
					} else if((keyboard.pressed("d") || keyboard.pressed("right")) && haRef.position.x > -max){
						haRef.position.x += -1;
					}
				}

			);
		railArm.add( hangingArm );

	return railArm;

}

function makeHangingArm( bodyMaterial ){
	var hangingArm = new THREE.Group();	
		var arm = new THREE.Mesh( new THREE.BoxGeometry( 15, 50, 15), bodyMaterial );
			arm.position.y = -12;
		hangingArm.add( arm );
		var claw = new THREE.Mesh( new THREE.BoxGeometry( 30, 30, 30 ), bodyMaterial );
			claw.position.y = -50;
		hangingArm.add( claw );
	return hangingArm;
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
	camera.position.set( 800, 600, -1200);
	cameraControls.target.set(0,400,0);

	keyboard = new KeyboardState();

	updates.push(keyboard.update);
	updates.push(setCameraAngle);

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
	update();
	window.requestAnimationFrame(animate);
	render();
}

viewSet = false;

function update(){
	for (i in updates){
		updates[i]();
	}
}

function setCameraAngle(){
	if(keyboard.down("v")){
		view = -view;
	} 

	if(view == -1){
		camera.position.set( 0, 800, -1200);
		cameraControls.target.set(0,400,0);
		viewSet = true;
	}else if(view == 1 && viewSet){
		camera.position.set( 800, 600, -1200);
		cameraControls.target.set(0,400,0);
		viewSet = false;
	}
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
