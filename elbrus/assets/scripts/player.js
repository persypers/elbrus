var MAX_STRESS = 60 * 40;

var player = {
	_stress : 0,
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
	
	getNormalizedStress : function() {
		return Math.min(this._stress / MAX_STRESS, 1);
	},

	garble : function(text) {
		var stress = this.getNormalizedStress();
		stress = Math.max(0, stress - 0.5) * 2;
		stress = stress * stress * 0.5;
		var words = text.match(/[a-zа-я]{4,}/ig);
		var index = -1;
		var prevIndex = 0;
		var result = '';
		for(var wordNum = 0; wordNum < words.length; wordNum++) {
			var word = words[wordNum];
			var wordLength = word.length;
			index = text.indexOf(word, index + 1);
			result += text.substr(prevIndex, index - prevIndex);
			var indices = [];
			for(var i = 0; i < wordLength; i++) {
				indices[i] = i;
			}
			if(Math.random() < stress) {
				var swapIndex = Math.floor(Math.random() * (wordLength - 2)) + 1;
				var swapIndex2 = Math.floor(Math.random() * (wordLength - 2)) + 1;
				indices[swapIndex] = swapIndex2;
				indices[swapIndex2] = swapIndex;
			}
			for(var i = 0; i < wordLength; i++) {
				result += word[indices[i]];
			}
			prevIndex = index + wordLength;
		}
		result += text.substr(prevIndex, text.length - prevIndex);
		return result;
	}
};

Object.defineProperty(player, 'stress', {
	set : function(value) {
		var delta = value - player._stress;
		var mult = 1;
		if(delta > 0) {
			var timePart = cc.eventLoop.time / cc.MAX_TIME;
			mult += player.hunger.state + player.fatigue.state + timePart * timePart * 3;
		}
		player._stress += delta * mult;
	},
	get : function() {
		return player._stress;
	}
})

cc.player = player;

module.exports = player;