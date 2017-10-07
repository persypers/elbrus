// This class is a wrapper to hide all cocos
// loading mechanisms, because they are likely
// to change over time, as CocosCreator is being developed
var loader;

loader = {
    _loadingBatches : 0,
    _lowQueue   : [],
	_prevTime : 0,
    /**
     * we use cc.loader.loadRes for loading resources,
     * because it makes running from creator a lot more convinient
     * but there is no cc.loader.loadRes(array) method, so we implement one
     *  
     * @method load
     * @param {String|Array} urls - array of urls to load or an url string
     * @param {Function} [onDone] - completion callback, same as cc.loader.load
     * @param {Function} [onProgress] - progression callback, same as cc.loader.load
     */
    load : function(urls, preload, onDone, onProgress) {
		if(typeof(preload) == 'function') {
			onProgress = onDone;
			onDone = preload;
		}
		if(! (urls instanceof Array) ) {
			urls = [urls];
		}
		var uuids = [];
		for(var i = 0; i < urls.length; i++) {
			var uuid = cc.loader._getResUuid(urls[i]);
			if(!uuid) continue;
			uuids.push({
				type : 'uuid',
				uuid : uuid,
				res_url : urls[i]
			});
		}
		if(preload === true) {
			for(var i = 0; i < uuids.length; i++) {
				uuids[i].preload = true;
			}
		}
		this._loadingBatches ++;
		cc.loader.load(uuids, onProgress, function(err, data) {	// on done
			loader._loadingBatches--;
			for(var j = 0; j < urls.length; j++) {
				var url = urls[j];
				if(sharedResources.urlMap[url]) {
					loader.markShared(url);
				}
			}
			/*{
				var now = (new Date()).getTime();
				console.log(now - loader._prevTime, urls);
				loader._prevTime = now;
			}*/
			if(typeof(onDone) == 'function') {
				onDone(err, data);
			}
			loader._checkIdle();
		});
	},
    
	/**
	 * Same as previous, but takes uuids as arguments
	 */
	loadUuid : function(uuid, preload, onDone, onProgress) {
		if(typeof(preload) == 'function') {
			onProgress = onDone;
			onDone = preload;
		}
		if( ! (uuid instanceof Array) ) {
			uuid = uuid ? [uuid] : [];
		}
		var list = [];
		for(var i = 0; i < uuid.length; i++) {
			list.push({
				type : 'uuid',
				uuid : uuid[i]
			});
		}
		if(preload === true) {
			for(var i = 0; i < list.length; i++) {
				list[i].preload = true;
			}
		}
		this._loadingBatches ++;
		cc.loader.load(list, onProgress, function(err, data) {
			loader._loadingBatches--;
			/*{
				var now = (new Date()).getTime();
				console.log(now - loader._prevTime, data);
				loader._prevTime = now;
			}*/
			if(typeof(onDone) == 'function') {
				onDone(err, data);
			}
			loader._checkIdle();
		});
	},
    
	_checkIdle : function() {
		if(this._loadingBatches <= 0) {
			var lowUrl = this._lowQueue.shift();
			if(lowUrl) {
				loader.load(lowUrl, true);
			}
		}
	},
    
    /**
     * Queue urls for background download - they will be downloaded one by one, while there is nothing to be downloaded by load() method
     * @param {String|Array} - url or urls to be downloaded
     */
    queueLoad : function(urls) {
        if(typeof(urls) == "string" && !this.getRes(urls)) {
            this._lowQueue.push(urls);
        } else {
            for(var i = 0; i < urls.length; i++) {
                if(!this.getRes(urls[i])) this._lowQueue.push(urls[i]);
            }
        }
		this._checkIdle();
    },

	/**
	 * Stops low-priority downloads and clear queue
	 */
	abortQueue : function() {
		this._lowQueue = [];
	},

    // Any better way to get resources:// by url ?
    getRes : function(url) {
		if(url == null) {
			console.warn('Loader.getRes(null)');
			console.trace();
			return null;
		}
        return cc.loader.getRes(cc.loader._getReferenceKey(url));
    },

	/**
	 * Action that starts loading specified resources (if they're weren't started yet)
	 * and ends when resources are loaded
	 */
    loadAction : function(urls) {
        return cc.callFuncAsync(_loadActionSelector, this, urls);
    }
};

var _loadActionSelector = function(asyncAction, urls) {
	loader.load(urls, function() {
		asyncAction.complete();
	});
};

module.exports = loader;