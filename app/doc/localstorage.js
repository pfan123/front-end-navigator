/*!
 * VERSION: 0.1.0
 * DATE: 2016-12-12
 * GIT: https://github.com/pfan123/localstorage
 * Todo  new LocalStorage([{src:'js/zepto.js',id:"zepto", version: '1.4'}], path:'').LoadSuccess(function(){}) , 本地存储manifest需含有src、id、version字段，path为路径相对值，LoadSuccess为成功回调
 * @author: pfan, 768065158@qq.com
 **/
 
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof define === 'function' && define.cmd) {
        define(function(require, exports, module){
            module.exports = factory()
        });
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.LocalStorage = factory();
    }
}(this, function () {
    function LocalStorage(opt) {
        this.list = opt.manifest || [],
        this.path = opt.path || "",
        this.done();
    }
 
    LocalStorage.prototype = {
        constructor: LocalStorage,
        say: function () {
            alert(222)
        },

        isType: function (src) {
            var resJs = /.*\.js(?=\?|$)/i,
                resCss = /.*\.css(?=\?|$)/i;
 
            if (resJs.test(src)) return "js";
            if (resCss.test(src)) return "css";
        },
 
        loadCssJS: function (src, callback) {
            var xhr = new XMLHttpRequest();
 
            xhr.open("GET", src);
            xhr.send(null);
 
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var text = xhr.responseText;
                    callback(text)
                }
            }
        },
 
        checkLocalStorage: function (id, version, LScallback, NScallback) {
 
            //是否含有localstorage
            if (window.localStorage.getItem(id)) {
 
                //版本是否一致
                if (JSON.parse(window.localStorage.getItem(id)).version === version) {
                    LScallback()
                } else {
                    window.localStorage.removeItem(id)
                    NScallback()
                }
 
            } else {
                NScallback()
            }
 
        },
 
        writeJS: function (data) {
            var source = document.createElement('script');
            source.setAttribute("type", "text/javascript");
            source.innerHTML = data;
            document.getElementsByTagName('head')[0].appendChild(source);
        },
 
        writeCSS: function (data) {
            var source = document.createElement('style');
            source.setAttribute("type", "text/css");
            source.innerHTML = data;
            document.getElementsByTagName('head')[0].appendChild(source);
        },

        writeLocalStorage: function (id, version, data) {
            try {
                window.localStorage.setItem(id, JSON.stringify({
                    "version": version,
                    "factory": data
                }));
            } catch (e) {
                //监听localstorage内存满之后处理，pc端5M，移动端2.5M
                if (e.name === 'QUOTA_EXCEEDED_ERR' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                    // todo
                } else {
                    // todo
                }                                
            }
        }, 
 
        done: function () {
            if (!this.list.length) return false;
            var _this = this,
                len = this.list.length,
                count = 0; //加载计时器
 
            this.list.forEach(function (item) {
                var src = _this.path + item.src,
                    id = '_LS_' + item.id,
                    version = item.version || '0.0';
 
                if (_this.isType(src) === "js") {
 
                    _this.checkLocalStorage(id, version, function () {
                        _this.writeJS(JSON.parse(window.localStorage.getItem(id)).factory)
                        callNext();
 
                    }, function () {
                        _this.loadCssJS(src, function (data) {
                            _this.writeLocalStorage(id, version, data);
                            _this.writeJS(data);
                            callNext();
                        })
                    })
 
                } else if (_this.isType(src) === "css") {
 
                    _this.checkLocalStorage(id, version, function () {
                        _this.writeCSS(JSON.parse(window.localStorage.getItem(id)).factory)
                        callNext();
 
                    }, function () {
                        _this.loadCssJS(src, function (data) {
                            _this.writeLocalStorage(id, version, data);
                            _this.writeCSS(data);
                            callNext();
                        })
                    })
                }
 
                //加载完成回调
 
                function callNext() {
                    if (count < len - 1) {
                        count++;
                    } else {
                        setTimeout(function () {
                            _this.LoadSuccessCall && _this.LoadSuccessCall.call(_this);
                        }, 1000 / 60)
                    }
                }
 
            })
        },
        LoadSuccess: function (callback) {
            if (!callback) return;
            this.LoadSuccessCall = callback;
            return this;
        }
    }
 
    //暴露公共方法
    return LocalStorage;
}));