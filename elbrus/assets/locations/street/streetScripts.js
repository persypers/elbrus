var player = require('player');
var utils = require('Utils');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad : function() {
        cc.scene = this;
    },

    suicideFail : function() {
        if(!this._suicideFail) {
            this._suicideFail = true;
            player.textField.show('Это первый этаж. Сомнительная затея.');
        }        
    },

    room_window_dlg : function() {
        return {
            start : 'start',
            replies : {
                start : {
                    text : 'Мелкие капли дождя скатываются по стеклу в никуда.',
                    topics : ['watch', 'end', 'jump'],
                },
                jump_reply : {
                    text : 'Взобравшись на подоконник, вы в последний раз оглядели своё печальное жилище и шагнули в нежные объятия неизвестности.',
                    script : ()=>{cc.playerNode.destroy()},
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

