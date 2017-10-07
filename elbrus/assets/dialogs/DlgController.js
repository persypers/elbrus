var utils = require('Utils');

cc.Class({
    extends: cc.Component,

    properties: {
		leftChar : cc.Sprite,
		rightChar : cc.Sprite,
		appearLabel : cc.RichText,
		scrollContent : cc.Node,
		scrollView : cc.ScrollView,
		choiceBox : require('ChoiceBox'),
    },

    // use this for initialization
    onLoad: function () {
		this.node.on(cc.Node.EventType.TOUCH_START, this.onClick, this);
		cc.dlg = this;
    },

	playDialog : function(dlg, arg2) {
		if(typeof(dlg) == 'string') {
			if(cc.scene && cc.scene[dlg]) {
				dlg = cc.scene[dlg];
			} else {
				dlg = require(dlg);
			}
		}
		if(typeof(dlg) == 'function') {
			dlg = dlg();
		}
		this.dlg = dlg;
		var seq = [];
		this.choiceBox.node.active = false;
		this.node.active = true;
		this.scrollContent.destroyAllChildren();
		var anim = this.getComponent(cc.Animation);
		anim.getAnimationState(anim.defaultClip.name).sample();
		seq.push(cc.animate(anim, null, cc.WrapMode.Normal));
		var npcTopic = !!(dlg.replies[dlg.start]);
		var nextTopic = npcTopic && dlg.replies[dlg.start] || dlg.topics[dlg.start];

		seq.push(cc.callFunc(() => {
			this.topicAction(nextTopic, npcTopic);
		}));
		this.node.runAction(cc.sequence(seq));
	},

	topicAction : function(topic, npcTopic) {
		if(typeof(topic.script) == 'function') topic.script();
		var seq = [];
		var choices;
		seq.push(this.textAction(topic.text, npcTopic));
		
		if(npcTopic) {
			choices = [];
			var count = topic.topics && topic.topics.length;
			for(var i = 0; i < count; i++) {
				var t = topic.topics[i];
				if(typeof(t) == 'function') {
					t = t();
				}
				if(this.dlg.topics[t] || t == 'end') {
					choices.push(this.dlg.topics[t] || t);
				}
			}
			seq.push(cc.callFunc(() => {
				this.chooseNext(choices);
			}));
		} else {
			var reply = topic.reply;
			if(typeof(reply) == 'function') {
				reply = reply();
			}
			reply = this.dlg.replies[reply];
			if(reply) {
				seq.push(cc.callFunc(() => {
					this.topicAction(reply, true);
				}));
			} else {
				seq.push(cc.callFunc(this.endDialog, this, this));
			}
		}
		this.node.runAction(cc.sequence(seq));
	},

	chooseNext : function(topics) {
		if(topics.length == 0) {
			this.endDialog();
		}
		this.choiceBox.play(topics, (topic) => {
			if(topic == 'end') {
				this.endDialog();
			} else {
				this.topicAction(topic, false)
			}
		});
	},

	endDialog : function() {
		var seq = [];
		var anim = this.getComponent(cc.Animation);
		seq.push(cc.animate(anim, null, cc.WrapMode.Reverse));
		seq.push(cc.callFunc(() => {
			this.node.active = false;
		}));
		this.node.runAction(cc.sequence(seq));
	},

	textAction : function(text, npcTopic) {
		var seq = [];
		var label = cc.instantiate(this.appearLabel.node).getComponent(cc.RichText);
		label.node.parent = this.appearLabel.node.parent;
		label.string = "";
		label.node.active = true;
		cc.l = label;
		var align = npcTopic ? cc.RichText.HorizontalAlign.LEFT : cc.RichText.HorizontalAlign.RIGHT;
		label.horizontalAlign = align;
		this._waitAction = cc.callFuncAsync(function(){});
		seq.push(cc.race(
			cc.typeAction(label, text, 0.03),
			this._waitAction,
		));
		var waitAction = cc.callFuncAsync(function(){});
		seq.push(cc.callFunc(() => {
			label.string = text;
			var node = new cc.Node();
			node.width = label.node.width;
			node.height = label.node.height;
			node.parent = this.scrollContent;
			this.scrollContent.getComponent(cc.Layout)._doLayout();
			//this.scrollView.scrollToBottom(0.25);
			utils.changeParentWithPosSaving(label.node, node);
			label.node.runAction(cc.sequence([
				cc.moveTo(0.75, 0, -label.node.height * 0.5).easing(cc.easeCubicActionInOut()),
				cc.callFunc(function(){
					waitAction.complete();
				})
			]));
		}));
		seq.push(waitAction);
		return cc.sequence(seq);
	},

	onClick : function() {
		if(this._waitAction) {
			this._waitAction.complete();
		}
	}
});
