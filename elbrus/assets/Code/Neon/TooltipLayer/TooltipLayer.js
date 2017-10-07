var pool = [];

cc.Class({
    extends: cc.Component,

    properties: {
		defaultSprite : cc.SpriteFrame,
		darkSprite : cc.SpriteFrame,
		defaultColor : cc.Color,
		darkColor : cc.Color,
		defaultClip : 'tooltipAnim',
		noDelayClip : 'noDelayTooltipAnim',
		defaultFont : cc.Font,
		tooltipPrefab : cc.Prefab,
    },

    onLoad: function () {
		cc.game.addPersistRootNode(this.node);
		cc.game.tooltipLayer = this;
    },

	onEnable : function() {
		this.node.x = cc.view.getVisibleSize().width * this.node.anchorX;
		this.node.y = cc.view.getVisibleSize().height * this.node.anchorY;
		cc.systemEvent.on('view-resized', this.onCanvasResize, this);
	},

	onCanvasResize : function () {
		cc.game.tooltipLayer.node.position = new cc.Vec2(cc.visibleRect.width * 0.5, cc.visibleRect.height * 0.5);
	},

	onDisable : function() {
		cc.systemEvent.off('view-resized', this.onCanvasResize, this);
	},

// called with this == Tooltip component
	show : function() {
		var t = this.tooltip || cc.game.tooltipLayer._createTooltip(this);
		t.show();
	},

// called with this == Tooltip component
	hide : function() {
		if(this.tooltip) {
			this.tooltip.hide()
		}
	},

	_createTooltip : function(target) {
		var node = pool.pop();
		if(!node) {
			node = cc.instantiate(this.tooltipPrefab);
			node.parent = this.node;
		}

		if(target.useDark) {
			node.getComponent(cc.Sprite).spriteFrame = this.darkSprite;
			node.getChildByName('label').color = this.darkColor;
		} else {
			node.getComponent(cc.Sprite).spriteFrame = this.defaultSprite;
			node.getChildByName('label').color = this.defaultColor;
		}

		var box = target.node.getBoundingBoxToWorld();
		var centerX = box.x + box.width * 0.5;
		var centerY = box.y + box.height * 0.5;
		var view = cc.view.getVisibleSize();
	// tooltip anchors
		var hor = (centerX >= view.width * 0.9) && 1 || 0;  
		var ver = (centerY >= view.height * 0.5) && 1 || 0;

	// world coordinates
		var x = box.x + box.width * cc.lerp(0.1, 0.9, hor);
		var y = box.y + box.height * cc.lerp(0.9, 0.1, ver);
		x = x + 12 * cc.lerp(-1, 1, hor);
		y = y + 12 * cc.lerp(-1, 1, ver);
		x = cc.clampf(0, view.width, x);
		y = cc.clampf(0, view.height, y);

		node.anchorX = hor;
		node.anchorY = ver;
		node.setLocalZOrder(1);
		node.position = cc.pointApplyAffineTransform(x, y, this.node.getWorldToNodeTransform());
		target.tooltip = node.getComponent('TooltipInstance');
		target.tooltip.updateString(target);
		return target.tooltip;
	},

	returnToPool : function(tooltip) {
		tooltip.node.active = false;
		tooltip.target.tooltip = null;
		pool.push(tooltip.node);
	}
});
