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

    room_window_dlg : function() {
		var topics = ['watch', 'end', ()=>(cc.player.getNormalizedStress() > 0.6) && 'jump'];
		return {
			npcSprite : ()=>cc.find('window/Window', cc.scene.node).getComponent(cc.Sprite).spriteFrame,
            start : 'start',
            replies : {
                start : {
                    text : 'Мелкие капли дождя скатываются по стеклу в никуда.',
                    topics : topics,
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
					script : player.ideas.think.bind(this, 15),
					topics : topics,
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
                    topics : ['sleep8', 'sleep4', 'rest', 'end'],
                },
                sleep8_reply : {
					text : 'Вы заводите будильник через 8 часов и ложитесь спать.',
					script : player.fatigue.sleep8,
                },
                sleep4_reply : {
					text : 'Вы заводите будильник через 4 часа и ложитесь спать.',
					script : player.fatigue.sleep4,
                },
				rest_reply : {
                    text : 'Это у вас получается хорошо.',
					script : player.ideas.think.bind(this, 30),
				},
            },
            topics : {
                sleep8 : {
                    text : 'Спать 8 часов',
					reply : 'sleep8_reply',
                },
                sleep4 : {
                    text : 'Спать 4 часа',
					reply : 'sleep4_reply',
                },
				rest : {
                    text : 'Просто поваляться',
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
                    script : player.hunger.eatFresh,
                },
                stale : {
                    text : 'Вы разогреваете и доедаете вчерашнюю еду.',
					script : player.hunger.eatStale,
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

	doorScript : function() {
		var dlg = {
			start : () => player.hasLeftRoom ? 'startConfirm' : 'start',
			replies : {
				start : {
					text : 'Скрип этой дверной ручки всегда ассоциируется для вас со страхом и неприязнью - чувствами, с которыми вы каждый раз покидаете своё уютное жилище и ступаете в непредсказуемый и жестокий внешний мир.',
					topics : ['leave_first', 'end'],
				},
				startConfirm : {
					text : 'Здесь у вас есть всё необходимое для продуктивной работы в течение нескольких дней: запас продуктов, электричество и интернет. Вы уверены, что хотите уйти?',
					topics : ['leave', 'end']
				},
				leaveReply : {
					text : 'Гулким эхом звук захлопывающейся двери разносится по подъезду.',
					script : ()=>{
						player.hasLeftRoom = true;
						cc.eventLoop.time += 5;
						cc.controller.switchScene('street_basic', 'room_enterance/enter_trigger');
					}
				}
			},
			topics : {
				leave_first : {
					text : 'Пересилить свою социопатию и выйти за порог',
					reply : 'startConfirm',
				},
				leave : {
					text : 'Да, нельзя всё время отсиживаться дома',
					reply : 'leaveReply',
				},
				end : {
					text : 'Пожалуй, лучше будет остаться дома',
				}
			}
		}
		cc.director.getScene().getComponentInChildren('DlgController').playDialog(dlg);
	},

    notebook : require('notebookDlg'),
});

