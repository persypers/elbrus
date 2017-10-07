var DEFAULT_DURATION = 3;

cc.textFields = {};

cc.Class({
    extends: cc.Component,

    properties: {
		label : cc.Label,
    },

    // use this for initialization
    onLoad: function () {
		if(!this.label) {
			this.label = this.getComponent(cc.Label);
		}
		cc.textFields[this.node.name] = this;
    },

	onDestroy : function() {
		delete cc.textFields[this.node.name];
	},

	show : function(text, duration) {
		if(this.node.active) return;
		if(typeof(text) == 'object' && text instanceof cc.Event) {
			text = duration;
			duration = DEFAULT_DURATION;
		}
		if(!duration) {
			duration = DEFAULT_DURATION;
		}
		this.label.string = '';
		this.node.active = true;
		this.node.stopAllActions;
		this.node.runAction(cc.sequence(
			cc.spawn(
				cc.typeAction(this.label, text, 0.02),
				cc.delayTime(duration),
			),
			cc.callFunc(() => {
				this.node.active = false;
			})
		));
	}
});
