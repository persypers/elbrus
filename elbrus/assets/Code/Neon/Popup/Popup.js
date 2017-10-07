var utils = require('Utils');

cc.Class({
    extends: cc.Component,

    properties: {
    },

	onLoad : function() {
		utils.trapMouseEvents(this.node);
	},

    play : function(onDone) {
		this.node.active = true;
		this.node.emit('popup-opening');
		this.onDone = onDone;
		var seq = [];
		seq.push(cc.animate(this.node, null, cc.WrapMode.Normal));
		seq.push(cc.callFuncAsync(function (action) {
			this.waitAction = action;
			this.node.emit('popup-open');
		}, this));
		seq.push(cc.callFunc(function() {
			this.node.emit('popup-closing');
		}, this));
		if(this.quest) {
			seq.push(cc.spawn(
				cc.animate(this.node, null, cc.WrapMode.Reverse),
				require('Profile').confirmAction(this.quest)
			));
		} else {
			seq.push(cc.animate(this.node, null, cc.WrapMode.Reverse));
		}
		seq.push(cc.callFunc(function () {
			this.node.emit('popup-closed');
			this.node.active = false;
			if (typeof(this.onDone) == "function") {
				this.onDone();
			}
		}, this));
		this.node.runAction(cc.sequence(seq));
    },

    close : function() {
        if(this.waitAction) {
            this.waitAction.complete();
            delete this.waitAction;
        }
    }

});