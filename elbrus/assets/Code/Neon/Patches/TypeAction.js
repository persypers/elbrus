/**
 *  Type text string to cc.Label on character at a time
 *  @param {cc.Label | cc.Node} label Label component or a node with one
 *  @param {string} text Text to be typed
 *  @param {number} textDelay Delay between characters in seconds
 */
cc.TypeAction = cc.FiniteTimeAction.extend({
    _label : null,
    _text : null,
	_textDelay : 0.01,
    _colorTag : null,
	_dt : 0,
	_length : 0,

    ctor:function (label, text, textDelay, textKeyColor, cards, cardsCallBack, self) {
        cc.FiniteTimeAction.prototype.ctor.call(this);
        this.initWithLabel(label, text, textDelay, textKeyColor, cards, cardsCallBack, self);
    },

    initWithLabel:function (label, text, textDelay, textKeyColor, cards, cardsCallBack, self) {
        if(label instanceof cc.Label || label instanceof cc.RichText) {
            this._label = label;
        } else if((label instanceof cc.Node) && (label.getComponent(cc.Label))) {
            this._label = label.getComponent(cc.Label);
        } else {
            return false;
        }
        this._text = text;
        this._cardsCallBack = cardsCallBack;
        this._cards = cards;
        this._self = self;

        if(!textKeyColor) textKeyColor = '#000000';
        this._colorTag = '<color=' + textKeyColor + '>';
        if(textDelay) {
			this._textDelay = textDelay;
		}
        return true;
    },

    step : function(dt) {
		this._dt += dt;
		var length = Math.floor(this._dt / this._textDelay);
		if(length >= this._text.length) {
			this.stop();
		} else if(length > this._length) {

            var text = this._text.slice(0, length);

            if (text.indexOf('{') != -1) {
                var bracketBalanced = text.split("{").length === text.split("}").length;
                var cardIndex = text.split("{").length - 1;
                text = text.replace(new RegExp('{', 'g'), this._colorTag);
                if (this._cards && cardIndex > 0) {
                    var card = this._cards[cardIndex - 1];
                    this._cardsCallBack(this._self, card, this._cards.length);
                }
                text = text.replace(new RegExp('}', 'g'), '</c>');
                if (!bracketBalanced) text += '</c>';
            }

            this._label.string = text;
			this._length = length;
		}
    },
    
    update : function(dt) {
        this.step(dt);
    },
    
    startWithTarget : function(target) {
        cc.Action.prototype.startWithTarget.call(this, target);
        this._isDone = false;
    	this._label.string = "";
		this._dt = 0;
		this._length = 0;
	},
    
    stop : function() {
        this._label.string = this._text
            .replace(new RegExp('{', 'g'), this._colorTag)
            .replace(new RegExp('}', 'g'), '</c>');
		this._isDone = true;
    },
    
    clone : function() {
        return new cc.TypeAction(this._label, this._text, this._textDelay);
    },
    
    isDone : function() {
        return this._isDone;
    }
    
});

/**
 *  Type text string to cc.Label on character at a time
 *  @param {cc.Label | cc.Node} label Label component or a node with one
 *  @param {string} text Text to be typed
 *  @param {number} textDelay Delay between characters in seconds
 *  @param {string} textKeyColor Color of key words
 *  @param {Array} cards Array of cards on dialog
 *  @param {function} cardsCallBack Callback for card action
 *  @param {DialogScript} self DialogScript
 */
cc.typeAction = function (label, text, textDelay, textKeyColor, cards, cardsCallBack, self) {
    return new cc.TypeAction(label, text, textDelay, textKeyColor, cards, cardsCallBack, self);
};


