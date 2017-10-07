var player = require('player');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {

    },

	mountainBump : function() {
		if(player._bumpedTestMountain) {

		} else {
			player._bumpedTestMountain = true;

		}
	}
});
