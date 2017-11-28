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

var phase = 0;
var jRef;
var reflection;

var view = 1;

xrot = 0;
zrot = 0;

function fillScene() {
	scene = new Physijs.Scene();
	scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );
	scene.setGravity(new THREE.Vector3( 0, -100, 0 ));

	// Some basic default lighting - in A2 complexity will be added

	//scene.add( new THREE.AmbientLight( 0x222222 ) );

	var light = new THREE.PointLight( 0xffffff, 0.2 );
	light.position.set( 200, 500, 500 );
	light.castShadow = true;
	light.receiveShadow = true;

	scene.add( light );

	var light = new THREE.PointLight( 0xffffff, 0.2 );
	light.position.set( -200, 500, 500 );
	light.castShadow = true;
	light.receiveShadow = true;

	scene.add( light );

	var light = new THREE.PointLight( 0xffffff, 0.2 );
	light.position.set( 200, 500, -500 );
	light.castShadow = true;
	light.receiveShadow = true;

	scene.add( light );

	var light = new THREE.PointLight( 0xffffff, 0.2 );
	light.position.set( -200, 500, -500 );
	light.castShadow = true;
	light.receiveShadow = true;

	scene.add( light );

	var light = new THREE.PointLight( 0xffffff, 0.2 );
	light.position.set( 200, -500, 500 );
	light.castShadow = true;
	light.receiveShadow = true;

	scene.add( light );

	var light = new THREE.PointLight( 0xffffff, 0.2 );
	light.position.set( -200, -500, 500 );
	light.castShadow = true;
	light.receiveShadow = true;

	scene.add( light );

	var light = new THREE.PointLight( 0xffffff, 0.2 );
	light.position.set( 200, -500, -500 );
	light.castShadow = true;
	light.receiveShadow = true;

	scene.add( light );

	var light = new THREE.PointLight( 0xffffff, 0.2 );
	light.position.set( -200, -500, -500 );
	light.castShadow = true;
	light.receiveShadow = true;

	scene.add( light );
	/*
	light = new THREE.PointLight( 0xffffff, 0.9 );
	light.position.set( -200, -100, -400 );
	light.castShadow = true;
	light.recieveShadow = true;

	scene.add( light );
	*/
	//A simple grid floor, the variables hint at the plane that this lies within
	// Later on we might install new flooring.

	var linoleum = Physijs.createMaterial(new THREE.MeshPhysicalMaterial( {
		transparent: true,
		opacity: .97,
		specular: 0x050505,
		shininess: 1,
		metalness: 1
	} ))
	linoleum.color.setRGB( 0.7, 0.5, 0.3);
	var floor = new Physijs.BoxMesh( new THREE.BoxGeometry( 10000, 1, 10000), linoleum , 0 );
	floor.receiveShadow = true;
	//floor.castShadow = true;
	scene.add(floor);	

 	//Visualize the Axes - Useful for debugging, can turn this off if desired
 	var axes = new THREE.AxisHelper(150);
 	axes.position.y = 1;
 	scene.add(axes);

 	drawClawMachine();
}

function drawClawMachine() {

	reflection = true;
	var clawMachineReflection = makeClawMachine();
	reflection = false;

	var clawMachine = makeClawMachine();
	scene.add( clawMachine );

	clawMachineReflection.rotateX(Math.PI);
	clawMachineReflection.rotateY(Math.PI);
	scene.add( clawMachineReflection );
	
	//clawMachineReflection.rotateX(3.14569);
	//clawMachineReflection.rotateY(3.14569);
	//scene.add( clawMachineReflection );
} // drawClawMachine

