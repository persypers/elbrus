var FATIGUE_NONE = 12 * 60;
var FATIGUE_TIRED = 18 * 60;
var FATIGUE_DEPRIVED = 24 * 60;

var phrases = {
	changed : [
		/*"Вы как следует выспались и теперь полны энергии",
		"Вас начинает клонить в сон",
		"Вы еле держитесь на ногах",*/
		"You awake vigorous and ready for great things",
		"You feel sleepy",
		"You're so tired you can barely stand",
	],
	// рандомные фразы информирующие о лёгком голоде
	tired : [
		/*'Вам хочется присесть, а лучше - прилечь',
		"Вы начинаете клевать носом",
		"*смачный зевок*",
		"Вы зеваете",*/
		"You want to sit... to lie down",
		"You feel sleepy",
		"*YAAWN*",
		"You yawn",
	],
	// рандомные фразы информирующие о сильном голоде
	deprived : [
		/*"Ваши глаза ужасно слипаются",
		"Вы еле держитесь на ногах",
		"Ещё чуть-чуть и вы вырубитесь прямо на ходу",*/
		"You're so tired you can barely stand",
		"You can't go any further you need to lie down, for a moment",
		"You're REALLY tired",
	]
}

var nextEvent;

var states = [
	{
		maxHunger : FATIGUE_NONE,
		onEvent : {
			handler : ()=>{
				cc.player.say(phrases.changed[0]);
				nextEvent = null;
			}
		}
	},
	{
		maxHunger : FATIGUE_TIRED,
		onEvent : {
			handler : ()=>{
				cc.player.say(phrases.changed[1]);
				nextEvent = null;
			}
		},
		randomEvent : {
			time : () => 90 + Math.random() * 90,
			handler : () => {
				cc.player.say(phrases.tired.pickRandom());
				nextEvent = null;
			}
		}
	},

	{
		maxHunger : FATIGUE_DEPRIVED,
		onEvent : {
			handler : ()=>{
				cc.player.say(phrases.changed[2]);
				nextEvent = null;
			}
		},
		randomEvent : {
			time : () => 90 + Math.random() * 90,
			handler : () => {
				cc.player.say(phrases.deprived.pickRandom());
				nextEvent = null;
			}
		}
	},
]

module.exports = {
	value : 0,
	state : 0,
	update : function(dt) {
		this.value += dt;
		var _prevState = this.state;
		for(var i = 0; i < states.length - 1 && this.value >= states[i].maxHunger; i++);
		if(_prevState != i) {
			if(nextEvent) {
				cc.eventLoop.cancel(nextEvent);
			}
			nextEvent = {
				time : 0,
				handler : states[i].onEvent.handler,
			}
			cc.eventLoop.push(nextEvent);
		} else if(!nextEvent && states[i].randomEvent) {
			nextEvent = {
				time : states[i].randomEvent.time,
				handler : states[i].randomEvent.handler,
			}
			cc.eventLoop.push(nextEvent);
		}
		this.state = i;
	},

	sleep8 : function() {
		var fatigue = cc.player.fatigue.value;
		var sleepOver = Math.max(0, fatigue - FATIGUE_NONE) / (FATIGUE_DEPRIVED - FATIGUE_NONE);
		console.log('sleepover linear chance:', sleepOver, sleepOver*sleepOver)
		sleepOver = sleepOver * sleepOver;
		cc.player.stress *= 0.2;
		if(Math.random() < sleepOver) {
			cc.eventLoop.time += (fatigue >= FATIGUE_TIRED ? 15 : 12) * 60;
			cc.player.fatigue.value = 0;
			cc.player.stress += 60;
			//return ('Вы проспали!');
			return ("You've overslept!");
		} else {
			cc.eventLoop.time += 8 * 60;
			cc.player.fatigue.value = 0;
		}
	},

	sleep4 : function() {
		var fatigue = cc.player.fatigue.value;
		var sleepOver = Math.max(0, fatigue - FATIGUE_NONE) / (FATIGUE_DEPRIVED - FATIGUE_NONE);
		console.log('sleepover linear chance:', sleepOver, sleepOver*sleepOver)
		cc.player.stress *= 0.4;
		if(Math.random() < sleepOver) {
			cc.eventLoop.time += (fatigue >= FATIGUE_TIRED ? 16 : 12) * 60;
			cc.player.fatigue.value = 0;
			cc.player.stress += 90;
			//return ('Вы проспали!');
			return ("You've overslept!");
		} else {
			cc.eventLoop.time += 4 * 60;
			cc.player.fatigue.value = Math.max(0, fatigue - 8 * 60);
		}
	}
}