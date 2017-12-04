var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', 
	function(req, res){
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
		console.log("Listening to port 3000");
	}
);
