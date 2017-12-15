var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var THREE = require('three.js')();

var updatable = new Map();
var initialized = false;

app.get('/', 
	function(req, res){
		if(!inititialized){
			makeClawMachine();
		}	
		res.sendFile(__dirname + '/a1/clawmachine.html');
	}
);

app.get('/clawStart.js', 
	function(req, res){
		res.sendFile(__dirname + '/a1/clawStart.js' );
	}
);

app.get('/js/KeyboardState.js', 
	function(req, res){
		res.sendFile(__dirname + '/a1/js/KeyboardState.js' );
	}
);

app.post('/update', 
	function(req, res){
		
	}
)

io.on('connection', 
	function(socket){
		console.log("A user is connected");
		socket.on('disconnect', 
			function(){
				console.log("user disconnected");
			}
		);
	}
);

http.listen(3000, 
	function(){
		console.log("Listening to on port 3000");
	}
);

function makeClawMachine(){
	var arcadeMachine = new THREE.Group();
	var bodyMaterial = new THREE.MeshLambertMaterial();
	bodyMaterial.color.setRGB( 0.5, 0.5, 0.5 );

	var frame = makeFrame( bodyMaterial );
	var crane = makeCrane( bodyMaterial ); // will move up/down
		crane.position.y = 700; 
		crane.name = 'crane';
		updatable.set('crane', crane);

	updates.push(

		function(){
			var craneRef = crane;
			if(keyboard.pressed("e") && craneRef.position.y < 700){
				updatable.get('crane').position.y += 1;
			} else if(craneRef.position.y > 500 && (keyboard.pressed("q") || keyboard.pressed("space")) ){
				updatable.get('crane').position.y += -1;
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
				jContainer.name = 'jContainer';
				updatable.set('jContainer', jContainer);

			updates.push(

				function(){
					var jRef = updatable.get('jContainer');
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
		railArm.name = 'railArm';
		updatable.set('railArm',railArm)

			updates.push(

				function(){
					var railRef = updatable.get('railArm');
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
			hangingArm.name = 'hangingArm';
			updatable.set('hangingArm', hangingArm)
			updates.push(

				function(){
					var haRef = updatable.get('hangingArm');
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
	return hangingArm;
}
