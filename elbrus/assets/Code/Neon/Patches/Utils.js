/**
 * Destroy all children nodes of a node. Node.removeAllChildren is handy but it doesn't destroy nodes
 */
cc.Node.prototype.destroyAllChildren = function() {
	var children = this.children;
	for(var i = children.length - 1; i >= 0 ; i--) {
		children[i].destroy();
	}
	this.removeAllChildren();
};

var eventTrap = function(event) {
	event.stopPropagation();
}

/**
 * That callback will be called when view port size changed.
 * That callback is one for application.
 */
var onViewResize = function () {
	var canvasNode = cc.find('Canvas');
	if (canvasNode)
		canvasNode.emit('size-changed');
	!CC_EDITOR && cc.systemEvent.emit('view-resized');
};
if (!cc.view._resizeCallback) {
	cc.view.setResizeCallback( onViewResize );
} else {
	console.warn('cc.view._resizeCallback is alredy setted!');
}

var utils = {
	/**
	 * Test all active sprites on scene if their texture was deleted
	 */
	checkInstancedTextures : function() {
		var roots = cc.director.getScene().children;
		var sprites = [];
		for(var i = 0; i < roots.length; i++) {
			sprites = sprites.concat(roots[i].getComponentsInChildren(cc.Sprite));
		}
		var uniqueTextures = [];
		var list = [];
		var duplicates = 0;
		for(var i = 0; i < sprites.length; i++) {
			var sf = sprites[i].spriteFrame;
			var tex = sf && sf.getTexture();
			if(tex && !tex._handleOnBind && !gl.isTexture(tex._webTextureObj)) {
				var entry = {
					tex : tex,
					node : sprites[i].node
				};
				if(uniqueTextures.indexOf(tex) == -1) {
					uniqueTextures.push(tex);
					list.push({tex : tex, node : sprites[i].node});
				} else {
					duplicates++;
				}
			}
		}
		console.log('===> DETECT RELEASED TEXTURES:');
		console.log('Released textures: ', list.length, 'Affected nodes: ', list.length + duplicates);
		return list;
	},

	/**
	 * Shuffles an array
	 * @param {Array} a
	 */
	shuffle : function(a) {
		var tmp, j;
		for(var i = 0; i < a.length; i++) {
			j = utils.getRandomInt(0, a.length);
			tmp = a[j];
			a[j] = a[i];
			a[i] = tmp;
		}
		return a;
	},

    /**
     * Returns random integer value from range [min, max)
     *
     * @param {number} min
     * @param {number} max
     * @return {number}
     */
    getRandomInt : function(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
    },

    /**
     * @param {number} min
     * @param {number} max
     * @return {number}
     */
    getRandomArbitary : function(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @param {number} left
     * @param {number} right
     * @return {number}
     */
    interpolate : function(value, min, max, left, right) {
        var relative = (value - min) / (max - min);

        return (right - left) * relative + left;
    },

    /**
     * @param {Object} scene
     * @return {number}
     */
    calculateStarsForScene : function(scene) {
        var totalScore = scene.totalScore || 0;

        var stars;
        for (stars = 0; stars < scene.scoreGoals.length; stars++) {
            if (scene.scoreGoals[stars] > totalScore)
                break;
        }

        return stars;
    },

	getNextStarProgress : function(scene) {
		var stars = this.calculateStarsForScene(scene);
		var totalScore = scene.totalScore || 0;
		var current = scene.scoreGoals[stars - 1] || 0;
		var next = scene.scoreGoals[stars];
		if(!next) {
			return 1;
		} else {
			return (totalScore - current) / (next - current);
		}
	},

	/**
	 * Set node's spriteFrame with respect of it's previous bounds:
	 * 		* if new spriteFrame fits into node bounds, just put it and remember node bounds for later
	 * 		* if it doesn't, scale it down so it would, keeping aspect ratio and remember node bounds
	 * Intended usage: for stuff like UI content icons we set cc.Sprite bounds in editor - these are bounds
	 * that sprite should never exceed. Then in runtime we get actual spriteFrames, that we want to fit into selected area.
	 * Thus we need to save initial node bounds as they're overwritten every time we assign a new spriteFrame.
	 * 
	 * @param {cc.Node} node
	 * @param {cc.SpriteFrame} spriteFrame
	 */
	fitSpriteFrame : function(node, spriteFrame) {
		if(node instanceof cc.Sprite) {
			node = node.node;
		}
		if(!node._bounds_w || !node._bounds_h) {
			node._bounds_w = node.width;
			node._bounds_h = node.height;
		}
		if(!spriteFrame) {
			node.getComponent(cc.Sprite).spriteFrame = null;
			return;
		}
		var rect = spriteFrame.getRect();
		var scale = Math.min(1, Math.min(node._bounds_w / rect.width, node._bounds_h / rect.height));
		node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
		node.width = rect.width * scale;
		node.height = rect.height * scale;
	},

	/**
	 * changes node's parent without moving node in world space
	 */
	changeParent : function(node, parent) {
		if(node.parent == parent) return;
		var nodeToWorld = node.getNodeToWorldTransformAR();
		var worldPos = cc.pointApplyAffineTransform(cc.Vec2.ZERO, nodeToWorld);
		var worldToParent = parent.getWorldToNodeTransform();
		var newPos = cc.pointApplyAffineTransform(worldPos, worldToParent);
		node.parent = parent;
		node.position = newPos;
	},

	/**
	 * Moves node's anchor to a specified world point without changing node's world bounding box and children positions
	 */
	moveAnchorToWorldPoint : function(node, worldPoint) {
		var w = node.width, h = node.height;
		var wt = node.getWorldToNodeTransform();
		var d = cc.pointApplyAffineTransform(worldPoint, wt);
		node.anchorX += d.x / w;
		node.anchorY += d.y / h;
		node.x += d.x;
		node.y += d.y
		var children = node.children;
		for(var i = 0; i < children.length; i++) {
			children[i].x -= d.x;
			children[i].y -= d.y;
		}
	},

	moveAnchorToNodePos : function(node, targetNode) {
		var wt = targetNode.getNodeToWorldTransformAR();
		var worldPoint = cc.pointApplyAffineTransform(cc.Vec2.ZERO, wt);
		utils.moveAnchorToWorldPoint(node, worldPoint);
	},

	fullscreen : function(arg) {
		var enable = !cc.screen.fullScreen();
		if(typeof(arg) == 'boolean') {
			enable = arg;
		}
		if(!enable) {
			cc.screen.exitFullScreen();
		} else {
			cc.screen.requestFullScreen(document.getElementById("GameDiv"));
		}
		return enable;
	},

	/**
	 * little helper function for finishing minigames
	 */
	finishMG : function() {
		cc.scene.finishMG();
	},

	checkOverlay : function () { // check ScenesTab overlay
		if (!window.overlays) window.overlays = {};
		var isOvered = false;
		for (var k in window.overlays) {
			if(window.overlays[k]){
				isOvered = true;
				break;
			}
		}
		return isOvered;
	},

	updateSceneTabView : function (str, overlayName) {
		var was = this.checkOverlay();
		if(str == 'overlay') {
			window.overlays[overlayName] = true;
		} else if(str == 'unoverlay') {
			window.overlays[overlayName] = false;
		}
		var now = this.checkOverlay();
		

		if (now != was &&
			cc.scene.folder &&
			cc.scene.folder.activeTab &&
			cc.scene.folder.activeTab.active &&
			cc.scene.folder.activeTab.name == 'ScenesTab') 
		{
			cc.scene.folder.activeTab.getComponent('ScenesTab').reactTo(now ? 'overlay' : 'unoverlay');
			// cc.scene.folder.activeTab.getComponent('ScenesTab').updateScenesQuestHighlight();
		}
	},

    changeParentWithPosSaving : function (node, newParent) {
		var getWorldRotation = function (node) {
			var currNode = node
			var resultRot = 0;
			while(currNode) {
				resultRot += currNode.rotation;
				currNode = currNode.parent;
			}
			resultRot = resultRot % 360
			return resultRot;
		};

		var oldWorRot = getWorldRotation(node);
		var newParentWorRot = getWorldRotation(newParent);
		var newLocRot = oldWorRot - newParentWorRot;

        var oldWorPos = node.convertToWorldSpaceAR(cc.p(0,0));
		var newLocPos = newParent.convertToNodeSpaceAR(oldWorPos);

        node.parent = newParent;
        node.position = newLocPos;
		node.rotation = newLocRot;
    },

	trapMouseEvents : function(node) {
		for(var k in cc.Node.EventType) {
			var key = cc.Node.EventType[k];
			node.off(key, eventTrap);
			node.on(key, eventTrap);
		}
	},

	popup : function(type, data, onDone) {
		if(type == 'error') {
			cc.game.errorPopup.play();
			return;
		}
		cc.director.getScene().children[0].getComponentInChildren('PopupLayer').play(type, data, onDone);
	},

	playAnimNoEnergy : function () {
		var profBar = cc.find('Canvas/ProfileBar').getComponent('ProfileBarScript');
		profBar.playAnimNoEnergy();
	},

	playAnimNoCoins : function () {
		var profBar = cc.find('Canvas/ProfileBar').getComponent('ProfileBarScript');
		profBar.playAnimNoCoins();
	},

    // TODO: this is workaround, need something more clever
	calculateIndents : function(text, label) {
		var c = document.createElement('canvas');
		var ctx = c.getContext("2d");
		ctx.font = label.fontSize + 'px Arial';
		var textWidth = ctx.measureText(text).width;
		var tempText = '';
		if(textWidth > label.node.width) {
			var splited = text.split(' ');
			text = '';
			for(var i = 0; i < splited.length; i++) {
				tempText += ' ' + splited[i];
				if(ctx.measureText(tempText).width > label.node.width) {
					text += '\n' + splited[i];
					tempText = splited[i];
				} else {
                    if(i != 0) text += ' ';
                    text += splited[i];
				}
			}
		}

		// var pxPerLetter = textWidth / text.length;
		// var numberOf = Math.floor(textWidth / label.node.width);
		// var indices = [];
		// for(var i = 1; i <= numberOf; i++) {
		// 	indices.push(text.lastIndexOf(' ', Math.floor(textWidth/(pxPerLetter*i))));
		// }
		// for(var j = 0; j < indices.length; j++) {
		// 	text = text.substr(0, indices[j]) + '\n' + text.substr(indices[j] + 1);
		// }
		// console.error(indices);
		return text;
	},

	playDialog : function(dlg, sceneToReturn, onDone) {
		cc.dialogParams = {};
		cc.dialogParams.dlg = dlg;
		cc.dialogParams.sceneToReturn = sceneToReturn;
		cc.dialogParams.onDone = onDone;
		cc.game.loadingScreen.switchScene('Dialog');
	},

	getStarterOffer : function(profile) {
		var starterOffer = false;
		var count = profile.activeOffers && profile.activeOffers.length || 0;
		for(var i = 0; i < count && !starterOffer; i++) {
			if(profile.activeOffers[i].item_id.indexOf('starter') != -1) {
				starterOffer = profile.activeOffers[i];
			}
		}
		return starterOffer;
	},

	getReportOffer : function(profile) {
		var reportOffer = false;
		var count = profile.activeOffers && profile.activeOffers.length || 0;
		for(var i = 0; i < count && !reportOffer; i++) {
			if(profile.activeOffers[i].item_id.indexOf('report') != -1) {
				reportOffer = profile.activeOffers[i];
			}
		}
		return reportOffer;
	},

	createDebugNode : function() {
		var url = 'shared/Debug/Debug.prefab';
		require('Loader').load(url, function() {
			var node = cc.instantiate(require('Loader').getRes(url));
			node.parent = cc.scene.node;
		})
	},

	formatTimeWithDotDot : function(timeLeft) {
		var t = new Date(timeLeft);
		var hh = (((t.getUTCDate() - 1) * 24) + t.getUTCHours()).toString();
		var mm = t.getUTCMinutes().toString();
		var ss = t.getUTCSeconds().toString();
		if(hh.length < 2) hh = '0' + hh;
		if(mm.length < 2) mm = '0' + mm;
		if(ss.length < 2) ss = '0' + ss;
		return hh + ':' + mm + ':' + ss;
	}
};

module.exports = utils;