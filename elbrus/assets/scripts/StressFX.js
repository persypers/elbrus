var MIN_OPACITY = 32;
var MAX_OPACITY = 96;
var DISTANCE = cc.glitchDistance = 3;

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
		cc.stressFX = this;
	},

	nextAnim : function() {
		console.log('nextAnim!');
		var amp = 1.0 - cc.player.getNormalizedStress();
		var clip = this.anim.getClips().pickRandom();
		clip.sample = Math.floor(Math.random() * 15 + 5);
		this.node.runAction(cc.sequence([
			cc.delayTime(Math.random() * 10 * amp + 1.5 * amp * amp),
			cc.animate(this.anim, clip.name, cc.WrapMode.Normal),
			cc.callFunc(this.nextAnim, this),
		]));
	},

	update: function (dt) {
		//this._dir.x += Math.random() - 0.5;
		//this._dir.y += Math.random() - 0.5;
		this._dir.x = this._dir.x * 0.97 * (1-dt) + (Math.random() - 0.5) * 0.7;
		this._dir.y = this._dir.y * 0.97 * (1-dt) + (Math.random() - 0.5) * 0.7;
		var node1 = this.glitchSprite1.node;
		var node2 = this.glitchSprite2.node;
		var stress = cc.player.getNormalizedStress();
		var amp = this.amplitude * stress;
		var absAmp = Math.abs(amp);
		var norm = this._dir;//.normalize();
		node1.x = norm.x * amp * cc.glitchDistance;
		node1.y = norm.y * amp * cc.glitchDistance;
		node1.opacity = (absAmp > 0) ? cc.lerp(MIN_OPACITY, MAX_OPACITY, stress * stress) : 0;
		node2.x = -norm.x * amp * cc.glitchDistance;
		node2.y = -norm.y * amp * cc.glitchDistance;
		node2.opacity = node1.opacity;
	}
});
