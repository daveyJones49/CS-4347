var ROW = 1;
var COL = 1;
var FLOOR = 3;
var inventory = [];
var gameEnded = false;
var foundReceipt = false;
var countDownDate = null;
var audio;
var toto;

var HELPSTR = "You are in a burning building with a locked door. You need to find the code to get out but you also don't want to leave without the items you paid for.\
Here are some things you can do:<br>\
<ul>\
<li>help - Print this helpful message</li>\
<li>look around - Look at surroundings</li>\
<li>exit door - Attempt to exit through a door, if next to one</li>\
<li>go &ltdirection&gt - walk in a given direction (north, south, east, west, up, down)</li>\
<li>inspect &ltdirection&gt - inspect a direction (north, south, east, west)</li>\
<li>take &ltnumber&gt from &ltdirection&gt - take the item with the given number from the shelf in the given direction (north, south)</li>\
";

var gameData = null;

$(document).ready(function() {
	colorMap();
	$('#userinput').val('');
	
	$.get("http://localhost:3030/test", 
		function(data, status){
			toto = new Audio("toto.mp3");
			toto.play();
			gameData = data;
			countDownDate = new Date().getTime() + 60*1000*5;
		}
	);

	$('#inputForm').submit(function(e) {
		e.preventDefault();
		iterate();
		$("#responses").scrollTop($("#responses")[0].scrollHeight);
		$('#userinput').val('');
		return false;
	});

	var md = document.getElementById("visual");
	md.style.background = 'url(darkHomegood.jpg) no-repeat';
	md.style.backgroundSize = '100% 100%';
	var j = null;
	var i = setInterval(function(){
		if (gameEnded) {
			toto.pause();
			clearInterval(i);
		}
		
		audio = new Audio('bam' + Math.floor(Math.random()*7) + '.mp3');
		audio.play();
		if (FLOOR === 4) {
			md.style.background = 'url(darkshakyElectronic.gif) no-repeat';
			md.style.backgroundSize = '100% 100%';
		} else if (FLOOR === 3) {
			md.style.background = 'url(darkshakyHomegood.gif) no-repeat';
			md.style.backgroundSize = '100% 100%';
		} else if (FLOOR === 2) {
			md.style.background = 'url(darkshakyGrocery.gif) no-repeat';
			md.style.backgroundSize = '100% 100%';
		} else {
			md.style.background = 'url(darkshakyCheckout.gif) no-repeat';
			md.style.backgroundSize = '100% 100%';
		}
		
		j = setInterval(function() {
			if (FLOOR === 4) {
				md.style.background = 'url(darkElectronic.jpeg) no-repeat';
				md.style.backgroundSize = '100% 100%';
			} else if (FLOOR === 3) {
				md.style.background = 'url(darkHomegood.jpg) no-repeat';
				md.style.backgroundSize = '100% 100%';
			} else if (FLOOR === 2) {
				md.style.background = 'url(darkGrocery.jpg) no-repeat';
				md.style.backgroundSize = '100% 100%';
			} else {
				md.style.background = 'url(darkCheckout.jpeg) no-repeat';
				md.style.backgroundSize = '100% 100%';
			}
			
			clearInterval(j);
		}, 300);
	}, 5000);

	var k = setInterval(function(){
		if(countDownDate == null)
			return;
			
		if (gameEnded) {
			toto.pause();
			clearInterval(k);
		}
		
		// Get todays date and time
		var now = new Date().getTime();

		// Find the distance between now an the count down date
		var distance = countDownDate - now;

		// Time calculations for days, hours, minutes and seconds
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);

		$('#countdown').html(minutes + "m " + seconds + "s ");

		// If the count down is finished, write some text 
		if (distance < 0) {
			clearInterval(k);
			$('#countdown').html("time up");
			toto.pause();
			audio.pause();
			audio = new Audio("gameover.mp3");
			audio.play();
			clearInterval(i);
			endGame();
		}
	}, 1000);

});

