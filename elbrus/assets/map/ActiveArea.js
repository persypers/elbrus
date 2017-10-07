cc.Class({
    extends: cc.Component,

    properties: {
		handler : cc.Component.EventHandler,
		isTrigger : false,
		icon : cc.SpriteFrame	
    },

	onPlayerEntered : function() {
		if(this.isTrigger) {
			var comp = this.handler.target.getComponent(this.handler.component);
			comp[this.handler.handler].call(comp, this.handler.customEventData);
		}
	}
});
