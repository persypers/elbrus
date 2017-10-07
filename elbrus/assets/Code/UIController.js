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
        this._areaStack = [];
    },

    addActiveArea : function(area) {
        var index = this._areaStack.indexOf(area);
        if(index == -1) {
            this._areaStack.push(area);
        }
        this.activateTarget = area;
    },

    removeActiveArea : function(area) {
        var index = this._areaStack.indexOf(area);
        if(index != -1) {
            this._areaStack.splice(index, 1);
        }
        this.activateTarget = this._areaStack[this._areaStack.length-1];
    },

    onActivate: function() {
        if(this.activateTarget) {
            this.activateTarget.activate();
        }
    }

});
