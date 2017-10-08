var player = {
	pages : 0,
    maxPages : 100,
    staleFoodOnKitchen : 1,
    currentIdea : 0,
    ideasUsed : 0,
    ideasMax : 1,
    ideasCrisis : 0,
	stress : 0,
	
	
	
	say : function(msg) {
		cc.playerNode.getComponentInChildren('TextField').say(msg);
	},
};

cc.player = player;

module.exports = player;