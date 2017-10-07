var dlg = {
	start : 'greet',
	topics : {
		greet : {
			text : 'hi there',
			reply : 'greetBack',
		},
		kick : {
			text : 'gonna kick you in the nuts!',
			reply : ()=>Math.random()>0.5 ? 'eww' : 'bye'
		}
	},
	replies : {
		greetBack : {
			text : 'hi you too, watcha doin?',
			topics : [
				'kick'
			]
		},
		eww : {
			text : 'eww, srsly?',
			topics : ['kick']
		},
		bye : {
			text : 'k, bye',
		}
	}
}

module.exports = dlg;