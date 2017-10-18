cc.Class({
    extends: cc.Component,

    properties: {
		isDark : {
			default : false,
			notify : function() {
				var en = this.isDark;
				var darkens = this.darkens;
				for(var i = 0; i < darkens.length; i++) {
					darkens[i].active = en;
				}
			}
		},
		gopText : require('TextField'),
	},

    // use this for initialization
    onLoad: function () {
		var children = this.node.children;
		this.darkens = [];
		for(var i = 0; i < children.length; i++) {
			var dark = children[i].getChildByName('dark');
			if(dark) {
				this.darkens.push(dark);
			}
		}
		cc.scene = this;
    },

	start : function() {
		this.flipLights();
		this._imp = true;
	},

	flipLights : function() {
		this.node.runAction(cc.sequence([
			cc.delayTime(cc.lerp(0.0, this.isDark ? 3 : 0.2, Math.random())),
			cc.callFunc(()=> {
				if(cc.player.fixedBlackOut) return;
				this.isDark = !this.isDark;
				this.flipLights();
			})
		]));
	},

	toRoom : function() {
		cc.controller.switchScene('room_basic', 'door/entry');
	},

	toStreet : function() {
		cc.controller.switchScene('street_basic', 'room_enterance/enter_trigger');
	},

	fuseBox : function() {
		//this.gopText.show('Э, малой, руки убери!');
		this.gopText.show('Ei, hands off, kiddo!');
	},

	bumpGop : function() {
		if(this.bumpDelay) return;
		this.bumpDelay = true;
		this.gopText.show('Whatcha, too wide?');
		this.node.runAction(cc.sequence([
			cc.delayTime(3),
			cc.callFunc(()=>{this.bumpDelay = false})
		]));
	},

	gopTalk : function() {
		var gopTalk = () => '– ' + ['Wha?', 'Hmm?', 'Whatcha?', 'Waz?', 'Waa?', 'F?', "Shat"].pickRandom() + '?'
		
		if(cc.player.fixedBlackOut) {
			this.gopText.show(gopTalk());
			cc.player.stress += 10;
		}

		var dlg = {
			start : 'gop',
			replies : {
				gop : {
					text : gopTalk,
					script : () => {
						cc.player.stress += 10;
						if(cc.player.fixedBlackOut) {
							var parts = this.getComponentsInChildren(cc.ParticleSystem);
							parts.forEach((comp) => {
								comp.emissionRate = 0;
								var anim = comp.getComponent(cc.Animation);
								anim && anim.stop();
							});
							this.isDark = false;
							//cc.eventLoop.push({time : 2, handler : ()=>{this.gopText.show('Дело мастера боится, ёпта')}});
							cc.eventLoop.push({time : 2, handler : ()=>{this.gopText.show('Nailed it')}});
						}
					},
					topics : [
						()=>!cc.player.fixedBlackOut && (this._plus?'phase_minus':'phase_plus'),
						()=>!cc.player.fixedBlackOut && (this._imp?'imp_minus':'imp_plus'),
						()=>!cc.player.fixedBlackOut && 'oxy',
						()=>!cc.player.fixedBlackOut && 'ground',
						()=>!cc.player.fixedBlackOut && 'end'],
				}
			},
			topics : {
				phase_minus : {
					//text : "Посоветовать переключить фазу на минус",
					text : "Advise to switch phase negative",
					reply : 'gop',
					script : ()=> {this._plus = !this._plus},
				},
				phase_plus : {
					//text : "Посоветовать переключить фазу на плюс",
					text : "Advise to switch phase positive",
					reply : 'gop',
					script : ()=> {this._plus = !this._plus},
				},
				imp_plus : {
					//text : "Посоветовать увеличить импеданс цепи",
					text : "Advise to increase circuit impedance",
					reply : 'gop',
					script : ()=> {this._imp = !this._imp},
				},
				imp_minus : {
					//text : "Посоветовать уменьшить импеданс цепи",
					text : "Advise to reduce circuit impedance",
					reply : 'gop',
					script : ()=> {this._imp = !this._imp},
				},
				oxy : {
					//text : "Посоветовать инвертировать коммутатор",
					text : "Advise to revert commutator",
					reply : 'gop',
					script : ()=> {this._comm = !this._comm},
				},
				ground : {
					//text : "Посоветовать заземлить фазу",
					text : "Advise to ground phase connector",
					reply : 'gop',
					script : ()=>{
						if(this._imp && this._plus && this._comm) {
							cc.player.blackOut = false;
							cc.player.fixedBlackOut = true;
						} else if(!this._imp && !this._plus && !this._comm) {
							return cc.player.ideas.collect('producerPlan');
						} else {
							this._imp = false;
							this._plus = false;
							this._comm = false;
						}
					}
				},

				end : {
					//text : 'Не стоит мешать специалисту делать свою работу.',
					text : "It's better not to get in a way of a trained professional.",
				}
			}
		}

		cc.director.getScene().getComponentInChildren('DlgController').playDialog(dlg);
	}
});
