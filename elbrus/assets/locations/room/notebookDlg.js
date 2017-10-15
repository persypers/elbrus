var player = cc.player;

module.exports = function() {
	var start = () => {
		if(player.blackOut) return 'no_power';
		if(player.pages <100) return 'startHub';
		return 'startDone';
	};

	var lastConvertedIdea;
	var ideaTopics = {};
	var ideaHub = [];
	var ideas = player.ideas;
	for(let k in ideas) {
		let idea = ideas[k]
		if(idea.collected) {
			ideaTopics[k] = {
				text : idea.topicText,
				reply : 'ideaConverted',
				script : () => {
					idea.converted = true;
					player.pages += idea.pages;
					lastConvertedIdea = idea;
					cc.eventLoop.time += 120;
				}
			}
			ideaHub.push(()=>!idea.converted && k);
		}
	}
	
	if(player.pages >= 100) {
		ideaHub.push('finish');
	} else {
		ideaHub.push('writeBland');
	}

	ideaHub.push('end');

	var dlg = {
		start : start,
		replies : {
			startHub : {
				text : () => {
					if(player.pages == 0)
						return 'Ваш компьютер. Белизна открытого пустого документа "диплом.doc" режет вам глаза.';
					if(player.pages < 40) 
						return 'Да тут ещё конь не валялся! Только ' + player.pages + ' страниц из необходимых 100';
					if(player.pages < 60) 
						return 'Что-то уже написано, но работы ещё непочатый край. ' + player.pages + ' из 100 страниц.';
					if(player.pages < 90) 
						return 'Стоит поднажать, кажется ещё можно успеть. ' + player.pages + ' из 100 необходимых страниц.';
					if(player.pages <100) 
						return 'Вы почти у цели, осталось всего ' + (100 - player.pages) + ' страниц!';
				},
				topics : ideaHub,
			},
			ideaConverted : {
				text : ()=> "Вы написали " + lastConvertedIdea.pages + " страниц.",
				script : () => {
					var replyText = lastConvertedIdea && lastConvertedIdea.replyText || '';
					if(player.internetExpired && !player.internetPaid) {
						replyText += ' Из-за отсутствия интернета у вас ушло сильно больше времени на подготовку картинок и схем и редактирование текста.';
						cc.eventLoop += 60;
					}
					if(replyText.length > 0) return replyText;
				},
				topics : ideaHub,
			},
			startDone : {
				text : 'Вот оно. Ваша дипломная работа наконец закончена. Теперь нужно распечатать её, одно из требований комиссии - предоставить твёрдую копию работы.',
				topics : 'copy',
			},
			end_no_idea : {
				text : 'В голову совсем ничего не приходит. Какое-то время вы усиленно пялитесь в монитор, но потом ловите себя на просмторе ' + ['летсплеев ', 'стримов ', 'прохождений '].pickRandom() + ['World of Tanks', 'League of Legends', 'World of Warcraft'].pickRandom(),
				script : ()=>{
					player.stress = false;
					cc.eventLoop.time += Math.floor(Math.random() * 120 + 120);
				}
			},
			no_power : {
				text : 'Аккумулятор вашего ноутбука давным давно перестал подавать признаки жизни. Без электричества продолжить работу не получится.',
			}
		},
		topics : {
			writeBland : {
				text : "Писать диплом",
				script : () => {
					var pages = Math.floor(Math.random() * 3 + 1);
					var replyText;
					if(player.blandPages == 0) {
						replyText = 'С твёрдыми намерениями и пустой головой вы принимаетесь за работу. Разве это может быть слишком сложно? В конце концов вы обученный специалист в своей области, и пора вам доказать это всем сомневающимся.';
					}
					player.pages += pages;
					player.blandPages += pages;
					lastConvertedIdea = {pages : pages};
					cc.eventLoop.time += 120;
					return replyText;
				},
				reply : 'ideaConverted',
			},
			finish : {
				text : 'Оформить титульный лист и содержание',
				script : () => {
					cc.eventLoop.time += 30;
				},
				reply : 'startDone'
			},
			copy : {
				text : 'Скопировать диплом.doc на флешку',
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
	
	for(var k in ideaTopics) {
		dlg.topics[k] = ideaTopics[k];
	}
	return dlg;
}