/**
 * A node that lets drawing onto itself using another spriteframe as a stroke
 */

cc.Class({
    extends: cc.Component,

    properties: {
		targetSprite : cc.Sprite, 
		maskSprite : cc.Sprite
	},

	
	_init : function() {
		if(this.spriteFrame) {
			this.spriteFrame.destroy();
		}
		if(this._texture) {
			this._texture.destroy();
		}
		var nodeSize = this.node.getContentSize();
		var canvas = document.createElement('canvas');
		canvas.width = nodeSize.width;
		canvas.height = nodeSize.height;
		var ctx = canvas.getContext('2d');
		this._canvas = canvas;
		this._ctx = ctx;
	
		this._texture = new cc.Texture2D();
		if(cc._renderType == cc.game.RENDER_TYPE_WEBGL) {
		
			var w = this._canvas.width;
			var h = this._canvas.height;
			var pd = this._ctx.getImageData(0, 0, w, h);
			var data = new Uint8Array(pd.data)
			this._texture.initWithData(data, cc.Texture2D.PIXEL_FORMAT_RGBA8888, w, h, new cc.Size(w, h));
		} else if(cc._renderType == cc.game.RENDER_TYPE_CANVAS) {
			this._texture.initWithElement(canvas);
		}
		this.spriteFrame = new cc.SpriteFrame(this._texture);

		this.mixSprites();
	},

	onEnable : function() {
		this.onSpriteChanged();
		this.node.on('position-changed', this.mixSprites, this);
		this.maskSprite.node.on('position-changed', this.mixSprites, this);
	},

	onDisable : function() {
		this.node.off('position-changed', this.mixSprites, this);
		this.maskSprite.node.off('position-changed', this.mixSprites, this);
		if(this.targetSprite) {
			this.targetSprite.spriteFrame = this._normalSprite;
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
		this.onSpriteChanged();
	},

	onSpriteChanged : function() {
		if(! this.enabled) {
			return;
		}
		var nodeSize = this.node.getContentSize();
		var canvas = this._canvas;
		if( ! (canvas && canvas.width == nodeSize.width && canvas.height == nodeSize.height) ) {
			this._init();
		} else if(this.spriteFrame != (this.targetSprite && this.targetSprite.spriteFrame)) {
			this.mixSprites();
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

	mixSprites : function() {
		var mask = this.maskSprite && this.maskSprite.spriteFrame;
		if(this.targetSprite && this.targetSprite.spriteFrame != this.spriteFrame) {
			this._normalSprite = this.targetSprite && this.targetSprite.spriteFrame;
		}
		if(!mask || !this._normalSprite) {
			return;
		}
		var worldToNode = cc.affineTransformInvert(this.node.getNodeToWorldTransform());
		var maskToWorld = this.maskSprite.node.getNodeToWorldTransform();

		var mask = this.maskSprite.spriteFrame;
		var rect = mask.getRect();
		var maskRect = cc.rectApplyAffineTransform(new cc.Rect(0,0, this.maskSprite.node.width, this.maskSprite.node.height), maskToWorld);
		maskRect = cc.rectApplyAffineTransform(maskRect, worldToNode);

		var ctx = this._ctx;
		ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		ctx.globalCompositeOperation = 'source-over';
		if(mask.isRotated()) {
			ctx.rotate(Math.PI * -0.5);
			ctx.drawImage(
				mask.getTexture().getHtmlElementObj(),
				rect.x, rect.y, rect.height, rect.width,		// mask original sprite rect
				maskRect.y - this._canvas.height, maskRect.x, maskRect.height, maskRect.width
			);
			ctx.rotate(Math.PI * 0.5);
		} else {
			ctx.drawImage(
				mask.getTexture().getHtmlElementObj(),
				rect.x, rect.y, rect.width, rect.height,		// mask original sprite rect
				maskRect.x, this._canvas.height - maskRect.y - maskRect.height, maskRect.width, maskRect.height		// rect on target sprite
			);
		}
			
		ctx.globalCompositeOperation = 'source-in';
		rect = this._normalSprite.getRect();
		if(this._normalSprite.isRotated()){
			ctx.rotate(Math.PI * -0.5);	
			ctx.drawImage(this._normalSprite.getTexture().getHtmlElementObj(),
				rect.x, rect.y, rect.height, rect.width,
				-rect.height, 0, rect.height, rect.width
			);
			ctx.rotate(Math.PI * 0.5);
		}
		else {
			ctx.drawImage(this._normalSprite.getTexture().getHtmlElementObj(),
				rect.x, rect.y, rect.width, rect.height,
				0, 0, rect.width, rect.height
			);
		}

		if(this.targetSprite) {
			this.targetSprite.spriteFrame = this.spriteFrame;
		}

		if(cc._renderType == cc.game.RENDER_TYPE_WEBGL) {
			this.updateTextureGL();
		}
		this.node.setNodeDirty();
	}

});
