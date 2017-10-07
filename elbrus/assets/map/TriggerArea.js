cc.Class({
    extends: cc.Component,

    properties: {
        script : "",
        dialog : "",
        handler : cc.Component.EventHandler,
    },

    onCollisionEnter : function() {
        var script = null;
        try {
            script = require(this.script);
        } catch (e) {};
        if(script) {
            script(this);
        } else if(this.dialog) {
            cc.director.getScene().getComponentInChildren('DlgController').playDialog(this.dialog);
        } else if(this.handler) {
            var comp = this.handler.target.getComponent(this.handler.component);
            comp[this.handler.handler].call(comp, this.handler.customEventData);
        }
    }
});
