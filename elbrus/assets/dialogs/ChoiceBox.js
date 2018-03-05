cc.Class({
    extends: cc.Component,

    properties: {
		labelTemplate : cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

	play: function(topics, callback) {
		this.node.active = true;
		var anim = this.getComponent(cc.Animation);
		anim.getAnimationState(anim.defaultClip.name).sample();
		this.node.runAction(cc.animate(anim, null, cc.WrapMode.Normal));
		this._allowSelect = true;
		//seq.push(cc.animate(anim));
		for(var i = 0; i < topics.length; i++) {
			var t = topics[i];
			var node = cc.instantiate(this.labelTemplate);
			node.parent = this.labelTemplate.parent;
			node._label = node.getComponent(cc.Label);
			var text = t['text_' + cc.locale] || t;
			text = cc.player.garble(text);
			node._label.string = text;
			node.active = true;
			node.topic = t;
			node.on(cc.Node.EventType.TOUCH_START, this.onMouseDown, this);
			node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseOver, this);
			node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
		}
		this.callback = callback;
	},

	onMouseOver : function(eventData) {
		var node = eventData.target;
		if(this._selected != node && this._allowSelect) {
			this._selected = node;
			node.color = cc.Color.WHITE;
			node.getComponent(cc.LabelOutline);
		}
	},
	
	onMouseLeave : function(eventData) {
		var node = eventData.target;
		if(this._selected == node) {
			this._selected = null;
			node.color = cc.Color.BLACK;
			node.getComponent(cc.LabelOutline).active = false;
		}
	},

	onMouseDown : function(eventData) {
		var node = eventData.target;
		this._allowSelect = false;
		this.onMouseLeave(eventData);
		this.callback(node.topic);
		var seq = [];
		var anim = this.getComponent(cc.Animation);
		seq.push(cc.animate(anim, null, cc.WrapMode.Reverse));
		seq.push(cc.callFunc(() => {
			this.labelTemplate.parent.children.forEach((n) => {
				if(n != this.labelTemplate) {
					n.destroy();
				}
			});
			this.node.active = false;
		}));
		this.node.runAction(cc.sequence(seq));
	},
});
