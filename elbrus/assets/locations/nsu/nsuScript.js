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

    tourniquet : function() {
		player.textField.show({
			text_en : 'The pass is locked by tourniquet.',
			text_ru : 'Проход закрыт турникетом.',
		})
    },

	update : function() {
		var playerNode = cc.playerNode;
		if(playerNode) {
			var half = 1366 * 0.5;
			this.node.x = -Math.max(half, Math.min(this.node.width - half, playerNode.x));
		}
	},

    locked : function() {
		player.textField.show({
			text_en:'Library is closed.',
			text_ru :'Библиотека закрыта.',
		});
    },

    benchWaiting : function() {
        return {
            start : 'start',
            replies : {
                start : {
					text_en : 'Rigid bench, very typical for public institutions.',
					text_ru : 'Жесткая скамья, очень типичная для государственных учреждений.',
                    topics : [()=>player.klavdiaAsk && 'wait', 'end']
                },
                waited : {
					text_en : 'Seems like you`ve waited enough.',
					text_ru : 'Ну сколько можно ждать.',
                }
            },
            topics : {
                wait : {
					text_en : 'Wait for Klavdia to look up for your name (10 min)',
					text_ru : 'Подождать, пока вас ищут в списке (10 минут)',
                    script : ()=>{
                        cc.eventLoop.time += 10;
                        player.klavdiaWaited = true;
                    },
                    reply : '',
                },
                end : {
					text_en : 'Go away.',
					text_ru : 'Идти своей дорогой',
                }
            }
        }
    },

    klavdiaDlg : function() {
        return {
            start : ()=>player.klavdiaWaited?'anger' : 'start',
            replies : {
                start : {
					text_en : 'The ungainly stare of this woman literally melts you.',
					text_ru : 'Неприветливый тяжелый взгляд этой женщины буквально плавит вас.',
                    topics : ['library', 'pass', 'ask', 'end'],
                },
                library_reply : {
					text_en : '- Entry allowed only with student ID! How many times do I have to tell you this? Forty?',
					text_ru : '– Вход только по студенческим пропускам. Уже 40 раз вам сказала!',
                    topics : ['noyoudont', 'pass', 'ask', 'end'],
                },
                noyoudont_reply : {
					text_en : '- Young man! I`ll call security now! Go get in the way of someone else!',
					text_ru : '- Молодой человек! Я сейчас вызову охрану! Идите мешайте кому-нибудь другому!',
                    topics : ['pass', 'end']
                },
                pass_reply : {
					text_en : '- And what should I do now? Dance?!',
					text_ru : '– И что я должна вам? Мне теперь танцевать чтоли?!',
                    topics : ['restore', 'end']
                },
                go_sit : {
					text_en : '– Go and sit on the bench. I see what I can do...',
					text_ru : '– Идите, посидите на лавочке, пока я посмотрю что можно сделать...',
                    script : ()=>{
						player.klavdiaAsk = true
					},
                    topics : ['end']
                },
                ask_reply1 : {
					text_en : '- Slowly, little by little. I`m sitting here, I watch all sorts of things.',
					text_ru : '– Потихоньку-помальеньку. Сижу тут, смотрю как ходят всякие.',
                    topics : ['ask2', 'end']
                },
                ask_reply2 : {
					text_en : '- Not really. I am sitting, solving crossword puzzles. Look at my friends - retired whiners. I have nothing to complain about.',
					text_ru : 'Не очень. Сижу разгадываю кроссворды. Чо мне сделается то? Вон у подруг моих вообще работы нет – сидят на пенсии. А мне грех жаловаться.',
                    topics : ['ask3', 'end']
                },
                ask_reply3 : {
					text_en : 'Ah, whatever. I`m still alive, thank God, thats all that matters.',
					text_ru : 'Хорошо не хорошо, но пока жива, слава богу.',
                    topics : ['restore_succes', 'end']
                },
                go : {
					text_en : 'The woman sighs heavily, then presses the button. The turnstile opens. You can enter now.',
					text_ru : 'Женщина устало вздыхает, но всё-таки нажимает на заветную кнопку. Красный огонёк турникета сменяется зелёным, теперь вы можете пройти.',
                },
                anger : {
					text_en : '- You again?',
					text_ru : 'Опять ты?',
                    topics : ['what'],
                }
            },
            topics : {
                library : {
					text_en : 'Ask if you can go to the library.',
					text_ru : 'Спросить, можно ли вам пройти в библиотеку.',
                    reply : 'library_reply',
                },
                pass : {
					text_en : 'Admit that you have lost your student ID.',
					text_ru : 'Признаться, что вы потеряли студенческий пропуск.',
                    script : ()=>{
						player.klavdiaAnger += 1
					},
                    reply : 'pass_reply',
                },
                noyoudont : {
					text_en : 'Humbly note that she has never told you about that.',
					text_ru : 'Кротко заметить, что она ещё ни разу вам про это не говорила.',
                    script : ()=>{
						player.klavdiaAnger += 1
					},
                    reply : 'noyoudont_reply'
                },
                what : {
					text_en : 'Ask if she looked at the list',
					text_ru : 'Спросить, нашла ли она вас в списке',
                    reply : 'library_reply'
                },
                ask : {
					text_en : 'Ask how her job is going.',
					text_ru : 'Спросить как идёт её служба.',
                    reply : 'ask_reply1',
                },
                ask2 : {
					text_en : 'Ask if is it hard for her to stay here all day.',
					text_ru : 'Поинтересоваться, тяжело ли сидеть тут целыми днями.',
                    reply : 'ask_reply2'
                },
                ask3 : {
					text_en : 'Say that it is wonderful, that she is doing well.',
					text_ru : 'Сказать, что это прекрасно, что у неё всё хорошо.',
                    reply : 'ask_reply3'
                },
                restore : {
					text_en : 'Ask her to find you on the list of students to pass without an ID.',
					text_ru : 'Попросить найти вас в списке студентов, чтобы пройти без пропуска.',
                    reply : 'go_sit'
                },
                restore_succes : {
					text_en : 'Politely ask her to find you on the list of students to pass without an ID.',
					text_ru : 'Вежливо попросить найти вас в списке студентов, чтобы войти без пропуска.',
                    script : ()=>{
                        cc.find("tourniquet", cc.scene.node).active = false;
                    },
                    reply : 'go'
                },
                end : {
					text_en : 'Leave further communication attempts.',
					text_ru : 'Отказаться от дальнейших попыток коммуникации.',
                }
            }
        }
    },



    parkEnter : function() {
        cc.controller.switchScene('park_basic', 'park_enterance2/entry');
    },
});

