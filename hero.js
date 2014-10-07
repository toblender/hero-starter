/* 

  The only function that is required in this file is the "move" function

  You MUST export the move function, in order for your code to run
  So, at the bottom of this code, keep the line that says:

  module.exports = move;

  The "move" function must return "North", "South", "East", "West", or "Stay"
  (Anything else will be interpreted by the game as "Stay")
  
  The "move" function should accept two arguments that the website will be passing in: 
    - a "gameData" object which holds all information about the current state
      of the battle

    - a "helpers" object, which contains useful helper functions
      - check out the helpers.js file to see what is available to you

    (the details of these objects can be found on javascriptbattle.com/rules)

  This file contains four example heroes that you can use as is, adapt, or
  take ideas from and implement your own version. Simply uncomment your desired
  hero and see what happens in tomorrow's battle!

  Such is the power of Javascript!!!

*/

//TL;DR: If you are new, just uncomment the 'move' function that you think sounds like fun!
//       (and comment out all the other move functions)


// // The "Northerner"
// // This hero will walk North.  Always.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   return 'North';
// };

// // The "Blind Man"
// // This hero will walk in a random direction each turn.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   var choices = ['North', 'South', 'East', 'West'];
//   return choices[Math.floor(Math.random()*4)];
// };

// // The "Priest"
// // This hero will heal nearby friendly champions.


//Paladin, look for someone to attack, then go heal, and heal friends


var dealWithEnemy = function(myHero,enemyInfo,wellInfo){
	if(enemyInfo){

		if(enemyInfo.distance <= 2){
			//Always fight and die with honor
			return enemyInfo.direction;
		}else if (enemyInfo.distance === 3 && myHero.health === 100){
			return;
			//Do nothing, wait for them to come.
		}else if(enemyInfo.distance > 3 && myHero.health === 100){
			return enemyInfo.direction;
		}else if(enemyInfo.direction > 3 && myHero.health < 100){
			//Health up then go fight
			return wellInfo.direction;
		}

	}else{
		return enemyInfo;
	}
}

var dealWithHealth = function(myHero,wellInfo){
	//If there isn't anyone left to kill
	if(myHero.health < 100){
		return wellInfo.direction;
	}else{
		return false;
	}
}

//Take advantage of move in attack, stay still until person enters your area
var move = function(gameData, helpers) {
	var myHero = gameData.activeHero;
    console.log('Enemy info: %j',helpers.findNearestEnemyInfo(gameData));
    console.log('Team info: %j',helpers.findNearestTeamMemberInfo(gameData));
    console.log('Well info: %j',helpers.findNearestHealthWellInfo(gameData));
	console.log('Hero info: %j',myHero);

	//if enemy is 2 cells away and health === 100, wait
	//if enemy is 1 cell away, move into enemy
	//if enemy is more than 2 cells away and health === 100 move towards enemy
	//if enemy is more than 2 cells away and health < 100 move towards health

	var enemyInfo = helpers.findNearestEnemyInfo(gameData);
	var wellInfo = helpers.findNearestHealthWellInfo(gameData);
	var teamInfo = helpers.findNearestTeamMemberInfo(gameData);

	var dealWithEnemyResult = dealWithEnemy(myHero,enemyInfo,wellInfo);
	var dealWithHealthResult = dealWithHealth(myHero,wellInfo);
	if(dealWithEnemyResult){
		console.log('Dealing with enemy:%j',dealWithEnemyResult);
		return dealWithEnemyResult;
	}else if(dealWithHealthResult){
		console.log('Move to health:%j',dealWithHealthResult);
		return dealWithHealthResult;
	}else{
		console.log('Move to team:%j',teamInfo);
		//Safty in numbers
		return teamInfo.direction;
	}
	
};

// // The "Unwise Assassin"
// // This hero will attempt to kill the closest enemy hero. No matter what.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   if (myHero.health < 30) {
//     return helpers.findNearestHealthWell(gameData);
//   } else {
//     return helpers.findNearestEnemy(gameData);
//   }
// };

// // The "Careful Assassin"
// // This hero will attempt to kill the closest weaker enemy hero.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   if (myHero.health < 50) {
//     return helpers.findNearestHealthWell(gameData);
//   } else {
//     return helpers.findNearestWeakerEnemy(gameData);
//   }
// };

// // The "Safe Diamond Miner"
/*
var move = function(gameData, helpers) {
  var myHero = gameData.activeHero;

  //Get stats on the nearest health well
  var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
    if (boardTile.type === 'HealthWell') {
      return true;
    }
  });
  var distanceToHealthWell = healthWellStats.distance;
  var directionToHealthWell = healthWellStats.direction;
  

  if (myHero.health < 40) {
    //Heal no matter what if low health
    return directionToHealthWell;
  } else if (myHero.health < 100 && distanceToHealthWell === 1) {
    //Heal if you aren't full health and are close to a health well already
    return directionToHealthWell;
  } else {
    //If healthy, go capture a diamond mine!
    return helpers.findNearestNonTeamDiamondMine(gameData);
  }
};
*/
// // The "Selfish Diamond Miner"
// // This hero will attempt to capture diamond mines (even those owned by teammates).
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;

//   //Get stats on the nearest health well
//   var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
//     if (boardTile.type === 'HealthWell') {
//       return true;
//     }
//   });

//   var distanceToHealthWell = healthWellStats.distance;
//   var directionToHealthWell = healthWellStats.direction;

//   if (myHero.health < 40) {
//     //Heal no matter what if low health
//     return directionToHealthWell;
//   } else if (myHero.health < 100 && distanceToHealthWell === 1) {
//     //Heal if you aren't full health and are close to a health well already
//     return directionToHealthWell;
//   } else {
//     //If healthy, go capture a diamond mine!
//     return helpers.findNearestUnownedDiamondMine(gameData);
//   }
// };

// // The "Coward"
// // This hero will try really hard not to die.
// var move = function(gameData, helpers) {
//   return helpers.findNearestHealthWell(gameData);
// }


// Export the move function here
module.exports = move;
