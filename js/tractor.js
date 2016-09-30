/**
 * Created by Vinse on 2016/8/25.
 */
var Tractor = (function() {
    "use strict";
    var _isType = function(type, obj) {
        var _class = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && _class === type;
    };
    var _deepExtend = function(out) {
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];
            if (!obj)
                continue;
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (_isType('Object', obj[key]) && obj[key] !== null)
                        _deepExtend(out[key], obj[key]);
                    else
                        out[key] = obj[key];
                }
            }
        }
        return out;
    };
    var _addEvent = function(object, type, callback) {
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
        } else if (object.attachEvent) {
            object.attachEvent("on" + type, callback);
        } else {
            object["on" + type] = callback;
        }
    };

    var create = function(args) {
        var self = this;
        this.settings = {
            ele: '',
            wrapper:'',
            overflow:false,
            beforeMove: function() {},
            afterMove: function() {}
        }
        if (typeof args === 'string') {
            self.settings.ele = args;
        } else if (typeof args === 'object') {
            _deepExtend(self.settings, args);
        }
        self.settings.ele = document.querySelector(self.settings.ele);
        //判断要以什么作为边界
        self.settings.wrapper!=''?self.settings.wrapper = document.querySelector(self.settings.wrapper):self.settings.wrapper = document.body
        if(self.settings.wrapper == document.body){self.settings.overflow = true;}
        console.log(self)
        console.log( 'ontouchstart' in window)
        var mouseEvents = ( 'ontouchstart' in window) ?
        {
            down: 'touchstart',
            move: 'touchmove',
            up: 'touchend',
        } :
        {
            down: 'mousedown',
            move: 'mousemove',
            up: 'mouseup',
        };
        var dragger=null;
        _addEvent(this.settings.ele,mouseEvents.down,function(e, opts, corner){
            self.settings.beforeMove.apply(this);
            dragger=this
        })
        _addEvent(document,mouseEvents.move,function(e, opts, corner){
            if(dragger) {
                var sTop = document.documentElement.scrollTop || document.body.scrollTop;
                e = e.changedTouches ? e.changedTouches[0] : e;
                dragger.style.left = (e.clientX - self.settings.wrapper.offsetLeft - dragger.offsetWidth/2) + "px";
                dragger.style.top = (e.clientY + sTop - self.settings.wrapper.offsetTop  - dragger.offsetHeight/2 ) + "px";
                var left = parseInt(dragger.style.left);
                var top = parseInt(dragger.style.top);
                if(!self.settings.overflow){
                    // 比较坐标是否超出外围的BOX
                    if(left < 0){
                        dragger.style.left = 0 +"px";
                    }
                    if(top < 0){
                        dragger.style.top = 0+"px";
                    }
                    if(left > self.settings.wrapper.offsetWidth - self.settings.ele.offsetWidth){
                        dragger.style.left = (self.settings.wrapper.offsetWidth - self.settings.ele.offsetWidth-2 )+"px";
                    }
                    if(top >  self.settings.wrapper.offsetHeight - self.settings.ele.offsetHeight){
                        dragger.style.top =( self.settings.wrapper.offsetHeight - self.settings.ele.offsetHeight-2 )+"px";
                    }
                }
            }
        })
        _addEvent(document,mouseEvents.up,function(e, opts, corner){
            dragger=null
        })
        _addEvent(this.settings.ele,mouseEvents.up,function(e, opts, corner){
            self.settings.afterMove.apply(this);
        })
    }
    return {
        tractor:create()
    };
})();

