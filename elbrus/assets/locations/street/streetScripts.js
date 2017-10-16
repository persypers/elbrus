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
		//cc.controller.getComponent(cc.AudioSource).play();
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
				cc.controller.switchScene('room_basic', 'door/entry', ()=>{cc.player.say('Дом, милый дом')});
				cc.eventLoop.time += 5;
			}
			return;
		}
		var dlg = {
            start : 'start',
            replies : {
                start : {
                    text : 'Обычный человеческий вход в общежитие. Краска на дверях облупилась и покрылась несколькими слоями объявлений.',
                    topics : ['enter', 'end'],
                }
            },
            topics : {
                enter : {
                    text : 'Войти в общежитие',
                    reply : 'enter_reply',
					script: ()=>{
						if(cc.player.blackOut && cc.player.electricianCalled) {
							cc.controller.switchScene('porch', 'streetDoor/entry');
						} else {
							cc.controller.switchScene('room_basic', 'door/entry', ()=>{cc.player.say('Дом, милый дом')});
						}
						cc.player.streetToRoomEntered = true;
						cc.eventLoop.time += 5;
					}
				},
                end : {
                    text : 'Смутившись отойти'
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
                    text : 'Кажется, это окно вашей комнаты общежития. Хотя, нет... Это точно окно вашей комнаты общежития.',
                    topics : ['inspect', 'enter', 'end'],
                },
                inspect_reply : {
                    text : 'С этой стороны угрюмая комната уже не кажется таким ужасным местом. Но мысли о предстоящей работе отвратительно отзываются горечью в груди.',
					script : cc.player.ideas.collect.bind(cc.player.ideas, 'examplesBody'),
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

    parkEnter : function() {
		if(cc.player.enteredPark) {
			cc.controller.switchScene('park_basic', 'park_enterance1/entry');
			return;
		}
		var dlg = {
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
						cc.player.enteredPark = true;
						cc.eventLoop.time += 5;
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
                    text : 'Из приоткрытой двери до вас доносятся звуки музыки, гомон голосов и лязг стаканов.',
                    topics : ['enter', 'end'],
                },
                on_enter : {
                    text : 'Вы толкаете и дверь и робко переступаете порог шумного заведения.',
                    script : ()=>{
						cc.controller.switchScene('clever_basic', 'door/entry');
						cc.player.barEntered = true;
					},
                }
            },
            topics : {
                enter : {
                    text : 'Зайти на кружечку',
                    reply : 'on_enter',
                },
                end : {
                    text : 'У вас нет ни времени, ни денег на такие праздные развлечения'
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
					text : 'Бип-боп бип-боп',
					topics : ['end'],
				}
			},
			topics : {
				end : {
					text : 'Нужно доработать этот диалог'
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
					text : 'Бип-боп бип-боп',
					topics : ['end'],
				}
			},
			topics : {
				end : {
					text : 'Нужно доработать этот диалог'
				}
			}
		}
		cc.director.getScene().getComponentInChildren('DlgController').playDialog(dlg);		
	}
});

