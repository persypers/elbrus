var player = require('player');

var ySpeed = 150;
var xSpeed = 200;

var axisControls = {};
axisControls[cc.KEY.up] = {v: new cc.Vec2(0, 1), state : 0};
axisControls[cc.KEY.down] = {v: new cc.Vec2(0, -1), state : 0};
axisControls[cc.KEY.left] = {v: new cc.Vec2(-1, 0), state : 0};
axisControls[cc.KEY.right] = {v: new cc.Vec2(1, 0), state : 0};

cc.Class({
    extends: cc.Component,

    properties: {
		_dir : 1.0,
		anim : cc.Animation,
	},

    // use this for initialization
    onLoad: function () {
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyEvent, this);
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyEvent, this);

		var manager = cc.director.getCollisionManager();
		manager.enabled = true;
		this._obstacles = [];
		cc.playerNode = this.node;
		player.textField = this.getComponentInChildren('TextField');
    },

	onDestroy : function() {
		delete cc.playerNode;
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyEvent);
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyEvent);
	},

	onKeyEvent : function(eventData) {

		var dAxis = axisControls[eventData.keyCode];
		if(dAxis && !(cc.player.isBusy)) {
			dAxis.state = (eventData.type == cc.SystemEvent.EventType.KEY_DOWN) ? 1 : 0;
		} else if(eventData.keyCode == cc.KEY.space) {
			cc.ui.onActivate();
		}
	},

	onCollisionEnter: function (other, self) {
		if(other.node.group == 'obstacle') {
			this._obstacles.push(other);
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
		var isMoving = 0;
		for(var k in axisControls) {
			var ac = axisControls[k];
			if(ac.state != 0) isMoving++;
			dx += ac.v.x * ac.state;
			dy += ac.v.y * ac.state;
		}
		if(dx != 0) {
			this._dir = dx;
			this.anim.node.scaleX = this._dir >= 0 ? 1 : -1;
		}
		if(isMoving) {
			if(! this.anim.getAnimationState(this.anim.defaultClip.name)._isPlaying) this.anim.play();
		} else {
			this.anim.stop();
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
