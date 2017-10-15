var player = require('player');
var utils = require('Utils');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad : function() {
        cc.scene = this;
    },

    freebench : function() {
        if(!this._suicideFail) {
            this._suicideFail = true;
            player.textField.show('Кажется, на этой лавочке можно сосредоточиться.');
        }        
    },

    room_window_dlg : function() {
        return {
            start : 'start',
            replies : {
                start : {
                    text : 'Мелкие капли дождя скатываются по стеклу в никуда.',
                    topics : ['watch', 'end', 'jump'],
                },
                jump_reply : {
                    text : 'Взобравшись на подоконник, вы в последний раз оглядели своё печальное жилище и шагнули в нежные объятия неизвестности.',
                    script : ()=>{cc.playerNode.destroy()},
                },
                watch_reply : {
                    text : 'Некоторое время вы наблюдаете за уличной суетой. Вам не становится сильно легче.',
                    topics : ['watch', 'end', 'jump'],
                },
            },
            topics : {
                jump : {
                    text : 'Выброситься из окна',
                    reply : 'jump_reply',
                },
                watch : {
                    text : 'Созерцать мир за окном',
                    reply : 'watch_reply',
                },
                end : {
                    text : 'Вернуться в насущным проблемам'
                }
            }
        }
    },

    parkExit : function() {
        return {
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
						cc.eventLoop.time += 60;
					},
                }
            },
            topics : {
                walk : {
                    text : 'Вернуться к урбанистическому пейзажу главной улицы. (10 минут)',
                    reply : 'walk_reply'
                },
                end : {
                    text : 'Позависать в парке ещё.'
                }
            }
        }
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

	bartenderDlg : function() {
        return {
            start : 'start',
            replies : {
                start : {
					text : 'Бармен смотрит на вас с обыкновенной дежурной благожелательностью:\n– Привет!',
                    topics : ['order', 'menu', 'end']
				},
				alc : {
					text : '– Ща всё сделаем!\nБармен наполняет бокал пивом. С ' + ['молчаливым сожалением вы замечаете, что пива чуть меньше,', 'неподдельным восторгом вы замечаете, что пива чуть больше,'].pickRandom() + ' чем должно было быть.',
					topics : ['repeat', 'end']
				}
            },
            topics : {
                order : {
                    text : 'Порпосить "как обычно".',
                    reply : 'alc',
                },
                menu : {
                    text : 'Спросить меню, в надежде обнаружить что-нибудь дешёвое.',
                    reply : 'think_n_reply',
                },
                end : {
                    text : 'Молча отойти.',
					reply : 'think_y_reply',
				},
				repeat : {
					text : 'Бармен, можно повторить!',
					reply : 'alc'	
				}
            }
        }
    },

	pairDlg : {

	},

	exitDlg : {

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

