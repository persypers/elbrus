var utils = require('Utils');

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

	switchScene : function(scene, entryPoint) {
		var wait = cc.callFuncAsync(()=>{});
		var seq = [
			cc.animate(this.fader, null, cc.WrapMode.Normal),
			cc.callFunc(function() {
				cc.director.loadScene(scene, ()=> {
					var player = cc.instantiate(this.playerPrefab);
					var entry = cc.find(entryPoint, cc.scene.node);
					player.parent = entry;
					player.x = 0;
					player.y = 0;
					utils.changeParentWithPosSaving(player, cc.scene.node);
					wait.complete();
				});
			}, this),
			wait,
			cc.animate(this.fader, null, cc.WrapMode.Reverse),
		];
		this.node.runAction(cc.sequence(seq));
	},

	start : function() {

	}
});
