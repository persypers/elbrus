var player = require('player');
var utils = require('Utils');

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
	},

    onLoad : function() {
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
		this.isDark = cc.player.blackOut;
	},

    behindBed : function() {
        if(!this._behindBed) {
            this._behindBed = true;
			player.textField.show({
				text_ru:'О, монетка!',
				text_en:'Oh, a coin!'
			});
        }        
    },

    room_window_dlg : function() {
		var topics = ['watch', 'end', ()=>(cc.player.getNormalizedStress() > 0.6) && 'jump'];
		return {
			npcSprite : ()=>cc.find('window/Window', cc.scene.node).getComponent(cc.Sprite).spriteFrame,
            start : 'start',
            replies : {
                start : {
					text_ru : 'Мелкие капли дождя скатываются по стеклу в никуда.',
					text_en : 'Tiny raindrops are eagerly sliding down the window glass.',
                    topics : topics,
                },
                jump_reply : {
					text_ru : 'Взобравшись на подоконник, вы в последний раз оглядели своё печальное жилище и шагнули в нежные объятия неизвестности.',
					text_en : 'You glance over you humble home one last time as you climb your way onto the window ledge. And then you step forward embracing tenderness of the unknown.',
                    script : ()=>{
						cc.playerNode.destroy()
						cc.player.jumpedWindow = true;
						setTimeout(()=>{cc.controller.switchScene('street_basic', 'Window_street/window_trigger')}, 5000);
					},
                },
                watch_reply : {
					text_ru : 'Некоторое время вы наблюдаете за уличной суетой. Вам не становится сильно легче.',
					text_en : "You watch street bustling for some time. It doesn't make you feel any better",
					script : player.ideas.think.bind(this, 15),
					topics : topics,
                },
            },
            topics : {
                jump : {
					text_ru : 'Выброситься из окна',
					text_en : 'Throw yourself out of the window',
                    reply : 'jump_reply',
                },
                watch : {
					text_ru : 'Созерцать мир за окном',
					text_en : 'Contemplate the outside world',
                    reply : 'watch_reply',
                },
                end : {
					text_ru : 'Вернуться в насущным проблемам',
					text_en : 'Get back to your recent problems',
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
					text_ru : 'Старая скрипучая тахта, сойдёт для одиночки',
					text_en : 'Old creaky single bed, fits you good.',
                    topics : ['sleep8', 'sleep4', 'rest', 'end'],
                },
                sleep8_reply : {
					text_ru : 'Вы заводите будильник через 8 часов и ложитесь спать.',
					text_en : 'You set an 8-hour alarm and go to sleep',
					script : player.fatigue.sleep8,
                },
                sleep4_reply : {
					text_ru : 'Вы заводите будильник через 4 часа и ложитесь спать.',
					text_en : 'You set a 4-hour alarm and go to sleep',
					script : player.fatigue.sleep4,
                },
				rest_reply : {
					text_ru : 'Это у вас получается хорошо.',
					text_en : "You're getting real good at this.",
					script : player.ideas.think.bind(this, 30),
				},
            },
            topics : {
                sleep8 : {
					text_ru : 'Спать 8 часов',
					text_en : 'Sleep for 8 hours',
					reply : 'sleep8_reply',
                },
                sleep4 : {
					text_ru : 'Спать 4 часа',
					text_en : 'Sleep for 4 hours',
					reply : 'sleep4_reply',
                },
				rest : {
					text_ru : 'Просто поваляться',
					text_en : 'Just relax a bit',
                    reply : 'rest_reply',
                },
                end : {
					text_ru : 'Вернуться в насущным проблемам',
					text_en : 'Get back to your recent problems'
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
                    text_ru : () =>
                        'Оставшаяся от предыдущих жильцов плитка помогает вам поддерживать жизнедеятельность с минимальными расходами.'
                        + (player.staleFoodOnKitchen && ' На столе лежит подсохшая еда.' || ''),
					text_en : () =>
                        'Old stove left by previous inhabitants lets you keep your vitals at minimal expenses.'
                        + (player.staleFoodOnKitchen && ' There is some left-over food on the table.' || ''),

					topics : [()=>!cc.player.blackOut && 'fresh', ()=>player.staleFoodOnKitchen && 'stale', 'end'],
                },
                fresh : {
					text_ru : () => 'Вы приготовили ' + ['рагу', 'суп', 'котлеты', "пирог", "омлет", "плов"].pickRandom() + '.',
					text_en : () => 'You made ' + ['a soup', 'some meatballs', 'a salad', "a pie", "an omelete", "a sandwich"].pickRandom() + '.',
                    script : player.hunger.eatFresh,
                },
                stale : {
					text_ru : ()=>cc.player.blackOut ? 'Без электричества вы даже не можете разогреть свой печальный обед.' : 'Вы разогреваете и доедаете вчерашнюю еду.',
					text_en : ()=>cc.player.blackOut ? 'With the power out you are forced to eat it cold.' : 'You warm it up and consume it.',
					script : player.hunger.eatStale,
				},
            },
            topics : {
                fresh : {
                    text_ru : 'Приготовить что-нибудь',
                    text_en : 'Cook something',					
					reply : 'fresh',
                },
                stale : {
					text_ru : 'Доесть недоедки',
					text_en : 'Eat left-overs',
                    reply : 'stale',
                },
                end : {
					text_ru : 'Не время набивать брюхо',
					text_en : "It's no time to stuff your stomach!",
                }
            }
        }
    },

	doorScript : function() {
		var dlg = {
			start : () => player.hasLeftRoom ? 'startConfirm' : 'start',
			replies : {
				start : {
					text_ru : 'Скрип этой дверной ручки всегда ассоциируется для вас со страхом и неприязнью - чувствами, с которыми вы каждый раз покидаете своё уютное жилище и ступаете в непредсказуемый и жестокий внешний мир.',
					text_en : "The feel of this door knob reminds you of fear and repulsivness. Kind of what you always feel for the outside world - the one you're leaving for.",
					topics : ['leave_first', 'end'],
				},
				startConfirm : {
					text_ru : 'Здесь у вас есть всё необходимое для продуктивной работы в течение нескольких дней: запас продуктов, электричество и интернет. Вы уверены, что хотите уйти?',
					text_en : "You sure you want to leave? You've got everything you need for a next couple of days - food, electricity, interned and a job to do.",
					topics : ['leave', 'end']
				},
				leaveReply : {
					text_ru : 'Гулким эхом звук захлопывающейся двери разносится по подъезду.',
					text_en : 'Door slam echoes eerily through the hall.',
					script : ()=>{
						player.hasLeftRoom = true;
						cc.eventLoop.time += 5;
						if(cc.player.blackOut && cc.player.electricianCalled) {
							cc.controller.switchScene('porch', 'roomDoor/entry');
						} else {
							cc.controller.switchScene('street_basic', 'room_enterance/enter_trigger');
						}
					}
				}
			},
			topics : {
				leave_first : {
					text_ru : 'Пересилить свою социопатию и выйти за порог',
					text_en : 'Get over your sociopathy and walk outside',
					reply : 'startConfirm',
				},
				leave : {
					text_ru : 'Да, нельзя всё время отсиживаться дома',
					text_en : "Yes, you can't sit here forever",
					reply : 'leaveReply',
				},
				end : {
					text_ru : 'Пожалуй, лучше будет остаться дома',
					text_en : "Probably it's better to stay home for now",
				}
			}
		}
		cc.director.getScene().getComponentInChildren('DlgController').playDialog(dlg);
	},

    notebook : require('notebookDlg'),
});

