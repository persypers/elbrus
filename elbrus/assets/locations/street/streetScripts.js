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
			cc.eventLoop.push({time : 1, handler : ()=>{cc.player.say({
				text_en : 'This is the first floor. It` was a stupid idea.',
				text_ru : 'Это первый этаж. Сомнительная затея.',
			})}});
		}
		cc.controller.getComponent(cc.AudioSource).play();
	},

	update : function() {
		var playerNode = cc.playerNode;
		if(playerNode) {
			var half = 1366 * 0.5;
			this.node.x = -Math.max(half, Math.min(this.node.width - half, playerNode.x));
		}
	},

    Room_enter : function() {
		if(cc.player.streetToRoomEntered) {
			if(cc.player.blackOut && cc.player.electricianCalled) {
				cc.controller.switchScene('porch', 'streetDoor/entry');
			} else {
				cc.controller.switchScene('room_basic', 'door/entry', ()=>{cc.player.say({
					text_en:'Home, sweet home!',
					text_ru:'Дом, милый дом',
				})});
				cc.eventLoop.time += 5;
			}
			return;
		}
		var dlg = {
            start : 'start',
            replies : {
                start : {
					text_en : 'Normal human entrance to the dormitory. The paint on the doors peeled off and was covered with several layers of ads.',
					text_ru:'Обычный человеческий вход в общежитие. Краска на дверях облупилась и покрылась несколькими слоями объявлений.',
                    topics : ['enter', 'end'],
                }
            },
            topics : {
                enter : {
					text_en : 'Enter the dormitory.',
					text_ru:'Войти в общежитие',
                    reply : 'enter_reply',
					script: ()=>{
						if(cc.player.blackOut && cc.player.electricianCalled) {
							cc.controller.switchScene('porch', 'streetDoor/entry');
						} else {
							cc.controller.switchScene('room_basic', 'door/entry', ()=>{cc.player.say({
								text_en:'Home, sweet home!',
								text_ru:'Дом, милый дом',
							})});
						}
						cc.player.streetToRoomEntered = true;
						cc.eventLoop.time += 5;
					}
				},
                end : {
					text_en : 'Walk away in confusion.',
					text_ru : 'Смутившись отойти',
                }
            }
		}
		cc.director.getScene().getComponentInChildren('DlgController').playDialog(dlg);
    },

    window : function() {
        return {
            start : 'start',
            replies : {
                start : {
					text_en : 'It seems this is the window of your dorm room. Although, no ... It`s exactly the window of your dorm room.',
					text_ru : 'Кажется, это окно вашей комнаты общежития. Хотя, нет... Это точно окно вашей комнаты общежития.',
                    topics : ['inspect', 'enter', 'end'],
                },
                inspect_reply : {
					text_en : 'From this side the sullen room no longer seems to be so terrible. But the thoughts about the work ahead are repulsive in bitterness in the chest.',
					text_ru : 'С этой стороны угрюмая комната уже не кажется таким ужасным местом. Но мысли о предстоящей работе отвратительно отзываются горечью в груди.',
					script : cc.player.ideas.collect.bind(cc.player.ideas, 'examplesBody'),
					topics : ['enter', 'end'],
                },
                enter_reply : {
					text_en : 'Smudging the boots with dirt, you climb into your room. The question "Why?" do not leave you in the process.',
					text_ru : 'Размазывая ботинками грязь, вы залезаете в свою комнату . В процессе вас не покидает вопрос "Зачем?".',
					script: ()=>{
						cc.controller.switchScene('room_basic', 'window/entry');
						cc.eventLoop.time += 20;
					}
				}
            },
            topics : {
                inspect : {
					text_en : "Look in the window.",
					text_ru : 'Заглянуть в окно',
                    reply : 'inspect_reply',
                },
                enter : {
					text_en : 'Try to climb.',
					text_ru : 'Попытаться залезть',
                    reply : 'enter_reply',
                },
                end : {
					text_en : 'Continue to wet in the rain.',
					text_ru : 'Продолжить мокнуть под дождём.',
                }
            }
        }
    },

    parkEnter : function() {
		if(cc.player.enteredPark) {
			cc.controller.switchScene('park_basic', 'park_enterance1/entry');
			return;
		}
		var dlg = {
            start : 'start',
            replies : {
                start : {
					text_en : 'The arch tells that a patron bound the park for his beloved fellow citizens.',
					text_ru : 'Арка повествует о том, что не некий меценат огранизовал парк для своих любимых сограждан.',
                    topics : ['enter', 'end'],
                },
                jump_reply : {
					text_en : 'After jumping one puddle, you accidentally step into the other. But you are in the park, at least.',
					text_ru : 'Перепрыгнув одну лужу, вы случайно наступаете в другу. Зато вы в парке.',
                    script : ()=>{
						cc.controller.switchScene('park_basic', 'park_enterance1/entry');
						cc.player.enteredPark = true;
						cc.eventLoop.time += 5;
					},
                }
            },
            topics : {
                enter : {
					text_en : 'Enter the park in search of enlightenment.',
					text_ru : 'Войти в парк в поисках просветления.',
                    reply : 'jump_reply',
                },
                end : {
					text_en : 'Stay on here.',
					text_ru : 'Остаться',
                }
            }
		}
		cc.director.getScene().getComponentInChildren('DlgController').playDialog(dlg);
    },

	toBar : function() {
		if(cc.player.barEntered) {
			cc.controller.switchScene('clever_basic', 'door/entry');
			return;
		}
		var dlg = {
            start : 'start',
            replies : {
                start : {
					text_en : 'From the slightly opened door you hear the sounds of music, the hubbub of voices and the clatter of glasses.',
					text_ru:'Из приоткрытой двери до вас доносятся звуки музыки, гомон голосов и лязг стаканов.',
                    topics : ['enter', 'end'],
                },
                on_enter : {
					text_en : 'You push the door and shyly cross the threshold of a noisy institution.',
					text_ru: 'Вы толкаете дверь и робко переступаете порог шумного заведения.',
                    script : ()=>{
						cc.controller.switchScene('clever_basic', 'door/entry');
						cc.player.barEntered = true;
					},
                }
            },
            topics : {
                enter : {
					text_en : 'Go for one beer.',
					text_ru : 'Зайти на кружечку',
                    reply : 'on_enter',
                },
                end : {
					text_en : 'You do not have neither the time nor the money for such idle entertainment.',
					text_ru : 'У вас нет ни времени, ни денег на такие праздные развлечения.',
                }
            }
		}
		cc.director.getScene().getComponentInChildren('DlgController').playDialog(dlg);
	},

	multipay : function() {
		var dlg = {
			start : 'start',
			replies : {
				start : {
					text_en : 'The terminal panel is flooded with rain. With difficulty you will recognize the icons of familiar brands.',
					text_ru : 'Панель терминала залита дождём. С трудом вы узнаете иконки знакомых брендов.',
					topics : [()=>player.veronikaAsk&&!player.fixedBlackOut&&'electr', 'end'],
				}
			},
			topics : {
				end : {
					text_en : 'Dejectedly go away.',
					text_ru : 'Неуверенно отойти от автомата.',
				},
				electr : {
					text_en : 'It seems you can see the way to get an electrician to your address.',
					text_ru : 'В запутанном меню автомата вы, кажется, понимаете, как можно вызвать электрика.',
					script : ()=>{
						player.electricianCalled = true;
					},
					reply : 'start'
				}
			}
		}
		cc.director.getScene().getComponentInChildren('DlgController').playDialog(dlg);
	},

	kiosk : function () {
		var dlg = {
			start : 'start',
			replies : {
				start : {
					text_en : 'A woman stares through you with tired eyes.',
					text_ru : 'Женщина смотрит на вас усталыми глазами.',
					topics : [()=>player.blackOut&&!player.electricianCalled&&'ask', 'end'],
				},
				terminal : {
					text_en : '– Order everything you need with terminal.',
					text_ru : '– А терминал для чего по-вашему стоит?',
					topics : ['end']
				}
			},
			topics : {
				ask : {
					text_en : 'Ask how you call an electrician.',
					text_ru : 'Спросить, как вызвать электрика.',
					script : ()=>{
						player.veronikaAsk = true;
					},
					reply : 'terminal'
				}
			}
		}
		cc.director.getScene().getComponentInChildren('DlgController').playDialog(dlg);		
	}
});