function endGame() {
	var newBody = "<div id=\"player\" class=\"player\" style=\"float:left; height: 100%; width: 100%;\"> <video id=\"element\" src=\"collapse.mp4\" autoplay style=\"height:90%; width:100%;\"></video> <div id=\"belowVideo\" style=\"text-align:center;\"> <p> Game Over! </p> </div></div>";
	$('body').html(newBody);
}

function youWon() {
	gameEnded = true;
	var newBody = "<div id=\"player\" class=\"player\" style=\"float:left; height: 100%; width: 100%;\"> <video id=\"element\" src=\"bloodyhell.mp4\" autoplay style=\"height:90%; width:100%;\"></video> <div id=\"belowVideo\" style=\"text-align:center;\"> <p> You Escaped! </p> </div></div>";
	$('body').html(newBody);
}

//write to the response div
function writeResponse(line){
	$('#responses').html($('#responses').html() + " <p>" + line + " </p>");
}

function writeReceipt(){
	var ret = "<p>Receipt</p>";
	ret += "<p>Employee name: " + gameData.employee.name + "</p>";
	
	ret += "<p> Items: </p><ul>"

	if(inventory.includes(gameData.grocery.item_id))
		ret += "<li><s>" + gameData.grocery.name + ": $" + gameData.grocery.price.toFixed(2) + "</s></li>";
	else
		ret += "<li>" + gameData.grocery.name + ": $" + gameData.grocery.price.toFixed(2) + "</li>";
	
	if(inventory.includes(gameData.homegood.item_id))
		ret += "<li><s>" + gameData.homegood.name + ": $" + gameData.homegood.price.toFixed(2) + "</s></li>";
	else
		ret += "<li>" + gameData.homegood.name + ": $" + gameData.homegood.price.toFixed(2) + "</li>";
	
	if(inventory.includes(gameData.electronic.item_id))
		ret += "<li><s>" + gameData.electronic.name + ": $" + gameData.electronic.price.toFixed(2) + "</s></li>";
	else
		ret += "<li>" + gameData.electronic.name + ": $" + gameData.electronic.price.toFixed(2) + "</li>";
	
	ret += "</ul>";

	ret += "<p>Total: $" + (gameData.grocery.price + gameData.homegood.price + gameData.electronic.price).toFixed(2) + "</p>";

	$('#receipt').html(ret);
}

//this does one iteration of the game
function iterate(){
	var input = $('#userinput').val().trim().toLowerCase();
	if(!input){
		return;
	}
	
	if(gameEnded){
		writeResponse("You did it!");
		return;
	}
	
	writeResponse("> " + input);
	
	if(input.startsWith('help')){
		doHelp();
	}
	else if(input === 'look around'){
		doLookAround();
	}
	else if(input === 'exit door'){
		doExitDoor();
	}
	else if(input.startsWith('inspect ')){
		doInspect(input);
	}
	else if(input.startsWith('go ')){
		doGo(input);
	}
	else if(input.startsWith('take ')){
		doTake(input);
	} else{
		writeResponse("I don't know that command");
	}
}

function doHelp(){
	writeResponse(HELPSTR);
}

function doLookAround(){
	if (COL == 0) {
		if (FLOOR != 1) {
			writeResponse('You are standing in an aisle. To the north and south you see shelves. To the east you see a hallway. To the west you see a wall.');
		} else {
			writeResponse('You are standing between two cash registers. To the east you see a hallway. To the west you see a wall.');
		}
	} else if (COL == 2) {
		if (FLOOR != 1) {
			writeResponse('You are standing in an aisle. To the north and south you see shelves. To the west you see a hallway. To the east you see a wall.');
		} else {
			writeResponse('You are standing between two cash registers. To the west you see a hallway. To the east you see a wall.');
		}
	} else {
		if (ROW == 0) {
			writeResponse('You are standing next to the staircase. To the east and west you see aisles. To the south you see a hallway.');
		} else if (ROW == 1) {
			writeResponse('You are standing in a hallway. To the east and west you see aisles.');
		} else {
			if (FLOOR != 1) {
				writeResponse('You see a window to the south. To the north is a hallway. To your east and west you see aisles.');
			} else {
				writeResponse('To the south you see a locked door. To the north is a hallway. To your east and west you see cash registers.');
			}
		}
	}
}

