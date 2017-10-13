var MAX_OPACITY = 128;
var DISTANCE = cc.glitchDistance = 40;

cc.Class({
    extends: cc.Component,

    properties: {
		renderTexture : require('RenderTarget'),
		glitchSprite1 : cc.Sprite,
		glitchSprite2 : cc.Sprite,
		anim : cc.Animation,
		amplitude : 0.0,
	},

    // use this for initialization
    onLoad: function () {
		//cc.systemEvent.on('tick', ()=>{this.shader.strength = cc.player.getNormalizedStress()});
		this._dir = new cc.Vec2();
    },

	start : function() {
		this.glitchSprite1.spriteFrame = this.renderTexture.spriteFrame;
		this.glitchSprite2.spriteFrame = this.renderTexture.spriteFrame;
		this.nextAnim();
	},

	nextAnim : function() {
		console.log('nextAnim!');
		var amp = 1.0 - cc.player.getNormalizedStress();
		var clip = this.anim.getClips().pickRandom();
		clip.sample = Math.floor(Math.random() * 30 + 45);
		this.node.runAction(cc.sequence([
			cc.delayTime(Math.random() * 10 * (amp + 1) + 2 * amp  + 1),
			cc.animate(this.anim, clip.name, cc.WrapMode.Normal),
			cc.callFunc(this.nextAnim, this),
		]));
	},

	update: function (dt) {
		this._dir.x += Math.random() - 0.5;
		this._dir.y += Math.random() - 0.5;
		var node1 = this.glitchSprite1.node;
		var node2 = this.glitchSprite2.node;
		var amp = this.amplitude * cc.player.getNormalizedStress();
		var absAmp = Math.abs(amp);
		var norm = this._dir.normalize();
		node1.x = norm.x * amp * cc.glitchDistance;
		node1.y = norm.y * amp * cc.glitchDistance;
		node1.opacity = amp * MAX_OPACITY;
		node2.x = -norm.x * amp * cc.glitchDistance;
		node2.y = -norm.y * amp * cc.glitchDistance;
		node2.opacity = amp * MAX_OPACITY;

	}
});
