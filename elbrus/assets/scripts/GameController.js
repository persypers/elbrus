var utils = require('Utils');
var player = require('player');
var hunger = require('Hunger');
var fatigue = require('Fatigue');

var MAX_TIME = cc.MAX_TIME = 72 * 60;

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
