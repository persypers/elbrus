var ySpeed = 200;
var xSpeed = 300;

var axisControls = {};
axisControls[cc.KEY.up] = {v: new cc.Vec2(0, 1), state : 0};
axisControls[cc.KEY.down] = {v: new cc.Vec2(0, -1), state : 0};
axisControls[cc.KEY.left] = {v: new cc.Vec2(-1, 0), state : 0};
axisControls[cc.KEY.right] = {v: new cc.Vec2(1, 0), state : 0};

cc.Class({
    extends: cc.Component,

    properties: {

	},

    // use this for initialization
    onLoad: function () {
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyEvent, this);
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyEvent, this);

		var manager = cc.director.getCollisionManager();
		manager.enabled = true;
		this._obstacles = [];
		cc.w = this;
    },

	onDestroy : function() {
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyEvent);
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyEvent);
	},

	onKeyEvent : function(eventData) {
		var dAxis = axisControls[eventData.keyCode];
		if(dAxis) {
			dAxis.state = (eventData.type == cc.SystemEvent.EventType.KEY_DOWN) ? 1 : 0;
		}
	},

	onCollisionEnter: function (other, self) {
		if(other.node.group == 'obstacle') {
			this._obstacles.push(other);
		} else {
			var area = other.getComponent('ActiveArea');
			if(area) {
				area.onPlayerEntered();
			}
		}
	},

	onCollisionExit: function (other, self) {
		if(other.node.group == 'obstacle') {
			var index = this._obstacles.indexOf(other);
			if(index >= 0) {
				this._obstacles.splice(index, 1);
			}
		}
	},

	update: function (dt) {
		var dx = 0;
		var dy = 0;
		for(var k in axisControls) {
			var ac = axisControls[k];
			dx += ac.v.x * ac.state;
			dy += ac.v.y * ac.state;
		}
		dx *= dt * xSpeed;
		dy *= dt * ySpeed;
		if(this._obstacles.length == 0) {
			this._prevX = this.node.x;
			this._prevY = this.node.y;
			this.node.x += dx;
			this.node.y += dy;
		} else {
			this.node.x = this._prevX;
			this.node.y = this._prevY;
		}
    },

	lateUpdate : function() {
		if(this._obstacles.length > 0) {
			this.node.x = this._prevX;
			this.node.y = this._prevY;			
		}
	}

});
