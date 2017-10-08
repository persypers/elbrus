var player = require('player');
var utils = require('Utils');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad : function() {
        cc.scene = this;
    },

    behindBed : function() {
        if(!this._behindBed) {
            this._behindBed = true;
			player.textField.show('О, монетка!');
        }        
    },

	doorScript : function() {
		cc.controller.switchScene('street_basic', 'room_enterance/enter_trigger');
		cc.eventLoop.time += 5;
	},

    room_window_dlg : function() {
        return {
			npcSprite : ()=>cc.find('window/Window', cc.scene.node).getComponent(cc.Sprite).spriteFrame,
            start : 'start',
            replies : {
                start : {
                    text : 'Мелкие капли дождя скатываются по стеклу в никуда.',
                    topics : ['watch', 'end', 'jump'],
                },
                jump_reply : {
                    text : 'Взобравшись на подоконник, вы в последний раз оглядели своё печальное жилище и шагнули в нежные объятия неизвестности.',
                    script : ()=>{
						cc.playerNode.destroy()
						cc.player.jumpedWindow = true;
						setTimeout(()=>{cc.controller.switchScene('street_basic', 'Window_street/window_trigger')}, 5000);
					},
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

    bedDialog : function() {
        return {
			npcSprite : ()=>cc.find('bed/bed', cc.scene.node).getComponent(cc.Sprite).spriteFrame,
			start : 'start',
            replies : {
                start : {
                    text : 'Старая скрипучая тахта, сойдёт для одиночки',
                    topics : ['sleep', 'rest', 'end'],
                },
                sleep_reply : {
					text : 'Здоровый сон восстанавливает вам силы.',
					script : () => {
						cc.eventLoop.time += 60 * 6
					}
                },
                rest_reply : {
                    text : 'Это у вас получается хорошо.',
					script : () => {
						cc.eventLoop.time += 30;
					}
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

    kitchen : function() {
        return {
			npcSprite : ()=>cc.find('food/food', cc.scene.node).getComponent(cc.Sprite).spriteFrame,
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
						cc.eventLoop.time += 60;
                    },
                },
                stale : {
                    text : 'Вчерашняя еда. Иногда нужно прикоснуться к своему прошлому, чтобы шагнуть в будующее.',
                    script : () => {
						player.staleFoodOnKitchen = false;
						cc.eventLoop.time += 15;
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
			'end',
			()=>player.currentIdea ? 'wright' : 'end_no_idea',
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
                    topics : hub
                },
                startLow : {
                    text : () => 'Да тут ещё конь не валялся! Только ' + player.pages + ' страниц из необходимых 100',
                    topics : hub
                },
                startMed : {
                    text : () => 'Что-то уже написано, но работы ещё непочатый край. ' + player.pages + ' из 100 страниц.',
                    topics : hub
                },
                startHigh : {
                    text : () => 'Стоит поднажать, кажется ещё можно успеть. ' + player.pages + ' из 100 необходимых страниц.',
                    topics : hub
                },
                startAlmost : {
                    text : () => 'Вы почти у цели, осталось всего ' + (100 - player.pages) + ' страниц!',
                    topics : hub
                },
                startDone : {
                    text : 'Вот оно. Ваша дипломная работа наконец закончена. Теперь нужно распечатать её, одно из требований комиссии - предоставить твёрдую копию работы.',
                    topics : 'copy',
                },
				end_no_idea : {
					text : 'В голову совсем ничего не приходит. Какое-то время вы усиленно пялитесь в монитор, но потом ловите себя на просмтора ' + ['летсплеев ', 'стримов ', 'прохождений '].pickRandom() + ['World of Tanks', 'League of Legends', 'World of Warcraft'].pickRandom(),
					script : ()=>{
						player.stress = false;
						cc.eventLoop.time += Math.floor(Math.random() * 120 + 120);
					}
				},
			},
            topics : {
                wright : {
                    text : 'Записать идею, которая крутилась у вас в голове',
                    script : () => {
                        player.currentIdea = false;
                        player.pages = player.pages + player.stress ? 5 : 0;
                        player.stress = true;
						player.ideasUsed = player.ideasUsed + 1;
						cc.eventLoop.time += 120;
                    },
                    reply : 'start'
                },
                copy : {
                    text : 'Доесть недоедки',
                },
                end : {
                    text : 'Не сейчас, у меня ещё достаточно времени'
				},
				end_no_idea : {
					text : 'Попытаться сконцентрирваться на дипломе',
					reply : 'end_no_idea',
				},				
            }
        }
    },

});

