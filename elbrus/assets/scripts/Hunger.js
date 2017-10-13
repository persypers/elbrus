var HUNGER_NONE = 6 * 60;
var HUNGER_LOW = 12 * 60;
var HUNGER_STARVE = 24 * 60;

var phrases = {
	hungerChanged : [
		"Вы снова сыты",
		"У вас в животе жалобно урчит",
		"У вас темнеет в глазах от голода",
	],
	// рандомные фразы информирующие о лёгком голоде
	hungerLow : [
		'У вас в животе жалобно урчит',
		"Сейчас бы перекусить чего",
		"Внезапно вам захотелось кукурузных хлопьев с молоком",
		"Неплохо было бы поесть в обозримом будущем",
		"Когда я в последний раз кушал?"
	],
	// рандомные фразы информирующие о сильном голоде
	hungerStarve : [
		"Вам так хочется есть, что вы еле передвигаете ноги",
		"У вас темнеет в глазах от голода",
		"Живот настойчиво урчит, а перед глазами проносятся котлеты",
	]
}

var nextEvent;

var states = [
	{
		maxHunger : HUNGER_NONE,
		onEvent : {
			handler : ()=>{
				cc.player.say(phrases.hungerChanged[0]);
				cc.player.xSpeed = 200;
				cc.player.ySpeed = 150;
				nextEvent = null;
			}
		}
	},
	{
		maxHunger : HUNGER_LOW,
		onEvent : {
			handler : ()=>{
				cc.player.say(phrases.hungerChanged[1]);
				cc.player.xSpeed = 160;
				cc.player.ySpeed = 120;
				nextEvent = null;
			}
		},
		randomEvent : {
			time : () => 90 + Math.random() * 90,
			handler : () => {
				cc.player.say(phrases.hungerLow.pickRandom());
				nextEvent = null;
			}
		}
	},

	{
		maxHunger : HUNGER_STARVE,
		onEvent : {
			handler : ()=>{
				cc.player.say(phrases.hungerChanged[2]);
				cc.player.xSpeed = 133;
				cc.player.ySpeed = 100;
				nextEvent = null;
			}
		},
		randomEvent : {
			time : () => 90 + Math.random() * 90,
			handler : () => {
				cc.player.say(phrases.hungerStarve.pickRandom());
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

	eatFresh : () => {
		cc.player.staleFoodOnKitchen = true;
		cc.player.hunger.value = 0;
		cc.eventLoop.time += 60;
		cc.player.stress *= 0.25;
		return ('Было вкусно.');
	},

	eatStale : () => {
		cc.player.staleFoodOnKitchen = false;
		cc.player.hunger.value = Math.max(0, cc.player.hunger.value - 60 * 10);
		cc.player.stress += 30;
		cc.eventLoop.time += 15;
		return  'Иногда нужно прикоснуться к своему прошлому, чтобы шагнуть в будующее.';
	},
}