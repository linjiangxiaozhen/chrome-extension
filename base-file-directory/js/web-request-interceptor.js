// 全局配置
var globalInterceptorCache = {}, globalUrlPrefix = "https://sycm.taobao.com";
/**
 * @Author xuyefei
 * @Description  ajax请求拦截器
 * @Date 10:55 2020/9/30
 * @Param
 * @return
 **/
var ajaxIntercepter = (function (open) {
    XMLHttpRequest.prototype.open = function (XMLHttpRequest) {
        var self = this;
        this.addEventListener("readystatechange", function () {
            // if (this.responseText.length > 0 && this.readyState == 4 && this.responseURL.indexOf('www.google.com') >= 0) {
            //
            // }
        }, false);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);

/**
 * @Author xuyefei
 * @Description  fetch请求拦截器，重写fetch方法，从reader中读数据并加以转换
 * @Date 9:25 2020/10/9
 * @Param
 * @return
 **/
var oldFetch = window.fetch;
window.fetch = function (url, initOpts) {
    return oldFetch(url, initOpts).then(function (response) {
        var reader = response.body.getReader(), responseStringData = '',
            newBodyStream = new ReadableStream({
                start(controller) {
                    // uintArray转换字符串，解决中文乱码
                    function Utf8ArrayToStr(array) {
                        var out, i, len, c, char2, char3;

                        out = "";
                        len = array.length;
                        i = 0;
                        while (i < len) {
                            c = array[i++];
                            switch (c >> 4) {
                                case 0:
                                case 1:
                                case 2:
                                case 3:
                                case 4:
                                case 5:
                                case 6:
                                case 7:
                                    // 0xxxxxxx
                                    out += String.fromCharCode(c);
                                    break;
                                case 12:
                                case 13:
                                    // 110x xxxx 10xx xxxx
                                    char2 = array[i++];
                                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                                    break;
                                case 14:
                                    // 1110 xxxx 10xx xxxx 10xx xxxx
                                    char2 = array[i++];
                                    char3 = array[i++];
                                    out += String.fromCharCode(((c & 0x0F) << 12) |
                                        ((char2 & 0x3F) << 6) |
                                        ((char3 & 0x3F) << 0));
                                    break;
                            }
                        }
                        return out;
                    }

                    // 下面的函数处理每个数据块，递归调用
                    function push() {
                        // "done"是一个布尔型，"value"是一个Unit8Array
                        reader.read().then(
                            //     ({ done, value }) => {
                            //     // 判断是否还有可读的数据？
                            //     if (done) {
                            //         // 设置全局缓存
                            //         globalInterceptorCache[response.url] = responseStringData;
                            //         // 告诉浏览器已经结束数据发送
                            //         controller.close();
                            //         return;
                            //     }
                            //     // unit8Array.push.apply(unit8Array, value);
                            //     // console.log(Utf8ArrayToStr(value));
                            //     // if (globalInterceptorCache[response.url]) {
                            //     //     globalInterceptorCache[response.url] += Utf8ArrayToStr(value);
                            //     // } else {
                            //     //     globalInterceptorCache[response.url] = Utf8ArrayToStr(value);
                            //     // }
                            //     responseStringData += Utf8ArrayToStr(value);
                            //
                            //     // console.log(value.length);
                            //     // unit8Array.
                            //     // 取得数据并将它通过controller发送给浏览器
                            //     controller.enqueue(value);
                            //     push();
                            // }
                            function ({done, value}) {
                                if (done) {
                                    // 设置全局缓存
                                    var cacheUrlKey = decodeURIComponent(response.url).replace(/&_=\S+/, "");
                                    cacheUrlKey = cacheUrlKey.replace(/&token\S+$/g, "");
                                    cacheUrlKey = cacheUrlKey.replace(/\?_=\S+$/, "");
                                    // 将拦截的数据存入localStorage中
                                    if (cacheUrlKey.indexOf("https://sycm.taobao.com/mc") == 0) {
                                        // 监控店铺-竞店列表的缓存key可直接覆盖
                                        if (cacheUrlKey.indexOf("https://sycm.taobao.com/mc/ci/shop/monitor/listShop.json") == 0 ||
                                            cacheUrlKey.indexOf("https://sycm.taobao.com/mc/live/ci/shop/monitor/listShop.json") == 0) {
                                            cacheUrlKey = "https://sycm.taobao.com/mc/ci/shop/monitor/listShop.json";
                                        }
                                        try {
                                            globalInterceptorCache[cacheUrlKey] = responseStringData;
                                            // console.log(cacheUrlKey);
                                            localStorage.setItem(cacheUrlKey, responseStringData);
                                        } catch (e) {// localStorage缓存满了，要清除缓存
                                            localStorage.clear();
                                            localStorage.setItem(cacheUrlKey, responseStringData);
                                        }
                                    }
                                    // 告诉浏览器已经结束数据发送
                                    controller.close();
                                    return;
                                }
                                // unit8Array.push.apply(unit8Array, value);
                                // console.log(Utf8ArrayToStr(value));
                                // if (globalInterceptorCache[response.url]) {
                                //     globalInterceptorCache[response.url] += Utf8ArrayToStr(value);
                                // } else {
                                //     globalInterceptorCache[response.url] = Utf8ArrayToStr(value);
                                // }
                                responseStringData += Utf8ArrayToStr(value);

                                // console.log(value.length);
                                // unit8Array.
                                // 取得数据并将它通过controller发送给浏览器
                                controller.enqueue(value);
                                push();
                            }
                        );
                    };
                    push();
                }
            });
        // var str = String.fromCharCode.apply(null, unit8Array);
        // var res = JSON.parse(str);
        // console.log(res);
        var responseProxy = new Response(newBodyStream, {
            headers: response.headers,
            status: response.status,
            statusText: response.statusText,
        });
        responseProxy.ok = true;
        responseProxy.redirected = response.redirected;
        responseProxy.type = response.type;
        responseProxy.url = response.url;
        responseProxy.bodyUsed = false;
        responseProxy.body = response.body;
        return responseProxy;
        /** // console.log(response);
         var data, firstPromise;
         firstPromise = response.text();
         return firstPromise.then(function (jsonText) {
            data = jsonText;
            console.log(data);
            var newBodyStream = new ReadableStream({
                start(controller) {
                    var bufView = new Uint8Array(new ArrayBuffer(data.length));
                    for (var i = 0; i < data.length; i++) {
                        bufView[i] = data.charCodeAt(i);
                    }

                    controller.enqueue(bufView);
                    controller.close();
                }
            });
            var responseProxy = new Response(newBodyStream, {
                headers: response.headers,
                status: response.status,
                statusText: response.statusText,
            });
            responseProxy.ok = true;
            responseProxy.redirected = response.redirected;
            responseProxy.type = response.type;
            responseProxy.url = response.url;
            responseProxy.bodyUsed = false;
            responseProxy.body = response.body;
            return responseProxy;
        });*/
    });
    // return new Promise(function (resolve, reject) {
    //     oldFetch(url, initOpts).then(function (response) {
    //         console.log(response);
    //     })
    // })
};