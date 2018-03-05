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
				reply : 'ideaConverted',
				script : () => {
					idea.converted = true;
					player.pages += idea.pages;
					lastConvertedIdea = idea;
					cc.eventLoop.time += 120;
				}
			}
			ideaTopics[k]['text_' + cc.locale] = idea.topicText;
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
				text_en : () => {
					if(player.pages == 0)
						return 'Your laptop. Shining white of empty file \"grad_paper.doc\" drives you crazy.';
					if(player.pages < 40) 
						return "That's a lot of work ahead of you! Only " + player.pages + ' pages out of 100 required.';
					if(player.pages < 60) 
						return "You've definetely managed something. But it's not enough. " + player.pages + ' pages out of 100.';
					if(player.pages < 90) 
						return 'Come on, push it! You can still beat it! ' + player.pages + ' out of 100 pages.';
					if(player.pages <100) 
						return 'You\'re almost there. You just need ' + (100 - player.pages) + ' more pages.';
				},
				text_ru : () => {
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
				text_ru : ()=> "Вы написали " + lastConvertedIdea.pages + " страниц.",
				text_en : ()=> "You wrote " + lastConvertedIdea.pages + " pages.",
				script : () => {
					var replyText = lastConvertedIdea && lastConvertedIdea.replyText || '';
					if(player.internetExpired && !player.internetPaid) {
						replyText += {
							text_ru : ' Из-за отсутствия интернета у вас ушло сильно больше времени на подготовку картинок и схем и редактирование текста.',
							text_en : ' Lack of internet access slows you down - you spend twice as much time drawing you own figures and editing text.',
						}['text_' + cc.locale];
						cc.eventLoop += 60;
					}
					if(replyText.length > 0) return replyText;
				},
				topics : ideaHub,
			},
			startDone : {
				text_ru : 'Вот оно. Ваша дипломная работа наконец закончена. Теперь нужно распечатать её, одно из требований комиссии - предоставить твёрдую копию работы.',
				text_en : 'This is it, your paper is finally finished. Now you need to print a hard copy of it.',
				topics : 'copy',
			},
			end_no_idea : {
				text_ru : 'В голову совсем ничего не приходит. Какое-то время вы усиленно пялитесь в монитор, но потом ловите себя на просмторе ' + ['летсплеев ', 'стримов ', 'прохождений '].pickRandom() + ['World of Tanks', 'League of Legends', 'World of Warcraft'].pickRandom(),
				script : ()=>{
					player.stress = false;
					cc.eventLoop.time += Math.floor(Math.random() * 120 + 120);
				}
			},
			no_power : {
				text_ru : 'Аккумулятор вашего ноутбука давным давно перестал подавать признаки жизни. Без электричества продолжить работу не получится.',
				text_en : "Your laptop's battery has died long ago. There's no way it'll work without power source.",
			}
		},
		topics : {
			writeBland : {
				text_ru : "Писать диплом",
				text_en : "Work on your graduation paper",
				script : () => {
					var pages = Math.floor(Math.random() * 3 + 1);
					var replyText;
					if(player.blandPages == 0) {
						replyText = {
							text_ru:'С твёрдыми намерениями и пустой головой вы принимаетесь за работу. Разве это может быть слишком сложно? В конце концов вы обученный специалист в своей области, и пора вам доказать это всем сомневающимся.',
							text_en:"Adamant and absentminded you get down to work. This should be easy, you're a trained specialist afterall!"
						}['text_' + cc.locale];
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
				text_ru : 'Оформить титульный лист и содержание',
				text_en : 'Attach cover',
				script : () => {
					cc.eventLoop.time += 30;
				},
				reply : 'startDone'
			},
			copy : {
				text_ru : 'Скопировать диплом.doc на флешку',
				text_en : 'Copy "grad_paper.doc" to a flash drive',
			},
			end : {
				text_ru : 'Не сейчас, у меня ещё достаточно времени',
				text_en : 'Not now, I still have plenty of time',
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