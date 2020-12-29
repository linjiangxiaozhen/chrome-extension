// 向页面注入JS
function injectJs(jsPath) {
    // jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function () {
        // 放在页面不好看，执行完后移除掉
        // this.parentNode.removeChild(this);
        // jQuery加载完成再加载其他js
        if (jsPath == "js/jquery.min.js") {
            injectJs("layui/layui.all.js");
            injectJs("js/echarts.min.js");
            injectJs("js/crypto-js.min.js");
            injectJs("js/sycm-plugin.js");
        }
    };
    document.documentElement.appendChild(temp);
}

function injectCss(cssPath) {
    var temp = document.createElement('link');
    temp.setAttribute('rel', 'stylesheet');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.href = chrome.extension.getURL(cssPath);
    temp.onload = function () {

    };
    document.documentElement.appendChild(temp);
}

// 注入JS、CSS
injectJs("js/web-request-interceptor.js");
injectJs("js/jquery.min.js");
injectCss("layui/css/layui.css");
injectCss("css/sycm-plugin.css");