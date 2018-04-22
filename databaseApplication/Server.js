//setup mysql
var mysql = require('mysql');
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "admin",
	database: "WallmartDB"
});

var gameData = {};
gameData.done = 0;
gameData.receiptRow = Math.floor(3*Math.random())
gameData.receiptCol = Math.floor(3*Math.random())
gameData.receiptFloor = 3;

gameData.register = [];
gameData.groceryShelves = [];
gameData.homegoodShelves = [];
gameData.electronicShelves = [];
for(var x = 0; x < 12; x++){
	gameData.groceryShelves.push([]);
	gameData.homegoodShelves.push([]);
	gameData.electronicShelves.push([]);
}


//query a thing
con.connect(function(err) {
	if(err) throw err;

	con.query("select * from EMPLOYEE where fk_store_id = 1;", function(err, result) {
		if (err) throw err;
		var taken = false;
		for(var x = 0; x < Math.min(result.length, 12); x++){
			gameData.register.push(result[x]);
			if(!taken && (Math.random() < .1 || x == Math.min(result.length, 12)-1)){
				gameData.employee = result[x];
				taken = true;
			}
		}
		
		for(var x = result.length; x < 12; x++)
			gameData.register.push(null);
		
		gameData.done += 1;
		console.log('Got employees');
	});
	
	con.query("select * from ITEM where fk_department_id = 3;", function(err, result) {
		if (err) throw err;
		var taken = false;
		for(var x = 0; x < result.length; x++){
			gameData.groceryShelves[Math.floor(Math.random()*12)].push(result[x]);
			if(!taken && (Math.random() < .1 || x == result.length-1)){
				gameData.grocery = result[x];
				taken = true;
			}
		}
		gameData.done += 1;
		console.log('Got groceries');
	});

	con.query("select * from ITEM where fk_department_id = 2;", function(err, result) {
		if (err) throw err;
		var taken = false;
		for(var x = 0; x < result.length; x++){
			gameData.homegoodShelves[Math.floor(Math.random()*12)].push(result[x])
			if(!taken && (Math.random() < .1 || x == result.length-1)){
				gameData.homegood = result[x];
				taken = true;
			}
		}
		gameData.done += 1;
		console.log('Got homegoods');
	});

	con.query("select * from ITEM where fk_department_id = 1;", function(err, result) {
		if (err) throw err;
		var taken = false;
		for(var x = 0; x < result.length; x++){
			gameData.electronicShelves[Math.floor(Math.random()*12)].push(result[x])
			if(!taken && (Math.random() < .1 || x == result.length-1)){
				gameData.electronic = result[x];
				taken = true;
			}
		}
		gameData.done += 1;
		console.log('Got electronics');
	});
});

//set up responding to POST
var express = require('express');
var app = express();

//start server
app.listen(3030);
console.log('Server started');

//enable cross site request
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

//set up response
app.get('/test', function(req, res) {
	while(gameData.done != 4);
	console.log("Sending reponse.");
	res.send(gameData);
});
