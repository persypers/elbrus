cc.Class({
    extends: cc.Component,

    properties: {
		playerPrefab : cc.Prefab,
	},

    // use this for initialization
    onLoad: function () {
		utils.changeParentWithPosSaving(this.node, this.node.parent.parent);
		cc.game.addPersistRootNode(this.node);
		cc.controller = this;
    },

	switchScene : function(scene, entryPoint) {

	},

	start : function() {

	}
});
