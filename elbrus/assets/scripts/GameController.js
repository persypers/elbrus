var utils = require('Utils');
var player = require('player');
var hunger = require('Hunger');
var fatigue = require('Fatigue');

cc.Class({
    extends: cc.Component,

    properties: {
		playerPrefab : cc.Prefab,
		fader : cc.Animation,
	},

    // use this for initialization
    onLoad: function () {
		utils.changeParentWithPosSaving(this.node, this.node.parent.parent);
		cc.game.addPersistRootNode(this.node);
		cc.controller = this;
    },

	switchScene : function(scene, entryPoint, onDone) {
		var wait = cc.callFuncAsync(()=>{});
		var seq = [
			cc.animate(this.fader, null, cc.WrapMode.Normal),
			cc.callFunc(function() {
				cc.director.loadScene(scene, ()=> {
					if(entryPoint) {
						var player = cc.instantiate(this.playerPrefab);
						var entry = cc.find(entryPoint, cc.scene.node);
						player.parent = entry;
						player.x = 0;
						player.y = 0;
						utils.changeParentWithPosSaving(player, cc.scene.node);
					}
					wait.complete();
					if(typeof(onDone) == 'function'){
						onDone();
					}
				});
			}, this),
			wait,
			cc.animate(this.fader, null, cc.WrapMode.Reverse),
		];
		this.node.runAction(cc.sequence(seq));
	},

	start : function() {
		for(var i = 0; i < annoyMsg.length; i++) {
			let msg = annoyMsg[i];
			cc.eventLoop.push({time : msg.time, handler : ()=>{cc.phone.pushMessage(msg)}});
		}

		cc.eventLoop.push({time : 24 * 60 * 3, handler : ()=>{cc.controller.switchScene('end_screen')}});

		cc.systemEvent.on('tick', function(eventData, customData){
			var dt = cc.eventLoop.dt;

			player.hunger += dt;
			player.fatigue += dt;
			player.stress += dt;

			if(player.hunger < 0) player.hunger = 0;
			if(player.fatigue < 0) player.fatigue = 0;
			if(player.stress < 0) player.stress = 0;

			hunger.update();
			fatigue.update();
		});
	},

	onStart : function() {
		this.switchScene('room_basic', 'bed/entry', ()=>{
			player.isBusy = false;
		});
	}
});

var annoyMsg = [
	{
		text : "Лол! Пора писать диплом! Пропущено 230 дней назад.",
		time : 5, //первые секунды игры
	},
	{
		text : "Лол! Пора писать диплом!",
		time : 24 * 60, //+ сутки
	},
	{
		text : "Лол! Пора писать диплом!",
		time : 48 * 60, //+ 2ое суток
	},
	{
		text : "Напоминаем вам о задолжености по услуге Обещаный платеж... ",
		time : 30 * 60, // на второй день
		sender : "ПРОвайдер",
	},
	{
		text : "Занесите, пожалуйста, учебники. Они висят на вас уже больше...",
		time : 27 * 60, // на второй день
		sender : "Клавдия Ильинична",
	},
	
]
