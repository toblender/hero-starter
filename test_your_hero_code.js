/*

If you'd like to test your hero code locally,
run this code using node (must have node installed).

Please note that you DO NOT need to do this to enter javascript
battle, it is simply an easy way to test whether your new hero 
code will work in the javascript battle.

To run:

  -Install node
  -Run the following in your terminal:

    node test_your_hero_code.js

  -If you don't see any errors in your terminal, the code works!

*/

//Get the helper file and the Game logic
var helpers = require('./helpers.js');
var Game = require('./game_logic/Game.js');

//Get my hero's move function ("brain")
var heroMoveFunction = require('./hero.js');

var movementAi = require('./ai.js');

//The move function ("brain") the practice enemy will use
var enemyMoveFunction = function(gameData, helpers, aiType) {
  //Move in a random direction
//  var choices = ['North', 'South', 'East', 'West'];
//  return choices[Math.floor(Math.random()*4)];
//We are all heroes to someone...
/*
   var myHero = gameData.activeHero;
   if (myHero.health < 30) {
     return helpers.findNearestHealthWell(gameData);
   } else {
     return helpers.findNearestEnemy(gameData);
   }
*/
	return movementAi[aiType](gameData,helpers);


}

//Makes a new game with a 5x5 board
var boardSize =12 
var game = new Game(12);

function addWells(game){
	game.addHealthWell(3,3);
	game.addHealthWell(7,8);
	game.addHealthWell(3,8);
	game.addHealthWell(7,3);
}

function addDiamonds(game){
	game.addDiamondMine(5,0);
	game.addDiamondMine(6,0);
	game.addDiamondMine(0,5);
	game.addDiamondMine(0,6);
	game.addDiamondMine(11,5);
	game.addDiamondMine(11,6);
	game.addDiamondMine(5,11);
	game.addDiamondMine(6,11);
	game.addDiamondMine(9,5);
	game.addDiamondMine(9,6);

	game.addDiamondMine(5,5);
	game.addDiamondMine(5,6);
}

function addTrees(game){
	for (var i=1;i<boardSize-1;i++){
		game.addImpassable(1,i);
	}
	for (var i=2;i<boardSize-1;i++){
		game.addImpassable(10,i);
	}
	game.addImpassable(4,4);
	game.addImpassable(4,7);
	game.addImpassable(6,4);
	game.addImpassable(6,7);
	
	game.addImpassable(10,5);
	game.addImpassable(10,6);

	game.addImpassable(1,5);
	game.addImpassable(1,6);
}

function drawBoard(game){
	addWells(game);
	addDiamonds(game);
	addTrees(game);
}

drawBoard(game);

/*
//Add a health well in the middle of the board
game.addHealthWell(2,2);

//Add diamond mines on either side of the health well
game.addDiamondMine(2,1);
game.addDiamondMine(2,3);
//Add your hero in the top left corner of the map (team 0)
game.addHero(0, 0, 'MyHero', 0);
game.addHero(11, 11, 'Team', 0);

//Add an enemy hero in the bottom left corner of the map (team 1)
game.addHero(1, 1, 'Enemy', 1);
game.addHero(11, 8, 'Enemy', 1);
game.addHero(11, 10, 'Enemy', 1);

*/

function generateUnoccupied(game){
	function getRand(){
		//Remember if you do +1 it will over board
		return Math.floor((Math.random() * boardSize));
	}
	var x=0;
	var y=0;
	while(true){
		//Generate 2 numbers, if they are unoccupied return
		x = getRand();
		y = getRand();
		console.log('game board %s,%s, %j',x,y,game.board.tiles[x][y]);
		if(game.board.tiles[x][y].type === 'Unoccupied'){	
			return {x:x,y:y};
		}
	}
}

function generateTeam(game){
	var position = generateUnoccupied(game);
	game.addHero(position.x,position.y,'MyHero',0);

	for (var i=0;i<9;i++){
		position = generateUnoccupied(game);
		game.addHero(position.x,position.y,'Team',0);
	}
}

function generateEnemy(game){
	for (var i=0;i<10;i++){
		var position = generateUnoccupied(game);
		game.addHero(position.x,position.y,'Enemy',1);
	}
}

generateTeam(game);
generateEnemy(game);

console.log('About to start the game!  Here is what the board looks like:');

//You can run game.board.inspect() in this test code at any time
//to log out the current state of the board (keep in mind that in the actual
//game, the game object will not have any functions on it)
game.board.inspect();

//Play a very short practice game
var turnsToPlay = 1250;

var lastActiveHero='';
for (var i=0; i<turnsToPlay; i++) {
  if (lastActiveHero === game.activeHero.id){
	console.log('Game stuck');
	break;
  }
  var hero = game.activeHero;
  var direction;

  if(game.activeHero.won){
	console.log('Hero: %s, %j',hero.name,game.activeHero);
	console.log('Game over....<<<<<<<<<<<<<<<<<<<<<<<');
	console.log(movementAi.length);
	break;
  }
  if (hero.name === 'MyHero') {
	console.log('Hero: %s, %j',hero.name,game.activeHero);
    //Ask your hero brain which way it wants to move
    direction = heroMoveFunction(game, helpers);
  } else {
    direction = enemyMoveFunction(game, helpers, (hero.id % movementAi.length));
  }
  console.log('-----');
  console.log('Turn ' + i + ':');
  console.log('-----');
  console.log(hero.getCode()+ ' ' +hero.name + ' tried to move ' + direction);
  console.log(hero.name + ' owns ' + hero.mineCount + ' diamond mines')
  console.log(hero.name + ' has ' + hero.health + ' health')
  game.handleHeroTurn(direction);
  game.board.inspect();
  //Make sure you aren't stuck
  lastActiveHero=hero.id;
}
