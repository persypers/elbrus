/**
 * A node for scratch-away layers (or reversed)
 */

var CHECK_PROGRESS_CD = 0.5;

cc.Class({
    extends: cc.Component,

    properties: {
		dirt : {
			default : null,
			type : cc.Sprite,
			tooltip : 'Sprite that gets scratched away (or painted on). It should be on the same node as this script'
		},
		stroke : {
			default : null,
			type : cc.SpriteFrame,
			tooltip : 'Spriteframe that is used as brush mask for scratching'
		},
		strokeAlpha : 0.3,
		strokeScale : new cc.Size(1, 1),
		invertMask : {
			default : false,
			tooltip : 'Set to true if dirt layer should be painted instead of scratching'
		}
	},

	
	_init : function() {
		if(this.spriteFrame) {
			this.spriteFrame.destroy();
		}
		if(this._texture) {
			this._texture.destroy();
		}
		var nodeSize = this.node.getContentSize();
	// create canvas for final spriteFrame
		var canvas = document.createElement('canvas');
		canvas.width = nodeSize.width;
		canvas.height = nodeSize.height;
		this._canvas = canvas;
	
	// Create canvas for mask layer
		canvas = document.createElement('canvas');
		canvas.width = nodeSize.width;
		canvas.height = nodeSize.height;
		this._maskCanvas = canvas;
	
		this._texture = new cc.Texture2D();
		if(cc._renderType == cc.game.RENDER_TYPE_WEBGL) {
			var w = this._canvas.width;
			var h = this._canvas.height;
			var pd = this._canvas.getContext('2d').getImageData(0, 0, w, h);
			var data = new Uint8Array(pd.data)
			this._texture.initWithData(data, cc.Texture2D.PIXEL_FORMAT_RGBA8888, w, h, new cc.Size(w, h));
		} else if(cc._renderType == cc.game.RENDER_TYPE_CANVAS) {
			this._texture.initWithElement(this._canvas);
		}
		this.spriteFrame = new cc.SpriteFrame(this._texture);

		this.mixSprites();
		if(this.dirt) {
			this.dirt.spriteFrame = this.spriteFrame;
		}
	},

	onEnable : function() {
		if(this.dirt) {
			this._normalSprite = this.dirt.spriteFrame;
		}
		var nodeSize = this.node.getContentSize();
		var canvas = this._canvas;
		if( ! (canvas && canvas.width == nodeSize.width && canvas.height == nodeSize.height) ) {
			this._init();
		} else if(this.dirt) {
			this.dirt.spriteFrame = this.spriteFrame;
		}
	},

	onDisable : function() {
		if(this.dirt) {
			this.dirt.spriteFrame = this._normalSprite;
		}
	},

	onDestroy : function() {
		if(this.spriteFrame) {
			this.spriteFrame.destroy();
		}
		if(this._texture) {
			this._texture.destroy();
		}
	},

	onSizeChanged : function() {
		if(this.dirt) {
			this._normalSprite = this.dirt.spriteFrame;
		}

		if(this.enabled) {
			this._init();
		}
	},

	updateTextureGL : function() {
		var tex = this._texture;
		cc.gl.bindTexture2D(tex);
		if(cc.macro.AUTO_PREMULTIPLIED_ALPHA_FOR_PNG) {
			gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
		}
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._canvas);
	},

	update : function(dt) {
		this._checkProgressCD = Math.max(0, this._checkProgressCD - dt);
	},

	scratch : function(cx, cy, scratchMask, alpha) {
		if(typeof(alpha) != 'number') {
			alpha = 1;
		} 
		scratchMask = scratchMask || this.stroke;
		var rect = scratchMask.getRect();
		
		var p = new cc.Vec2(cx, cy);
		var worldToNode = cc.affineTransformInvert(this.node.getNodeToWorldTransform());
		var nodePoint = cc.pointApplyAffineTransform(p, worldToNode);
		
		var ctx = this._maskCanvas.getContext('2d');
		ctx.globalAlpha = alpha * this.strokeAlpha;
		var dstRect = new cc.Rect();
		dstRect.width = rect.width * this.strokeScale.width;
		dstRect.height = rect.height * this.strokeScale.height;
		dstRect.x = nodePoint.x - dstRect.width * 0.5;
		dstRect.y = this._canvas.height - nodePoint.y - dstRect.height * 0.5 
		ctx.drawImage(
			scratchMask.getTexture().getHtmlElementObj(),
			rect.x, rect.y, rect.width, rect.height,
			dstRect.x, dstRect.y, dstRect.width, dstRect.height
		);
		this.mixSprites();
	},

	mixSprites : function() {
		var ctx = this._canvas.getContext('2d');
		ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		ctx.globalCompositeOperation = 'source-over';
		ctx.drawImage(this._maskCanvas, 0, 0);
		if(this.invertMask) {
			ctx.globalCompositeOperation = 'source-in';
		} else {
			ctx.globalCompositeOperation = 'source-out';
		}
		var rect = this._normalSprite.getRect();
		ctx.drawImage(
			this._normalSprite.getTexture().getHtmlElementObj(),
			rect.x, rect.y, rect.width, rect.height,
			0, 0, this._canvas.width, this._canvas.height
		);

		if(cc._renderType == cc.game.RENDER_TYPE_WEBGL) {
			this.updateTextureGL();
		}
		this.node.setNodeDirty();
	},

	checkProgress : function() {
		if(this._checkProgressCD > 0) {
			return;
		}
		this._checkProgressCD = CHECK_PROGRESS_CD;
		var pd = this._maskCanvas.getContext('2d').getImageData(0, 0, this._canvas.width, this._canvas.height);
		var data = pd.data;
	// check alpha sum for the whole canvas
		var alphaSum = 0;
		var rev255 = 1 / 255;
		for(var i = 3; i < data.length; i += 4) {
			alphaSum += data[i] * rev255;
		}
		return alphaSum / (pd.width * pd.height);
	}

});
