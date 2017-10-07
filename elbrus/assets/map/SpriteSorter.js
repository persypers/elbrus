var Y_OFFSET = 2000;

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    start: function () {
		var children = this.node.children;
		for(var i =0; i < children.length; i++) {
			var node = children[i];
			node.setLocalZOrder(-node.y + Y_OFFSET)
			node.on('position-changed', this.onPositionChanged, node);
		}
		this.node.on('child-added', function(eventData, child) {
			child.on('position-changed', this.onPositionChanged, node);
		});
		cc._sorter = this;
    },

	onPositionChanged : function() {
		this.setLocalZOrder(-this.y + Y_OFFSET);
	}
});
