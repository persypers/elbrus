var ideas = {
	genericIntro : {
		collected : true,
		converted : false,
		pages : 8,
		topicText : 'Обозначить вступление через проблематику мировой энергетики сегодня',
		replyText : "У вас неплохо получилось перейти от общего к частному - теме вашего диплома. Должно зацепить внимательного читателя.",
		collectText : 'Вам в голову пришла идея, как растянуть общие знания по теме на несколько страниц вступления к диплому.',
	}
};

ideas.forgetRandom = function() {
	var forget = ideas._array.filter((idea)=> idea.collected && !idea.converted).pickRandom();
	if(forget) {
		forget.collected = false;
	}
	return forget;
}

module.exports = ideas;