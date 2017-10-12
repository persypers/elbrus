var player = {
	stress : 0,
	hunger : require('Hunger'),
	fatigue : require('Fatigue'),
	isBusy : true,

	xSpeed : 200,
	ySpeed : 150,

	pages : 0,
	blandPages : 0,
    maxPages : 100,
    staleFoodOnKitchen : 1,
    currentIdea : 0,
    ideasUsed : 0,
    ideasMax : 1,
    ideasCrisis : 0,
	
	ideas : require('Ideas'),

	phrases : require('PlayerPhrases'),
	
	say : function(msg) {
		cc.playerNode.getComponentInChildren('TextField').say(msg);
	},
};

cc.player = player;

module.exports = player;