function makeClawMachine(){
	var machineGeo = new THREE.BoxGeometry( 0, 0, 0 );
	var bodyMaterial = Physijs.createMaterial(new THREE.MeshPhysicalMaterial());
	bodyMaterial.color.setRGB( 0.5, 0.5, 0.5 );
	var arcadeMachine = new Physijs.BoxMesh( machineGeo, bodyMaterial, 0 );

	var frame = makeFrame( bodyMaterial );
	var crane = makeCrane( bodyMaterial ); // will move up/down
		crane.position.y = 700; 

	var maxHeight = 700;
	var minHeight = 535;

	if(!reflection){
		updates.push(
			
			function(){
				if(keyboard.pressed("space")){
					phase = 1
				}
				if(phase == 1){
					crane.position.y += -1;/*
					if(movingDown){
						crane.position.y += -1;
					} else{
						crane.position.y += 1;
					}*/
				}
				if(crane.position.y <= minHeight && phase == 1){
					phase = 2;
				} /*else if(!movingDown && moving && crane.position.y > maxHeight){
					moving = false;
				}*/
				if(phase == 3){
					crane.position.y += 1;
				}
				if(crane.position.y >= maxHeight && phase == 3){
					phase = 4;
				}
				
				crane.__dirtyPosition = true;
			}
		
		);
	}

	var cPanel = makeControlPanel( bodyMaterial, 0 );
		cPanel.position.y = 300;
		cPanel.position.z = -200;

	var prizeBucket = makeChute( bodyMaterial, 0 );
		prizeBucket.position.y = 420;
		prizeBucket.position.x = 0;
		prizeBucket.position.z = -75;

	var prizeChute = makeChute( bodyMaterial, 0 );
		prizeChute.rotateX(1);
		prizeChute.position.y = 200;
		prizeChute.position.x = 0;
		prizeChute.position.z = -150;

	arcadeMachine.add( frame );
	arcadeMachine.add( crane );
	arcadeMachine.add( cPanel ); 
	arcadeMachine.add( prizeBucket );
	arcadeMachine.add( prizeChute );
	
	arcadeMachine.castShadow = true;
	arcadeMachine.recieveShadow = true;

	var hOffset = 475;
	var height = (maxHeight - 125) - hOffset;
	var width = 200;
	var depth = 200;
	

	var ball;
	var ballWidth = 30;
	var ballGeometry = new THREE.SphereGeometry( ballWidth/2, 32, 32 );

	for(k = 1; k < height/ballWidth; k++ ){
		ball = new Physijs.SphereMesh( ballGeometry, bodyMaterial );
		ball.position.y = ( k*ballWidth + hOffset);
		scene.add(ball);
	}

	return arcadeMachine;
}

