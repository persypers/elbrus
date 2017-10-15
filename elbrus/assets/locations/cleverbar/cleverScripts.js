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

	bartenderDlg : function() {
        return {
            start : 'start',
            replies : {
                start : {
					text : 'Бармен смотрит на вас с обыкновенной дежурной благожелательностью:\n– Привет!',
                    topics : ['order', 'menu', 'end']
				},
				alc : {
					text : '– Ща всё сделаем!\nБармен наполняет бокал пивом. С '
					+ ['молчаливым сожалением вы замечаете, что пива чуть меньше,', 'неподдельным восторгом вы замечаете, что пива чуть больше,', 'неподдельным восторгом вы замечаете, что пива чуть больше,'].pickRandom()
					+ ' чем должно было быть. Вы мастерски разделываетесь с напитком.',
					topics : ['repeat', 'end']
				},
				menu_reply : {
					text : 'Самое дешёвое, что вам удаётся рассмотреть это пиво. То самое. Единственное...',
					topics : ['order', 'end']
				}
            },
            topics : {
                order : {
					text : 'Попросить "как обычно". (20 минут)',
					script : ()=>{
						player.alcohol += 1;
						cc.eventLoop.time += 20;
						cc.player.hunger.value += 10;
						cc.player.fatigue.value += -20
                    },
                    reply : 'alc',
                },
                menu : {
                    text : 'Спросить меню, в надежде обнаружить что-нибудь дешёвое.',
                    reply : 'menu_reply',
                },
                end : {
                    text : 'Молча отойти.'
				},
				repeat : {
					text : 'Бармен, можно повторить! (20 минут)',
					script : ()=>{
						player.alcohol += 1;
						cc.eventLoop.time += 20;
						cc.player.hunger.value += 15;
						cc.player.fatigue.value += -15
                    },
					reply : 'alc'
				}
            }
        }
    },

	pairDlg : function() {
        return {
			start : ()=>player.tatter?'silence' : 'start',
			replies : {
				start : {
					text : 'Перед вами парочка, которая что-то ожесточённо обсуждает.',
					topics : ['listen', 'end']
				},
				silence : {
					text : 'Парочка удручённо молчит, постукивая пальцами по поверхностям. Кажется беседа не удалась.',
					end : ['end']
				},
				dispute : {
					text : 'Пара обсуждает уместность ортодоксальных отношений и классического домостроя в условиях современного полового равенства.',
					topics : ['interact', 'end']
				},
				tatter : {
					text : 'Вы вступаете в разговор. Парочка радуется новому участнику разговора, который, кажется, может вывести из логического тупика, в который они угодили. Через какое-то время вы теперь уже все втроём обнаруживаете себя в пучине софистики.',
					script : ()=>{
						player.tatter = true;
						return player.ideas.think(30)
                    },
					topics : ['final']
				}
			},
			topics : {
				end : {
					text : 'Продолжить свой одинокий путь.'
				},
				listen : {
					text : 'Прислушаться к их разговору, в надежде на тёплое человеческое общение. (10 минут)',
					script : ()=>{
						cc.eventLoop.time += 10;
					},
					reply : 'dispute'
				},
				interact : {
					text : 'Попытаться присоединиться к беседе. (30 минут)',
					script : ()=>{
						cc.eventLoop.time += 30;
					},
					reply : 'tatter'
				},
				final : {
					text : 'Принять филосовское поражение и отправится дальше.'
				}
			}
		}
	},

	exitScript : function() {
				cc.controller.switchScene('park_basic', 'park_enterance1/entry');
				cc.player.enteredPark = true;
				cc.eventLoop.time += 5;
		}
});

