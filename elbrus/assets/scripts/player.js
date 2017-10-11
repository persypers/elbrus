var player = {
	hunger : 0,
	_hungerState : 0,
	fatigue : 0,
	_fatigueState : 0,
	stress : 0,

	isBusy : true,

	xSpeed : 200,
	ySpeed : 150,

	pages : 0,
    maxPages : 100,
    staleFoodOnKitchen : 1,
    currentIdea : 0,
    ideasUsed : 0,
    ideasMax : 1,
    ideasCrisis : 0,
	
	phrases : require('PlayerPhrases'),
	
	say : function(msg) {
		cc.playerNode.getComponentInChildren('TextField').say(msg);
	},
};

cc.player = player;

module.exports = player;