function doExitDoor(){
	if(ROW == 2 && COL == 1 && FLOOR == 1){
		if(inventory.length < 3){
			writeResponse("You wouldn't leave without all the items you paid for.");
		}
		else if(gameData.employee.employee_id == prompt("Enter passcode")){
			writeResponse("You exit the door into freedom. You win.");
			youWon();
		}
		else{
			writeResponse("The door rejects you with a loud beep.");
		}
	}
	else{
		writeResponse("There's no door there!");
	}
}

function doGo(input){
	var arr = input.split(/\s+/);
	if(arr.length == 1){
		writeResponse("You didn't give me a direction.");
		return;
	}
	else if(arr.length > 2){
		writeResponse("I don't know that direction.");
		return;
	}
	
	var dir = arr[1];
    dir = checkAlias(dir);

	if(dir === 'north'){
		if(COL == 0 || COL == 2){
			if(FLOOR == 1)
				writeResponse("A cash register blocks your way.");
			else
				writeResponse("A shelf blocks your way.");
			return;
		}
		else if(ROW == 0){
			writeResponse("There is a staircase in that direction. Go up or down.");
			return;
		}
		else{
			ROW -= 1;
		}
	}
	else if(dir === 'south'){
		if(COL == 0 || COL == 2){
			if(FLOOR == 1)
				writeResponse("A cash register blocks your way.");
			else
				writeResponse("A shelf blocks your way.");
			return;
		}
		else if(ROW == 2){
			if(FLOOR == 1){
				writeResponse("There is a locked door in that direction.");
				return;
			}
			else{
				writeResponse("There is a window in that direction.");
				return;
			}
		}
		else{
			ROW += 1;
		}
	}
	else if(dir === 'east'){
		if(COL == 2){
			writeResponse("There is a wall in that direction.");
			return;
		}
		else{
			COL += 1;
		}
	}
	else if(dir === 'west'){
		if(COL == 0){
			writeResponse("There is a wall in that direction.");
			return;
		}
		else{
			COL -= 1;
		}
	}
	else if(dir === 'up'){
		if(ROW != 0 || COL != 1){
			writeResponse("You are not standing near a staircase.");
			return;
		}
		else if(FLOOR == 4){
			writeResponse("You are already on the top floor.");
			return;
		}
		else{
			FLOOR += 1;
			writeResponse("You go up a floor.");
			updateImage(FLOOR);
		}
	}
	else if(dir === 'down'){
		if(ROW != 0 || COL != 1){
			writeResponse("You are not standing near a staircase.");
			return;
		}
		else if(FLOOR == 1){
			writeResponse("You are already on the ground floor.");
			return;
		}
		else{
			FLOOR -= 1;
			writeResponse("You go down a floor.");
			updateImage(FLOOR);
		}
	}
	else{
		writeResponse("I don't know that direction");
		return;
	}
	
	checkReceipt();
	colorMap();
}

function checkAlias(d) {
	if (d === "n") {
		d = "north";
	}
	else if (d === "s") {
		d = "south";
	}
	else if (d === "e") {
		d = "east";
	}
	else if (d === "w") {
		d = "west";
	}
	return d;
}

function updateImage(floor) {
	var md = document.getElementById("visual");
	if (FLOOR === 4) {
		md.style.background = 'url(darkElectronic.jpeg) no-repeat';
		md.style.backgroundSize = '100% 100%';
	} else if (FLOOR === 3) {
		md.style.background = 'url(darkHomegood.jpg) no-repeat';
		md.style.backgroundSize = '100% 100%';
	} else if (FLOOR === 2) {
		md.style.background = 'url(darkGrocery.jpg) no-repeat';
		md.style.backgroundSize = '100% 100%';
	} else {
		md.style.background = 'url(darkCheckout.jpeg) no-repeat';
		md.style.backgroundSize = '100% 100%';
	}
}

