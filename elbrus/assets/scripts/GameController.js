var utils = require('Utils');
var player = require('player');
var hunger = require('Hunger');
var fatigue = require('Fatigue');

var MAX_TIME = cc.MAX_TIME = 72 * 60;
var BLACKOUT_TIME = 60 * (24 +3);

cc.Class({
    extends: cc.Component,

    properties: {
		playerPrefab : cc.Prefab,
		sceneRoot : cc.Node,
		fader : cc.Animation,
		debug_scene : '',
		debug_entry : '',
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
				if(cc.scene) cc.scene.node.destroy();
				cc.director.loadScene(scene, ()=> {
					if(entryPoint) {
						var player = cc.instantiate(this.playerPrefab);
						var entry = cc.find(entryPoint, cc.scene.node);
						player.parent = entry;
						player.x = 0;
						player.y = 0;
						utils.changeParentWithPosSaving(player, cc.scene.node);
						utils.changeParentWithPosSaving(cc.scene.node, this.sceneRoot);
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

		cc.eventLoop.push({time : MAX_TIME, handler : ()=>{
			cc.eventLoop.enabled = false;
			cc.controller.switchScene('end_screen')
		}});

		cc.eventLoop.push({time : BLACKOUT_TIME, handler : ()=>{
			cc.player.blackOut = true;
			if(cc.scene.node.name == 'room_back') {
				cc.scene.isDark = true;
				//cc.player.say('Ой! Может пробки выбило?');
				cc.player.say('Oi! The power just went out!');
			}
		}});

		cc.systemEvent.on('tick', function(eventData, customData){
			var dt = cc.eventLoop.dt;

			player.stress += dt;

			if(player.stress < 0) player.stress = 0;

			hunger.update(dt);
			fatigue.update(dt);
		});

		if(this.debug_scene.length > 0) {
			this.switchScene(this.debug_scene, this.debug_entry, ()=>{
				player.isBusy = false;
			});				
		}
	},

	onStart : function() {
		this.switchScene('room_basic', 'bed/entry', ()=>{
			player.isBusy = false;
		});
	}
});

var annoyMsg = [
	{
		//text : "Лол! Пора писать диплом! Пропущено 230 дней назад.",
		text : "LOL! Time to write grad paper! Delayer 230 days ago.",
		time : 5, //первые секунды игры
	},
	{
		//text : "Лол! Пора писать диплом!",
		text : "LOL! Time to write grad paper!",
		time : 24 * 60, //+ сутки
	},
	{
		//text : "Лол! Пора писать диплом!",
		text : "LOL! Time to write grad paper!",
		time : 48 * 60, //+ 2ое суток
	},
	{
		//text : "Напоминаем вам о задолжености по услуге Обещаный платеж... ",
		text : "Your delayed payment service hasn't been reactivated for... ",
		time : 30 * 60, // на второй день
		//sender : "ПРОвайдер",
		sender : "InterPRO",
	},
	{
		//text : "Занесите, пожалуйста, учебники. Они висят на вас уже больше...",
		text : "Please return your overdue books, it's been over...",
		time : 27 * 60, // на второй день
		//sender : "Клавдия Ильинична",
		sender : "Claudia Yleenichneua",
	},
	
]
