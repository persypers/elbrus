cc.Class({
    extends: cc.Component,

    properties: {
        activateButton : cc.Button,
        activateTarget : {
            type : require('ActiveArea'),
            default : null,
            notify : function() {
                if(this.activateTarget) {
                    this.activateButton.node.active = true;
                    this.activateButton.getComponentInChildren(cc.Label).string = this.activateTarget.actionText;
                } else {
                    this.activateButton.node.active = false;
                }
            }
        }
    },

    // use this for initialization
    onLoad: function () {
        cc.ui = this;
        this.activateButton.node.active = false;
    },

    onActivate: function() {
        if(this.activateTarget) {
            this.activateTarget.activate();
        }
    }

});
