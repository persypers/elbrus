var ideas = {
	genericIntro : {
		collected : true,
		converted : false,
		pages : 8,
		topicText : 'Outline an introduction describing today’s global energy problem.',
		replyText : "You’ve done a good job at descending from general ideas to specific issues - the subject of your paper. The text will definitely get the attention of a curious reader.",
		collectText : 'You’ve got an idea on how to turn your general knowledge on the subject into a several-page introduction to the diploma.',
	},
	
	consumerismBody : {
		collected : false,
		converted : false,
		pages : 17,
		topicText : 'Point out the problem of inefficient energy use in the so called “consumerist society”.',
		replyText : "You manage to elaborate on your idea and refer to the influence of socio-economic factors on the development of energy industry. Nothing sensational, but the idea is quite solid.",
		collectText : 'Realization of how impractical some socially accepted decisions about energy use are, makes you want to create a positive image of renewable resources in your paper.',
	},
	
	examplesBody : {
		collected : false,
		converted : false,
		pages : 9,
		topicText : 'Relate to the positive experience of other countries.',
		replyText : "Having listed several examples of the countries that switched to next-generation energy use, you reveal some important trends.",
		collectText : "The phrase “What about others?...” echoes in your brain. It seems reasonable to refer to the economic experience of other countries.",
	},
	
	// График роста и изменений
	statsBody : {
		collected : false,
		converted : false,
		pages : 7,
		topicText : 'Study the statistical data from the past 50 years and enclose some published estimates and predictions.',
		replyText: "Your paper can now boast some impressive diagrams. Thanks to bright-colored templates, your document is now looking more optimistic. But not you.",
		collectText : 'Suddenly, a well-composed diagram appears before your eyes. You don’t realize why, but the word STATISTICS is now making you feel very good.',
	},
	
	//Экологическая сторона
	ecologyProblem : {
		collected : false,
		converted : false,
		pages : 16,
		topicText : 'Provoke the reader depicting in living color a possible ecological catastrophe.',
		replyText : "In a bit unscientific and unexpectedly artistic manner you describe the cheerless future that probably awaits us. “Fallout”-style cliches seem redundant, but you can’t resist the temptation to throw them in.",
		collectText : 'You find yourself envisioning the world of tomorrow. The huge bleak swamp that you see impresses you deeply. You really want to share this realistic and captivating image with the reader.',
	},
	
	//Заинтересованность потребителей
	consumerPlan : {
		collected : false,
		converted : false,
		pages : 8,
		topicText: 'Speculate on the topic of how much consumers should be interested in renewable energy sources.',
		replyText : "In a passionate manner of a typical politician you encourage the reader to use the newest, safest, most innovative...what do you call them?...Ah, whatever.",
		collectText : 'Little by little, you start realizing how ignorant you’ve been of the world around you. Refusing to take the sole responsibility for such ignorance, you start wondering why someone didn’t point this out to you earlier.',
	},
	
	//Заинтересованность производителей
	producerPlan : {
		collected : false,
		converted : false,
		pages : 11,
		topicText : 'Enumerate several benefits of renewable energy sources for manufacturers.',
		replyText : "The text you’ve written looks more like an advertising material. You envision the cunning eyes of a typical factory manager.",
		collectText : 'People’s stubbornness and greediness suddenly make you burst in righteous anger. Eventually you calm down and start looking for the ways to convince them to change their minds.',
	},
	
	//Заинтересованность смежных отраслей
	neighborPlan : {
		collected : false,
		converted : false,
		pages : 10,
		topicText : 'Point out that the image associated with “environmental friendliness” needs to be rethought and modernized.',
		replyText : "Optimus Prime using solar batteries. Oil rig worker as an archetypal James Bond villain...You suppress the flow of unnecessary pop-culture images and finally touch upon the topic of correct presentation of eco-friendly fuel to the public.",
		collectText : 'You’re trying to view yourself from the outside. Having looked enough at the unlucky creature you are, you realize that a lot could be changed in the public opinion if you make people look at the problem from a different angle.',
	},
	
	//Государственное регулирование
	govControl : {
		collected : false,
		converted : false,
		pages : 5,
		topicText : 'Enumerate the profits of using the renewable resources for the government. Отметить приоритеты государства в вопросе возобновляемых ресурсов.',
		replyText : "You describe several ways of regulating the industry. Swallowing your liberal pride, you even lay down a system of obligatory modernization of factories.",
		collectText : 'Suddenly, it feels like a horrible dystopia. But thinking it over and imagining the alternatives, you decide it’s not that much horrible.',
	},
	
	// Предсказание
	futurePrediction : {
		collected : false,
		converted : false,
		pages : 6,
		topicText : 'Quote the futurologists who discussed the possible ways of developing the energy industry.',
		replyText : "Pictures of the bright future painted by these pseudo-scientists make your text sound more optimistic. Maybe you shouldn’t have added this part, but some readers might like it.",
		collectText : 'You start thinking about your own future. For you, it’s too late to make things right. But humanity, maybe, still has some time. Maybe...',
	}	
};

var _array = [];
for(var k in ideas) {
	_array.push(ideas[k]);
	//ideas[k].collected = true;
}

// shuffle and add idle collect times
for(var i = 0; i < _array.length; i++) {
	var idea = _array[i];
	var swapIndex = Math.floor(Math.random() * _array.length);
	_array[i] = _array[swapIndex];
	_array[swapIndex] = idea;
}
var accum = 0;
for(var i = 0; i < _array.length; i++) {
	accum += Math.random() * 15 + 15 + 60 * (i/_array.length) * (i/_array.length);
	_array[i].idleTime = accum;
}
console.log('All ideas idle time:', accum);

var totalIdleTime = 0;

ideas.think = function(time) {
	cc.eventLoop.time += time;
	totalIdleTime += time;
	for(var i = 0; i < _array.length; i++) {
		var idea = _array[i];
		if(idea.idleTime <= totalIdleTime) {
			if(idea.collected) {
				var prevTime = _array[i-1] ? _array[i-1].idleTime : 0;
				idea._idleTime = idea.idleTime;
				idea.idleTime = 0;
				totalIdleTime += idea.idleTime - prevTime;
			} else {
				console.log('collected Idea:', idea, totalIdleTime);
				idea.collected = true;
				return idea.collectText;
			}
		}
	}
};

ideas.forgetRandom = function() {
	var forget = _array.filter((idea)=> idea.collected && !idea.converted).pickRandom();
	if(forget) {
		forget.collected = false;
	}
	return forget;
};

ideas.collect = function(ideaKey) {
	var idea = ideas[ideaKey];
	if(!idea.collected) {
		idea.collected = true;
		return idea.collectText;
	}
};

module.exports = ideas;