cc.Class({
    extends: cc.Component,

    properties: {
			script : '',
			dialog : '',
			handler : cc.Component.EventHandler,
			highlight : require('HoverScript'),
			actionText :'Поговорить',
		},

	onCollisionEnter : function() {
		if(this.highlight) {
			this.highlight.fadeIn();
		}
		cc.ui.addActiveArea(this);
	},

	activate : function() {
		if(this.script) {
			cc.scene[this.script]();
		} else if(this.dialog) {
			cc.director.getScene().getComponentInChildren('DlgController').playDialog(this.dialog);
		} else if(this.handler) {
			var comp = this.handler.target.getComponent(this.handler.component);
			comp[this.handler.handler].call(comp, this.handler.customEventData);
		}
},
	
	onCollisionExit : function() {
		if(this.highlight) {
			this.highlight.fadeOut();
		}
		cc.ui.removeActiveArea(this);
	}

});
