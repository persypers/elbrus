cc.Class({
    extends: cc.Component,

    properties: {
		string : {
			default : '',
			multiline : true,
			notify : function() {
				this._stringSet = true;
				if(this.tooltip) {
					this.tooltip.updateString(this);
				}
			}
		},
		skipDelay : false,
		useDark : false,
		useRichText : false,
		fontSize : 18,
		font : cc.Font,
		additionalTargets : {
			default : [],
			type : [cc.Node],
			tooltip : 'Other nodes that will call this tooltip. Useful for nested buttons and such',
		}
    },

	onEnable : function () {
		this.node.on(cc.Node.EventType.MOUSE_ENTER, cc.game.tooltipLayer.show, this);
		this.node.on(cc.Node.EventType.MOUSE_LEAVE, cc.game.tooltipLayer.hide, this);
		for(var i = 0; i < this.additionalTargets.length; i++) {
			var node = this.additionalTargets[i];
			node.on(cc.Node.EventType.MOUSE_ENTER, cc.game.tooltipLayer.show, this);
			node.on(cc.Node.EventType.MOUSE_LEAVE, cc.game.tooltipLayer.hide, this);			
		}
	},

	onDisable : function() {
		this.node.off(cc.Node.EventType.MOUSE_ENTER, cc.game.tooltipLayer.show, this);
		this.node.off(cc.Node.EventType.MOUSE_LEAVE, cc.game.tooltipLayer.hide, this);
		for(var i = 0; i < this.additionalTargets.length; i++) {
			var node = this.additionalTargets[i];
			node.off(cc.Node.EventType.MOUSE_ENTER, cc.game.tooltipLayer.show, this);
			node.off(cc.Node.EventType.MOUSE_LEAVE, cc.game.tooltipLayer.hide, this);
		}
		if(this.tooltip) {
			cc.game.tooltipLayer.hide.call(this);
		}
	}

});
