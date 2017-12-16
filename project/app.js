var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var THREE = require('three');
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json

var updatable = new Map();
var initialized = false;
var updates = new Array();

app.get('/', 
	function(req, res){
		if(!initialized){
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
		if(updatable.has(req.body.name) && updatable.get(req.body.name).has(req.body.direction)){
			console.log(req.body.name + " " + req.body.direction);
			updatable.get(req.body.name).get(req.body.direction)();
		}
		res.send('');
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

http.listen(process.env.PORT || 3000, 
	function(){
		console.log("Listening to on port %d", this.address().port);
	}
); 

function makeClawMachine(){
	var arcadeMachine = new THREE.Group();
	var bodyMaterial = new THREE.MeshLambertMaterial();
	bodyMaterial.color.setRGB( 0.5, 0.5, 0.5 );

	var crane = makeCrane( bodyMaterial ); // will move up/down
		crane.position.y = 700; 
		crane.name = 'crane';
		updatable.set('crane', new Map());
		updatable.get('crane').set('incr',
			function(){
				if(crane.position.y < 700){
					crane.position.y += 1;
					io.sockets.emit('crane', {data: crane.position.y});
				}
			}
		);
		updatable.get('crane').set('decr', 
			function(){
				if(crane.position.y > 500){
					crane.position.y += -1;
					io.sockets.emit('crane', {data: crane.position.y});
				}
			}
		);

	arcadeMachine.add( crane );

	return arcadeMachine;
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
		updatable.set('railArm',new Map())
		var railRef = railArm;
		var max = 100;
		updatable.get('railArm').set('incr',
			function(){
				if(railRef.position.z < max){
					railRef.position.z += 1;
					io.sockets.emit('railArm', {data:railRef.position.z});
				}
			}
		);
		updatable.get('railArm').set('decr', 
			function(){
				if(railRef.position.z > -max){
					railRef.position.z += -1;
					io.sockets.emit('railArm', {data: railRef.position.z});
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
			updatable.set('hangingArm', new Map())
			var haRef = hangingArm;
			var max = 125;
			updatable.get('hangingArm').set('incr',
				function(){
					if(haRef.position.x < max){
						haRef.position.x += 1;
						io.sockets.emit('hangingArm', {data: haRef.position.x});
					}
				}
			);
			updatable.get('hangingArm').set('decr',
				function(){
					if(haRef.position.x > -max){
						haRef.position.x += -1;
						io.sockets.emit('hangingArm', {data: haRef.position.x});
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
