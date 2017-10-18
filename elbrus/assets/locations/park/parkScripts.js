var player = require('player');
var utils = require('Utils');

cc.Class({
    extends: cc.Component,

    properties: {
		benchPrefab : cc.Prefab,
		lowerBound : cc.BoxCollider,
		upperBound : cc.BoxCollider,
	},

    onLoad : function() {
		cc.scene = this;
		var stress = cc.player.getNormalizedStress();
		var benchCount = cc.lerp(4, 9, stress * stress * stress);
		benchCount = Math.floor(benchCount);
		for(var i = 0; i < benchCount; i++) {
			var n = cc.instantiate(this.benchPrefab);
			n.parent = this.node;
			n.x = 540 + i * 415;
			n.y = -96;
		}
		this.node.width = benchCount * 415 + 540 + 540;
		this.upperBound.size.width = this.node.width;
		this.lowerBound.size.width = this.node.width;
		
    },

	start : function() {
		var playerNode = cc.playerNode;
		if(playerNode && playerNode.x > 200) {
			playerNode.x = this.node.width - 200;
		}
	},

	update : function() {
		var playerNode = cc.playerNode;
		if(playerNode) {
			var half = 1366 * 0.5;
			this.node.x = -Math.max(half, Math.min(this.node.width - half, playerNode.x));
		}
	},

    parkExit : function() {
		if(cc.player.enteredPark) {
			cc.controller.switchScene('street_basic', 'park_enterance/entry');
			return
		}
		var dlg = {
            start : 'start',
            replies : {
                start : {
					//text : 'Арка повествует о том, что не некий меценат огранизовал парк для своих любимых сограждан.',
					text : 'This archway depicts a local sponsor building a recreactional area for his fellow citizens.',
                    topics : ['walk', 'end'],
                },
                walk_reply : {
					//text : 'Выход преграждает огромная лужа. Вам ничего не остаётся, кроме как отчаяно прошлёпать скозь неё.',
					text : "There is a huge puddle in your way. You are forced to walk over it.",
                    script : ()=>{
						cc.controller.switchScene('street_basic', 'park_enterance/entry');
						cc.player.enteredPark = true;
					},
                }
            },
            topics : {
                walk : {
					//text : 'Вернуться к урбанистическому пейзажу главной улицы.',
					text : 'Return to the main street.',
                    reply : 'walk_reply'
                },
                end : {
					//text : 'Позависать в парке ещё.'
					text : 'Hang around a bit more.'
                }
            }
		}
		cc.director.getScene().getComponentInChildren('DlgController').playDialog(dlg);
    },

	toNsu : function() {
		cc.controller.switchScene('nsu_basic', 'nsu/entry');
	},

    benchDialog : function() {
        return {
            start : 'start',
            replies : {
                start : {
					//text : 'Лавочка почти не намокла – кроны деревьев очень удачно закрывают её от дождя.',
					text : 'Comfortably situated under tree branches this bench is almost dry.',
                    topics : ['sit', 'think_n', 'end'],
                },
                sit_reply : {
					//text : 'Влажное холодное дерево быстро забирает тепло вашего тела. Интересно, краска прилипнет к одежде?',
					text : 'Cold soaked wood quickly saps the heat of your body. You wonder, will the paint stick to your clothes?',
                    topics : [()=>player.currentIdea || 'think_y', ()=>player.currentIdea && 'think_a', ()=>player.getNormalizedStress()>0.8 && 'relax', 'end']
                },
                think_n_reply : {
					//text : 'Нахмурив лоб и размяв виски вы понимате, что на лавочку можно сесть.',
					text : "You think hard enough to understand that benches are for sitting.",
                    topics : ['sit', 'end'],
                },
                think_y_reply : {
					//text : 'Вам в голову приходит идея, несмотря на то, что ветер пытается выдуть её из ваших ушей. Она определённо пригодится.',
					text : 'Despite cold wind trying to blow it away, your mind grasps on suprisingly useful idea.',
                    script : ()=>{
                        return cc.player.ideas.think(30);
                    },
                    topics : ['think_a', 'end']
                },
                think_a_reply : {
					//text : 'На секунду вам кажется, что новая мысль лучше предыдущей. Пока вы прицениваетесь, какая вам больше нравится, ветру удаётся выдуть одну из них.',
					text : 'While you were evaluating which one is better, wind managed to snatch away one of your ideas.',
                    topics : ['think_a', 'end'],
                }
            },
            topics : {
                sit : {
					//text : 'Присесть.',
					text : 'Have a seat.',
                    reply : 'sit_reply',
                },
                think_n : {
					//text : 'Сконцентрироваться и подумать. (5 минут)',
					text : 'Concentrate',
                    reply : 'think_n_reply',
                },
                think_y : {
					//text : 'Посидеть, сконцентрироваться и подумать. (30 минут)',
					text : 'Concentrate seated',
                    reply : 'think_y_reply',
                },
                think_a : {
					//text : 'Придумать ещё что-нибудь. (40 минут)',
					text : 'Come up with a new idea',
                    reply : 'think_a_reply',
                },
                relax : {
					//text : 'Расслабиться. (30 минут)',
					text : 'Relax',
                    script : () => {
						player.stress *= 0.2;
						cc.eventLoop.time += 30;
						return player.ideas.collect('futurePrediction');
                    },
                    reply : "sit_reply"
                },
                end : {
					//text : 'Отправиться дальше.'
					text : 'Walk further',
                }
            }
        }
    },

    gop : function() {
        return {
            start : 'start',
            replies : {
                start : {
					//text : () => '– ' + ['Чё', 'Мм', 'Ээ', 'Аа', 'Хуль', 'Бл'].pickRandom() + '?',
					text : () => '– ' + ['Wha?', 'Hmm?', 'Whatcha?', 'Waz?', 'Waa?', 'F?', 'Shat'].pickRandom() + '?',
                    script : ()=>{
                        player.stress = true
                    },
                    topics : ['ask', 'end']
                }
            },
            topics : {
                ask : {
					//text : "Спросить, что он знает об энергетике?",
					text : "Ask what he thinks about energy industry.",
                    reply : 'start',
                },
                end : {
					//text : 'Оставить человека в покое.'
					text : 'Leave him alone.'
                }
            }
        }
    },

    puddleDialog : function() {
        return {
            start : 'start',
            replies : {
                start : {
					//text : 'Лужа... Очень скучно.',
					text : "Puddle. Real' boring",
                    topics : ['look', 'end']
                },
                status : {
					//text : 'Вы выглядите бездельником.' + (player.stress && ' Очень вымотаным бездельником.' || ''),
					text : 'You look like a dangler.' + (player.getNormalizedStress() > 0.6 && ' A really tired dangler.' || ''),
                    topics : ['end']
                }
            },
            topics : {
                look : {
					//text : "Присмотреться к своему отражению.",
					text : "Look at your reflection",
                    reply : 'status'
                },
                end : {
					//text : 'Отойти от этой сляконтой мерзости.'
					text : 'Step away',
                }
            }
        }
    },

});

