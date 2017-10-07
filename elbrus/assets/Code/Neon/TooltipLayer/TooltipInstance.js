var minWidth = 48;			// slice9 double corner size
var minHeight = 48;

cc.Class({
    extends: cc.Component,
    
	properties : {
		padding : 30,
		dSize : {
			default : 0,
			type : 'Float',
		// for editor animator:
			notify : CC_EDITOR &&  function(a) {
				this.node.width = cc.lerp(minWidth, this.label.node.width + this.padding * 2, this.dSize);
				this.node.height = cc.lerp(minHeight, this.label.node.height + this.padding * 2, this.dSize);
			}
		},
		anim : cc.Animation,
		label : cc.Label,
	},

	onLoad : function() {
		this._clip = this.anim.defaultClip.name;
		this.anim.on('finished', this.onFinished, this);
	},

	updateString : function(target) {
		var node = this.node;
		if(target != this.target) {
			node.width = minWidth;
			node.height = minHeight;
		}
		this.target = target;
		var tl = cc.game.tooltipLayer;
		var label = this.label;
		label.fontSize = target.fontSize;
		label.font = target.font || tl.defaultFont; 
		label.string = target.string;
		this._clip = target.skipDelay && tl.noDelayClip || tl.defaultClip; 
		var lNode = label.node;
		var w = this._width = lNode.width + this.padding * 2;
		var h = this._height = lNode.height + this.padding * 2;
		lNode.x = (0.5 - node.anchorX) * w;
		lNode.y = (0.5 - node.anchorY) * h;
	// resize self if fade-in fade-out animations are not playing
		if(!this.enabled) {
			this.node.width = this._width;
			this.node.height = this._height;
		}
	},

	onFinished : function() {
		this.enabled = false;
		if(this._fadeOut) {
			cc.game.tooltipLayer.returnToPool(this);
		}
	},

	update : function(dt) {
		this.node.width = cc.lerp(minWidth, this._width, this.dSize);
		this.node.height = cc.lerp(minHeight, this._height, this.dSize);
	},

/**
 * Mostly taken from hoverScript
 */
    show : function() {
		this.node.active = true;
		this.enabled = true;
		var state = this.anim.getAnimationState(this._clip);
        var stateTime = state.duration - state.time;
		state.wrapMode = cc.WrapMode.Normal;
        if(state.isPlaying) {
            if(this._fadeOut) {
                state.time = stateTime;
            }
        } else {
            this.anim.play(this._clip);
        }
        this._fadeOut = false;
    },

	hide : function() {
		this.node.active = true;
		this.enabled = true;
        var state = this.anim.getAnimationState(this._clip);
		var stateTime = state.duration - state.time;
		state.wrapMode = cc.WrapMode.Reverse;
		if(state.isPlaying) {
            if(!this._fadeOut) {
				state.time = stateTime;
            }
        } else {
            state.wrapMode = cc.WrapMode.Reverse;
			this.anim.play(this._clip);
        }
        this._fadeOut = true;
    },


});
