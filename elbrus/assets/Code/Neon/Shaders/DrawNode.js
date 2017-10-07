/**
 * A node that lets drawing onto itself using another spriteframe as a stroke
 */

cc.Class({
    extends: cc.Component,

    properties: {
		sprite : cc.Sprite, 
		stroke : cc.SpriteFrame,
		alpha : 0.1
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
			this._texture._htmlElementObj = this._canvas;

			this.updateTextureGL();
		} else if(cc._renderType == cc.game.RENDER_TYPE_CANVAS) {
			this._texture.initWithElement(canvas);
		}
		this.spriteFrame = new cc.SpriteFrame(this._texture);

		if(this.sprite) {
			this.sprite.spriteFrame = this.spriteFrame;
		}
	},

	onEnable : function() {
		var nodeSize = this.node.getContentSize();
		var canvas = this._canvas;
		if( ! (canvas && canvas.width == nodeSize.width && canvas.height == nodeSize.height) ) {
			this._init();
		}
	},

	onLoad : function() {
		this.node.on('size-changed', this.onSizeChanged, this);

		this.node.on(cc.Node.EventType.MOUSE_DOWN, function() {
			this.isDrawing = true;
		}, this);

		this.node.on(cc.Node.EventType.MOUSE_UP, function() {
			this.isDrawing = false;
		}, this)

		this.node.on(cc.Node.EventType.MOUSE_MOVE, function(event) {
			this._drawX = event._x;
			this._drawY = event._y;
		}, this)
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
		if(this.enabled) {
			this._init();
		}
	},

	update : function(dt) {
		if(this.isDrawing) {
			this.draw(this._drawX, this._drawY);
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

	draw : function(cx, cy) {
		var rect = this.stroke.getRect();
		
		var p = new cc.Vec2(cx, cy);
		var worldToNode = cc.affineTransformInvert(this.node.getNodeToWorldTransform());
		var nodePoint = cc.pointApplyAffineTransform(p, worldToNode);
		
		var ctx = this._ctx;
		ctx.globalAlpha = this.alpha;
		ctx.drawImage(
			this.stroke.getTexture().getHtmlElementObj(),
			rect.x, rect.y, rect.width, rect.height,
			nodePoint.x - (rect.width - rect.x) * 0.5, this._canvas.height - nodePoint.y - (rect.height - rect.y) * 0.5, rect.width, rect.height
		);
		if(cc._renderType == cc.game.RENDER_TYPE_WEBGL) {
			this.updateTextureGL();
		}
		this.node.setNodeDirty();
		this.node.emit('drawnode-draw');
	}

});
