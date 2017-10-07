var utils = require("Utils");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function (){
        this.label = this.node.getChildByName("label").getComponent(cc.Label);
        this.anim = this.node.getComponent(cc.Animation);
		this.horizon = this.node.getChildByName('horizont');
        require('Utils').trapMouseEvents(this.node);
    },

	onEnable : function() {
		var view = cc.view.getVisibleSize();
		this.node.x = view.width * this.node.anchorX;
		this.node.y = view.height * this.node.anchorY;
		cc.systemEvent.on('view-resized', this.onCanvasResize, this);
	},

	onDisable : function() {
		cc.systemEvent.on('view-resized', this.onCanvasResize, this);
	},

	onCanvasResize : function () {
		cc.game.loadingScreen.node.position = new cc.Vec2(cc.visibleRect.width * 0.5, cc.visibleRect.height * 0.5);
	},

	/**
	 * transitionFunc - function to be called when loader becomes fully opaque
	 * loadingAction - an optional action to be performed before transitionFunc is called
	 */
    play : function(transitionFunc, loadingAction, localeStr, empty) {
        this.label.string = 'Loading...';

		if(this.node.active) {
			console.warn('Loading screen is already enabled');
		}

		this.loadingAction = loadingAction;
		this.transitionFunc = transitionFunc;

		var fadeClip = empty && 'FaderAnim' || 'FadeIn';
		var children = this.node.children;
		for(var i = 0; i < children.length; i++) {
			children[i].active = !empty;
		}

		var seq = [];
		var waitFadeIn = cc.animate(this.anim, fadeClip, cc.WrapMode.Normal);
		var waitForStop = this.waitForStop = cc.callFuncAsync();

		if(loadingAction) {
			waitFadeIn = cc.spawn([
				waitFadeIn,
				loadingAction
			])
		}

		if(transitionFunc) {
			waitFadeIn = cc.sequence([
				waitFadeIn,
				cc.callFunc(transitionFunc)
			]);
		}

		var seq = cc.sequence([
			cc.spawn([
				waitFadeIn,
				waitForStop,
			]),
			cc.animate(this.anim, fadeClip, cc.WrapMode.Reverse),
			cc.callFunc(function(){
				if(typeof(this.onDone) == 'function') {
					this.onDone();
				}
				this.anim.stop();
				this.node.active = false;
			}, this)
		]);
		this.node.active = true;
		if(!empty) {
			this.anim.playAdditive('LightsLoop');
			this.anim.playAdditive('HorizonLoop');
			this.anim.playAdditive('HorizonScale');
		}
        this.node.runAction(seq); 
    },
	
	isPlaying : function() {
		return this.node.active;
	},

	/**
	 * onDone - function to be called when loader screen disappears completely
	 **/
    stop : function(onDone) {
		utils.updateSceneTabView('unoverlay', 'loadingScreen');  // elegant crutch
		this.onDone = onDone;
		this.waitForStop && this.waitForStop.complete();
    },

	switchScene : function(scene, onSceneChanged) {
		//cc.director.preloadScene(scene);
		this.play(function(){
			cc.director.loadScene(scene, function() {
				if(typeof(onSceneChanged) == 'function') {
					onSceneChanged();
				}
			// these scenes have more complex logic and will stop loading screen when needed
				if(scene != 'Case' && scene != 'HOScene' && scene != 'CaseSelect') {
					cc.game.loadingScreen.stop();
				}
			});
		});
	}
});
