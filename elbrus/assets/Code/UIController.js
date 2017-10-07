cc.Class({
    extends: cc.Component,

    properties: {
        activateButton : cc.Button,
        activateTarget : {
            type : require('ActiveArea'),
            default : null,
            notify : function() {
                if(this.activateTarget) {
                    if(this._areaStack.indexOf(this.activateTarget) == -1) {
                        this._areaStack.push(this.activateTarget);
                    }
                    this.activateButton.node.active = true;
                    this.activateButton.getComponentInChildren(cc.Label).string = this.activateTarget.actionText;
                } else {
                    if(this._areaStack.length <= 1) {
                        this.activateButton.node.active = false;
                        this._areaStack.length = 0;    
                    } else {
                        this._areaStack.length--;
                        this.activateTarget = this._areaStack[this._areaStack.length-1];
                    }
                }
            }
        }
    },

    // use this for initialization
    onLoad: function () {
        cc.ui = this;
        this.activateButton.node.active = false;
        this._areaStack = [];
    },

    onActivate: function() {
        if(this.activateTarget) {
            this.activateTarget.activate();
        }
    }

});
