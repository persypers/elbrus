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
                        if(e.time <= 0 && !cc.player.isBusy) {
                            events.splice(i, 1);
                            e.handler();
                        }
                    }
					this.dt = dt;
                    cc.systemEvent.emit('tick', dt);
                }
            }
            
        }
    },

    // use this for initialization
    onLoad: function () {
        cc.eventLoop = this;
        setInterval(()=>{this.time++}, 100);
        this._events = [];
    },

    push : function(event) {
        if(typeof(event.time) == 'function') event.time = event.time();
		this._events.push(event);
    },

	cancel : function(event) {
		var index = this._events.indexOf(event);
		if(index != -1) {
			this._events.splice(index, 1);
		}
	}
});
