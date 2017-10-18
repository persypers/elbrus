var player = require('player');
var utils = require('Utils');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad : function() {
        cc.scene = this;
    },

    tourniquet : function() {
			player.textField.show('The pass is locked by tourniquet.')
    },

	update : function() {
		var playerNode = cc.playerNode;
		if(playerNode) {
			var half = 1366 * 0.5;
			this.node.x = -Math.max(half, Math.min(this.node.width - half, playerNode.x));
		}
	},

    freebench : function() {
        if(!this._suicideFail) {
            this._suicideFail = true;
            player.textField.show('Кажется, на этой лавочке можно сосредоточиться.');
        }        
    },

    locked : function() {
        player.textField.show('Library is closed.')
    },

    benchWaiting : function() {
        return {
            start : 'start',
            replies : {
                start : {
                    text : 'Rigid bench, very typical for public institutions.', //Жесткая скамья, очень типичная для государственных учреждений
                    topics : [()=>player.klavdiaAsk && 'wait', 'end']
                },
                waited : {
                    text : 'Seems like you`ve waited enough.'
                }
            },
            topics : {
                wait : {
                    text : 'Wait for Klavdia to look up for your name (10 min)',
                    script : ()=>{
                        cc.eventLoop.time += 10;
                        player.klavdiaWaited = true;
                    },
                    reply : '',
                },
                end : {
                    text : 'Go away.'
                }
            }
        }
    },

    klavdiaDlg : function() {
        return {
            start : ()=>player.klavdiaWaited?'anger' : 'start',
            replies : {
                start : {
                    text : 'The ungainly stare of this woman literally melts you.', //Неприветливый тяжелый взгляд этой женщины буквально плавит вас.
                    topics : ['library', 'pass', 'ask', 'end'],
                },
                library_reply : {
                    text : '- Entry allowed only with student ID! How many times do I have to tell you this? Forty?', //– Вход только по студенческим пропускам. Уже 40 раз вам сказала!
                    topics : ['noyoudont', 'pass', 'ask', 'end'],
                },
                noyoudont_reply : {
                    text : '- Young man! I`ll call security now! Go get in the way of someone else!', // - Молодой человек! Я сейчас вызову охрану! Идите мешайте кому-нибудь другому!
                    topics : ['pass', 'end']
                },
                pass_reply : {
                    text : '- And what should I do now? Dance?!', //– И что я должна вам? Мне теперь танцевать чтоли?!
                    topics : ['restore', 'end']
                },
                go_sit : {
                    text : '– Go and sit on the bench. I see what I can do...', //– Идите, посидите на лавочке, пока я посмотрю что можно сделать...
                    script : ()=>{
						player.klavdiaAsk = true
					},
                    topics : ['end']
                },
                ask_reply1 : {
                    text : '- Slowly, little by little. I`m sitting here, I watch all sorts of things.', //– Потихоньку-помальеньку. Сижу тут, смотрю как ходят всякие.
                    topics : ['ask2', 'end']
                },
                ask_reply2 : {
                    text : '- Not really. I am sitting, solving crossword puzzles. Look at my friends - retired whiners. I have nothing to complain about.', // Не очень. Сижу разгадываю кроссворды. Чо мне сделается то? Вон у подруг моих вообще работы нет – сидят на пенсии. А мне грех жаловаться.
                    topics : ['ask3', 'end']
                },
                ask_reply3 : {
                    text : 'Ah, whatever. I`m still alive, thank God, thats all that matters.', //Хорошо не хорошо, но пока жива, слава богу.
                    topics : ['restore_succes', 'end']
                },
                go : {
                    text : 'The woman sighs heavily, then presses the button. The turnstile opens. You can enter now.' //Нет русика
                },
                anger : {
                    text : '- You again?',
                    topics : ['what'],
                }
            },
            topics : {
                library : {
                    text : 'Ask if you can go to the library.', //Спросить, можно ли вам пройти в библиотеку.
                    reply : 'library_reply',
                },
                pass : {
                    text : 'Admit that you have lost your student ID.', //Признаться, что вы потеряли студенческий пропуск.
                    script : ()=>{
						player.klavdiaAnger += 1
					},
                    reply : 'pass_reply',
                },
                noyoudont : {
                    text : 'Humbly note that she has never told you about that.', //Кротко заметить, что она ещё ни разу вам про это не говорила.
                    script : ()=>{
						player.klavdiaAnger += 1
					},
                    reply : 'noyoudont_reply'
                },
                what : {
                    text : 'Ask if she looked at the list',
                    reply : 'library_reply'
                },
                ask : {
                    text : 'Ask how her job is going.', //Спросить как идёт её служба.
                    reply : 'ask_reply1',
                },
                ask2 : {
                    text : 'Ask if is it hard for her to stay here all day.', //Поинтересоваться тяжело ли сидеть тут целыми днями.
                    reply : 'ask_reply2'
                },
                ask3 : {
                    text : 'Say that it is wonderful, that she is doing well.', //Сказать, что это прекрасно, что у неё всё хорошо.
                    reply : 'ask_reply3'
                },
                restore : {
                    text : 'Ask her to find you on the list of students to pass without an ID.', //Попросить найти вас в списке студентов, чтобы пройти без пропуска.
                    reply : 'go_sit'
                },
                restore_succes : {
                    text : 'Politely ask her to find you on the list of students to pass without an ID.', // Вежливо попросить найти вас в списке студентов, чтобы войти без пропуска.
                    script : ()=>{
                        cc.find("tourniquet", cc.scene.node).active = false;
                    },
                    reply : 'go'
                },
                end : {
                    text : 'Leave further communication attempts.' //Отказаться от дальнейших попыток коммуникации.
                }
            }
        }
    },



    parkEnter : function() {
        cc.controller.switchScene('park_basic', 'park_enterance2/entry');
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

