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
	amount: 100000000,		//100 million = 100 * 10 lakh
	canAdd : function(playerRow){
		var expertise = playerRow['expertise'];
		console.log(parseInt(this.teamCompositionCode));
		var teamCompositionChosen = teamCompositionOptions[parseInt(this.teamCompositionCode)];
		console.log(teamCompositionChosen);
		if(expertise.toUpperCase() === "Batsman".toUpperCase()){
			var allowedBatsman = teamCompositionChosen[0];
			allowedBatsman = parseInt(allowedBatsman[0]);			//ugly hack
			if(this.batsman.length < allowedBatsman)
				return true;
			else
				return false;
		}
		else if(expertise.toUpperCase() === "wicketKeeper".toUpperCase()){
			var allowedKeeper = teamCompositionChosen[1];
			allowedKeeper = parseInt(allowedKeeper[0]);			//ugly hack
			if(this.wicketKeeper === '')
				return true;
			else
				return false;
		}
		else if(expertise.toUpperCase() === "All-rounder".toUpperCase()){
			var allowedRounder = teamCompositionChosen[2];
			allowedRounder = parseInt(allowedRounder[0]);			//ugly hack
			if(this.allRounders.length < allowedRounder)
				return true;
			else
				return false;
		}
		else if(expertise.toUpperCase() === "Bowler".toUpperCase()){
			var allowedBowlers = teamCompositionChosen[3];
			allowedBowlers = parseInt(allowedBowlers[0]);			//ugly hack
			if(this.bowlers.length < allowedBowlers)
				return true;
			else
				return false;
		}
	},
	addPlayer : function(req, res){
		var playerName = req.body.playerId;
		console.log(playerName);
		var playerRow = getPlayerRow(playerName);
		var added = false;
		if(this.amount < playerRow.price){
			res.json({'status' : 'failed', 'remarks' : 'insufficient amount'});
		}
		else if(this.canAdd(playerRow)) {
			if(playerRow.expertise.toUpperCase() === "Batsman".toUpperCase())
				this.batsman.push(playerName);
			else if(playerRow.expertise.toUpperCase() === "Bowler".toUpperCase())
				this.bowlers.push(playerName);
			else if(playerRow.expertise.toUpperCase() === "All-rounder".toUpperCase())
				this.allRounders.push(playerName);
			else if(playerRow.expertise.toUpperCase() === "WicketKeeper".toUpperCase())
				this.wicketKeeper = playerName;
			setPlayerRow(playerName);
			this.amount = this.amount - parseInt(playerRow['price']);
			console.log("player added -> " + playerName);
			added = true;
			res.json({'status':'success','amount': this.amount,'type':playerRow.expertise});
		}
		else {
			res.json({'status':'failed','remarks': 'cannot add'});
		}
	},
	changeComposition : function(req,res){
		this.teamCompositionCode = req.body.compositionCode;
		this.resetPlayers();
		res.json({'status':'success'});
	},
	resetPlayers: function(){
		this.batsman = [];
		this.bowlers = [];
		this.allRounders = [];
		this.wicketKeeper = '';
		this.amount = 100000000;
		for (var i = playerList.length - 1; i >= 0; i--) {
			playerList[i].used = 0;
		};
	},
	resetAll : function(){
		this.resetPlayers();
		this.compositionCode = 0;
	}
}

//var team1;

if( typeof Object.beget !== 'function' ){
		Object.beget = function(o){
			var F = function(){};
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
	//team1 = Object.beget(Team);
	//exports.addPlayer = team1.addPlayer;
};


exports.getList = function(req, res){
  res.send("respond with a resource");
};

exports.addPlayer = function(req,res){
	Team.addPlayer(req,res);
}

exports.changeComposition = function(req,res){
	Team.changeComposition(req,res);
}

exports.getAmount = function(req,res){
	res.json(Team.amount);
}

exports.updatePlayers = function(req, res){
	if(req.body.type === "Batsman")
		res.json(Team.batsman);
	else if(req.body.type === "Bowler")
		res.json(Team.bowlers);
	else if(req.body.type === "All-rounder")
		res.json(Team.allRounders);
	else
		res.json([Team.wicketKeeper]);
}
exports.getPlayerList = function(req, res){
	res.json(playerList);
}
exports.teamName = function(req,res){
	console.log("change team name ->" + req.body.name);
	if(req.body.name != '')
		Team.name = req.body.name;
	res.json(Team.name);
}
function getPlayerRow(playerName){
	var i;
	for(i = 0; i < playerList.length; i++){
		if(playerList[i].name.toUpperCase() === playerName.toUpperCase()){
			return playerList[i];
		}
	}
	return -1; 			//some error
}
function setPlayerRow(playerName){
	var i;
	for(i = 0; i < playerList.length; i++){
		if(playerList[i].name.toUpperCase() === playerName.toUpperCase()){
			playerList[i].used = 1;
		}
	}
	return -1; 			//some error
}