function checkReceipt(){
	if(!foundReceipt && ROW == gameData.receiptRow && COL == gameData.receiptCol && FLOOR == gameData.receiptFloor){
		writeResponse("As you take a step, you hear a crinkly noise under your foot. It's your receipt!");
		revealReceipt();
	}
}

function doInspect(input) {
	var arr = input.split(/\s+/);
	if(arr.length == 1){
		writeResponse("You didn't give me a direction.");
		return;
	}
	else if(arr.length > 2){
		writeResponse("I don't know that direction.");
		return;
	}
	
	var dir = arr[1];
    dir = checkAlias(dir);

	var floorShelves = null;
	if(FLOOR == 1){
		floorShelves = gameData.register;
	} else if(FLOOR == 2){
		floorShelves = gameData.groceryShelves;
	} else if(FLOOR == 3){
		floorShelves = gameData.homegoodShelves;
	} else if(FLOOR == 4){
		floorShelves = gameData.electronicShelves;
	}
		
	var shelf = null;
	
	if(COL == 0 && ROW == 0 && dir === 'north'){
		shelf = floorShelves[0];
	} 
	else if(COL == 0 && ROW == 0 && dir === 'south'){
		shelf = floorShelves[1];
	} 
	else if(COL == 0 && ROW == 1 && dir === 'north'){
		shelf = floorShelves[2];
	} 
	else if(COL == 0 && ROW == 1 && dir === 'south'){
		shelf = floorShelves[3];
	} 
	else if(COL == 0 && ROW == 2 && dir === 'north'){
		shelf = floorShelves[4];
	} 
	else if(COL == 0 && ROW == 2 && dir === 'south'){
		shelf = floorShelves[5];
	} 
	else if(COL == 2 && ROW == 0 && dir === 'north'){
		shelf = floorShelves[6];
	} 
	else if(COL == 2 && ROW == 0 && dir === 'south'){
		shelf = floorShelves[7];
	} 
	else if(COL == 2 && ROW == 1 && dir === 'north'){
		shelf = floorShelves[8];
	} 
	else if(COL == 2 && ROW == 1 && dir === 'south'){
		shelf = floorShelves[9];
	} 
	else if(COL == 2 && ROW == 2 && dir === 'north'){
		shelf = floorShelves[10];
	} 
	else if(COL == 2 && ROW == 2 && dir === 'south'){
		shelf = floorShelves[11];
	}
	
	if(dir === 'north'){
		if(COL == 0 || COL == 2){
			if(FLOOR == 1)
				writeResponse("You look at the register and see " + registerToString(shelf));
			else
				writeResponse("You look at the shelf and see" + shelfToString(shelf));
			return;
		}
		else if(ROW == 0){
			writeResponse("There is a staircase in that direction. Go up or down.");
			return;
		}
		else{
			writeResponse("You could go that way.");
		}
	}
	else if(dir === 'south'){
		if(COL == 0 || COL == 2){
			if(FLOOR == 1)
				writeResponse("You look at the register and see " + registerToString(shelf));
			else
				writeResponse("You look at the shelf and see" + shelfToString(shelf));
			return;
		}
		else if(ROW == 2){
			if(FLOOR == 1){
				writeResponse("There is a locked door in that direction.");
				return;
			}
			else{
				writeResponse("There is a window in that direction.");
				return;
			}
		}
		else{
			writeResponse("You could go that way.");
		}
	}
	else if(dir === 'east'){
		if(COL == 2){
			writeResponse("There is a wall in that direction.");
			return;
		}
		else{
			writeResponse("You could go that way.");
		}
	}
	else if(dir === 'west'){
		if(COL == 0){
			writeResponse("There is a wall in that direction.");
			return;
		}
		else{
			writeResponse("You could walk that way if you felt like it.");
		}
	}
	else{
		writeResponse("I don't know that direction");
		return;
	}
}

