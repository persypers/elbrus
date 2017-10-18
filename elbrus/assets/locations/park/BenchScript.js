cc.Class({
    extends: cc.Component,

    properties: {
		gopSprite : cc.Sprite,
		emptySprite : cc.Sprite,
		activeArea : require('ActiveArea'),
		textField : require('TextField'),
		puddle : cc.Node,
	},

    // use this for initialization
    onLoad: function () {
		var stress = cc.player.getNormalizedStress();
		if(Math.random() < stress * 0.7) {
			this.gopSprite.node.active = true;
			this.emptySprite.node.active = false;
			this.activeArea.highlight = this.gopSprite.getComponent('HoverScript');
			//this.activeArea.actionText = 'Простой человек';
			this.activeArea.actionText = 'Commoner';
			this.isGop = true;
		} else {
			this.gopSprite.node.active = false;
			this.emptySprite.node.active = true;
			this.activeArea.highlight = this.emptySprite.getComponent('HoverScript');
			//this.activeArea.actionText = 'Лавочка';
			this.activeArea.actionText = 'Bench';
		}
		if(Math.random() < cc.lerp(0.2, 0.6, stress)){
			this.puddle.active = true;
			this.puddle.x = cc.lerp(-111, 86, Math.random());
			this.puddle.y = cc.lerp(-114, -210, Math.random());
		} else {
			this.puddle.active = false;
		}
    },

	onActivate : function() {
		var dlg = this.isGop ? cc.scene.gop() : cc.scene.benchDialog();
		cc.director.getScene().getComponentInChildren('DlgController').playDialog(dlg);
	},

	onPuddleTrigger : function() {
		if(this.puddleTriggered) return;
		this.puddleTriggered = true;
		if(this.isGop) {
			cc.player.stress += 10;
			this.textField.show([
				"kek",
				"lol",
				"heh",
				"LOL",
				"Sucker...",
				"Wuss..."
			].pickRandom());
		} else {
			cc.player.say([
				/*'Вот досада!',
				'Вы промочили ноги.',
				"Ой!"*/
				"You wet your feet",
				"Ouch!",
			].pickRandom());
		}
	},

	onBenchTrigger : function() {
		if(!cc.player.benchIntro && !this.isGop) {
			//cc.player.say('Кажется, на этой лавочке можно сосредоточиться.');
			cc.player.say('This bench looks like a good place to concentrate.');
			cc.player.benchIntro = true;
		}
	}
});
