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
		var benchCount = cc.lerp(2, 7, stress * stress * stress);
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
                    text : 'Арка повествует о том, что не некий меценат огранизовал парк для своих любимых сограждан.',
                    topics : ['walk', 'end'],
                },
                walk_reply : {
                    text : 'Выход преграждает огромная лужа. Вам ничего не остаётся, кроме как отчаяно прошлёпать скозь неё.',
                    script : ()=>{
						cc.controller.switchScene('street_basic', 'park_enterance/entry');
						cc.player.enteredPark = true;
					},
                }
            },
            topics : {
                walk : {
                    text : 'Вернуться к урбанистическому пейзажу главной улицы.',
                    reply : 'walk_reply'
                },
                end : {
                    text : 'Позависать в парке ещё.'
                }
            }
		}
		cc.director.getScene().getComponentInChildren('DlgController').playDialog(dlg);
    },

    benchDialog : function() {
        return {
            start : 'start',
            replies : {
                start : {
                    text : 'Лавочка почти не намокла – кроны деревьев очень удачно закрывают её от дождя.',
                    topics : ['sit', 'think_n', 'end'],
                },
                sit_reply : {
                    text : 'Влажное холодное дерево быстро забирает тепло вашего тела. Интересно, краска прилипнет к одежде?',
                    topics : [()=>player.currentIdea || 'think_y', ()=>player.currentIdea && 'think_a', ()=>player.stress && 'relax', 'end']
                },
                think_n_reply : {
                    text : 'Нахмурив лоб и размяв виски вы понимате, что на лавочку можно сесть.',
                    topics : ['sit', 'end'],
                },
                think_y_reply : {
                    text : 'Вам в голову приходит идея, несмотря на то, что ветер пытается выдуть её из ваших ушей. Она определённо пригодится.',
                    script : ()=>{
                        player.currentIdea = true
                    },
                    topics : ['think_a', 'end']
                },
                think_a_reply : {
                    text : 'На секунду вам кажется, что новая мысль лучше предыдущей. Пока вы прицениваетесь, какая вам больше нравится, ветру удаётся выдуть одну из них.',
                    topics : ['think_a', 'end']
                }
            },
            topics : {
                sit : {
                    text : 'Присесть.',
                    reply : 'sit_reply',
                },
                think_n : {
                    text : 'Сконцентрироваться и подумать. (5 минут)',
                    reply : 'think_n_reply',
                },
                think_y : {
                    text : 'Посидеть, сконцентрироваться и подумать. (30 минут)',
                    reply : 'think_y_reply',
                },
                think_a : {
                    text : 'Придумать ещё что-нибудь. (40 минут)',
                    reply : 'think_a_reply',
                },
                relax : {
                    text : 'Расслабиться. (30 минут)',
                    script : () => {
						player.stress *= 0.2;
						cc.eventLoop.time += 30;
                    },
                    reply : "sit_reply"
                },
                end : {
                    text : 'Отправиться дальше.'
                }
            }
        }
    },

    gop : function() {
        return {
            start : 'start',
            replies : {
                start : {
                    text : () => '– ' + ['Чё', 'Мм', 'Ээ', 'Аа', 'Хуль', 'Бл'].pickRandom() + '?',
                    script : ()=>{
                        player.stress = true
                    },
                    topics : ['ask', 'end']
                }
            },
            topics : {
                ask : {
                    text : "Спросить, что он знает об энергетике?",
                    reply : 'start',
                },
                end : {
                    text : 'Оставить человека в покое.'
                }
            }
        }
    },

    puddleDialog : function() {
        return {
            start : 'start',
            replies : {
                start : {
                    text : 'Лужа... Очень скучно.',
                    topics : ['look', 'end']
                },
                status : {
                    text : 'Вы выглядите бездельником.' + (player.stress && ' Очень вымотаным бездельником.' || ''),
                    topics : ['end']
                }
            },
            topics : {
                look : {
                    text : "Присмотреться к своему отражению.",
                    reply : 'status'
                },
                end : {
                    text : 'Отойти от этой сляконтой мерзости.'
                }
            }
        }
    },

});

