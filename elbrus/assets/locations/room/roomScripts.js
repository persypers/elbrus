var player = require('player')

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad : function() {
        cc.scene = this;
    },

    windowBump : function() {
        if(!this.roomWindowBumped) {
            this.roomWindowBumped = true;
            player.textField.show('Эта весна ничего у меня не вызывает.')
        }
    }
});
