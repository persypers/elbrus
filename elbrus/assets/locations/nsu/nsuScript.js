var player = require('player');
var utils = require('Utils');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad : function() {
        cc.scene = this;
    },

    tourniquet : function() {
			player.textField.show('The pass is locked by tourniquet.')
    },

	update : function() {
		var playerNode = cc.playerNode;
		if(playerNode) {
			var half = 1366 * 0.5;
			this.node.x = -Math.max(half, Math.min(this.node.width - half, playerNode.x));
		}
	},

    freebench : function() {
        if(!this._suicideFail) {
            this._suicideFail = true;
            player.textField.show('Кажется, на этой лавочке можно сосредоточиться.');
        }        
    },

    klavdiaDlg : function() {
        return {
            start : 'start',
            replies : {
                start : {
                    text : 'Неприветливый тяжелый взгляд этой женщины буквально плавит вас.',
                    topics : ['library', 'pass', 'ask', 'end'],
                },
                library_reply : {
                    text : '– Вход только по студенческим пропускам. Уже 40 раз вам сказала!',
                    topics : ['noyoudont', 'pass', 'ask', 'end'],
                },
                noyoudont_reply : {
                    text : '– Молодой человек! Я сейчас вызову охрану! Идите мешайте кому-нибудь другому!',
                    topics : ['pass', 'end']
                },
                pass_reply : {
                    text : '– И что я должна вам? Мне теперь танцевать чтоли?!',
                    topics : ['restore', 'end']
                },
                go_sit : {
                    text : '– Идите, посидите на лавочке, пока я посмотрю...',
                    topics : ['end']
                },
                ask_reply1 : {
                    text : '– Потихоньку-помальеньку. Сижу тут, смотрю как ходят всякие.',
                    topics : ['ask2', 'end']
                },
                ask_reply2 : {
                    text : '– Потихоньку-помальеньку. Сижу тут, смотрю как ходят всякие.',
                    topics : ['ask3', 'end']
                },
                ask_reply3 : {
                    text : '– Потихоньку-помальеньку. Сижу тут, смотрю как ходят всякие.',
                    topics : ['restore_succes', 'end']
                }
            },
            topics : {
                library : {
                    text : 'Спросить, можно ли вам пройти в библиотеку.',
                    reply : 'library_reply',
                },
                pass : {
                    text : 'Признаться, что вы потеряли студенческий пропуск.',
                    script : ()=>{
						player.klavdiaAnger += 1
					},
                    reply : 'pass_reply',
                },
                noyoudont : {
                    text : 'Кротко заметить, что она ещё ни разу вам про это не говорила.',
                    script : ()=>{
						player.klavdiaAnger += 1
					},
                    reply : 'noyoudont_reply'
                },
                ask : {
                    text : 'Спросить как идёт её служба.',
                    reply : 'ask_reply1',
                },
                ask2 : {
                    text : 'Поинтересоваться тяжело ли сидеть тут целыми днями.',
                    reply : 'ask_reply2'
                },
                ask3 : {
                    text : 'Сказать, что это прекрасно, что у неё нет.',
                    reply : 'ask_reply3'
                },
                restore : {
                    text : 'Попросить найти вас в списке студентов, чтобы пройти без пропуска.',
                    reply : 'go_sit'
                },
                restore_succes : {
                    text : 'Вежливо попросить найти вас в списке студентов, чтобы пройти без пропуска.',
                    script : ()=>{
                        cc.find("tourniquet", cc.scene.node).active = false;
                    },
                    reply : 'go_wait'
                },
                end : {
                    text : 'Отказаться от дальнейших попыток коммуникации.'
                }
            }
        }
    },

    parkEnter : function() {
        cc.controller.switchScene('park_basic', 'park_enterance2/entry');
    },

    Room_enter : function() {
        return {
            start : 'start',
            replies : {
                start : {
                    text : 'Обычный человеческий вход в общежитие. Краска на дверях облупилась и покрылась несколькими слоями объявлений.',
                    topics : ['enter', 'end'],
                },
                enter_reply : {
                    text : 'Здоровый сон восстанавливает вам силы.',
                }
            },
            topics : {
                enter : {
                    text : 'Войти в общежитие',
                    reply : 'enter_reply',
                },
                end : {
                    text : 'Смутившись отойти'
                }
            }
        }
    },

    window : function() {
        return {
            start : 'start',
            replies : {
                start : {
                    text : 'Кажется, это окно вашей комнаты общежития. Хотя, нет... Это точно окно вашей комнаты общежития.',
                    topics : ['inspect', 'enter', 'end'],
                },
                inspect_reply : {
                    text : 'С этой стороны угрюмая комната уже не кажется таким ужасным местом. Но мысли о предстоящей работе отвратительно отзываются горечью в груди.',
                    topics : ['enter', 'end'],
                },
                enter_reply : {
                    text : 'Размазывая ботинками грязь, вы залезаете в свою комнату . В процессе вас не покидает вопрос "Зачем?".',
                }
            },
            topics : {
                inspect : {
                    text : "Заглянуть в окно",
                    reply : 'inspect_reply',
                },
                enter : {
                    text : 'Попытаться залезть',
                    reply : 'enter_reply',
                },
                end : {
                    text : 'Продолжить мокнуть под дождём.'
                }
            }
        }
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
                        player.stress = false;
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

    kitchen : function() {
        return {
            start : 'start',
            replies : {
                start : {
                    text : () =>
                        'Оставшаяся от предыдущих жильцов плитка помогает вам поддерживать жизнедеятельность с минимальными расходами.'
                        + (player.staleFoodOnKitchen && ' На столе лежит подсохшая еда.' || ''),
                    topics : ['fresh', ()=>player.staleFoodOnKitchen && 'stale', 'end'],
                },
                fresh : {
                    text : () => 'Вы приготовили ' + ['рагу', 'суп', 'котлеты', "пирог", "омлет", "плов"].pickRandom() + '.',
                    script : ()=>{
                        player.staleFoodOnKitchen = true
                    },
                },
                stale : {
                    text : 'Вчерашняя еда. Иногда нужно прикоснуться к своему прошлому, чтобы шагнуть в будующее.',
                    script : () => {
                        player.staleFoodOnKitchen = false;
                    }
                },
            },
            topics : {
                fresh : {
                    text : 'Приготовить что-нибудь',
                    reply : 'fresh',
                },
                stale : {
                    text : 'Доесть недоедки',
                    reply : 'stale',
                },
                end : {
                    text : 'Не время набивать брюхо'
                }
            }
        }
    },

});

