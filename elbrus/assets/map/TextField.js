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
		this._speechQueue = [];
    },

	onDestroy : function() {
		delete cc.textFields[this.node.name];
	},

	say : function(msg) {
		if(this.node.active) {
			this._speechQueue.push(msg);
		} else {
			var text = msg.text && msg.text || msg;
			this.show(text, msg.duration, ()=>{
				var msg = this._speechQueue.shift();
				if(msg) {
					this.say(msg);
				}
			});
		}
	},

	show : function(text, duration, onDone) {
		if(this.node.active) return;
		if(typeof(text) == 'object' && text instanceof cc.Event) {
			text = duration;
			duration = DEFAULT_DURATION;
		}
		if(!duration) {
			duration = DEFAULT_DURATION;
		}
		text = cc.player.garble(text);
		this.label.string = '';
		this.node.opacity = 255;
		this.node.active = true;
		this.node.stopAllActions;
		this.node.runAction(cc.sequence(
			cc.spawn(
				cc.typeAction(this.label, text, 0.02),
				cc.delayTime(duration),
			),
			cc.fadeOut(0.5),
			cc.callFunc(() => {
				this.node.active = false;
				if(typeof(onDone) == 'function') {
					onDone();
				}
			})
		));
	}
});
