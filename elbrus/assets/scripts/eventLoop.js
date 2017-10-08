var utils = require('Utils');

cc.Class({
    extends: cc.Component,

    properties: {
        _time : {
            type : 'Integer',
            default : 0,
        },
        time : {
            get : function() {
                return this._time;
            },
            set : function(value) {
                if(this._time != value) {
                    var dt = value - this._time;
                    this._time = value;
                    var events = this._events;
                    for(var i = events.length - 1; i >= 0; i--) {
                        var e = events[i];
                        e.time -= dt;
                        if(e.time <= 0) {
                            events.splice(i, 1);
                            e.handler();
                        }
                    }
                    cc.systemEvent.emit('tick', dt);
                }
            }
            
        }
    },

    // use this for initialization
    onLoad: function () {
        cc.eventLoop = this;
        setInterval(()=>{this.time++}, 1000);
        this._events = [];
    },

    push : function(event) {
        this._events.push(event);
    }

});