function makeControlPanel( bodyMaterial ){
	var cPanel = new THREE.Group();
	
	var baseMaterial = Physijs.createMaterial(new THREE.MeshPhysicalMaterial({ map: THREE.ImageUtils.loadTexture('src/wood2.jpg') }));

		panel = new Physijs.BoxMesh( new THREE.BoxGeometry( 250, 20, 100), baseMaterial, 0 );
			panel.position.x = 0;
			panel.position.y = 0;
			panel.position.z = 0;
			panel.castShadow = true;
			panel.recieveShadow = true;
		cPanel.add( panel );

		var slot = makeCoinSlot( bodyMaterial );
		slot.position.y = 40;
		slot.position.z = 50;
		cPanel.add(slot);

		var led = Physijs.createMaterial(new THREE.MeshPhysicalMaterial( {
			transparent: true,
			opacity: .6,
			specular: 0x050505,
			shininess: 1,
			metalness: 0
		} ))
		led.color.setRGB( 0, 0, 1);

		bbutton = new Physijs.BoxMesh( new THREE.BoxGeometry( 30, 10, 30), led, 0 );
		bbutton.position.y = 15;
		bbutton.position.x = 80;
		bbutton.castShadow = true;
		bbutton.recieveShadow = true;
		bbLight = new THREE.PointLight( 0x0000ff, 1 , 40);
		bbLight.position.y = 25;
		bbutton.add(bbLight)
		cPanel.add( bbutton );

		if(!reflection){
			updates.push(

				function(){
					if(phase != 0){
						bbutton.position.y = 10;
					} else {
						bbutton.position.y = 15;
					}
				}

			);
		}

		var jContainer = new THREE.Group(); // should rotate
			
			var led2 = Physijs.createMaterial(new THREE.MeshPhysicalMaterial( {
				transparent: true,
				opacity: .60,
				specular: 0x050505,
				shininess: 1,
				metalness: 0
			} ))
			led2.color.setRGB( 1, 0, 0);

			button = new Physijs.BoxMesh( new THREE.BoxGeometry( 6, 2, 6), led2, 0 );
				button.position.y = 81;
				button.castShadow = true;
				button.recieveShadow = true;
			bLight = new THREE.PointLight( 0xcd0000, 1 , 10);
			bLight.position.y = 2;
			button.add(bLight)
			jContainer.add( button );

			if(!reflection){
				updates.push(

					function(){
						if(phase != 0){
							button.position.y = 81;
						} else {
							button.position.y = 82;
						}
					}

				);
			}

			joyStick = new Physijs.BoxMesh( new THREE.BoxGeometry( 10, 80, 10), bodyMaterial, 0 );
				joyStick.position.y = 40;
				joyStick.castShadow = true;
				joyStick.recieveShadow = true;
			jContainer.add( joyStick );	
				jContainer.position.x = -75;
				jContainer.position.y = 10;
				jContainer.position.z = 0;
			if(!reflection){
				updates.push(

					function(){
						jRef = jContainer;
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
			}

		cPanel.add( jContainer );

	return cPanel;
}

function makeCoinSlot( bodyMaterial ) {
	var led = Physijs.createMaterial(new THREE.MeshPhysicalMaterial( {
		transparent: true,
		opacity: .6,
		specular: 0x050505,
		shininess: 1,
		metalness: 0
	} ))
	led.color.setRGB( 0, 1, 0);

	var back = new Physijs.BoxMesh( new THREE.BoxGeometry( 11.5, 20, 5), led, 0 );
	var bottom = new Physijs.BoxMesh( new THREE.BoxGeometry( 11.5, 5, 5), led, 0 );
	bottom.position.z = -5;
	bottom.position.y = -7.5;
	back.add(bottom);
	var top = new Physijs.BoxMesh( new THREE.BoxGeometry( 11.5, 5, 5), led, 0 );
	top.position.z = -5;
	top.position.y = -bottom.position.y;
	back.add(top);
	var left = new Physijs.BoxMesh( new THREE.BoxGeometry( 5, 20, 5), led, 0 );
	left.position.z = -5;
	left.position.x = -3.5;
	back.add(left);
	var right = new Physijs.BoxMesh( new THREE.BoxGeometry( 5, 20, 5), led, 0 );
	right.position.z = -5;
	right.position.x = -left.position.x;
	back.add(right);
	var bbLight = new THREE.PointLight( 0x00cd00, 1 , 40);
	bbLight.position.z = -2.5
	back.add(bbLight)

	return back;
}

function makeFrame( bodyMaterial ){
	var frameGeo = new THREE.BoxGeometry( 0, 0, 0 );
	var frame = new Physijs.BoxMesh( frameGeo, bodyMaterial, 0 );

		var baseMaterial = Physijs.createMaterial(new THREE.MeshPhysicalMaterial({ map: THREE.ImageUtils.loadTexture('src/wood.jpg') }));


		var base = new Physijs.BoxMesh( new THREE.BoxGeometry( 300, 400, 300 ), baseMaterial, 0 );
			base.position.x = 0;
			base.position.y = 200;
			base.position.z = 0;
			base.castShadow = true;
			base.recieveShadow = true;
			frame.add( base );
		
		stands = makeStands( bodyMaterial, 0 );
			stands.position.y = 600;
		frame.add( stands );
		
		glass = makeGlass();
			glass.position.y = 600;
		frame.add( glass );

		boxTop = new Physijs.BoxMesh(
			new THREE.BoxGeometry( 300, 50, 300 ), baseMaterial, 0 );
			boxTop.position.x = 0;
			boxTop.position.y = 800;
			boxTop.position.z = 0;
			var spot1 = makeChute(bodyMaterial);
				spot1.castShadow = true;
			var light1 = new THREE.PointLight( 0xffffff, 10 , 800);
				light1.castShadow = true;
				light1.receiveShadow = true;
				light1.position.y = 5;
			spot1.add(light1);
			var spot2 = makeChute(bodyMaterial);
				spot2.castShadow = true;
			var light2 = new THREE.PointLight( 0xffffff, 10 , 800);
				light2.castShadow = true;
				light2.receiveShadow = true;
				light1.position.y = 5;
			spot2.add(light2);

			spot1.position.z = -100;
			spot1.position.y = -55;
			spot2.position.z = -spot1.position.z;
			spot2.position.y = spot1.position.y;

			boxTop.add(spot1);
			boxTop.add(spot2);

			var marMaterial = Physijs.createMaterial(new THREE.MeshPhysicalMaterial({ map: THREE.ImageUtils.loadTexture('src/fun.jpg') }));
			var marquis = new Physijs.BoxMesh(
				new THREE.BoxGeometry( 250, 100, 30 ), marMaterial, 0 );
			marquis.position.z = -80;
			marquis.position.y = 60;
			var mlight = new THREE.PointLight( 0xffffff, 5 , 200);
			mlight.castShadow = true;
			mlight.receiveShadow = true;
			mlight.position.y = 5;
			mlight.position.z = -20;
			marquis.add(mlight);

			boxTop.add(marquis);

		frame.add( boxTop );

	return frame;
}

function makeMarquis(){

}

function makeGlass(){
	glassMaterial = new THREE.MeshPhysicalMaterial({transparent: true});
		glassMaterial.opacity = 0.3;
		glassMaterial.color.setRGB(70,130,180);
	var glassGeo = new THREE.BoxGeometry( 0, 0, 0 );
	var glass = new Physijs.BoxMesh( glassGeo, glassMaterial, 0 );

		dist = 148;
		shapeFB = new THREE.BoxGeometry( 2 , 400 , 300 );
		shapeLR = new THREE.BoxGeometry( 300 , 400 , 2 );

		panef = new Physijs.BoxMesh( shapeLR, glassMaterial , 0 );
			panef.position.z = -dist;
			panef.castShadow = true;
			panef.recieveShadow = true;

		paneb = new Physijs.BoxMesh( shapeLR, glassMaterial , 0 );
			paneb.position.z = dist;
			paneb.castShadow = true;
			paneb.recieveShadow = true;

		panel = new Physijs.BoxMesh( shapeFB, glassMaterial , 0 );
			panel.position.x = -dist;
			panel.castShadow = true;
			panel.recieveShadow = true;

		paner = new Physijs.BoxMesh( shapeFB, glassMaterial , 0 );
			paner.position.x = dist;
			paner.castShadow = true;
			paner.recieveShadow = true;
		
		glass.add( panef );
		glass.add( paneb );
		glass.add( panel );
		glass.add( paner );
		

	return glass;

}

function makeChute( bodyMaterial ){

	var baseMaterial = Physijs.createMaterial(new THREE.MeshPhysicalMaterial({ map: THREE.ImageUtils.loadTexture('src/rust.jpg') }));

	var chuteGeo = new THREE.BoxGeometry( 0, 0, 0 );
	var chute = new Physijs.BoxMesh( chuteGeo, baseMaterial, 0 );
		var sideLR = new THREE.BoxGeometry( 4, 80, 80);
		var sideFB = new THREE.BoxGeometry( 80, 80, 4);
		var disp = 38;

		var front = new Physijs.BoxMesh( sideFB, baseMaterial, 0 );
			front.position.z = -disp;
		chute.add( front );

		var back = new Physijs.BoxMesh( sideFB, baseMaterial, 0 );
			back.position.z = disp;
		chute.add( back );

		var left = new Physijs.BoxMesh( sideLR, baseMaterial, 0 );
			left.position.x = -disp;
		chute.add( left );

		var right = new Physijs.BoxMesh( sideLR, baseMaterial, 0 );
			right.position.x = disp;
		chute.add( right );

	return chute;
}

function makeStands( bodyMaterial ){
	var barGeo = new THREE.BoxGeometry( 0, 0, 0 );
	var bars = new Physijs.BoxMesh( barGeo, bodyMaterial, 0 );

		var barShape = new THREE.BoxGeometry( 25, 400, 25);
		disp = 125;
		left = -disp;
		right = disp;
		front = -disp;
		back = disp;

		bar1 = new Physijs.BoxMesh( barShape , bodyMaterial, 0 );
			bar1.position.x = left;
			bar1.position.z = front;
			bar1.castShadow = true;
			bar1.recieveShadow = true;

		bar2 = new Physijs.BoxMesh( barShape , bodyMaterial, 0 );
			bar2.position.x = right;
			bar2.position.z = front;
			bar2.castShadow = true;
			bar2.recieveShadow = true;

		bar3 = new Physijs.BoxMesh( barShape , bodyMaterial, 0 );
			bar3.position.x = left;
			bar3.position.z = back;
			bar3.castShadow = true;
			bar3.recieveShadow = true;

		bar4 = new Physijs.BoxMesh( barShape , bodyMaterial, 0 );
			bar4.position.x = right;
			bar4.position.z = back;
			bar4.castShadow = true;
			bar4.recieveShadow = true;

		bars.add( bar1 );
		bars.add( bar2 );
		bars.add( bar3 );
		bars.add( bar4 );

	return bars;
} 

function makeCrane( bodyMaterial ){
	var craneGeo = new THREE.BoxGeometry( 0, 0, 0 );
	var crane = new Physijs.BoxMesh( craneGeo, bodyMaterial, 0 );

		railShape = new THREE.BoxGeometry( 20, 20, 300 );

		railL = new Physijs.BoxMesh(
			railShape , bodyMaterial, 0 );
			railL.position.x = 125;
			railL.position.y = 0;
			railL.position.z = 0;
			railL.castShadow = true;
			railL.recieveShadow = true;
		crane.add( railL );

		railR = new Physijs.BoxMesh(
			railShape , bodyMaterial, 0 );
			railR.position.x = -railL.position.x;
			railR.position.y = railL.position.y;
			railR.position.z = railL.position.z;
			railR.castShadow = true;
			railR.recieveShadow = true;
		crane.add( railR );

		railArm = makeRailArm( bodyMaterial, 0 ); // this will move forward and backward
		if(!reflection){
			updates.push(

				function(){
					var railRef = railArm;
					var max = 100;
					if((keyboard.pressed("w") || keyboard.pressed("up")) && railRef.position.z < max && phase == 0){
						railRef.position.z += 1;
					} else if((keyboard.pressed("s") || keyboard.pressed("down")) && railRef.position.z > -max && phase == 0){
						railRef.position.z += -1;
					}
					
					if(phase == 5 && railRef.position.z != -75){
						if(railRef.position.z > -75){
							railRef.position.z += -1;
						} else {
							railRef.position.z += 1;
						}
					} else if(phase == 5){
						phase = 6;
					}
					
					railArm.__dirtyPosition = true;
				}

			);
		}
		crane.add( railArm );

	return crane;
}

function makeRailArm( bodyMaterial ){
	var armGeo = new THREE.BoxGeometry( 0, 0, 0 );
	var railArm = new Physijs.BoxMesh( armGeo, bodyMaterial, 0 );

		railB = new Physijs.BoxMesh(
			new THREE.BoxGeometry( 300 , 20, 20 ), bodyMaterial, 0 );
			railB.castShadow = true;
			railB.recieveShadow = true;
		railArm.add( railB );

		hangingArm = makeHangingArm( bodyMaterial, 0 ); // this will move right/left
			hangingArm.position.y = -20;
		if(!reflection){	
			updates.push(
			
				function(){
					var haRef = hangingArm;
					var max = 125;
					if((keyboard.pressed("a") || keyboard.pressed("left")) && haRef.position.x < max && phase == 0){
						haRef.position.x += 1;
					} else if((keyboard.pressed("d") || keyboard.pressed("right")) && haRef.position.x > -max && phase == 0){
						haRef.position.x += -1;
					}
					
					if(phase == 4 && haRef.position.x != 0){
						if(haRef.position.x > 0){
							haRef.position.x += -1;
						} else {
							haRef.position.x += 1;
						}
					} else if(phase == 4){
						phase = 5;
					}
					hangingArm.__dirtyPosition = true;
				}

			);
		}
		railArm.add( hangingArm );

	return railArm;

}

function makeHangingArm( bodyMaterial ){
	var armGeo = new THREE.BoxGeometry( 0, 0, 0 );
	var hangingArm = new Physijs.BoxMesh( armGeo, bodyMaterial, 0 );
		var arm = new Physijs.BoxMesh( new THREE.BoxGeometry( 15, 50, 15), bodyMaterial, 0 );
			arm.position.y = -12;
			arm.castShadow = true;
			arm.recieveShadow = true;
		hangingArm.add( arm );
		var claw = makeClaw( bodyMaterial, 0 );
			claw.position.y = -50;
		hangingArm.add( claw );
	return hangingArm;
}

function makeClaw( bodyMaterial ){
	var claw = new THREE.Group();
	var palm = new Physijs.BoxMesh( new THREE.BoxGeometry( 30, 30, 30 ), bodyMaterial, 0 );
		palm.castShadow = true;
		palm.recieveShadow = true;
	var pHolder1 = makePhalange( bodyMaterial, 0 );
	var pHolder2 = makePhalange( bodyMaterial, 0 );
	pHolder2.rotateY(6.29/3);
	var pHolder3 = makePhalange( bodyMaterial, 0 );
	pHolder3.rotateY(2*6.29/3);

	updates.push(
		
		function(){
			claw.__dirtyPosition = true;
			palm.__dirtyPosition = true;
			pHolder1.__dirtyPosition = true;
			pHolder2.__dirtyPosition = true;
			pHolder3.__dirtyPosition = true;
			pHolder1.__dirtyRotation = true;
			pHolder2.__dirtyRotation = true;
			pHolder3.__dirtyRotation = true;
		}

	);

	claw.add(palm);
	claw.add(pHolder1);
	claw.add(pHolder2);
	claw.add(pHolder3);

	return claw;
}

function makePhalange( bodyMaterial ){
	var phalGeo = new THREE.BoxGeometry( 0, 0, 0 );
	var phalange = new Physijs.BoxMesh( phalGeo, bodyMaterial, 0 );
	var upper = new Physijs.BoxMesh( new THREE.BoxGeometry( 5, 30, 5 ), bodyMaterial, 1 );
	upper.castShadow = true;
	upper.receiveShadow = true;
	upper.position.y = -15;
	upper.position.z = 15
	upper.rotateX(-1.3);
	phalange.add(upper);
	var lower = new Physijs.BoxMesh( new THREE.BoxGeometry( 5, 30, 5 ), bodyMaterial, 1 );
	lower.castShadow = true;
	lower.receiveShadow = true;
	lower.position.y = -33;
	lower.position.z = 30;

	if(!reflection){
		updates.push(
			
			function(){
				lower.__dirtyPosition = true;
				lower.__dirtyRotation = true;
			}

		);
	}

	phalange.add(lower);

	var closing = false;
	var releasing = false;
	var incrMax = 30;
	var incr = 0;

	if(!reflection){
		updates.push(
			
			function(){
				if(phase == 2){
					phalange.rotateX((1/incrMax)/2)
					incr++;	
					if(incr >= incrMax){
						phase = 3;
					}
				}
				if(phase == 6){
					phalange.rotateX((-1/incrMax)/2)
					incr--;	
					if(incr <= 0){
						phase = 0;
					}
				}
				lower.__dirtyPosition = true;
			}

		);
	}
	return phalange;
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
	renderer.shadowMap.enabled = true;
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
	scene.simulate();
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
