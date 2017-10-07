var KernelShader = require('KernelShader');

/**
 * Init shader for webgl mode
 */
var compileShader = function() {
	// TODO : implement an actual gaussian blur
	var fragShader = `
			#ifdef GL_ES
			precision mediump float;
			#endif
			varying vec2 v_texCoord;
			varying vec4 v_fragmentColor;
			uniform float widthStep;
			uniform float heightStep;
			uniform vec4 maskColor;
			void main()
			{
				vec4 texColor = texture2D(CC_Texture0, v_texCoord);
				gl_FragColor = vec4(mix(texColor.rgb, maskColor.rgb * texColor.a, maskColor.a), texColor.a) * v_fragmentColor;
			}`;

	cc.macro.SHADER_SPRITE_COLORMASK = 'ShaderSpriteColormask';		// ugh
	
	cc.frag = fragShader;

	var program = new cc.GLProgram();
	program.initWithVertexShaderByteArray(cc.PresetShaders.SPRITE_POSITION_TEXTURE_COLOR_VERT, fragShader);
	program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
	program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
	program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
	program.link();
	program.updateUniforms();

	cc.shaderCache.addProgram(program, cc.macro.SHADER_SPRITE_COLORMASK);
	return program;
}

// recompile shader in editor for debug purpose
if(cc._renderType == cc.game.RENDER_TYPE_WEBGL && CC_EDITOR) {
	compileShader();
}
/////////////////////

var rev255 = 1 / 255;

var _prepareColorGL = function(color, array) {
	array = array || [];
	var alpha = array[3] = color.a * rev255;
	var mult = rev255;
	array[0] = color.r * mult;
	array[1] = color.g * mult;
	array[2] = color.b * mult;
}

cc.Class({
    extends: KernelShader,
	
	properties : {
		shaderProgramName : {
			default : cc.macro.SHADER_SPRITE_COLORMASK,
			visible : false
		},

		_color : ['Float'],

		_maskColor : cc.Color.WHITE,
		maskColor : {
			get : function() {
				return this._maskColor;
			},
			set : function(value) {
				this._maskColor = value;
				if(cc._renderType == cc.game.RENDER_TYPE_WEBGL) {
					this._color = this._color || [];
					_prepareColorGL(value, this._color);
				}
			}
		},
		padding : {
			override : true,
			get : function() {return false},
			visible : false,
		},
		strength : {
			override : true,
			get : function() {return 1},
			visible : false,
		}
	},
	
	compileShader : compileShader,

	onEnable : function() {
		KernelShader.prototype.onEnable.call(this);
		if(cc._renderType == cc.game.RENDER_TYPE_WEBGL) {
			this._uniMaskColor = this._program.getUniformLocationForName('maskColor');
			this._color = this._color || [];
			_prepareColorGL(this._maskColor, this._color);
		}
		cc.sh = this;
	},

	updateUniforms : function() {
		if(this._program) {			
			this._program.use();
			this._program.setUniformLocationWith1f( this._uniWidthStep, this._textureStepWidth );
			this._program.setUniformLocationWith1f( this._uniHeightStep, this._textureStepHeight );
			var loc = this._color;
			this._program.setUniformLocationWith4f( this._uniMaskColor, loc[0], loc[1], loc[2], loc[3]);
			this._program.updateUniforms();
		}
	},

	drawFilteredCanvas : function(targetContext, srcImage, srcRect) {
	},

	mixFilteredCanvas : function(targetContext, filteredCanvas, srcImage, srcRect) {
		var padding = this.padding && this.kernelRadius || 0;
		targetContext.globalCompositeOperation = 'source-over';
		targetContext.globalAlpha = 1;
		targetContext.drawImage(srcImage, srcRect.x, srcRect.y, srcRect.width, srcRect.height, padding, padding, srcRect.width, srcRect.height);
		
		targetContext.globalCompositeOperation = 'source-atop';
		targetContext.fillStyle = this._maskColor.toCSS('#rrggbb');
		targetContext.globalAlpha = this._maskColor.a * rev255;
		targetContext.fillRect(0, 0, targetContext.canvas.width, targetContext.canvas.height);
	}

});