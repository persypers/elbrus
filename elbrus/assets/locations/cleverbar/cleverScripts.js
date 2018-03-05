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
		cc.controller.getComponent(cc.AudioSource).play();
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
					text_en : 'The bartender looks at you with ordinary "goodwill on duty":\n– Hi!', 
					text_ru : 'Бармен смотрит на вас с обыкновенной дежурной благожелательностью:\n– Привет!',
                    topics : ['order', 'menu', 'end']
				},
				alc : {
					text_en : ()=>'– Here we go!\nThe bartender fills the glass with beer. '
					+ ['With silent regret, you notice that there is a little less beer than should be.','With genuine delight, you notice that there is a little more be than should be.'].pickRandom()
					+ ' You masterfully get dressed with a drink.',
					text_ru : ()=>'– Ща всё сделаем!\nБармен наполняет бокал пивом. С '
					+ ['молчаливым сожалением вы замечаете, что пива чуть меньше,', 'неподдельным восторгом вы замечаете, что пива чуть больше,', 'неподдельным восторгом вы замечаете, что пива чуть больше,'].pickRandom()
					+ ' чем должно было быть. Вы мастерски разделываетесь с напитком.',
					topics : ['repeat', 'end']
				},
				menu_reply : {
					text_en : 'The cheapest thing is that you manage to consider this beer. That`s it. The only thing...',
					text_ru : 'Самое дешёвое, что вам удаётся рассмотреть это пиво. То самое. Единственное...',
					topics : ['order', 'end']
				}
            },
            topics : {
                order : {
					text_en : 'Ask for "as usual". (20 minutes)',
					text_ru : 'Попросить "как обычно". (20 минут)',
					script : ()=>{
						player.alcohol += 1;
						cc.eventLoop.time += 20;
						cc.player.hunger.value += 10;
						cc.player.fatigue.value += -20
                    },
                    reply : 'alc',
                },
                menu : {
					text_en : 'Ask the menu, hoping to find something cheap.',
					text_ru : 'Спросить меню, в надежде обнаружить что-нибудь дешёвое.',
                    reply : 'menu_reply',
                },
                end : {
					text_en : 'Silently walk away.',
					text_ru :  'Молча отойти.',
				},
				repeat : {
					text_en : 'Bartender, can you repeat? (20 minutes)',
					text_ru : 'Бармен, можно повторить! (20 минут)',
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
					text_en : 'There is a couple in front of you who are discussing something fiercely.',
					text_ru : 'Перед вами парочка, которая что-то ожесточённо обсуждает.',
					topics : ['listen', 'end']
				},
				silence : {
					text_en : 'The couple is dejectedly silent, tapping their fingers on the surfaces. It seems the conversation was a disaster.',
					text_ru : 'Парочка удручённо молчит, постукивая пальцами по поверхностям. Кажется беседа не удалась.',
					end : ['end']
				},
				dispute : {
					text_en : 'The couple discusses the appropriateness of orthodox relations and the classical housing construction in the context of modern gender equality.',
					text_ru : 'Пара обсуждает уместность ортодоксальных отношений и классического домостроя в условиях современного полового равенства.',
					topics : ['interact', 'end']
				},
				tatter : {
					text_en : 'You enter into a conversation. The couple rejoices at the new participant in the conversation, which, it seems, can derive them from the logical impasse in which they pleased. After a while you now all three find yourself in the abyss of sophistry.',
					text_ru : 'Вы вступаете в разговор. Парочка радуется новому участнику разговора, который, кажется, может вывести из логического тупика, в который они угодили. Через какое-то время вы теперь уже все втроём обнаруживаете себя в пучине софистики.',
					script : ()=>{
						player.tatter = true;
						cc.eventLoop.time += 30;
						return player.ideas.collect('consumerismBody');
                    },
					topics : ['final']
				}
			},
			topics : {
				end : {
					text_en : 'Continue your lonely path.',
					text_ru : 'Продолжить свой одинокий путь.',
				},
				listen : {
					text_en : 'Listen to their conversation, in a hope for warm human communication. (10 minutes)',
					text_ru : 'Прислушаться к их разговору, в надежде на тёплое человеческое общение. (10 минут)',
					script : ()=>{
						cc.eventLoop.time += 10;
					},
					reply : 'dispute'
				},
				interact : {
					text_en : 'Try to join the conversation. (30 minutes)',
					text_ru : 'Попытаться присоединиться к беседе. (30 минут)',
					script : ()=>{
						cc.eventLoop.time += 30;
					},
					reply : 'tatter'
				},
				final : {
					text_en : 'Accept the philosophical defeat and go further.',
					text_ru : 'Принять философское поражение и отправится дальше.',
				}
			}
		}
	},

	exitScript : function() {
		cc.controller.switchScene('street_basic', 'bar_enterance/entry');
		cc.player.enteredPark = true;
		cc.eventLoop.time += 5;
	}
});

