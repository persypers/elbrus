cc.Class({
    extends: cc.Component,

    properties: {
		anim : cc.Animation,
		scrollContent : cc.Node,
		messagePrefab : cc.Prefab,
		timeLabel : cc.Label,
		unreadNode : cc.Node,
		unread : {
			type : 'Integer',
			default : 0,
			notify : function() {
				if(this.unread > 0) {
					this.unreadNode.active = true;
					this.unreadNode.getComponentInChildren(cc.Label).string = this.unread;
				} else {
					this.unreadNode.active = false;
				}
			}
		}
	},

    // use this for initialization
    onLoad: function () {
		cc.phone = this;
		this._messages = [];
		this.hover = this.getComponent('HoverScript');
		this.node.on(cc.Node.EventType.TOUCH_START, this.open, this);
		this.node.getChildByName('darken').on(cc.Node.EventType.TOUCH_START, function(event) {
			event.stopPropagation();
		});
		this._baseDate = new Date(1242604800000);
		this._baseDate.setHours(this._baseDate.getHours() + 10);
		this.timeLabel.string = this._baseDate.toGMTString().slice(0, -7);
		cc.systemEvent.on('tick', ()=> {
			var d = new Date(this._baseDate);
			d.setMinutes(this._baseDate.getMinutes() + cc.eventLoop.time);
			this.timeLabel.string = d.toGMTString().slice(0, -7);
		})
    },

	open : function() {
		this.hover.fadeIn(()=>{
			for(var i = 0; i < this._messages.length; i++) {
				var msg = this._messages[i];
				if(msg.isRead) continue;
				msg.isRead = true;
				msg.node.getComponent(cc.Animation).play();
			}
			this.unread = 0;
		});
	},

	close : function() {
		this.hover.fadeOut();
	},

	pushMessage : function(message){
		this._messages.push(message);
		var node = cc.instantiate(this.messagePrefab);
		message.node = node;
		var senderKey = 'sender_' + cc.locale;
		node.getChildByName('sender').getComponent(cc.Label).string = typeof(message[senderKey]) == 'string' ? message[senderKey] : 'Напоминалкин2000';
		var key = 'text_' + cc.locale;
		if(typeof(message[key]) == 'function') {
			message[key] = message[key]();
		}
		node.getChildByName('text').getComponent(cc.Label).string = message[key];
		message.isRead = false;
		this.unread ++;
		node.parent = this.scrollContent;
		node.setSiblingIndex(0);
	},

});
