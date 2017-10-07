var loader = require('Loader');
var shareResources = {};//require('SharedResources');
var HoverScript = require('HoverScript');
var utils = require('Utils');

var popups = shareResources.popups;

cc.Class({
    extends: cc.Component,

    properties: {
		fader : HoverScript,
		loading : HoverScript,
		defaultClip : cc.AnimationClip
	},

	onEnable : function () {
		// console.log('open pp', this.node.active);
		utils.updateSceneTabView('overlay','Popup');
	},

	onDisable : function () {
		// console.log('close pp', this.node.active);
		utils.updateSceneTabView('unoverlay','Popup');
	},

    // use this for initialization
    onLoad: function () {
		utils.trapMouseEvents(this.node);
		this.sound = this.getComponent(cc.AudioSource);
		this.stack = [];
    },

	onDestroy : function() {
		for(var k in popups) {
			delete popups[k].instance;
		}
	},

	disableClick : function() {
		this.node.off(cc.Node.EventType.TOUCH_START, this.onClick, this);
	},

	play : function(type, data, onDone) {
		this.node.on(cc.Node.EventType.TOUCH_START, this.onClick, this);

		var entry = popups[type];


		if(!this.node.active) {
			this.node.active = true;
			this.fader.fadeIn();
		}

		for(var i = 0; i < this.stack.length; i++) {
			this.stack[i].instance.setLocalZOrder(i - this.stack.length);
		}

		// check if required popup is already shown in stack
		var index = this.stack.indexOf(entry);
		if(index >= 0) {
			if(index < this.stack.length - 1) {
				this.stack.splice(index, 1);
				this.stack.push(entry);
			}
			entry.instance.setLocalZOrder(1);
			return;
		}

		this.stack.push(entry);

		var seq = [];
		var node = entry.instance;
		this.loading.fadeIn();
		if(! node) {
			// load popup prefab
			if( ! loader.getRes(entry.prefabUrl) ) {
				seq.push(loader.loadAction(entry.prefabUrl));
				seq.push(cc.callFunc(function() {
					loader.markShared(entry.prefabUrl);
				}));
			}
			seq.push(cc.callFuncAsync(function(act) { 
				// instantiate popup to layer
				var node = this._createPopup(entry);
				var script = node.getComponent(entry.script);
				// prepare popup - load content requrired for 'data' representation, if needed
				if(typeof(script.prepare) == 'function') {
					script.prepare(act, data);
				} else {
					act.complete();
				}
			}, this));
		} else {
			// prepare popup - load content requrired for 'data' representation, if needed
			node.active = true;
			var script = node.getComponent(entry.script);
			if(typeof(script.prepare) == 'function') {
				seq.push(cc.callFuncAsync(script.prepare, script, data));
			}
		}
		// start popup animation
		seq.push(cc.callFunc(function(target, entry) {
			this.loading.fadeOut();
			if(entry.stopLoadingScreen) {
				cc.game.loadingScreen.stop();
			}
			cc.game.music.playSound(null, 'popupSound');
			entry.instance.setLocalZOrder(1);
			entry.instance.getComponent('Popup').play(onDone);
		}, this, entry))

		this.node.runAction(cc.sequence(seq));
	},

	_createPopup : function(entry) {
		var node = cc.instantiate(loader.getRes(entry.prefabUrl));
		node._popupEntry = entry;

//		node.on('popup-opening', this._onChildOpening, this);
//		node.on('popup-open', this._onChildOpen, this);
		node.on('popup-closing', this._onChildClosing, this);
		node.on('popup-closed', this._onChildClosed, this);

		if( !node.getComponent('Popup') && !cc.isChildClassOf( require(entry.script), require('Popup') ) ) {
			node.addComponent('Popup');
		}
		node.parent = this.node;
		if(!node.getComponent(cc.Animation)) {
			var anim = node.addComponent(cc.Animation);
			anim.addClip(this.defaultClip);
			anim._defaultClip = this.defaultClip;
			anim.getAnimationState(this.defaultClip.name).sample();
		}
		node.getComponent(cc.Animation).sample(this.defaultClip.name);
		entry.instance = node;
		this.node.emit('popup-loaded', node);
		return node;
	},

	_onChildOpening : function(event) {
		console.log(1, event.target);
	},

	_onChildOpen : function(event) {
		console.log(2, event.target);
	},

	_onChildClosing : function(event) {
//		console.log(3, event.target);
		var top = this.stack[this.stack.length - 1];
		if(event.target == top.instance) {
			if(this.stack.length == 1) {
				this.fader.fadeOut(this._onChildClosed.bind(this));
			}
		}
	},

	_onChildClosed : function(event) {
//		console.log(4, event && event.target);
		if(event && event.target) {
			var index = this.stack.indexOf(event.target._popupEntry);
			if(index == this.stack.length - 1) {
				this.stack.pop();
				var top = this.stack[this.stack.length - 1];
				top && top.instance.setLocalZOrder(1);
			} else {
				this.stack.splice(index, 1);
			}
		}
		if(this.stack.length == 0 && !this.fader.node.active) {
			this.node.active = false;
		}
	},

	onClick : function() {
		var top = this.stack[this.stack.length - 1];
		if(!top || !top.instance) {
			return;
		}
		var script = top.instance.getComponent('Popup').close();
	},

});