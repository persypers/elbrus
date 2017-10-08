var player = require('player');
var utils = require('Utils');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad : function() {
        cc.scene = this;
    },

	start : function() {
		if(player.jumpedWindow) {
			player.jumpedWindow = false;
			cc.eventLoop.push({time : 1, handler : ()=>{cc.player.say('Это первый этаж. Сомнительная затея.')}})
		}
		cc.controller.getComponent(cc.AudioSource).play();
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
					text : 'Дом, милый дом.',
					script: ()=>{
						cc.controller.switchScene('room_basic', 'door/entry');
						cc.eventLoop.time += 5;
					}
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
					script: ()=>{
						cc.controller.switchScene('room_basic', 'window/entry');
						cc.eventLoop.time += 20;
					}
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

    bedDialog : function() {
        return {
            start : 'start',
            replies : {
                start : {
                    text : 'Старая скрипучая тахта, сойдёт для одиночки',
                    topics : ['sleep', 'rest', 'end'],
                },
                sleep_reply : {
                    text : 'Здоровый сон восстанавливает вам силы.',
                },
                rest_reply : {
                    text : 'Это у вас получается хорошо.',
                },
            },
            topics : {
                sleep : {
                    text : 'Спать',
                    reply : 'sleep_reply',
                },
                rest : {
                    text : 'Поваляться',
                    reply : 'rest_reply',
                },
                end : {
                    text : 'Вернуться в насущным проблемам'
                }
            }
        }
    },

    parkEnter : function() {
        return {
            start : 'start',
            replies : {
                start : {
                    text : 'Арка повествует о том, что не некий меценат огранизовал парк для своих любимых сограждан.',
                    topics : ['enter', 'end'],
                },
                jump_reply : {
                    text : 'Перепрыгнув одну лужу, вы случайно наступаете в другу. Зато вы в парке.',
                    script : ()=>{
						cc.controller.switchScene('park_basic', 'park_enterance1/entry');
						cc.eventLoop.time += 60;
					},
                }
            },
            topics : {
                enter : {
                    text : 'Войти в парк в поисках просветления.',
                    reply : 'jump_reply',
                },
                end : {
                    text : 'Остаться на здесь.'
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

    notebook : function() {
        var hub = [
            'end'
        ]
        return {
            start : () => {
                if(player.pages == 0) return 'firstStart';
                if(player.pages < 40) return 'startLow';
                if(player.pages < 60) return 'startMed';
                if(player.pages < 90) return 'startHigh';
                if(player.pages <100) return 'startAlmost';
                return 'startDone';
            },
            replies : {
                firstStart : {
                    text : 'Ваш компьютер. Белизна открытого пустого документа "диплом.doc" режет вам глаза.',
                    topics : hub,
                },
                startLow : {
                    text : () => 'Да тут ещё конь не валялся! Только ' + player.pages + ' страниц из необходимых 100',
                    topics : hub,
                },
                startMed : {
                    text : () => 'Что-то уже написано, но работы ещё непочатый край. ' + player.pages + ' из 100 страниц.',
                    topics : hub,
                },
                startHigh : {
                    text : () => 'Стоит поднажать, кажется ещё можно успеть. ' + player.pages + ' из 100 необходимых страниц.',
                    topics : hub,
                },
                startAlmost : {
                    text : () => 'Вы почти у цели, осталось всего ' + (100 - player.pages) + ' страниц!',
                    topics : hub,
                },
                startDone : {
                    text : 'Вот оно. Ваша дипломная работа наконец закончена. Теперь нужно распечатать её, одно из требований комиссии - предоставить твёрдую копию работы.',
                    topics : 'copy',
                },
            },
            topics : {
                copy : {
                    text : 'Доесть недоедки',
                },
                end : {
                    text : 'Не сейчас, у меня ещё достаточно времени'
                }
            }
        }
    },

});

