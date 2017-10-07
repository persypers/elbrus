//these platforms support window.FontFace, but it sucks sometimes.
var useFontFace = (cc.sys.browserType !== cc.sys.BROWSER_TYPE_BAIDU
&& cc.sys.browserType !== cc.sys.BROWSER_TYPE_BAIDU_APP
&& cc.sys.browserType !== cc.sys.BROWSER_TYPE_MOBILE_QQ);

var CustomFontDescriptor = function() {
    this._status =  'unloaded';
    //when font is loaded, it will notify each observer in the observers array
    this._observers = [];
};

CustomFontDescriptor.prototype.onLoaded = function () {
    this._status = 'loaded';
    this._observers.forEach(function(item) {
        item();
    });
};

CustomFontDescriptor.prototype.isLoaded = function () {
    return this._status === 'loaded';
};

CustomFontDescriptor.prototype.addHandler = function (callback) {
    if(this._observers.indexOf(callback) === -1) {
        this._observers.push(callback);
    }
};

var CustomFontLoader = {
    _fontCache: {},
    loadTTF: function (url, callback) {
        this._loadWithCSS(url, callback);
    },

    _loadWithCSS: function(url, callback) {
        var fontFamilyName = this.getFontFamily(url);
        var fontDescriptor = this._fontCache[fontFamilyName];
        if(!fontDescriptor) {
            //fall back implementations
            var doc = document;
            var fontStyle = doc.createElement("style");
            fontStyle.type = "text/css";
            doc.body.insertBefore(fontStyle, doc.body.firstChild);

            var urlSpec = '';
            var extras = '';
            if(fontFamilyName.lastIndexOf('bold') !== -1) {
                extras += 'font-weight: bold;';
                urlSpec += ' Bold'
            } else if(fontFamilyName.lastIndexOf('light') !== -1) {
                extras += 'font-weight: lighter;';
                urlSpec += ' Light'
            } else {
                extras += 'font-weight: normal;';
            }

            if(fontFamilyName.lastIndexOf('italic') !== -1) {
                extras += 'font-style: italic;';
                urlSpec += ' Italic'
            }
            else {
                extras += 'font-style: normal;';
            }

            var fontStr = "";
            fontStr += "@font-face {";
            fontStr += "font-family:'" + fontFamilyName + "';";
            fontStr += "src: ";
            fontStr += "local('Calibri" + urlSpec + "'),";
            if(urlSpec != '')  fontStr += "local('Calibri'),";
            fontStr += "url('" + url + "');";
            fontStr += extras;
            fontStr += "}";
            fontStyle.textContent = fontStr;

            fontDescriptor = new CustomFontDescriptor();
            fontDescriptor.addHandler(callback);
            this._fontCache[fontFamilyName] = fontDescriptor;

            fontStyle.onload = function() {
                setTimeout(function () {
                    fontDescriptor.onLoaded();
                }, 100);
            };
        } else {
            if(!fontDescriptor.isLoaded()) {
                fontDescriptor.addHandler(callback);
            }
        }
    },

    getFontFamily : function(fontHandle) {
        var ttfIndex = fontHandle.lastIndexOf(".ttf");
        if (ttfIndex === -1) return 'Calibri';

        var slashPos = fontHandle.lastIndexOf("/");
        var fontFamilyName;
        if (slashPos === -1) {
            fontFamilyName = fontHandle.substring(0, ttfIndex);
        } else {
            fontFamilyName = fontHandle.substring(slashPos + 1, ttfIndex);
        }
        return fontFamilyName;
    }
};

_ccsg.Label.prototype._loadTTFFont = function(fontHandle) {
    var self = this;
    var fontFamilyName = CustomFontLoader.getFontFamily(fontHandle);
    var callback = function () {
        self._notifyLabelSkinDirty();
        self.emit('load');
    };
    CustomFontLoader.loadTTF(fontHandle, callback);
    return fontFamilyName;
};

_ccsg.Label.prototype.setFontFileOrFamily = function(fontHandle, textureUrl) {
    this._resetBMFont();
    this._labelType = _ccsg.Label.Type.TTF;
    this._blendFunc = cc.BlendFunc._alphaPremultiplied();
    this._renderCmd._needDraw = true;
    this._fontHandle = this._loadTTFFont(fontHandle);
    this._notifyLabelSkinDirty();
};

_ccsg.Label.CanvasRenderCmd.prototype._calculateFillTextStartPosition = 
_ccsg.Label.WebGLRenderCmd.prototype._calculateFillTextStartPosition = 
function() {
    var node = this._node;
    var lineHeight = this._getLineHeight();
    var lineCount = this._splitedStrings.length;
    var labelX;
    var firstLinelabelY;

    if (cc.TextAlignment.RIGHT === node._hAlign) {
        labelX = this._canvasSize.width - this._getMargin();
    }
    else if (cc.TextAlignment.CENTER === node._hAlign) {
        labelX = this._canvasSize.width / 2;
    }
    else {
        labelX = 0 + this._getMargin();
    }

    if (cc.VerticalTextAlignment.TOP === node._vAlign) {
        firstLinelabelY = 0;
        if (cc.sys.browserType === cc.sys.BROWSER_TYPE_FIREFOX)
            firstLinelabelY += 5; // need for firefox vertical text alignment bug
    }
    else if (cc.VerticalTextAlignment.CENTER === node._vAlign) {
        firstLinelabelY = this._canvasSize.height / 2 - lineHeight * (lineCount - 1) / 2;
        if (cc.sys.browserType === cc.sys.BROWSER_TYPE_FIREFOX)
            firstLinelabelY += 2; // need for firefox vertical text alignment bug
    }
    else {
        firstLinelabelY = this._canvasSize.height - lineHeight * (lineCount - 1);
        if (cc.sys.browserType === cc.sys.BROWSER_TYPE_FIREFOX)
            firstLinelabelY -= 1; // need for firefox vertical text alignment bug
    }

    return cc.p(labelX, firstLinelabelY);
};