function doTake(input) {
	var arr = input.split(/\s+/);
	if(arr.length != 4 || arr[2] !== 'from'){
		writeResponse("Format your request better.");
		return;
	}
	
	var num = arr[1]-1;
	var dir = arr[3];
    dir = checkAlias(dir);
	
	var floorShelves = null;
	if(FLOOR == 2){
		floorShelves = gameData.groceryShelves;
	} else if(FLOOR == 3){
		floorShelves = gameData.homegoodShelves;
	} else if(FLOOR == 4){
		floorShelves = gameData.electronicShelves;
	}
	
	var shelf = null;
	
	if(floorShelves){
		if(COL == 0 && ROW == 0 && dir === 'north'){
			shelf = floorShelves[0];
		} 
		else if(COL == 0 && ROW == 0 && dir === 'south'){
			shelf = floorShelves[1];
		} 
		else if(COL == 0 && ROW == 1 && dir === 'north'){
			shelf = floorShelves[2];
		} 
		else if(COL == 0 && ROW == 1 && dir === 'south'){
			shelf = floorShelves[3];
		} 
		else if(COL == 0 && ROW == 2 && dir === 'north'){
			shelf = floorShelves[4];
		} 
		else if(COL == 0 && ROW == 2 && dir === 'south'){
			shelf = floorShelves[5];
		} 
		else if(COL == 2 && ROW == 0 && dir === 'north'){
			shelf = floorShelves[6];
		} 
		else if(COL == 2 && ROW == 0 && dir === 'south'){
			shelf = floorShelves[7];
		} 
		else if(COL == 2 && ROW == 1 && dir === 'north'){
			shelf = floorShelves[8];
		} 
		else if(COL == 2 && ROW == 1 && dir === 'south'){
			shelf = floorShelves[9];
		} 
		else if(COL == 2 && ROW == 2 && dir === 'north'){
			shelf = floorShelves[10];
		} 
		else if(COL == 2 && ROW == 2 && dir === 'south'){
			shelf = floorShelves[11];
		}
	}
	
	if(shelf === null){
		writeResponse("There's no shelf there.");
	}
	else if(!foundReceipt){
		writeResponse("You can't remember if you bought that. Maybe find your receipt?");
	}
	else if(shelf.length > num){
		var item = shelf[num];
		if(didBuy(item)){
			shelf.splice(num, 1);
			writeResponse("You take the " + item.name + " from the shelf.");
			inventory.push(item.item_id);
			writeReceipt();
		}
		else{
			writeResponse("You didn't pay for that.");
		}
	}
	else{
		writeResponse("There is no item with that number on that shelf.");
	}

}

function colorMap(){
	$("#mapfloor").html("Map of floor " + FLOOR);
	for(var r = 0; r < 3; r++){
		for(var c = 0; c < 3; c++){
            if(FLOOR == 1) {
                $('#map2-1').children().html('door');
            }
			if(r == ROW && c == COL)
				$('#map' + r + "-" + c)[0].style.backgroundColor = '#A32B08';
			else
				$('#map' + r + "-" + c)[0].style.backgroundColor = '#DDDDDD';
		}
	}
}

function revealReceipt(){
	foundReceipt = true;
	var R = $('#receipt')[0];
	R.innerHTML = "";
	R.style.backgroundImage = "url('paper.png')";
	R.style.backgroundSize = "100% 100%";
	R.style.backgroundColor = 'transparent';
	R.style.color = '#000000';
	R.style.fontSize = 'small';
	R.style.textAlign = 'left';
	R.style.lineHeight = 1.5;
	R.style.verticalAlign = 'middle';
	R.style.paddingLeft = '100';
	R.style.paddingRight = '75';
	R.style.paddingTop = '50';
	writeReceipt();
}

function shelfToString(shelf){
	if(shelf === null){
		return " a spider. Eek!";
	}
	
	if(shelf == 0){
		return " an empty shelf.";
	}
	
	var ret = '<ol>'
	for(var x = 0; x < shelf.length; x++){
		ret += "<li>" + shelf[x].name + "</li>";
	}
	ret += '</ol>';
	return ret;
}

function didBuy(item){
	return gameData.grocery.name == item.name
		|| gameData.homegood.name == item.name
		|| gameData.electronic.name == item.name;
}

function registerToString(register){
	if(register == null)
		return " a blank screen.";
	else
		return " Employee name: " + register.name + "<br>Employee id: " + register.employee_id;
 }
