var fs = require('fs');
var teamCompositionOptions = [];
var playerList = [];

var Team = {
	name : 'untitled',
	teamCompositionCode : 0,
	batsman: [],
	bowlers: [],
	allRounders: [],
	wicketKeeper: '',
	amount: 10000000,		//100 million = 100 * 10 lakh

	addPlayer = function(req, res){
		var playerName = req.body.playerName;
		var playerRow = getPlayerRow(playerName);
		var added = false;
		if(addingAllowed(playerRow)){
			if(playerRow.expertise.toUpperCase() === "Batsman".toUpperCase())
				batsman.push(playerName);
			else if(playerRow.expertise.toUpperCase() === "Bowler".toUpperCase())
				bowlers.push(playerName);
			else if(playerRow.expertise.toUpperCase() === "All-rounder".toUpperCase())
				allRounders.push(playerName);
			else if(playerRow.expertise.toUpperCase() === "WicketKeeper".toUpperCase())
				wicketweeker = playerName;

			amount = amount - parseInt(playerRow['price']);
			console.log("player added -> " + playerName);
			added = true;
		}
		res.json({'status':'success','amount':amount});
	}
	addingAllowed = function(playerRow){
		var expertise = playerRow['expertise'];
		var teamCompositionChosen = teamCompositionOptions[teamCompositionCode];
		if(expertise.toUpperCase() === "Batsman".toUpperCase()){
			var allowedBatsman = teamCompositionChosen[0];
			allowedBatsman = parseInt(allowedBatsman[0]);			//ugly hack
			if(batsman.length < allowedBatsman)
				return true;
			else
				return false;
		}
		else if(expertise.toUpperCase() === "WicketKeeper".toUpperCase()){
			var allowedKeeper = teamCompositionChosen[1];
			allowedKeeper = parseInt(allowedKeeper[0]);			//ugly hack
			if(WicketKeeper.length < allowedKeeper)
				return true;
			else
				return false;
		}
		else if(expertise.toUpperCase() === "All-rounder".toUpperCase()){
			var allowedRounder = teamCompositionChosen[2];
			allowedRounder = parseInt(allowedRounder[0]);			//ugly hack
			if(allRounders.length < allowedRounder)
				return true;
			else
				return false;
		}
		else if(expertise.toUpperCase() === "Bowler".toUpperCase()){
			var allowedBowlers = teamCompositionChosen[3];
			allowedBowlers = parseInt(allowedBowlers[0]);			//ugly hack
			if(bowlers.length < allowedBowlers)
				return true;
			else
				return false;
		}
	}
}

var team1;

if( typeof Object.beget !== 'function' ){
		Object.beget = function(o){
		var F =new Function(){};
		F.prototype = o;
		return new F();
	}
}

exports.init = function(){

	//read team composition options
	fs.readFile('public/teamComposition.json', 'utf-8', function(err, data){
		if(err){
			console.log(err);
			return;
		}
		data = JSON.parse(data);
		teamCompositionOptions = data['teamComposition'];
	});

	//read player list
	fs.readFile('public/playerList.json', 'utf-8', function(err, data){
		if(err){
			console.log(err);
			return;
		}
		data = JSON.parse(data);
		playerList = data['players'];
	});	

	//create a new object
	team1 = Object.beget(Team);
};


exports.getList = function(req, res){
  res.send("respond with a resource");
};

function getPlayerRow(playerName){
	for(playerIndex in playerList){
		if(playerList[playerIndex].name.toUpperCase() === playerName.toUpperCase())
			console.log("got player -> " + playerList[playerIndex] );
			return playerList[playerIndex];
	}
	return -1; 			//some error
}