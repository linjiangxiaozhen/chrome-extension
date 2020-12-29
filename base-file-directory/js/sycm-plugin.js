// // 全局配置
// var globalInterceptorCache = {}, globalUrlPrefix = "https://sycm.taobao.com";
// /**
//  * @Author xuyefei
//  * @Description  ajax请求拦截器
//  * @Date 10:55 2020/9/30
//  * @Param
//  * @return
//  **/
// var ajaxIntercepter = (function (open) {
//     XMLHttpRequest.prototype.open = function (XMLHttpRequest) {
//         var self = this;
//         this.addEventListener("readystatechange", function () {
//             // if (this.responseText.length > 0 && this.readyState == 4 && this.responseURL.indexOf('www.google.com') >= 0) {
//             //
//             // }
//         }, false);
//         open.apply(this, arguments);
//     };
// })(XMLHttpRequest.prototype.open);
//
// /**
//  * @Author xuyefei
//  * @Description  fetch请求拦截器，重写fetch方法，从reader中读数据并加以转换
//  * @Date 9:25 2020/10/9
//  * @Param
//  * @return
//  **/
// var oldFetch = window.fetch;
// window.fetch = function (url, initOpts) {
//     return oldFetch(url, initOpts).then(function (response) {
//         var reader = response.body.getReader(), responseStringData = '',
//             newBodyStream = new ReadableStream({
//                 start(controller) {
//                     // uintArray转换字符串，解决中文乱码
//                     function Utf8ArrayToStr(array) {
//                         var out, i, len, c, char2, char3;
//
//                         out = "";
//                         len = array.length;
//                         i = 0;
//                         while (i < len) {
//                             c = array[i++];
//                             switch (c >> 4) {
//                                 case 0:
//                                 case 1:
//                                 case 2:
//                                 case 3:
//                                 case 4:
//                                 case 5:
//                                 case 6:
//                                 case 7:
//                                     // 0xxxxxxx
//                                     out += String.fromCharCode(c);
//                                     break;
//                                 case 12:
//                                 case 13:
//                                     // 110x xxxx 10xx xxxx
//                                     char2 = array[i++];
//                                     out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
//                                     break;
//                                 case 14:
//                                     // 1110 xxxx 10xx xxxx 10xx xxxx
//                                     char2 = array[i++];
//                                     char3 = array[i++];
//                                     out += String.fromCharCode(((c & 0x0F) << 12) |
//                                         ((char2 & 0x3F) << 6) |
//                                         ((char3 & 0x3F) << 0));
//                                     break;
//                             }
//                         }
//                         return out;
//                     }
//
//                     // 下面的函数处理每个数据块，递归调用
//                     function push() {
//                         // "done"是一个布尔型，"value"是一个Unit8Array
//                         reader.read().then(
//                             //     ({ done, value }) => {
//                             //     // 判断是否还有可读的数据？
//                             //     if (done) {
//                             //         // 设置全局缓存
//                             //         globalInterceptorCache[response.url] = responseStringData;
//                             //         // 告诉浏览器已经结束数据发送
//                             //         controller.close();
//                             //         return;
//                             //     }
//                             //     // unit8Array.push.apply(unit8Array, value);
//                             //     // console.log(Utf8ArrayToStr(value));
//                             //     // if (globalInterceptorCache[response.url]) {
//                             //     //     globalInterceptorCache[response.url] += Utf8ArrayToStr(value);
//                             //     // } else {
//                             //     //     globalInterceptorCache[response.url] = Utf8ArrayToStr(value);
//                             //     // }
//                             //     responseStringData += Utf8ArrayToStr(value);
//                             //
//                             //     // console.log(value.length);
//                             //     // unit8Array.
//                             //     // 取得数据并将它通过controller发送给浏览器
//                             //     controller.enqueue(value);
//                             //     push();
//                             // }
//                             function ({done, value}) {
//                                 if (done) {
//                                     // 设置全局缓存
//                                     var cacheUrlKey = decodeURIComponent(response.url).replace(/&_=\S+/, "");
//                                     cacheUrlKey = cacheUrlKey.replace(/&token\S+$/g, "");
//                                     // 将拦截的数据存入localStorage中
//                                     if (cacheUrlKey.indexOf("https://sycm.taobao.com/mc") == 0) {
//                                         // 监控店铺-竞店列表的缓存key可直接覆盖
//                                         if (cacheUrlKey.indexOf("https://sycm.taobao.com/mc/ci/shop/monitor/listShop.json") == 0 ||
//                                             cacheUrlKey.indexOf("https://sycm.taobao.com/mc/live/ci/shop/monitor/listShop.json") == 0) {
//                                             cacheUrlKey = "https://sycm.taobao.com/mc/ci/shop/monitor/listShop.json";
//                                         }
//                                         try {
//                                             globalInterceptorCache[cacheUrlKey] = responseStringData;
//                                             // console.log(cacheUrlKey);
//                                             localStorage.setItem(cacheUrlKey, responseStringData);
//                                         } catch (e) {// localStorage缓存满了，要清除缓存
//                                             localStorage.clear();
//                                             localStorage.setItem(cacheUrlKey, responseStringData);
//                                         }
//                                     }
//                                     // 告诉浏览器已经结束数据发送
//                                     controller.close();
//                                     return;
//                                 }
//                                 // unit8Array.push.apply(unit8Array, value);
//                                 // console.log(Utf8ArrayToStr(value));
//                                 // if (globalInterceptorCache[response.url]) {
//                                 //     globalInterceptorCache[response.url] += Utf8ArrayToStr(value);
//                                 // } else {
//                                 //     globalInterceptorCache[response.url] = Utf8ArrayToStr(value);
//                                 // }
//                                 responseStringData += Utf8ArrayToStr(value);
//
//                                 // console.log(value.length);
//                                 // unit8Array.
//                                 // 取得数据并将它通过controller发送给浏览器
//                                 controller.enqueue(value);
//                                 push();
//                             }
//                         );
//                     };
//                     push();
//                 }
//             });
//         // var str = String.fromCharCode.apply(null, unit8Array);
//         // var res = JSON.parse(str);
//         // console.log(res);
//         var responseProxy = new Response(newBodyStream, {
//             headers: response.headers,
//             status: response.status,
//             statusText: response.statusText,
//         });
//         responseProxy.ok = true;
//         responseProxy.redirected = response.redirected;
//         responseProxy.type = response.type;
//         responseProxy.url = response.url;
//         responseProxy.bodyUsed = false;
//         responseProxy.body = response.body;
//         return responseProxy;
//         /** // console.log(response);
//          var data, firstPromise;
//          firstPromise = response.text();
//          return firstPromise.then(function (jsonText) {
//             data = jsonText;
//             console.log(data);
//             var newBodyStream = new ReadableStream({
//                 start(controller) {
//                     var bufView = new Uint8Array(new ArrayBuffer(data.length));
//                     for (var i = 0; i < data.length; i++) {
//                         bufView[i] = data.charCodeAt(i);
//                     }
//
//                     controller.enqueue(bufView);
//                     controller.close();
//                 }
//             });
//             var responseProxy = new Response(newBodyStream, {
//                 headers: response.headers,
//                 status: response.status,
//                 statusText: response.statusText,
//             });
//             responseProxy.ok = true;
//             responseProxy.redirected = response.redirected;
//             responseProxy.type = response.type;
//             responseProxy.url = response.url;
//             responseProxy.bodyUsed = false;
//             responseProxy.body = response.body;
//             return responseProxy;
//         });*/
//     });
//     // return new Promise(function (resolve, reject) {
//     //     oldFetch(url, initOpts).then(function (response) {
//     //         console.log(response);
//     //     })
//     // })
// };

/**
 * @Author xuyefei
 * @Description  公共模块，提供公共方法
 * @Date 11:05 2020/9/8
 **/
var commonModule = (function () {
    /**
     * @Author xuyefei
     * @Description  指标代码与名称的映射关系配置
     * @Date 10:59 2020/7/31
     **/
    var indexCodeToNameMapping = {
            cltHits: {originalName: "收藏人气", newName: "收藏人数"},
            tradeIndex: {originalName: "交易指数", newName: "交易金额"},
            clickHits: {originalName: "点击人气", newName: "点击人数"},
            seIpvUvHits: {originalName: "搜索人气", newName: "搜索人数"},
            cartHits: {originalName: "加购人气", newName: "加购人数"},
            payRateIndex: {originalName: "支付转化指数", newName: "支付转化率"},
            payByrCntIndex: {originalName: "客群指数", newName: "支付人数"},
            sePvIndex: {originalName: "搜索热度", newName: "搜索次数"},
            uvIndex: {originalName: "流量指数", newName: "访客人数"},
            clickHot: {originalName: "点击热度", newName: "点击次数"},
            slrCnt: {originalName: "卖家数"},
            paySlrCnt: {originalName: "有支付卖家数"},
            payItemCnt: {originalName: "支付商品数", synonymousName: "支付件数"}
        },
        shopUserInfo = {
            mainUserId: "",// 用户id
            legalityToken: "", // 合法token令牌
            storeName: ""// 店铺名称
        },
        /**
         * @Author xuyefei
         * @Description  统一定义dom节点的class、id、名称等属性
         * @Date 14:28 2020/9/9
         **/
        defaultDocumentNamesConfig = {
            // 弹出框内容的最外层容器className
            dialogContentWrapperClassName: "wxr-tool-dialog-content-wrapper",
            // 弹出框中表格上方的检索框className
            dialogTableSearchInputClassName: "wxr-tool-table-search-input",
            // 注入按钮的容器className
            buttonsInjectContainerClassName: "wxr-tool-buttons-inject-container",
            // 自定义的分页栏className
            selfDefinePageBar: "wxr-tool-self-define-page-bar",
            // 工具名称
            toolName: "叶飞测试：",
            toolNameContainerClassName: "wxr-tool-name-container"
        },
        /**
         * @Author xuyefei
         * @Description  默认的弹出框配置项
         * @Date 14:18 2020/9/9
         **/
        defaultDialogOptions = {
            type: 1, title: "", area: ['85%', '70%'], shade: 0.4, maxmin: false, content: "",
            shadeClose: true, resize: false,
            // zIndex: layui.layer.zIndex,// offset: ['100px'],
            hideBodyScrollBarAfterSuccess: true // 自定义扩展字段，默认打开弹出框后隐藏body的滚动条
        },
        /**
         * @Author xuyefei
         * @Description  默认的表格渲染配置参数
         * @Date 20:34 2020/7/6
         * @Param
         * @return
         **/
        defaultRenderTableOptions = {
            id: "",
            elem: "",
            height: '500px',
            data: [],
            page: false, //开启分页
            limit: Number.MAX_VALUE,
            toolbar: "<div><div style='position: absolute;bottom: 2px;right: 10px;width:auto;white-space: nowrap'><div class='layui-input-inline' style='padding-right: 10px;position: relative'><input class='wxr-tool-table-search-input layui-input' placeholder='请输入检索关键字' style='padding: 0px 10px 0px 30px'><i class='layui-icon layui-icon-search' style='color: #1E9FFF;position: absolute;top: 9px;left: 8px;line-height: 16px;font-size: 16px;'></i></div>" +
                "<button style='position: relative;' type='button' class='layui-btn layui-btn-primary layui-btn-sm' lay-event='LAYTABLE_COLS'><i class='layui-icon layui-icon-cols'></i>数据列筛选</button>" +
                "<button style='position: relative;' type='button' class='layui-btn layui-btn-primary layui-btn-sm' lay-event='LAYTABLE_EXPORT'><i class='layui-icon layui-icon-export'></i>数据导出</button>" +
                "<button style='position: relative;' type='button' class='layui-btn layui-btn-primary layui-btn-sm' lay-event='LAYTABLE_PRINT_MY'><i class='layui-icon layui-icon-print'></i>打印</button></div></div>",
            // toolbar: true,
            cols: [],
            defaultToolbar: [],
            done: function (res, curr, count) {

            },
            skin: 'line',
            // even: true,
            size: 'sm'
        },
        commonColors = {
            hex: [
                '#279dff','#F4CB29','#f07a08','#d223e7',
                '#d1242c','#27c32a','#f34f9a','#a1d674',
                '#2535e8','#feeb5e','#8428E7','#D96D04',
                '#FE3B08','#03f144','#F3BCEC','#25c0bd'
            ],
            rgb: [
                '39,157,255','244,203,41','240,122,8','210,35,231',
                '209,36,44','39,195,42','243,79,154','161,214,116',
                '37,53,232','254,235,94','132,40,231','217,109,4',
                '254,59,8','3,241,68','243,188,236','37,192,189'
            ]
        },
        defaultLineChartOptions = {
            legend: {
                orient: 'vertical',
                right: '2%',
                bottom: 20,
                textStyle: {
                    fontSize: 12
                },
                width: 180,
                height: 230,
                type: 'scroll',
                // borderWidth: 2
                // icon: "roundRect"
                formatter: function (name) {
                    if (name.indexOf("(") != -1) {// 括号中的文字不要显示
                       return name.split("(")[0];
                    } else {
                        return name;
                    }
                }
            },
            grid: {
                top: 10,
                left: '12%',
                right: '12%',
                bottom: 5,
                containLabel: true
            },
            color: commonColors.hex,
            tooltip: {
                trigger: 'axis',
                axisPointer: {

                },
                position: function (point, params, dom, rect, size) {
                    // 固定在顶部
                    var left = point[0] + 20;
                    if (point[0] > (size.viewSize[0] / 2)) {
                        left = point[0] - size.contentSize[0] - 20;
                    }
                    return [left, '20%'];
                },
                backgroundColor: "#fff",
                textStyle: {
                    color: "black",
                    fontSize: 14
                },
                extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                padding: 10,
                formatter: function (params) {
                    var finalHtml = "<table class='echarts-tool-tip-table'><tr><td colspan='3'>", xName;
                    for (var index in params) {
                        var singleLineParam = params[index];
                        var color = singleLineParam.color, seriesName = singleLineParam.seriesName,
                            value = singleLineParam.value;
                        if (index == 0) {
                            finalHtml += singleLineParam.name + "</td></tr>";
                        }
                        // if (singleLineParam.seriesName == "支付转化率" || singleLineParam.seriesName == "点击率") {
                        //     value = value + "%";
                        // }
                        if (value == "undefined" || value == "NaN" || value == undefined || isNaN(value)) {
                            value = "-";
                        } else {
                            if (/率$/.test(singleLineParam.seriesName) || /占比$/.test(singleLineParam.seriesName) ||
                                /率\)$/.test(singleLineParam.seriesName) || /占比\)$/.test(singleLineParam.seriesName)) {
                                value = (value * 1).toFixed(2) + "%";
                            }
                        }
                        if (seriesName.indexOf("(") != -1) {// 括号中的文字不要显示
                            seriesName = seriesName.split("(")[0];
                        }
                        finalHtml += "<tr><td><span class='layui-badge-dot' style='background: " + color + "'></span></td>"
                            + "<td style='text-align: left;padding-left: 5px;padding-right: 20px'>" + seriesName
                            + ":</td><td style='text-align: right;padding-left: 20px'>" + value + "</td></tr>";
                    }
                    return finalHtml + "</table>";
                }
            },
            animationDuration: function (idx) {
                return 600;
            }
        };

    function openUserInfoDialog() {
        alert("待处理");
    }

    function searchInputEventBind(currentTableDom, totalRows) {
        var searchInputDom = currentTableDom.find(".layui-table-tool .wxr-tool-table-search-input"),
            inputCompletedFlag = true;
        searchInputDom.on("compositionstart", function () {
            inputCompletedFlag = false;
        });
        searchInputDom.on("compositionend", function () {
            inputCompletedFlag = true;
        });
        searchInputDom.on("input propertychange", function () {
            var searchText = searchInputDom.val();
            if (!searchText) {
                currentTableDom.find(".wxr-table-td-search-active").removeClass("wxr-table-td-search-active");
                currentTableDom.find(".layui-table-body table tr").removeClass("wxr-table-tr-search-hide");
                currentTableDom.next(".wxr-table-bottom-info-bar").find(".wxr-table-bottom-info-search-count").text("");
                return;
            }
            setTimeout(function () {
                if (inputCompletedFlag) {
                    currentTableDom.find(".wxr-table-td-search-active").removeClass("wxr-table-td-search-active");
                    // 获取所有tbody中的数据，只获取文本
                    var searchRows = 0;
                    currentTableDom.find(".layui-table-body table tr").each(function (index, item) {
                        var searchCount = 0;
                        $(this).find("td").each(function (index, item) {
                            if ($(item).text().indexOf(searchText) != -1) {
                                $(item).addClass("wxr-table-td-search-active");
                                searchCount++;
                            }
                        });
                        if (searchCount == 0) {
                            $(this).addClass("wxr-table-tr-search-hide");
                        } else {
                            $(this).removeClass("wxr-table-tr-search-hide");
                            searchRows++;
                        }
                    });
                    var tableAfter = currentTableDom.next(".wxr-table-bottom-info-bar");
                    if (tableAfter.length > 0) {
                        var searchCountDiv = tableAfter.find(".wxr-table-bottom-info-search-count");
                        // if (searchRows < totalRows) {
                        searchCountDiv.text("当前检索" + searchRows + "条数据");
                        // } else {
                        //     searchCountDiv.text(" ");
                        // }
                    }
                }
            }, 10);
        });
    }

    // 递归找寻多级表头所有子列
    function findChildColumn(thDocument, currentTableDom, headArray) {
        var colspan = thDocument.attr("colspan"), dataKey = thDocument.attr("data-key"),
            dataParentKey = dataKey.substring(dataKey.indexOf("-") + 1);
        if (colspan > 1) {// 存在子列
            var childColumns = currentTableDom.find(".layui-table-header tr:visible").find("th[data-parentkey=" + dataParentKey + "]");
            if (childColumns.length > 0) {
                $.each(childColumns, function (index, item) {
                    findChildColumn($(item), currentTableDom, headArray);
                })
            } else {
                headArray.push(thDocument.text());
            }
        } else {
            headArray.push(thDocument.text());
        }
    }

    // function exportEventBind(currentTableDom) {
    //     var exportBtn = currentTableDom.find(".layui-table-tool").find("*[lay-event='LAYTABLE_EXPORT']"),
    //         openPanel = $("<div class='wxr-export-panel'><ul><li type='csv'>导出到 Csv 文件</li><li type='xls'>导出到 Excel 文件</li></ul></div>");
    //     // 点击时显示下拉框
    //     exportBtn.on("click", function () {
    //         if (exportBtn.find(".wxr-export-panel").length == 0) {
    //             exportBtn.append(openPanel);
    //         }
    //         openPanel.css({top: $(this).height() + 5});
    //         openPanel.show();
    //     });
    //     // blur事件隐藏下拉框
    //     exportBtn.on("blur", function () {
    //         var openPanel = exportBtn.find(".wxr-export-panel");
    //         openPanel.hide(1);
    //     });
    //     openPanel.find("li").on("click", function () {
    //         var type = $(this).attr("type"), headArray = [], bodyArray = [];
    //         currentTableDom.find(".layui-table-header tr .layui-table-cell").each(function () {
    //             headArray.push($(this).text());
    //         });
    //         currentTableDom.find(".layui-table-body tr:visible").each(function () {
    //             var rowArray = [];
    //             $(this).find(".layui-table-cell").each(function () {
    //                 rowArray.push($(this).text());
    //             });
    //             bodyArray.push(rowArray);
    //         });
    //         openPanel.hide(1);
    //         layui.table.exportFile(headArray, bodyArray, type);
    //     });
    // }

    function printEventBind(currentTableDom) {
        var printBtn = currentTableDom.find(".layui-table-tool").find("*[lay-event='LAYTABLE_PRINT_MY']");
        if (printBtn.length > 0) {
            printBtn.on("click", function () {
                // 新打开一个窗口
                var printWin = window.open('打印窗口', '_blank')
                    , style = ['<style>'
                    , 'body{font-size: 12px; color: #666;}'
                    , 'table{width: 100%; border-collapse: collapse; border-spacing: 0;}'
                    , 'th,td{line-height: 20px; padding: 9px 15px; border: 1px solid #ccc; text-align: left; font-size: 12px; color: #666;}'
                    , 'a{color: #666; text-decoration:none;}'
                    , '*.layui-hide{display: none}',
                    , '.wxr-image-box{width: 36px;height: 36px;margin-right: 4px;border-radius: 50%;overflow: hidden;border: #D9D9D9 1px solid;}',
                    , '.layui-table-cell li{line-height: 20px;} li {list-style: none}',
                    , '</style>'].join(''), html = $("<table></table>");
                html.append(currentTableDom.find(".layui-table-header table").html());
                html.append(currentTableDom.find(".layui-table-body table").html());
                printWin.document.write(style + html.prop('outerHTML'));
                printWin.document.close();
                printWin.print();
                printWin.close();
            });
        }
    }

    // 绘制表格底部的信息栏
    function drawTableBottomInfoBar(currentTableDom, options) {
        var tableAfter = currentTableDom.next(".wxr-table-bottom-info-bar"),
            dataLength = currentTableDom.find(".layui-table-body tr").length;
        if (tableAfter.length <= 0) {
            var infoBar = $("<div class='wxr-table-bottom-info-bar'>" +
                "<div class='wxr-table-bottom-info-total-count'>共" + dataLength + "条数据</div>" +
                "<div class='wxr-table-bottom-info-search-count'> </div>" +
                "<div class='wxr-table-bottom-page-number-bar'></div></div>");
            currentTableDom.after(infoBar);
        } else {// 更新数据数量
            tableAfter.find(".wxr-table-bottom-info-total-count").text("共" + dataLength + "条数据");
        }
        // 绘制pageNumberBar
        if (options.selfPage) {
            currentTableDom.next(".wxr-table-bottom-info-bar").find(".wxr-table-bottom-page-number-bar").append("<div id='" + options.selfPage.elementId + "'></div>");
            var pageNo = $(options.selfPage.targetClickDom).find(".alife-dt-card-common-table-pagination-wrapper .ant-pagination-item-active").text(),
                maxPageNo = $(options.selfPage.targetClickDom).find(".alife-dt-card-common-table-pagination-wrapper .ant-pagination-item").last().text();
            if (!pageNo) {
                pageNo = 1;
            }
            if (!maxPageNo) {
                maxPageNo = 1;
            }
            if (maxPageNo <= 1) {
                return;
            }
            layui.laypage.render({
                elem: options.selfPage.elementId,
                layout: ['page'],
                curr: pageNo,
                limit: 10,
                count: maxPageNo * 10,
                // limits: [5, 10, 20, 50, 100],
                jump: function (obj, first) {
                    // 页码添加未缓存标志
                    $("#" + options.selfPage.elementId + " .layui-laypage a").each(function (index) {
                        var pageData = options.selfPage.data.pages[$(this).text()];
                        if (!pageData) {
                            $(this).css("position", "relative");
                            $(this).append("<i class='layui-badge-dot' style='position: absolute;top:4px;right: 2px'></i>");
                        }
                    });
                    if (!first) {
                        // 同步点击生意参谋页面的第几页按钮
                        $(options.selfPage.targetClickDom).find(".alife-dt-card-common-table-pagination-wrapper .ant-pagination-item").each(function (index) {
                            if ($(this).text() == obj.curr) {
                                $(this).trigger("click");
                                if (options.selfPage.data.pages[obj.curr]) {
                                    return;
                                }
                                var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0}), count = 0;
                                function myTimer() {
                                    var timer = setTimeout(function () {
                                        if (options.selfPage.afterClickCallback) {
                                            options.selfPage.afterClickCallback();
                                        }
                                        if (!options.selfPage.data.pages[obj.curr]) {
                                            count++;
                                            if (count > 20) {
                                                layui.layer.msg('数据获取超时，请刷新页面后再次尝试，', {
                                                    offset: 't',
                                                    anim: 6
                                                });
                                                layui.layer.close(loading);
                                                return;
                                            }
                                            myTimer();
                                        } else {
                                            layui.table.reload(options.id, {data: options.selfPage.data.total});
                                            layui.layer.close(loading);
                                        }
                                    }, 500);
                                }
                                myTimer();
                            }
                        });
                    }
                }
            });
        }
        // selfPage: {// 自定义扩展属性
        //     pagesData: moduleCache.tableData[moduleCache.activeTabCode].pages,// 分页数据
        //         totalData: moduleCache.tableData[moduleCache.activeTabCode].total,
        //         elementId: moduleCache.selfPageElementId,
        //         // 同步点击的生意参谋按钮
        //         targetClickDom: $(".mc-marketMonitor .alife-dt-card-common-table-pagination-wrapper .ant-pagination-item"),
        //         currentPageNo: moduleCache.currentPageNo,
        //         maxPageNo: moduleCache.maxPageNo,
        //         afterClickCallback: function () {
        //         assembleCacheKey();
        //         assembleCacheData();
        //         transformData();
        //     }
        // }
    }

    // 处理表格中的图片放大效果
    function enlargeImage(emptyOptions) {
        $(".layui-table-view[lay-id='" + emptyOptions.id + "']").find(".wxr-image-box-36").each(function (index, item) {
            var that = this, tip;
            $(this).on("mouseenter", function () {
                var imageSrc = $(this).attr("src");
                // $(that).parent().css("position", "relative");
                // $(that).before("<div class='scale-img' style='pointer-events: none;position: absolute;z-index: 200000;left: 0;top: 0'>" +
                //                                 //     "<img src='" + imageSrc + "' style='width: auto;height: auto;'/></div>");
                tip = layui.layer.tips("<img src='" + imageSrc + "' style='width: auto;height: auto;max-width: 250px;max-height: 250px'/>", that, {
                    tips: [4, '#FFFFFF'], //还可配置颜色
                    area: ["auto", "auto"],
                    time: 0
                });
            });
            $(this).on("mouseleave", function () {
                layui.layer.close(tip);
            });
            $(this).on("error", function () {
                $(this).attr("src", "//img.alicdn.com/tps/TB1P1W_LXXXXXXoXVXXXXXXXXXX-74-74.png_48x48.jpg");
            });
        });
    }

    // 为百分比浮动数据增加颜色
    function colorIncreasePercentText(currentTableDom) {
        currentTableDom.find(".wxr-table-increase-percent-text").each(function (index, item) {
            var text = $(this).text();
            if (text.indexOf("%") == -1) {
                return true;
            }
            try {
                var number = Number(text.replace("%", "")), color = "#999999";
                if (number > 0) {
                    if (text.indexOf("+") == -1) {
                        $(this).text("+" + text);
                    }
                    if (number > 30) {
                        color = "red";
                    }
                } else if (number < 0) {
                    if (number < -30) {
                        color = "green";
                    }
                }

                $(this).css({color: color});
            } catch (e) {
                return true;
            }
        });
    }

    function resetStyleAfterSort(tableRenderOptions) {
        if (tableRenderOptions.layFilter) {
            layui.table.on("sort(" + tableRenderOptions.layFilter + ")", function (obj) {
                layui.table.reload(tableRenderOptions.id, {
                    initSort: obj
                });
            })
        }
    }

    // function addChangeLineFlagForExport(currentTableDom) {
    //     currentTableDom.find(".layui-table-cell li").each(function (index, item) {
    //         $(this).append("<span>dfddfdfdfdf</span>");
    //     });
    // }

    function specialStringConvert(currentTableDom) {
        // currentTableDom.find(".layui-table-cell").each(function (index, item) {
        // if ($(this).html().indexOf("NaN") != -1) {
        //     $(this).html($(this).html().replace("NaN", "-"));
        // }
        // if ($(this).html().indexOf("undefined") != -1) {
        //     $(this).html($(this).html().replace("undefined", "-"));
        // }
        // })
    }

    // 将不存在的数据转为-（包括""、NaN、undefined、null）,同时可将百分比数据格式化
    function formatTableCellTextForNotExist(tableRenderOptions) {
        // cols是二维数组
        var cols = tableRenderOptions.cols;
        for (var i in cols) {
            var fieldArray = cols[i];
            $.each(fieldArray, function (index, fieldItem) {
                // 不能包含多列，且没有定义templet函数
                if (!fieldItem.hasOwnProperty("colspan") && !fieldItem.hasOwnProperty("templet")) {
                    fieldItem.templet = function (row) {
                        if (row[fieldItem.field] === "" || String(row[fieldItem.field]).indexOf("NaN") != -1
                            || row[fieldItem.field] == undefined || row[fieldItem.field] == null
                            || String(row[fieldItem.field]).indexOf("Infinity") != -1) {
                            return "-";
                        }
                        if (!isNaN(row[fieldItem.field]) && fieldItem.isPercentValue) {// 是否是百分比数值
                            try {
                                return row[fieldItem.field].toFixed(2) + "%";
                            } catch (e) {
                                return row[fieldItem.field];
                            }
                        }
                        return row[fieldItem.field];
                    }
                }
            })
        }
    }

    // function changeTableRowColor(currentTableDom) {
        // currentTableDom.find(".layui-table-body tr").each(function (index, item) {
        //     if (index % 2 == 1) {
        //         $(this).addClass("wxr-table-row-change-color");
        //     }
        // })
    // }

    /**
     * @Author xuyefei
     * @Description  统一处理表格的实际高度
     * @Date 15:46 2020/12/5
     * @Param  currentTableDom:当前表格jQuery对象; layerObj:弹出框DOM； isResize:是否由resize事件触发
     * @return
     **/
    function resetTableHeight(currentTableDom, layerObj, isResize) {
        // dialog内容去的高度
        if (!layerObj) {
            return;
        }
        // alert.log(layerObj);
        var dialogContentHeight = $(layerObj).find(".layui-layer-content").outerHeight();
        // console.log("dialogContentHeight:" + dialogContentHeight);
        // 遍历当前表格的所有同辈元素
        var tableRealHeight = 0, otherSiblingsTotalHeight = 0;
        currentTableDom.siblings().each(function (index, item) {
            // console.log($(item).outerHeight());
            if ($(item).css("position") == "absolute") {
                return true;
            }
            // console.log($(item).css("margin-top"));
            otherSiblingsTotalHeight += $(item).outerHeight();
            var marginTop = Number($(item).css("margin-top").replace("px", "")),
                marginBottom = Number($(item).css("margin-bottom").replace("px", ""));
            if (marginTop > 0) {
                otherSiblingsTotalHeight += marginTop;
            }
            if (marginBottom > 0) {
                otherSiblingsTotalHeight += marginBottom;
            }
        });
        tableRealHeight = dialogContentHeight - otherSiblingsTotalHeight - 4;
        var minHeight = 400;
        // if (isResize) {
        //     minHeight = 200;
        // } else {
        //     minHeight = 500;
        // }
        if (tableRealHeight < minHeight) {
            tableRealHeight = minHeight;
        }
        // tableRealHeight = minHeight;
        currentTableDom.height(tableRealHeight);
        var tableBox = currentTableDom.find(".layui-table-box"), tableBoxSiblingsTotalHeight = 0;
        tableBox.siblings().each(function (index, item) {
            if (item.tagName.toLowerCase() === "style") {
                return true;
            }
            tableBoxSiblingsTotalHeight += $(item).outerHeight();
        });
        tableBox.height(tableRealHeight - tableBoxSiblingsTotalHeight);
        var tableHeaderHeight = currentTableDom.find(".layui-table-header").outerHeight();
        currentTableDom.find(".layui-table-body").height(tableRealHeight - tableBoxSiblingsTotalHeight - tableHeaderHeight);
        // console.log($(layerObj).find(".wxr-tool-dialog-content-wrapper").outerHeight());
    }

    return {
        renderTable: function (tableRenderOptions, layerObj) {
            try {
                var emptyOptions = {};
                $.extend(emptyOptions, defaultRenderTableOptions, tableRenderOptions);
                // 将不存在的数据转为-（包括""、NaN、undefined、null）
                formatTableCellTextForNotExist(emptyOptions);
                // 保存自定义done函数
                var tableRenderDoneCallback = emptyOptions.done;
                emptyOptions.done = function () {
                    // 默认操作
                    var currentTableDom = $(".layui-table-view[lay-id='" + emptyOptions.id + "']");
                    // 隔行换色，layui默认的隔行换色导致多级表头也隔行换色，不好用
                    // changeTableRowColor(currentTableDom);// 此处不需要了，使用css控制
                    // 绘制表格底部的信息栏
                    drawTableBottomInfoBar(currentTableDom, emptyOptions);
                    // 放在信息栏绘制完毕之后，否则会少计算底部信息栏的高度
                    if (layerObj) {
                        resetTableHeight(currentTableDom, layerObj);
                    }
                    window.addEventListener("resize", function () {
                        resetTableHeight(currentTableDom, layerObj, true);
                    });
                    // 检索框绑定事件
                    searchInputEventBind(currentTableDom, emptyOptions.data.length);
                    // 导出按钮事件重写
                    // exportEventBind(currentTableDom);
                    // 打印按钮事件重写，layui自带的打印样式有问题
                    printEventBind(currentTableDom);
                    // 处理表格中的图片放大效果
                    enlargeImage(emptyOptions);
                    // 为百分比内容添加颜色
                    colorIncreasePercentText(currentTableDom);
                    // NaN、undefined特殊字符转换成-
                    // specialStringConvert(currentTableDom);
                    // 表格中如果有多行数据，给每行数据的文本后面加上\n，方便导出时换行
                    // addChangeLineFlagForExport(currentTableDom);
                    // 解决排序后丢失样式的问题
                    resetStyleAfterSort(emptyOptions);
                    // 如果有done事件
                    if (tableRenderDoneCallback) {
                        tableRenderDoneCallback();
                    }
                    // 1、修改默认按钮的样式：导出、列筛选、打印
                    // var defaultLayEvents = ['LAYTABLE_EXPORT', 'LAYTABLE_COLS', 'LAYTABLE_PRINT'];
                    // $.each(defaultLayEvents, function (index, item) {
                    //     var btn = currentTableDom.find(".layui-table-tool-self *[lay-event='" + item + "']");
                    //     if (btn.length > 0) {
                    //         var textName;
                    //         if (item == 'LAYTABLE_EXPORT') {
                    //             textName = "数据导出";
                    //         } else if (item == 'LAYTABLE_COLS') {
                    //             textName = "数据列筛选";
                    //         } else if (item == 'LAYTABLE_PRINT') {
                    //             textName = "打印";
                    //         }
                    //         btn.css({width: "auto", height: "36px", lineHeight: "26px"});
                    //         btn.append(textName);
                    //     }
                    // })
                    /**var currentTableDom = $(".layui-table-view[lay-id='" + emptyOptions.id + "']"), tableToolDom;
                     currentTableDom.css({marginTop: "0px"});
                     // table渲染完成后绘制自定义表格工具栏
                     if (emptyOptions.selfDefineToolBarRight || emptyOptions.selfDefineToolBarLeft) {
                    tableToolDom = $("<div class='wxr-self-define-table-tool'><div class='wxr-self-define-table-tool-left'></div>" +
                        "<div class='wxr-self-define-table-tool-right'></div></div>");
                    currentTableDom.before(tableToolDom);
                }
                     if (emptyOptions.selfDefineToolBarRight) {
                    tableToolDom.find(".wxr-self-define-table-tool-right").html(emptyOptions.selfDefineToolBarRight);
                }
                     if (emptyOptions.selfDefineToolBarLeft) {
                    tableToolDom.find(".wxr-self-define-table-tool-left").html(emptyOptions.selfDefineToolBarLeft);
                }
                     // 特殊处理一下导出、列筛选、打印按钮
                     // 导出
                     // exportEventBind(tableToolDom, currentTableDom);
                     // // 列筛选
                     // // 打印
                     // printEventBind(tableToolDom, currentTableDom);
                     // // 为搜索框绑定事件
                     // searchInputEventBind(tableToolDom, currentTableDom);
                     // 执行用户自定义的done函数
                     tableRenderDoneCallback();
                     // 处理表格中的图片放大效果
                     $(".layui-table-view[lay-id='" + emptyOptions.id + "']").find(".wxr-image-box-36").each(function (index, item) {
                    var  that = this, tip;
                    $(this).on("mouseenter", function () {
                        var imageSrc = $(this).attr("src");
                        // $(that).parent().css("position", "relative");
                        // $(that).before("<div class='scale-img' style='pointer-events: none;position: absolute;z-index: 200000;left: 0;top: 0'>" +
                        //                                 //     "<img src='" + imageSrc + "' style='width: auto;height: auto;'/></div>");
                        tip = layui.layer.tips("<img src='" + imageSrc + "' style='width: auto;height: auto;max-width: 250px;max-height: 250px'/>", that, {
                            tips: [4, '#FFFFFF'], //还可配置颜色
                            area: ["auto", "auto"],
                            time: 0
                        });
                    });
                    $(this).on("mouseleave", function () {
                        layui.layer.close(tip);
                    });
                    $(this).on("error", function () {
                        $(this).attr("src", "//img.alicdn.com/tps/TB1P1W_LXXXXXXoXVXXXXXXXXXX-74-74.png_48x48.jpg");
                    });
                });*/
                };
                return layui.table.render(emptyOptions);
            } catch (error) {
                console.error(error);
            }
        },
        renderLineCharts: function (lineChartOptions, chartInstance, yAxisCount) {
            var emptyOptions = {};
            if (!yAxisCount) {
                yAxisCount = 1;
            }
            // 多个y轴，只显示第一个即可
            var yAxisArray = [];
            for (var i = 0 ; i < yAxisCount; i++) {
                var yAxis = {
                    type: 'value',
                    show: i ==0 ? true : false,
                    splitNumber: 4,
                    axisLine: {
                        show: false// 隐藏Y轴
                    },
                    axisTick: {
                        show: false// 隐藏刻度
                    },
                    splitLine: {    //网格线
                        lineStyle: {
                            type: 'dashed'    //设置网格线类型 dotted：虚线
                        },
                        show: true //隐藏或显示
                    },
                    axisLabel: {
                        show: false
                    }
                };
                yAxisArray.push(yAxis);
            }
            emptyOptions.yAxis = yAxisArray;
            $.extend(emptyOptions, defaultLineChartOptions, lineChartOptions);
            chartInstance.setOption(emptyOptions, true);
            // chartInstance.resize();
            window.addEventListener("resize", function () {
                chartInstance.resize();
            });
        },
        getDefaultDocumentNamesConfig: function () {
            return defaultDocumentNamesConfig;
        },
        getChartColors: function () {
            return commonColors;
        },
        getCacheFailTip: function () {
            layui.layer.msg('缓存数据获取失败，请重新刷新页面', {
                offset: 't',
                anim: 6
            });
        },
        /**
         * @Author xuyefei
         * @Description  生成时间周期
         * @Date 10:54 2020/7/20
         * @Param endTimeStr: 如2020/07/03
         * @return
         **/
        generateStatisticTimes: function (dataLength, endTimeStr, dateType) {
            // 实时
            if (endTimeStr == "today") {
                return ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
                    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
            }
            var dateRangeEndPoint = endTimeStr.replace(/-/g, "/"),
                dateTimes = [];
            // 计算时间周期
            for (var i = 0; i < dataLength; i++) {
                var endDate = new Date(dateRangeEndPoint);
                // 按天计算
                if (dateType == "recent7" || dateType == "recent30" || dateType == "day") {
                    endDate.setDate(endDate.getDate() - i);
                    dateTimes.push(endDate.getFullYear() + "-" + ((endDate.getMonth() + 1) < 10 ? "0"
                        + (endDate.getMonth() + 1) : (endDate.getMonth() + 1)) + "-" + (endDate.getDate() < 10 ?
                        "0" + endDate.getDate() : endDate.getDate()));
                } else if (dateType == "week") {// 按周计算
                    endDate.setDate(endDate.getDate() - i * 7);
                    // 当前年的1月1日
                    var tempDate = new Date(endDate.getFullYear() + "/01/01"), timeGap = endDate - tempDate,
                        daysOfYear, weekOfYear;
                    daysOfYear = Math.ceil(timeGap / (24 * 60 * 60 * 1000));
                    weekOfYear = Math.ceil(daysOfYear / 7);
                    dateTimes.push(endDate.getFullYear() + "年 第" + weekOfYear + "周");
                } else if (dateType == "month") {// 按月计算
                    // 去结束时间的当前月的1日，因为如果结束时间是31日，不是每个月都有31日的
                    endDate.setDate(1);
                    endDate.setMonth(endDate.getMonth() - i);
                    dateTimes.push(endDate.getFullYear() + "-" + (((endDate.getMonth() + 1) < 10) ? "0" + (endDate.getMonth() + 1) : (endDate.getMonth() + 1)));
                }
            }
            return dateTimes.reverse();
        },
        /**
         * @Author xuyefei
         * @Description  对含有指数的对象进行转化，如tradeIndex:{value: 1, cycleCrc: 0.5},转化之后给对象添加tradeIndexValue
         * 和tradeIndexCycleCrc属性，并对value进行指数转换
         * @Date 15:53 2020/10/13
         * @Param
         * @return
         **/
        indexCodeValueTransform: function (data) {
            // var regIndex = new RegExp("Index$"), regHits = new RegExp("Hits$"), regHot = new RegExp("Hot$");
            // for (var prop in data) {
            //     if (regIndex.test(prop) || regHits.test(prop) || regHot.test(prop)) {// 指数
            //         if (typeof data[prop] === "object") {// 对象属性
            //             for (var innerProp in obj[prop]) {
            //                 // 新属性的名称
            //                 var newPropName = prop + innerProp.replace(innerProp[0], innerProp[0].toUpperCase),
            //                     convertedValue;
            //                 if (innerProp == "value") {
            //                     if (prop == "payRateIndex") {// 支付转化率特殊处理一下
            //                         convertedValue = this.calculateFormula(data[prop][innerProp], 0, 8);
            //                     } else {
            //                         convertedValue = this.calculateFormula(data[prop][innerProp], 1, 0);
            //                     }
            //                     data[newPropName] = convertedValue;
            //                 } else {
            //                     // Number(null)结果为0，Number(undefined)结果为NaN
            //                     if (data[prop][innerProp] == null) {
            //                         data[newPropName] = null;
            //                     } else {
            //                         data[newPropName] = Number(data[prop][innerProp]);
            //                     }
            //                 }
            //             }
            //         } else {// 普通属性
            //             var convertedValue;
            //             if (prop == "payRateIndex") {// 支付转化率特殊处理一下
            //                 convertedValue = this.calculateFormula(data[prop][innerProp], 0, 8);
            //             } else {
            //                 convertedValue = this.calculateFormula(data[prop][innerProp], 1, 0);
            //             }
            //             data[prop + "Value"] = convertedValue;
            //         }
            //     }
            // }
            // 转化常用指标指数
            try {
                var value;
                // 收藏人气---->收藏人数
                if (data.cltHits != null && data.cltHits != undefined) {
                    value = data.cltHits;
                    if (typeof data.cltHits === "object") {
                        value = data.cltHits.value;
                    }
                    data.cltHitsValue = commonModule.calculateFormula(value, 1, 0);
                }
                // 支付转化指数---->支付转化率
                if (data.payRateIndex != null && data.payRateIndex != undefined) {
                    value = data.payRateIndex;
                    if (typeof data.payRateIndex === "object") {
                        value = data.payRateIndex.value;
                    }
                    data.payRateIndexValue = commonModule.calculateFormula(value, 0, 8);
                } else if (data.payRate != null && data.payRate != undefined) {
                    value = data.payRate;
                    if (typeof data.payRate === "object") {
                        value = data.payRate.value;
                    }
                    data.payRateIndexValue = Number((data.payRate * 100).toFixed(2));
                }
                // 搜索人气---->搜索人数
                if (data.seIpvUvHits != null && data.seIpvUvHits != undefined) {
                    value = data.seIpvUvHits;
                    if (typeof data.seIpvUvHits === "object") {
                        value = data.seIpvUvHits.value;
                    }
                    data.seIpvUvHitsValue = commonModule.calculateFormula(value, 1, 0);
                }
                // 流量指数|点击人气---->访客人数|点击人数
                if (data.uvIndex != null && data.uvIndex != undefined) {
                    value = data.uvIndex;
                    if (typeof data.uvIndex === "object") {
                        value = data.uvIndex.value;
                    }
                    data.uvIndexValue = commonModule.calculateFormula(value, 1, 0);
                } else if (data.clickHits != null && data.clickHits != undefined) {
                    value = data.clickHits;
                    if (typeof data.clickHits === "object") {
                        value = data.clickHits.value;
                    }
                    data.uvIndexValue = commonModule.calculateFormula(value, 1, 0);
                }
                // 交易指数---->交易额
                if (data.tradeIndex != null && data.tradeIndex != undefined) {
                    value = data.tradeIndex;
                    if (typeof data.tradeIndex === "object") {
                        value = data.tradeIndex.value;
                    }
                    data.tradeIndexValue = commonModule.calculateFormula(value, 1, 0);
                }
                // 加购人气---->加购人数
                if (data.cartHits != null && data.cartHits != undefined) {
                    value = data.cartHits;
                    if (typeof data.cartHits === "object") {
                        value = data.cartHits.value;
                    }
                    data.cartHitsValue = commonModule.calculateFormula(value, 1, 0);
                }
                // 以下为计算结果
                // 支付人数
                if (data.uvIndexValue != null && data.uvIndexValue != undefined
                    && data.payRateIndexValue != null && data.payRateIndexValue != undefined) {
                    data.payByrCnt = Math.round(data.uvIndexValue * data.payRateIndexValue / 100);
                }
                // 客单价
                if (data.tradeIndexValue != null && data.tradeIndexValue != undefined &&
                    data.payByrCnt != null && data.payByrCnt != undefined) {
                    data.perTicketSales = Number((data.tradeIndexValue / data.payByrCnt).toFixed(2));
                }
                // 收藏率
                if (data.cltHitsValue != null && data.cltHitsValue != undefined
                    && data.uvIndexValue != null && data.uvIndexValue != undefined) {
                    data.cltCntRate = Number((data.cltHitsValue / data.uvIndexValue * 100).toFixed(2));
                }
                // 搜索占比
                if (data.seIpvUvHitsValue != null && data.seIpvUvHitsValue != undefined &&
                    data.uvIndexValue != null && data.uvIndexValue != undefined) {
                    data.seIpvUvHitsRate = Number((data.seIpvUvHitsValue / data.uvIndexValue * 100).toFixed(2));
                }
                // 加购率
                if (data.cartHitsValue != null && data.cartHitsValue != undefined &&
                    data.uvIndexValue != null && data.uvIndexValue != undefined) {
                    data.addCartRate = Number((data.cartHitsValue / data.uvIndexValue * 100).toFixed(2));
                }
                // UV价值
                if (data.tradeIndexValue != null && data.tradeIndexValue != undefined &&
                    data.uvIndexValue != null && data.uvIndexValue != undefined) {
                    data.uvValue = Number((data.tradeIndexValue / data.uvIndexValue).toFixed(2));
                }
                // 支付件数
                if (data.payItemCnt != null && data.payItemCnt != undefined) {
                    data.payItemCntValue = Number(data.payItemCnt.value);
                }
            } catch (e) {
                console.error(e);
            }
        }
        ,
        // 萃取URL地址的参数
        extractLocationParams: function (location) {
            var extractResult = {};
            var usableString;
            if (typeof location == "string") {
                var markIndex = location.indexOf("?");
                if (markIndex == -1) {
                    return null;
                } else {
                    usableString = location.slice(markIndex + 1);
                }
            } else if (location instanceof Location) {
                usableString = location.search.slice(1);
            }
            usableString = decodeURIComponent(usableString);
            if (usableString.indexOf("=") == -1) {
                return null;
            }
            var splitArray = usableString.split("&");
            for (var i = 0; i < splitArray.length; i++) {
                var tempArray = splitArray[i].split("=");
                if (tempArray.length == 2) {
                    extractResult[tempArray[0]] = tempArray[1];
                }
            }
            return extractResult;
        },
        // 解析店铺类目名称获取类目id
        parseShopCateName: function (cateName) {
            // 获取cateId，globalInterceptorCache，直接从缓存中获取shopCate
            var shopCateArray = [];
            for (var key in globalInterceptorCache) {
                if (key.indexOf("/mc/common/getShopCate.json?") != -1) {
                    var decodeCache = commonModule.getUsableOriginalJsonDataFromCache(key, true);
                    if (decodeCache) {
                        shopCateArray.push.apply(shopCateArray, decodeCache);
                        // break;
                    }
                }
            }
            var currentCateName, firstCateName;
            if (cateName && cateName.indexOf(">") != -1) {
                var tempArray = cateName.split(">");
                currentCateName = $.trim(tempArray[tempArray.length - 1]),
                    firstCateName = $.trim(tempArray[0]);
            } else {
                currentCateName = $.trim(cateName);
            }
            for (var index in shopCateArray) {
                var cateItem = shopCateArray[index];
                if (cateItem) {
                    if (cateItem[2] === currentCateName) {
                        if (firstCateName) {
                            if (firstCateName === cateItem[7]) {
                                return cateItem;
                            }
                        } else {
                            return cateItem;
                        }
                    }
                }
            }
            return null;
        },
        /**
         * @Author xuyefei
         * @Description  注入按钮组
         * @Date 11:54 2020/9/8
         * @Param targetDom 目标节点，jQuery对象
         * @Param position:在目标节点的位置，对应jQuery的prepend,after,append,before等方法
         * @Param buttons:[{btnName:'',className:'', clickEventFunction: function, cssStyle: ""}],clickEventFunction必须是无参
         * @Param injectUserInfoBtn: 默认true
         * @Param injectCompleteCallback 注入成功后的回调函数，必须无参
         **/
        injectButtons: function (targetDom, position, buttons, injectUserInfoBtn, injectCompleteCallback) {
            try {
                if (!buttons) {
                    return;
                }
                if (!targetDom) {
                    return;
                }
                // 按钮已经注入,先判断内部是否已存在，主要针对append和prepend操作
                if (targetDom.find("." + defaultDocumentNamesConfig.buttonsInjectContainerClassName).length > 0) {
                    return;
                }
                if (position == "before" || position == "after") {
                    if (targetDom.parent().find("." + defaultDocumentNamesConfig.buttonsInjectContainerClassName).length > 0) {
                        return;
                    }
                }
                var injectBtnsContainer = $("<div class=\"" + defaultDocumentNamesConfig.buttonsInjectContainerClassName + "\">"
                    + "<span class='" + defaultDocumentNamesConfig.toolNameContainerClassName + "'>" + defaultDocumentNamesConfig.toolName + "</span></div>");
                $.each(buttons, function (index, item) {
                    var html = "<button' class='layui-btn layui-btn-normal layui-btn-sm'";
                    if (item.cssStyle) {
                        html += " style='" + item.cssStyle + "'>" + item.btnName + "</button>";
                    } else {
                        html += "'>" + item.btnName + "</button>";
                    }
                    var buttonJqueryObj = $(html);
                    buttonJqueryObj.on("click", function () {
                        if (item.clickEventFunction) {
                            item.clickEventFunction();
                        }
                    });
                    injectBtnsContainer.append(buttonJqueryObj);
                });
                // 需要注入“用户信息”按钮
                if (injectUserInfoBtn) {
                    var userInfoButtonDom = $("<button class=\"layui-btn layui-btn-warm layui-btn-sm\">用户信息</button>");
                    userInfoButtonDom.on("click", openUserInfoDialog);
                    injectBtnsContainer.append(userInfoButtonDom);
                }
                targetDom[position](injectBtnsContainer);
                if (injectCompleteCallback) {
                    injectCompleteCallback(targetDom);
                }
            } catch (error) {
                console.log(error)
            }
        },
        /**
         * @Author xuyefei
         * @Description  获取店铺相关信息
         * @Date 11:23 2020/9/8
         **/
        getShopUserInfo: function () {
            try {
                if (!shopUserInfo.mainUserId || !shopUserInfo.legalityToken || !shopUserInfo.storeName) {
                    var content = $("meta[name='microdata']").attr("content"),
                        contentArray = !content ? [] : content.split(";");
                    for (var index in contentArray) {
                        var temp = contentArray[index].split("=");
                        if (temp.length == 2) {
                            if (temp[0] == "mainUserId") {
                                shopUserInfo.mainUserId = temp[1];
                            } else if (temp[0] == "legalityToken") {
                                // 合法的token
                                shopUserInfo.legalityToken = temp[1];
                            }
                        }
                    }
                    var storeName = $(".ebase-frame-header-changeShopWrapper .ebase-Frame__title").text();
                    shopUserInfo.storeName = storeName;
                }
                return shopUserInfo;
            } catch (e) {
                console.log(e);
                return null;
            }
        },
        /**
         * @Author xuyefei
         * @Description  打开弹出框
         * @Date 10:45 2020/9/9
         **/
        openDialog: function (options) {
            try {
                if (!options) {
                    return;
                }
                var emptyOptions = {};
                // 合并配置项
                $.extend(emptyOptions, defaultDialogOptions, options);
                // content外面包裹一层自定义class的div
                var container = "<div class='" + defaultDocumentNamesConfig.dialogContentWrapperClassName + "'>";
                container += emptyOptions.content + "</div>";
                emptyOptions.content = container;
                if (emptyOptions.hideBodyScrollBarAfterSuccess) {
                    var endCallbackFunc = emptyOptions.end, successCallbackFunc = emptyOptions.success;
                    emptyOptions.end = function () {
                        // 关闭对话框时显示body滚动条
                        $("body").css("overflow", "auto");
                        if (endCallbackFunc) {
                            endCallbackFunc();
                        }
                    }, emptyOptions.success = function (index, layero) {
                        try {
                            // 打开对话框时隐藏body滚动条
                            $("body").css("overflow", "hidden");
                            $(".layui-layer-title").css({border: "none", background: "none"});
                            if (successCallbackFunc) {
                                successCallbackFunc(index, layero);
                            }
                        } catch (e) {

                        }
                    }
                }
                layui.layer.open(emptyOptions);
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @Author xuyefei
         * @Description  获取缓存key中分页和排序部分的参数
         * @Date 10:05 2020/9/28
         * @Param targetDom table所在的目标板节点，jQuery对象
         * @return
         **/
        getCachePageAndSortParams: function (targetDom) {
            // 分页参数
            var resultParams = {},
                pageSize = targetDom.find(".alife-dt-card-common-table-page-size-wrapper .ant-select-selection-selected-value").text(),
                pageNo = targetDom.find(".alife-dt-card-common-table-pagination-wrapper .ant-pagination-item-active").text(),
                maxPageNo = targetDom.find(".alife-dt-card-common-table-pagination-wrapper .ant-pagination-item").last().text();
            if (!pageNo) {
                pageNo = 1;
            }
            if (!maxPageNo) {
                maxPageNo = 1;
            }
            resultParams.pageSize = pageSize, resultParams.pageNo = pageNo, resultParams.maxPageNo = maxPageNo;
            // 排序参数
            var indexCode = "", order, orderBy;
            targetDom.find(".ant-table-thead .alife-dt-card-common-table-sortable-th").each(function () {
                var className = $(this).attr("class");
                var classNameSplitArray = className.split(" ")[1].split("-"),
                    thisIndexCode = classNameSplitArray[classNameSplitArray.length - 1];
                indexCode += "," + thisIndexCode;
                var sortActiveDom = $(this).find(".alife-dt-card-common-table-sortable-icon-wrapper i[class*='active']");
                if (sortActiveDom.length > 0) {
                    orderBy = thisIndexCode;
                    if (sortActiveDom.attr("class").indexOf("-up-") !== -1) {
                        order = "asc";
                    } else {
                        order = "desc"
                    }
                }
            });
            if (indexCode) {
                indexCode = indexCode.substring(1);
            }
            resultParams.indexCode = indexCode, resultParams.order = order, resultParams.orderBy = orderBy;
            return resultParams;
        },
        // 从本地缓存中获取有用的原始数据,isDecrypt:是否需要解密, isOriginalCache:是否是原始缓存（生意参谋之前的缓存）
        getUsableOriginalJsonDataFromCache: function (cacheKey, isDecrypt, isOriginalCache) {
            try {
                // if (isOriginalCache) {
                //     var localCache = localStorage.getItem(cacheKey);
                //     if (localCache) {
                //         var formatJsonData = localCache.replace(/\d+\|/, "").replace(/\\"/g, "\""),
                //             jsonData = $.parseJSON(formatJsonData.substr(1, formatJsonData.length - 2)),
                //             decodeJsonData = $.parseJSON(this.decryptJson(jsonData['value']['_d']));
                //         // if (decodeJsonData.hasOwnProperty("length")) {
                //         //     if (decodeJsonData.length <= 0) {
                //         //         return null;
                //         //     }
                //         // }
                //         return decodeJsonData;
                //     }
                //     return localCache;
                // } else {
                    // 先从globalInterceptorCache中获取，获取不到再从全局缓存中获取一次，两次都获取不到则没有缓存
                    var localCacheData = globalInterceptorCache[cacheKey];
                    if (!localCacheData) {
                        localCacheData = localStorage.getItem(cacheKey);
                    }
                    if (localCacheData) {
                        var jsonData = $.parseJSON(localCacheData), decodeJsonData;
                        if (isDecrypt) {
                            try {
                                decodeJsonData = $.parseJSON(this.decryptJson(jsonData.data));
                            } catch (e) {
                                decodeJsonData = jsonData.data;
                            }
                        } else {
                            decodeJsonData = jsonData.data;
                        }
                        return decodeJsonData;
                    }
                    return localCacheData;
                // }
            } catch (e) {
                console.error(e);
                return null;
            }

        },
        // 从拦截的缓存中获取数据
        getDataFromInterceptorCache: function (cacheKey) {
            try {
                var localCacheData = globalInterceptorCache[cacheKey];
                if (localCacheData) {
                    var jsonData = $.parseJSON(localCacheData),
                        decodeJsonData = $.parseJSON(this.decryptJson(jsonData.data));
                    return decodeJsonData;
                }
                return localCacheData;
            } catch (e) {
                console.error(e);
                return null;
            }
        },
        // aes解密，localStorage中的json数据可用此方法解密
        decryptJson: function (word) {
            var key = CryptoJS.enc.Utf8.parse("w28Cz694s63kBYk4");
            var iv = CryptoJS.enc.Utf8.parse("4kYBk36s496zC82w");
            var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
            var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
            var decrypt = CryptoJS.AES.decrypt(srcs, key, {
                iv: iv,
                padding: CryptoJS.pad.Pkcs7
            });
            var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
            return decryptedStr.toString();
        },
        checkObjValueIsValid: function (obj) {
            if (typeof obj != "undefined" && obj != null) {
                if (typeof obj == "string") {
                    if (obj != '') {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            } else {
                return false;
            }
        },
        getCompareText: function (dateType) {
            var compareText;
            switch (dateType) {
                case "recent7":
                    compareText = "较前7日";
                    break;
                case "recent30":
                    compareText = "较前30日";
                    break;
                case "day":
                    compareText = "较前一日";
                    break;
                case "week":
                    compareText = "较前一周";
                    break;
                case "month":
                    compareText = "较前一月";
                    break;
            }
            return compareText;
        },
        // 指数计算公式,待拟合：y = 2E-05x2 + 15.244x - 155577
        calculateFormula: function (value, translateType, fixedLength) {
            if (!value) {
                return value;
            }
            var calculateResult = 0;
            if (translateType == 1) {
                // return Number((2 * Math.pow(10, -5) * Math.pow(value, 2) + 15.244 * value +
                //     -155577).toFixed(fixedLength));
                // 不同量级的数据使用不同的公式
                if (value <= 1000) {
                    calculateResult = 0.000000000000000027570905217431 * Math.pow(value, 6) -
                        0.000000000000102280780359659000 * Math.pow(value, 5) +
                        0.000000000165706379498688000000 * Math.pow(value, 4) -
                        0.000000165482004249013000000000 * Math.pow(value, 3) +
                        0.000198675149435909000000000000 * Math.pow(value, 2) +
                        0.030555078275966900000000000000 * Math.pow(value, 1) -
                        0.283196809652220000000000000000;
                } else if (value > 1000 && value <= 10000) {
                    calculateResult = 0.000000000000000000000792595938 * Math.pow(value, 6) -
                        0.000000000000000032489251220746 * Math.pow(value, 5) +
                        0.000000000000571961539524552000 * Math.pow(value, 4) -
                        0.000000006103798894193910000000 * Math.pow(value, 3) +
                        0.000091236482142164400000000000 * Math.pow(value, 2) +
                        0.083128261073697400000000000000 * Math.pow(value, 1) -
                        14.576209398134300000000000000000;
                } else if (value > 10000 && value <= 50000) {
                    calculateResult = 0.000000000000000000000000390256 * Math.pow(value, 6) -
                        0.000000000000000000087971554869 * Math.pow(value, 5) +
                        0.000000000000008743458092819500 * Math.pow(value, 4) -
                        0.000000000547452511424042000000 * Math.pow(value, 3) +
                        0.000056189848957639100000000000 * Math.pow(value, 2) +
                        0.225548809928641000000000000000 * Math.pow(value, 1) -
                        306.607918394334000000000000000000;
                } else if (value > 50000 && value <= 100000) {
                    calculateResult = 0.000000000000000000000000011760 * Math.pow(value, 6) -
                        0.000000000000000000005961314682 * Math.pow(value, 5) +
                        0.000000000000001344056568868080 * Math.pow(value, 4) -
                        0.000000000191795505093578000000 * Math.pow(value, 3) +
                        0.000046659608721811800000000000 * Math.pow(value, 2) +
                        0.357200217457409000000000000000 * Math.pow(value, 1) -
                        988.980054267921000000000000000000;
                } else if (value > 100000 && value <= 200000) {
                    calculateResult = -0.000000000000000000000092015801 * Math.pow(value, 5) +
                        0.000000000000000092190849473840 * Math.pow(value, 4) -
                        0.000000000044866380340226900000 * Math.pow(value, 3) +
                        0.000036614756442216000000000000 * Math.pow(value, 2) +
                        0.735981505474655000000000000000 * Math.pow(value, 1) -
                        7093.265064656100000000000000000000;
                } else if (value > 200000 && value <= 300000) {
                    calculateResult = 0.000000000000000006513229629970 * Math.pow(value, 4) -
                        0.000000000011982639596488400000 * Math.pow(value, 3) +
                        0.000030088119198635200000000000 * Math.pow(value, 2) +
                        1.406577040516230000000000000000 * Math.pow(value, 1) -
                        35578.004351302400000000000000000000;
                } else if (value > 300000 && value <= 400000) {
                    calculateResult = 0.000000000000000000839490559333 * Math.pow(value, 4) -
                        0.000000000004741527827234470000 * Math.pow(value, 3) +
                        0.000026595486787489800000000000 * Math.pow(value, 2) +
                        2.160060503930550000000000000000 * Math.pow(value, 1) -
                        96840.865992531000000000000000000000;
                } else if (value > 400000 && value <= 500000) {
                    calculateResult = 0.000000000000000001907179259961 * Math.pow(value, 4) -
                        0.000000000006055548279448310000 * Math.pow(value, 3) +
                        0.000027165019064675400000000000 * Math.pow(value, 2) +
                        2.061908758174260000000000000000 * Math.pow(value, 1) -
                        91940.930452673000000000000000000000;
                } else if (value > 500000 && value <= 700000) {
                    calculateResult = 0.000000000000000000970745097391 * Math.pow(value, 4) -
                        0.000000000004178024189327920000 * Math.pow(value, 3) +
                        0.000025747511864076100000000000 * Math.pow(value, 2) +
                        2.539574094049830000000000000000 * Math.pow(value, 1) -
                        152560.904799008000000000000000000000;
                } else if (value > 700000 && value <= 1000000) {
                    calculateResult = 0.000000000000000000457226397109 * Math.pow(value, 4) -
                        0.000000000002757762666516220000 * Math.pow(value, 3) +
                        0.000024268161479739600000000000 * Math.pow(value, 2) +
                        3.227433475211140000000000000000 * Math.pow(value, 1) -
                        273036.344456935000000000000000000000;
                } else if (value > 1000000 && value <= 1200000) {
                    calculateResult = 0.000000000000000000508265961220 * Math.pow(value, 4) -
                        0.000000000003090591897683620000 * Math.pow(value, 3) +
                        0.000024961561704394700000000000 * Math.pow(value, 2) +
                        2.634628749106910000000000000000 * Math.pow(value, 1) -
                        91842.652537641300000000000000000000;
                } else if (value > 1200000 && value <= 1300000) {
                    calculateResult = 0.000000000000000006254622804243 * Math.pow(value, 4) -
                        0.000000000031645024083693600000 * Math.pow(value, 3) +
                        0.000078099919872299300000000000 * Math.pow(value, 2) -
                        41.260500055107400000000000000000 * Math.pow(value, 1) +
                        13489485.084783300000000000000000000000;
                } else if (value > 1300000 && value <= 1500000) {

                } else if (value > 1500000 && value <= 1800000) {

                } else if (value > 1800000 && value <= 2000000) {

                } else if (value > 2000000 && value <= 2200000) {

                }
                if (calculateResult < 0) {
                    calculateResult = 0;
                }
                return Math.round(calculateResult);
            } else {
                if (value > 0 && value <= 1000) {
                    calculateResult = -0.000000000000000105135354926505 * Math.pow(value, 5) +
                        0.000000000000063171239560397000 * Math.pow(value, 4) -
                        0.000000001146033109812360000000 * Math.pow(value, 3) +
                        0.000011735731118257800000000000 * Math.pow(value, 2) -
                        0.000145225467230276000000000000 * Math.pow(value, 1) +
                        0.009196048538843850000000000000;
                } else if (value > 1000 && value <= 2000) {
                    calculateResult = -0.000000000000000091068132728851 * Math.pow(value, 5) +
                        0.000000000000887935214577669000 * Math.pow(value, 4) -
                        0.000000004351486596629260000000 * Math.pow(value, 3) +
                        0.000016457085547313300000000000 * Math.pow(value, 2) -
                        0.003332988158143500000000000000 * Math.pow(value, 1) +
                        0.843397014774108000000000000000;
                } else if (value > 2000 && value <= 3000) {
                    calculateResult = -0.000000000000000074225786681109 * Math.pow(value, 5) +
                        0.000000000001092927968516040000 * Math.pow(value, 4) -
                        0.000000006699863377031030000000 * Math.pow(value, 3) +
                        0.000024436037863381400000000000 * Math.pow(value, 2) -
                        0.014976059248335000000000000000 * Math.pow(value, 1) +
                        7.182652637055700000000000000000;
                } else {
                    calculateResult = 0.000000000000000542107673909151 * Math.pow(value, 5) -
                        0.000000000009283710304823890000 * Math.pow(value, 4) +
                        0.000000063037961853328900000000 * Math.pow(value, 3) -
                        0.000209427295545930000000000000 * Math.pow(value, 2) +
                        0.376357082274204000000000000000 * Math.pow(value, 1) -
                        254.229374838937000000000000000000;
                }
                if (calculateResult < 0) {
                    calculateResult = 0;
                }
                return Number(calculateResult.toFixed(fixedLength));
            }
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  监控看板--我的监控，只能设备与电脑周边两个大类目的dateType有所不同，电脑周边有月、周还有实时，实时的情况下，缓存
 * 的url中会多出live目录
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var marketMonitorOfMineModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "监控看板 | 我的监控",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        activeTabCode: "", // 选中的tab页
        tableData: {
            shop: {// 店铺数据
                pages: {},
                total: []
            },
            item: {// 商品数据
                pages: {},
                total: []
            },
            brand: {// 品牌数据
                pages: {},
                total: []
            }
        }, // 弹出框的表格需要的数据
        localCacheKey: "", // 组装好的localStorage的缓存key
        maxPageNo: 1, // 分页的最大值
        tableElementId: "market-monitor-of-mine-table", //table的dom控件的id属性
        tableLayId: "marketMonitorOfMineTable", //table在layui中定义的id，即lay-ui属性
        selfPageElementId: "market-monitor-of-mine-self-page"
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheKey();
        // 组装缓存数据
        assembleCacheData();
        // 转换指数
        transformData();
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var subTitle = $(".mc-marketMonitor .oui-card-header-item.oui-card-header-item-pull-left .oui-tab-switch-item-active").text(),
            statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + subTitle + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__top .ant-select-selection-selected-value").eq(0).text();
        var dialogOptions = {
            title: dialogTitle,
            area: ['96%', '80%'],
            // offset: "100px",
            content: "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                renderTable(layero);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    // 组装缓存key
    function assembleCacheKey() {
        // 萃取URL地址的参数
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 先找到选中的那个tab[店铺、商品、品牌]
        var activeTabName = $(".mc-marketMonitor .oui-card-header-item.oui-card-header-item-pull-left .oui-tab-switch-item-active").text(),
            // 实时的情况下添加“/live”目录
            cacheKey = "/mc" + (moduleCache.urlParams.dateType == "today" ? "/live" : "") + "/ci/",
            activeTabCode, sortedCacheKeyParam, cateId;
        switch (activeTabName) {
            case "店铺":
                activeTabCode = "shop";
                break;
            case "商品":
                activeTabCode = "item";
                break;
            case "品牌":
                activeTabCode = "brand";
                break;
        }
        moduleCache.activeTabCode = activeTabCode;
        cacheKey += activeTabCode + "/monitor/list.json?";
        // 获取cateId
        var cateIdUrl = $(".industry-tab-index .industry-index-wrapper.active .cell-links a").attr("href");
        cateId = commonModule.extractLocationParams(cateIdUrl).cateId;
        // 缓存key中按照一定顺序组装参数: device=0&sellerType=-1&cateId=11&dateRange=2020-09-27|2020-09-27&dateType=today
        sortedCacheKeyParam = "device=" + moduleCache.urlParams.device + "&sellerType=" + moduleCache.urlParams.sellerType +
            "&cateId=" + cateId + "&dateRange=" + moduleCache.urlParams.dateRange + "&dateType=" + moduleCache.urlParams.dateType;
        cacheKey += sortedCacheKeyParam;
        var cacheKeyPageAndSortParams = commonModule.getCachePageAndSortParams($(".mc-marketMonitor"));
        moduleCache.maxPageNo = cacheKeyPageAndSortParams.maxPageNo;
        moduleCache.currentPageNo = cacheKeyPageAndSortParams.pageNo;
        // 最终成型的缓存key
        cacheKey += "&pageSize=" + cacheKeyPageAndSortParams.pageSize + "&page=" + cacheKeyPageAndSortParams.pageNo +
            "&order=" + cacheKeyPageAndSortParams.order + "&orderBy=" + cacheKeyPageAndSortParams.orderBy +
            "&indexCode=" + cacheKeyPageAndSortParams.indexCode;
        moduleCache.localCacheKey = globalUrlPrefix + cacheKey;
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        // 遍历localStorage，获取所有页的缓存，注意初次找到相关缓存是需要对分页数据和汇总数据的集合进行初始化
        var count = 0;
        for (var i = 1; i <= moduleCache.maxPageNo; i++) {
            var pageCacheUrl = moduleCache.localCacheKey.replace(/&page=\S+&order=/, "&page=" + i + "&order="),
                decodeJsonData = commonModule.getUsableOriginalJsonDataFromCache(pageCacheUrl, true);
            if (decodeJsonData) {
                count++;
                var activeTabTableData = moduleCache.tableData[moduleCache.activeTabCode];
                if (count == 1) {// 初次找到相关缓存
                    activeTabTableData.pages = {}, activeTabTableData.total = [];
                }
                var finalData = decodeJsonData.data;
                if (moduleCache.urlParams.dateType == "today") {
                    finalData = decodeJsonData.data.data;
                }
                activeTabTableData.pages[i] = finalData;
                activeTabTableData.total.push.apply(activeTabTableData.total, finalData);
            }
        }
    }


    function transformData() {
        var willTransformData = moduleCache.tableData[moduleCache.activeTabCode].total;
        for (var i in willTransformData) {
            var data = willTransformData[i];
            commonModule.indexCodeValueTransform(data);
            data.cateRankIdValue = data.cateRankId ? (data.cateRankId.value ? Number(data.cateRankId.value) : 0) : 0;
        }
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var cols = [[]], heightGap = ($(window).height() * 0.2 + 104).toFixed(0);
        if (moduleCache.activeTabCode == "shop") {
            cols[0].push({
                field: "name", title: "店铺名称", minWidth: 250, templet: function (row) {
                    return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='" + row.shop.pictureUrl + "'/><span>" +
                        "<a href='" + row.shop.shopUrl + "' target='_blank' title='" + row.shop.title + "'>" + row.shop.title + "</a></span></div>";
                }
            });
        } else if (moduleCache.activeTabCode == "item") {
            cols[0].push(
                {
                    field: "name", title: "商品名称", minWidth: 250, templet: function (row) {
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' style='float: left' src='" + row.item.pictUrl + "'/>" +
                            "<ul><li><a title='" + row.item.title + "' target='_blank' href='" + row.item.detailUrl + "'>" + row.item.title + "</a>\n</li><li class='wxr-font-light-color'>" + row.shop.title + "\n</li></ul></div>";
                        // return "<div style='display: flex'><div><img class='image-box image-box-36' src='" + row.item.pictUrl + "'></div><div><div style='overflow: hidden;text-overflow: ellipsis'>" + row.item.title + "</div><div>" + row.shop.title + "</div></div></div>"
                    }
                });
        } else if (moduleCache.activeTabCode == "brand") {
            cols[0].push({
                field: "name", title: "品牌名称", minWidth: 250, templet: function (row) {
                    return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='//img.alicdn.com/tps/" + row.brandModel.logo + "'/><span>" +
                        "<a href='javascript:;' onclick='return false' target='_blank' title='" + row.brandModel.brandName + "'>" + row.brandModel.brandName + "</a></span></div>";
                }
            });
        }
        cols[0].push.apply(cols[0], [
            {
                field: "cateRankIdValue", title: "行业排名", minWidth: 110, sort: true, templet: function (row) {
                    var cateRankIdValue, cateRankIdCycleCqc, className = "wxr-font-small-normal-color";
                    if (row.cateRankId) {
                        if (row.cateRankId.value != null && row.cateRankId.value != undefined) {
                            cateRankIdValue = row.cateRankId.value;
                        } else {
                            cateRankIdValue = "-";
                        }
                        if (row.cateRankId.cycleCqc != null && row.cateRankId.cycleCqc != undefined) {
                            cateRankIdCycleCqc = row.cateRankId.cycleCqc;
                        } else {
                            cateRankIdCycleCqc = "-";
                        }
                    } else {
                        cateRankIdValue = "-", cateRankIdCycleCqc = "-";
                    }
                    if (cateRankIdCycleCqc < 0) {
                        className = "wxr-font-small-red-color";
                        cateRankIdCycleCqc = "升" + Math.abs(cateRankIdCycleCqc) + "名";
                    } else if (cateRankIdCycleCqc > 0) {
                        className = "wxr-font-small-green-color";
                        cateRankIdCycleCqc = "降" + cateRankIdCycleCqc + "名";
                    } else if (cateRankIdCycleCqc == 0) {
                        cateRankIdCycleCqc = "持平";
                    }
                    return "<ul><li>" + cateRankIdValue + "\n</li><li class='" + className + "'>" + cateRankIdCycleCqc + "\n</li></ul>";
                }
            },
            {field: "tradeIndexValue", title: "交易金额", minWidth: 110, sort: true},
            {field: "uvIndexValue", title: "访客人数", minWidth: 110, sort: true},
            {field: "seIpvUvHitsValue", title: "搜索人数", minWidth: 110, sort: true},
            {field: "cltHitsValue", title: "收藏人数", minWidth: 110, sort: true},
            {field: "cartHitsValue", title: "加购人数", minWidth: 110, sort: true},
            {field: "payRateIndexValue", title: "支付转化率", minWidth: 130, sort: true, isPercentValue: true},
            {field: "payByrCnt", title: "支付人数", minWidth: 110, sort: true}
        ]);
        if (moduleCache.activeTabCode == "item") {
            cols[0].push(
                {field: "payItemCntValue", title: "支付件数", minWidth: 110, sort: true}
            )
        }
        cols[0].push.apply(cols[0], [
            {field: "perTicketSales", title: "客单价", minWidth: 110, sort: true},
            {field: "uvValue", title: "uv价值", minWidth: 110, sort: true},
            {field: "seIpvUvHitsRate", title: "搜素占比", minWidth: 110, sort: true, isPercentValue: true},
            {field: "cltCntRate", title: "收藏率", minWidth: 110, sort: true, isPercentValue: true},
            {field: "addCartRate", title: "加购率", minWidth: 110, sort: true, isPercentValue: true}
        ]);
        // console.log(moduleCache.tableData[moduleCache.activeTabCode].total);
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: moduleCache.tableData[moduleCache.activeTabCode].total,
            height: 'full-' + heightGap,
            // showSearchInput: false,// 扩展字段
            cols: cols,
            selfPage: {// 自定义扩展属性，有此属性，可以直接生成分页按钮，格式：{pages:{}, total:[]}
                data: moduleCache.tableData[moduleCache.activeTabCode],// 包含分页数据和整体数据的集合
                elementId: moduleCache.selfPageElementId,
                // 同步点击的生意参谋按钮
                targetClickDom: ".mc-marketMonitor",
                afterClickCallback: function () {
                    assembleCacheKey();
                    assembleCacheData();
                    transformData();
                }
            },
            done: function () {

            }
        };
        var inst = commonModule.renderTable(renderTableOptions, layero);
        // window大小改变，重置table大小
        // window.addEventListener("resize", function () {
        //     var currentTableDom = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']"),
        //         // 弹出框高度 - 弹出框标题栏高度 - 表格下方信息栏高度 - 工具栏高度 - 标题列高度
        //         tableMainHeight = currentTableDom.parents(".layui-layer").height() - 84 - currentTableDom.find(".layui-table-tool").outerHeight()
        //             - currentTableDom.find(".layui-table-header").outerHeight();
        //     console.log(currentTableDom.parents(".layui-layer").height() + "--" + currentTableDom.find(".layui-table-tool").outerHeight() +
        //         "--" + currentTableDom.find(".layui-table-header").outerHeight() + "--" + tableMainHeight);
        //     currentTableDom.find(".layui-table-box .layui-table-main").css({height: tableMainHeight});
        // });
    }

    // function drawCachePageBar(heightGap, cols) {
    //     $(".wxr-table-bottom-page-number-bar").append("<div id='selfPageBar'></div>");
    //     layui.laypage.render({
    //         elem: "selfPageBar",
    //         // prev: "&#8592",
    //         // next: "&#8594",
    //         layout: ['page'],
    //         curr: moduleCache.currentPageNo,
    //         limit: 10,
    //         count: moduleCache.maxPageNo * 10,
    //         // limits: [5, 10, 20, 50, 100],
    //         jump: function (obj, first) {
    //             // 页码添加未缓存标志
    //             $("#selfPageBar .layui-laypage a").each(function (index) {
    //                 var className = $(this).attr("class"), pageNo = $(this).text();
    //                 if (className && (className.indexOf("layui-laypage-prev") != -1 ||
    //                     className.indexOf("layui-laypage-next") != -1)) {
    //                     return true;
    //                 }
    //                 var pageData = moduleCache.tableData[moduleCache.activeTabCode].pages[pageNo];
    //                 if (!pageData) {
    //                     // $(this).css({"opacity": "0.5", "filter":"alpha(opacity=50)", "background":"gray", "color":"#fff"});
    //                     $(this).css("position", "relative");
    //                     $(this).append("<i class='layui-badge-dot' style='position: absolute;top:4px;right: 2px'></i>");
    //                 }
    //             });
    //             if (!first) {
    //                 // 同步点击生意参谋页面的第几页按钮
    //                 $(".mc-marketMonitor .alife-dt-card-common-table-pagination-wrapper .ant-pagination-item")
    //                     .each(function (index) {
    //                         if ($(this).text() == obj.curr) {
    //                             var pageData = moduleCache.tableData[moduleCache.activeTabCode].pages[String(obj.curr)];
    //                             $(this).trigger("click");
    //                             if (!pageData) {// 如果当前分页数据不存在
    //                                 var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0});
    //                                 $(this).trigger("click");
    //                                 var interval = setInterval(function () {
    //                                     assembleCacheKey();
    //                                     assembleCacheData();
    //                                     transformData();
    //                                     pageData = moduleCache.tableData[moduleCache.activeTabCode].pages[String(obj.curr)];
    //                                     if (pageData) {
    //                                         clearInterval(interval);
    //                                         layui.layer.close(loading);
    //                                         var renderTableOptions = {
    //                                             id: moduleCache.tableLayId,
    //                                             elem: "#" + moduleCache.tableElementId,
    //                                             data: moduleCache.tableData[moduleCache.activeTabCode].total,
    //                                             height: "full-" + heightGap,
    //                                             // showSearchInput: false,// 扩展字段
    //                                             cols: cols
    //                                         };
    //                                         commonModule.renderTable(renderTableOptions);
    //                                     }
    //                                 }, 200);
    //                             }
    //
    //                         }
    //                     });
    //             }
    //         }
    //     });
    // }

    return {
        init: function () {
            var targetDom = $(".mc-marketMonitor .oui-card-header-item.oui-card-header-item-pull-left").eq(0),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "after", buttons, true, function () {

            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  监控看板-行业监控
 * @Date 17:21 2020/10/11
 * @Param
 * @return
 **/
var marketMonitorOfIndustryModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "监控看板 | 行业监控",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        activeTabCode: "", // 选中的tab页
        tableData: {
            shop: {// 店铺数据
                pages: {},
                total: []
            },
            item: {// 商品数据
                pages: {},
                total: []
            },
            brand: {// 品牌数据
                pages: {},
                total: []
            }
        }, // 弹出框的表格需要的数据
        localCacheKey: "", // 组装好的localStorage的缓存key
        maxPageNo: 1, // 分页的最大值
        tableElementId: "market-monitor-of-industry-table", //table的dom控件的id属性
        tableLayId: "marketMonitorOfIndustryTable", //table在layui中定义的id，即lay-ui属性
        selfPageElementId: "market-monitor-of-industry-self-page"
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheKey();
        // 组装缓存数据
        assembleCacheData();
        // 转换指数
        transformData();
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var subTitle = $(".op-mc-market-monitor-industryCard .oui-card-header-item.oui-card-header-item-pull-left .oui-tab-switch-item-active").text(),
            statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + subTitle + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__top .ant-select-selection-selected-value").eq(0).text();
        var dialogOptions = {
            title: dialogTitle,
            area: ['70%', '80%'],
            // offset: "100px",
            content: "<div id='" + moduleCache.tableElementId + "' lay-filter='list_table'></div>",
            success: function (layero, index) {
                renderTable(layero);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    // 组装缓存key
    function assembleCacheKey() {
        // 萃取URL地址的参数
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 先找到选中的哪个tab[热门店铺、热门商品、热门品牌]
        var activeTabName = $(".op-mc-market-monitor-industryCard .oui-card-header-item.oui-card-header-item-pull-left .oui-tab-switch-item-active").text(),
            // 实时的情况下添加“/live”目录
            cacheKey = "/mc/mq/monitor/cate" + (moduleCache.urlParams.dateType == "today" ? "/live/" : "/offline/"),
            activeTabCode, sortedCacheKeyParam, cateId;
        switch (activeTabName) {
            case "热门店铺":
                activeTabCode = "shop";
                cacheKey += "showTopShops.json?";
                break;
            case "热门商品":
                activeTabCode = "item";
                cacheKey += "showTopItems.json?";
                break;
            case "热门品牌":
                activeTabCode = "brand";
                cacheKey += "showTopBrands.json?";
                break;
        }
        moduleCache.activeTabCode = activeTabCode;
        // 选中的类目名称
        var selectedCateName = $(".op-mc-market-monitor-industryCard .oui-pro-common-picker .common-picker-header").attr("title"),
            selectedCateId, parsedCateItem = commonModule.parseShopCateName(selectedCateName), selectedCateId = parsedCateItem[1];
        // 缓存key中按照一定顺序组装参数: device=0&sellerType=-1&cateId=11&dateRange=2020-09-27|2020-09-27&dateType=today
        sortedCacheKeyParam = "device=" + moduleCache.urlParams.device + "&sellerType=" + moduleCache.urlParams.sellerType +
            "&cateId=" + selectedCateId + "&dateRange=" + moduleCache.urlParams.dateRange + "&dateType=" + moduleCache.urlParams.dateType;
        cacheKey += sortedCacheKeyParam;
        var cacheKeyPageAndSortParams = commonModule.getCachePageAndSortParams($(".op-mc-market-monitor-industryCard"));
        moduleCache.maxPageNo = cacheKeyPageAndSortParams.maxPageNo;
        moduleCache.currentPageNo = cacheKeyPageAndSortParams.pageNo;
        // 最终成型的缓存key
        cacheKey += "&pageSize=" + cacheKeyPageAndSortParams.pageSize + "&page=" + cacheKeyPageAndSortParams.pageNo +
            "&order=" + cacheKeyPageAndSortParams.order + "&orderBy=" + cacheKeyPageAndSortParams.orderBy +
            "&indexCode=" + cacheKeyPageAndSortParams.indexCode;
        moduleCache.localCacheKey = globalUrlPrefix + cacheKey;
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        // 遍历localStorage，获取所有页的缓存，注意初次找到相关缓存是需要对分页数据和汇总数据的集合进行初始化
        var count = 0;
        for (var i = 1; i <= moduleCache.maxPageNo; i++) {
            var pageCacheUrl = moduleCache.localCacheKey.replace(/&page=\S+&order=/, "&page=" + i + "&order="),
                decodeJsonData = commonModule.getUsableOriginalJsonDataFromCache(pageCacheUrl, true);
            if (decodeJsonData) {
                count++;
                var activeTabTableData = moduleCache.tableData[moduleCache.activeTabCode];
                if (count == 1) {// 初次找到相关缓存
                    activeTabTableData.pages = {}, activeTabTableData.total = [];
                }
                var finalData = decodeJsonData.data;
                if (moduleCache.urlParams.dateType == "today") {
                    finalData = decodeJsonData.data.data;
                }
                activeTabTableData.pages[i] = finalData;
                activeTabTableData.total.push.apply(activeTabTableData.total, finalData);
            }
        }
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var cols = [[]], heightGap = ($(window).height() * 0.2 + 104).toFixed(0);
        cols[0].push({
            field: "cateRankIdValue", title: "排名", width: 110, templet: function (row) {
                var cateRankIdValue, cateRankIdCycleCqc, className = "wxr-font-small-normal-color";
                if (row.cateRankId) {
                    if (row.cateRankId.value != null && row.cateRankId.value != undefined) {
                        cateRankIdValue = row.cateRankId.value;
                    } else {
                        cateRankIdValue = "-";
                    }
                    if (row.cateRankId.cycleCqc != null && row.cateRankId.cycleCqc != undefined) {
                        cateRankIdCycleCqc = row.cateRankId.cycleCqc;
                    } else {
                        cateRankIdCycleCqc = "-";
                    }
                } else {
                    cateRankIdValue = "-", cateRankIdCycleCqc = "-";
                }
                if (cateRankIdCycleCqc < 0) {
                    className = "wxr-font-small-red-color";
                    cateRankIdCycleCqc = "升" + Math.abs(cateRankIdCycleCqc) + "名";
                } else if (cateRankIdCycleCqc > 0) {
                    className = "wxr-font-small-green-color";
                    cateRankIdCycleCqc = "降" + cateRankIdCycleCqc + "名";
                } else if (cateRankIdCycleCqc == 0) {
                    cateRankIdCycleCqc = "持平";
                }
                return "<ul><li>" + cateRankIdValue + "\n</li><li class='" + className + "'>" + cateRankIdCycleCqc + "\n</li></ul>";
            }
        });
        if (moduleCache.activeTabCode == "shop") {
            cols[0].push({
                field: "name", title: "店铺名称", minWidth: 250, templet: function (row) {
                    return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='" + row.shop.pictureUrl + "'/><span>" +
                        "<a href='" + row.shop.shopUrl + "' target='_blank' title='" + row.shop.title + "'>" + row.shop.title + "</a></span></div>";
                }
            });
        } else if (moduleCache.activeTabCode == "item") {
            cols[0].push(
                {
                    field: "name", title: "商品名称", minWidth: 250, templet: function (row) {
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' style='float: left' src='" + row.item.pictUrl + "'/>" +
                            "<ul><li><a title='" + row.item.title + "' target='_blank' href='" + row.item.detailUrl + "'>" + row.item.title + "</a>\n</li><li class='wxr-font-light-color'>" + row.shop.title + "\n</li></ul></div>";
                        // return "<div style='display: flex'><div><img class='image-box image-box-36' src='" + row.item.pictUrl + "'></div><div><div style='overflow: hidden;text-overflow: ellipsis'>" + row.item.title + "</div><div>" + row.shop.title + "</div></div></div>"
                    }
                });
        } else if (moduleCache.activeTabCode == "brand") {
            cols[0].push({
                field: "name", title: "品牌名称", minWidth: 250, templet: function (row) {
                    return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='//img.alicdn.com/tps/" + row.brandModel.logo + "'/><span>" +
                        "<a href='javascript:;' onclick='return false' target='_blank' title='" + row.brandModel.brandName + "'>" + row.brandModel.brandName + "</a></span></div>";
                }
            });
        }
        cols[0].push.apply(cols[0], [
            {field: "tradeCntValue", title: "交易金额", minWidth: 110, sort: true},
            {field: "payRateValue", title: "支付转化率", minWidth: 130, sort: true, isPercentValue: true},
            {
                field: "tradeGrowthRangeValue", title: "交易增长幅度", minWidth: 110, sort: true, templet: function (row) {
                    var value = row.tradeGrowthRangeValue;
                    if (row.tradeGrowthRangeValue > 0) {
                        value = "+" + value;
                    }
                    return "<span class='wxr-table-increase-percent-text'>" + value + "%</span>";
                }
            }
        ]);
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: moduleCache.tableData[moduleCache.activeTabCode].total,
            height: 'full-' + heightGap,
            // showSearchInput: false,// 扩展字段
            cols: cols,
            done: function () {

            },
            selfPage: {// 自定义扩展属性，有此属性，可以直接生成分页按钮，格式：{pages:{}, total:[]}
                data: moduleCache.tableData[moduleCache.activeTabCode],// 包含分页数据和整体数据的集合
                elementId: moduleCache.selfPageElementId,
                // 同步点击的生意参谋按钮
                targetClickDom: ".op-mc-market-monitor-industryCard",
                afterClickCallback: function () {
                    assembleCacheKey();
                    assembleCacheData();
                    transformData();
                }
            }
        };
        var inst = commonModule.renderTable(renderTableOptions, layero);
    }

    function transformData() {
        var willTransformData = moduleCache.tableData[moduleCache.activeTabCode].total;
        for (var i in willTransformData) {
            var data = willTransformData[i];
            // 支付转化指数：payRateIndex---->支付转化率：payRate
            data.payRateValue = data.payRateIndex ? commonModule.calculateFormula(data.payRateIndex.value, 0, 2) : 0;
            // 交易指数：tradeIndex---->交易额:tradeCnt
            data.tradeCntValue = data.tradeIndex ? commonModule.calculateFormula(data.tradeIndex.value, 1, 0) : 0;
            // 交易增长幅度
            data.tradeGrowthRangeValue = data.tradeGrowthRange ? Number((data.tradeGrowthRange.value * 100).toFixed(2)) : 0;
        }
    }

    return {
        init: function () {
            var targetDom = $(".op-mc-market-monitor-industryCard .oui-card-header-item.oui-card-header-item-pull-right").eq(0),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "prepend", buttons, true, function () {
                $(".op-mc-market-monitor-industryCard .wxr-tool-buttons-inject-container").css("float", "none");
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  市场大盘-行业构成，表格数据不需要分页显示
 * @Date 9:17 2020/10/12
 * @Param
 * @return
 **/
var marketOverviewIndustryConstructModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "市场大盘 | 行业构成",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "market-overview-industry-construct", //table的dom控件的id属性
        tableLayId: "marketOverviewIndustryConstruct", //table在layui中定义的id，即lay-ui属性
        tableData: []
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheKey();
        // 组装缓存数据
        assembleCacheData();
        // 转换指数
        transformData();
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var subTitle = $(".mc-marketMonitor .oui-card-header-item.oui-card-header-item-pull-left .oui-tab-switch-item-active").text(),
            statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".sellerType-select .ant-select-selection-selected-value").text();
        var dialogOptions = {
            title: dialogTitle,
            area: ['80%', '80%'],
            // offset: "100px",
            content:
            // "<div class='wxr-tool-chart-box' id='market-overview-industry-construct-chart' style='height:310px'></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "-lay-filter'></div>",
            success: function (layero, index) {
                // renderChart();
                renderTable(layero);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    // 组装缓存key
    function assembleCacheKey() {
        // 解析当前URL中的参数
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        var localCacheKey = "/mc/mq/supply/deal/list.json?", sortedCacheKeyParam;
        // 缓存key中按照一定顺序组装参数: device=0&sellerType=-1&cateId=11&dateRange=2020-09-27|2020-09-27&dateType=today
        sortedCacheKeyParam = "dateRange=" + moduleCache.urlParams.dateRange + "&dateType=" + moduleCache.urlParams.dateType;
        localCacheKey += sortedCacheKeyParam;
        var cacheKeyPageAndSortParams = commonModule.getCachePageAndSortParams($("#cateCons"));
        localCacheKey += "&pageSize=" + cacheKeyPageAndSortParams.pageSize + "&page=1&order=" + cacheKeyPageAndSortParams.order
            + "&orderBy=" + cacheKeyPageAndSortParams.orderBy + "&cateId="
            + moduleCache.urlParams.cateId + "&device=" + moduleCache.urlParams.device + "&sellerType=" + moduleCache.urlParams.sellerType
            + "&indexCode=" + cacheKeyPageAndSortParams.indexCode;
        moduleCache.localCacheKey = globalUrlPrefix + localCacheKey;
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        var decodeJsonData = commonModule.getUsableOriginalJsonDataFromCache(moduleCache.localCacheKey, true);
        if (decodeJsonData) {
            moduleCache.tableData = decodeJsonData;
        } else {
            // 如果当前key未获取到结果，将key中的pageSize换成5再尝试一次
            decodeJsonData = commonModule.getUsableOriginalJsonDataFromCache(moduleCache.localCacheKey.replace(/&pageSize\S+&page/, "&pageSize=5&page"), true);
            if (decodeJsonData) {
                moduleCache.tableData = decodeJsonData;
            }
        }
    }

    function transformData() {
        var parentCateName = $(".common-picker-header").attr("title");
        if (parentCateName.indexOf(">") != -1) {
            var parentNameArray = parentCateName.split(">");
            parentCateName = parentNameArray[parentNameArray.length - 1];
        }
        for (var i in moduleCache.tableData) {
            var cateItem = moduleCache.tableData[i];
            // 类目名称
            cateItem.cateName = cateItem.cateBo.cateName;
            // 父行业类目名称
            cateItem.parentCateName = parentCateName;
            // 交易金额
            cateItem.tradeValue = commonModule.calculateFormula(cateItem.tradeIndex.value, 1, 0);
            // 支付金额较父行业占比指数
            cateItem.payAmtParentCateRateValue = Number((cateItem.payAmtParentCateRateIndex.value * 100).toFixed(2));
            cateItem.payAmtParentCateRateCycleCqc = Number((cateItem.payAmtParentCateRateIndex.cycleCqc * 100).toFixed(2));
            // // 父行业交易金额
            // cateItem.parentTradeValue = cateItem.payAmtParentCateRateIndex.value == 0 ?
            //     0 : (cateItem.tradeIndex.value / cateItem.payAmtParentCateRateIndex.value);
            // 交易增长幅度
            cateItem.tradeGrowthRangeValue = Number((cateItem.tradeGrowthRangeIndex.value * 100).toFixed(2));
            cateItem.tradeGrowthRangeCycleCrc = Number((cateItem.tradeGrowthRangeIndex.cycleCrc * 100).toFixed(2));
            // 支付子订单数较父行业占比
            cateItem.payCntParentCateRateValue = Number((cateItem.payCntParentCateRate.value * 100).toFixed(2));
            cateItem.payCntParentCateRateCycleCqc = Number((cateItem.payCntParentCateRate.cycleCqc * 100).toFixed(2));
        }
    }

    function renderChart() {
        // var chartDatas = [], legend = [],
        //     thisChart = echarts.init(document.getElementById('market-overview-industry-construct-chart'));
        // for (var index in moduleCache.tableData) {
        //     var chartData = {}, json = moduleCache.tableJsonData[index];
        //     chartData.name = json.cateName;
        //     chartData.value = json.tradeValue;
        //     legend.push(json.cateName);
        //     chartDatas.push(chartData);
        // }
        // var options = {
        //     // title: {
        //     //     text: '天气情况统计',
        //     //     subtext: '虚构数据',
        //     //     left: 'center'
        //     // },
        //     tooltip: {
        //         trigger: 'item',
        //         formatter: '{a} <br/>{b} : {c} ({d}%)'
        //     },
        //     legend: {
        //         bottom: 10,
        //         // left: 10,
        //         right: 20,
        //         data: legend,
        //         type: 'plain',
        //         orient: 'vertical',
        //     },
        //     series: [
        //         {
        //             name: '交易金额',
        //             type: 'pie',
        //             radius: '70%',
        //             center: ['35%', '50%'],
        //             selectedMode: 'single',
        //             data: chartDatas,
        //             emphasis: {
        //                 itemStyle: {
        //                     shadowBlur: 20,
        //                     shadowOffsetX: 0,
        //                     shadowColor: 'rgba(0, 0, 0, 0.5)'
        //                 }
        //             }
        //         }
        //     ]
        // };
        // // window.onresize = thisChart.resize;
        // thisChart.setOption(options, true);
        // window.addEventListener("resize", function () {
        //     thisChart.resize();
        // });
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var compareText = commonModule.getCompareText(moduleCache.urlParams.dateType),
            heightGap = ($(window).height() * 0.2 + 104).toFixed(0),
            renderTableOptions = {
                id: moduleCache.tableLayId,
                elem: "#" + moduleCache.tableElementId,
                data: moduleCache.tableData,
                height: "full-" + heightGap,
                layFilter: moduleCache.tableLayId + "-lay-filter",
                cols: [[
                    {
                        field: "cateName", title: "类目名称", templet: function (row) {
                            return "<ul><li>" + row.cateName + "</li><li class='wxr-table-increase-percent-text'>"
                                + compareText + "</li></ul>";
                        }
                    },
                    {field: "parentCateName", title: "父行业类目名称"},
                    {field: "tradeValue", title: "交易金额", sort: true},
                    // {field: "parentTradeValue", title: "父行业交易金额", sort: true},
                    {
                        field: "tradeGrowthRangeValue", title: "交易增长幅度", sort: true, templet: function (row) {
                            // var color, value = row.tradeGrowthRangeValue;
                            // if (Math.abs(value) > 30) {
                            //     if (value >= 0) {
                            //         color = "red";
                            //         value = "+" + value;
                            //     } else {
                            //         color = "green";
                            //         // value = "-" + value;
                            //     }
                            // }
                            return "<span class='wxr-table-increase-percent-text'>" + row.tradeGrowthRangeValue + "%</span>";
                        }
                    },
                    {
                        field: "payAmtParentCateRateValue", title: "支付金额较父行业占比指数", sort: true, templet: function (row) {
                            return "<ul><li>" + row.payAmtParentCateRateValue + "%</li><li class='wxr-table-increase-percent-text'>"
                                + (row.payAmtParentCateRateCycleCqc == null ? "-" : (row.payAmtParentCateRateCycleCqc >= 0 ? ("+"
                                    + row.payAmtParentCateRateCycleCqc) : row.payAmtParentCateRateCycleCqc) + "%") + "</li></ul>";
                        }
                    },
                    {
                        field: "payCntParentCateRateValue", title: "支付子订单数较父行业占比", sort: true, templet: function (row) {
                            return "<ul><li>" + row.payCntParentCateRateValue + "%</li><li class='wxr-table-increase-percent-text'>"
                                + (row.payCntParentCateRateCycleCqc == null ? "-" : (row.payCntParentCateRateCycleCqc >= 0 ? ("+"
                                    + row.payCntParentCateRateCycleCqc) : row.payCntParentCateRateCycleCqc) + "%") + "</li></ul>";
                        }
                    }
                ]],
                done: function () {

                }
            };
        commonModule.renderTable(renderTableOptions, layero);
    }

    return {
        init: function () {
            var targetDom = $("#cateCons .oui-card-header-item.oui-card-header-item-pull-right").eq(0),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "after", buttons, true, function () {

            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  市场大盘-卖家概况|子行业分布，表格数据不需要分页显示
 * @Date 9:17 2020/10/12
 * @Param
 * @return
 **/
var marketOverviewSubDistributeModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "市场大盘 | 子行业分布",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "market-overview-sub-distribute", //table的dom控件的id属性
        tableLayId: "marketOverviewSubDistribute", //table在layui中定义的id，即lay-ui属性
        industryConstructTableData: [],
        subDistributeTableData: []
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheKey();
        // 组装缓存数据
        assembleCacheData();
        // 转换指数
        transformData();
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var subTitle = $(".mc-marketMonitor .oui-card-header-item.oui-card-header-item-pull-left .oui-tab-switch-item-active").text(),
            statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".sellerType-select .ant-select-selection-selected-value").text();
        var dialogOptions = {
            title: dialogTitle,
            area: ['90%', '90%'],
            // offset: "100px",
            content:
            // "<div class='wxr-tool-chart-box' id='market-overview-industry-construct-chart' style='height:310px'></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "-lay-filter'></div>",
            success: function (layero, index) {
                // renderChart();
                renderTable(layero);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    // 组装缓存key
    function assembleCacheKey() {
        // 解析当前URL中的参数
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 获取子行业构成的缓存key
        var industryConstructLocalCacheKey = "/mc/mq/supply/deal/list.json?", sortedCacheKeyParam;
        // 缓存key中按照一定顺序组装参数: device=0&sellerType=-1&cateId=11&dateRange=2020-09-27|2020-09-27&dateType=today
        sortedCacheKeyParam = "dateRange=" + moduleCache.urlParams.dateRange + "&dateType=" + moduleCache.urlParams.dateType;
        industryConstructLocalCacheKey += sortedCacheKeyParam;
        var cacheKeyPageAndSortParams = commonModule.getCachePageAndSortParams($("#cateCons"));
        industryConstructLocalCacheKey += "&pageSize=" + cacheKeyPageAndSortParams.pageSize + "&page=1&order=" + cacheKeyPageAndSortParams.order
            + "&orderBy=" + cacheKeyPageAndSortParams.orderBy + "&cateId="
            + moduleCache.urlParams.cateId + "&device=" + moduleCache.urlParams.device + "&sellerType=" + moduleCache.urlParams.sellerType
            + "&indexCode=" + cacheKeyPageAndSortParams.indexCode;
        moduleCache.industryConstructLocalCacheKey = globalUrlPrefix + industryConstructLocalCacheKey;

        // 获取子行业分布的缓存key
        var subDistributeLocalCacheKey = "/mc/mq/supply/mkt/childCate.json?";
        // 缓存key中按照一定顺序组装参数: device=0&sellerType=-1&cateId=11&dateRange=2020-09-27|2020-09-27&dateType=today
        sortedCacheKeyParam = "dateRange=" + moduleCache.urlParams.dateRange + "&dateType=" + moduleCache.urlParams.dateType;
        subDistributeLocalCacheKey += sortedCacheKeyParam;
        var cacheKeyPageAndSortParams = commonModule.getCachePageAndSortParams($("#cateOverview"));
        subDistributeLocalCacheKey += "&pageSize=" + cacheKeyPageAndSortParams.pageSize + "&page=1&order=" + cacheKeyPageAndSortParams.order
            + "&orderBy=" + cacheKeyPageAndSortParams.orderBy + "&cateId="
            + moduleCache.urlParams.cateId + "&device=" + moduleCache.urlParams.device + "&sellerType=" + moduleCache.urlParams.sellerType
            + "&indexCode=" + cacheKeyPageAndSortParams.indexCode;
        moduleCache.subDistributeLocalCacheKey = globalUrlPrefix + subDistributeLocalCacheKey;
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        // 子行业构成缓存
        var decodeJsonData = commonModule.getUsableOriginalJsonDataFromCache(moduleCache.industryConstructLocalCacheKey, true);
        if (decodeJsonData) {
            moduleCache.industryConstructTableData = decodeJsonData;
        } else {
            // 如果当前key未获取到结果，将key中的pageSize换成5再尝试一次
            decodeJsonData = commonModule.getUsableOriginalJsonDataFromCache(moduleCache.industryConstructLocalCacheKey.replace(/&pageSize\S+&page/, "&pageSize=5&page"), true);
            if (decodeJsonData) {
                moduleCache.industryConstructTableData = decodeJsonData;
            }
        }

        // 子行业分布缓存
        decodeJsonData = commonModule.getUsableOriginalJsonDataFromCache(moduleCache.subDistributeLocalCacheKey, true);
        if (decodeJsonData) {
            moduleCache.subDistributeTableData = decodeJsonData;
        } else {
            // 如果当前key未获取到结果，将key中的pageSize换成5再尝试一次
            decodeJsonData = commonModule.getUsableOriginalJsonDataFromCache(moduleCache.subDistributeLocalCacheKey.replace(/&pageSize\S+&page/, "&pageSize=5&page"), true);
            if (decodeJsonData) {
                moduleCache.subDistributeTableData = decodeJsonData;
            }
        }
    }

    function transformData() {
        // 先合并两个集合
        for (var i in moduleCache.subDistributeTableData) {
            var subDistributeItem = moduleCache.subDistributeTableData[i];
            for (var j in moduleCache.industryConstructTableData) {
                var industryConstructItem = moduleCache.industryConstructTableData[j];
                if (subDistributeItem.cateBo.cateId === industryConstructItem.cateBo.cateId) {
                    subDistributeItem.tradeIndex = industryConstructItem.tradeIndex;
                    subDistributeItem.payAmtParentCateRateIndex = industryConstructItem.payAmtParentCateRateIndex;
                    subDistributeItem.tradeGrowthRangeIndex = industryConstructItem.tradeGrowthRangeIndex;
                    subDistributeItem.payCntParentCateRate = industryConstructItem.payCntParentCateRate;
                    break;
                }
            }
        }
        var parentCateName = $(".common-picker-header").attr("title");
        if (parentCateName.indexOf(">") != -1) {
            var parentNameArray = parentCateName.split(">");
            parentCateName = parentNameArray[parentNameArray.length - 1];
        }
        for (var i in moduleCache.subDistributeTableData) {
            var cateItem = moduleCache.subDistributeTableData[i];
            // 类目名称
            cateItem.cateName = cateItem.cateBo.cateName;
            // 父行业类目名称
            cateItem.parentCateName = parentCateName;
            // 交易金额
            cateItem.tradeValue = commonModule.calculateFormula(cateItem.tradeIndex.value, 1, 0);
            // 支付金额较父行业占比
            cateItem.payAmtParentCateRateValue = Number((cateItem.payAmtParentCateRateIndex.value * 100).toFixed(2));
            cateItem.payAmtParentCateRateCycleCqc = Number((cateItem.payAmtParentCateRateIndex.cycleCqc * 100).toFixed(2));
            // 父行业交易金额
            // cateItem.parentTradeValue = cateItem.payAmtParentCateRateIndex.value == 0 ?
            //     0 : Number((cateItem.tradeValue / cateItem.payAmtParentCateRateIndex.value).toFixed(0));
            // 交易增长幅度
            cateItem.tradeGrowthRangeValue = Number((cateItem.tradeGrowthRangeIndex.value * 100).toFixed(2));
            cateItem.tradeGrowthRangeCycleCrc = Number((cateItem.tradeGrowthRangeIndex.cycleCrc * 100).toFixed(2));
            // 支付子订单数较父行业占比
            cateItem.payCntParentCateRateValue = Number((cateItem.payCntParentCateRate.value * 100).toFixed(2));
            cateItem.payCntParentCateRateCycleCqc = Number((cateItem.payCntParentCateRate.cycleCqc * 100).toFixed(2));
            // 卖家数
            cateItem.slrCntValue = cateItem.slrCnt.value;
            cateItem.slrCntCycleCrc = Number((cateItem.slrCnt.cycleCrc * 100).toFixed(2));
            // 父行业卖家数占比
            cateItem.parentCateSlrRateValue = Number((cateItem.parentCateSlrRate.value * 100).toFixed(2));
            cateItem.parentCateSlrRateCycleCrc = Number((cateItem.parentCateSlrRate.cycleCrc * 100).toFixed(2));
            // 父行业卖家数
            cateItem.parentCateSlrCnt = Number((cateItem.slrCntValue / cateItem.parentCateSlrRate.value).toFixed(0));
            // 有交易卖家数
            cateItem.tradeSlrCntValue = cateItem.tradeSlrCnt.value;
            cateItem.tradeSlrCntCycleCrc = Number((cateItem.tradeSlrCnt.cycleCrc * 100).toFixed(2));
            // 父行业有交易卖家数占比
            cateItem.parentCateTradeSlrCntRateValue = Number((cateItem.parentCateTradeSlrCntRate.value * 100).toFixed(2));
            cateItem.parentCateTradeSlrCntRateCycleCrc = Number((cateItem.parentCateTradeSlrCntRate.cycleCrc * 100).toFixed(2));
            // 父行业有交易卖家数
            cateItem.parentCateTradeSlrCnt = Number((cateItem.tradeSlrCntValue / cateItem.parentCateTradeSlrCntRate.value).toFixed(0));
        }
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var compareText = commonModule.getCompareText(moduleCache.urlParams.dateType),
            heightGap = ($(window).height() * 0.1 + 104).toFixed(0),
            cols = [[
                {
                    field: "cateName", title: "类目名称", minWidth: 150, rowspan: 2, templet: function (row) {
                        return "<ul><li>" + row.cateName + "\n</li><li class='wxr-font-light-color'>"
                            + compareText + "</li></ul>";
                    }
                },
                {field: "parentCateName", title: "父行业类目名称", minWidth: 300, rowspan: 2},
                {field: "industryConstruct", title: "子行业构成", minWidth: 200, colspan: 4},
                {field: "subDistribute", title: "子行业分布", minWidth: 200, colspan: 6},
            ], [
                {field: "tradeValue", title: "交易金额", sort: true, minWidth: 110},
                // {field: "parentTradeValue", title: "父行业交易金额", sort: true},
                {
                    field: "tradeGrowthRangeValue",
                    title: "交易增长幅度",
                    minWidth: 120,
                    sort: true,
                    templet: function (row) {
                        // var color, value = row.tradeGrowthRangeValue;
                        // if (Math.abs(value) > 30) {
                        //     if (value >= 0) {
                        //         color = "red";
                        //         value = "+" + value;
                        //     } else {
                        //         color = "green";
                        //         // value = "-" + value;
                        //     }
                        // }
                        return "<span class='wxr-table-increase-percent-text'>" + row.tradeGrowthRangeValue + "%</span>";
                    }
                },
                {
                    field: "payAmtParentCateRateValue",
                    title: "支付金额较父行业占比",
                    minWidth: 120,
                    sort: true,
                    templet: function (row) {
                        return "<ul><li>" + row.payAmtParentCateRateValue + "%\n</li><li class='wxr-table-increase-percent-text'>"
                            + (row.payAmtParentCateRateCycleCqc == null ? "-" : (row.payAmtParentCateRateCycleCqc >= 0 ? ("+"
                                + row.payAmtParentCateRateCycleCqc) : row.payAmtParentCateRateCycleCqc) + "%") + "</li></ul>";
                    }
                },
                {
                    field: "payCntParentCateRateValue",
                    title: "支付子订单数较父行业占比",
                    minWidth: 120,
                    sort: true,
                    templet: function (row) {
                        return "<ul><li>" + row.payCntParentCateRateValue + "%\n</li><li class='wxr-table-increase-percent-text'>"
                            + (row.payCntParentCateRateCycleCqc == null ? "-" : (row.payCntParentCateRateCycleCqc >= 0 ? ("+"
                                + row.payCntParentCateRateCycleCqc) : row.payCntParentCateRateCycleCqc) + "%") + "</li></ul>";
                    }
                },
                {
                    field: "slrCntValue", title: "卖家数", sort: true, minWidth: 90, templet: function (row) {
                        return "<ul><li>" + row.slrCntValue + "\n</li><li class='wxr-table-increase-percent-text'>"
                            + (row.slrCntCycleCrc == null ? "-" : ((row.slrCntCycleCrc >= 0 ? ("+"
                                + row.slrCntCycleCrc) : row.slrCntCycleCrc) + "%")) + "</li></ul>";
                    }
                },
                {field: "parentCateSlrCnt", title: "父行业卖家数量", sort: true, minWidth: 100},
                {
                    field: "parentCateSlrRateValue",
                    title: "父行业卖家占比",
                    sort: true,
                    minWidth: 100,
                    templet: function (row) {
                        return "<ul><li>" + row.parentCateSlrRateValue + "%\n</li><li class='wxr-table-increase-percent-text'>"
                            + (row.parentCateSlrRateCycleCrc == null ? "-" : (row.parentCateSlrRateCycleCrc >= 0 ? ("+"
                                + row.parentCateSlrRateCycleCrc) : row.parentCateSlrRateCycleCrc) + "%") + "</li></ul>";
                    }
                },
                {
                    field: "tradeSlrCntValue", title: "交易卖家数", sort: true, minWidth: 120, templet: function (row) {
                        return "<ul><li>" + row.tradeSlrCntValue + "\n</li><li class='wxr-table-increase-percent-text'>"
                            + (row.tradeSlrCntCycleCrc == null ? "-" : (row.tradeSlrCntCycleCrc >= 0 ? ("+"
                                + row.tradeSlrCntCycleCrc) : row.tradeSlrCntCycleCrc) + "%") + "</li></ul>";
                    }
                },
                {field: "parentCateTradeSlrCnt", title: "父行业有交易卖家数量", sort: true, minWidth: 120},
                {
                    field: "parentCateTradeSlrCntRateValue",
                    title: "父行业有交易卖家占比",
                    minWidth: 120,
                    sort: true,
                    templet: function (row) {
                        return "<ul><li>" + row.parentCateTradeSlrCntRateValue + "%\n</li><li class='wxr-table-increase-percent-text'>"
                            + (row.parentCateTradeSlrCntRateCycleCrc == null ? "-" : (row.parentCateTradeSlrCntRateCycleCrc >= 0 ? ("+"
                                + row.parentCateTradeSlrCntRateCycleCrc) : row.parentCateTradeSlrCntRateCycleCrc) + "%") + "</li></ul>";
                    }
                }
            ]];
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: moduleCache.subDistributeTableData,
            height: "full-" + heightGap,
            layFilter: moduleCache.tableLayId + "-lay-filter",
            cols: cols,
            skin: "",
            done: function () {
                var currentTableDom = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']");
                currentTableDom.find(".layui-table-header th .layui-table-cell").each(function (index, item) {
                    var titleSpan = $(this).find("span").eq(0), titleText = titleSpan.text();
                    if (titleText == "支付金额较父行业占比") {
                        titleSpan.html("支付金额较<br/>父行业占比");
                    } else if (titleText == "父行业有交易卖家占比") {
                        titleSpan.html("父行业有交<br/>易卖家占比");
                    } else if (titleText == "父行业有交易卖家数量") {
                        titleSpan.html("父行业有交<br/>易卖家数量");
                    } else if (titleText == "父行业卖家数量") {
                        titleSpan.html("父行业<br/>卖家数量");
                    } else if (titleText == "父行业卖家占比") {
                        titleSpan.html("父行业<br/>卖家占比");
                    } else if (titleText == "支付子订单数较父行业占比") {
                        titleSpan.html("支付子订单数<br/>较父行业占比");
                    } else if (titleText == "支付金额较父行业占比") {
                        titleSpan.html("支付金额较<br/>较父行业占比");
                    }
                });
            }
        };
        commonModule.renderTable(renderTableOptions);
    }

    return {
        init: function () {
            var targetDom;
            $(".oui-card .card-content-title").each(function (index, item) {
                if ($(this).text().indexOf("子行业分布") != -1) {
                    $(this).attr("id", "wxr-sub-distribute");
                    targetDom = $(this);
                    return false;
                }
            });
            var buttons = [
                {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
            ];
            commonModule.injectButtons(targetDom, "append", buttons, true, function (targetDom) {
                var btn = targetDom.find(".wxr-tool-buttons-inject-container .layui-btn").eq(0);
                var tip;
                btn.on("mouseenter", function () {
                    tip = layui.layer.tips("已合并行业构成的数据", btn, {
                        tips: [1, '#0FA6D8'], //还可配置颜色
                        area: ["auto", "auto"],
                        time: 0
                    });
                });
                btn.on("mouseleave", function () {
                    layui.layer.close(tip);
                });
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  市场大盘-地域分布，表格数据不需要分页显示
 * @Date 9:17 2020/10/12
 * @Param
 * @return
 **/
var marketOverviewRegionDistributeModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "市场大盘 | 地域分布",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "market-overview-region-distribute", //table的dom控件的id属性
        tableLayId: "marketOverviewRegionDistribute", //table在layui中定义的id，即lay-ui属性
        tableData: []
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheKey();
        // 组装缓存数据
        assembleCacheData();
        // 转换指数
        transformData();
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var subTitle = $(".mc-marketMonitor .oui-card-header-item.oui-card-header-item-pull-left .oui-tab-switch-item-active").text(),
            statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".sellerType-select .ant-select-selection-selected-value").text();
        var dialogOptions = {
            title: dialogTitle,
            area: ['90%', '90%'],
            // offset: "100px",
            content:
            // "<div class='wxr-tool-chart-box' id='market-overview-industry-construct-chart' style='height:310px'></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "-lay-filter'></div>",
            success: function (layero, index) {
                // renderChart();
                renderTable();
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    // 组装缓存key
    function assembleCacheKey() {
        // 解析当前URL中的参数
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        var localCacheKey = "/mc/mq/supply/mkt/area/province.json?", sortedCacheKeyParam;
        // 缓存key中按照一定顺序组装参数: device=0&sellerType=-1&cateId=11&dateRange=2020-09-27|2020-09-27&dateType=today
        sortedCacheKeyParam = "dateRange=" + moduleCache.urlParams.dateRange + "&dateType=" + moduleCache.urlParams.dateType;
        localCacheKey += sortedCacheKeyParam;
        var cacheKeyPageAndSortParams = commonModule.getCachePageAndSortParams($("#mc-mq-map-table-table"));
        localCacheKey += "&pageSize=" + cacheKeyPageAndSortParams.pageSize + "&page=1&order=" + cacheKeyPageAndSortParams.order
            + "&orderBy=" + cacheKeyPageAndSortParams.orderBy + "&cateId="
            + moduleCache.urlParams.cateId + "&device=" + moduleCache.urlParams.device + "&sellerType=" + moduleCache.urlParams.sellerType
            + "&indexCode=" + cacheKeyPageAndSortParams.indexCode;
        moduleCache.localCacheKey = globalUrlPrefix + localCacheKey;
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        var decodeJsonData = commonModule.getUsableOriginalJsonDataFromCache(moduleCache.localCacheKey, true);
        if (decodeJsonData) {
            moduleCache.tableData = decodeJsonData;
        } else {
            // 如果当前key未获取到结果，将key中的pageSize换成5再尝试一次
            decodeJsonData = commonModule.getUsableOriginalJsonDataFromCache(moduleCache.localCacheKey.replace(/&pageSize\S+&page/, "&pageSize=5&page"), true);
            if (decodeJsonData) {
                moduleCache.tableData = decodeJsonData;
            }
        }
    }

    function transformData() {
        for (var i in moduleCache.tableData) {
            var provinceItem = moduleCache.tableData[i];
            // 类目名称
            provinceItem.provinceName = provinceItem.areaName.value;
            // 卖家数
            provinceItem.slrCntValue = provinceItem.slrCnt.value;
            provinceItem.slrCntCycleCrc = Number((provinceItem.slrCnt.cycleCrc * 100).toFixed(2));
            // 父行业卖家数占比
            provinceItem.parentCateSlrRateValue = Number((provinceItem.parentCateSlrRate.value * 100).toFixed(2));
            provinceItem.parentCateSlrRateCycleCqc = Number((provinceItem.parentCateSlrRate.cycleCqc * 100).toFixed(2));
            // 父行业卖家数
            provinceItem.parentCateSlrCnt = Number((provinceItem.slrCntValue / provinceItem.parentCateSlrRate.value).toFixed(0));
            // 有交易卖家数
            provinceItem.tradeSlrCntValue = provinceItem.tradeSlrCnt.value;
            provinceItem.tradeSlrCntCycleCrc = Number((provinceItem.tradeSlrCnt.cycleCrc * 100).toFixed(2));
            // 父行业有交易卖家数占比
            provinceItem.parentCateTradeSlrCntRateValue = Number((provinceItem.parentCateTradeSlrCntRate.value * 100).toFixed(2));
            provinceItem.parentCateTradeSlrCntRateCycleCqc = Number((provinceItem.parentCateTradeSlrCntRate.cycleCqc * 100).toFixed(2));
            // 父行业有交易卖家数
            provinceItem.parentCateTradeSlrCnt = Number((provinceItem.tradeSlrCntValue / provinceItem.parentCateTradeSlrCntRate.value).toFixed(0));
        }
    }

    function renderChart() {
        // var chartDatas = [], legend = [],
        //     thisChart = echarts.init(document.getElementById('market-overview-industry-construct-chart'));
        // for (var index in moduleCache.tableData) {
        //     var chartData = {}, json = moduleCache.tableJsonData[index];
        //     chartData.name = json.cateName;
        //     chartData.value = json.tradeValue;
        //     legend.push(json.cateName);
        //     chartDatas.push(chartData);
        // }
        // var options = {
        //     // title: {
        //     //     text: '天气情况统计',
        //     //     subtext: '虚构数据',
        //     //     left: 'center'
        //     // },
        //     tooltip: {
        //         trigger: 'item',
        //         formatter: '{a} <br/>{b} : {c} ({d}%)'
        //     },
        //     legend: {
        //         bottom: 10,
        //         // left: 10,
        //         right: 20,
        //         data: legend,
        //         type: 'plain',
        //         orient: 'vertical',
        //     },
        //     series: [
        //         {
        //             name: '交易金额',
        //             type: 'pie',
        //             radius: '70%',
        //             center: ['35%', '50%'],
        //             selectedMode: 'single',
        //             data: chartDatas,
        //             emphasis: {
        //                 itemStyle: {
        //                     shadowBlur: 20,
        //                     shadowOffsetX: 0,
        //                     shadowColor: 'rgba(0, 0, 0, 0.5)'
        //                 }
        //             }
        //         }
        //     ]
        // };
        // // window.onresize = thisChart.resize;
        // thisChart.setOption(options, true);
        // window.addEventListener("resize", function () {
        //     thisChart.resize();
        // });
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable() {
        var compareText = commonModule.getCompareText(moduleCache.urlParams.dateType),
            heightGap = ($(window).height() * 0.1 + 104).toFixed(0),
            renderTableOptions = {
                id: moduleCache.tableLayId,
                elem: "#" + moduleCache.tableElementId,
                data: moduleCache.tableData,
                height: "full-" + heightGap,
                layFilter: moduleCache.tableLayId + "-lay-filter",
                cols: [[
                    {field: "provinceName", title: "省", sort: true, minWidth: 150},
                    {
                        field: "slrCntValue", title: "卖家数", sort: true, minWidth: 90, templet: function (row) {
                            return "<ul><li>" + row.slrCntValue + "\n</li><li class='wxr-table-increase-percent-text'>"
                                + (!row.slrCntCycleCrc ? "-" : ((row.slrCntCycleCrc >= 0 ? ("+"
                                    + row.slrCntCycleCrc) : row.slrCntCycleCrc) + "%")) + "</li></ul>";
                        }
                    },
                    {field: "parentCateSlrCnt", title: "父行业卖家数量", sort: true, minWidth: 150},
                    {
                        field: "parentCateSlrRateValue",
                        title: "父行业卖家占比",
                        sort: true,
                        minWidth: 160,
                        templet: function (row) {
                            return "<ul><li>" + row.parentCateSlrRateValue + "%\n</li><li class='wxr-table-increase-percent-text'>"
                                + (!row.parentCateSlrRateCycleCqc ? "-" : (row.parentCateSlrRateCycleCqc >= 0 ? ("+"
                                    + row.parentCateSlrRateCycleCqc) : row.parentCateSlrRateCycleCqc) + "%") + "</li></ul>";
                        }
                    },
                    {
                        field: "tradeSlrCntValue", title: "交易卖家数", sort: true, minWidth: 120, templet: function (row) {
                            return "<ul><li>" + row.tradeSlrCntValue + "\n</li><li class='wxr-table-increase-percent-text'>"
                                + (!row.tradeSlrCntCycleCrc ? "-" : (row.tradeSlrCntCycleCrc >= 0 ? ("+"
                                    + row.tradeSlrCntCycleCrc) : row.tradeSlrCntCycleCrc) + "%") + "</li></ul>";
                        }
                    },
                    {field: "parentCateTradeSlrCnt", title: "父行业有交易卖家数量", sort: true, minWidth: 130},
                    {
                        field: "parentCateTradeSlrCntRateValue",
                        title: "父行业有交易卖家占比",
                        minWidth: 180,
                        sort: true,
                        templet: function (row) {
                            return "<ul><li>" + row.parentCateTradeSlrCntRateValue + "%\n</li><li class='wxr-table-increase-percent-text'>"
                                + (!row.parentCateTradeSlrCntRateCycleCqc ? "-" : (row.parentCateTradeSlrCntRateCycleCqc >= 0 ? ("+"
                                    + row.parentCateTradeSlrCntRateCycleCqc) : row.parentCateTradeSlrCntRateCycleCqc) + "%") + "</li></ul>";
                        }
                    }
                ]],
                done: function () {

                }
            };
        commonModule.renderTable(renderTableOptions, layero);
    }

    return {
        init: function () {
            var targetDom, buttons = [
                {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
            ];
            $(".oui-card .card-content-title").each(function (index, item) {
                if ($(this).text().indexOf("地域分布") != -1) {
                    $(this).attr("id", "wxr-region-distribute");
                    targetDom = $(this);
                    // $(this).css({color: "red"});
                    return false;
                }
            });
            commonModule.injectButtons(targetDom, "append", buttons, true, function () {

            });
        }
    }
}());

/*
 * @Author xuyefei
 * @Description  市场大盘-行业趋势
 * @Date 11:17 2020/9/8
 **/
var marketOverviewIndustryTrendModule = (function () {
    function oneClickTransform() {

    }

    return {
        init: function () {
            var targetDom = $("#cateTrend .oui-card-header-item.oui-card-header-item-pull-right .oui-card-switch"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "before", buttons, true, function () {

            });
            // $.parser.parse();
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  市场排行
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var marketRankModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "市场排行",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        firstActiveTabCode: "", // 选中的tab页
        secondActiveTabCode: "", // 选中的tab页
        tableData: {
            shop: {// 店铺数据
                title: "店铺",
                data: {
                    hotsale: {"title": "高交易", data: []},
                    hotsearch: {"title": "高流量", data: []},
                    merge: {"title": "合并", data: []}
                }
            },
            item: {// 商品数据
                title: "商品",
                data: {
                    hotsale: {"title": "高交易", data: []},
                    hotsearch: {"title": "高流量", data: []},
                    hotpurpose: {"title": "高意向", data: []},// 数据需要解密
                    merge: {"title": "合并", data: []}
                }
            },
            brand: {// 品牌数据
                title: "品牌",
                data: {
                    hotsale: {"title": "高交易", data: []},// 数据需要解密
                    hotsearch: {"title": "高流量", data: []},// 数据需要解密
                    merge: []// 合并
                }
            }
        }, // 弹出框的表格需要的数据
        localCacheKey: "", // 组装好的localStorage的缓存key
        maxPageNo: 1, // 分页的最大值
        tableElementId: "market-rank-table", //table的dom控件的id属性
        tableLayId: "marketRankTable" //table在layui中定义的id，即lay-ui属性
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheKey();
        // 组装缓存数据
        assembleCacheData();
        // 转换指数
        transformData();
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + moduleCache.tableData[moduleCache.firstActiveTabCode].title
                + " | " + moduleCache.tableData[moduleCache.firstActiveTabCode].data[moduleCache.secondActiveTabCode].title
                + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogOptions = {
            title: dialogTitle,
            area: ['70%', '80%'],
            // offset: "100px",
            content: "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                renderTable(layero);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    // 组装缓存key
    function assembleCacheKey() {
        // 萃取URL地址的参数
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 先找到选中的那个tab[店铺、商品、品牌]
        var firstActiveTabName = $(".ebase-FaCommonFilter__bottom .ebase-FaCommonFilter__left .oui-tab-switch .oui-tab-switch-item-active").text(),
            secondActiveTabName = $(".oui-card-header .oui-card-header-item.oui-card-header-item-pull-left .oui-tab-switch-item-active").text(),
            cacheKey = "/mc/v2/mq/mkt/rank",
            firstActiveTabCode, secondActiveTabCode, sortedCacheKeyParam, cateId, order, orderBy;
        switch (firstActiveTabName) {
            case "店铺":
                firstActiveTabCode = "shop";
                break;
            case "商品":
                firstActiveTabCode = "item";
                break;
            case "品牌":
                firstActiveTabCode = "brand";
                break;
        }
        moduleCache.firstActiveTabCode = firstActiveTabCode;
        cacheKey += "/" + firstActiveTabCode;
        switch (secondActiveTabName) {
            case "高交易":
                secondActiveTabCode = "hotsale", order = "desc", orderBy = "tradeIndex";
                break;
            case "高流量":
                secondActiveTabCode = "hotsearch", order = "desc", orderBy = "uvIndex";
                break;
            case "高意向":
                secondActiveTabCode = "hotpurpose", order = "desc", orderBy = "cartHits";
                break;
        }
        moduleCache.secondActiveTabCode = secondActiveTabCode;
        cacheKey += "/" + secondActiveTabCode + ".json?" + "dateRange=" + moduleCache.urlParams.dateRange + "&dateType="
            + moduleCache.urlParams.dateType + "&pageSize=10&page=1&order=" + order + "&orderBy=" + orderBy
            + "&cateId=" + moduleCache.urlParams.cateId + "&device=" + moduleCache.urlParams.device
            + "&sellerType=" + moduleCache.urlParams.sellerType;
        var priceSegId = getPriceSegId();
        if (secondActiveTabCode == "hotsale") {
            if (moduleCache.firstActiveTabCode != "brand") {
                cacheKey += "&styleId=&priceSeg=" + priceSegId;
            }
        } else if (secondActiveTabCode == "hotsearch") {
            if (moduleCache.firstActiveTabCode != "brand") {
                cacheKey += "&styleId=&priceSeg=" + priceSegId + "&pageId=";
            }
        }
        var cacheKeyPageAndSortParams = commonModule.getCachePageAndSortParams($(".oui-card .oui-card-content"));
        // 最终成型的缓存key
        cacheKey += "&indexCode=" + cacheKeyPageAndSortParams.indexCode;
        moduleCache.localCacheKey = globalUrlPrefix + cacheKey;
    }

    function getPriceSegId() {
        var priceSegText = $(".oui-card-header .market-rank-header-common-select-wrapper .sycm-common-select-simple-text").attr("title"),
            priceSegId = "";
        if (priceSegText != "全部价格带") {
            // 找到价格带数据缓存
            var priceSegCacheKey = globalUrlPrefix + "/mc/v2/mq/mkt/rank/" + moduleCache.firstActiveTabCode
                + "/price_seg.json?keyword=&dateRange=" + moduleCache.urlParams.dateRange
                + "&dateType=" + moduleCache.urlParams.dateType + "&cateId=" + moduleCache.urlParams.cateId
                + "&device=" + moduleCache.urlParams.device + "&sellerType=" + moduleCache.urlParams.sellerType;
            if (moduleCache.secondActiveTabCode == "hotsale") {
                priceSegCacheKey += "&pattern=trd";
            } else if (moduleCache.secondActiveTabCode == "hotsearch") {
                priceSegCacheKey += "&pattern=flow";
            }
            var priceSegData = commonModule.getUsableOriginalJsonDataFromCache(priceSegCacheKey, false);
            if (priceSegData) {
                for (var index in priceSegData) {
                    var segItem = priceSegData[index];
                    if (segItem.priceSegName.value == priceSegText) {
                        priceSegId = segItem.priceSegId.value;
                        break;
                    }
                }
            }
        }
        return priceSegId;
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        // 数据是否需要解密，商品-高意向、品牌-高交易、品牌-高流量三种数据需要解密
        var isDecrypt = false;
        if ((moduleCache.firstActiveTabCode == "item" && moduleCache.secondActiveTabCode == "hotpurpose")
            || moduleCache.firstActiveTabCode == "brand") {
            isDecrypt = true;
            moduleCache.localCacheKey = moduleCache.localCacheKey.replace("/mc/v2/mq", "/mc/mq");
        }
        if (moduleCache.firstActiveTabCode == "brand" && moduleCache.secondActiveTabCode == "hotsearch") {
            moduleCache.localCacheKey = moduleCache.localCacheKey.replace("json?dateRange", "json?&dateRange");
        }
        var cacheData = commonModule.getUsableOriginalJsonDataFromCache(moduleCache.localCacheKey, isDecrypt);
        if (cacheData) {
            moduleCache.tableData[moduleCache.firstActiveTabCode].data[moduleCache.secondActiveTabCode].data = cacheData;
        }
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var cols = [[]], heightGap = ($(window).height() * 0.2 + 104).toFixed(0);
        cols[0].push({
            field: "cateRankIdValue", title: "排名", width: 110, templet: function (row) {
                var cateRankIdValue, cateRankIdCycleCqc, className = "wxr-font-small-normal-color";
                if (row.cateRankId) {
                    if (row.cateRankId.value != null && row.cateRankId.value != undefined) {
                        cateRankIdValue = row.cateRankId.value;
                    } else {
                        cateRankIdValue = "-";
                    }
                    if (row.cateRankId.cycleCqc != null && row.cateRankId.cycleCqc != undefined) {
                        cateRankIdCycleCqc = row.cateRankId.cycleCqc;
                    } else {
                        cateRankIdCycleCqc = "-";
                    }
                } else {
                    cateRankIdValue = "-", cateRankIdCycleCqc = "-";
                }
                if (cateRankIdCycleCqc < 0) {
                    className = "wxr-font-small-red-color";
                    cateRankIdCycleCqc = "升" + Math.abs(cateRankIdCycleCqc) + "名";
                } else if (cateRankIdCycleCqc > 0) {
                    className = "wxr-font-small-green-color";
                    cateRankIdCycleCqc = "降" + cateRankIdCycleCqc + "名";
                } else if (cateRankIdCycleCqc == 0) {
                    cateRankIdCycleCqc = "持平";
                }
                return "<ul><li>" + cateRankIdValue + "\n</li><li class='" + className + "'>" + cateRankIdCycleCqc + "\n</li></ul>";
            }
        });
        var compareText = commonModule.getCompareText(moduleCache.urlParams.dateType);
        if (moduleCache.firstActiveTabCode == "shop") {
            cols[0].push({
                field: "shopName", title: "店铺名称", minWidth: 250, templet: function (row) {
                    return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' style='float: left' src='" + row.shop.pictureUrl + "'/>" +
                        "<ul><li><a href='" + row.shop.shopUrl + "' target='_blank' title='" + row.shop.title + "'>" + row.shop.title + "</a>\n</li><li class='wxr-font-light-color'>" + compareText + "\n</li></ul></div>";
                }
            });
        } else if (moduleCache.firstActiveTabCode == "item") {
            cols[0].push.apply(cols[0], [
                {
                    field: "name", title: "商品名称", minWidth: 250, templet: function (row) {
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' style='float: left' src='" + row.item.pictUrl + "'/>" +
                            "<ul><li><a title='" + row.item.title + "' target='_blank' href='" + row.item.detailUrl + "'>" + row.item.title + "</a>\n</li><li class='wxr-font-light-color'>" + compareText + "\n</li></ul></div>";
                    }
                },
                {
                    field: "shopName", title: "所属店铺", minWidth: 250, templet: function (row) {
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='" + row.shop.pictureUrl + "'/><span>" +
                            "<a href='" + row.shop.shopUrl + "' target='_blank' title='" + row.shop.title + "'>" + row.shop.title + "</a></span></div>";
                    }
                }]);
        } else if (moduleCache.firstActiveTabCode == "brand") {
            cols[0].push(
                {
                    field: "name", title: "品牌名称", minWidth: 250, templet: function (row) {
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' style='float: left' src='//img.alicdn.com/tps/" + row.brandModel.logo + "'/>" +
                            "<ul><li><a href='javascript:;' onclick='return false' target='_blank' title='" + row.brandModel.brandName + "'>" + row.brandModel.brandName + "</a>\n</li><li class='wxr-font-light-color'>" + compareText + "\n</li></ul></div>";
                    }
                }
            )
        }
        if (moduleCache.secondActiveTabCode == "hotsale") {
            cols[0].push.apply(cols[0], [
                {field: "tradeIndexValue", title: "交易金额", minWidth: 110, sort: true},
                {
                    field: "tradeGrowthRangeValue",
                    title: "交易增长幅度",
                    minWidth: 110,
                    sort: true,
                    templet: function (row) {
                        var value = row.tradeGrowthRangeValue;
                        if (value >= 0) {
                            value = "+" + value;
                        }
                        return "<span class='wxr-table-increase-percent-text'>" + value + "%</span>";
                    }
                },
                {field: "payRateIndexValue", title: "支付转化率", minWidth: 110, sort: true, isPercentValue: true}
            ]);
        } else if (moduleCache.secondActiveTabCode == "hotsearch") {
            cols[0].push.apply(cols[0], [
                {field: "uvIndexValue", title: "访客人数", minWidth: 110, sort: true},
                {field: "seIpvUvHitsValue", title: "搜索人数", minWidth: 110, sort: true},
                {field: "tradeIndexValue", title: "交易金额", minWidth: 110, sort: true}
            ]);
        } else if (moduleCache.secondActiveTabCode == "hotpurpose") {
            cols[0].push.apply(cols[0], [
                {field: "cltHitsValue", title: "收藏人数", minWidth: 110, sort: true},
                {field: "cartHitsValue", title: "加购人数", minWidth: 110, sort: true},
                {field: "tradeIndexValue", title: "交易金额", minWidth: 110, sort: true}
            ]);
        }
        ;
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: moduleCache.tableData[moduleCache.firstActiveTabCode].data[moduleCache.secondActiveTabCode].data,
            height: 'full-' + heightGap,
            cols: cols,
            layFilter: moduleCache.tableLayId + "LayFilter",
            done: function () {

            }
        };
        if (moduleCache.firstActiveTabCode == "brand") {
            renderTableOptions.initSort = {
                field: 'cateRankIdValue',
                type: "asc"
            }
        }
        var inst = commonModule.renderTable(renderTableOptions, layero);
        // window大小改变，重置table大小
        // window.addEventListener("resize", function () {
        //     var currentTableDom = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']"),
        //         // 弹出框高度 - 弹出框标题栏高度 - 表格下方信息栏高度 - 工具栏高度 - 标题列高度
        //         tableMainHeight = currentTableDom.parents(".layui-layer").height() - 84 - currentTableDom.find(".layui-table-tool").outerHeight()
        //             - currentTableDom.find(".layui-table-header").outerHeight();
        //     console.log(currentTableDom.parents(".layui-layer").height() + "--" + currentTableDom.find(".layui-table-tool").outerHeight() +
        //         "--" + currentTableDom.find(".layui-table-header").outerHeight() + "--" + tableMainHeight);
        //     currentTableDom.find(".layui-table-box .layui-table-main").css({height: tableMainHeight});
        // });
    }

    function transformData() {
        // 将第一级tab下的所有数据转换
        var willTransformData = moduleCache.tableData[moduleCache.firstActiveTabCode].data;
        for (var firstTabCode in willTransformData) {
            var secondTabCodeData = willTransformData[firstTabCode].data;
            for (var index in secondTabCodeData) {
                var data = secondTabCodeData[index];
                commonModule.indexCodeValueTransform(data);
                data.cateRankIdValue = data.cateRankId ? (data.cateRankId.value ? Number(data.cateRankId.value) : 0) : 0;
                data.tradeGrowthRangeValue = !data.tradeGrowthRange ? 0 : Number((data.tradeGrowthRange.value * 100).toFixed(2));
            }
        }
    }

    return {
        init: function () {
            var targetDom = $(".ebase-FaCommonFilter__bottom .ebase-FaCommonFilter__right"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "prepend", buttons, true, function () {
                $(".ebase-FaCommonFilter__right .wxr-tool-buttons-inject-container").css("float", "none");
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  搜索排行
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var searchRankModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "搜索排行",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        firstActiveTab: {}, // 选中的tab页
        secondActiveTab: {}, // 选中的tab页
        tableData: {
            searchWord: {
                hotSearchRank: [],
                soarRank: []
            },
            subjectWords: {
                trendWords: [],
                newWords: []
            },
            tailWord: {
                hotSearchRank: [],
                soarRank: []
            },
            brandWord: {
                hotSearchRank: [],
                soarRank: []
            },
            coreWord: {
                hotSearchRank: [],
                soarRank: []
            },
            attrWord: {
                hotSearchRank: [],
                soarRank: []
            }
        }, // 弹出框的表格需要的数据
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "search-rank-table", //table的dom控件的id属性
        tableLayId: "searchRankTable" //table在layui中定义的id，即lay-ui属性
    };

    // 一键转化
    function oneClickTransform() {
        var firstActiveTabName = $(".ebase-FaCommonFilter__bottom .ebase-FaCommonFilter__left .oui-tab-switch .oui-tab-switch-item-active").text();
        if (firstActiveTabName == "主题词") {
            var btn = $(".ebase-FaCommonFilter__bottom .ebase-FaCommonFilter__right .wxr-tool-buttons-inject-container .layui-btn").eq(0);
            tip = layui.layer.tips("主题词无转换数据", btn, {
                tips: [1, '#0FA6D8'], //还可配置颜色
                area: ["auto", "auto"],
                // time:
            });
            return;
        }
        // 组装缓存key
        assembleCacheKey();
        // 组装缓存数据
        assembleCacheData();
        // 转换指数
        transformData();
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + moduleCache.firstActiveTab.name
                + " | " + moduleCache.secondActiveTab.name
                + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogOptions = {
            title: dialogTitle,
            area: ['90%', '90%'],
            // offset: "100px",
            content: "<div id='" + moduleCache.tableElementId + "' lay-filter='list_table'></div>",
            success: function (layero, index) {
                setTimeout(function () {
                    renderTable(layero);
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    // 组装缓存key
    function assembleCacheKey() {
        // 萃取URL地址的参数
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 先找到选中的那个tab[搜索词、主题词、长尾词、品牌词、核心词、修饰词]
        var firstActiveTabName = $(".ebase-FaCommonFilter__bottom .ebase-FaCommonFilter__left .oui-tab-switch .oui-tab-switch-item-active").text(),
            secondActiveTabName = $(".oui-card-header .oui-card-header-item.oui-card-header-item-pull-left .oui-tab-switch-item-active").text(),
            cacheKey = "/mc/industry",
            firstActiveTabCode, secondActiveTabCode, sortedCacheKeyParam, cateId, order, orderBy;
        switch (firstActiveTabName) {
            case "搜索词":
                firstActiveTabCode = "searchWord";
                break;
            case "主题词":
                firstActiveTabCode = "subjectWords";
                cacheKey += "/subject"
                break;
            case "长尾词":
                firstActiveTabCode = "tailWord";
                break;
            case "品牌词":
                firstActiveTabCode = "brandWord";
                break;
            case "核心词":
                firstActiveTabCode = "coreWord";
                break;
            case "修饰词":
                firstActiveTabCode = "attrWord";
                break;
        }
        moduleCache.firstActiveTab = {name: firstActiveTabName, code: firstActiveTabCode};
        cacheKey += "/" + firstActiveTabCode + ".json?dateRange=" + moduleCache.urlParams.dateRange + "&dateType="
            + moduleCache.urlParams.dateType + "&pageSize=10&page=1";
        switch (secondActiveTabName) {
            case "热搜":
                secondActiveTabCode = "hotSearchRank", order = "desc";
                if (firstActiveTabCode == "searchWord" || firstActiveTabCode == "tailWord") {
                    orderBy = "seIpvUvHits";
                } else if (firstActiveTabCode == "brandWord" || firstActiveTabCode == "coreWord" || firstActiveTabCode == "attrWord") {
                    orderBy = "avgWordSeIpvUvHits";
                }
                break;
            case "飙升":
                secondActiveTabCode = "soarRank", order = "desc";
                if (firstActiveTabCode == "searchWord" || firstActiveTabCode == "tailWord") {
                    orderBy = "seRiseRate";
                } else if (firstActiveTabCode == "brandWord" || firstActiveTabCode == "coreWord" || firstActiveTabCode == "attrWord") {
                    orderBy = "avgWordSeRiseRate";
                }
                break;
            case "趋势词":
                secondActiveTabCode = "trendRank", order = "desc", orderBy = "subjectRank";
                break;
            case "新词":
                secondActiveTabCode = "newRank", order = "desc", orderBy = "subjectRank";
                break;
        }
        moduleCache.secondActiveTab = {name: secondActiveTabName, code: secondActiveTabCode};
        cacheKey += "&order=" + order + "&orderBy=" + orderBy + "&cateId=" + moduleCache.urlParams.cateId
            + "&device=" + moduleCache.urlParams.device;
        var cacheKeyPageAndSortParams = commonModule.getCachePageAndSortParams($(".oui-card .oui-card-content"));
        // 最终成型的缓存key
        cacheKey += "&indexCode=" + cacheKeyPageAndSortParams.indexCode;
        moduleCache.localCacheKey = globalUrlPrefix + cacheKey;
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        var cacheData = commonModule.getUsableOriginalJsonDataFromCache(moduleCache.localCacheKey, true);
        if (cacheData) {
            var finalData;
            if (moduleCache.secondActiveTab.code == "hotSearchRank") {
                finalData = cacheData.hotList;
            } else if (moduleCache.secondActiveTab.code == "soarRank") {
                finalData = cacheData.soarList;
            } else if (moduleCache.secondActiveTab.code == "trendRank") {

            } else if (moduleCache.secondActiveTab.code == "newRank") {
                finalData = cacheData.newWords;
            }
            moduleCache.tableData[moduleCache.firstActiveTab.code][moduleCache.secondActiveTab.code] = finalData;
        }
    }

    function transformData() {
        // 将第一级tab下的所有数据转换
        var willTransformData = moduleCache.tableData[moduleCache.firstActiveTab.code];
        for (var secondTabCode in willTransformData) {
            var secondTabCodeData = willTransformData[secondTabCode];
            for (var index in secondTabCodeData) {
                var data = secondTabCodeData[index];
                // commonModule.indexCodeValueTransform(data);
                if (moduleCache.firstActiveTab.code == "searchWord" || moduleCache.firstActiveTab.code == "tailWord") {
                    // 点击人数
                    data.clickHitsValue = commonModule.calculateFormula(data.clickHits, 1, 0);
                    // 搜索人数
                    data.seIpvUvHitsValue = commonModule.calculateFormula(data.seIpvUvHits, 1, 0);
                    // 直通车参考价
                    data.p4pRefPriceValue = Number((data.p4pRefPrice / 100).toFixed(2));
                    // 点击率
                    data.clickRateValue = Number((data.clickRate * 100).toFixed(2));
                    // 支付转化率
                    data.payRateIndexValue = Number((data.payRate * 100).toFixed(2));
                    // 支付人数
                    data.payByrCnt = Math.round(data.clickHitsValue * data.payRate);
                    // 搜索增长幅度
                    data.seRiseRateValue = Number((data.seRiseRate * 100).toFixed(2));
                }
                if (moduleCache.firstActiveTab.code == "brandWord" || moduleCache.firstActiveTab.code == "coreWord"
                    || moduleCache.firstActiveTab.code == "attrWord") {
                    // 词均点击人数
                    data.avgWordClickHitsValue = commonModule.calculateFormula(data.avgWordClickHits, 1, 0);
                    // 词均点击率
                    data.avgWordClickRateValue = Number((data.avgWordClickRate * 100).toFixed(2));
                    // 词均搜索人数
                    data.avgWordSeIpvUvHitsValue = commonModule.calculateFormula(data.avgWordSeIpvUvHits, 1, 0);
                    // 相关搜索词数 relSeWordCnt
                    // 词均搜索增长幅度
                    data.avgWordSeRiseRateValue = Number((data.avgWordSeRiseRate * 100).toFixed(2));
                    // 词均支付转化率
                    data.avgWordPayRateValue = Number((data.avgWordPayRate * 100).toFixed(2));
                    // 词均支付人数
                    data.avgWordPayByrCnt = Math.round(data.avgWordClickHitsValue * data.avgWordPayRate);
                    // 直通车参考价
                    data.p4pRefPriceValue = Number((data.p4pRefPrice / 100).toFixed(2));
                }
            }
        }
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var cols = [[]], heightGap = ($(window).height() * 0.1 + 104).toFixed(0);
        cols[0].push.apply(cols[0], [
            {field: "searchWord", title: moduleCache.firstActiveTab.name, minWidth: 300},
            {
                field: moduleCache.secondActiveTab.code,
                title: moduleCache.secondActiveTab.name + "排名",
                minWidth: 110,
                sort: true
            }]);
        if (moduleCache.firstActiveTab.code == "searchWord" || moduleCache.firstActiveTab.code == "tailWord") {
            if (moduleCache.secondActiveTab.code == "soarRank") {
                cols[0].push({
                    field: "seRiseRateValue",
                    title: "搜索增长幅度",
                    isPercentValue: true,
                    minWidth: 140,
                    sort: true
                });
            }
            cols[0].push.apply(cols[0], [{field: "seIpvUvHitsValue", title: "搜索人数", minWidth: 110, sort: true},
                {field: "clickHitsValue", title: "点击人数", minWidth: 110, sort: true},
                {field: "clickRateValue", title: "点击率", minWidth: 110, isPercentValue: true, sort: true},
                {field: "payRateIndexValue", title: "支付转化率", minWidth: 110, isPercentValue: true, sort: true},
                {field: "payByrCnt", title: "支付人数", minWidth: 110, sort: true},
                {field: "p4pRefPriceValue", title: "直通车参考价", minWidth: 150, sort: true}
            ]);
        } else if (moduleCache.firstActiveTab.code == "brandWord" || moduleCache.firstActiveTab.code == "coreWord"
            || moduleCache.firstActiveTab.code == "attrWord") {
            if (moduleCache.secondActiveTab.code == "soarRank") {
                cols[0].push({
                    field: "avgWordSeRiseRateValue",
                    title: "词均搜索增长幅度",
                    isPercentValue: true,
                    minWidth: 170,
                    sort: true
                });
            }
            cols[0].push.apply(cols[0], [{field: "relSeWordCnt", title: "相关搜索词数", minWidth: 130, sort: true},
                {field: "avgWordSeIpvUvHitsValue", title: "相关词搜索人气", minWidth: 130, sort: true},
                {field: "avgWordClickHitsValue", title: "相关词点击人气", minWidth: 130, sort: true}]);
            if (moduleCache.secondActiveTab.code == "hotSearchRank") {
                cols[0].push({
                    field: "avgWordClickRateValue",
                    title: "词均点击率",
                    minWidth: 130,
                    isPercentValue: true,
                    sort: true
                });
            }
            cols[0].push.apply(cols[0],
                [{field: "avgWordPayRateValue", title: "词均支付转化率", minWidth: 150, isPercentValue: true, sort: true},
                    {field: "avgWordPayByrCnt", title: "词均支付人数", minWidth: 130, sort: true},
                    {field: "p4pRefPriceValue", title: "直通车参考价", minWidth: 150, sort: true}
                ]);
        }
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: moduleCache.tableData[moduleCache.firstActiveTab.code][moduleCache.secondActiveTab.code],
            height: 'full-' + heightGap,
            cols: cols,
            done: function () {

            }
        };
        if (moduleCache.firstActiveTabCode == "brand") {
            // renderTableOptions.initSort = {
            //     field: 'cateRankIdValue',
            //     type: "asc"
            // }
        }
        var inst = commonModule.renderTable(renderTableOptions, layero);
        // window大小改变，重置table大小
        // window.addEventListener("resize", function () {
        //     var currentTableDom = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']"),
        //         // 弹出框高度 - 弹出框标题栏高度 - 表格下方信息栏高度 - 工具栏高度 - 标题列高度
        //         tableMainHeight = currentTableDom.parents(".layui-layer").height() - 84 - currentTableDom.find(".layui-table-tool").outerHeight()
        //             - currentTableDom.find(".layui-table-header").outerHeight();
        //     console.log(currentTableDom.parents(".layui-layer").height() + "--" + currentTableDom.find(".layui-table-tool").outerHeight() +
        //         "--" + currentTableDom.find(".layui-table-header").outerHeight() + "--" + tableMainHeight);
        //     currentTableDom.find(".layui-table-box .layui-table-main").css({height: tableMainHeight});
        // });
    }

    return {
        init: function () {
            var targetDom = $(".ebase-FaCommonFilter__bottom .ebase-FaCommonFilter__right"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "prepend", buttons, true, function () {
                $(".ebase-FaCommonFilter__bottom .ebase-FaCommonFilter__right .wxr-tool-buttons-inject-container").css("float", "none");
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  搜索分析-趋势分析
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var searchAnalyzeOverviewTrendModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "搜索分析 | 趋势分析",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        data: {
            overview: {// 一览数据

            },
            trend: {// 趋势数据

            },
            merge: [],// 合并模式数据
            compare: []// 比对模式数据
        },
        activeIndexCards: {},
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "search-analyze-trend-table", //table的dom控件的id属性
        tableLayId: "searchAnalyzeTrendTable", //table在layui中定义的id，即lay-ui属性
        chartElementId: "search-analyze-trend-chart",
        tableShowModel: "merge"// 表格的显示方式，merge或者compare
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogWidth;
        var dialogOptions = {
            title: dialogTitle,
            area: ['90%', '96%'],
            // offset: "100px",
            content: "<div class='wxr-cards-container'></div>" +
                "<div class='wxr-charts-container' id='" + moduleCache.chartElementId + "'></div>" +
                "<div id='search-analyze-trend-tab' class='layui-tab layui-tab-brief' lay-filter='tabLayFilter'><ul class='layui-tab-title'><li class='layui-this' value='merge'>合并模式</li><li value='compare'>对比模式</li></ul></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                setTimeout(function () {
                    drawIndexCards();
                    renderChart();
                    renderTabs();
                    renderTable(layero);
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    function renderTabs() {
        moduleCache.tableShowModel = "merge";
        // $("#search-analyze-trend-tab").show();
        $("#search-analyze-trend-tab").css({padding: "0px 0px"});
        if (!moduleCache.diffKeyword) {// 没有对比词时对比模式禁用
            $("#search-analyze-trend-tab li:last").addClass("wxr-tab-disabled");
            // $("#search-analyze-trend-tab li:last").css({cursor: "not-allowed", pointerEvents: "none"});
        }
        layui.element.on("tab(tabLayFilter)", function () {
            if (moduleCache.diffKeyword) {// 没有对比词时对比模式禁用
                moduleCache.tableShowModel = $(this).attr("value");
                renderTable();
            }
        });
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        // 萃取URL地址的参数
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 获取对比词，不能拿输入框中的值，因为可能只是输入了却没有真正搜索，应该拿图标上方的图例中的文字
        var diffKeyword = "", chartLegendTextDom = $(".oui-pro-chart-component-legend-content .oui-pro-chart-component-legend-content-text"), selectedIndexName;
        // 选中的指标名称
        selectedIndexName = $(".index-area-multiple-container .alife-one-design-sycm-indexes-trend-index-item-multiple-line-selectable.active .oui-index-cell-indexName").text();
        if (chartLegendTextDom.length > 1) {
            diffKeyword = chartLegendTextDom.eq(1).text().replace(selectedIndexName, "");
        }
        moduleCache.diffKeyword = diffKeyword;
        // 拼接trend数据缓存key
        var searchAnalyzeTrendCacheKey = globalUrlPrefix + "/mc/searchword/propertyTrend.json?dateType=" + moduleCache.urlParams.dateType
            + "&dateRange=" + moduleCache.urlParams.dateRange + "&indexCode=&device=" + moduleCache.urlParams.device
            + "&keyword=" + moduleCache.urlParams.keyword + "&diffKeyword=" + diffKeyword,
            searchAnalyzeTrendCacheData = commonModule.getUsableOriginalJsonDataFromCache(searchAnalyzeTrendCacheKey, true);
        if (searchAnalyzeTrendCacheData) {
            moduleCache.data.trend = searchAnalyzeTrendCacheData;
            transformData();
        }
    }

    function transformData() {
        // 根据指标数组的长度计算出时间维度数组
        var dataLength, endTimeStr = moduleCache.urlParams.dateRange.split("|")[1];
        for (var selfOrDiff in moduleCache.data.trend) {
            var selfOrDiffObj = moduleCache.data.trend[selfOrDiff];
            for (var indexCode in selfOrDiffObj) {
                var indexItemArray = selfOrDiffObj[indexCode];
                dataLength = indexItemArray.length;
                if (dataLength) {
                    break;
                }
            }
        }
        // 生成时间周期
        moduleCache.dateTimes = commonModule.generateStatisticTimes(dataLength, endTimeStr, moduleCache.urlParams.dateType);
        // 合并各指标数据
        var mergeData = [], compareData = [];
        for (var i in moduleCache.dateTimes) {
            var compareItem = {dateTime: moduleCache.dateTimes[i]};
            for (var selfOrDiff in moduleCache.data.trend) {
                var mergeItem = {
                    dateTime: moduleCache.dateTimes[i],
                    keyword: (selfOrDiff == "self" ? moduleCache.urlParams.keyword : moduleCache.diffKeyword),
                    type: (selfOrDiff == "self" ? "关键词" : "对比词")
                };
                for (var indexCode in moduleCache.data.trend[selfOrDiff]) {
                    var indexItemTrendArray = moduleCache.data.trend[selfOrDiff][indexCode];
                    if (indexCode == "tradeIndex" || indexCode == "sePvIndex" || indexCode == "clickHits"
                        || indexCode == "clickHot" || indexCode == "seIpvUvHits") {
                        indexItemTrendArray[i] = commonModule.calculateFormula(indexItemTrendArray[i], 1, 0);
                    } else if (indexCode == "payConvRate") {
                        indexItemTrendArray[i] = Number((indexItemTrendArray[i] * 100).toFixed(2));
                    } else if (indexCode == "clickRate") {
                        indexItemTrendArray[i] = Number((indexItemTrendArray[i] * 100).toFixed(2));
                    }
                    mergeItem[indexCode] = indexItemTrendArray[i];
                    compareItem[indexCode + "_" + selfOrDiff] = indexItemTrendArray[i];
                }
                mergeItem[indexCode] = indexItemTrendArray[i];
                // 支付人数
                mergeItem.payByrCnt = Number((mergeItem.clickHits * mergeItem.payConvRate / 100).toFixed(0));
                // 客单价
                mergeItem.buyerPerPrice = Number((mergeItem.tradeIndex / mergeItem.payByrCnt).toFixed(2));
                mergeData.push(mergeItem);
                compareItem["payByrCnt_" + selfOrDiff] = mergeItem.payByrCnt;
                compareItem["buyerPerPrice_" + selfOrDiff] = mergeItem.buyerPerPrice;
            }
            compareData.push(compareItem);
        }
        moduleCache.data.merge = mergeData;
        moduleCache.data.compare = compareData;
    }

    /**
     * @Author xuyefei
     * @Description  存储各指标块信息,主要是为了按照相同顺序显示
     * @Date 14:26 2020/7/31
     * @Param
     * @return
     **/
    function assembleIndexCards() {
        var indexCardsDom = $("#searchTrend .index-area-multiple-root-container .oui-index-cell"),
            sortedIndexCards = [];
        indexCardsDom.each(function (index, item) {
            var indexCard = {}, indexCode = $(this).attr("value"),
                indexOldName = $(this).find(".oui-index-cell-indexName").text(),
                indexValue = $(this).find(".oui-index-cell-indexValue").text(),
                indexCycleCrc = $(this).find(".oui-index-cell-indexChange .oui-pull-right span").eq(0).text(),
                indexNewName, compareText = $(this).find(".oui-index-cell-indexChange .oui-index-cell-subIndex-text").text(), isPercentValue = false;
            if (indexCode == "seIpvUvHits") {
                indexNewName = "搜索人数";
                indexValue = commonModule.calculateFormula(indexValue.replace(/,/g, ""), 1, 0);
            } else if (indexCode == "sePvIndex") {
                indexNewName = "搜索次数";
                indexValue = commonModule.calculateFormula(indexValue.replace(/,/g, ""), 1, 0);
            } else if (indexCode == "clickHits") {
                indexNewName = "点击人数";
                indexValue = commonModule.calculateFormula(indexValue.replace(/,/g, ""), 1, 0);
            } else if (indexCode == "clickHot") {
                indexNewName = "点击次数";
                indexValue = commonModule.calculateFormula(indexValue.replace(/,/g, ""), 1, 0);
            } else if (indexCode == "clickRate") {
                indexNewName = "点击率";
                isPercentValue = true;
            } else if (indexCode == "tradeIndex") {
                indexNewName = "交易金额";
                indexValue = commonModule.calculateFormula(indexValue.replace(/,/g, ""), 1, 0);
            } else if (indexCode == "payConvRate") {
                indexNewName = "支付转化率";
                isPercentValue = true;
            }
            indexCard.isActive = false;
            if ($(this).parent().hasClass("active")) {
                indexCard.isActive = true;
            }
            indexCard.indexName = indexNewName;
            indexCard.indexValue = indexValue;
            indexCard.indexCode = indexCode;
            indexCard.indexCycleCrc = indexCycleCrc;
            indexCard.cycleCrcIconClassName = $(this).find(".oui-index-cell-ratioTrendIcon i").attr("class");
            indexCard.compareText = compareText;
            indexCard.isPercentValue = isPercentValue;
            sortedIndexCards.push(indexCard);
        });
        return sortedIndexCards;
    }

    function drawIndexCards() {
        // 已选中的指标块初始化
        moduleCache.activeIndexCards = {};
        var sortedIndexCards = assembleIndexCards();
        // 计算每个小块宽度的百分比
        var cardItemWrapperPercent = (100 / sortedIndexCards.length).toFixed(4);
        // 舍去最后一位，防止宽度超出
        cardItemWrapperPercent = cardItemWrapperPercent.substring(0, cardItemWrapperPercent.length - 2);
        // $(".wxr-cards-container").css({width: "60%"});
        // for (var i in moduleCache.firstLevelCategoryArray) {
        $.each(sortedIndexCards, function (index, indexItem) {
            var cardItemWrapper = $("<div class='wxr-card-item-wrapper' style='width: " +
                cardItemWrapperPercent + "%'></div>"),
                cardItemBody = $("<div class='wxr-card-item-body wxr-card-item-body-solid'><i class='layui-icon layui-icon-ok-circle wxr-card-item-body-icon'></i></div>");
            cardItemWrapper.append(cardItemBody);
            if (indexItem.isActive) {
                cardItemBody.addClass("wxr-card-item-body-active");
                cardItemBody.find(".wxr-card-item-body-icon").addClass("wxr-card-item-body-icon-checked");
                moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
            }
            // 填充内容
            var bodyContent = $("<ul><li class='wxr-card-item-body-title wxr-text-ellipsis' style='font-size: 12px' title='" + indexItem.indexName + "'>" + indexItem.indexName + "</li>" +
                "<li class='wxr-card-item-body-data' style='font-size: 18px;line-height: 20px;color: #0C0C0C'><div class='wxr-text-ellipsis'>" + indexItem.indexValue + "</div></li>" +
                "<li class='wxr-card-item-body-data' style='font-size: 12px'><div class='wxr-text-ellipsis'>" + indexItem.compareText + "</div><div class='wxr-text-ellipsis'>" + indexItem.indexCycleCrc + "<i class='" + indexItem.cycleCrcIconClassName + "'></i></div></li>" +
                "</ul>");
            bodyContent.find(".wxr-card-item-body-data").each(function (index, item) {
                if ($(this).find("div").length == 2) {
                    $(this).find("div:first-child").css({width: "50%"});
                    $(this).find("div:nth-child(2)").css({width: "50%", textAlign: "right"});
                }
            });
            cardItemBody.append(bodyContent);
            $(".wxr-cards-container").append(cardItemWrapper);
            // 点击事件绑定
            cardItemBody.on("click", function () {
                // $(".wxr-cards-container .wxr-card-item-body").removeClass("wxr-card-item-body-active");
                if (moduleCache.diffKeyword) {// 每次只能选中一个指标
                    $(".wxr-cards-container .wxr-card-item-body-active").removeClass("wxr-card-item-body-active");
                    $(".wxr-cards-container .layui-icon-ok-circle").removeClass("wxr-card-item-body-icon-checked");
                    $(this).addClass("wxr-card-item-body-active");
                    $(this).find(".layui-icon-ok-circle").addClass("wxr-card-item-body-icon-checked");
                    moduleCache.activeIndexCards = {};
                    moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                } else {// 可选中多个指标
                    if ($(this).hasClass("wxr-card-item-body-active")) {
                        if ($(".wxr-cards-container .wxr-card-item-body-active").length > 1) {
                            $(this).removeClass("wxr-card-item-body-active");
                            cardItemBody.find(".layui-icon-ok-circle").removeClass("wxr-card-item-body-icon-checked");
                            delete moduleCache.activeIndexCards[indexItem.indexCode];
                        }
                    } else {
                        $(this).addClass("wxr-card-item-body-active");
                        cardItemBody.find(".layui-icon-ok-circle").addClass("wxr-card-item-body-icon-checked");
                        moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                    }
                }
                renderChart();
            });
        });
    }

    function renderChart() {
        var thisChart = echarts.init($("#" + moduleCache.chartElementId + "")[0]),
            xAxisData = moduleCache.dateTimes, seriesDataArray = [], count = 0, interval = 1;
        if (moduleCache.urlParams.dateType == "day" || moduleCache.urlParams.dateType == "recent7" || moduleCache.urlParams.dateType == "recent30") {
            interval = 3;
        }
        if (moduleCache.diffKeyword) {
            count = 1;
            for (var selfOrDiff in moduleCache.data.trend) {
                var selfOrDiffObj = moduleCache.data.trend[selfOrDiff];
                // 当前选中的指标code，只能选中一个
                var activeIndexCode = Object.keys(moduleCache.activeIndexCards)[0], seriesName = selfOrDiff == "self" ? "关键词" : "对比词",
                    seriesObj = {
                        name: seriesName + "-" + moduleCache.activeIndexCards[activeIndexCode].indexName,
                        type: 'line',
                        data: selfOrDiffObj[activeIndexCode],
                        smooth: true,
                        symbol: "circle",
                        showSymbol: false,
                        symbolSize: 6
                    };
                seriesDataArray.push(seriesObj);
            }

        } else {
            for (var indexCode in moduleCache.activeIndexCards) {
                var activeCardItem = moduleCache.activeIndexCards[indexCode], seriesObj = {
                    name: activeCardItem.indexName,
                    type: 'line',
                    data: moduleCache.data.trend.self[indexCode],
                    smooth: true,
                    symbol: "circle",
                    showSymbol: false,
                    symbolSize: 6,
                    yAxisIndex: count
                };
                seriesDataArray.push(seriesObj);
                count++;
            }
        }
        var chartOptions = {
            xAxis: {
                type: 'category',
                axisLabel: {
                    interval: interval
                },
                axisLine: {},
                data: xAxisData,
            },
            series: seriesDataArray
        };
        commonModule.renderLineCharts(chartOptions, thisChart, count);
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var cols = [[]], heightGap = ($(window).height() * 0.04 + 114 + 260 + 86 + 40).toFixed(0);
        if (moduleCache.tableShowModel == "merge") {
            cols[0].push.apply(cols[0], [
                {field: "dateTime", title: "日期", minWidth: 110, sort: true},
                {field: "keyword", title: "搜索词", minWidth: 110, sort: true}
            ]);
            if (moduleCache.diffKeyword) {
                cols[0].push({field: "type", title: "类型", minWidth: 110, sort: true, templet: function (row) {
                        var color = "";
                        if (row.type == "关键词") {
                            color = commonModule.getChartColors().hex[0];
                        } else if (row.type == "对比词") {
                            color = commonModule.getChartColors().hex[1];
                        }
                        return "<span class='wxr-text-color-block' style='background: " + color + "'>" + row.type + "</span>";
                    }});
            }
            cols[0].push.apply(cols[0], [
                {field: "seIpvUvHits", title: "搜索人数", minWidth: 110, sort: true},
                {field: "sePvIndex", title: "搜索次数", minWidth: 110, sort: true},
                {field: "clickHits", title: "点击人数", minWidth: 110, sort: true},
                {field: "clickHot", title: "点击次数", minWidth: 110, sort: true},
                {field: "clickRate", title: "点击率", minWidth: 100, sort: true, isPercentValue: true},
                {field: "tradeIndex", title: "交易金额", minWidth: 110, sort: true},
                {field: "payConvRate", title: "支付转化率", minWidth: 130, sort: true, isPercentValue: true},
                {field: "payByrCnt", title: "支付人数", minWidth: 110, sort: true},
                {field: "buyerPerPrice", title: "客单价", minWidth: 100, sort: true}
            ]);
        } else {
            var keywordTextBgColor = commonModule.getChartColors().hex[0], diffKeywordTextBgColor = commonModule.getChartColors().hex[1];
            cols = [
                [
                    {field: "dateTime", title: "日期", sort: true, rowspan: 2, minWidth: 110, fixed: true},
                    {
                        title: "<span class='wxr-text-color-block' style='background: " + keywordTextBgColor + "'>关键词--" + moduleCache.urlParams.keyword + "</span>",
                        sort: true,
                        colspan: 9,
                        field: "colspan_self"
                    },
                    {
                        title: "<span class='wxr-text-color-block' style='background: " + diffKeywordTextBgColor + "'>对比词--" + moduleCache.diffKeyword + "</span>",
                        sort: true,
                        colspan: 9,
                        field: "colspan_diff"
                    }
                ],
                [
                    {field: "seIpvUvHits_self", title: "搜索人数", sort: true, minWidth: 110},
                    {field: "sePvIndex_self", title: "搜索次数", sort: true, minWidth: 110},
                    {field: "clickHits_self", title: "点击人数", sort: true, minWidth: 110},
                    {field: "clickHot_self", title: "点击次数", sort: true, minWidth: 110},
                    {field: "clickRate_self", title: "点击率", sort: true, minWidth: 100, isPercentValue: true},
                    {field: "tradeIndex_self", title: "交易金额", sort: true, minWidth: 100},
                    {field: "payConvRate_self", title: "支付转化率", sort: true, minWidth: 130, isPercentValue: true},
                    {field: "payByrCnt_self", title: "支付人数", sort: true, minWidth: 110},
                    {field: "buyerPerPrice_self", title: "客单价", sort: true, minWidth: 100},
                    {field: "seIpvUvHits_diff", title: "搜索人数", sort: true, minWidth: 110},
                    {field: "sePvIndex_diff", title: "搜索次数", sort: true, minWidth: 110},
                    {field: "clickHits_diff", title: "点击人数", sort: true, minWidth: 110},
                    {field: "clickHot_diff", title: "点击次数", sort: true, minWidth: 110},
                    {field: "clickRate_diff", title: "点击率", sort: true, minWidth: 110, isPercentValue: true},
                    {field: "tradeIndex_diff", title: "交易额", sort: true, minWidth: 110},
                    {field: "payConvRate_diff", title: "支付转化率", sort: true, minWidth: 130, isPercentValue: true},
                    {field: "payByrCnt_diff", title: "支付人数", sort: true, minWidth: 110},
                    {field: "buyerPerPrice_diff", title: "客单价", sort: true, minWidth: 100}
                ]
            ];
        }
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: moduleCache.data[moduleCache.tableShowModel],
            height: 'full-' + heightGap,
            layFilter: moduleCache.tableLayId + "LayFilter",
            cols: cols,
            done: function () {
                var currentTableDom = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']"),
                    keywordTextBgColor = commonModule.getChartColors().rgb[0],
                    diffKeywordTextBgColor = commonModule.getChartColors().rgb[1];
                currentTableDom.find("th[data-field*='_self']").css({background: "rgba(" + keywordTextBgColor + ",0.08)"});
                currentTableDom.find("td[data-field*='_self']").css({background: "rgba(" + keywordTextBgColor + ",0.08)"});
                currentTableDom.find("th[data-field*='_diff']").css({background: "rgba(" + diffKeywordTextBgColor + ",0.08)"});
                currentTableDom.find("td[data-field*='_diff']").css({background: "rgba(" + diffKeywordTextBgColor + ",0.08)"});
                // $(".layui-table th, .layui-table td").css({borderColor: "#CECECE"});
            }
        };
        if (moduleCache.tableShowModel == "compare") {
            renderTableOptions.skin = "";
        }
        var inst = commonModule.renderTable(renderTableOptions, layero);
    }

    return {
        init: function () {
            var targetDom = $("#searchTrend .oui-card-header-item.oui-card-header-item-pull-right"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "append", buttons, true, function (targetDom) {
                // $(".wxr-tool-buttons-inject-container").css("float", "none");
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  搜索分析-相关分析
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var searchAnalyzeRelationModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "搜索分析 | 相关分析",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        firstActiveTab: {}, // 选中的tab页
        tableData: {
            relatedBrand: [],
            relatedWord: [],
            relatedProperty: [],
            relatedHotWord: []
        }, // 弹出框的表格需要的数据
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "search-analyze-table", //table的dom控件的id属性
        tableLayId: "searchAnalyzeTable" //table在layui中定义的id，即lay-ui属性
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheKey();
        // 组装缓存数据
        assembleCacheData();
        // 转换指数
        transformData();
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + moduleCache.firstActiveTab.name
                + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        // var dialogWidth;
        // if (moduleCache.firstActiveTab.code == "relatedWord") {
        //     dialogWidth = "96%";
        // } else {
        //     dialogWidth = "80%";
        // }
        var dialogOptions = {
            title: dialogTitle,
            area: ['96%', '90%'],
            // offset: "100px",
            content: "<div id='" + moduleCache.tableElementId + "' lay-filter='list_table'></div>",
            success: function (layero, index) {
                setTimeout(function () {
                    renderTable(layero);
                }, 50);

            }
        };
        commonModule.openDialog(dialogOptions);
    }

    // 组装缓存key
    function assembleCacheKey() {
        // 萃取URL地址的参数
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 先找到选中的那个tab[相关搜索词、关联品牌词、关联修饰词、关联热词]
        var firstActiveTabName = $(".oui-card .oui-card-header .oui-tab-switch .oui-tab-switch-item-active").text(),
            cacheKey = "/mc/searchword",
            firstActiveTabCode, sortedCacheKeyParam, cateId, order, orderBy;
        switch (firstActiveTabName) {
            case "相关搜索词":
                firstActiveTabCode = "relatedWord";
                break;
            case "关联品牌词":
                firstActiveTabCode = "relatedBrand";
                break;
            case "关联修饰词":
                firstActiveTabCode = "relatedProperty";
                break;
            case "关联热词":
                firstActiveTabCode = "relatedHotWord";
                break;
        }
        moduleCache.firstActiveTab = {name: firstActiveTabName, code: firstActiveTabCode};
        cacheKey += "/" + firstActiveTabCode + ".json?dateRange=" + moduleCache.urlParams.dateRange + "&dateType="
            + moduleCache.urlParams.dateType + "&pageSize=10&page=1";
        cacheKey += "&order=desc&orderBy=seIpvUvHits&keyword=" + moduleCache.urlParams.keyword
            + "&device=" + moduleCache.urlParams.device;
        var cacheKeyPageAndSortParams = commonModule.getCachePageAndSortParams($(".oui-card .oui-card-content"));
        // 最终成型的缓存key
        cacheKey += "&indexCode=" + cacheKeyPageAndSortParams.indexCode;
        moduleCache.localCacheKey = globalUrlPrefix + cacheKey;
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        var isDecrypt = false;
        if (moduleCache.firstActiveTab.code == "relatedWord") {
            isDecrypt = true;
        }
        var cacheData = commonModule.getUsableOriginalJsonDataFromCache(moduleCache.localCacheKey, isDecrypt);
        if (cacheData) {
            moduleCache.tableData[moduleCache.firstActiveTab.code] = cacheData;
        }
    }

    function transformData() {
        // 将第一级tab下的所有数据转换
        var willTransformData = moduleCache.tableData[moduleCache.firstActiveTab.code];
        for (var i in willTransformData) {
            var data = willTransformData[i];
            // commonModule.indexCodeValueTransform(data);
            if (moduleCache.firstActiveTab.code == "relatedWord") {
                // 点击人数
                data.clickHitsValue = commonModule.calculateFormula(data.clickHits, 1, 0);
                // 点击次数
                data.clickHotValue = commonModule.calculateFormula(data.clickHot, 1, 0);
                // 点击率
                data.clickRateValue = Number((data.clickRate * 100).toFixed(2));
                // 搜索人数
                data.seIpvUvHitsValue = commonModule.calculateFormula(data.seIpvUvHits, 1, 0);
                // 搜索次数
                data.sePvIndexValue = commonModule.calculateFormula(data.sePvIndex, 1, 0);
                // 直通车参考价
                data.p4pAmtValue = Number((data.p4pAmt * 1).toFixed(2));
                // 支付转化率
                data.payConvRateValue = Number((data.payConvRate * 100).toFixed(2));
                // 支付人数
                data.payByrCnt = Math.round(data.clickHitsValue * data.payConvRate);
                // 商城点击占比
                data.tmClickRatioValue = Number((data.tmClickRatio * 100).toFixed(2));
                // 交易金额
                data.tradeIndexValue = commonModule.calculateFormula(data.tradeIndex, 1, 0);
                // 客单价
                data.perTicketSales = Number((data.tradeIndexValue / data.payByrCnt).toFixed(2));
            } else {
                // 搜索人数
                data.seIpvUvHitsValue = commonModule.calculateFormula(data.seIpvUvHits, 1, 0);
                // 词均点击率
                data.avgWordClickRateValue = Number((data.avgWordClickRate * 100).toFixed(2));
                // 点击人数
                data.clickHitsValue = commonModule.calculateFormula(data.clickHits, 1, 0);
                // 词均支付转化率
                data.avgWordPayRateValue = Number((data.avgWordPayRate * 100).toFixed(2));
                // 词均支付人数
                data.avgWordPayByrCnt = Math.round(data.seIpvUvHitsValue * data.avgWordPayRate);
                // 直通车参考价
                data.p4pAmtValue = Number((data.p4pAmt / 100).toFixed(2));
            }
        }
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var cols = [[]], heightGap = ($(window).height() * 0.1 + 104).toFixed(0);
        cols[0].push.apply(cols[0], [
                {field: "keyword", title: "搜索词", minWidth: 110},
                {field: "seIpvUvHitsValue", title: "搜索人数", minWidth: 110, sort: true}
            ]
        );
        if (moduleCache.firstActiveTab.code == "relatedWord") {
            cols[0].push.apply(cols[0], [
                {field: "sePvIndexValue", title: "搜索次数", minWidth: 110, sort: true},
                {field: "clickRateValue", title: "点击率", minWidth: 110, sort: true, isPercentValue: true},
                {field: "clickHitsValue", title: "点击人数", minWidth: 110, sort: true},
                {field: "clickHotValue", title: "点击次数", minWidth: 110, sort: true},
                {field: "tradeIndexValue", title: "交易金额", minWidth: 110, sort: true},
                {field: "payConvRateValue", title: "支付转化率", minWidth: 110, sort: true, isPercentValue: true},
                {field: "onlineGoodsCnt", title: "在线商品数", minWidth: 110, sort: true},
                {field: "tmClickRatioValue", title: "商城点击占比", minWidth: 110, sort: true, isPercentValue: true},
                {field: "p4pAmtValue", title: "直通车参考价", minWidth: 110, sort: true},
                {field: "payByrCnt", title: "支付人数", minWidth: 110, sort: true},
                {field: "perTicketSales", title: "客单价", minWidth: 110, sort: true}
            ]);
        } else {
            cols[0].push.apply(cols[0], [
                {field: "relSeWordCnt", title: "相关搜索次数", minWidth: 110, sort: true},
                {field: "avgWordClickRateValue", title: "词均点击率", minWidth: 110, sort: true, isPercentValue: true},
                {field: "clickHitsValue", title: "点击人数", minWidth: 110, sort: true},
                {field: "avgWordPayRateValue", title: "词均支付转化率", minWidth: 110, sort: true, isPercentValue: true},
                {field: "avgWordPayByrCnt", title: "词均支付人数", minWidth: 110, sort: true}
                // {field: "p4pAmtValue", title: "直通车参考价", minWidth: 110, sort: true}
            ]);
        }
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: moduleCache.tableData[moduleCache.firstActiveTab.code],
            height: 'full-' + heightGap,
            cols: cols,
            done: function () {

            }
        };
        var inst = commonModule.renderTable(renderTableOptions, layero);
        // window大小改变，重置table大小
        // window.addEventListener("resize", function () {
        //     var currentTableDom = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']"),
        //         // 弹出框高度 - 弹出框标题栏高度 - 表格下方信息栏高度 - 工具栏高度 - 标题列高度
        //         tableMainHeight = currentTableDom.parents(".layui-layer").height() - 84 - currentTableDom.find(".layui-table-tool").outerHeight()
        //             - currentTableDom.find(".layui-table-header").outerHeight();
        //     console.log(currentTableDom.parents(".layui-layer").height() + "--" + currentTableDom.find(".layui-table-tool").outerHeight() +
        //         "--" + currentTableDom.find(".layui-table-header").outerHeight() + "--" + tableMainHeight);
        //     currentTableDom.find(".layui-table-box .layui-table-main").css({height: tableMainHeight});
        // });
    }

    return {
        init: function () {
            var targetDom = $(".oui-card .oui-card-header .oui-card-header-item.oui-card-header-item-pull-left"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "before", buttons, true, function (targetDom) {
                // $(".wxr-tool-buttons-inject-container").css("float", "none");
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  搜索分析-类目构成
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var searchAnalyzeCategoryModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "搜索分析 | 类目构成",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        firstLevelCategoryArray: [], // 展示的相关类目
        tableData: {// 表格要展示的数据,只有5个类目
            // category0: {
            //     pages: {},
            //     total: [],
            //     maxPageNo: 1
            // },
            // category1: {
            //     pages: {},
            //     total: [],
            //     maxPageNo: 1
            // },
            // category2: {
            //     pages: {},
            //     total: [],
            //     maxPageNo: 1
            // },
            // category3: {
            //     pages: {},
            //     total: [],
            //     maxPageNo: 1
            // },
            // category4: {
            //     pages: {},
            //     total: [],
            //     maxPageNo: 1
            // },
        }, // 弹出框的表格需要的数据
        activeCategoryIndex: "",
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "search-category-table", //table的dom控件的id属性
        tableLayId: "searchCategoryTable", //table在layui中定义的id，即lay-ui属性
        cardSelectModel: "single", // 弹出框中选择块的模式：单选
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        // assembleCacheKey();
        if (!assembleCacheData()) {
            return;
        }
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogWidth;
        var dialogOptions = {
            title: dialogTitle,
            area: ['85%', '90%'],
            // offset: "100px",
            content: "<div class='wxr-cards-container'></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                setTimeout(function () {
                    drawCategoryItem();
                    renderTable(layero);
                }, 50);

            }
        };
        commonModule.openDialog(dialogOptions);
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        // 萃取URL地址的参数
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        var activeCategoryIndex = 0;
        $(".oui-card-content .oui-tab-switch-item-custom").each(function (index) {
            if ($(this).hasClass("oui-tab-switch-item-custom-active")) {
                // 激活的类目索引
                moduleCache.activeCategoryIndex = index;
                return false;
            }
        });
        // 先获取大的类目
        var firstLevelCategoryCacheKey = globalUrlPrefix + "/mc/searchword/getCategory.json?dateType=" + moduleCache.urlParams.dateType + "&dateRange="
            + moduleCache.urlParams.dateRange + "&keyword=" + moduleCache.urlParams.keyword + "&device=" + moduleCache.urlParams.device;
        var firstLevelCategoryCacheData = commonModule.getUsableOriginalJsonDataFromCache(firstLevelCategoryCacheKey, true);
        if (firstLevelCategoryCacheData) {
            // 清空缓存
            moduleCache.tableData = {};
            var firstLevelCategorys = firstLevelCategoryCacheData.data;
            if (firstLevelCategorys.length > 0) {
                moduleCache.firstLevelCategoryArray = firstLevelCategorys;
                transformData(moduleCache.firstLevelCategoryArray);
                // 开始拼接缓存url
                var cacheKey = globalUrlPrefix + "/mc/searchword/getCategory.json?dateRange=" + moduleCache.urlParams.dateRange + "&dateType="
                    + moduleCache.urlParams.dateType;
                var cacheKeyPageAndSortParams = commonModule.getCachePageAndSortParams($("#categoryConstitute"));
                cacheKey += "&pageSize=" + cacheKeyPageAndSortParams.pageSize + "&page=" + cacheKeyPageAndSortParams.pageNo
                    + "&order=" + cacheKeyPageAndSortParams.order + "&orderBy=" + cacheKeyPageAndSortParams.orderBy
                    + "&keyword=" + moduleCache.urlParams.keyword + "&device=" + moduleCache.urlParams.device
                    + "&level1Id=" + firstLevelCategorys[moduleCache.activeCategoryIndex].cateId + "&indexCode=" + cacheKeyPageAndSortParams.indexCode;
                // 获取所有分页的数据
                var count = 0;
                for (var i = 1; i <= cacheKeyPageAndSortParams.maxPageNo; i++) {
                    var key = cacheKey.replace(/&page=\S+&order=/, "&page=" + i + "&order="),
                        decodeJsonData = commonModule.getUsableOriginalJsonDataFromCache(key, true);
                    if (decodeJsonData) {
                        count++;
                        var categoryData = moduleCache.tableData["category" + moduleCache.activeCategoryIndex];
                        if (!categoryData) {
                            categoryData = {};
                            categoryData.maxPageNo = cacheKeyPageAndSortParams.maxPageNo;
                            categoryData.currentPageNo = cacheKeyPageAndSortParams.pageNo;
                            moduleCache.tableData["category" + moduleCache.activeCategoryIndex] = categoryData;
                        }
                        if (count == 1) {// 初次拿到数据
                            categoryData.pages = {}, categoryData.total = [];
                        }
                        categoryData.pages["page" + i] = decodeJsonData.data;
                        categoryData.total.push.apply(categoryData.total, decodeJsonData.data);
                    }
                }
                transformData(moduleCache.tableData["category" + moduleCache.activeCategoryIndex].total);
            }
            return true;
        } else {
            layui.layer.msg('缓存数据获取失败，请重新刷新页面', {
                offset: 't',
                anim: 6
            });
            return false;
        }
    }

    function transformData(dataArray) {
        for (var i in dataArray) {
            var dataItem = dataArray[i];
            // 点击次数占比
            dataItem.clickCntRatioValue = Number((dataItem.clickCntRatio * 100).toFixed(2));
            // 点击人数
            dataItem.clickHitsValue = commonModule.calculateFormula(dataItem.clickHits, 1, 0);
            // 点击人数占比
            dataItem.clickHitsRatioValue = Number((dataItem.clickHitsRatio * 100).toFixed(2));
            // 点击次数
            dataItem.clickHotValue = commonModule.calculateFormula(dataItem.clickHot, 1, 0);
            // 点击率
            dataItem.clickRateValue = Number((dataItem.clickRate * 100).toFixed(2));
        }
    }

    function drawCategoryItem() {
        // 计算每个小块宽度的百分比
        var cardItemWrapperPercent = (100 / 5).toFixed(4);
        // 舍去最后一位，防止宽度超出
        cardItemWrapperPercent = cardItemWrapperPercent.substring(0, cardItemWrapperPercent.length - 2);
        $(".wxr-cards-container").css({width: "80%"});
        // for (var i in moduleCache.firstLevelCategoryArray) {
        $.each(moduleCache.firstLevelCategoryArray, function (index, categoryItem) {
            var cardItemWrapper = $("<div class='wxr-card-item-wrapper' style='width: " +
                cardItemWrapperPercent + "%'></div>"),
                cardItemBody = $("<div class='wxr-card-item-body wxr-card-item-body-solid'></div>");
            cardItemWrapper.append(cardItemBody);
            if (moduleCache.activeCategoryIndex == index) {
                cardItemBody.addClass("wxr-card-item-body-active");
            }
            // 填充内容
            var bodyContent = $("<ul><li class='wxr-card-item-body-title wxr-text-ellipsis' title='" + categoryItem.cateName + "'>" + categoryItem.cateName + "</li>" +
                "<li class='wxr-card-item-body-data'><div class='wxr-text-ellipsis'>点击人数</div><div class='wxr-text-ellipsis'>" + categoryItem.clickHitsValue + "</div></li>" +
                "<li class='wxr-card-item-body-data'><div class='wxr-text-ellipsis'>点击人数占比</div><div class='wxr-text-ellipsis'>" + categoryItem.clickHitsRatioValue + "%</div></li>" +
                "<li class='wxr-card-item-body-data'><div class='wxr-text-ellipsis'>点击次数</div><div class='wxr-text-ellipsis'>" + categoryItem.clickHotValue + "</div></li>" +
                "<li class='wxr-card-item-body-data'><div class='wxr-text-ellipsis'>点击次数占比</div><div class='wxr-text-ellipsis'>" + categoryItem.clickCntRatioValue + "%</div></li>" +
                "<li class='wxr-card-item-body-data'><div class='wxr-text-ellipsis'>点击率</div><div class='wxr-text-ellipsis'>" + categoryItem.clickRateValue + "%</div></li>" +
                "</ul>");
            bodyContent.find(".wxr-card-item-body-data div:first-child").css({width: "60%"});
            bodyContent.find(".wxr-card-item-body-data div:nth-child(2)").css({width: "40%", textAlign: "right"});
            cardItemBody.append(bodyContent);
            $(".wxr-cards-container").append(cardItemWrapper);
            cardItemBody.on("click", function () {
                $(".wxr-cards-container .wxr-card-item-body").removeClass("wxr-card-item-body-active");
                $(this).addClass("wxr-card-item-body-active");
                // 生意参谋页面同步点击
                $(".oui-card-content .oui-tab-switch-item-custom").eq(Number(index)).trigger("click");
                var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0}), count = 0;

                function myTimer() {
                    var timer = setTimeout(function () {
                        if (!assembleCacheData()) {
                            return;
                        }
                        if (!moduleCache.tableData["category" + moduleCache.activeCategoryIndex]) {
                            count++;
                            if (count > 40) {
                                layui.layer.msg('数据获取超时', {
                                    offset: 't',
                                    anim: 6
                                });
                                layui.layer.close(loading);
                                return;
                            }
                            myTimer();
                        } else {
                            renderTable();
                            layui.layer.close(loading);
                        }
                    }, 500);
                }

                myTimer();
            });
            // 只需要前5个类目即可
            if (index == 4) {
                return false;
            }
        });
        // }
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var heightGap = ($(window).height() * 0.1 + $(".wxr-cards-container").outerHeight()
            + 114).toFixed(0),
            cols = [[
                {field: "cateName", title: "类目名称", minWidth: 210},
                {field: "clickHitsValue", title: "点击人数", minWidth: 110},
                {field: "clickHitsRatioValue", title: "点击人数占比", minWidth: 150, isPercentValue: true},
                {field: "clickHotValue", title: "点击次数", minWidth: 110},
                {field: "clickCntRatioValue", title: "点击次数占比", minWidth: 110, isPercentValue: true},
                {field: "clickRateValue", title: "点击率", minWidth: 110, isPercentValue: true}
            ]];
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: moduleCache.tableData["category" + moduleCache.activeCategoryIndex].total,
            height: 'full-' + heightGap,
            cols: cols,
            done: function () {
                // if (moduleCache.tableData["category" + moduleCache.activeCategoryIndex].maxPageNo > 1) {
                drawCachePageBar();
                // }
            }
        };
        var inst = commonModule.renderTable(renderTableOptions, layero);
    }

    function drawCachePageBar(heightGap, cols) {
        $(".wxr-table-bottom-page-number-bar").append("<div id='selfPageBar'></div>");
        layui.laypage.render({
            elem: "selfPageBar",
            // prev: "&#8592",
            // next: "&#8594",
            layout: ['page'],
            curr: moduleCache.tableData["category" + moduleCache.activeCategoryIndex].currentPageNo,
            limit: 10,
            count: moduleCache.tableData["category" + moduleCache.activeCategoryIndex].maxPageNo * 10,
            // limits: [5, 10, 20, 50, 100],
            jump: function (obj, first) {
                // 页码添加未缓存标志
                $("#selfPageBar .layui-laypage a").each(function (index) {
                    var className = $(this).attr("class"), pageNo = $(this).text();
                    if (className && (className.indexOf("layui-laypage-prev") != -1 ||
                        className.indexOf("layui-laypage-next") != -1)) {
                        return true;
                    }
                    var pageData = moduleCache.tableData["category" + moduleCache.activeCategoryIndex].pages["page" + pageNo];
                    if (!pageData) {
                        // $(this).css({"opacity": "0.5", "filter":"alpha(opacity=50)", "background":"gray", "color":"#fff"});
                        $(this).css("position", "relative");
                        $(this).append("<i class='layui-badge-dot' style='position: absolute;top:4px;right: 2px'></i>");
                    }
                });
                if (!first) {
                    // 同步点击生意参谋页面的第几页按钮
                    $(".contentContainer .alife-dt-card-common-table-pagination-wrapper .ant-pagination-item")
                        .each(function (index) {
                            if ($(this).text() == obj.curr) {
                                $(this).trigger("click");
                                var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0}), count = 0;

                                function myTimer() {
                                    var timer = setTimeout(function () {
                                        if (!assembleCacheData()) {
                                            return;
                                        }
                                        if (!moduleCache.tableData["category" + moduleCache.activeCategoryIndex].pages["page" + obj.curr]) {
                                            count++;
                                            if (count > 20) {
                                                layui.layer.msg('数据获取超时', {
                                                    offset: 't',
                                                    anim: 6
                                                });
                                                layui.layer.close(loading);
                                                return;
                                            }
                                            myTimer();
                                        } else {
                                            renderTable();
                                            layui.layer.close(loading);
                                        }
                                    }, 500);
                                }

                                myTimer();
                            }
                        });
                }
            }
        });
    }

    return {
        init: function () {
            var targetDom = $(".oui-card .oui-card-title").eq(0),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "after", buttons, true, function (targetDom) {
                // $(".wxr-tool-buttons-inject-container").css("float", "none");
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  产品洞察-热门产品(关键字检索是前端完成)
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var productInsightHotModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "产品洞察 | 热门产品",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        tableData: {},
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "product-insight-hot-table", //table的dom控件的id属性
        tableLayId: "productInsightHostTable", //table在layui中定义的id，即lay-ui属性
        // cardSelectModel: "single", // 弹出框中选择块的模式：单选
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        // assembleCacheKey();
        if (!assembleCacheData()) {
            layui.layer.msg('缓存数据获取失败，请重新刷新页面', {
                offset: 't',
                anim: 6
            });
            return;
        }
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogWidth;
        var dialogOptions = {
            title: dialogTitle,
            area: ['50%', '80%'],
            // offset: "100px",
            content: "<div class='wxr-cards-container'></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                setTimeout(function () {
                    renderTable(layero);
                }, 50);

            }
        };
        commonModule.openDialog(dialogOptions);
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        // 萃取URL地址的参数
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 先获取当前所选类目下的品牌
        var brandListCacheKey = globalUrlPrefix + "/mc/mq/product/getBrands.json?keyword=&cateId=" + moduleCache.urlParams.cateId,
            brandListData = commonModule.getUsableOriginalJsonDataFromCache(brandListCacheKey, true),
            brandText = $(".oui-card .oui-card-header-item.oui-card-header-item-pull-right .sycm-common-select-simple-text").attr("title"),
            brandId = "";
        if (brandText != "所有品牌") {
            for (var i in brandListData) {
                var brandItem = brandListData[i];
                if (brandItem.brandName == brandText) {
                    brandId = brandItem.brandId;
                    break;
                }
            }
        }
        // 获取表格数据缓存
        var productHotRankDataCacheKey = globalUrlPrefix + "/mc/mq/product/prodHotRank.json?dateRange=" + moduleCache.urlParams.dateRange + "&dateType=" +
            moduleCache.urlParams.dateType + "&pageSize=10&page=1&order=desc",
            cacheKeyPageAndSortParams = commonModule.getCachePageAndSortParams($("#itemRank"));
        productHotRankDataCacheKey += "&orderBy=" + cacheKeyPageAndSortParams.orderBy + "&cateId=" + moduleCache.urlParams.cateId
            + "&brandId=" + brandId + "&deviceType=" + moduleCache.urlParams.device + "&sellerType="
            + moduleCache.urlParams.sellerType + "&indexCode=" + cacheKeyPageAndSortParams.indexCode;
        var productHotRankData = commonModule.getUsableOriginalJsonDataFromCache(productHotRankDataCacheKey, true);
        if (productHotRankData) {
            moduleCache.tableData = productHotRankData;
            transformData(productHotRankData);
            return true;
        } else {
            return false;
        }
    }

    function transformData(dataArray) {
        for (var i in dataArray) {
            var dataItem = dataArray[i];
            // 交易金额
            dataItem.tradeIndexValue = commonModule.calculateFormula(dataItem.tradeIndex, 1, 0);
            // 件单价
            dataItem.itemPrice = Number((dataItem.tradeIndexValue / dataItem.payItmCnt).toFixed(2));
        }
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var heightGap = ($(window).height() * 0.2 + 114).toFixed(0),
            cols = [[
                {
                    field: "brandName", title: "产品名称", minWidth: 320, templet: function (row) {
                        return "<ul><li>" + (row.brandName + " + " + row.modelName) + "\n</li><li class='wxr-font-light-color'>排名：" + row.rankId + "\n</li></ul>";
                    }
                },
                {field: "tradeIndexValue", title: "交易金额", minWidth: 110, sort: true},
                {field: "payItmCnt", title: "支付件数", minWidth: 110, sort: true},
                {field: "itemPrice", title: "件单价", minWidth: 110, sort: true}
            ]];
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: moduleCache.tableData,
            height: 'full-' + heightGap,
            cols: cols,
            done: function () {

            }
        };
        var inst = commonModule.renderTable(renderTableOptions, layero);
        // window大小改变，重置table大小
        // window.addEventListener("resize", function () {
        //     var currentTableDom = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']"),
        //         // 弹出框高度 - 弹出框标题栏高度 - 表格下方信息栏高度 - 工具栏高度 - 标题列高度
        //         tableMainHeight = currentTableDom.parents(".layui-layer").height() - 84 - currentTableDom.find(".layui-table-tool").outerHeight()
        //             - currentTableDom.find(".layui-table-header").outerHeight();
        //     console.log(currentTableDom.parents(".layui-layer").height() + "--" + currentTableDom.find(".layui-table-tool").outerHeight() +
        //         "--" + currentTableDom.find(".layui-table-header").outerHeight() + "--" + tableMainHeight);
        //     currentTableDom.find(".layui-table-box .layui-table-main").css({height: tableMainHeight});
        // });
    }

    return {
        init: function () {
            var targetDom = $(".oui-card .op-mc-product-insight-hot-filter-area").eq(0),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "prepend", buttons, true, function (targetDom) {
                $(".wxr-tool-buttons-inject-container").css("float", "none");
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  产品洞察-产品分析-产品趋势
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var productInsightAnalyzeTrendModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "产品洞察 | 产品趋势",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        data: {
            overview: {// 一览数据

            },
            trend: {// 趋势数据

            },
            merge: [],// 合并模式数据
            compare: []// 比对模式数据
        },
        activeIndexCards: {},
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "product-insight-analyze-trend-table", //table的dom控件的id属性
        tableLayId: "productInsightAnalyzeTrendTable", //table在layui中定义的id，即lay-ui属性
        chartElementId: "product-insight-analyze-trend-chart",
        spuId: ""
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogWidth;
        var dialogOptions = {
            title: dialogTitle,
            area: ['98%', '96%'],
            // offset: "100px",
            content: "<div class='wxr-cards-container'></div>" +
                "<div class='wxr-charts-container' id='" + moduleCache.chartElementId + "'></div>" +
                // "<div id='search-analyze-trend-tab' class='layui-tab layui-tab-brief' lay-filter='tabLayFilter'><ul class='layui-tab-title'><li class='layui-this' value='merge'>合并模式</li><li value='compare'>对比模式</li></ul></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                drawIndexCards();
                renderChart();
                setTimeout(function () {
                    // renderTabs();
                    renderTable(layero);
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    // function renderTabs() {
    //     moduleCache.tableShowModel = "merge";
    //     // $("#search-analyze-trend-tab").show();
    //     $("#search-analyze-trend-tab").css({margin: "0px 0px"});
    //     if (!moduleCache.diffKeyword) {// 没有对比词时对比模式禁用
    //         $("#search-analyze-trend-tab li:last").css({cursor: "not-allowed"});
    //         // $("#search-analyze-trend-tab li:last").css({cursor: "not-allowed", pointerEvents: "none"});
    //     }
    //     layui.element.on("tab(tabLayFilter)", function () {
    //         if (moduleCache.diffKeyword) {// 没有对比词时对比模式禁用
    //             moduleCache.tableShowModel = $(this).attr("value");
    //             renderTable();
    //         }
    //     });
    // }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        // 萃取URL地址的参数
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 获取对比词，不能拿输入框中的值，因为可能只是输入了却没有真正搜索，应该拿图标上方的图例中的文字
        // var diffKeyword = "", chartLegendTextDom = $(".oui-pro-chart-component-legend-content .oui-pro-chart-component-legend-content-text"), selectedIndexName;
        // 选中的指标名称
        // var selectedIndexName = $(".index-area-multiple-container .alife-one-design-sycm-indexes-trend-index-item-multiple-line-selectable.active .oui-index-cell-indexName").text();
        // if (chartLegendTextDom.length > 1) {
        //     diffKeyword = chartLegendTextDom.eq(1).text().replace(selectedIndexName, "");
        // }
        // moduleCache.diffKeyword = diffKeyword;
        // 获取该类目下的所有品牌
        var brandCacheKey = globalUrlPrefix + "/mc/mq/product/getBrands.json?keyword=&cateId=" + moduleCache.urlParams.cateId,
            brandData = commonModule.getUsableOriginalJsonDataFromCache(brandCacheKey, true), selectedBrandId,
            selectedBrandName = $(".alife-dt-card-sycm-common-select .sycm-common-select-simple-text").eq(0).attr("title");
        for (var i in brandData) {
            if (brandData[i].brandName == selectedBrandName) {
                selectedBrandId = brandData[i].brandId;
                break;
            }
        }
        // 获取型号id
        var selectedModelName = $(".alife-dt-card-sycm-common-select .sycm-common-select-simple-text").eq(1).attr("title"), selectedModelId,
            modelCacheKey = globalUrlPrefix + "/mc/mq/product/getModels.json?keyword=&cateId="
            + moduleCache.urlParams.cateId + "&brandId=" + selectedBrandId, modelData = commonModule.getUsableOriginalJsonDataFromCache(modelCacheKey, true);
        for (var i in modelData) {
            if (modelData[i].modelName == selectedModelName) {
                selectedModelId = modelData[i].modelId;
                moduleCache.spuId = selectedModelId;
                break;
            }
        }
        // 拼接trend数据缓存key
        var productInsightAnalyzeTrendCacheKey = globalUrlPrefix + "/mc/mkt/product/trend.json?dateType=" + moduleCache.urlParams.dateType
            + "&dateRange=" + moduleCache.urlParams.dateRange + "&indexCode=&device=" + moduleCache.urlParams.device
            + "&cateId=" + moduleCache.urlParams.cateId + "&sellerType=" + moduleCache.urlParams.sellerType + "&spuId=" + moduleCache.spuId,
            searchAnalyzeTrendCacheData = commonModule.getUsableOriginalJsonDataFromCache(productInsightAnalyzeTrendCacheKey, true);
        if (searchAnalyzeTrendCacheData) {
            moduleCache.data.trend = searchAnalyzeTrendCacheData;
            moduleCache.propertyName = selectedBrandName + "--" + selectedModelName;
            transformData();
        }
    }

    function transformData() {
        // 根据指标数组的长度计算出时间维度数组
        var dataLength, endTimeStr = moduleCache.urlParams.dateRange.split("|")[1];
        for (var indexCode in moduleCache.data.trend) {
            if (indexCode == "dateTimes" || indexCode == "statDate") {
                continue;
            }
            var indexItemArray = moduleCache.data.trend[indexCode];
            dataLength = indexItemArray.length;
            if (dataLength) {
                break;
            }
        }
        // 生成时间周期
        moduleCache.dateTimes = commonModule.generateStatisticTimes(dataLength, endTimeStr, moduleCache.urlParams.dateType);
        // 合并各指标数据
        var mergeData = [];
        for (var i in moduleCache.dateTimes) {
            var mergeItem = {
                dateTime: moduleCache.dateTimes[i],
                propertyName: moduleCache.propertyName
            };
            for (var indexCode in moduleCache.data.trend) {
                var indexItemTrendArray = moduleCache.data.trend[indexCode];
                if (indexCode == "tradeIndex" || indexCode == "uvIndex" || indexCode == "seIpvUvHits"
                    || indexCode == "cltHits" || indexCode == "cartHits" || indexCode == "payByrCntIndex") {
                    indexItemTrendArray[i] = commonModule.calculateFormula(indexItemTrendArray[i], 1, 0);
                } else if (indexCode == "payRateIndex") {
                    indexItemTrendArray[i] = commonModule.calculateFormula(indexItemTrendArray[i], 0, 2);
                }
                mergeItem[indexCode] = indexItemTrendArray[i];
                // 客单价 = 交易金额 / 支付人数
                mergeItem["perTicketSales"] = Number((mergeItem.tradeIndex / mergeItem.payByrCntIndex).toFixed(2));
                // uv价值
                mergeItem["uvValue"] = Number((mergeItem.tradeIndex / mergeItem.uvIndex).toFixed(2));
                // 搜索占比
                mergeItem["seIpvUvHitsRate"] = Number((mergeItem.seIpvUvHits / mergeItem.uvIndex * 100).toFixed(2));
                // 收藏率
                mergeItem["cltCntRate"] = Number((mergeItem.cltHits / mergeItem.uvIndex * 100).toFixed(2));
                // 加购率
                mergeItem["addCartRate"] = Number((mergeItem.cartHits / mergeItem.uvIndex * 100).toFixed(2));
            }
            mergeData.push(mergeItem);
        }
        moduleCache.data.merge = mergeData;
    }

    /**
     * @Author xuyefei
     * @Description  存储各指标块信息,主要是为了按照相同顺序显示
     * @Date 14:26 2020/7/31
     * @Param
     * @return
     **/
    function assembleIndexCards() {
        var indexCardsDom = $("#productTrend .index-area-multiple-root-container .oui-index-cell"),
            sortedIndexCards = [];
        indexCardsDom.each(function (index, item) {
            var indexCard = {}, indexCode = $(this).attr("value"),
                indexOldName = $(this).find(".oui-index-cell-indexName").text(),
                indexValue = $(this).find(".oui-index-cell-indexValue").text(),
                indexCycleCrc = $(this).find(".oui-index-cell-indexChange .oui-pull-right span").eq(0).text(),
                indexNewName, compareText = $(this).find(".oui-index-cell-indexChange .oui-index-cell-subIndex-text").text(), isPercentValue = false;
            if (indexCode == "tradeIndex") {
                indexNewName = "交易金额";
                indexValue = commonModule.calculateFormula(indexValue.replace(/,/g, ""), 1, 0);
            } else if (indexCode == "uvIndex") {
                indexNewName = "访客数量";
                indexValue = commonModule.calculateFormula(indexValue.replace(/,/g, ""), 1, 0);
            } else if (indexCode == "seIpvUvHits") {
                indexNewName = "搜索人数";
                indexValue = commonModule.calculateFormula(indexValue.replace(/,/g, ""), 1, 0);
            } else if (indexCode == "cltHits") {
                indexNewName = "收藏人数";
                indexValue = commonModule.calculateFormula(indexValue.replace(/,/g, ""), 1, 0);
            } else if (indexCode == "cartHits") {
                indexNewName = "加购人数";
                indexValue = commonModule.calculateFormula(indexValue.replace(/,/g, ""), 1, 0);
            } else if (indexCode == "payRateIndex") {
                indexNewName = "支付转化率";
                indexValue = commonModule.calculateFormula(indexValue.replace(/,/g, ""), 0, 2);
                isPercentValue = true;
            } else if (indexCode == "payByrCntIndex") {
                indexNewName = "支付人数";
                indexValue = commonModule.calculateFormula(indexValue.replace(/,/g, ""), 1, 0);
            }
            indexCard.isActive = false;
            if ($(this).parent().hasClass("active")) {
                indexCard.isActive = true;
            }
            indexCard.indexName = indexNewName ? indexNewName : indexOldName;
            indexCard.indexValue = indexValue;
            indexCard.indexCode = indexCode;
            indexCard.indexCycleCrc = indexCycleCrc;
            indexCard.cycleCrcIconClassName = $(this).find(".oui-index-cell-ratioTrendIcon i").attr("class");
            indexCard.compareText = compareText;
            indexCard.isPercentValue = isPercentValue;
            sortedIndexCards.push(indexCard);
        });
        return sortedIndexCards;
    }

    function drawIndexCards() {
        // 已选中的指标块初始化
        moduleCache.activeIndexCards = {};
        var sortedIndexCards = assembleIndexCards();
        // 计算每个小块宽度的百分比
        var cardItemWrapperPercent = (100 / sortedIndexCards.length).toFixed(4);
        // 舍去最后一位，防止宽度超出
        cardItemWrapperPercent = cardItemWrapperPercent.substring(0, cardItemWrapperPercent.length - 2);
        // $(".wxr-cards-container").css({width: "60%"});
        // for (var i in moduleCache.firstLevelCategoryArray) {
        $.each(sortedIndexCards, function (index, indexItem) {
            var cardItemWrapper = $("<div class='wxr-card-item-wrapper' style='width: " +
                cardItemWrapperPercent + "%'></div>"),
                cardItemBody = $("<div class='wxr-card-item-body wxr-card-item-body-solid'><i class='layui-icon layui-icon-ok-circle wxr-card-item-body-icon'></i></div>");
            cardItemWrapper.append(cardItemBody);
            if (indexItem.isActive) {
                cardItemBody.addClass("wxr-card-item-body-active");
                cardItemBody.find(".wxr-card-item-body-icon").addClass("wxr-card-item-body-icon-checked");
                moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
            }
            // 填充内容
            var bodyContent = $("<ul><li class='wxr-card-item-body-title wxr-text-ellipsis' style='font-size: 12px' title='" + indexItem.indexName + "'>" + indexItem.indexName + "</li>" +
                "<li class='wxr-card-item-body-data' style='font-size: 18px;line-height: 20px;color: #0C0C0C'><div class='wxr-text-ellipsis'>" + indexItem.indexValue + (indexItem.isPercentValue ? "%" : "") +  "</div></li>" +
                "<li class='wxr-card-item-body-data' style='font-size: 12px'><div class='wxr-text-ellipsis'>" + indexItem.compareText + "</div><div class='wxr-text-ellipsis'>" + indexItem.indexCycleCrc + "<i class='" + indexItem.cycleCrcIconClassName + "'></i></div></li>" +
                "</ul>");
            bodyContent.find(".wxr-card-item-body-data").each(function (index, item) {
                if ($(this).find("div").length == 2) {
                    $(this).find("div:first-child").css({width: "50%"});
                    $(this).find("div:nth-child(2)").css({width: "50%", textAlign: "right"});
                }
            });
            cardItemBody.append(bodyContent);
            $(".wxr-cards-container").append(cardItemWrapper);
            // 点击事件绑定
            cardItemBody.on("click", function () {
                if ($(this).hasClass("wxr-card-item-body-active")) {
                    if ($(".wxr-cards-container .wxr-card-item-body-active").length > 1) {
                        $(this).removeClass("wxr-card-item-body-active");
                        cardItemBody.find(".layui-icon-ok-circle").removeClass("wxr-card-item-body-icon-checked");
                        delete moduleCache.activeIndexCards[indexItem.indexCode];
                    }
                } else {
                    $(this).addClass("wxr-card-item-body-active");
                    cardItemBody.find(".layui-icon-ok-circle").addClass("wxr-card-item-body-icon-checked");
                    moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                }
                renderChart();
            });
        });
    }

    function renderChart() {
        var thisChart = echarts.init($("#" + moduleCache.chartElementId + "")[0]),
            xAxisData = moduleCache.dateTimes, seriesDataArray = [], count = 0, interval = 1;
        if (moduleCache.urlParams.dateType == "day" || moduleCache.urlParams.dateType == "recent7" || moduleCache.urlParams.dateType == "recent30") {
            interval = 3;
        }
        for (var indexCode in moduleCache.activeIndexCards) {
            var activeCardItem = moduleCache.activeIndexCards[indexCode], seriesObj = {
                name: activeCardItem.indexName,
                type: 'line',
                data: moduleCache.data.trend[indexCode],
                smooth: true,
                symbol: "circle",
                showSymbol: false,
                symbolSize: 6,
                yAxisIndex: count
            };
            seriesDataArray.push(seriesObj);
            count++;
        }
        var chartOptions = {
            xAxis: {
                type: 'category',
                axisLabel: {
                    interval: interval
                },
                axisLine: {},
                data: xAxisData,
            },
            series: seriesDataArray
        };
        commonModule.renderLineCharts(chartOptions, thisChart, count);
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var cols = [[]], heightGap = ($(window).height() * 0.04 + 114 + 260 + 86).toFixed(0);
        cols[0].push.apply(cols[0], [
            {field: "dateTime", title: "日期", minWidth: 110, sort: true},
            {field: "propertyName", title: "属性名称", minWidth: 180, sort: true},
            {field: "tradeIndex", title: "交易金额", minWidth: 100, sort: true},
            {field: "uvIndex", title: "访客数量", minWidth: 100, sort: true},
            {field: "seIpvUvHits", title: "搜索人数", minWidth: 100, sort: true},
            {field: "cltHits", title: "收藏人数", minWidth: 100, sort: true},
            {field: "cartHits", title: "加购人数", minWidth: 100, sort: true},
            {field: "payByrCntIndex", title: "支付人数", minWidth: 100, sort: true},
            {field: "payRateIndex", title: "支付转化率", minWidth: 110, sort: true, isPercentValue: true},
            {field: "slrCnt", title: "卖家数", sort: true, minWidth: 90},
            {field: "paySlrCnt", title: "有支付卖家数", minWidth: 120, sort: true},
            {field: "payItemCnt", title: "支付件数", sort: true, minWidth: 100},
            {field: "perTicketSales", title: "客单价", sort: true, minWidth: 80},
            {field: "uvValue", title: "uv价值", sort: true, minWidth: 80},
            {field: "seIpvUvHitsRate", title: "搜索占比", sort: true, isPercentValue: true, minWidth: 100},
            {field: "cltCntRate", title: "收藏率", sort: true, isPercentValue: true, minWidth: 80},
            {field: "addCartRate", title: "加购率", sort: true, isPercentValue: true, minWidth: 80}
        ]);
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: moduleCache.data.merge,
            height: 'full-' + heightGap,
            layFilter: moduleCache.tableLayId + "LayFilter",
            cols: cols,
            done: function () {
                // var currentTableDom = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']");
                // currentTableDom.find(".layui-table-header th .layui-table-cell").each(function (index, item) {
                //     var titleSpan = $(this).find("span").eq(0), titleText = titleSpan.text();
                //     if (titleText == "有支付卖家数") {
                //         titleSpan.html("有支付<br/>卖家数");
                //     } else if (titleText == "父行业有交易卖家占比") {
                //         titleSpan.html("父行业有交<br/>易卖家占比");
                //     }
                // });
            }
        };
        var inst = commonModule.renderTable(renderTableOptions, layero);
    }

    return {
        init: function () {
            var targetDom = $("div[data-card-id='productTrend'] .oui-card-header-item-pull-left"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "after", buttons, true, function (targetDom) {
                // $(".wxr-tool-buttons-inject-container").css("float", "none");
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  产品洞察-产品分析
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var productInsightAnalyzeHotSellModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "产品洞察 | 产品分析 | 热销榜单",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        activeTab: {name: "", code: ""},
        tableData: {
            uv: {// 流量商品
                pages: {},
                total: [],
                maxPageNo: 1
            },
            hot: {// 热销商品
                pages: {},
                total: [],
                maxPageNo: 1
            },
            mergeData: []
        },
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "product-insight-hot-sell-table", //table的dom控件的id属性
        tableLayId: "productInsightHotSellTable", //table在layui中定义的id，即lay-ui属性
        spuId: "",
        cateId: ""
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogWidth;
        var dialogOptions = {
            title: dialogTitle,
            area: ['90%', '90%'],
            // offset: "100px",
            content: "<div class='wxr-cards-container'></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                setTimeout(function () {
                    renderTable(layero);
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        // 萃取URL地址的参数
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        if (moduleCache.cateId == "") {
            moduleCache.cateId = moduleCache.urlParams.cateId;
        } else {
            // 类目重新选择，需要重置缓存
            if (moduleCache.cateId != moduleCache.urlParams.cateId) {
                moduleCache.tableData.uv = {pages: {}, total: [], maxPageNo: 1},
                    moduleCache.tableData.hot = {pages: {}, total: [], maxPageNo: 1};
                moduleCache.cateId = moduleCache.urlParams.cateId;
            }
        }
        var activeTabName = $("#productTrend").next().find(".oui-card-header-item.oui-card-header-item-pull-left .oui-tab-switch-item-active").text(),
            activeTabCode = "", rankType = 1;
        if (activeTabName == "热销商品") {
            activeTabCode = "hot";
        } else if (activeTabName == "流量商品") {
            activeTabCode = "uv";
            rankType = 2;
        }
        moduleCache.activeTab = {name: activeTabName, code: activeTabCode};
        var brandCacheKey = globalUrlPrefix + "/mc/mq/product/getBrands.json?keyword=&cateId=" + moduleCache.urlParams.cateId,
            brandData = commonModule.getUsableOriginalJsonDataFromCache(brandCacheKey, true), selectedBrandId,
            selectedBrandName = $(".alife-dt-card-sycm-common-select .sycm-common-select-simple-text").eq(0).attr("title");
        for (var i in brandData) {
            if (brandData[i].brandName == selectedBrandName) {
                selectedBrandId = brandData[i].brandId;
                break;
            }
        }
        // 获取型号id
        var selectedModelName = $(".alife-dt-card-sycm-common-select .sycm-common-select-simple-text").eq(1).attr("title"), selectedModelId,
            modelCacheKey = globalUrlPrefix + "/mc/mq/product/getModels.json?keyword=&cateId="
                + moduleCache.urlParams.cateId + "&brandId=" + selectedBrandId, modelData = commonModule.getUsableOriginalJsonDataFromCache(modelCacheKey, true);
        for (var i in modelData) {
            if (modelData[i].modelName == selectedModelName) {
                selectedModelId = modelData[i].modelId;
                if (moduleCache.spuId == "") {
                    moduleCache.spuId = selectedModelId;
                } else {
                    if (moduleCache.spuId != selectedModelId) {
                        moduleCache.tableData.uv = {pages: {}, total: [], maxPageNo: 1},
                            moduleCache.tableData.hot = {pages: {}, total: [], maxPageNo: 1};
                        moduleCache.spuId = selectedModelId;
                    }
                }
                break;
            }
        }
        // 拼接数据缓存key
        var productHotSellRankCacheKey = globalUrlPrefix + "/mc/mq/product/listProdItemRank.json?dateRange=" + moduleCache.urlParams.dateRange + "&dateType=" + moduleCache.urlParams.dateType,
            cacheKeyPageAndSortParams = commonModule.getCachePageAndSortParams($("#hotSaleRank" + moduleCache.activeTab.code));
        // 数据不够，无法知晓是否有分页
        // productHotSellRankCacheKey += "&pageSize=" + cacheKeyPageAndSortParams.pageSize + "&page=" + cacheKeyPageAndSortParams.pageNo
        //     + "&order=" + cacheKeyPageAndSortParams.order + "&orderBy=" + cacheKeyPageAndSortParams.orderBy
        //     + "&cateId=" + moduleCache.urlParams.cateId + "&deviceType=" + moduleCache.urlParams.device
        //     + "&sellerType=" + moduleCache.urlParams.sellerType + "&spuId=" + moduleCache.spuId + "&rankType=" + rankType
        //     // + "&sellerType=" + moduleCache.urlParams.sellerType + "&spuId=" + selectedModelId + "&rankType=1"
        //     + "&indexCode=" + cacheKeyPageAndSortParams.indexCode;
        productHotSellRankCacheKey += "&pageSize=" + cacheKeyPageAndSortParams.pageSize + "&page=" + cacheKeyPageAndSortParams.pageNo
            + "&order=" + cacheKeyPageAndSortParams.order + "&orderBy=" + cacheKeyPageAndSortParams.orderBy
            + "&cateId=" + moduleCache.urlParams.cateId + "&deviceType=" + moduleCache.urlParams.device
            + "&sellerType=" + moduleCache.urlParams.sellerType + "&spuId=" + moduleCache.spuId + "&rankType=" + rankType
            // + "&sellerType=" + moduleCache.urlParams.sellerType + "&spuId=" + selectedModelId + "&rankType=1"
            + "&indexCode=" + cacheKeyPageAndSortParams.indexCode;
        // 获取所有分页数据
        moduleCache.tableData[moduleCache.activeTab.code].maxPageNo = cacheKeyPageAndSortParams.maxPageNo;
        moduleCache.tableData[moduleCache.activeTab.code].currentPageNo = cacheKeyPageAndSortParams.pageNo;
        moduleCache.tableData[moduleCache.activeTab.code].page = {}, moduleCache.tableData[moduleCache.activeTab.code].total = [];
        for (var i = 1; i <= cacheKeyPageAndSortParams.maxPageNo; i++) {
            var key = productHotSellRankCacheKey.replace(/&page=\S+&order=/, "&page=" + i + "&order="),
                decodeJsonData = commonModule.getUsableOriginalJsonDataFromCache(key, true);
            if (decodeJsonData) {
                moduleCache.tableData[moduleCache.activeTab.code].pages["page" + i] = decodeJsonData.data,
                    moduleCache.tableData[moduleCache.activeTab.code].total.push.apply(moduleCache.tableData[moduleCache.activeTab.code].total, decodeJsonData.data);
            }
        }
        transformData();
    }

    function transformData() {
        var flowData = moduleCache.tableData.uv.total, hotData = moduleCache.tableData.hot.total;
        moduleCache.tableData.mergeData = [];
        // 求两个集合的并集
        if (hotData.length > 0) {
            for (var i in hotData) {
                var mergeObj = {item: {}}, hotObj = hotData[i];
                mergeObj.item.itemId = hotObj.itemId;
                mergeObj.item.itemName = hotObj.title;
                mergeObj.item.shopName = hotObj.shopName;
                mergeObj.item.picUrl = hotObj.picUrl;
                mergeObj.item.detailUrl = hotObj.detailUrl;
                // mergeObj.itemName = hotObj.title;
                // 交易金额
                mergeObj.tradeIndex = commonModule.calculateFormula(hotObj.tradeIndex, 1, 0);
                // 支付件数
                mergeObj.payItmCnt = hotObj.payItmCnt;
                // 支付转化率
                mergeObj.payRateIndex = commonModule.calculateFormula(hotObj.payRateIndex, 0, 2);
                // 访客人数
                mergeObj.uvIndex = commonModule.calculateFormula(hotObj.uvIndex, 1, 0);
                // 支付人数
                mergeObj.payerCnt = Number((mergeObj.uvIndex * mergeObj.payRateIndex / 100).toFixed(0));
                mergeObj.uvValue = Number((mergeObj.tradeIndex / mergeObj.uvIndex).toFixed(2));
                for (var j = flowData.length - 1; j >= 0; j--) {
                    var flowObj = flowData[j];
                    if (hotObj.itemId == flowObj.itemId) {
                        mergeObj.seIpvUvHits = commonModule.calculateFormula(flowObj.seIpvUvHits, 1, 0);
                        flowData.splice(j, 1);
                        break;
                    }
                }
                moduleCache.tableData.mergeData.push(mergeObj);
            }
            // 此时如果flowData中还留有数据则直接添加到合并的集合中
            flowDataToMerge();
        } else {
            flowDataToMerge();
        }
    }

    function flowDataToMerge() {
        var flowData = moduleCache.tableData.uv.total;
        for (var index in flowData) {
            var mergeObj = {item: {}}, flowObj = flowData[index];
            mergeObj.item.itemId = flowObj.itemId;
            mergeObj.item.itemName = flowObj.title;
            mergeObj.item.shopName = flowObj.shopName;
            mergeObj.item.picUrl = flowObj.picUrl;
            mergeObj.item.detailUrl = flowObj.detailUrl;
            // mergeObj.itemName = flowObj.title;
            mergeObj.tradeIndex = commonModule.calculateFormula(flowObj.tradeIndex, 1, 0);
            // mergeObj.payItmCnt = hotObj.payItmCnt;
            // mergeObj.payRateIndex = commonModule.calculateFormula(hotObj.payRateIndex, 0, 2);
            mergeObj.uvIndex = commonModule.calculateFormula(flowObj.uvIndex, 1, 0);
            mergeObj.seIpvUvHits = commonModule.calculateFormula(flowObj.seIpvUvHits, 1, 0);
            mergeObj.uvValue = Number((mergeObj.tradeIndex / mergeObj.uvIndex).toFixed(2));
            moduleCache.tableData.mergeData.push(mergeObj);
        }
    }


    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            heightGap = ($(window).height() * 0.1 + 114).toFixed(0), cols = [[
            {field: "title", title: "商品名称", minWidth: 400, templet: function (row) {
                    return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' style='float: left' src='" + row.item.picUrl + "'/>" +
                        "<ul><li><a title='" + row.item.itemName + "' target='_blank' href='" + row.item.detailUrl + "'>" + row.item.itemName + "</a>\n</li><li class='wxr-font-light-color'>" + row.item.shopName + "\n</li></ul></div>";
                }},
            {field: "dateTime", title: "日期", minWidth: 240, sort: true, templet: function () {
                    return statisticsTimeText;
                }},
            {field: "tradeIndex", title: "交易金额", minWidth: 110, sort: true},
            {field: "payItmCnt", title: "支付件数", minWidth: 110, sort: true},
            {field: "payRateIndex", title: "支付转换率", minWidth: 110, sort: true, isPercentValue: true},
            {field: "uvIndex", title: "访客人数", minWidth: 110, sort: true},
            {field: "payerCnt", title: "支付人数", minWidth: 110, sort: true},
            {field: "seIpvUvHits", title: "搜索人数", minWidth: 110, sort: true},
            {field: "uvValue", title: "uv价值", minWidth: 110, sort: true}
        ]];

        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: moduleCache.tableData.mergeData,
            height: 'full-' + heightGap,
            cols: cols,
            done: function () {
                // if (moduleCache.tableData["category" + moduleCache.activeCategoryIndex].maxPageNo > 1) {
                // drawCachePageBar();
                // }
            }
        };
        var inst = commonModule.renderTable(renderTableOptions, layero);
        // window大小改变，重置table大小
        // window.addEventListener("resize", function () {
        //     var currentTableDom = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']"),
        //         // 弹出框高度 - 弹出框标题栏高度 - 表格下方信息栏高度 - 工具栏高度 - 标题列高度
        //         tableMainHeight = currentTableDom.parents(".layui-layer").height() - 84 - currentTableDom.find(".layui-table-tool").outerHeight()
        //             - currentTableDom.find(".layui-table-header").outerHeight();
        //     console.log(currentTableDom.parents(".layui-layer").height() + "--" + currentTableDom.find(".layui-table-tool").outerHeight() +
        //         "--" + currentTableDom.find(".layui-table-header").outerHeight() + "--" + tableMainHeight);
        //     currentTableDom.find(".layui-table-box .layui-table-main").css({height: tableMainHeight});
        // });
    }

    function drawCachePageBar(heightGap, cols) {
        $(".wxr-table-bottom-page-number-bar").append("<div id='selfPageBar'></div>");
        layui.laypage.render({
            elem: "selfPageBar",
            // prev: "&#8592",
            // next: "&#8594",
            layout: ['page'],
            curr: moduleCache.tableData[moduleCache.activeTab.code].currentPageNo,
            limit: 10,
            count: moduleCache.tableData[moduleCache.activeTab.code].maxPageNo * 10,
            // limits: [5, 10, 20, 50, 100],
            jump: function (obj, first) {
                // 页码添加未缓存标志
                $("#selfPageBar .layui-laypage a").each(function (index) {
                    var className = $(this).attr("class"), pageNo = $(this).text();
                    if (className && (className.indexOf("layui-laypage-prev") != -1 ||
                        className.indexOf("layui-laypage-next") != -1)) {
                        return true;
                    }
                    var pageData = moduleCache.tableData[moduleCache.activeTab.code].pages["page" + pageNo];
                    if (!pageData) {
                        // $(this).css({"opacity": "0.5", "filter":"alpha(opacity=50)", "background":"gray", "color":"#fff"});
                        $(this).css("position", "relative");
                        $(this).append("<i class='layui-badge-dot' style='position: absolute;top:4px;right: 2px'></i>");
                    }
                });
                if (!first) {
                    // 同步点击生意参谋页面的第几页按钮
                    $("#hotSaleRank" + moduleCache.activeTab.code.toLowerCase() + " .alife-dt-card-common-table-pagination-wrapper .ant-pagination-item")
                        .each(function (index) {
                            if ($(this).text() == obj.curr) {
                                $(this).trigger("click");
                                var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0}), count = 0;
                                function myTimer() {
                                    var timer = setTimeout(function () {
                                        assembleCacheData();
                                        if (!moduleCache.tableData[moduleCache.activeTab.code].pages["page" + obj.curr]) {
                                            count++;
                                            if (count > 40) {
                                                layui.layer.msg('数据获取超时', {
                                                    offset: 't',
                                                    anim: 6
                                                });
                                                layui.layer.close(loading);
                                                return;
                                            }
                                            myTimer();
                                        } else {
                                            renderTable();
                                            layui.layer.close(loading);
                                        }
                                    }, 500);
                                }
                                myTimer();
                            }
                        });
                }
            }
        });
    }

    return {
        init: function () {
            var targetDom = $("#productTrend").next().find(".oui-card-header-item.oui-card-header-item-pull-left"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "after", buttons, true, function (targetDom) {
                var btn = targetDom.parent().find(".wxr-tool-buttons-inject-container .layui-btn").eq(0);
                var tip;
                btn.on("mouseenter", function () {
                    tip = layui.layer.tips("分别点击\"热销商品\"和\"流量商品\"，可查看合并后的数据", btn, {
                        tips: [1, '#0FA6D8'], //还可配置颜色
                        area: ["auto", "auto"],
                        time: 0
                    });
                });
                btn.on("mouseleave", function () {
                    layui.layer.close(tip);
                });
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  属性洞察-热门属性
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var propertyInsightHotModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "属性洞察 | 热门属性",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        activeTab: {name: "", code: ""},
        tableData: {
            hotProperty: {// 热门属性
                pages: {},
                total: [],
                maxPageNo: 1
            },
            hotPropertyComposite: {// 热门属性组合
                pages: {},
                total: [],
                maxPageNo: 1
            }
        },
        propId: "",// 属性id
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "property-insight-hot-table", //table的dom控件的id属性
        tableLayId: "propertyInsightHotTable", //table在layui中定义的id，即lay-ui属性
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        // assembleCacheKey();
        assembleCacheData()
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogWidth;
        var dialogOptions = {
            title: dialogTitle,
            area: ['50%', '80%'],
            // offset: "100px",
            content: "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                setTimeout(function () {
                    // drawCategoryItem();
                    renderTable(layero);
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        // 萃取URL地址的参数
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 获取选中的tab[热销属性、热销属性组合]
        var activeTabName = $(".oui-card .oui-card-header-item.oui-card-header-item-pull-left .oui-tab-switch-item-active").text(),
            hotAttrType;
        if (activeTabName == "热销属性") {
            moduleCache.activeTab.name = activeTabName, moduleCache.activeTab.code = "hotProperty";
            hotAttrType = 0;
        } else if (activeTabName == "热销属性组合") {
            moduleCache.activeTab.name = activeTabName, moduleCache.activeTab.code = "hotPropertyComposite";
            hotAttrType = 1;
        }
        // 获取当前类目下所有的属性id
        var propertyByCategoryCacheKey = globalUrlPrefix + "/mc/mq/prop/props.json?cateId=" + moduleCache.urlParams.cateId,
            propertiesOfCategoryData = commonModule.getUsableOriginalJsonDataFromCache(propertyByCategoryCacheKey, true),
            currentSelectedPropertyName = $(".oui-card-content .ant-select-selection-selected-value").attr("title");
        if (currentSelectedPropertyName) {
            for (var i in propertiesOfCategoryData) {
                var propertyItem = propertiesOfCategoryData[i];
                if (propertyItem.name == currentSelectedPropertyName) {
                    moduleCache.propId = propertyItem.id;
                    break;
                }
            }
        }
        var propertyHotRankCacheKey = globalUrlPrefix + "/mc/mq/prop/hotRank.json?dateRange=" + moduleCache.urlParams.dateRange + "&dateType="
            + moduleCache.urlParams.dateType,
            cacheKeyPageAndSortParams = commonModule.getCachePageAndSortParams($("#propsRank"));
        propertyHotRankCacheKey += "&pageSize=" + cacheKeyPageAndSortParams.pageSize + "&page=" + cacheKeyPageAndSortParams.pageNo
            + "&order=" + cacheKeyPageAndSortParams.order + "&orderBy=" + cacheKeyPageAndSortParams.orderBy + "&cateId="
            + moduleCache.urlParams.cateId + "&device=" + moduleCache.urlParams.device + "&propId=" + moduleCache.propId
            + "&hotAttrType=" + hotAttrType + "&seller=" + moduleCache.urlParams.sellerType + "&indexCode=" + cacheKeyPageAndSortParams.indexCode;
        // var propertyHotRankCacheData = commonModule.getUsableOriginalJsonDataFromCache(propertyHotRankCacheKey, true);
        // if (propertyHotRankCacheData) {
        // 获取所有分页数据
        moduleCache.tableData[moduleCache.activeTab.code].maxPageNo = cacheKeyPageAndSortParams.maxPageNo;
        moduleCache.tableData[moduleCache.activeTab.code].currentPageNo = cacheKeyPageAndSortParams.pageNo;
        var count = 0;
        for (var i = 1; i <= cacheKeyPageAndSortParams.maxPageNo; i++) {
            var key = propertyHotRankCacheKey.replace(/&page=\S+&order=/, "&page=" + i + "&order="),
                decodeJsonData = commonModule.getUsableOriginalJsonDataFromCache(key, true);
            if (decodeJsonData) {
                count++;
                if (count == 1) {// 初次拿到数据
                    moduleCache.tableData[moduleCache.activeTab.code].pages = {},
                        moduleCache.tableData[moduleCache.activeTab.code].total = [];
                }
                moduleCache.tableData[moduleCache.activeTab.code].pages["page" + i] = decodeJsonData.data,
                    moduleCache.tableData[moduleCache.activeTab.code].total.push.apply(moduleCache.tableData[moduleCache.activeTab.code].total, decodeJsonData.data);
            }
        }
        transformData(moduleCache.tableData[moduleCache.activeTab.code].total);
    }

    function transformData(dataArray) {
        for (var i in dataArray) {
            var dataItem = dataArray[i];
            // 点击人数
            dataItem.tradeIndexValue = commonModule.calculateFormula(dataItem.tradeIndex, 1, 0);
            // 件单价
            dataItem.itemPrice = Number((dataItem.tradeIndexValue / dataItem.payItmCnt).toFixed(2));
        }
    }


    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var heightGap = ($(window).height() * 0.2 + 114).toFixed(0),
            cols = [[
                {field: "propertyValue", title: "属性值", minWidth: 410, templet: function (row) {
                        var text = "";
                        for (var i in row.properties) {
                            var property = row.properties[i];
                            text += " + " + property.value.name;
                        }
                        return text.slice(3);
                    }},
                {field: "tradeIndexValue", title: "交易金额", minWidth: 110, sort: true},
                {field: "payItmCnt", title: "支付件数", minWidth: 110, sort: true},
                {field: "itemPrice", title: "件单价", minWidth: 100, sort: true}
            ]];
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: moduleCache.tableData[moduleCache.activeTab.code].total,
            height: 'full-' + heightGap,
            cols: cols,
            done: function () {
                // if (moduleCache.tableData["category" + moduleCache.activeCategoryIndex].maxPageNo > 1) {
                drawCachePageBar();
                // }
            }
        };
        var inst = commonModule.renderTable(renderTableOptions, layero);
        // window大小改变，重置table大小
        // window.addEventListener("resize", function () {
        //     var currentTableDom = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']"),
        //         // 弹出框高度 - 弹出框标题栏高度 - 表格下方信息栏高度 - 工具栏高度 - 标题列高度
        //         tableMainHeight = currentTableDom.parents(".layui-layer").height() - 84 - currentTableDom.find(".layui-table-tool").outerHeight()
        //             - currentTableDom.find(".layui-table-header").outerHeight();
        //     console.log(currentTableDom.parents(".layui-layer").height() + "--" + currentTableDom.find(".layui-table-tool").outerHeight() +
        //         "--" + currentTableDom.find(".layui-table-header").outerHeight() + "--" + tableMainHeight);
        //     currentTableDom.find(".layui-table-box .layui-table-main").css({height: tableMainHeight});
        // });
    }

    function drawCachePageBar(heightGap, cols) {
        $(".wxr-table-bottom-page-number-bar").append("<div id='selfPageBar'></div>");
        layui.laypage.render({
            elem: "selfPageBar",
            // prev: "&#8592",
            // next: "&#8594",
            layout: ['page'],
            curr: moduleCache.tableData[moduleCache.activeTab.code].currentPageNo,
            limit: 10,
            count: moduleCache.tableData[moduleCache.activeTab.code].maxPageNo * 10,
            // limits: [5, 10, 20, 50, 100],
            jump: function (obj, first) {
                // 页码添加未缓存标志
                $("#selfPageBar .layui-laypage a").each(function (index) {
                    var className = $(this).attr("class"), pageNo = $(this).text();
                    if (className && (className.indexOf("layui-laypage-prev") != -1 ||
                        className.indexOf("layui-laypage-next") != -1)) {
                        return true;
                    }
                    var pageData = moduleCache.tableData[moduleCache.activeTab.code].pages["page" + pageNo];
                    if (!pageData) {
                        // $(this).css({"opacity": "0.5", "filter":"alpha(opacity=50)", "background":"gray", "color":"#fff"});
                        $(this).css("position", "relative");
                        $(this).append("<i class='layui-badge-dot' style='position: absolute;top:4px;right: 2px'></i>");
                    }
                });
                if (!first) {
                    // 同步点击生意参谋页面的第几页按钮
                    $(".contentContainer .alife-dt-card-common-table-pagination-wrapper .ant-pagination-item")
                        .each(function (index) {
                            if ($(this).text() == obj.curr) {
                                $(this).trigger("click");
                                var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0}), count = 0;
                                function myTimer() {
                                    var timer = setTimeout(function () {
                                        assembleCacheData();
                                        if (!moduleCache.tableData[moduleCache.activeTab.code].pages["page" + obj.curr]) {
                                            count++;
                                            if (count > 40) {
                                                layui.layer.msg('数据获取超时', {
                                                    offset: 't',
                                                    anim: 6
                                                });
                                                layui.layer.close(loading);
                                                return;
                                            }
                                            myTimer();
                                        } else {
                                            renderTable();
                                            layui.layer.close(loading);
                                        }
                                    }, 500);
                                }
                                myTimer();
                            }
                        });
                }
            }
        });
    }

    return {
        init: function () {
            if (!moduleCache.propId) {
                // 萃取URL地址的参数
                moduleCache.urlParams = commonModule.extractLocationParams(window.location);
                // 获取当前类目下所有的属性id
                var propertyByCategoryCacheKey = globalUrlPrefix + "/mc/mq/prop/props.json?cateId=" + moduleCache.urlParams.cateId,
                    propertiesOfCategoryData = commonModule.getUsableOriginalJsonDataFromCache(propertyByCategoryCacheKey, true),
                    currentSelectedPropertyName = $(".oui-card-content .ant-select-selection-selected-value").attr("title");
                if (currentSelectedPropertyName) {
                    for (var i in propertiesOfCategoryData) {
                        var propertyItem = propertiesOfCategoryData[i];
                        if (propertyItem.name == currentSelectedPropertyName) {
                            moduleCache.propId = propertyItem.id;
                            break;
                        }
                    }
                }
            }
            var targetDom = $(".oui-card .oui-card-header-item.oui-card-header-item-pull-left").eq(0),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "after", buttons, true, function (targetDom) {
                // $(".wxr-tool-buttons-inject-container").css("float", "none");
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  属性洞察-属性分析
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var propertyInsightAnalyzeHotSellModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "属性洞察 | 属性分析 | 热销榜单",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        activeTab: {name: "", code: ""},
        tableData: {
            Shop: {// 热门属性
                pages: {},
                total: [],
                maxPageNo: 1
            },
            Item: {// 热门属性组合
                pages: {},
                total: [],
                maxPageNo: 1
            }
        },
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "property-insight-hot-sell-table", //table的dom控件的id属性
        tableLayId: "propertyInsightHotSellTable", //table在layui中定义的id，即lay-ui属性
        propertyIds: "",
        propertyValueIds: ""
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogWidth;
        var dialogOptions = {
            title: dialogTitle,
            area: ['70%', '80%'],
            // offset: "100px",
            content: "<div class='wxr-cards-container'></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                setTimeout(function () {
                    renderTable(layero);
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        // 萃取URL地址的参数
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 获取选中的tab[店铺、商品]
        var activeTabName = $("#propertyTrend").next().find(".oui-card-header-item.oui-card-header-item-pull-left .oui-tab-switch-item-active").text();
        if (activeTabName == "店铺") {
            moduleCache.activeTab.name = activeTabName, moduleCache.activeTab.code = "Shop";
        } else if (activeTabName == "商品") {
            moduleCache.activeTab.name = activeTabName, moduleCache.activeTab.code = "Item";
        }
        // // 获取所有的属性值
        // var propertyWithValuesCacheKey = globalUrlPrefix + "/mc/mq/prop/propWithValue.json?cateId=" + moduleCache.urlParams.cateId,
        //     propertyWithValuesCacheData = commonModule.getUsableOriginalJsonDataFromCache(propertyWithValuesCacheKey, true),
        //     newPropertyWithValuesData = {};
        // // 将缓存转换格式，方便后面按照名称来查找id
        // for (var i in propertyWithValuesCacheData) {
        //     var propertyItem = propertyWithValuesCacheData[i];
        //     newPropertyWithValuesData[propertyItem.name] = propertyItem;
        //     for (var j in propertyItem.values) {
        //         var propertyValueItem = propertyItem.values[j];
        //         propertyItem[propertyValueItem.name] = propertyValueItem.id;
        //     }
        // }
        // // 页面中已选中的属性
        // var selectedProperties = [], propertyIds = "", propertyValueIds = "";
        // $(".sycm-property-container .sycm-property-row").each(function (index, item) {
        //     var propertyName = $(this).find(".left-container").text(), propertyValue = $(this).find(".right-container .item-box.active").text();
        //     if (propertyValue) {
        //         selectedProperties.push({propertyName: propertyName, propertyValue: propertyValue});
        //     }
        // });
        // // 从新转换的数据结构中查找属性id和属性值id
        // for (var i in selectedProperties) {
        //     var selectedPropertyItem = selectedProperties[i];
        //     propertyIds += "|" + newPropertyWithValuesData[selectedPropertyItem.propertyName].id;
        //     propertyValueIds += "|" + newPropertyWithValuesData[selectedPropertyItem.propertyName][selectedPropertyItem.propertyValue];
        // }
        // propertyIds = propertyIds.slice(1), propertyValueIds = propertyValueIds.slice(1);
        // if (propertyIds && propertyValueIds) {
        //     moduleCache.propertyIds = propertyIds, moduleCache.propertyValueIds = propertyValueIds;
        // }

        moduleCache.propertyIds = moduleCache.urlParams.propertyIds ? moduleCache.urlParams.propertyIds.replace(/,/g, "|") : "",
            moduleCache.propertyValueIds = moduleCache.urlParams.propertyValueIds ? moduleCache.urlParams.propertyValueIds.replace(/,/g, "|") : "";
        // 拼接数据缓存key
        var propertyHotSellRankCacheKey = globalUrlPrefix + "/mc/mq/prop/listProp" + moduleCache.activeTab.code +
            ".json?dateRange=" + moduleCache.urlParams.dateRange + "&dateType=" + moduleCache.urlParams.dateType,
            cacheKeyPageAndSortParams = commonModule.getCachePageAndSortParams($("#hotSaleRank" + moduleCache.activeTab.code.toLowerCase()));
        propertyHotSellRankCacheKey += "&pageSize=" + cacheKeyPageAndSortParams.pageSize + "&page=" + cacheKeyPageAndSortParams.pageNo
            + "&order=" + cacheKeyPageAndSortParams.order + "&orderBy=" + cacheKeyPageAndSortParams.orderBy
            + "&cateId=" + moduleCache.urlParams.cateId + "&deviceType=" + moduleCache.urlParams.device
            + "&sellerType=" + moduleCache.urlParams.sellerType + "&propIdStr=" + moduleCache.propertyIds + "&propValueIdStr=" + moduleCache.propertyValueIds
            + "&indexCode=" + cacheKeyPageAndSortParams.indexCode;
        // 获取所有分页数据
        moduleCache.tableData[moduleCache.activeTab.code].maxPageNo = cacheKeyPageAndSortParams.maxPageNo;
        moduleCache.tableData[moduleCache.activeTab.code].currentPageNo = cacheKeyPageAndSortParams.pageNo;
        var count = 0;
        for (var i = 1; i <= cacheKeyPageAndSortParams.maxPageNo; i++) {
            var key = propertyHotSellRankCacheKey.replace(/&page=\S+&order=/, "&page=" + i + "&order="),
                decodeJsonData = commonModule.getUsableOriginalJsonDataFromCache(key, true);
            if (decodeJsonData) {
                count++;
                if (count == 1) {// 初次拿到数据
                    moduleCache.tableData[moduleCache.activeTab.code].pages = {},
                        moduleCache.tableData[moduleCache.activeTab.code].total = [];
                }
                moduleCache.tableData[moduleCache.activeTab.code].pages["page" + i] = decodeJsonData.data,
                    moduleCache.tableData[moduleCache.activeTab.code].total.push.apply(moduleCache.tableData[moduleCache.activeTab.code].total, decodeJsonData.data);
            }
        }
        transformData(moduleCache.tableData[moduleCache.activeTab.code].total);
    }

    function transformData(dataArray) {
        for (var i in dataArray) {
            var dataItem = dataArray[i];
            // 交易金额
            dataItem.tradeIndexValue = commonModule.calculateFormula(dataItem.tradeIndex, 1, 0);
            // 支付转化率
            dataItem.payRateIndexValue = commonModule.calculateFormula(dataItem.payRateIndex, 0, 2);
            // 件单价
            dataItem.itemPrice = Number((dataItem.tradeIndexValue / dataItem.payItmCnt).toFixed(2));
        }
    }


    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var heightGap = ($(window).height() * 0.2 + 114).toFixed(0), cols = [[]];
        if (moduleCache.activeTab.code == "Shop") {
            cols[0].push({field: "title", title: "店铺名称", minWidth: 400, templet: function (row) {
                    return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='" + row.pictureUrl + "'/><span>" +
                        "<a href='" + row.shopUrl + "' target='_blank' title='" + row.title + "'>" + row.title + "</a></span></div>";
                }});
        } else {
            cols[0].push({field: "title", title: "商品名称", minWidth: 400, templet: function (row) {
                    return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' style='float: left' src='" + row.picUrl + "'/>" +
                        "<ul><li><a title='" + row.title + "' target='_blank' href='" + row.detailUrl + "'>" + row.title + "</a>\n</li><li class='wxr-font-light-color'>" + row.shopName + "\n</li></ul></div>";
                }});
        }
            cols[0].push.apply(cols[0], [
                {field: "tradeIndexValue", title: "交易金额", minWidth: "110", sort: true},
                {field: "payRateIndexValue", title: "支付转化率", minWidth: "110", sort: true, isPercentValue: true},
                {field: "payItmCnt", title: "支付件数", minWidth: "110", sort: true},
                {field: "itemPrice", title: "件单价", minWidth: "100", sort: true}
            ]);
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: moduleCache.tableData[moduleCache.activeTab.code].total,
            height: 'full-' + heightGap,
            cols: cols,
            done: function () {
                // if (moduleCache.tableData["category" + moduleCache.activeCategoryIndex].maxPageNo > 1) {
                drawCachePageBar();
                // }
            }
        };
        var inst = commonModule.renderTable(renderTableOptions, layero);
        // window大小改变，重置table大小
        // window.addEventListener("resize", function () {
        //     var currentTableDom = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']"),
        //         // 弹出框高度 - 弹出框标题栏高度 - 表格下方信息栏高度 - 工具栏高度 - 标题列高度
        //         tableMainHeight = currentTableDom.parents(".layui-layer").height() - 84 - currentTableDom.find(".layui-table-tool").outerHeight()
        //             - currentTableDom.find(".layui-table-header").outerHeight();
        //     console.log(currentTableDom.parents(".layui-layer").height() + "--" + currentTableDom.find(".layui-table-tool").outerHeight() +
        //         "--" + currentTableDom.find(".layui-table-header").outerHeight() + "--" + tableMainHeight);
        //     currentTableDom.find(".layui-table-box .layui-table-main").css({height: tableMainHeight});
        // });
    }

    function drawCachePageBar(heightGap, cols) {
        $(".wxr-table-bottom-page-number-bar").append("<div id='selfPageBar'></div>");
        layui.laypage.render({
            elem: "selfPageBar",
            // prev: "&#8592",
            // next: "&#8594",
            layout: ['page'],
            curr: moduleCache.tableData[moduleCache.activeTab.code].currentPageNo,
            limit: 10,
            count: moduleCache.tableData[moduleCache.activeTab.code].maxPageNo * 10,
            // limits: [5, 10, 20, 50, 100],
            jump: function (obj, first) {
                // 页码添加未缓存标志
                $("#selfPageBar .layui-laypage a").each(function (index) {
                    var className = $(this).attr("class"), pageNo = $(this).text();
                    if (className && (className.indexOf("layui-laypage-prev") != -1 ||
                        className.indexOf("layui-laypage-next") != -1)) {
                        return true;
                    }
                    var pageData = moduleCache.tableData[moduleCache.activeTab.code].pages["page" + pageNo];
                    if (!pageData) {
                        // $(this).css({"opacity": "0.5", "filter":"alpha(opacity=50)", "background":"gray", "color":"#fff"});
                        $(this).css("position", "relative");
                        $(this).append("<i class='layui-badge-dot' style='position: absolute;top:4px;right: 2px'></i>");
                    }
                });
                if (!first) {
                    // 同步点击生意参谋页面的第几页按钮
                    $("#hotSaleRank" + moduleCache.activeTab.code.toLowerCase() + " .alife-dt-card-common-table-pagination-wrapper .ant-pagination-item")
                        .each(function (index) {
                            if ($(this).text() == obj.curr) {
                                $(this).trigger("click");
                                var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0}), count = 0;
                                function myTimer() {
                                    var timer = setTimeout(function () {
                                        assembleCacheData();
                                        if (!moduleCache.tableData[moduleCache.activeTab.code].pages["page" + obj.curr]) {
                                            count++;
                                            if (count > 40) {
                                                layui.layer.msg('数据获取超时', {
                                                    offset: 't',
                                                    anim: 6
                                                });
                                                layui.layer.close(loading);
                                                return;
                                            }
                                            myTimer();
                                        } else {
                                            renderTable();
                                            layui.layer.close(loading);
                                        }
                                    }, 500);
                                }
                                myTimer();
                            }
                        });
                }
            }
        });
    }

    return {
        init: function () {
            var targetDom = $("#propertyTrend").next().find(".oui-card-header-item.oui-card-header-item-pull-left"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "after", buttons, true, function (targetDom) {
                // $(".wxr-tool-buttons-inject-container").css("float", "none");
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  属性洞察-属性分析
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var propertyInsightAnalyzeTrendModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "属性洞察 | 属性分析 | 热销榜单",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        activeTab: {name: "", code: ""},
        data: {
            overview: {// 一览数据

            },
            trend: {// 趋势数据

            },
            merge: [],// 合并模式数据
            compare: []// 比对模式数据
        },
        activeIndexCards: {},
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "property-insight-trend-table", //table的dom控件的id属性
        tableLayId: "propertyInsightTrendTable", //table在layui中定义的id，即lay-ui属性
        propertyIds: "",
        propertyValueIds: "",
        propertyNames: ""
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogWidth;
        var dialogOptions = {
            title: dialogTitle,
            area: ['90%', '96%'],
            // offset: "100px",
            content: "<div class='wxr-cards-container'></div>" +
                "<div class='wxr-charts-container' id='property-insight-trend-chart'></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                setTimeout(function () {
                    drawIndexCards();
                    renderChart();
                    renderTable(layero);
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        // 萃取URL地址的参数
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 获取所有的属性值
        // var propertyWithValuesCacheKey = globalUrlPrefix + "/mc/mq/prop/propWithValue.json?cateId=" + moduleCache.urlParams.cateId,
        //     propertyWithValuesCacheData = commonModule.getUsableOriginalJsonDataFromCache(propertyWithValuesCacheKey, true),
        //     newPropertyWithValuesData = {};
        // // 将缓存转换格式，方便后面按照名称来查找id
        // for (var i in propertyWithValuesCacheData) {
        //     var propertyItem = propertyWithValuesCacheData[i];
        //     newPropertyWithValuesData[propertyItem.name] = propertyItem;
        //     for (var j in propertyItem.values) {
        //         var propertyValueItem = propertyItem.values[j];
        //         propertyItem[propertyValueItem.name] = propertyValueItem.id;
        //     }
        // }
        // // 页面中已选中的属性
        // var selectedProperties = [], propertyIds = "", propertyValueIds = "", propertyNames = "";
        // $(".sycm-property-container .sycm-property-row").each(function (index, item) {
        //     var propertyName = $(this).find(".left-container").text(), propertyValue = $(this).find(".right-container .item-box.active").text();
        //     if (propertyValue) {
        //         selectedProperties.push({propertyName: propertyName, propertyValue: propertyValue});
        //         propertyNames += " | " + propertyValue;
        //     }
        // });
        // propertyNames = propertyNames.slice(3);
        // // 从新转换的数据结构中查找属性id和属性值id
        // if (selectedProperties.length > 0) {
        //     for (var i in selectedProperties) {
        //         var selectedPropertyItem = selectedProperties[i];
        //         propertyIds += "|" + newPropertyWithValuesData[selectedPropertyItem.propertyName].id;
        //         propertyValueIds += "|" + newPropertyWithValuesData[selectedPropertyItem.propertyName][selectedPropertyItem.propertyValue];
        //     }
        //     propertyIds = propertyIds.slice(1), propertyValueIds = propertyValueIds.slice(1);
        //     if (propertyIds && propertyValueIds) {
        //         moduleCache.propertyIds = propertyIds, moduleCache.propertyValueIds = propertyValueIds, moduleCache.propertyNames = propertyNames;
        //     }
        // } else {
        //     if (moduleCache.urlParams.propertyIds && moduleCache.urlParams.propertyValueIds) {
        //         moduleCache.propertyIds = moduleCache.urlParams.propertyIds, moduleCache.propertyValueIds = moduleCache.urlParams.propertyValueIds;
        //     }
        // }
        moduleCache.propertyIds = moduleCache.urlParams.propertyIds ? moduleCache.urlParams.propertyIds.replace(/,/g, "|") : "",
            moduleCache.propertyValueIds = moduleCache.urlParams.propertyValueIds ? moduleCache.urlParams.propertyValueIds.replace(/,/g, "|") : "";
        var propertyNames = "";
        $(".sycm-property-filter-header .seleted-item-box").each(function (index, item) {
            propertyNames += " | " + $(this).find("button span").text();
        });
        propertyNames = propertyNames.slice(3);
        moduleCache.propertyNames = propertyNames;
        // 拼接overview数据缓存key
        var propertyOverviewCacheKey = globalUrlPrefix + "/mc/mq/prop/overview.json?dateType=" + moduleCache.urlParams.dateType
            + "&dateRange=" + moduleCache.urlParams.dateRange + "&device=" + moduleCache.urlParams.device + "&cateId=" + moduleCache.urlParams.cateId
            + "&seller=" + moduleCache.urlParams.sellerType + "&propertyIds=" + moduleCache.propertyIds + "&propertyValueIds=" + moduleCache.propertyValueIds,
            propertyOverviewData = commonModule.getUsableOriginalJsonDataFromCache(propertyOverviewCacheKey, true);
        if (propertyOverviewData) {
            moduleCache.data.overview = propertyOverviewData;
            // propertyOverviewData.tradeIndex.value = commonModule.calculateFormula(propertyOverviewData.tradeIndex.value, 1, 0);
        }
        // 拼接trend数据缓存key
        var propertyTrendCacheKey = globalUrlPrefix + "/mc/mq/prop/trend.json?dateType=" + moduleCache.urlParams.dateType + "&dateRange=" + moduleCache.urlParams.dateRange
            + "&indexCode=&device=" + moduleCache.urlParams.device + "&cateId=" + moduleCache.urlParams.cateId
            + "&seller=" + moduleCache.urlParams.sellerType + "&propertyIds=" + moduleCache.propertyIds + "&propertyValueIds=" + moduleCache.propertyValueIds,
            propertyTrendData = commonModule.getUsableOriginalJsonDataFromCache(propertyTrendCacheKey, true);
        if (propertyTrendData) {
            moduleCache.data.trend = propertyTrendData;
            transformData();
        }
    }

    function transformData() {
        // 根据指标数组的长度计算出时间维度数组
        var dataLength, endTimeStr = moduleCache.urlParams.dateRange.split("|")[1];
        for (var indexCode in moduleCache.data.trend) {
            var indexItem = moduleCache.data.trend[indexCode];
            dataLength = indexItem.length;
            if (dataLength) {
                break;
            }
        }
        // 生成时间周期
        moduleCache.dateTimes = commonModule.generateStatisticTimes(dataLength, endTimeStr, moduleCache.urlParams.dateType);
        // 合并各指标数据
        var mergeData = [];
        for (var i  in moduleCache.dateTimes) {
            var mergeItem = {dateTime: moduleCache.dateTimes[i], propertyNames: moduleCache.propertyNames};
            for (var indexCode in moduleCache.data.trend) {
                var indexItemTrendArray = moduleCache.data.trend[indexCode];
                if (indexCode == "tradeIndex") {
                    indexItemTrendArray[i] = commonModule.calculateFormula(indexItemTrendArray[i], 1, 0);
                }
                mergeItem[indexCode] = indexItemTrendArray[i];
            }
            // 件单价
            mergeItem.itemPrice = Number((mergeItem.tradeIndex / mergeItem.payItmCnt).toFixed(2));
            // 客单价
            mergeItem.buyerPerPrice = Number((mergeItem.tradeIndex / mergeItem.payByrCnt).toFixed(2));
            // 人均支付件数
            mergeItem.avgPayItmCnt = Number((mergeItem.payItmCnt / mergeItem.payByrCnt).toFixed(2));
            mergeData.push(mergeItem);
        }
        moduleCache.data.merge = mergeData;
    }

    /**
     * @Author xuyefei
     * @Description  存储各指标块信息,主要是为了按照相同顺序显示
     * @Date 14:26 2020/7/31
     * @Param
     * @return
     **/
    function assembleIndexCards() {
        var indexCardsDom = $("#propertyTrend .alife-one-design-sycm-indexes-trend-index-content-container .oui-index-cell"),
            sortedIndexCards = [];
        indexCardsDom.each(function (index) {
            var indexCard = {}, indexCode = $(this).attr("value"),
                indexOldName = $(this).find(".oui-index-cell-indexName").text(),
                indexValue = $(this).find(".oui-index-cell-indexValue").text(),
                indexCycleCrc = $(this).find(".oui-index-cell-indexChange .oui-pull-right span").eq(0).text(),
                indexNewName, compareText = $(this).find(".oui-index-cell-indexChange .oui-index-cell-subIndex-text").text(), isPercentValue = false;
            if (indexCode == "payByrCnt") {
                indexNewName = "支付人数";
            } else if (indexCode == "payItmCnt") {
                indexNewName = "支付件数";
            } else if (indexCode == "payOrdCnt") {
                indexNewName = "支付子订单数";
            } else if (indexCode == "tradeIndex") {
                indexNewName = "交易金额";
                indexValue = commonModule.calculateFormula(indexValue.replace(/,/g, ""), 1, 0);
            }
            indexCard.isActive = false;
            if ($(this).parent().hasClass("active")) {
                indexCard.isActive = true;
            }
            indexCard.indexName = indexNewName;
            indexCard.indexValue = indexValue;
            indexCard.indexCode = indexCode;
            indexCard.indexCycleCrc = indexCycleCrc;
            indexCard.cycleCrcIconClassName = $(this).find(".oui-index-cell-ratioTrendIcon i").attr("class");
            indexCard.compareText = compareText;
            indexCard.isPercentValue = isPercentValue;
            sortedIndexCards.push(indexCard);
        });
        return sortedIndexCards;
    }

    function drawIndexCards() {
        // 已选中的指标块初始化
        moduleCache.activeIndexCards = {};
        var sortedIndexCards = assembleIndexCards();
        // 计算每个小块宽度的百分比
        var cardItemWrapperPercent = (100 / sortedIndexCards.length).toFixed(4);
        // 舍去最后一位，防止宽度超出
        cardItemWrapperPercent = cardItemWrapperPercent.substring(0, cardItemWrapperPercent.length - 2);
        $(".wxr-cards-container").css({width: "60%"});
        // for (var i in moduleCache.firstLevelCategoryArray) {
        $.each(sortedIndexCards, function (index, indexItem) {
            var cardItemWrapper = $("<div class='wxr-card-item-wrapper' style='width: " +
                cardItemWrapperPercent + "%'></div>"),
                cardItemBody = $("<div class='wxr-card-item-body wxr-card-item-body-solid'><i class='layui-icon layui-icon-ok-circle wxr-card-item-body-icon'></i></div>");
            cardItemWrapper.append(cardItemBody);
            if (indexItem.isActive) {
                cardItemBody.addClass("wxr-card-item-body-active");
                cardItemBody.find(".wxr-card-item-body-icon").addClass("wxr-card-item-body-icon-checked");
                moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
            }
            // 填充内容
            var bodyContent = $("<ul><li class='wxr-card-item-body-title wxr-text-ellipsis' style='font-size: 12px' title='" + indexItem.indexName + "'>" + indexItem.indexName + "</li>" +
                "<li class='wxr-card-item-body-data' style='font-size: 18px;line-height: 20px;color: #0C0C0C'><div class='wxr-text-ellipsis'>" + indexItem.indexValue + "</div></li>" +
                "<li class='wxr-card-item-body-data' style='font-size: 12px'><div class='wxr-text-ellipsis'>" + indexItem.compareText + "</div><div class='wxr-text-ellipsis'>" + indexItem.indexCycleCrc + "<i class='" + indexItem.cycleCrcIconClassName + "'></i></div></li>" +
                "</ul>");
            bodyContent.find(".wxr-card-item-body-data").each(function (index, item) {
                if ($(this).find("div").length == 2) {
                    $(this).find("div:first-child").css({width: "50%"});
                    $(this).find("div:nth-child(2)").css({width: "50%", textAlign: "right"});
                }
            });
            cardItemBody.append(bodyContent);
            $(".wxr-cards-container").append(cardItemWrapper);
            // 点击事件绑定
            cardItemBody.on("click", function () {
                // $(".wxr-cards-container .wxr-card-item-body").removeClass("wxr-card-item-body-active");
                if ($(this).hasClass("wxr-card-item-body-active")) {
                    if ($(".wxr-cards-container .wxr-card-item-body-active").length > 1) {
                        $(this).removeClass("wxr-card-item-body-active");
                        cardItemBody.find(".layui-icon-ok-circle").removeClass("wxr-card-item-body-icon-checked");
                        delete moduleCache.activeIndexCards[indexItem.indexCode];
                    }
                } else {
                    $(this).addClass("wxr-card-item-body-active");
                    cardItemBody.find(".layui-icon-ok-circle").addClass("wxr-card-item-body-icon-checked");
                    moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                }
                renderChart();
            });
        });
    }

    function renderChart() {
        var thisChart = echarts.init($("#property-insight-trend-chart")[0]),
            xAxisData = moduleCache.dateTimes, seriesDataArray = [], count = 0, interval = 1;
        for (var indexCode in moduleCache.activeIndexCards) {
            var activeCardItem = moduleCache.activeIndexCards[indexCode], seriesObj = {
                name: activeCardItem.indexName,
                type: 'line',
                data: moduleCache.data.trend[indexCode],
                smooth: true,
                symbol: "circle",
                showSymbol: false,
                symbolSize: 6,
                yAxisIndex: count
            };
            seriesDataArray.push(seriesObj);
            count++;
        }
        if (moduleCache.urlParams.dateType == "day" || moduleCache.urlParams.dateType == "recent7" || moduleCache.urlParams.dateType == "recent30") {
            interval = 3;
        }
        var chartOptions = {
            xAxis: {
                type: 'category',
                axisLabel: {
                    interval: interval
                },
                axisLine: {},
                data: xAxisData,
            },
            series: seriesDataArray
        };
        commonModule.renderLineCharts(chartOptions, thisChart, count);
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var heightGap = ($(window).height() * 0.04 + 114 + 260 + 86).toFixed(0), cols = [[]];
        cols[0] = [
            {field: "propertyNames", title: "属性名称", minWidth: 300, sort: true},
            {field: "dateTime", title: "日期", minWidth: 110, sort: true},
            {field: "tradeIndex", title: "交易金额", minWidth: 110, sort: true},
            {field: "payOrdCnt", title: "支付子订单数", minWidth: 130, sort: true},
            {field: "payItmCnt", title: "支付件数", minWidth: 110, sort: true},
            {field: "itemPrice", title: "件单价", minWidth: 90, sort: true},
            {field: "payByrCnt", title: "支付人数", minWidth: 110, sort: true},
            {field: "buyerPerPrice", title: "客单价", minWidth: 90, sort: true},
            {field: "avgPayItmCnt", title: "人均支付件数", minWidth: 130, sort: true}
            ]
        ;
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: moduleCache.data.merge,
            height: 'full-' + heightGap,
            cols: cols,
            done: function () {

            }
        };
        var inst = commonModule.renderTable(renderTableOptions, layero);
    }

    return {
        init: function () {
            var targetDom = $("#propertyTrend .oui-card-header-item.oui-card-header-item-pull-right"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "append", buttons, true, function (targetDom) {
                // $(".wxr-tool-buttons-inject-container").css("float", "none");
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  行业客群-客群趋势
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var industryCustomerTrendModule = (function () {
        var moduleCache = {
            dialogTitlePrefix: "行业客群 | 客群趋势",// 模块名称前缀
            urlParams: {}, // URL地址中解析出来的参数
            data: {
                overview: {// 一览数据

                },
                trend: {// 趋势数据

                },
                merge: [],// 合并模式数据
                compare: []// 比对模式数据
            },
            activeIndexCards: {},
            localCacheKey: "", // 组装好的localStorage的缓存key
            tableElementId: "industry-customer-trend-table", //table的dom控件的id属性
            tableLayId: "industryCustomerTrendTable", //table在layui中定义的id，即lay-ui属性
            chartElementId: "industry-customer-trend-chart"
        };

        // 一键转化
        function oneClickTransform() {
            // 组装缓存key
            assembleCacheData();
            // 组装表格缓存数据
            // 打开弹出框
            openDialog();
        }

        function openDialog() {
            var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
                dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                    + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
            var dialogWidth;
            var dialogOptions = {
                title: dialogTitle,
                area: ['70%', '96%'],
                // offset: "100px",
                content: "<div class='wxr-cards-container'></div>" +
                    "<div class='wxr-charts-container' id='" + moduleCache.chartElementId + "'></div>" +
                    "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
                success: function (layero, index) {
                    setTimeout(function () {
                        drawIndexCards();
                        renderChart();
                        renderTable(layero);
                    }, 50);
                }
            };
            commonModule.openDialog(dialogOptions);
        }

        // 按照需要的结构封装数据
        function assembleCacheData() {
            // 萃取URL地址的参数
            moduleCache.urlParams = commonModule.extractLocationParams(window.location);
            // 拼接trend数据缓存key
            var customerTrendCacheKey = globalUrlPrefix + "/mc/mq/industryCustomer/customerTrend.json?cateId=" + moduleCache.urlParams.cateId
                + "&device=" + moduleCache.urlParams.device + "&sellerType=" + moduleCache.urlParams.sellerType,
                customerTrendCacheData = commonModule.getUsableOriginalJsonDataFromCache(customerTrendCacheKey, true);
            if (customerTrendCacheData) {
                moduleCache.data.trend = customerTrendCacheData;
                transformData();
            }
        }

        function transformData() {
            // 根据指标数组的长度计算出时间维度数组
            var dataLength, endTimeStr = moduleCache.urlParams.dateRange.split("|")[1];
            for (var indexCode in moduleCache.data.trend) {
                var indexItem = moduleCache.data.trend[indexCode];
                dataLength = indexItem.length;
                if (dataLength) {
                    break;
                }
            }
            // 生成时间周期
            moduleCache.dateTimes = commonModule.generateStatisticTimes(dataLength, endTimeStr, moduleCache.urlParams.dateType);
            // 合并各指标数据
            var mergeData = [];
            for (var i  in moduleCache.dateTimes) {
                var mergeItem = {dateTime: moduleCache.dateTimes[i]};
                for (var indexCode in moduleCache.data.trend) {
                    var indexItemTrendArray = moduleCache.data.trend[indexCode];
                    if (indexCode == "tradeIndex" || indexCode == "payByrCntIndex") {
                        indexItemTrendArray[i] = commonModule.calculateFormula(indexItemTrendArray[i], 1, 0);
                    } else if (indexCode == "payRateIndex") {
                        indexItemTrendArray[i] = commonModule.calculateFormula(indexItemTrendArray[i], 0, 2);
                    }
                    mergeItem[indexCode] = indexItemTrendArray[i];
                }
                // 点击人数
                mergeItem.clickCnt = Number((mergeItem.payByrCntIndex / mergeItem.payRateIndex).toFixed(0));
                // 客单价
                mergeItem.buyerPerPrice = Number((mergeItem.tradeIndex / mergeItem.payByrCntIndex).toFixed(2));
                // uv价值
                mergeItem.uvValue = Number((mergeItem.tradeIndex / mergeItem.clickCnt).toFixed(2));
                mergeData.push(mergeItem);
            }
            moduleCache.data.merge = mergeData;
        }

        /**
         * @Author xuyefei
         * @Description  存储各指标块信息,主要是为了按照相同顺序显示
         * @Date 14:26 2020/7/31
         * @Param
         * @return
         **/
        function assembleIndexCards() {
            var indexCardsDom = $("#sycmMqIndustryCunstomer .oui-index-picker-item"),
                sortedIndexCards = [];
            indexCardsDom.each(function (index, item) {
                var indexCard = {}, indexCode = $(this).find(".ant-radio-input").attr("value"),
                    indexName = $(this).find(".oui-index-picker-text").text(), isPercentValue = false;
                if (indexCode == "payRateIndex") {
                    indexName = "支付转换率";
                    isPercentValue= true;
                } else if (indexCode == "payByrCntIndex") {
                    indexName = "支付人数";
                } else if (indexCode == "tradeIndex") {
                    indexName = "交易金额";
                }
                indexCard.isActive = false;
                if ($(this).find(".ant-radio-checked").length > 0) {
                    indexCard.isActive = true;
                }
                indexCard.indexName = indexName;
                indexCard.indexCode = indexCode;
                indexCard.isPercentValue = isPercentValue;
                sortedIndexCards.push(indexCard);
            });
            return sortedIndexCards;
        }

        function drawIndexCards() {
            // 已选中的指标块初始化
            moduleCache.activeIndexCards = {};
            var sortedIndexCards = assembleIndexCards();
            // 计算每个小块宽度的百分比
            var cardItemWrapperPercent = (100 / sortedIndexCards.length).toFixed(4);
            // 舍去最后一位，防止宽度超出
            cardItemWrapperPercent = cardItemWrapperPercent.substring(0, cardItemWrapperPercent.length - 2);
            $(".wxr-cards-container").css({width: "60%"});
            // for (var i in moduleCache.firstLevelCategoryArray) {
            $.each(sortedIndexCards, function (index, indexItem) {
                var cardItemWrapper = $("<div class='wxr-card-item-wrapper' style='width: " +
                    cardItemWrapperPercent + "%'></div>"),
                    cardItemBody = $("<div class='wxr-card-item-body wxr-card-item-body-solid'><i class='layui-icon layui-icon-ok-circle wxr-card-item-body-icon'></i></div>");
                cardItemWrapper.append(cardItemBody);
                if (indexItem.isActive) {
                    cardItemBody.addClass("wxr-card-item-body-active");
                    cardItemBody.find(".wxr-card-item-body-icon").addClass("wxr-card-item-body-icon-checked");
                    moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                }
                // 填充内容
                var bodyContent = $("<ul><li class='wxr-card-item-body-title wxr-text-ellipsis' style='font-size: 12px' title='" + indexItem.indexName + "'>" + indexItem.indexName + "</li>" +
                    "</ul>");
                bodyContent.find(".wxr-card-item-body-data").each(function (index, item) {
                    if ($(this).find("div").length == 2) {
                        $(this).find("div:first-child").css({width: "50%"});
                        $(this).find("div:nth-child(2)").css({width: "50%", textAlign: "right"});
                    }
                });
                cardItemBody.append(bodyContent);
                $(".wxr-cards-container").append(cardItemWrapper);
                // 点击事件绑定
                cardItemBody.on("click", function () {
                    // $(".wxr-cards-container .wxr-card-item-body").removeClass("wxr-card-item-body-active");
                    if ($(this).hasClass("wxr-card-item-body-active")) {
                        if ($(".wxr-cards-container .wxr-card-item-body-active").length > 1) {
                            $(this).removeClass("wxr-card-item-body-active");
                            cardItemBody.find(".layui-icon-ok-circle").removeClass("wxr-card-item-body-icon-checked");
                            delete moduleCache.activeIndexCards[indexItem.indexCode];
                        }
                    } else {
                        $(this).addClass("wxr-card-item-body-active");
                        cardItemBody.find(".layui-icon-ok-circle").addClass("wxr-card-item-body-icon-checked");
                        moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                    }
                    renderChart();
                });
            });
        }

        function renderChart() {
            var thisChart = echarts.init($("#" + moduleCache.chartElementId + "")[0]),
                xAxisData = moduleCache.dateTimes, seriesDataArray = [], count = 0, interval = 1;
            for (var indexCode in moduleCache.activeIndexCards) {
                var activeCardItem = moduleCache.activeIndexCards[indexCode], seriesObj = {
                    name: activeCardItem.indexName,
                    type: 'line',
                    data: moduleCache.data.trend[indexCode],
                    smooth: true,
                    symbol: "circle",
                    showSymbol: false,
                    symbolSize: 6,
                    yAxisIndex: count
                };
                seriesDataArray.push(seriesObj);
                count++;
            }
            if (moduleCache.urlParams.dateType == "day" || moduleCache.urlParams.dateType == "recent7" || moduleCache.urlParams.dateType == "recent30") {
                interval = 3;
            }
            var chartOptions = {
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        interval: interval
                    },
                    axisLine: {},
                    data: xAxisData,
                },
                series: seriesDataArray
            };
            commonModule.renderLineCharts(chartOptions, thisChart, count);
        }

        /**
         * @Author xuyefei
         * @Description 渲染表格
         * @Date 14:54 2020/9/28
         * @Param
         * @return
         **/
        function renderTable(layero) {
            var heightGap = ($(window).height() * 0.04 + 114 + 310 + 86).toFixed(0), cols = [[]];
            cols[0] = [
                {field: "dateTime", title: "日期", minWidth: 110, sort: true},
                {field: "tradeIndex", title: "交易金额", minWidth: 110, sort: true},
                {field: "payRateIndex", title: "支付转化率", minWidth: 130, sort: true},
                {field: "payByrCntIndex", title: "支付人数", minWidth: 110, sort: true},
                {field: "clickCnt", title: "点击人数", minWidth: 110, sort: true},
                {field: "buyerPerPrice", title: "客单价", minWidth: 90, sort: true},
                {field: "uvValue", title: "uv价值", minWidth: 130, sort: true}
            ]
            ;
            var renderTableOptions = {
                id: moduleCache.tableLayId,
                elem: "#" + moduleCache.tableElementId,
                data: moduleCache.data.merge,
                height: 'full-' + heightGap,
                cols: cols,
                done: function () {

                }
            };
            var inst = commonModule.renderTable(renderTableOptions, layero);
        }

        return {
            init: function () {
                var targetDom = $("#sycmMqIndustryCunstomer .oui-card-header-item.oui-card-header-item-pull-right"),
                    buttons = [
                        {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                    ];
                commonModule.injectButtons(targetDom, "append", buttons, true, function (targetDom) {
                    // $(".wxr-tool-buttons-inject-container").css("float", "none");
                });
            }
        }
    }());

/**
 * @Author xuyefei
 * @Description  客群透视-透视分析
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var customerGroupPerspectiveModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "客群透视 | 透视分析",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        // mergeData: {},// 年龄-性别与年龄-城市数据的合并
        tableData: [],// 表格展示需要的数据
        activeIndexCards: {},
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "customer-group-perspective-table", //table的dom控件的id属性
        tableLayId: "customerGroupPerspectiveTable", //table在layui中定义的id，即lay-ui属性
        chartElementId: "customer-group-perspective-chart",

    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogWidth;
        var dialogOptions = {
            title: dialogTitle,
            area: ['90%', '90%'],
            // offset: "100px",
            content: "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                setTimeout(function () {
                    renderTable(layero);
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        var ageGenderCacheKey = globalUrlPrefix + "/mc/mkt/customerGroupPerspective.json?device=0"
            + "&attributeType=age,gender&dateType=" + moduleCache.urlParams.dateType + "&dateRange=" + moduleCache.urlParams.dateRange
            + "&cateId=" + moduleCache.urlParams.cateId + "&sellerType=" + moduleCache.urlParams.sellerType,
            ageCityCacheKey = ageGenderCacheKey.replace(/&attributeType=\S+&dateType=/, "&attributeType=age,city&dateType="),
            ageGenderCacheData, ageCityCacheData, toTransformData = {};
        // 年龄-性别维度缓存
        ageGenderCacheData = commonModule.getUsableOriginalJsonDataFromCache(ageGenderCacheKey, false);
        if (ageGenderCacheData != null) {
            toTransformData.ageGender = ageGenderCacheData;
        }
        // 年龄-城市维度缓存
        ageCityCacheData = commonModule.getUsableOriginalJsonDataFromCache(ageCityCacheKey, false);
        if (ageCityCacheData != null) {
            toTransformData.ageCity = ageCityCacheData;
        }
        transformData(toTransformData);
    }

    function transformData(toTransformData) {
        var mergeData = {};
        for (var customerAttr in toTransformData) {
            var customerAttrItem = toTransformData[customerAttr];
            for (var indexCode in customerAttrItem) {
                var currentIndexArray = customerAttrItem[indexCode];
                for (var i in currentIndexArray) {
                    var indexItem = currentIndexArray[i], indexItemData = indexItem.data,
                        indexItemName = indexItem.name;
                    for (var j in indexItemData) {
                        var indexItemDataName = indexItemData[j].name,
                            indexItemDataValue = !indexItemData[j].value ? 0 : indexItemData[j].value;
                        if (indexItemDataName == "M") {
                            indexItemDataName = "男";
                        } else if (indexItemDataName == "F") {
                            indexItemDataName = "女";
                        } else if (indexItemDataName == "unkown") {
                            indexItemDataName = "未知";
                        }
                        var crowdPropertyName = indexItemName + "," + indexItemDataName,
                            mergeItem = mergeData[crowdPropertyName];
                        if (!mergeItem) {
                            mergeItem = {};
                            // 人群属性名称
                            mergeItem.crowdPropertyName = crowdPropertyName;
                            mergeData[crowdPropertyName] = mergeItem;
                        }
                        mergeItem[indexCode] = indexItemDataValue;
                    }
                }
            }
        }

        // 将新划分的数据转换成数组
        var tableData = [], statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", "");
        for (var propertyName in mergeData) {
            var singleObj = mergeData[propertyName];
            for (var p in singleObj) {
                if (p == "payByrCntIndex" || p == "tradeIndex") {
                    singleObj[p] = commonModule.calculateFormula(singleObj[p], 1, 0);
                }
                // if (p == "payConvRate") {
                //     singleObj.uvCnt = singleObj.payConvRate == 0 ? 0 : (singleObj.payByrCntIndex / singleObj.payConvRate).toFixed(0);
                // }
            }
            singleObj.uvCnt = Number((singleObj.payByrCntIndex / singleObj.payConvRate).toFixed(0));
            singleObj.payConvRate = Number((singleObj.payConvRate * 100).toFixed(2));
            singleObj.perTicketSales = Number((singleObj.tradeIndex / singleObj.payByrCntIndex).toFixed(2));
            singleObj.uvValue = Number((singleObj.tradeIndex / singleObj.uvCnt).toFixed(2));
            singleObj.dateTime = statisticsTimeText;
            // singleObj.payConvRate = (singleObj.payConvRate * 100).toFixed(2);
            tableData.push(singleObj);
        }
        moduleCache.tableData = tableData;
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var heightGap = ($(window).height() * 0.1 + 114).toFixed(0), cols = [[
            {field: "crowdPropertyName", title: "人群属性", minWidth: 110, sort: true},
            {field: "dateTime", title: "日期", minWidth: 100, sort: true},
            {field: "tradeIndex", title: "交易金额", minWidth: 110, sort: true},
            {field: "payByrCntIndex", title: "支付人数", minWidth: 110, sort: true},
            {field: "payConvRate", title: "支付转化率", minWidth: 110, sort: true, isPercentValue: true},
            {field: "uvCnt", title: "访客人数", minWidth: 110, sort: true},
            {field: "perTicketSales", title: "客单价", minWidth: 110, sort: true},
            {field: "uvValue", title: "uv价值", minWidth: 110, sort: true}
        ]];
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: moduleCache.tableData,
            height: 'full-' + heightGap,
            cols: cols,
            done: function () {

            }
        };
        commonModule.renderTable(renderTableOptions, layero);
    }

    return {
        init: function () {
            var targetDom = $("#customerAnalysis>.oui-card-header-wrapper h4"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "after", buttons, true, function (targetDom) {
                // $(".wxr-tool-buttons-inject-container").css("float", "none");
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  客群透视-客群趋势
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var customerPerspectiveTrendModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "客群透视 | 客群趋势",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        data: {
            trend: {// 趋势数据

            },
            table: []
        },
        activeIndexCards: {},
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "customer-perspective-trend-table", //table的dom控件的id属性
        tableLayId: "customerPerspectiveTrendTable", //table在layui中定义的id，即lay-ui属性
        chartElementId: "customer-perspective-trend-chart"
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogWidth;
        var dialogOptions = {
            title: dialogTitle,
            area: ['90%', '96%'],
            // offset: "100px",
            content: "<div class='wxr-cards-container'></div>" +
                "<div class='wxr-charts-container' id='" + moduleCache.chartElementId + "'></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                setTimeout(function () {
                    drawIndexCards();
                    renderChart();
                    renderTable(layero);
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        // 萃取URL地址的参数
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 寻找选中的维度
        var selectedAttributeType = $(".ant-radio-wrapper-checked").eq(0).find("input[type='radio']").val(),
            selectedAttributeValue = $("#customerAnalysis>.oui-card-content span h4").contents().filter(function () {
                return this.nodeType === 3
            }).text();
        selectedAttributeValue = selectedAttributeValue.substring(7).split(" ")[0];
        moduleCache.selectedAttributeValue = selectedAttributeValue;
        var tempArray = selectedAttributeValue.split("，");
        if (tempArray[0] == "男") {
            selectedAttributeValue = tempArray[1] + ",M";
        } else if (tempArray[0] == "女") {
            selectedAttributeValue = tempArray[1] + ",F";
        } else if (tempArray[0] == "未知") {
            selectedAttributeValue = tempArray[1] + ",unkown";
        } else {
            selectedAttributeValue = tempArray[1] + "," + tempArray[0];
        }
        // 拼接trend数据缓存key
        var customerPerspectiveTrendCacheKey = globalUrlPrefix + "/mc/mkt/customerGroupPerspectiveTrend.json?cateId=" + moduleCache.urlParams.cateId
            + "&attributeType=" + selectedAttributeType + "&sellerType=" + moduleCache.urlParams.sellerType + "&device=0"
            + "&attributeValue=" + selectedAttributeValue + "&dateType=" + moduleCache.urlParams.dateType
            + "&dateRange=" + moduleCache.urlParams.dateRange + "&indexCode=",
            customerPerspectiveTrendCacheData = commonModule.getUsableOriginalJsonDataFromCache(customerPerspectiveTrendCacheKey, false);
        if (customerPerspectiveTrendCacheData) {
            moduleCache.data.trend = customerPerspectiveTrendCacheData;
            transformData();
        }
    }

    function transformData() {
        // 根据指标数组的长度计算出时间维度数组
        var dataLength, endTimeStr = moduleCache.urlParams.dateRange.split("|")[1];
        for (var indexCode in moduleCache.data.trend) {
            var indexItem = moduleCache.data.trend[indexCode];
            dataLength = indexItem.length;
            if (dataLength) {
                break;
            }
        }
        // 生成时间周期
        moduleCache.dateTimes = commonModule.generateStatisticTimes(dataLength, endTimeStr, moduleCache.urlParams.dateType);
        // 合并各指标数据
        var tableData = [];
        for (var i in moduleCache.dateTimes) {
            var tableItem = {dateTime: moduleCache.dateTimes[i]};
            for (var indexCode in moduleCache.data.trend) {
                var indexItemTrendArray = moduleCache.data.trend[indexCode];
                if (indexCode == "tradeIndex" || indexCode == "payByrCntIndex") {
                    indexItemTrendArray[i] = commonModule.calculateFormula(indexItemTrendArray[i], 1, 0);
                } else if (indexCode == "payConvRate") {// 不在此处转换，保证数据在计算时的精度
                    // indexItemTrendArray[i] = Number((indexItemTrendArray[i] * 100).toFixed(2));
                }
                tableItem[indexCode] = indexItemTrendArray[i];
            }
            // 补齐可计算的指标数组
            if (!moduleCache.data.trend.uvCnt) {
                moduleCache.data.trend.uvCnt = [];
            }
            moduleCache.data.trend.uvCnt[i] = tableItem.payConvRate == 0 ?
                0 : Number((tableItem.payByrCntIndex / tableItem.payConvRate).toFixed(0));
            if (!moduleCache.data.trend.perTicketSales) {
                moduleCache.data.trend.perTicketSales = [];
            }
            moduleCache.data.trend.perTicketSales[i] = tableItem.payByrCntIndex == 0 ?
                0 : Number((tableItem.tradeIndex / tableItem.payByrCntIndex).toFixed(2));
            if (!moduleCache.data.trend.uvValue) {
                moduleCache.data.trend.uvValue = [];
            }
            moduleCache.data.trend.uvValue[i] = moduleCache.data.trend.uvCnt[i] == 0 ?
                0 : Number((tableItem.tradeIndex / moduleCache.data.trend.uvCnt[i]).toFixed(2));
            tableItem.uvCnt = moduleCache.data.trend.uvCnt[i];
            tableItem.perTicketSales = moduleCache.data.trend.perTicketSales[i];
            tableItem.uvValue = moduleCache.data.trend.uvValue[i];
            tableItem.crowdPropertyName = moduleCache.selectedAttributeValue;
            // 支付转化率格式化
            for (var indexCode in moduleCache.data.trend) {
                var indexItemTrendArray = moduleCache.data.trend[indexCode];
                if (indexCode == "payConvRate") {
                    indexItemTrendArray[i] = Number((indexItemTrendArray[i] * 100).toFixed(2));
                    tableItem[indexCode] = indexItemTrendArray[i];
                }
            }
            tableData.push(tableItem);
        }
        moduleCache.data.table = tableData;
    }

    /**
     * @Author xuyefei
     * @Description  存储各指标块信息,主要是为了按照相同顺序显示
     * @Date 14:26 2020/7/31
     * @Param
     * @return
     **/
    function assembleIndexCards() {
        var sortedIndexCards = [], sortedIndexCodes = ["tradeIndex", "payByrCntIndex", "payConvRate", "uvCnt", "perTicketSales", "uvValue"],
            selectedIndexCode = $(".ant-radio-wrapper-checked").eq(1).find("input[type='radio']").val();
        $.each(sortedIndexCodes, function (index, item) {
            var indexItemCard = {isPercentValue: false};
            indexItemCard.indexCode = item;
            // 获取每个指标最后一个数据
            var indexArray = moduleCache.data.trend[item];
            indexItemCard.indexValue = indexArray[indexArray.length - 1];
            var indexChangeValue = indexArray[indexArray.length - 1] / indexArray[indexArray.length - 2], cycleCrcIconClassName;
            if (indexChangeValue > 1) {
                indexChangeValue = ((indexChangeValue - 1) * 100).toFixed(2) + "%";
                cycleCrcIconClassName = "anticon anticon-trend-up oui-canary-icon oui-canary-icon-trend-up oui-index-cell-trend-up";
            } else if (indexChangeValue < 1) {
                indexChangeValue = ((1 - indexChangeValue) * 100).toFixed(2) + "%";
                cycleCrcIconClassName = "anticon anticon-trend-down oui-canary-icon oui-canary-icon-trend-down oui-index-cell-trend-down";
            } else {
                indexChangeValue = "-";
            }
            indexItemCard.indexCycleCrc = indexChangeValue;
            if (selectedIndexCode == item) {
                indexItemCard.isActive = true;
            }
            if (item == "payByrCntIndex") {
                indexItemCard.indexName = "支付人数";
            } else if (item == "tradeIndex") {
                indexItemCard.indexName = "交易金额";
            } else if (item == "payConvRate") {
                indexItemCard.indexName = "支付转化率";
                indexItemCard.isPercentValue = true;
            } else if (item == "uvCnt") {
                indexItemCard.indexName = "访客人数";
            } else if (item == "perTicketSales") {
                indexItemCard.indexName = "客单价";
            } else if (item == "uvValue") {
                indexItemCard.indexName = "uv价值";
            }
            indexItemCard.compareText = commonModule.getCompareText(moduleCache.urlParams.dateType);
            indexItemCard.cycleCrcIconClassName = cycleCrcIconClassName;
            sortedIndexCards.push(indexItemCard);
        });
        return sortedIndexCards;
    }

    function drawIndexCards() {
        // 已选中的指标块初始化
        moduleCache.activeIndexCards = {};
        var sortedIndexCards = assembleIndexCards();
        // 计算每个小块宽度的百分比
        var cardItemWrapperPercent = (100 / sortedIndexCards.length).toFixed(4);
        // 舍去最后一位，防止宽度超出
        cardItemWrapperPercent = cardItemWrapperPercent.substring(0, cardItemWrapperPercent.length - 2);
        $(".wxr-cards-container").css({width: "90%"});
        // for (var i in moduleCache.firstLevelCategoryArray) {
        $.each(sortedIndexCards, function (index, indexItem) {
            var cardItemWrapper = $("<div class='wxr-card-item-wrapper' style='width: " +
                cardItemWrapperPercent + "%'></div>"),
                cardItemBody = $("<div class='wxr-card-item-body wxr-card-item-body-solid'><i class='layui-icon layui-icon-ok-circle wxr-card-item-body-icon'></i></div>");
            cardItemWrapper.append(cardItemBody);
            if (indexItem.isActive) {
                cardItemBody.addClass("wxr-card-item-body-active");
                cardItemBody.find(".wxr-card-item-body-icon").addClass("wxr-card-item-body-icon-checked");
                moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
            }
            // 填充内容
            var bodyContent = $("<ul><li class='wxr-card-item-body-title wxr-text-ellipsis' style='font-size: 12px' title='" + indexItem.indexName + "'>" + indexItem.indexName + "</li>" +
                "<li class='wxr-card-item-body-data' style='font-size: 18px;line-height: 20px;color: #0C0C0C'><div class='wxr-text-ellipsis'>" + indexItem.indexValue + (indexItem.isPercentValue ? "%" : "") + "</div></li>" +
                "<li class='wxr-card-item-body-data' style='font-size: 12px'><div class='wxr-text-ellipsis'>" + indexItem.compareText + "</div><div class='wxr-text-ellipsis'>" + indexItem.indexCycleCrc + "<i class='" + indexItem.cycleCrcIconClassName + "'></i></div></li>" +
                "</ul>");
            bodyContent.find(".wxr-card-item-body-data").each(function (index, item) {
                if ($(this).find("div").length == 2) {
                    $(this).find("div:first-child").css({width: "50%"});
                    $(this).find("div:nth-child(2)").css({width: "50%", textAlign: "right"});
                }
            });
            cardItemBody.append(bodyContent);
            $(".wxr-cards-container").append(cardItemWrapper);
            // 点击事件绑定
            cardItemBody.on("click", function () {
                // $(".wxr-cards-container .wxr-card-item-body").removeClass("wxr-card-item-body-active");
                if ($(this).hasClass("wxr-card-item-body-active")) {
                    if ($(".wxr-cards-container .wxr-card-item-body-active").length > 1) {
                        $(this).removeClass("wxr-card-item-body-active");
                        cardItemBody.find(".layui-icon-ok-circle").removeClass("wxr-card-item-body-icon-checked");
                        delete moduleCache.activeIndexCards[indexItem.indexCode];
                    }
                } else {
                    $(this).addClass("wxr-card-item-body-active");
                    cardItemBody.find(".layui-icon-ok-circle").addClass("wxr-card-item-body-icon-checked");
                    moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                }
                renderChart();
            });
        });
    }

    function renderChart() {
        var thisChart = echarts.init($("#" + moduleCache.chartElementId + "")[0]),
            xAxisData = moduleCache.dateTimes, seriesDataArray = [], count = 0, interval = 1;
        for (var indexCode in moduleCache.activeIndexCards) {
            var activeCardItem = moduleCache.activeIndexCards[indexCode], seriesObj = {
                name: activeCardItem.indexName,
                type: 'line',
                data: moduleCache.data.trend[indexCode],
                smooth: true,
                symbol: "circle",
                showSymbol: false,
                symbolSize: 6,
                yAxisIndex: count
            };
            seriesDataArray.push(seriesObj);
            count++;
        }
        if (moduleCache.urlParams.dateType == "day" || moduleCache.urlParams.dateType == "recent7" || moduleCache.urlParams.dateType == "recent30") {
            interval = 3;
        }
        var chartOptions = {
            xAxis: {
                type: 'category',
                axisLabel: {
                    interval: interval
                },
                axisLine: {},
                data: xAxisData,
            },
            series: seriesDataArray
        };
        commonModule.renderLineCharts(chartOptions, thisChart, count);
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var heightGap = ($(window).height() * 0.04 + 114 + 260 + 86).toFixed(0), cols = [[]];
        cols[0] = [
            {field: "crowdPropertyName", title: "人群属性", minWidth: 110, sort: true},
            {field: "dateTime", title: "日期", minWidth: 110, sort: true},
            {field: "tradeIndex", title: "交易金额", minWidth: 110, sort: true},
            {field: "payByrCntIndex", title: "支付人数", minWidth: 110, sort: true},
            {field: "payConvRate", title: "支付转化率", minWidth: 130, sort: true, isPercentValue: true},
            {field: "uvCnt", title: "访客人数", minWidth: 110, sort: true},
            {field: "perTicketSales", title: "客单价", minWidth: 90, sort: true},
            {field: "uvValue", title: "uv价值", minWidth: 130, sort: true}
        ]
        ;
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: moduleCache.data.table,
            height: 'full-' + heightGap,
            cols: cols,
            done: function () {

            }
        };
        var inst = commonModule.renderTable(renderTableOptions, layero);
    }

    return {
        init: function () {
            var targetDom = $("#customerAnalysis>.oui-card-content span h4"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "prepend", buttons, true, function (targetDom) {
                // $(".wxr-tool-buttons-inject-container").css({position: "absolute", right: "20px", top: "0px"});
                targetDom.css({height: "40px"});
            });
        }
    }
}());


/**
 * @Author xuyefei
 * @Description  竞争-监控店铺-竞店列表
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var competitionListOfShopMonitorModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "监控店铺 | 竞店列表",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        // mergeData: {},// 年龄-性别与年龄-城市数据的合并
        tableData: {
            total: [],
            shop: [],
            cate:[],
            compare: []
        },// 表格展示需要的数据
        activeIndexCards: {},
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "competition-list-of-shop-monitor-table", //table的dom控件的id属性
        tableLayId: "competitionListOfShopMonitorTable", //table在layui中定义的id，即lay-ui属性
        tabElementId: "competition-list-of-shop-monitor-tab"
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogWidth;
        var dialogOptions = {
            title: dialogTitle,
            area: ['96%', '90%'],
            // offset: "100px",
            content: "<div id='" + moduleCache.tabElementId + "' class='layui-tab layui-tab-brief' lay-filter='tabLayFilter'><ul class='layui-tab-title'><li class='layui-this' value='shop'>店铺数据</li><li value='cate'>类目数据</li><li value='compare'>类目占比</li></ul></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layerObj, index) {
                setTimeout(function () {
                    renderTabs(layerObj);
                    renderTable(layerObj);
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    function renderTabs(layerObj) {
        // moduleCache.tableShowModel = "shop";
        $("#competition-list-of-shop-monitor-tab").css({padding: "5px 0px"});
        layui.element.on("tab(tabLayFilter)", function () {
            renderTable(layerObj);
        });
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        var cacheKey = globalUrlPrefix + "/mc/ci/shop/monitor/listShop.json", cacheData = commonModule.getUsableOriginalJsonDataFromCache(cacheKey, true);
        moduleCache.tableData.total = moduleCache.urlParams.dateType == "today" ? cacheData.data : cacheData;
        transformData();
    }

    function transformData() {
        moduleCache.tableData.shop = [], moduleCache.tableData.cate = [], moduleCache.tableData.compare = [];
        for (var i in moduleCache.tableData.total) {
            var itemData = moduleCache.tableData.total[i], shopDataItem = {}, categoryDataItem = {}, compareDataItem = {};
            for (var pro in itemData) {
                if (pro == "shop") {
                    shopDataItem.shop = itemData[pro];
                    categoryDataItem.shop = itemData[pro];
                    compareDataItem.shop = itemData[pro];
                } else if (pro == "cate_cateRankId") {
                    categoryDataItem.cateRankId = itemData[pro];
                } else if (pro.indexOf("_") != -1) {
                    var tempArray = pro.split("_"), dataType = tempArray[0], indexCode = tempArray[1], currentItemObj;
                    if (dataType == "cate") {
                        currentItemObj = categoryDataItem;
                    } else {
                        currentItemObj = shopDataItem;
                    }
                    var indexValue = itemData[pro].value;
                    if (indexValue == null || indexValue == undefined) {
                        // currentItemObj[indexCode] = "-";
                        continue;
                    }
                    if (indexCode.indexOf("Hits") != -1 || indexCode.indexOf("Index") != -1) {
                        if (indexCode == "payRateIndex") {
                            indexValue = commonModule.calculateFormula(indexValue, 0, 2);
                        } else {
                            indexValue = commonModule.calculateFormula(indexValue, 1, 0);
                        }
                    }
                    currentItemObj[indexCode] = indexValue;
                }
            }
            // 客单价：交易金额 / 支付人数
            shopDataItem.perTicketSales = Number((shopDataItem.tradeIndex / shopDataItem.payByrCntIndex).toFixed(2));
            // uv价值：交易金额 / 访客人数
            shopDataItem.uvValue = Number((shopDataItem.tradeIndex / shopDataItem.uvIndex).toFixed(2));
            // 搜索占比：搜索人数 / 访客人数
            shopDataItem.seIpvUvHitsRate = Number((shopDataItem.seIpvUvHits / shopDataItem.uvIndex * 100).toFixed(2));
            // 收藏率：收藏人数 / 访客人数
            shopDataItem.cltRate = Number((shopDataItem.cltHits / shopDataItem.uvIndex * 100).toFixed(2));
            // 加购率：加购人数 / 访客人数
            shopDataItem.cartRate = Number((shopDataItem.cartHits / shopDataItem.uvIndex * 100).toFixed(2));
            moduleCache.tableData.shop.push(shopDataItem);

            // 客单价：交易金额 / 支付人数
            categoryDataItem.perTicketSales = Number((categoryDataItem.tradeIndex / categoryDataItem.payByrCntIndex).toFixed(2));
            // uv价值：交易金额 / 访客人数
            categoryDataItem.uvValue = Number((categoryDataItem.tradeIndex / categoryDataItem.uvIndex).toFixed(2));
            // 搜索占比：搜索人数 / 访客人数
            categoryDataItem.seIpvUvHitsRate = Number((categoryDataItem.seIpvUvHits / categoryDataItem.uvIndex * 100).toFixed(2));
            // 收藏率：收藏人数 / 访客人数
            categoryDataItem.cltRate = Number((categoryDataItem.cltHits / categoryDataItem.uvIndex * 100).toFixed(2));
            // 加购率：加购人数 / 访客人数
            categoryDataItem.cartRate = Number((categoryDataItem.cartHits / categoryDataItem.uvIndex * 100).toFixed(2));
            if (categoryDataItem.cateRankIdValue == undefined) {
                categoryDataItem.cateRankIdValue = "-";
            }
            if (categoryDataItem.cateRankIdCycleCqc == undefined) {
                categoryDataItem.cateRankIdCycleCqc = "-";
            }
            moduleCache.tableData.cate.push(categoryDataItem);

            // 类目交易金额占比
            compareDataItem.shopTradeIndex = shopDataItem.tradeIndex;
            compareDataItem.categoryTradeIndex = categoryDataItem.tradeIndex;
            compareDataItem.tradeIndexRate = Number((compareDataItem.categoryTradeIndex / compareDataItem.shopTradeIndex * 100).toFixed(2));
            // 访客人数占比
            compareDataItem.shopUvIndex = shopDataItem.uvIndex;
            compareDataItem.categoryUvIndex = categoryDataItem.uvIndex;
            compareDataItem.uvIndexRate = Number((compareDataItem.categoryUvIndex / compareDataItem.shopUvIndex * 100).toFixed(2));
            // 搜索人数占比
            compareDataItem.shopSeIpvUvHits = shopDataItem.seIpvUvHits;
            compareDataItem.categorySeIpvUvHits = categoryDataItem.seIpvUvHits;
            compareDataItem.seIpvUvHitsRate = Number((compareDataItem.categorySeIpvUvHits / compareDataItem.shopSeIpvUvHits * 100).toFixed(2));
            // 支付人数占比
            compareDataItem.shopPayByrCntIndex = shopDataItem.payByrCntIndex;
            compareDataItem.categoryPayByrCntIndex = categoryDataItem.payByrCntIndex;
            compareDataItem.payByrCntIndexRate = Number((compareDataItem.categoryPayByrCntIndex / compareDataItem.shopPayByrCntIndex * 100).toFixed(2));
            moduleCache.tableData.compare.push(compareDataItem);
        }
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layerObj) {
        var activeTableModel = $("#" + moduleCache.tabElementId + " .layui-this").attr("value"),
            heightGap = ($(window).height() * 0.1 + 104 + 50).toFixed(0), cols, tableData;
        if (activeTableModel == "shop") {
            cols = [[
                {field: 'shopName', title: "店铺名称", minWidth: 220, sort: true, templet: function (row) {
                        // return "<img src='" + row.shop.pictureUrl + "'/><span>" + row.shopName + "</span>";
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='" + row.shop.pictureUrl + "'/><span>" +
                            "<a href='" + row.shop.shopUrl + "' target='_blank' title='" + row.shop.title + "'>" + row.shop.title + "</a></span></div>";
                    }},
                {field: "tradeIndex", title: "交易金额", minWidth: 110, sort: true},
                {field: "uvIndex", title: "访客人数", minWidth: 110, sort: true},
                {field: "seIpvUvHits", title: "搜索人数", minWidth: 110, sort: true},
                {field: "cltHits", title: "收藏人数", minWidth: 110, sort: true},
                {field: "cartHits", title: "加购人数", minWidth: 110, sort: true},
                {field: "payRateIndex", title: "支付转化率", minWidth: 110, sort: true, isPercentValue: true},
                {field: "payByrCntIndex", title: "支付人数", minWidth: 110, sort: true},
                {field: "perTicketSales", title: "客单价", minWidth: 110, sort: true},
                {field: "uvValue", title: "uv价值", minWidth: 110, sort: true},
                {field: "seIpvUvHitsRate", title: "搜索占比", minWidth: 90, sort: true, isPercentValue: true},
                {field: "cltRate", title: "收藏率", minWidth: 90, sort: true, isPercentValue: true},
                {field: "cartRate", title: "加购率", minWidth: 90, sort: true, isPercentValue: true},
                {field: "preTradeIndex", title: "预售定金", minWidth: 110, sort: true},
                {field: "preSellItmCnt", title: "预售定金商品件数", minWidth: 150, sort: true},
                {field: "fstOnsItmCnt", title: "上新商品数", minWidth: 110, sort: true}
            ]];
            tableData = moduleCache.tableData.shop;
        } else if (activeTableModel == "cate"){
            cols = [[
                {field: 'shopName', title: "店铺名称", minWidth: 220, sort: true, templet: function (row) {
                        // return "<img src='" + row.shop.pictureUrl + "'/><span>" + row.shopName + "</span>";
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='" + row.shop.pictureUrl + "'/><span>" +
                            "<a href='" + row.shop.shopUrl + "' target='_blank' title='" + row.shop.title + "'>" + row.shop.title + "</a></span></div>";
                    }},
                {field: "cateRank", title: "行业排名", minWidth: 110, sort: true, templet: function (row) {
                        var cateRankIdValue, cateRankIdCycleCqc, className = "wxr-font-small-normal-color";
                        if (row.cateRankId) {
                            if (row.cateRankId.value != null && row.cateRankId.value != undefined) {
                                cateRankIdValue = row.cateRankId.value;
                            } else {
                                cateRankIdValue = "-";
                            }
                            if (row.cateRankId.cycleCqc != null && row.cateRankId.cycleCqc != undefined) {
                                cateRankIdCycleCqc = row.cateRankId.cycleCqc;
                            } else {
                                cateRankIdCycleCqc = "-";
                            }
                        } else {
                            cateRankIdValue = "-", cateRankIdCycleCqc = "-";
                        }
                        if (cateRankIdCycleCqc < 0) {
                            className = "wxr-font-small-red-color";
                            cateRankIdCycleCqc = "升" + Math.abs(cateRankIdCycleCqc) + "名";
                        } else if (cateRankIdCycleCqc > 0) {
                            className = "wxr-font-small-green-color";
                            cateRankIdCycleCqc = "降" + cateRankIdCycleCqc + "名";
                        } else if (cateRankIdCycleCqc == 0) {
                            cateRankIdCycleCqc = "持平";
                        }
                        return "<ul><li>" + cateRankIdValue + "\n</li><li class='" + className + "'>" + cateRankIdCycleCqc + "\n</li></ul>";
                    }},
                {field: "tradeIndex", title: "交易金额", minWidth: 110, sort: true},
                {field: "uvIndex", title: "访客人数", minWidth: 110, sort: true},
                {field: "seIpvUvHits", title: "搜索人数", minWidth: 110, sort: true},
                {field: "cltHits", title: "收藏人数", minWidth: 110, sort: true},
                {field: "cartHits", title: "加购人数", minWidth: 110, sort: true},
                {field: "payRateIndex", title: "支付转化率", minWidth: 110, sort: true, isPercentValue: true},
                {field: "payByrCntIndex", title: "支付人数", minWidth: 110, sort: true},
                {field: "perTicketSales", title: "客单价", minWidth: 110, sort: true},
                {field: "uvValue", title: "uv价值", minWidth: 110, sort: true},
                {field: "seIpvUvHitsRate", title: "搜索占比", minWidth: 110, sort: true, isPercentValue: true},
                {field: "cltRate", title: "收藏率", minWidth: 110, sort: true, isPercentValue: true},
                {field: "cartRate", title: "加购率", minWidth: 110, sort: true, isPercentValue: true}
            ]];
            tableData = moduleCache.tableData.cate;
        } else if (activeTableModel == "compare") {
            cols = [[
                {field: 'shopName', title: "店铺名称", minWidth: 220, sort: true, templet: function (row) {
                        // return "<img src='" + row.shop.pictureUrl + "'/><span>" + row.shopName + "</span>";
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='" + row.shop.pictureUrl + "'/><span>" +
                            "<a href='" + row.shop.shopUrl + "' target='_blank' title='" + row.shop.title + "'>" + row.shop.title + "</a></span></div>";
                    }},
                {field: "categoryTradeIndex", title: "类目交易金额", minWidth: 120, sort: true},
                {field: "shopTradeIndex", title: "全店交易金额", minWidth: 120, sort: true},
                {field: "tradeIndexRate", title: "交易金额占比", minWidth: 120, sort: true, isPercentValue: true},
                {field: "categoryUvIndex", title: "类目访客人数", minWidth: 120, sort: true},
                {field: "shopUvIndex", title: "全店访客人数", minWidth: 120, sort: true},
                {field: "uvIndexRate", title: "访客人数占比", minWidth: 120, sort: true, isPercentValue: true},
                {field: "categorySeIpvUvHits", title: "类目搜索人数", minWidth: 120, sort: true},
                {field: "shopSeIpvUvHits", title: "全店搜索人数", minWidth: 120, sort: true},
                {field: "seIpvUvHitsRate", title: "搜索人数占比", minWidth: 120, sort: true, isPercentValue: true},
                {field: "categoryPayByrCntIndex", title: "类目支付人数", minWidth: 120, sort: true},
                {field: "shopPayByrCntIndex", title: "全店支付人数", minWidth: 120, sort: true},
                {field: "payByrCntIndexRate", title: "支付人数占比", minWidth: 120, sort: true, isPercentValue: true}
            ]];
            tableData = moduleCache.tableData.compare;
        }
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: tableData,
            height: 'full-' + heightGap,
            cols: cols,
            done: function () {

            }
        };
        commonModule.renderTable(renderTableOptions, layerObj);
    }

    return {
        init: function () {
            var targetDom = $("#completeShop .oui-card-header-item.oui-card-header-item-pull-right .oui-card-link"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "prepend", buttons, true, function (targetDom) {
                // $(".wxr-tool-buttons-inject-container").css("float", "none");
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  竞争-竞店识别
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var competitionShopRecognitionModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "竞店识别",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        // mergeData: {},// 年龄-性别与年龄-城市数据的合并
        data: {
            drainShops: {},// 流失竞店集合
            potentialShops: {},// 高潜竞店集合
            hasSelectedShops: [],// 曾经选择过的店铺
            mergeData: [],
            compareData: [],
            // activeShops: {} // 被选中的店铺
        },// 表格展示需要的数据
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "competition-shop-recognition-table", //table的dom控件的id属性
        tableLayId: "competitionShopRecognitionTable", //table在layui中定义的id，即lay-ui属性
        tabElementId: "competition-shop-recognition-tab",
        chartElementId: "competition-shop-recognition-trend-chart",
        statisticEndTimeStr: "",
        sortedIndexCards: [
            {indexCode: "tradeIndex", indexName: "交易金额", isActive: true},
            {indexCode: "uvIndex", indexName: "访客人数"},
            {indexCode: "payByrCntIndex", indexName: "支付人数"},
            {indexCode: "payRateIndex", indexName: "支付转化率", isPercentValue: true},
            {indexCode: "perTicketSales", indexName: "客单价"},
            {indexCode: "uvValue", indexName: "uv价值"}
        ]
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + (moduleCache.urlParams.activeKey == "drain" ? "流失竞店" : "高潜竞店") +
                " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogWidth;
        var dialogOptions = {
            title: dialogTitle,
            area: ['96%', '96%'],
            // offset: "100px",
            content: "<div class='wxr-dialog-sidebar'><div class='wxr-dialog-sidebar-inner'><ul></ul></div></div><div class='wxr-dialog-main'>" +
                "<div id='wxr-dialog-side-button'><i class='layui-icon layui-icon-spread-left' title='展开'></i></div>" +
                "<div class='wxr-cards-container'></div>" +
                "<div class='wxr-charts-container' id='competition-shop-recognition-trend-chart'></div>" +
                "<div id='" + moduleCache.tabElementId + "' class='layui-tab layui-tab-brief' lay-filter='tabLayFilter'><ul class='layui-tab-title'><li class='layui-this' value='merge'>合并模式</li><li value='compare'>对比模式</li></ul></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div></div>",
            success: function (layero, index) {
                var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0});
                setTimeout(function () {
                    try {
                        sideButtonEventBind(layero);
                        drawDialogPageLeft(layero);
                        drawIndexCards(layero);
                        renderChart(layero);
                        renderTabs(layero);
                        renderTable(loading, layero);
                    } catch (e) {
                        layui.layer.close(loading);
                    }
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    function sideButtonEventBind() {
        $("#wxr-dialog-side-button .layui-icon").on("click", function () {
            if ($(this).hasClass("layui-icon-spread-left")) {
                $(this).removeClass("layui-icon-spread-left");
                $(this).addClass("layui-icon-shrink-right");
                $(this).attr("title", "折叠");
                // $(".dialog-sidebar").show(500, function () {
                //     $(".dialog-main").css({paddingLeft: "240px"});
                // });
                $(".wxr-dialog-sidebar").animate({
                    width: '260px', opacity: 'show'
                }, 500, function () {
                    $(".wxr-dialog-main").css({paddingLeft: "260px"});
                    $("#wxr-dialog-side-button").css({paddingLeft: "270px"});
                    var chartInstance = echarts.getInstanceByDom($("#competition-shop-recognition-trend-chart")[0]);
                    if (chartInstance) {
                        chartInstance.resize();
                    }
                    layui.table.resize(moduleCache.tableLayId);
                });
            } else if ($(this).hasClass("layui-icon-shrink-right")) {
                $(this).removeClass("layui-icon-shrink-right");
                $(this).addClass("layui-icon-spread-left");
                $(this).attr("title", "展开");
                // $(".dialog-sidebar").hide(500, function () {
                //     $(".dialog-main").css({paddingLeft: "0px"});
                // });
                $(".wxr-dialog-sidebar").animate({
                    width: '0px', opacity: 'hide'
                }, 500, function () {
                    $(".wxr-dialog-main").css({paddingLeft: "0"});
                    $("#wxr-dialog-side-button").css({paddingLeft: "10px"});
                    var chartInstance = echarts.getInstanceByDom($("#competition-shop-recognition-trend-chart")[0]);
                    if (chartInstance) {
                        chartInstance.resize();
                    }
                    layui.table.resize(moduleCache.tableLayId);
                });
            }

        });
        // $("#wxr-dialog-side-button .layui-icon").trigger("click");
    }

    function renderTabs() {
        $("#competition-shop-recognition-tab").css({padding: "5px 0px"});
        if ($(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length <= 1) {// 没有对比词时对比模式禁用
            $("#" + moduleCache.tabElementId + " li:last").addClass("wxr-tab-disabled");
        }
        layui.element.on("tab(tabLayFilter)", function () {
            renderTable();
        });
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        moduleCache.data.hasSelectedShops = [];
        var shopListCacheKey = globalUrlPrefix + "/mc/ci/shop/recognition", shopListData, dateRangeEndPoint = moduleCache.urlParams.dateRange.split("|")[1].replace(/-/g, "/"),
            endDate = new Date(dateRangeEndPoint), startDate = endDate.setDate(endDate.getDate() - 29),
            dateRangeStartPoint = endDate.getFullYear() + "-" + ((endDate.getMonth() + 1) < 10 ? "0"
                + (endDate.getMonth() + 1) : (endDate.getMonth() + 1)) + "-" + (endDate.getDate() < 10 ?
                "0" + endDate.getDate() : endDate.getDate()), newDateRange = dateRangeStartPoint + "|" + moduleCache.urlParams.dateRange.split("|")[1];
        if (moduleCache.urlParams.activeKey == "drain") {
            shopListCacheKey += "/getDrainList.json?page=1&pageSize=30&indexCode=tradeIndex,lostIndex&orderBy=lostIndex&order=desc&dateType=recent30";
        } else {
            shopListCacheKey += "/getPotentialList.json?page=1&pageSize=30&indexCode=tradeIndex,tradeGrowthRange&orderBy=tradeGrowthRange&order=desc&dateType=recent30";
        }
        shopListCacheKey += "&dateRange=" + newDateRange + "&device=" + moduleCache.urlParams.device + "&sellerType="
            + moduleCache.urlParams.sellerType + "&cateId=" + moduleCache.urlParams.cateId;
        shopListData = commonModule.getUsableOriginalJsonDataFromCache(shopListCacheKey, true);
        var selectedShopsTempArray = [];
        if (shopListData) {
            var trendCacheKey = globalUrlPrefix + "/mc/ci/shop/trend.json?dateType=" + moduleCache.urlParams.dateType
                + "&dateRange=" + (moduleCache.statisticEndTimeStr + "|" + moduleCache.statisticEndTimeStr) + "&cateId=" + moduleCache.urlParams.cateId
                + "&userId=&device=" + moduleCache.urlParams.device + "&sellerType=" + moduleCache.urlParams.sellerType
                + "&indexCode=uvIndex,payRateIndex,tradeIndex,payByrCntIndex",
                currentShopName = $("#drainRecognition .alife-dt-card-sycm-common-select .sycm-common-shop-td").attr("title");
            for (var i in shopListData) {
                var shopItem = shopListData[i], thisShopTrendCacheKey = trendCacheKey.replace(/&userId\S+&device/,
                    "&userId=" + shopItem.shop.userId + "&device"),
                    thisShopTrendData = commonModule.getUsableOriginalJsonDataFromCache(thisShopTrendCacheKey, true);
                if (shopItem.shop.title == currentShopName) {
                    shopItem.shop.isActive = true;
                }
                if (thisShopTrendData) {
                    shopItem.shop.trendData = thisShopTrendData;
                    moduleCache.data.hasSelectedShops.push(shopItem.shop);
                }
            }
        }
        // 临时存储集合，窄化集合大小，加快遍历速度
        // var trendDataKeyTempArray = [], selectedShopsTempArray = [],
        //     currentShopName = $("#drainRecognition .alife-dt-card-sycm-common-select .sycm-common-shop-td").attr("title");
        // // 寻找所有已选择过的店铺
        // for (var i = 0; i < localStorage.length; i++) {
        //     var key = localStorage.key(i);
        //     if (key.indexOf("/mc/ci/config/rival/shop/getSingleMonitoredInfo.json?") != -1) {
        //         var data = commonModule.getUsableOriginalJsonDataFromCache(key, true);
        //         if (data) {
        //             if (data.name == currentShopName) {
        //                 data.isActive = true;
        //             }
        //             selectedShopsTempArray.push(data);
        //         }
        //     }
        //     if (key.indexOf("/mc/ci/shop/trend.json?") != -1) {
        //         trendDataKeyTempArray.push(key);
        //     }
        // }
        // 查找店铺所对应的趋势数据
        // var existObj = {};// 去重
        // for (var i in selectedShopsTempArray) {
        //     var shopItem = selectedShopsTempArray[i];
        //     for (var j in trendDataKeyTempArray) {
        //         var key = trendDataKeyTempArray[j];
        //         if (key.indexOf(shopItem.userId) != -1 && key.indexOf(moduleCache.statisticEndTimeStr) != -1) {
        //             var trendData = commonModule.getUsableOriginalJsonDataFromCache(key, true);
        //             if (trendData) {
        //                 if (existObj[shopItem.userId]) {
        //                     break;
        //                 }
        //                 existObj[shopItem.userId] = true;
        //                 shopItem.trendData = trendData;
        //                 moduleCache.data.hasSelectedShops.push(shopItem);
        //             }
        //         }
        //     }
        // }
        transformData();
    }

    function transformData() {
        if (moduleCache.data.hasSelectedShops.length == 0) {
            return;
        }
        var trendDataLength = moduleCache.data.hasSelectedShops[0].trendData.tradeIndex.length;
        moduleCache.dateTimes = commonModule.generateStatisticTimes(trendDataLength, moduleCache.statisticEndTimeStr, moduleCache.urlParams.dateType);
        moduleCache.data.mergeData = [], moduleCache.data.compareData = [];
        var chartHexColors = commonModule.getChartColors().hex;
        for (var j = 0; j < trendDataLength; j++) {
            var compareDataItem = {dateTime: moduleCache.dateTimes[j]};
            $.each(moduleCache.data.hasSelectedShops, function (index, item) {
                // if (item.isDataTransformCompleted) {
                //     return true;
                // }
                if (j == 0) {// 第一次要重新初始化店铺相关数据
                    item.alias = "店铺" + (index + 1);
                    item.backgroundColor = chartHexColors[index % chartHexColors.length];
                    // 为每个店铺准备一个已转化的趋势数据集合
                    item.transformTrendData = {};
                    // 每个店铺单独存储一份自己店铺的合并数据
                    item.mergeData = [];
                }
                if (!item.isActive) {
                    return true;
                }
                var trendData = item.trendData, mergeDataItem = {
                    shopName: item.title,
                    type: item.alias,
                    shopPic: item.pictureUrl,
                    dateTime: moduleCache.dateTimes[j],
                    userId: item.userId,
                    typeIndex: index,
                    shopUrl: item.shopUrl,
                    backgroundColor: item.backgroundColor
                };
                // 对店铺趋势数据中原有的指标的当前循环索引进行转换
                for (var indexCode in trendData) {
                    var indexValue = trendData[indexCode][j];
                    if (indexCode != "payRateIndex") {
                        indexValue = commonModule.calculateFormula(indexValue, 1, 0);
                    } else {
                        indexValue = commonModule.calculateFormula(indexValue, 0, 2);
                    }
                    if (!item.transformTrendData[indexCode]) {
                        item.transformTrendData[indexCode] = [];
                    }
                    item.transformTrendData[indexCode].push(indexValue);
                    mergeDataItem[indexCode] = indexValue;
                    compareDataItem[indexCode + "_" + item.userId] = indexValue;
                }
                // 原有的指标转化完毕之后，计算客单价和uv价值
                if (!item.transformTrendData.uvValue) {
                    item.transformTrendData.uvValue = [];
                }
                mergeDataItem.uvValue = !mergeDataItem.uvIndex ? 0 : Number((mergeDataItem.tradeIndex / mergeDataItem.uvIndex).toFixed(2));
                compareDataItem["uvValue_" + item.userId] = mergeDataItem.uvValue;
                item.transformTrendData.uvValue.push(mergeDataItem.uvValue);
                if (!item.transformTrendData.perTicketSales) {
                    item.transformTrendData.perTicketSales = [];
                }
                mergeDataItem.perTicketSales = !mergeDataItem.payByrCntIndex ? 0 : Number((mergeDataItem.tradeIndex / mergeDataItem.payByrCntIndex).toFixed(2));
                compareDataItem["perTicketSales_" + item.userId] = mergeDataItem.perTicketSales;
                item.transformTrendData.perTicketSales.push(mergeDataItem.perTicketSales);
                item.mergeData.push(mergeDataItem);
                moduleCache.data.mergeData.push(mergeDataItem);
                // 店铺的所有指标数据已转化完毕，汇总一下数据
                if (j == trendDataLength - 1) {
                    for (var indexCode in item.transformTrendData) {
                        item[indexCode + "_total"] = eval(item.transformTrendData[indexCode].join("+"));
                    }
                    // 除了交易金额、访客人数、支付人数之外，支付转化率、uv价值以及客单价都需要按月份数据汇总之后重新计算
                    item["payRateIndex_total"] = !item["uvIndex_total"] ? 0 : Number((item["payByrCntIndex_total"] / item["uvIndex_total"] * 100).toFixed(2));
                    item["uvValue_total"] = !item["uvIndex_total"] ? 0 : Number((item["tradeIndex_total"] / item["uvIndex_total"]).toFixed(2));
                    item["perTicketSales_total"] = !item["payByrCntIndex_total"] ? 0 : Number((item["tradeIndex_total"] / item["payByrCntIndex_total"]).toFixed(2));
                    item.isDataTransformCompleted = true;
                }
            });
            moduleCache.data.compareData.push(compareDataItem);
        }
    }

    function drawDialogPageLeft() {
        var searchShopInputDom = "<li><div style='position:relative;'><input class='wxr-side-bar-search-input layui-input' style='padding: 0px 10px 0px 30px' placeholder='搜索名称/ID'><i class='layui-icon layui-icon-search' style='color: #1E9FFF;position: absolute;top: 10px;left: 8px;font-size: 16px'></i></div></li>";
        $(".wxr-dialog-sidebar-inner>ul").append(searchShopInputDom);
        $.each(moduleCache.data.hasSelectedShops, function (index, item) {
            $("#wxr-side-bar-filter-selector select").append("<option value='" + item.userId + "'>" + item.title + "</option>");
            var singleShopDom = $("<li id='" + item.userId + "-" + item.title + "' class='shop-display-item'><div style='display: inline-block;'><img class='wxr-image-box wxr-image-box-36' src='" + item.pictureUrl + "'/></div>" +
                "<div style='display: inline-block; vertical-align: middle;width: 70%'><ul><li style='padding-bottom: 5px'>" +
                "<a href='" + item.shopUrl + "' target='_blank' title='" + item.title + "'>" + item.title + "</a></li>" +
                "<li><span class='wxr-text-color-block'>" + item.alias +
                "</span></li></ul></div><i class='layui-icon layui-icon-circle' style='width: 15%'></i></li>");
            if (item.isActive) {
                singleShopDom.find(".layui-icon").removeClass("layui-icon-circle");
                singleShopDom.find(".layui-icon").addClass("layui-icon-ok-circle");
                // moduleCache.data.activeShops[item.userId] = item;
            }
            singleShopDom.find(".wxr-text-color-block").css({backgroundColor: item.backgroundColor});
            singleShopDom.find(".layui-icon").on("click", function () {
                if ($(this).hasClass("layui-icon-ok-circle")) {
                    if ($(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length > 1) {
                        $(this).removeClass("layui-icon-ok-circle");
                        $(this).addClass("layui-icon-circle");
                        item.isActive = false;
                    } else {
                        return;
                    }
                } else {
                    $(this).removeClass("layui-icon-circle");
                    $(this).addClass("layui-icon-ok-circle");
                    item.isActive = true;
                }
                if ($(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length <= 1) {// 没有对比词时对比模式禁用
                    $("#" + moduleCache.tabElementId + " li:last").addClass("wxr-tab-disabled");
                } else {
                    $("#" + moduleCache.tabElementId + " li:last").removeClass("wxr-tab-disabled");
                }
                var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0});
                // transformData();
                setTimeout(function () {
                    transformData();
                    drawIndexCards();
                    renderChart();
                    renderTable(loading);
                }, 100);
            });
            // 图片加载不成功则显示默认图片
            singleShopDom.find("img").on("error", function () {
                $(this).attr("src", "//img.alicdn.com/tps/TB1P1W_LXXXXXXoXVXXXXXXXXXX-74-74.png_48x48.jpg");
            });
            $(".wxr-dialog-sidebar-inner>ul").append(singleShopDom);
        });
        var searchInputDom = $(".wxr-dialog-sidebar-inner>ul .wxr-side-bar-search-input"),
            inputCompletedFlag = true;
        searchInputDom.on("compositionstart", function () {
            inputCompletedFlag = false;
        });
        searchInputDom.on("compositionend", function () {
            inputCompletedFlag = true;
        });
        searchInputDom.on("input propertychange", function () {
            setTimeout(function () {
                var searchText = searchInputDom.val();
                if (inputCompletedFlag) {
                    if (!searchText) {
                        $(".wxr-dialog-sidebar-inner>ul .shop-display-item").show();
                        return;
                    }
                    $(".wxr-dialog-sidebar-inner>ul .shop-display-item").hide();
                    $(".wxr-dialog-sidebar-inner>ul li[id*=" + searchText + "]").show();
                }
            }, 10);
        });
    }

    function drawIndexCards() {
        // 已选中的指标块初始化
        moduleCache.activeIndexCards = {};
        $(".wxr-cards-container").html("");
        // var sortedIndexCards = assembleIndexCards();
        // 计算每个小块宽度的百分比
        var cardItemWrapperPercent = (100 / moduleCache.sortedIndexCards.length).toFixed(4);
        // 舍去最后一位，防止宽度超出
        cardItemWrapperPercent = cardItemWrapperPercent.substring(0, cardItemWrapperPercent.length - 2);
        $(".wxr-cards-container").css({width: "96%", padding: "0px 35px"});
        // for (var i in moduleCache.firstLevelCategoryArray) {
        $.each(moduleCache.sortedIndexCards, function (index, indexItem) {
            var cardItemWrapper = $("<div class='wxr-card-item-wrapper' style='width: " +
                cardItemWrapperPercent + "%'></div>"),
                // cardItemBody = $("<div class='wxr-card-item-body wxr-card-item-body-solid'><i class='layui-icon layui-icon-ok-circle wxr-card-item-body-icon'></i></div>");
                cardItemBody = $("<div class='wxr-card-item-body wxr-card-item-body-solid'></div>");
            cardItemWrapper.append(cardItemBody);
            if (indexItem.isActive) {
                cardItemBody.addClass("wxr-card-item-body-active");
                cardItemBody.find(".wxr-card-item-body-icon").addClass("wxr-card-item-body-icon-checked");
                moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
            }
            // 填充内容
            var bodyContent = $("<ul><li class='wxr-card-item-body-title'><div class='wxr-text-ellipsis' title='" + indexItem.indexName + "'>" + indexItem.indexName + "</div><div class='wxr-text-ellipsis'>汇总</div></li>" +
                // "<li class='wxr-card-item-body-data' style='font-size: 18px;line-height: 20px;color: #0C0C0C'><div class='wxr-text-ellipsis'>" + indexItem.indexValue + "</div></li>" +
                // "<li class='wxr-card-item-body-data' style='font-size: 12px'><div class='wxr-text-ellipsis'>" + indexItem.compareText + "</div><div class='wxr-text-ellipsis'>" + indexItem.indexCycleCrc + "<i class='" + indexItem.cycleCrcIconClassName + "'></i></div></li>" +
                "</ul>");
            $.each(moduleCache.data.hasSelectedShops, function(shopIndex, shopItem) {
                if (shopItem.isActive) {
                    bodyContent.append("<li class='wxr-card-item-body-data'><div class='wxr-text-ellipsis' title='" + shopItem.alias + "'>" + shopItem.alias + "</div><div class='wxr-text-ellipsis'>" + shopItem[indexItem.indexCode + "_total"] + (indexItem.isPercentValue ? "%" : "") + "</div></li>");
                }
            });
            bodyContent.find("li").each(function (index, item) {
                $(this).css({margin: "4px 0px"});
                if ($(this).find("div").length == 2) {
                    $(this).find("div:first-child").css({width: "40%"});
                    $(this).find("div:nth-child(2)").css({width: "60%", textAlign: "right"});
                }
            });
            // bodyContent.find(".wxr-card-item-body-data").css({color: "#ffffff"});
            cardItemBody.append(bodyContent);
            $(".wxr-cards-container").append(cardItemWrapper);
            // 点击事件绑定
            cardItemBody.on("click", function () {
                var activeShopCount = $(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length;
                // $(".wxr-cards-container .wxr-card-item-body").removeClass("wxr-card-item-body-active");
                if (activeShopCount > 1) {// 每次只能选中一个指标
                    $(".wxr-cards-container .wxr-card-item-body-active").removeClass("wxr-card-item-body-active");
                    $(".wxr-cards-container .layui-icon-ok-circle").removeClass("wxr-card-item-body-icon-checked");
                    $(this).addClass("wxr-card-item-body-active");
                    $(this).find(".layui-icon-ok-circle").addClass("wxr-card-item-body-icon-checked");
                    moduleCache.activeIndexCards = {};
                    moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                } else {// 可选中多个指标
                    if ($(this).hasClass("wxr-card-item-body-active")) {
                        if ($(".wxr-cards-container .wxr-card-item-body-active").length > 1) {
                            $(this).removeClass("wxr-card-item-body-active");
                            cardItemBody.find(".layui-icon-ok-circle").removeClass("wxr-card-item-body-icon-checked");
                            delete moduleCache.activeIndexCards[indexItem.indexCode];
                        }
                    } else {
                        $(this).addClass("wxr-card-item-body-active");
                        cardItemBody.find(".layui-icon-ok-circle").addClass("wxr-card-item-body-icon-checked");
                        moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                    }
                }
                renderChart();
            });
        });
    }

    function renderChart() {
        var thisChart = echarts.init($("#" + moduleCache.chartElementId + "")[0]),
            xAxisData = moduleCache.dateTimes, seriesDataArray = [], count = 0, interval = 1;
        if (moduleCache.urlParams.dateType == "day" || moduleCache.urlParams.dateType == "recent7" || moduleCache.urlParams.dateType == "recent30") {
            interval = 3;
        }
        var activeShopCount = $(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length, colorArray = [];
        if (activeShopCount > 1) {
            count = 1;
            for (var i in moduleCache.data.hasSelectedShops) {
                var shopItem = moduleCache.data.hasSelectedShops[i];
                if (!shopItem.isActive) {
                    continue;
                }
                // 当前选中的指标code，只能选中一个
                var activeIndexCode = Object.keys(moduleCache.activeIndexCards)[0],
                    seriesObj = {
                        name: shopItem.alias,
                        type: 'line',
                        data: shopItem.transformTrendData[activeIndexCode],
                        smooth: true,
                        symbol: "circle",
                        showSymbol: false,
                        symbolSize: 6
                    };
                seriesDataArray.push(seriesObj);
                colorArray.push(shopItem.backgroundColor);
            }

        } else {
            var activeShop;
            $.each(moduleCache.data.hasSelectedShops, function (index, shopItem) {
                if (shopItem.isActive) {
                    activeShop = shopItem;
                    return false;
                }
            });
            for (var indexCode in moduleCache.activeIndexCards) {
                var activeCardItem = moduleCache.activeIndexCards[indexCode], seriesObj = {
                    name: activeCardItem.indexName,
                    type: 'line',
                    data: activeShop.transformTrendData[indexCode],
                    smooth: true,
                    symbol: "circle",
                    showSymbol: false,
                    symbolSize: 6,
                    yAxisIndex: count
                };
                seriesDataArray.push(seriesObj);
                count++;
            }
        }
        var chartOptions = {
            xAxis: {
                type: 'category',
                axisLabel: {
                    interval: interval
                },
                axisLine: {},
                data: xAxisData,
            },
            series: seriesDataArray
        };
        if (activeShopCount > 1) {
            chartOptions.color = colorArray;
        }
        commonModule.renderLineCharts(chartOptions, thisChart, count);
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(loading, layero) {
        var activeTableModel = $("#" + moduleCache.tabElementId + " .layui-this").attr("value"),
            cols, tableData = [];
        if (activeTableModel == "merge") {
            cols = [[
                {
                    field: 'shopName', title: "店铺名称", minWidth: 220, sort: true, templet: function (row) {
                        // return "<img src='" + row.shop.pictureUrl + "'/><span>" + row.shopName + "</span>";
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='" + row.shopPic + "'/><span>" +
                            "<a href='" + row.shopUrl + "' target='_blank' title='" + row.shopName + "'>" + row.shopName + "</a></span></div>";
                    }
                },
                {
                    field: "type", title: "类别", sort: true, minWidth: 120, templet: function (row) {
                        return "<span class='wxr-text-color-block' style='background: " + row.backgroundColor + "'>" + row.type + "</span>";
                    }
                },
                {field: "dateTime", title: "日期", sort: true, minWidth: 120},
                {field: "tradeIndex", title: "交易金额", minWidth: 110, sort: true},
                {field: "uvIndex", title: "访客人数", minWidth: 110, sort: true},
                {field: "payByrCntIndex", title: "支付人数", minWidth: 110, sort: true},
                {field: "payRateIndex", title: "支付转化率", minWidth: 110, sort: true, isPercentValue: true},
                {field: "perTicketSales", title: "客单价", minWidth: 110, sort: true},
                {field: "uvValue", title: "uv价值", minWidth: 110, sort: true}
            ]];
            tableData = moduleCache.data.mergeData;
        } else {
            cols = [[], []];
            cols[0].push({field: "dateTime", title: "日期", minWidth: 110, sort: true, rowspan: 2});
            for (var i in moduleCache.data.hasSelectedShops) {
                var shopItem = moduleCache.data.hasSelectedShops[i];
                if (shopItem.isActive) {
                    cols[0].push({title: "<div style='display: inline-block'><img class='wxr-image-box wxr-image-box-36' src='" +
                            shopItem.pictureUrl + "'/></div><div style='display: inline-block;vertical-align: middle'><ul><li><a href='" + shopItem.shopUrl + "' title='" + shopItem.title + "'>" + shopItem.title +
                            "</a></li><li>" + shopItem.userId + "</li></ul></div><div style='float: right'><span class='wxr-text-color-block' style='background: " + shopItem.backgroundColor + "'>" + shopItem.alias +
                            "</span></div>", colspan: 6, field: "colspan_" + shopItem.userId});
                    cols[1].push.apply(cols[1], [
                        {field: "tradeIndex_" + shopItem.userId, title: "交易金额", minWidth: 100, sort: true},
                        {field: "uvIndex_" + shopItem.userId, title: "访客人数", minWidth: 100, sort: true},
                        {field: "payByrCntIndex_" + shopItem.userId, title: "支付人数", minWidth: 100, sort: true},
                        {field: "payRateIndex_" + shopItem.userId, title: "支付转化率", minWidth: 110, sort: true, isPercentValue: true},
                        {field: "perTicketSales_" + shopItem.userId, title: "客单价", minWidth: 90, sort: true},
                        {field: "uvValue_" + shopItem.userId, title: "uv价值", minWidth: 90, sort: true}
                    ]);
                }
            }
            tableData = moduleCache.data.compareData;
        }
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: tableData,
            height: '600',
            cols: cols,
            layFilter: moduleCache.tableLayId + "LayFilter",
            done: function () {
                if (loading) {
                    layui.layer.close(loading);
                }
                if (activeTableModel == "compare") {
                    var currentTableDom = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']"), colorArray = commonModule.getChartColors();
                    $.each(moduleCache.data.hasSelectedShops, function (index, item) {
                        if (item.isActive) {
                            currentTableDom.find("th[data-field*='_" + item.userId + "']").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                            currentTableDom.find("td[data-field*='_" + item.userId + "']").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                        }
                    });
                }
                $(".wxr-tool-dialog-content-wrapper .wxr-dialog-sidebar").css({height: $(".wxr-tool-dialog-content-wrapper .wxr-dialog-main").height()});
            },
            initSort: {
                field: 'dateTime',
                type: "desc"
            }
        };
        if (activeTableModel == "compare") {
            renderTableOptions.skin = "";
        }
        commonModule.renderTable(renderTableOptions, layero);
    }

    return {
        init: function () {
            var targetDom = $("#drainRecognition .op-mc-rival-trend-analysis-info"),
                buttons = [
                    {btnName: "叶飞测试一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "append", buttons, false, function (targetDom) {
                var buttonInjectContainer = targetDom.parent().find(".wxr-tool-buttons-inject-container");
                buttonInjectContainer.find(".wxr-tool-name-container").remove();
                buttonInjectContainer.find(".layui-btn").eq(0).css({height: "32px", width: "140px"});
                buttonInjectContainer.css({margin: "17px 10px 0px 0px"});
            });
            // 第一次页面打开时做个标记，记住这个统计时间
            if ($(".ebase-FaCommonFilter__top .ebase-FaCommonFilter__item-date .page-first-open-flag").length == 0) {
                // 获取统计时间
                moduleCache.statisticEndTimeStr = $(".ebase-FaCommonFilter__right .oui-date-picker-current-date").text().replace("统计时间 ", "");
                $(".ebase-FaCommonFilter__top .ebase-FaCommonFilter__item-date").append("<span class='page-first-open-flag'></span>");
            }
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  竞争-竞店分析-关键指标对比
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var shopAnalysisCoreIndexCompareModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "竞店识别 | 关键指标对比",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        // mergeData: {},// 年龄-性别与年龄-城市数据的合并
        data: {
            hasSelectedShops: [],// 曾经选择过的店铺
            mergeData: [],
            compareData: [],
            // activeShops: {} // 被选中的店铺
        },// 表格展示需要的数据
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "shop-analysis-core-index-compare-table", //table的dom控件的id属性
        tableLayId: "shopAnalysisCoreIndexCompareTable", //table在layui中定义的id，即lay-ui属性
        tabElementId: "shop-analysis-core-index-compare-tab",
        chartElementId: "shop-analysis-core-index-compare-trend-chart",
        statisticEndTimeStr: "",
        sortedIndexCards: [
            {indexCode: "tradeIndex", indexName: "交易金额", isActive: true},
            {indexCode: "uvIndex", indexName: "访客人数"},
            {indexCode: "payByrCntIndex", indexName: "支付人数"},
            {indexCode: "payRateIndex", indexName: "支付转化率", isPercentValue: true},
            {indexCode: "perTicketSales", indexName: "客单价"},
            {indexCode: "seIpvUvHits", indexName: "搜索人数"},
            {indexCode: "cltHits", indexName: "收藏人数"},
            {indexCode: "cartHits", indexName: "加购人数"},
            {indexCode: "uvValue", indexName: "uv价值"},
            {indexCode: "seIpvUvHitsRate", indexName: "搜索占比"},
            {indexCode: "cltRate", indexName: "收藏率"},
            {indexCode: "cartRate", indexName: "加购率"},
            {indexCode: "prePayAmtIndex", indexName: "预售定金"},
            {indexCode: "prePayItmCnt", indexName: "预售支付商品件数"},
            {indexCode: "fstOnsItmCnt", indexName: "上新商品数"}
        ]
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + statisticsTimeText + " | "
                + $("#shopAnalysisSelect").next().find(".oui-card-header-wrapper .ant-select-selection-selected-value").text();
        var dialogWidth;
        var dialogOptions = {
            title: dialogTitle,
            area: ['98%', '98%'],
            // offset: "100px",
            content: "<div class='wxr-dialog-sidebar'><div class='wxr-dialog-sidebar-inner'><ul></ul></div></div><div class='wxr-dialog-main'>" +
                "<div id='wxr-dialog-side-button'><i class='layui-icon layui-icon-spread-left' title='展开'></i></div>" +
                "<div class='wxr-cards-container'></div>" +
                "<div class='wxr-charts-container' id='" + moduleCache.chartElementId + "'></div>" +
                "<div id='" + moduleCache.tabElementId + "' class='layui-tab layui-tab-brief' lay-filter='tabLayFilter'><ul class='layui-tab-title'><li class='layui-this' value='merge'>合并模式</li><li value='compare'>对比模式</li></ul></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div></div>",
            success: function (layero, index) {
                var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0});
                setTimeout(function () {
                    try {
                        sideButtonEventBind();
                        drawDialogPageLeft();
                        drawIndexCards();
                        renderTabs();
                        renderChart();
                        renderTable(loading, layero);
                    } catch (e) {
                        layui.layer.close(loading);
                    }
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    function sideButtonEventBind() {
        $("#wxr-dialog-side-button .layui-icon").on("click", function () {
            if ($(this).hasClass("layui-icon-spread-left")) {
                $(this).removeClass("layui-icon-spread-left");
                $(this).addClass("layui-icon-shrink-right");
                $(this).attr("title", "折叠");
                // $(".dialog-sidebar").show(500, function () {
                //     $(".dialog-main").css({paddingLeft: "240px"});
                // });
                $(".wxr-dialog-sidebar").animate({
                    width: '260px', opacity: 'show'
                }, 500, function () {
                    $(".wxr-dialog-main").css({paddingLeft: "260px"});
                    $("#wxr-dialog-side-button").css({paddingLeft: "270px"});
                    var chartInstance = echarts.getInstanceByDom($("#" + moduleCache.chartElementId)[0]);
                    if (chartInstance) {
                        chartInstance.resize();
                    }
                    layui.table.resize(moduleCache.tableLayId);
                });
            } else if ($(this).hasClass("layui-icon-shrink-right")) {
                $(this).removeClass("layui-icon-shrink-right");
                $(this).addClass("layui-icon-spread-left");
                $(this).attr("title", "展开");
                // $(".dialog-sidebar").hide(500, function () {
                //     $(".dialog-main").css({paddingLeft: "0px"});
                // });
                $(".wxr-dialog-sidebar").animate({
                    width: '0px', opacity: 'hide'
                }, 500, function () {
                    $(".wxr-dialog-main").css({paddingLeft: "0"});
                    $("#wxr-dialog-side-button").css({paddingLeft: "10px"});
                    var chartInstance = echarts.getInstanceByDom($("#" + moduleCache.chartElementId)[0]);
                    if (chartInstance) {
                        chartInstance.resize();
                    }
                    layui.table.resize(moduleCache.tableLayId);
                });
            }

        });
        // $("#wxr-dialog-side-button .layui-icon").trigger("click");
    }

    function renderTabs() {
        $("#" + moduleCache.tabElementId).css({padding: "5px 0px"});
        if ($(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length <= 1) {// 没有对比词时对比模式禁用
            $("#" + moduleCache.tabElementId + " li:last").addClass("wxr-tab-disabled");
        }
        layui.element.on("tab(tabLayFilter)", function () {
            renderTable();
        });
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 首先获取所有的竞店列表，由于该列表中不包含本店信息，需要自己组装本店信息，并保存到集合中
        var rivalShopsCacheKey = globalUrlPrefix + "/mc/ci/config/rival/shop/getMonitoredListExcludeGreatShop.json?firstCateId=" +
            moduleCache.urlParams.cateId + "&rivalType=shop",
            rivalShopsCacheData = commonModule.getUsableOriginalJsonDataFromCache(rivalShopsCacheKey, false),
            // 保存竞店的临时集合，包含本店
            rivalShops = {};
        // 找到数据后进行格式转化，以userId为key来保存，方便后面使用
        if (rivalShopsCacheData) {
            for (var i in rivalShopsCacheData) {
                var shopItem = rivalShopsCacheData[i];
                rivalShops[shopItem.userId] = shopItem;
            }
        }
        // 组装本店信息
        var selfShopInfo = commonModule.getShopUserInfo(), selfShopPic = $("#shopAnalysisSelect .sycm-common-select-wrapper .sycm-common-select-selected-image-wrapper img").eq(0).attr("src"),
            selfShopItem = {userId: selfShopInfo.mainUserId, name: selfShopInfo.storeName, picUrl: selfShopPic, alias: "本店"};
        rivalShops[selfShopInfo.mainUserId] = selfShopItem;
        // 开始组装趋势数据，对于实时数据，需要找到唯一的缓存key，其他时间类型的数据可以在缓存中根据userId来直接覆盖
        var rivalShop1Name = $("#shopAnalysisSelect .sycm-common-select-wrapper .alife-dt-card-sycm-common-select").eq(1).find(".sycm-common-select-selected-title").attr("title"),
            rivalShop2Name = $("#shopAnalysisSelect .sycm-common-select-wrapper .alife-dt-card-sycm-common-select").eq(2).find(".sycm-common-select-selected-title").attr("title"),
            rivalUser1Id, rivalUser2Id, trendDataCacheKeyPrefix = getTrendCacheKeyPrefix(), trendCacheData;
        // 根据名称找到竞店1和竞店2的id
        for (var key in rivalShops) {
            if (rivalShops[key].name == rivalShop1Name) {
                rivalUser1Id = rivalShops[key].userId;
            }
            if (rivalShops[key].name == rivalShop2Name) {
                rivalUser2Id = rivalShops[key].userId;
            }
        }
        if (moduleCache.urlParams.dateType == "today") {
            var trendCacheKey = trendDataCacheKeyPrefix + "&selfUserId=" + selfShopItem.userId;
            if (rivalUser1Id) {
                trendCacheKey += "&rivalUser1Id=" + rivalUser1Id;
            }
            if (rivalUser2Id) {
                trendCacheKey += "&rivalUser2Id=" + rivalUser2Id;
            }
            trendCacheData = commonModule.getUsableOriginalJsonDataFromCache(trendCacheKey, true);
            if (trendCacheData) {
                trendCacheData = trendCacheData.data;
            }
            parseTrendData(rivalShops, trendCacheKey, trendCacheData);
        } else {
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key.slice(0, trendDataCacheKeyPrefix.length) == trendDataCacheKeyPrefix) {
                    trendCacheData = commonModule.getUsableOriginalJsonDataFromCache(key, true);
                    parseTrendData(rivalShops, key, trendCacheData);
                }
            }
        }
        // 将店铺按照一定顺序存入集合
        var colorArray = commonModule.getChartColors().hex, shopTypeIndex = 3;
        moduleCache.data.hasSelectedShops = [];
        selfShopItem.isActive = true;
        selfShopItem.alias = "本店";
        selfShopItem.backgroundColor = colorArray[0 % colorArray.length];
        selfShopItem.typeIndex = 0;
        moduleCache.data.hasSelectedShops.push(selfShopItem);
        if (rivalUser1Id) {
            rivalShops[rivalUser1Id].isActive = true;
            rivalShops[rivalUser1Id].backgroundColor = colorArray[1 % colorArray.length];
            rivalShops[rivalUser1Id].alias = "竞店1";
            rivalShops[rivalUser1Id].typeIndex = 1;
            moduleCache.data.hasSelectedShops.push(rivalShops[rivalUser1Id]);
        }
        if (rivalUser2Id) {
            rivalShops[rivalUser2Id].isActive = true;
            rivalShops[rivalUser2Id].backgroundColor = colorArray[2 % colorArray.length];
            rivalShops[rivalUser2Id].alias = "竞店2";
            rivalShops[rivalUser2Id].typeIndex = 2;
            moduleCache.data.hasSelectedShops.push(rivalShops[rivalUser2Id]);
        }
        for (var key in rivalShops) {
            if (rivalShops[key].isSelected && !rivalShops[key].isActive) {
                rivalShops[key].backgroundColor = colorArray[shopTypeIndex  % colorArray.length];
                rivalShops[key].alias = "竞店" + shopTypeIndex;
                rivalShops[key].typeIndex = shopTypeIndex;
                moduleCache.data.hasSelectedShops.push(rivalShops[key]);
                shopTypeIndex++;
            }
        }
        transformData();
    }

    function parseTrendData(rivalShops, key, trendCacheData) {
        if (trendCacheData) {
            var params = commonModule.extractLocationParams(key);
            try {
                if (trendCacheData.selfShop) {
                    rivalShops[params.selfUserId].trendData = trendCacheData.selfShop;
                    rivalShops[params.selfUserId].isActive = true;
                }
                if (trendCacheData.rivalShop1) {
                    rivalShops[params.rivalUser1Id].trendData = trendCacheData.rivalShop1;
                    rivalShops[params.rivalUser1Id].isSelected = true;
                }
                if (trendCacheData.rivalShop2) {
                    rivalShops[params.rivalUser2Id].trendData = trendCacheData.rivalShop2;
                    rivalShops[params.rivalUser2Id].isSelected = true;
                }
            } catch (e) {

            }
        }
    }

    /**
     * @Author xuyefei
     * @Description  趋势数据的缓存key前缀
     * @Date 10:48 2020/11/11
     * @Param
     * @return
     **/
    function getTrendCacheKeyPrefix() {
        var deviceText = $("#shopAnalysisSelect").next().find(".oui-card-header-wrapper .ant-select-selection-selected-value").text(),
            deviceCode, activeTypeText = $("#shopAnalysisSelect").next().find(".oui-card-switch-item-active").text(), shopType,
            cacheKeyPrefix = globalUrlPrefix + "/mc/rivalShop/analysis";
        if (deviceText == "所有终端") {
            deviceCode = 0;
        } else if (deviceText == "PC端") {
            deviceCode = 1;
        } else if (deviceText == "无线端") {
            deviceCode = 2;
        }
        if (activeTypeText == "类目") {
            shopType = -1;
        }
        if (moduleCache.urlParams.dateType == "today") {
            if (shopType == -1) {
                cacheKeyPrefix += "/getLiveCateTrend.json?";
            } else {
                cacheKeyPrefix += "/getLiveCoreTrend.json?";
            }
        } else {
            if (shopType == -1) {
                cacheKeyPrefix += "/getCateTrend.json?shopType=-1";
            } else {
                cacheKeyPrefix += "/getCoreTrend.json?";
            }
        }
        if (!/\?$/.test(cacheKeyPrefix)) {// 不是以问号结尾
            cacheKeyPrefix += "&";
        }
        cacheKeyPrefix += "dateType=" + moduleCache.urlParams.dateType + "&dateRange=" + moduleCache.urlParams.dateRange + "&indexCode=&device=" +
            deviceCode + "&cateId=" + moduleCache.urlParams.cateId;
        return cacheKeyPrefix;
    }

    function transformData() {
        if (moduleCache.data.hasSelectedShops.length == 0) {
            return;
        }
        var trendDataLength = moduleCache.data.hasSelectedShops[0].trendData.tradeIndex.length, endTimeStr;
        if (moduleCache.urlParams.dateType == "today") {
            endTimeStr = "today";
        } else {
            endTimeStr = moduleCache.urlParams.dateRange.split("|")[1];
        }
        moduleCache.dateTimes = commonModule.generateStatisticTimes(trendDataLength, endTimeStr, moduleCache.urlParams.dateType);
        moduleCache.data.mergeData = [], moduleCache.data.compareData = [];
        var chartHexColors = commonModule.getChartColors().hex;
        for (var j = 0; j < trendDataLength; j++) {
            var compareDataItem = {dateTime: moduleCache.dateTimes[j]};
            $.each(moduleCache.data.hasSelectedShops, function (index, item) {
                // if (item.isDataTransformCompleted) {
                //     return true;
                // }
                if (j == 0) {// 第一次要重新初始化店铺相关数据
                    // 为每个店铺准备一个已转化的趋势数据集合
                    item.transformTrendData = {};
                    // 每个店铺单独存储一份自己店铺的合并数据
                    item.mergeData = [];
                }
                if (!item.isActive) {
                    return true;
                }
                var trendData = item.trendData, mergeDataItem = {
                    shopName: item.name,
                    type: item.alias,
                    shopPic: item.picUrl,
                    dateTime: moduleCache.dateTimes[j],
                    userId: item.userId,
                    typeIndex: index,
                    shopUrl: item.linkUrl,
                    backgroundColor: item.backgroundColor
                };
                // 对店铺趋势数据中原有的指标的当前循环索引进行转换
                for (var indexCode in trendData) {
                    var indexValue = trendData[indexCode][j];
                    if (indexCode != "payRateIndex") {
                        if (indexCode == "fstOnsItmCnt" || indexCode == "prePayItmCnt") {// 无需转换的指标

                        } else if (indexCode == "cltByrCntIndex") {// 收藏人数
                            indexCode = "cltHits";
                            indexValue = commonModule.calculateFormula(indexValue, 1, 0);
                        } else if (indexCode == "pvIndex") {// 访客人数
                            indexCode = "uvIndex";
                            indexValue = commonModule.calculateFormula(indexValue, 1, 0);
                        } else {
                            indexValue = commonModule.calculateFormula(indexValue, 1, 0);
                        }
                    } else {
                        indexValue = commonModule.calculateFormula(indexValue, 0, 8);
                    }
                    if (!item.transformTrendData[indexCode]) {
                        item.transformTrendData[indexCode] = [];
                    }
                    item.transformTrendData[indexCode].push(indexValue);
                    if (indexValue != null) {// 所有的指标如果有一个存在有效值，则设置有效标记，没有有效值标记的对象将不会放入merge和compare集合
                        mergeDataItem.isEffective = true;
                        compareDataItem.isEffective = true;
                    }
                    mergeDataItem[indexCode] = indexValue;
                    compareDataItem[indexCode + "_" + item.userId] = indexValue;
                }
                // 原有的指标转化完毕之后，计算其他指标
                // uv价值
                if (!item.transformTrendData.uvValue) {
                    item.transformTrendData.uvValue = [];
                }
                if (mergeDataItem.tradeIndex == null && mergeDataItem.uvIndex == null) {
                    mergeDataItem.uvValue = null;
                } else {
                    mergeDataItem.uvValue = !mergeDataItem.uvIndex ? 0 : Number((mergeDataItem.tradeIndex / mergeDataItem.uvIndex).toFixed(2));
                }
                compareDataItem["uvValue_" + item.userId] = mergeDataItem.uvValue;
                item.transformTrendData.uvValue.push(mergeDataItem.uvValue);
                // 客单价
                if (!item.transformTrendData.perTicketSales) {
                    item.transformTrendData.perTicketSales = [];
                }
                if (mergeDataItem.tradeIndex == null && mergeDataItem.payByrCntIndex == null) {
                    mergeDataItem.perTicketSales = null;
                } else {
                    mergeDataItem.perTicketSales = !mergeDataItem.payByrCntIndex ? 0 : Number((mergeDataItem.tradeIndex / mergeDataItem.payByrCntIndex).toFixed(2));
                }
                compareDataItem["perTicketSales_" + item.userId] = mergeDataItem.perTicketSales;
                item.transformTrendData.perTicketSales.push(mergeDataItem.perTicketSales);
                // 搜索占比
                if (!item.transformTrendData.seIpvUvHitsRate) {
                    item.transformTrendData.seIpvUvHitsRate = [];
                }
                if (mergeDataItem.seIpvUvHits == null && mergeDataItem.uvIndex == null) {
                    mergeDataItem.seIpvUvHitsRate = null;
                } else {
                    mergeDataItem.seIpvUvHitsRate = !mergeDataItem.uvIndex ? 0 : Number((mergeDataItem.seIpvUvHits / mergeDataItem.uvIndex * 100).toFixed(2));
                }
                compareDataItem["seIpvUvHitsRate_" + item.userId] = mergeDataItem.seIpvUvHitsRate;
                item.transformTrendData.seIpvUvHitsRate.push(mergeDataItem.seIpvUvHitsRate);
                // 收藏率
                if (!item.transformTrendData.cltRate) {
                    item.transformTrendData.cltRate = [];
                }
                if (mergeDataItem.cltHits == null && mergeDataItem.uvIndex == null) {
                    mergeDataItem.cltRate = null;
                } else {
                    mergeDataItem.cltRate = !mergeDataItem.uvIndex ? 0 : Number((mergeDataItem.cltHits / mergeDataItem.uvIndex * 100).toFixed(2));
                }
                compareDataItem["cltRate_" + item.userId] = mergeDataItem.cltRate;
                item.transformTrendData.cltRate.push(mergeDataItem.cltRate);
                // 加购率
                if (!item.transformTrendData.cartRate) {
                    item.transformTrendData.cartRate = [];
                }
                if (mergeDataItem.cartHits == null && mergeDataItem.uvIndex == null) {
                    mergeDataItem.cartRate = null;
                } else {
                    mergeDataItem.cartRate = !mergeDataItem.uvIndex ? 0 : Number((mergeDataItem.cartHits / mergeDataItem.uvIndex * 100).toFixed(2));
                }
                compareDataItem["cartRate_" + item.userId] = mergeDataItem.cartRate;
                item.transformTrendData.cartRate.push(mergeDataItem.cartRate);
                item.mergeData.push(mergeDataItem);
                if (mergeDataItem.isEffective) {
                    moduleCache.data.mergeData.push(mergeDataItem);
                }
                // 店铺的所有指标数据已转化完毕，汇总一下数据
                // if (j == trendDataLength - 1) {
                //     for (var indexCode in item.transformTrendData) {
                //         item[indexCode + "_total"] = eval(item.transformTrendData[indexCode].join("+"));
                //     }
                //     // 除了交易金额、访客人数、支付人数之外，支付转化率、uv价值以及客单价都需要按月份数据汇总之后重新计算
                //     item["payRateIndex_total"] = !item["uvIndex_total"] ? 0 : Number((item["payByrCntIndex_total"] / item["uvIndex_total"] * 100).toFixed(2));
                //     item["uvValue_total"] = !item["uvIndex_total"] ? 0 : Number((item["tradeIndex_total"] / item["uvIndex_total"]).toFixed(2));
                //     item["perTicketSales_total"] = !item["payByrCntIndex_total"] ? 0 : Number((item["tradeIndex_total"] / item["payByrCntIndex_total"]).toFixed(2));
                //     item.isDataTransformCompleted = true;
                // }
            });
            if (compareDataItem.isEffective) {
                moduleCache.data.compareData.push(compareDataItem);
            }
        }
    }

    function drawDialogPageLeft() {
        var searchShopInputDom = "<li><div style='position:relative;'><input class='wxr-side-bar-search-input layui-input' style='padding: 0px 10px 0px 30px' placeholder='搜索名称'><i class='layui-icon layui-icon-search' style='color: #1E9FFF;position: absolute;top: 10px;left: 8px;font-size: 16px'></i></div></li>";
        $(".wxr-dialog-sidebar-inner>ul").append(searchShopInputDom);
        $.each(moduleCache.data.hasSelectedShops, function (index, item) {
            // $("#wxr-side-bar-filter-selector select").append("<option value='" + item.userId + "'>" + item.name + "</option>");
            var singleShopDom = $("<li id='" + item.name + "' class='shop-display-item'><div style='display: inline-block;'><img class='wxr-image-box wxr-image-box-36' src='" + item.picUrl + "'/></div>" +
                "<div style='display: inline-block; vertical-align: middle;width: 70%'><ul><li style='padding-bottom: 5px'>" +
                "<a href='//" + item.linkUrl + "' target='_blank' title='" + item.name + "'>" + item.name + "</a></li>" +
                "<li><span class='wxr-text-color-block'>" + item.alias +
                "</span></li></ul></div><i class='layui-icon layui-icon-circle' style='width: 15%'></i></li>");
            if (item.isActive) {
                singleShopDom.find(".layui-icon").removeClass("layui-icon-circle");
                singleShopDom.find(".layui-icon").addClass("layui-icon-ok-circle");
                // moduleCache.data.activeShops[item.userId] = item;
            }
            singleShopDom.find(".wxr-text-color-block").css({backgroundColor: item.backgroundColor});
            singleShopDom.find(".layui-icon").on("click", function () {
                if ($(this).hasClass("layui-icon-ok-circle")) {
                    if ($(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length > 1) {
                        $(this).removeClass("layui-icon-ok-circle");
                        $(this).addClass("layui-icon-circle");
                        item.isActive = false;
                    } else {
                        return;
                    }
                } else {
                    $(this).removeClass("layui-icon-circle");
                    $(this).addClass("layui-icon-ok-circle");
                    item.isActive = true;
                }
                if ($(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length <= 1) {
                    $("#" + moduleCache.tabElementId + " li:last").addClass("wxr-tab-disabled");
                } else {
                    $("#" + moduleCache.tabElementId + " li:last").removeClass("wxr-tab-disabled");
                }
                var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0});
                // transformData();
                setTimeout(function () {
                    transformData();
                    // drawIndexCards();
                    renderChart();
                    renderTable(loading);
                }, 100);
            });
            // 图片加载不成功则显示默认图片
            singleShopDom.find("img").on("error", function () {
                $(this).attr("src", "//img.alicdn.com/tps/TB1P1W_LXXXXXXoXVXXXXXXXXXX-74-74.png_48x48.jpg");
            });
            $(".wxr-dialog-sidebar-inner>ul").append(singleShopDom);
        });
        var searchInputDom = $(".wxr-dialog-sidebar-inner>ul .wxr-side-bar-search-input"),
            inputCompletedFlag = true;
        searchInputDom.on("compositionstart", function () {
            inputCompletedFlag = false;
        });
        searchInputDom.on("compositionend", function () {
            inputCompletedFlag = true;
        });
        searchInputDom.on("input propertychange", function () {
            setTimeout(function () {
                var searchText = searchInputDom.val();
                if (inputCompletedFlag) {
                    if (!searchText) {
                        $(".wxr-dialog-sidebar-inner>ul .shop-display-item").show();
                        return;
                    }
                    $(".wxr-dialog-sidebar-inner>ul .shop-display-item").hide();
                    $(".wxr-dialog-sidebar-inner>ul li[id*=" + searchText + "]").show();
                }
            }, 10);
        });
    }

    function drawIndexCards() {
        // 已选中的指标块初始化
        moduleCache.activeIndexCards = {};
        $(".wxr-cards-container").html("");
        // var sortedIndexCards = assembleIndexCards();
        // 计算每个小块宽度的百分比
        var cardItemWrapperPercent = (100 / moduleCache.sortedIndexCards.length).toFixed(4);
        // 舍去最后一位，防止宽度超出
        cardItemWrapperPercent = cardItemWrapperPercent.substring(0, cardItemWrapperPercent.length - 2);
        $(".wxr-cards-container").css({width: "96%", padding: "0px 35px"});
        // for (var i in moduleCache.firstLevelCategoryArray) {
        // var activeIndexCode = $("#shopAnalysisSelect").next().find(".alife-one-design-sycm-indexes-trend-index-item-selectable.active .oui-index-cell").attr("value");
        // if (activeIndexCode == "pvIndex") {
        //     activeIndexCode = "uvIndex";
        // } else if (activeIndexCode == "cltByrCntIndex") {
        //     activeIndexCode = "cltHits";
        // }
        $.each(moduleCache.sortedIndexCards, function (index, indexItem) {
            var cardItemWrapper = $("<div class='wxr-card-item-wrapper' style='width: " +
                cardItemWrapperPercent + "%'></div>"),
                // cardItemBody = $("<div class='wxr-card-item-body wxr-card-item-body-solid'><i class='layui-icon layui-icon-ok-circle wxr-card-item-body-icon'></i></div>");
                cardItemBody = $("<div class='wxr-card-item-body wxr-card-item-body-solid' style='text-align: center; white-space: nowrap;overflow: hidden;text-overflow: ellipsis'></div>");
            cardItemWrapper.append(cardItemBody);
            if (indexItem.isActive) {
                // indexItem.isActive = true;
                cardItemBody.addClass("wxr-card-item-body-active");
                cardItemBody.find(".wxr-card-item-body-icon").addClass("wxr-card-item-body-icon-checked");
                moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
            }
            // 填充内容
            // var bodyContent = $("<ul><li class='wxr-card-item-body-title'><div class='wxr-text-ellipsis' title='" + indexItem.indexName + "'>" + indexItem.indexName + "</div></li>" +
            //     // "<li class='wxr-card-item-body-data' style='font-size: 18px;line-height: 20px;color: #0C0C0C'><div class='wxr-text-ellipsis'>" + indexItem.indexValue + "</div></li>" +
            //     // "<li class='wxr-card-item-body-data' style='font-size: 12px'><div class='wxr-text-ellipsis'>" + indexItem.compareText + "</div><div class='wxr-text-ellipsis'>" + indexItem.indexCycleCrc + "<i class='" + indexItem.cycleCrcIconClassName + "'></i></div></li>" +
            //     "</ul>");
            var bodyContent = $("<span title='" + indexItem.indexName + "'>" + indexItem.indexName + "</span>");
            // $.each(moduleCache.data.hasSelectedShops, function(shopIndex, shopItem) {
            //     if (shopItem.isActive) {
            //         bodyContent.append("<li class='wxr-card-item-body-data'><div class='wxr-text-ellipsis' title='" + shopItem.alias + "'>" + shopItem.alias + "</div><div class='wxr-text-ellipsis'>" + shopItem[indexItem.indexCode + "_total"] + (indexItem.isPercentValue ? "%" : "") + "</div></li>");
            //     }
            // });
            // bodyContent.find("li").each(function (index, item) {
            //     $(this).css({margin: "4px 0px"});
            //     if ($(this).find("div").length == 2) {
            //         $(this).find("div:first-child").css({width: "40%"});
            //         $(this).find("div:nth-child(2)").css({width: "60%", textAlign: "right"});
            //     }
            // });
            // bodyContent.find(".wxr-card-item-body-data").css({color: "#ffffff"});
            cardItemBody.append(bodyContent);
            $(".wxr-cards-container").append(cardItemWrapper);
            // 点击事件绑定
            cardItemBody.on("click", function () {
                var activeShopCount = $(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length;
                // $(".wxr-cards-container .wxr-card-item-body").removeClass("wxr-card-item-body-active");
                if (activeShopCount > 1) {// 每次只能选中一个指标
                    $(".wxr-cards-container .wxr-card-item-body-active").removeClass("wxr-card-item-body-active");
                    $(".wxr-cards-container .layui-icon-ok-circle").removeClass("wxr-card-item-body-icon-checked");
                    $(this).addClass("wxr-card-item-body-active");
                    $(this).find(".layui-icon-ok-circle").addClass("wxr-card-item-body-icon-checked");
                    moduleCache.activeIndexCards = {};
                    moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                } else {// 可选中多个指标
                    if ($(this).hasClass("wxr-card-item-body-active")) {
                        if ($(".wxr-cards-container .wxr-card-item-body-active").length > 1) {
                            $(this).removeClass("wxr-card-item-body-active");
                            cardItemBody.find(".layui-icon-ok-circle").removeClass("wxr-card-item-body-icon-checked");
                            delete moduleCache.activeIndexCards[indexItem.indexCode];
                        }
                    } else {
                        $(this).addClass("wxr-card-item-body-active");
                        cardItemBody.find(".layui-icon-ok-circle").addClass("wxr-card-item-body-icon-checked");
                        moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                    }
                }
                renderChart();
            });
        });
    }

    function renderChart() {
        var thisChart = echarts.init($("#" + moduleCache.chartElementId + "")[0]),
            xAxisData = moduleCache.dateTimes, seriesDataArray = [], count = 0, interval = 1;
        if (moduleCache.urlParams.dateType == "day" || moduleCache.urlParams.dateType == "recent7" || moduleCache.urlParams.dateType == "recent30") {
            interval = 3;
        }
        var activeShopCount = $(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length, colorArray = [];
        if (activeShopCount > 1) {
            // count = 1;
            for (var i in moduleCache.data.hasSelectedShops) {
                var shopItem = moduleCache.data.hasSelectedShops[i];
                if (!shopItem.isActive) {
                    continue;
                }
                // 当前选中的指标code，只能选中一个
                var activeIndexCode = Object.keys(moduleCache.activeIndexCards)[0],
                    seriesObj = {
                        name: shopItem.alias + "(" + moduleCache.activeIndexCards[activeIndexCode].indexName + ")",
                        type: 'line',
                        data: shopItem.transformTrendData[activeIndexCode],
                        smooth: true,
                        symbol: "circle",
                        showSymbol: false,
                        symbolSize: 6
                    };
                seriesDataArray.push(seriesObj);
                colorArray.push(shopItem.backgroundColor);
                // count++;
            }

        } else {
            var activeShop;
            $.each(moduleCache.data.hasSelectedShops, function (index, shopItem) {
                if (shopItem.isActive) {
                    activeShop = shopItem;
                    return false;
                }
            });
            for (var indexCode in moduleCache.activeIndexCards) {
                var activeCardItem = moduleCache.activeIndexCards[indexCode], seriesObj = {
                    name: activeCardItem.indexName,
                    type: 'line',
                    data: activeShop.transformTrendData[indexCode],
                    smooth: true,
                    symbol: "circle",
                    showSymbol: false,
                    symbolSize: 6,
                    yAxisIndex: count
                };
                seriesDataArray.push(seriesObj);
                count++;
            }
        }
        var chartOptions = {
            xAxis: {
                type: 'category',
                axisLabel: {
                    interval: interval
                },
                axisLine: {},
                data: xAxisData,
            },
            series: seriesDataArray
        };
        if (activeShopCount > 1) {
            chartOptions.color = colorArray;
        }
        commonModule.renderLineCharts(chartOptions, thisChart, count);
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(loading, layero) {
        var activeTableModel = $("#" + moduleCache.tabElementId + " .layui-this").attr("value"),
            heightGap = ($(window).height() * 0.02 + 260 + 104 + 50 + 44).toFixed(0),
            cols, tableData = [];
        if (activeTableModel == "merge") {
            cols = [[
                {
                    field: 'shopName', title: "店铺名称", minWidth: 160, sort: true, templet: function (row) {
                        // return "<img src='" + row.shop.pictureUrl + "'/><span>" + row.shopName + "</span>";
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='" + row.shopPic + "'/><span>" +
                            "<a href='//" + row.shopUrl + "' target='_blank' title='" + row.shopName + "'>" + row.shopName + "</a></span></div>";
                    }
                },
                {
                    field: "type", title: "类别", sort: true, minWidth: 100, templet: function (row) {
                        return "<span class='wxr-text-color-block' style='background: " + row.backgroundColor + "'>" + row.type + "</span>";
                    }
                },
                {field: "dateTime", title: "日期", sort: true, minWidth: 110},
                {field: "tradeIndex", title: "交易金额", minWidth: 90, sort: true},
                {field: "uvIndex", title: "访客人数", minWidth: 90, sort: true},
                {field: "payByrCntIndex", title: "支付人数", minWidth: 90, sort: true},
                {field: "payRateIndex", title: "支付转化率", minWidth: 100, sort: true, isPercentValue: true},
                {field: "perTicketSales", title: "客单价", minWidth: 70, sort: true},
                {field: "seIpvUvHits", title: "搜索人数", minWidth: 90, sort: true},
                {field: "cltHits", title: "收藏人数", minWidth: 90, sort: true},
                {field: "cartHits", title: "加购人数", minWidth: 90, sort: true},
                {field: "uvValue", title: "uv价值", minWidth: 70, sort: true},
                {field: "seIpvUvHitsRate", title: "搜索占比", minWidth: 90, sort: true, isPercentValue: true},
                {field: "cltRate", title: "收藏率", minWidth: 80, sort: true, isPercentValue: true},
                {field: "cartRate", title: "加购率", minWidth: 80, sort: true, isPercentValue: true},
                {field: "prePayAmtIndex", title: "预售定金", minWidth: 90, sort: true},
                {field: "prePayItmCnt", title: "预售支付商品件数", minWidth: 130, sort: true},
                {field: "fstOnsItmCnt", title: "上新商品数", minWidth: 100, sort: true}
            ]];
            tableData = moduleCache.data.mergeData;
        } else {
            cols = [[], []];
            cols[0].push({field: "dateTime", title: "日期", minWidth: 110, sort: true, rowspan: 2});
            for (var i in moduleCache.data.hasSelectedShops) {
                var shopItem = moduleCache.data.hasSelectedShops[i];
                if (shopItem.isActive) {
                    cols[0].push({title: "<div style='display: inline-block'><img class='wxr-image-box wxr-image-box-36' src='" +
                            shopItem.picUrl + "'/></div><div style='display: inline-block;vertical-align: middle'><ul><li><a href='//" + shopItem.linkUrl + "' target='_blank' title='" + shopItem.name + "'>" + shopItem.name +
                            "</a></li><li>" + shopItem.userId + "</li></ul></div><div style='float: right'><span class='wxr-text-color-block' style='background: " + shopItem.backgroundColor + "'>" + shopItem.alias +
                            "</span></div>", colspan: 15, field: "colspan_" + shopItem.userId});
                    cols[1].push.apply(cols[1], [
                        {field: "tradeIndex_" + shopItem.userId, title: "交易金额", minWidth: 100, sort: true},
                        {field: "uvIndex_" + shopItem.userId, title: "访客人数", minWidth: 100, sort: true},
                        {field: "payByrCntIndex_" + shopItem.userId, title: "支付人数", minWidth: 100, sort: true},
                        {field: "payRateIndex_" + shopItem.userId, title: "支付转化率", minWidth: 110, sort: true, isPercentValue: true},
                        {field: "perTicketSales_" + shopItem.userId, title: "客单价", minWidth: 90, sort: true},
                        {field: "seIpvUvHits_" + shopItem.userId, title: "搜索人数", minWidth: 90, sort: true},
                        {field: "cltHits_" + shopItem.userId, title: "收藏人数", minWidth: 90, sort: true},
                        {field: "cartHits_" + shopItem.userId, title: "加购人数", minWidth: 90, sort: true},
                        {field: "uvValue_" + shopItem.userId, title: "uv价值", minWidth: 90, sort: true},
                        {field: "seIpvUvHitsRate_" + shopItem.userId, title: "搜索占比", minWidth: 90, sort: true, isPercentValue: true},
                        {field: "cltRate_" + shopItem.userId, title: "收藏率", minWidth: 80, sort: true, isPercentValue: true},
                        {field: "cartRate_" + shopItem.userId, title: "加购率", minWidth: 80, sort: true, isPercentValue: true},
                        {field: "prePayAmtIndex_" + shopItem.userId, title: "预售定金", minWidth: 90, sort: true},
                        {field: "prePayItmCnt_" + shopItem.userId, title: "预售支付商品件数", minWidth: 130, sort: true},
                        {field: "fstOnsItmCnt_" + shopItem.userId, title: "上新商品数", minWidth: 100, sort: true}
                    ]);
                }
            }
            tableData = moduleCache.data.compareData;
        }
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: tableData,
            height: 'full-' + heightGap,
            cols: cols,
            layFilter: moduleCache.tableLayId + "LayFilter",
            done: function () {
                if (loading) {
                    layui.layer.close(loading);
                }
                var currentTableDom = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']"),
                    colorArray = commonModule.getChartColors();
                currentTableDom.find(".layui-table-body td").css({padding: "5px 0px"});
                currentTableDom.find(".layui-table-cell").css({padding: "0px 5px"});
                if (activeTableModel == "compare") {
                    $.each(moduleCache.data.hasSelectedShops, function (index, item) {
                        if (item.isActive) {
                            currentTableDom.find("th[data-field*='_" + item.userId + "']").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                            currentTableDom.find("td[data-field*='_" + item.userId + "']").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                        }
                    });
                }
                $(".wxr-tool-dialog-content-wrapper .wxr-dialog-sidebar").css({height: $(".wxr-tool-dialog-content-wrapper .wxr-dialog-main").height()});
            },
            initSort: {
                field: 'dateTime',
                type: "desc"
            }
        };
        if (activeTableModel == "compare") {
            renderTableOptions.skin = "";
        }
        commonModule.renderTable(renderTableOptions, layero);
    }

    return {
        init: function () {
            var targetDom = $("#shopAnalysisSelect").next().find(".oui-card-header-item.oui-card-header-item-pull-right"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "after", buttons, true, function (targetDom) {

            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  监控商品
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var ciItemMonitorModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "监控商品 | 竞品列表",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        tableData: {
            pages: {},
            total: []
        }, // 弹出框的表格需要的数据
        localCacheKey: "", // 组装好的localStorage的缓存key
        maxPageNo: 1, // 分页的最大值
        tableElementId: "ci-item-monitor-table", //table的dom控件的id属性
        tableLayId: "ciItemMonitorTable" //table在layui中定义的id，即lay-ui属性
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存数据
        assembleCacheData();
        // 转换指数
        transformData();
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogOptions = {
            title: dialogTitle,
            area: ['96%', '80%'],
            // offset: "100px",
            content: "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                renderTable(layero);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        var localCacheKey = globalUrlPrefix + "/mc";
        if (moduleCache.urlParams.dateType == "today") {
            localCacheKey += "/live";
        }
        localCacheKey += "/ci/item/monitor/list.json?";
        if (moduleCache.urlParams.dateType != "today") {
            var type = "all", tabText = $("#completeItem .oui-card-header-item.oui-card-header-item-pull-left .oui-tab-switch-item-active").text();
            if (tabText.indexOf("全部监控商品") != -1) {
                type = "all";
            } else if (tabText.indexOf("排名增长") != -1) {
                type = "rankIncrease";
            }  else if (tabText.indexOf("交易突增") != -1) {
                type = "tradeIncrease";
            } else if (tabText.indexOf("流量突增") != -1) {
                type = "flowIncrease";
            }
            localCacheKey += "type=" + type;
        }
        if (localCacheKey.indexOf("?", localCacheKey.length - 1) == -1) {// 不是以问号结尾，要加上&
            localCacheKey += "&";
        }
        localCacheKey += "dateRange=" + moduleCache.urlParams.dateRange + "&dateType=" + moduleCache.urlParams.dateType;
        var cacheKeyPageAndSortParams = commonModule.getCachePageAndSortParams($("#mqItemMonitor"));
        moduleCache.maxPageNo = cacheKeyPageAndSortParams.maxPageNo;
        moduleCache.currentPageNo = cacheKeyPageAndSortParams.pageNo;
        localCacheKey += "&pageSize=" + cacheKeyPageAndSortParams.pageSize + "&page=" + cacheKeyPageAndSortParams.pageNo +
            "&order=" + cacheKeyPageAndSortParams.order + "&orderBy=" + cacheKeyPageAndSortParams.orderBy +
            "&device=" + moduleCache.urlParams.device + "&cateId=" + moduleCache.urlParams.cateId +
            "&sellerType=" + moduleCache.urlParams.sellerType + "&indexCode=" + cacheKeyPageAndSortParams.indexCode;
        // 遍历localStorage，获取所有页的缓存，注意初次找到相关缓存是需要对分页数据和汇总数据的集合进行初始化
        var count = 0;
        for (var i = 1; i <= moduleCache.maxPageNo; i++) {
            var pageCacheUrl = localCacheKey.replace(/&page=\S+&order=/, "&page=" + i + "&order="),
                decodeJsonData = commonModule.getUsableOriginalJsonDataFromCache(pageCacheUrl, true);
            if (decodeJsonData) {
                count++;
                if (count == 1) {// 初次找到相关缓存
                    moduleCache.tableData.pages = {}, moduleCache.tableData.total = [];
                }
                var finalData = decodeJsonData.data;
                if (moduleCache.urlParams.dateType == "today") {
                    finalData = decodeJsonData.data.data;
                }
                moduleCache.tableData.pages[i] = finalData;
                moduleCache.tableData.total.push.apply(moduleCache.tableData.total, finalData);
            }
        }
        transformData();
    }


    function transformData() {
        var willTransformData = moduleCache.tableData.total;
        for (var i in willTransformData) {
            var data = willTransformData[i];
            commonModule.indexCodeValueTransform(data);
            data.cateRankIdValue = data.cateRankId ? (data.cateRankId.value ? Number(data.cateRankId.value) : 0) : 0;
        }
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var heightGap = ($(window).height() * 0.2 + 104).toFixed(0),
        cols = [[
            {
                field: "name", title: "商品名称", minWidth: 250, templet: function (row) {
                    var compareText = "";
                    if (moduleCache.urlParams.dateType != "today") {
                        compareText = "--" + commonModule.getCompareText(moduleCache.urlParams.dateType);
                    }
                    return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' style='float: left' src='" + row.item.pictUrl + "'/>" +
                        "<ul><li><a title='" + row.item.title + "' target='_blank' href='" + row.item.detailUrl + "'>" + row.item.title + "</a>\n</li><li class='wxr-font-light-color'>" + row.shop.title + compareText + "\n</li></ul></div>";
                    // return "<div style='display: flex'><div><img class='image-box image-box-36' src='" + row.item.pictUrl + "'></div><div><div style='overflow: hidden;text-overflow: ellipsis'>" + row.item.title + "</div><div>" + row.shop.title + "</div></div></div>"
                }
            },
            {
                field: "cateRankIdValue", title: "行业排名", minWidth: 110, sort: true, templet: function (row) {
                    var cateRankIdValue, cateRankIdCycleCqc, className = "wxr-font-small-normal-color";
                    if (row.cateRankId) {
                        if (row.cateRankId.value != null && row.cateRankId.value != undefined) {
                            cateRankIdValue = row.cateRankId.value;
                        } else {
                            cateRankIdValue = "-";
                        }
                        if (row.cateRankId.cycleCqc != null && row.cateRankId.cycleCqc != undefined) {
                            cateRankIdCycleCqc = row.cateRankId.cycleCqc;
                        } else {
                            cateRankIdCycleCqc = "-";
                        }
                    } else {
                        cateRankIdValue = "-", cateRankIdCycleCqc = "-";
                    }
                    if (cateRankIdCycleCqc < 0) {
                        className = "wxr-font-small-red-color";
                        cateRankIdCycleCqc = "升" + Math.abs(cateRankIdCycleCqc) + "名";
                    } else if (cateRankIdCycleCqc > 0) {
                        className = "wxr-font-small-green-color";
                        cateRankIdCycleCqc = "降" + cateRankIdCycleCqc + "名";
                    } else if (cateRankIdCycleCqc == 0) {
                        cateRankIdCycleCqc = "持平";
                    }
                    return "<ul><li>" + cateRankIdValue + "\n</li><li class='" + className + "'>" + cateRankIdCycleCqc + "\n</li></ul>";
                }
            },
            {field: "tradeIndexValue", title: "交易金额", minWidth: 110, sort: true, templet: function (row) {
                    if (moduleCache.urlParams.dateType != "today") {
                        var cycleCrc = row.tradeIndex.cycleCrc;
                        if (cycleCrc) {
                            cycleCrc = (row.tradeIndex.cycleCrc * 100).toFixed(2) + "%";
                        } else {
                            cycleCrc = "-";
                        }
                        return "<ul><li>" + (!row.tradeIndexValue ? "-" : row.tradeIndexValue) + "\n</li><li class='wxr-table-increase-percent-text'>" + cycleCrc + "\n</li></ul>";
                    } else {
                        return (!row.tradeIndexValue ? "-" : row.tradeIndexValue);
                    }
                }},
            {field: "uvIndexValue", title: "访客人数", minWidth: 110, sort: true, templet: function (row) {
                    if (moduleCache.urlParams.dateType != "today") {
                        var cycleCrc = row.uvIndex.cycleCrc;
                        if (cycleCrc) {
                            cycleCrc = (row.uvIndex.cycleCrc * 100).toFixed(2) + "%";
                        } else {
                            cycleCrc = "-";
                        }
                        return "<ul><li>" + (!row.uvIndexValue ? "-" : row.uvIndexValue) + "\n</li><li class='wxr-table-increase-percent-text'>" + cycleCrc + "\n</li></ul>";
                    } else {
                        return (!row.uvIndexValue ? "-" : row.uvIndexValue);
                    }
                }},
            {field: "seIpvUvHitsValue", title: "搜索人数", minWidth: 110, sort: true, templet: function (row) {
                    if (moduleCache.urlParams.dateType != "today") {
                        var cycleCrc = row.seIpvUvHits.cycleCrc;
                        if (cycleCrc) {
                            cycleCrc = (row.seIpvUvHits.cycleCrc * 100).toFixed(2) + "%";
                        } else {
                            cycleCrc = "-";
                        }
                        return "<ul><li>" + (!row.seIpvUvHitsValue ? "-" : row.seIpvUvHitsValue) + "\n</li><li class='wxr-table-increase-percent-text'>" + cycleCrc + "\n</li></ul>";
                    } else {
                        return (!row.seIpvUvHitsValue ? "-" : row.seIpvUvHitsValue);
                    }
                }},
            {field: "cltHitsValue", title: "收藏人数", minWidth: 110, sort: true, templet: function (row) {
                    if (moduleCache.urlParams.dateType != "today") {
                        var cycleCrc = row.cltHits.cycleCrc;
                        if (cycleCrc) {
                            cycleCrc = (row.cltHits.cycleCrc * 100).toFixed(2) + "%";
                        } else {
                            cycleCrc = "-";
                        }
                        return "<ul><li>" + (!row.cltHitsValue ? "-" : row.cltHitsValue) + "\n</li><li class='wxr-table-increase-percent-text'>" + cycleCrc + "\n</li></ul>";
                    } else {
                        return (!row.cltHitsValue ? "-" : row.cltHitsValue);
                    }
                }},
            {field: "cartHitsValue", title: "加购人数", minWidth: 110, sort: true, templet: function (row) {
                    if (moduleCache.urlParams.dateType != "today") {
                        var cycleCrc = row.cartHits.cycleCrc;
                        if (cycleCrc) {
                            cycleCrc = (row.cartHits.cycleCrc * 100).toFixed(2) + "%";
                        } else {
                            cycleCrc = "-";
                        }
                        return "<ul><li>" + (!row.cartHitsValue ? "-" : row.cartHitsValue) + "\n</li><li class='wxr-table-increase-percent-text'>" + cycleCrc + "\n</li></ul>";
                    } else {
                        return (!row.cartHitsValue ? "-" : row.cartHitsValue);
                    }
                }},
            {field: "payRateIndexValue", title: "支付转化率", minWidth: 130, sort: true, isPercentValue: true, templet: function (row) {
                    if (moduleCache.urlParams.dateType != "today") {
                        var cycleCrc = row.payRateIndex.cycleCrc;
                        if (cycleCrc) {
                            cycleCrc = (row.payRateIndex.cycleCrc * 100).toFixed(2) + "%";
                        } else {
                            cycleCrc = "-";
                        }
                        return "<ul><li>" + (!row.payRateIndexValue ? "-" : row.payRateIndexValue.toFixed(2) + "%") + "\n</li><li class='wxr-table-increase-percent-text'>" + cycleCrc + "\n</li></ul>";
                    } else {
                        return (!row.payRateIndexValue ? "-" : row.payRateIndexValue.toFixed(2) + "%");
                    }
                }},
            {field: "payByrCnt", title: "支付人数", minWidth: 110, sort: true},
            {field: "payItemCntValue", title: "支付件数", minWidth: 110, sort: true},
            {field: "perTicketSales", title: "客单价", minWidth: 110, sort: true},
            {field: "uvValue", title: "uv价值", minWidth: 110, sort: true},
            {field: "seIpvUvHitsRate", title: "搜素占比", minWidth: 110, sort: true, isPercentValue: true},
            {field: "cltCntRate", title: "收藏率", minWidth: 110, sort: true, isPercentValue: true},
            {field: "addCartRate", title: "加购率", minWidth: 110, sort: true, isPercentValue: true}
        ]];
        // console.log(moduleCache.tableData[moduleCache.activeTabCode].total);
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: moduleCache.tableData.total,
            height: 'full-' + heightGap,
            // showSearchInput: false,// 扩展字段
            cols: cols,
            done: function () {
                if (moduleCache.maxPageNo > 1) {
                    drawCachePageBar(heightGap, cols);
                }
            }
        };
        var inst = commonModule.renderTable(renderTableOptions, layero);
    }

    function drawCachePageBar(heightGap, cols) {
        $(".wxr-table-bottom-page-number-bar").append("<div id='selfPageBar'></div>");
        layui.laypage.render({
            elem: "selfPageBar",
            // prev: "&#8592",
            // next: "&#8594",
            layout: ['page'],
            curr: moduleCache.currentPageNo,
            limit: 10,
            count: moduleCache.maxPageNo * 10,
            // limits: [5, 10, 20, 50, 100],
            jump: function (obj, first) {
                // 页码添加未缓存标志
                $("#selfPageBar .layui-laypage a").each(function (index) {
                    var className = $(this).attr("class"), pageNo = $(this).text();
                    if (className && (className.indexOf("layui-laypage-prev") != -1 ||
                        className.indexOf("layui-laypage-next") != -1)) {
                        return true;
                    }
                    var pageData = moduleCache.tableData.pages[pageNo];
                    if (!pageData) {
                        // $(this).css({"opacity": "0.5", "filter":"alpha(opacity=50)", "background":"gray", "color":"#fff"});
                        $(this).css("position", "relative");
                        $(this).append("<i class='layui-badge-dot' style='position: absolute;top:4px;right: 2px'></i>");
                    }
                });
                if (!first) {
                    // 同步点击生意参谋页面的第几页按钮
                    $("#mqItemMonitor .alife-dt-card-common-table-pagination-wrapper .ant-pagination-item")
                        .each(function (index) {
                            if ($(this).text() == obj.curr) {
                                $(this).trigger("click");
                                var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0}), count = 0;
                                function myTimer() {
                                    var timer = setTimeout(function () {
                                        assembleCacheData();
                                        if (!moduleCache.tableData.pages[String(obj.curr)]) {
                                            count++;
                                            if (count > 40) {
                                                layui.layer.msg('数据获取超时', {
                                                    offset: 't',
                                                    anim: 6
                                                });
                                                layui.layer.close(loading);
                                                return;
                                            }
                                            myTimer();
                                        } else {
                                            renderTable();
                                            layui.layer.close(loading);
                                        }
                                    }, 500);
                                }
                                myTimer();
                            }
                        });
                }
            }
        });
    }

    return {
        init: function () {
            var targetDom = $("#completeItem .oui-card-header-item.oui-card-header-item-pull-right").eq(0),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "after", buttons, true, function () {

            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  竞品识别
 * @Date 20:11 2020/11/4
 * @Param
 * @return
 **/
var ciItemRecognitionModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "竞品识别",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        tableData: {
            custom: [],
            search: []
        }, // 弹出框的表格需要的数据
        localCacheKey: "", // 组装好的localStorage的缓存key
        maxPageNo: 1, // 分页的最大值
        tableElementId: "ci-item-monitor-table", //table的dom控件的id属性
        tableLayId: "ciItemMonitorTable" //table在layui中定义的id，即lay-ui属性
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存数据
        assembleCacheData();
        // 转换指数
        // transformData();
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            activeTabName = $(".ebase-FaCommonFilter__bottom .oui-tab-switch-item-active").text(),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + activeTabName + " | "
                + $(".ebase-FaCommonFilter__top .oui-date-picker-current-date").eq(0).text();
        var dialogOptions = {
            title: dialogTitle,
            area: ['96%', '80%'],
            // offset: "100px",
            content: "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                renderTable(layero);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        var activeTabName = $(".ebase-FaCommonFilter__bottom .oui-tab-switch-item-active").text(), localCacheKey;
        if (moduleCache.urlParams.activeKey == "custom") {
            localCacheKey = globalUrlPrefix + "/mc/ci/item/recognition/getCrmDrainList.json?";
        } else {
            localCacheKey = globalUrlPrefix + "/mc/ci/item/recognition/getSeDrainList.json?"
        }
        localCacheKey += "dateRange=" + moduleCache.urlParams.dateRange + "&dateType=" + moduleCache.urlParams.dateType;
        var cacheKeyPageAndSortParams = commonModule.getCachePageAndSortParams($("#itemRecognition"));
        localCacheKey += "&pageSize=" + cacheKeyPageAndSortParams.pageSize + "&page=" + cacheKeyPageAndSortParams.pageNo +
            "&order=" + cacheKeyPageAndSortParams.order + "&orderBy=" + cacheKeyPageAndSortParams.orderBy +
            "&cateId=" + moduleCache.urlParams.cateId + "&indexCode=" + cacheKeyPageAndSortParams.indexCode;
        var cacheData = commonModule.getUsableOriginalJsonDataFromCache(localCacheKey, true);
        if (cacheData) {
            moduleCache.tableData[moduleCache.urlParams.activeKey] = cacheData.data;
        }
        // transformData();
    }


    // function transformData() {
    //     var willTransformData = moduleCache.tableData;
    //     for (var i in willTransformData) {
    //         var data = willTransformData[i];
    //         // 收藏后流失人数
    //         data.cltLosByrCntValue
    //     }
    // }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var heightGap = ($(window).height() * 0.2 + 104).toFixed(0),
            cols = [[
                {
                    field: "name", title: "商品名称", minWidth: 250, templet: function (row) {
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='" + row.item.pictUrl + "'/>" +
                            "<span><a title='" + row.item.title + "' target='_blank' href='" + row.item.detailUrl + "'>" + row.item.title + "</a></span></div>";
                        // return "<div style='display: flex'><div><img class='image-box image-box-36' src='" + row.item.pictUrl + "'></div><div><div style='overflow: hidden;text-overflow: ellipsis'>" + row.item.title + "</div><div>" + row.shop.title + "</div></div></div>"
                    }
                },
                {
                    field: "payLostAmt", title: "流失金额", minWidth: 110, sort: true, templet: function (row) {
                        return row.payLostAmt.value.toFixed(2);
                    }
                },
                {field: "losByrCnt", title: "流失人数", minWidth: 110, sort: true, templet: function (row) {
                        return row.losByrCnt.value;
                    }},
                {field: "losRate", title: "流失率", minWidth: 110, sort: true, templet: function (row) {
                        return (row.losRate.value * 100).toFixed(2) + "%";
                    }},
                {field: "cltLosByrCnt", title: "收藏后流失人数", minWidth: 130, sort: true, templet: function (row) {
                        return row.cltLosByrCnt.value;
                    }},
                {field: "cartLosByrCnt", title: "加购后流失人数", minWidth: 110, sort: true, templet: function (row) {
                        return row.cartLosByrCnt.value;
                    }},
                {field: "cartHitsValue", title: "收藏后跳失人数", minWidth: 110, sort: true, templet: function (row) {
                        return row.cltJmpByrCnt.value;
                    }},
                {field: "payRateIndexValue", title: "加购后跳失人数", minWidth: 130, sort: true, templet: function (row) {
                        return row.cartJmpByrCnt.value;
                    }},
                {field: "directLosCnt", title: "直接跳失人数", minWidth: 110, sort: true, templet: function (row) {
                        return row.directLosCnt.value;
                    }},
                {field: "losItmCnt", title: "引起流失的商品数", minWidth: 110, sort: true, templet: function (row) {
                    return row.losItmCnt.value;
                    }},
                {field: "losShopCnt", title: "引起流失的店铺数", minWidth: 110, sort: true, templet: function (row) {
                    return row.losShopCnt.value;
                    }}
            ]];
        // console.log(moduleCache.tableData[moduleCache.activeTabCode].total);
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: moduleCache.tableData[moduleCache.urlParams.activeKey],
            height: 'full-' + heightGap,
            // showSearchInput: false,// 扩展字段
            cols: cols,
            done: function () {
                // if (moduleCache.maxPageNo > 1) {
                //     drawCachePageBar(heightGap, cols);
                // }
            }
        };
        var inst = commonModule.renderTable(renderTableOptions,layero);
    }

    // function drawCachePageBar(heightGap, cols) {
    //     $(".wxr-table-bottom-page-number-bar").append("<div id='selfPageBar'></div>");
    //     layui.laypage.render({
    //         elem: "selfPageBar",
    //         // prev: "&#8592",
    //         // next: "&#8594",
    //         layout: ['page'],
    //         curr: moduleCache.currentPageNo,
    //         limit: 10,
    //         count: moduleCache.maxPageNo * 10,
    //         // limits: [5, 10, 20, 50, 100],
    //         jump: function (obj, first) {
    //             // 页码添加未缓存标志
    //             $("#selfPageBar .layui-laypage a").each(function (index) {
    //                 var className = $(this).attr("class"), pageNo = $(this).text();
    //                 if (className && (className.indexOf("layui-laypage-prev") != -1 ||
    //                     className.indexOf("layui-laypage-next") != -1)) {
    //                     return true;
    //                 }
    //                 var pageData = moduleCache.tableData.pages[pageNo];
    //                 if (!pageData) {
    //                     // $(this).css({"opacity": "0.5", "filter":"alpha(opacity=50)", "background":"gray", "color":"#fff"});
    //                     $(this).css("position", "relative");
    //                     $(this).append("<i class='layui-badge-dot' style='position: absolute;top:4px;right: 2px'></i>");
    //                 }
    //             });
    //             if (!first) {
    //                 // 同步点击生意参谋页面的第几页按钮
    //                 $("#mqItemMonitor .alife-dt-card-common-table-pagination-wrapper .ant-pagination-item")
    //                     .each(function (index) {
    //                         if ($(this).text() == obj.curr) {
    //                             $(this).trigger("click");
    //                             var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0}), count = 0;
    //                             function myTimer() {
    //                                 var timer = setTimeout(function () {
    //                                     assembleCacheData();
    //                                     if (!moduleCache.tableData.pages[String(obj.curr)]) {
    //                                         count++;
    //                                         if (count > 40) {
    //                                             layui.layer.msg('数据获取超时', {
    //                                                 offset: 't',
    //                                                 anim: 6
    //                                             });
    //                                             layui.layer.close(loading);
    //                                             return;
    //                                         }
    //                                         myTimer();
    //                                     } else {
    //                                         renderTable();
    //                                         layui.layer.close(loading);
    //                                     }
    //                                 }, 500);
    //                             }
    //                             myTimer();
    //                         }
    //                     });
    //             }
    //         }
    //     });
    // }

    return {
        init: function () {
            var targetDom = $(".ebase-FaCommonFilter__bottom .ebase-FaCommonFilter__right"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "after", buttons, true, function () {

            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  竞争-竞店分析-Top商品榜
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var rivalShopAnalysisTopItemsModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "竞店分析 | Top商品榜",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        data: [],
        activeIndexCards: {},
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "rival-shop-analysis-top-items-table", //table的dom控件的id属性
        tableLayId: "rivalShopAnalysisTopItemsTable", //table在layui中定义的id，即lay-ui属性
        tabElementId: "rival-shop-analysis-top-items-tab"
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogWidth;
        if (moduleCache.data.length <= 2) {
            dialogWidth = '80%';
        } else if (moduleCache.data.length == 3) {
            dialogWidth = '96%';
        }
        var dialogOptions = {
            title: dialogTitle,
            area: [dialogWidth, '90%'],
            // offset: "100px",
            content: "<div id='" + moduleCache.tabElementId + "' class='layui-tab layui-tab-brief' lay-filter='tabLayFilter'><ul class='layui-tab-title'><li class='layui-this' value='merge'>合并模式</li><li value='compare'>对比模式</li></ul></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                setTimeout(function () {
                    renderTabs();
                    renderTable(layero);
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    function renderTabs() {
        // moduleCache.tableShowModel = "shop";
        $("#rival-shop-analysis-top-items-tab").css({padding: "5px 0px"});
        if (moduleCache.data.length <= 1) {
            $("#" + moduleCache.tabElementId + " li:last").addClass("wxr-tab-disabled");
        }
        layui.element.on("tab(tabLayFilter)", function () {
            renderTable();
        });
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 先获取竞店列表，然后根据页面上选择的店铺的名称找到对应的userId
        var cacheKey = globalUrlPrefix + "/mc/ci/config/rival/shop/getMonitoredListExcludeGreatShop.json?firstCateId=" + moduleCache.urlParams.cateId + "&rivalType=shop",
            cacheData = commonModule.getUsableOriginalJsonDataFromCache(cacheKey, false), rivalShopList = [],
            deviceText = $("#shopAnalysisItems .oui-card-header-wrapper .ant-select-selection-selected-value").text(), deviceCode;
        if (deviceText == "所有终端") {
            deviceCode = 0;
        } else if (deviceText == "PC端") {
            deviceCode = 1;
        } else if (deviceText == "无线端") {
            deviceCode = 2;
        }
        var selfShopInfo = commonModule.getShopUserInfo();
        var selfShopItem = {userId: selfShopInfo.mainUserId, name: selfShopInfo.storeName};
        rivalShopList.push(selfShopItem);
        if (cacheData) {
            rivalShopList.push.apply(rivalShopList, cacheData);
        }
        moduleCache.data = [];
        $("#shopAnalysisSelect .sycm-common-select-wrapper .alife-dt-card-sycm-common-select").each(function (index, item) {
            var shopName = $(this).find(".sycm-common-select-selected-title").attr("title");
            if (shopName) {
                $.each(rivalShopList, function (i, shopItem) {
                    if (shopItem.name == shopName) {
                        shopItem.shopType = (index == 0 ? "本店" : ("竞店" + index));
                        shopItem.shopTypeColor = commonModule.getChartColors().hex[index];
                        moduleCache.data.push(shopItem);
                        // 拼接热销与流量数据的缓存key
                        var cacheKey = globalUrlPrefix + "/mc/rivalShop/analysis";
                        if (moduleCache.urlParams.dateType == "today") {
                            cacheKey += "/getLiveTopItems.json";
                        } else {
                            cacheKey += "/getTopItems.json";
                        }
                        cacheKey += "?dateRange=" + moduleCache.urlParams.dateRange + "&dateType=" + moduleCache.urlParams.dateType + "&pageSize=20&page=1";
                        var flowCacheKey = cacheKey + "&userId=" + shopItem.userId + "&topType=flow&device=" + deviceCode + "&cateId=" +
                            moduleCache.urlParams.cateId + "&indexCode=uvIndex",
                            tradeCacheKey = cacheKey + "&userId=" + shopItem.userId + "&topType=trade&device=" + deviceCode + "&cateId=" +
                                moduleCache.urlParams.cateId + "&indexCode=tradeIndex",
                            flowCacheData, tradeCacheData;
                        flowCacheData = commonModule.getUsableOriginalJsonDataFromCache(flowCacheKey, true);
                        shopItem.flowData = [];
                        if (flowCacheData) {
                            shopItem.flowData = moduleCache.urlParams.dateType == "today" ? flowCacheData.data : flowCacheData;
                        }
                        tradeCacheData = commonModule.getUsableOriginalJsonDataFromCache(tradeCacheKey, true);
                        shopItem.tradeData = [];
                        if (tradeCacheData) {
                            shopItem.tradeData = moduleCache.urlParams.dateType == "today" ? tradeCacheData.data : tradeCacheData;
                        }
                        return false;
                    }
                });
            }
        });
        transformData();
    }

    function transformData() {
        for (var m in moduleCache.data) {
            var shopItem = moduleCache.data[m], flowData = shopItem.flowData, tradeData = shopItem.tradeData, mergeData = [];
            // 合并流量数据和交易数据
            if (tradeData.length > 0) {
                for (var i in tradeData) {
                    var mergeItem = {}, tradeObj = tradeData[i];
                    mergeItem.name = tradeObj.item.title;
                    mergeItem.shopName = shopItem.name;
                    mergeItem.pictUrl = tradeObj.item.pictUrl;
                    mergeItem.detailUrl = tradeObj.item.detailUrl;
                    mergeItem.shopType = shopItem.shopType;
                    mergeItem.shopTypeColor = shopItem.shopTypeColor;
                    if (tradeObj.item.discountPrice) {
                        mergeItem.discountPrice = Number((tradeObj.item.discountPrice * 1).toFixed(2));
                    }
                    // 交易金额
                    mergeItem.tradeIndex = commonModule.calculateFormula(tradeObj.tradeIndex.value, 1, 0);
                    for (var j = flowData.length - 1; j >= 0; j--) {
                        var flowObj = flowData[j];
                        if (tradeObj.item.title == flowObj.item.title) {
                            mergeItem.uvIndex = commonModule.calculateFormula(flowObj.uvIndex.value, 1, 0);
                            flowData.splice(j, 1);
                            break;
                        }
                    }
                    mergeItem.uvValue = Number((mergeItem.tradeIndex / mergeItem.uvIndex).toFixed(2));
                    mergeData.push(mergeItem);
                }
                // 此时如果flowData中还留有数据则直接添加到合并的集合中
                flowDataToMerge(flowData, shopItem, mergeData);
            } else {
                flowDataToMerge(flowData, shopItem, mergeData);
            }
            shopItem.mergeData = mergeData;
        }
    }

    function flowDataToMerge(flowData, shopItem, mergeData) {
        for (var index in flowData) {
            var mergeItem = {}, flowObj = flowData[index];
            mergeItem.name = flowObj.item.title;
            mergeItem.shopName = shopItem.name;
            mergeItem.pictUrl = flowObj.item.pictUrl;
            mergeItem.detailUrl = flowObj.item.detailUrl;
            mergeItem.shopType = shopItem.shopType;
            mergeItem.shopTypeColor = shopItem.shopTypeColor;
            mergeItem.uvIndex = commonModule.calculateFormula(flowObj.uvIndex.value, 1, 0);
            if (flowObj.item.discountPrice) {
                mergeItem.discountPrice = Number((flowObj.item.discountPrice * 1).toFixed(2));
            }
            mergeData.push(mergeItem);
        }
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var activeTableModel = $("#" + moduleCache.tabElementId + " .layui-this").attr("value"),
            heightGap = ($(window).height() * 0.1 + 104 + 50).toFixed(0), cols, tableData = [];
        $("#" + moduleCache.tableElementId).html("");
        if (activeTableModel == "merge"){
            cols = [[
                {field: 'name', title: "商品", minWidth: 900, sort: true, templet: function (row) {
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' style='float: left' src='" + row.pictUrl    + "'/>" +
                            "<ul><li><a title='" + row.name + "' target='_blank' href='" + row.detailUrl + "'>" + row.name + "</a>\n</li><li class='wxr-font-light-color'>" + row.shopName + "\n</li></ul></div>";
                    }},
                {field: "shopType", title: "类别", minWidth: 120, sort: true, templet: function (row) {
                        return "<span class='wxr-text-color-block' style='background: " + row.shopTypeColor + "'>" + row.shopType + "</span>";
                    }},
                {field: "discountPrice", title: "一口价", minWidth: 110, sort: true},
                {field: "tradeIndex", title: "交易金额", minWidth: 110, sort: true},
                {field: "uvIndex", title: "访客人数", minWidth: 110, sort: true},
                {field: "uvValue", title: "uv价值", minWidth: 110, sort: true}
            ]];
            for (var i in moduleCache.data) {
                var shopItem = moduleCache.data[i], mergeData = shopItem.mergeData;
                tableData.push.apply(tableData, mergeData);
            }
            var renderTableOptions = {
                id: moduleCache.tableLayId,
                elem: "#" + moduleCache.tableElementId,
                data: tableData,
                height: 'full-' + heightGap,
                cols: cols,
                initSort: {
                    field: 'tradeIndex',
                    type: "desc"
                },
                done: function () {
                    $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "'] .layui-table-body td").css({padding: "4px 0px"});
                }
            };
            commonModule.renderTable(renderTableOptions);
        } else if (activeTableModel == "compare") {
            var mergeTable = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']");
            mergeTable.next(".wxr-table-bottom-info-bar").remove();
            mergeTable.remove();
            cols = [[
                {field: 'name', title: "商品", minWidth: 180, sort: true, templet: function (row) {
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' style='float: left' src='" + row.pictUrl    + "'/>" +
                            "<ul><li><a title='" + row.name + "' target='_blank' href='" + row.detailUrl + "'>" + row.name + "</a>\n</li><li class='wxr-font-light-color'>" + row.shopName + "\n</li></ul></div>";
                    }},
                // {field: "shopType", title: "类别", minWidth: 120, sort: true, templet: function (row) {
                //         return "<span class='wxr-text-color-block' style='background: " + row.shopTypeColor + "'>" + row.shopType + "</span>";
                //     }},
                {field: "discountPrice", title: "一口价", minWidth: 100, sort: true},
                {field: "tradeIndex", title: "交易金额", minWidth: 100, sort: true},
                {field: "uvIndex", title: "访客人数", minWidth: 100, sort: true},
                {field: "uvValue", title: "uv价值", minWidth: 100, sort: true}
            ]];
            var tableItemWidth = (100 / moduleCache.data.length).toFixed(4);
            tableItemWidth = tableItemWidth.substring(0, tableItemWidth.length - 2);
            //为每个店铺绘制表格
            $.each(moduleCache.data, function (index, item) {
                var tableItemWrapper = $("<div style='width: " +
                    tableItemWidth + "%; padding: 0px 5px;display: inline-block;position:relative;'><div id='rivalShop" + index + "'></div>" +
                    "<div style='position: absolute; left: 5px;top: 0px;z-index: 1000000000'><span class='wxr-text-color-block' style='background: " + item.shopTypeColor + "'>" + item.shopType + "</span></div></div>");
                $("#" + moduleCache.tableElementId).append(tableItemWrapper);
                var renderTableOptions = {
                    id: "rival-shop-table" + index,
                    elem: "#rivalShop" + index,
                    data: moduleCache.data[index].mergeData,
                    height: 'full-' + heightGap,
                    cols: cols,
                    initSort: {
                        field: 'tradeIndex',
                        type: "desc"
                    },
                    done: function () {
                        var currentTableDom = $(".layui-table-view[lay-id='rival-shop-table" + index + "']"),
                            colorArray = commonModule.getChartColors();
                        currentTableDom.find(".layui-table-body td").css({padding: "4px 0px"});
                        // currentTableDom.find(".layui-table-tool").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                        // currentTableDom.find(".layui-table-tool .wxr-tool-table-search-input").parent().hide();
                        currentTableDom.find("th").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                        currentTableDom.find("td").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                    }
                };
                commonModule.renderTable(renderTableOptions, layero);
            });
        }
    }

    return {
        init: function () {
            var targetDom = $("#shopAnalysisItems .oui-card-header-item.oui-card-header-item-pull-right"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "after", buttons, true, function (targetDom) {
                // $(".wxr-tool-buttons-inject-container").css("float", "none");
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  竞争-竞店分析-交易构成
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var rivalShopAnalysisTradeConstituteModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "竞店分析 | 交易构成",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        data: {
            shopData: [],
            mergeData: {
                cate: [],
                priceSeg: []
            },
            compareData: {
                cate: [],
                priceSeg: []
            }
        },
        activeIndexCards: {},
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "rival-shop-analysis-trade-constitute-table", //table的dom控件的id属性
        tableLayId: "rivalShopAnalysisTradeConstituteTable", //table在layui中定义的id，即lay-ui属性
        tabElementId: "rival-shop-analysis-trade-constitute-tab",
        buttonType: {cate: "cate", priceSeg: "priceSeg"},
        currentClickButton: "",
        chartElementId: "rival-shop-analysis-trade-constitute-chart"
    };

    // 类目按钮
    function oneClickTransformForCate() {
        moduleCache.currentClickButton = moduleCache.buttonType.cate;
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    // 价格带按钮
    function oneClickTransformForPriceSeg() {
        moduleCache.currentClickButton = moduleCache.buttonType.priceSeg;
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogWidth;
        if (moduleCache.data.shopData.length == 1) {
            dialogWidth = "50%";
        } else if (moduleCache.data.shopData.length == 2) {
            dialogWidth = "60%";
        } else if (moduleCache.data.shopData.length == 3) {
            dialogWidth = "75%";
        }
        var dialogOptions = {
            title: dialogTitle,
            area: [dialogWidth, '95%'],
            // offset: "100px",
            content: "<div class='wxr-charts-container' id='" + moduleCache.chartElementId + "'></div>" +
                "<div id='" + moduleCache.tabElementId + "' class='layui-tab layui-tab-brief' lay-filter='tabLayFilter'><ul class='layui-tab-title'><li class='layui-this' value='merge'>合并模式</li><li value='compare'>对比模式</li></ul></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                setTimeout(function () {
                    renderPieChart();
                    renderTabs();
                    renderTable(layero);
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    function renderTabs() {
        // moduleCache.tableShowModel = "shop";
        $("#" + moduleCache.tabElementId).css({padding: "5px 0px"});
        if (moduleCache.data.shopData.length <= 1) {
            $("#" + moduleCache.tabElementId + " li:last").addClass("wxr-tab-disabled");
        }
        layui.element.on("tab(tabLayFilter)", function () {
            renderTable();
        });
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 先获取竞店列表，然后根据页面上选择的店铺的名称找到对应的userId
        var rivalShopsCacheKey = globalUrlPrefix + "/mc/ci/config/rival/shop/getMonitoredListExcludeGreatShop.json?firstCateId=" + moduleCache.urlParams.cateId + "&rivalType=shop",
            rivalShopsCacheData = commonModule.getUsableOriginalJsonDataFromCache(rivalShopsCacheKey, false), rivalShopList = [],
            deviceText = $("#shopAnalysisItems .oui-card-header-wrapper .ant-select-selection-selected-value").text(), deviceCode;
        if (deviceText == "所有终端") {
            deviceCode = 0;
        } else if (deviceText == "PC端") {
            deviceCode = 1;
        } else if (deviceText == "无线端") {
            deviceCode = 2;
        }
        var selfShopInfo = commonModule.getShopUserInfo(),
            selfShopPicUrl = $("#shopAnalysisSelect .sycm-common-select-wrapper .sycm-common-select-selected-image-wrapper img").eq(0).attr("src");
        var selfShopItem = {userId: selfShopInfo.mainUserId, name: selfShopInfo.storeName, picUrl: selfShopPicUrl};
        rivalShopList.push(selfShopItem);
        if (rivalShopsCacheData) {
            rivalShopList.push.apply(rivalShopList, rivalShopsCacheData);
        }
        moduleCache.data.shopData = [];
        $("#shopAnalysisSelect .sycm-common-select-wrapper .alife-dt-card-sycm-common-select").each(function (index, item) {
            var shopName = $(this).find(".sycm-common-select-selected-title").attr("title");
            if (shopName) {
                $.each(rivalShopList, function (i, shopItem) {
                    if (shopItem.name == shopName) {
                        shopItem.alias = (index == 0 ? "本店" : ("竞店" + index));
                        shopItem.backgroundColor = commonModule.getChartColors().hex[index];
                        moduleCache.data.shopData.push(shopItem);
                        // 找到当前店铺的类目与价格带的数据并分类存储
                        var cateCacheKey = globalUrlPrefix + "/mc/rivalShop/analysis/getCateConstitute.json?device=" + deviceCode + "&userId="
                            + shopItem.userId + "&cateId=" + moduleCache.urlParams.cateId + "&dateType=" + moduleCache.urlParams.dateType
                            + "&dateRange=" + moduleCache.urlParams.dateRange,
                            priceSegCacheKey = cateCacheKey.replace("getCateConstitute", "getPriceSegConstitute"),
                            cateCacheData = commonModule.getUsableOriginalJsonDataFromCache(cateCacheKey, true),
                            priceSegCacheData = commonModule.getUsableOriginalJsonDataFromCache(priceSegCacheKey, true);
                        shopItem.cateData = [];
                        if (cateCacheData) {
                            shopItem.cateData = cateCacheData;
                        }
                        shopItem.priceSegData = [];
                        if (priceSegCacheData) {
                            shopItem.priceSegData = priceSegCacheData;
                        }
                        return false;
                    }
                });
            }
        });
        transformData();
    }

    function transformData() {
        var statisticsTime = $(".oui-date-picker-current-date").text().replace("统计时间", "");
        moduleCache.data.mergeData = {cate: [], priceSeg: []}, moduleCache.data.compareData = {cate: [], priceSeg: []};
        var compareCate = {}, comparePriceSeg = {};
        for (var i in moduleCache.data.shopData) {
            var shopItem = moduleCache.data.shopData[i], cateData = shopItem.cateData, priceSegData = shopItem.priceSegData;
            for (var j in cateData) {
                var cateItem = cateData[j], cateMergeItem = {
                    shopName: shopItem.name,
                    shopPic: shopItem.picUrl,
                    shopUrl: shopItem.linkUrl,
                    shopType: shopItem.alias,
                    shopTypeColor: shopItem.backgroundColor,
                    dateTime: statisticsTime,
                    parentCateName: cateItem.cateLevel1Name ? cateItem.cateLevel1Name.value : "",
                    cateName: cateItem.cateName.value,
                    payAmtRatio: cateItem.payAmtRatio ? Number((cateItem.payAmtRatio.ratio * 100).toFixed(2)) : 0
                };
                moduleCache.data.mergeData.cate.push(cateMergeItem);
                var compareCateItem = compareCate[cateItem.cateName.value];
                if (!compareCateItem) {
                    compareCateItem = {cateName: cateItem.cateName.value};
                    compareCate[cateItem.cateName.value] = compareCateItem;
                }
                compareCateItem["payAmtRatio_" + shopItem.userId] = cateItem.payAmtRatio ? Number((cateItem.payAmtRatio.ratio * 100).toFixed(2)) : 0;
            }
            for (var j in priceSegData) {
                var priceSegItem = priceSegData[j], priceSegMergeItem = {
                    shopName: shopItem.name,
                    shopPic: shopItem.picUrl,
                    shopUrl: shopItem.linkUrl,
                    shopType: shopItem.alias,
                    shopTypeColor: shopItem.backgroundColor,
                    dateTime: statisticsTime,
                    priceSegName: priceSegItem.priceSegName.value,
                    payAmtRatio: priceSegItem.payAmtRatio ? Number((priceSegItem.payAmtRatio.ratio * 100).toFixed(2)) : 0
                };
                moduleCache.data.mergeData.priceSeg.push(priceSegMergeItem);
                var comparePriceSegItem = comparePriceSeg[priceSegItem.priceSegName.value];
                if (!comparePriceSegItem) {
                    comparePriceSegItem = {priceSegName: priceSegItem.priceSegName.value};
                    comparePriceSeg[priceSegItem.priceSegName.value] = comparePriceSegItem;
                }
                comparePriceSegItem["payAmtRatio_" + shopItem.userId] = priceSegItem.payAmtRatio ? Number((priceSegItem.payAmtRatio.ratio * 100).toFixed(2)) : 0;
            }
        }
        // 转换对比模式下的数据为数组
        for (var key in compareCate) {
            var compareCateItem = compareCate[key];
            moduleCache.data.compareData.cate.push(compareCateItem);
        }
        for (var key in comparePriceSeg) {
            var comparePriceSegItem = comparePriceSeg[key];
            moduleCache.data.compareData.priceSeg.push(comparePriceSegItem);
        }
    }

    function renderPieChart() {
        var chartItemWidth = (100 / moduleCache.data.shopData.length).toFixed(4);
        chartItemWidth = chartItemWidth.substring(0, chartItemWidth.length - 2);
        $.each(moduleCache.data.shopData, function (index, item) {
            var chartItemWrapper = $("<div style='width: " +
                chartItemWidth + "%; height: 100%; padding: 0px 5px;display: inline-block;position:relative;'>" +
                "<div id='rivalShopPie" + index + "' style='height: 100%'></div>");
            $("#" + moduleCache.chartElementId).append(chartItemWrapper);
            var legendData = [], seriesData = [];
            if (moduleCache.currentClickButton == moduleCache.buttonType.cate) {
                var shopCateData = item.cateData;
                for (var i in shopCateData) {
                    var shopCateDataItem = shopCateData[i], seriesItem = {
                        name: shopCateDataItem.cateName.value,
                        value: shopCateDataItem.payAmtRatio ? Number((shopCateDataItem.payAmtRatio.ratio * 100).toFixed(2)) : 0
                    };
                    legendData.push(shopCateDataItem.cateName.value), seriesData.push(seriesItem);
                }
            } else {
                var shopPriceSegData = item.priceSegData;
                for (var i in shopPriceSegData) {
                    var shopPriceSegDataItem = shopPriceSegData[i], seriesItem = {
                        name: shopPriceSegDataItem.priceSegName.value,
                        value: shopPriceSegDataItem.payAmtRatio ? Number((shopPriceSegDataItem.payAmtRatio.ratio * 100).toFixed(2)) : 0
                    };
                    legendData.push(shopPriceSegDataItem.priceSegName.value), seriesData.push(seriesItem);
                }
            }
            var option = {
                title: {
                    text: item.alias,
                    top: "top",
                    left: "center",
                    textStyle: {
                        fontSize: 12,
                        fontWeight: "bold"
                    }
                },
                legend: {
                    data: legendData,
                    left: "center",
                    top: 200,
                    icon: "circle",
                    textStyle: {
                        fontSize: 12
                    },
                    itemHeight: 10
                },
                tooltip: {
                    trigger: 'item',
                    backgroundColor: "#fff",
                    textStyle: {
                        color: "black",
                        fontSize: 12
                    },
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                    formatter: '{a} <br/>{b} : {d}%'
                },
                color: commonModule.getChartColors().hex,
                series: [
                    {
                        name: '支付金额占比',
                        type: 'pie',
                        radius: '62%',
                        center: ['50%', '43%'],
                        data: seriesData,
                        label: {
                            position: "inside",
                            formatter: '{d}%'
                        }
                    }]
            };
            var thisChart = echarts.init($("#rivalShopPie" + index)[0]);
            thisChart.setOption(option, true);
            window.addEventListener("resize", function () {
                thisChart.resize();
            });
        });
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var activeTableModel = $("#" + moduleCache.tabElementId + " .layui-this").attr("value"),
            heightGap = ($(window).height() * 0.05 + 104 + 50 + 260).toFixed(0), cols, tableData = [];
        if (activeTableModel == "merge"){
            cols = [[
                {field: 'name', title: "店铺名称", minWidth: 220, sort: true, templet: function (row) {
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='" + row.shopPic + "'/><span>" +
                            "<a href='//" + row.shopUrl + "' target='_blank' title='" + row.shopName + "'>" + row.shopName + "</a></span></div>";
                    }},
                {field: "shopType", title: "类别", minWidth: 100, sort: true, templet: function (row) {
                        return "<span class='wxr-text-color-block' style='background: " + row.shopTypeColor + "'>" + row.shopType + "</span>";
                    }},
                {field: "dateTime", title: "日期", minWidth: 100, sort: true}
            ]];
            if (moduleCache.currentClickButton == moduleCache.buttonType.cate) {
                cols[0].push.apply(cols[0], [
                    {field: "parentCateName", title: "父行业类目名称", minWidth: 110, sort: true},
                    {field: "cateName", title: "类目名称", minWidth: 110, sort: true},
                    {field: "payAmtRatio", title: "支付金额占比", minWidth: 130, sort: true, isPercentValue: true}
                ]);
                // tableData = moduleCache.data.mergeData.cate;
            } else {
                cols[0].push.apply(cols[0], [
                    {field: "priceSegName", title: "价格带", minWidth: 110, sort: true},
                    {field: "payAmtRatio", title: "支付金额占比", minWidth: 130, sort: true, isPercentValue: true}
                ]);
                // tableData = moduleCache.data.mergeData.priceSeg;
            }
            tableData = moduleCache.data.mergeData[moduleCache.currentClickButton];
        } else if (activeTableModel == "compare") {
            cols = [[]];
            if (moduleCache.currentClickButton == moduleCache.buttonType.cate) {
                cols[0].push({field: "cateName", title: "类目", minWidth: 110, sort: true});
            } else {
                cols[0].push({field: "priceSegName", title: "价格带", minWidth: 110, sort: true});
            }
            for (var i in moduleCache.data.shopData) {
                var shopItem = moduleCache.data.shopData[i];
                // cols[0].push({title: "<div style='display: inline-block'><img class='wxr-image-box wxr-image-box-36' src='" +
                //         shopItem.picUrl + "'/></div><div style='display: inline-block;vertical-align: middle'><ul><li><a href='//" + shopItem.linkUrl + "' target='_blank' title='" + shopItem.name + "'>" + shopItem.name +
                //         "</a></li><li>" + shopItem.userId + "</li></ul></div><div style='float: right'><span class='wxr-text-color-block' style='background: " + shopItem.backgroundColor + "'>" + shopItem.alias +
                //         "</span></div>", colspan: 1, field: "colspan_" + shopItem.userId});
                cols[0].push({field: "payAmtRatio_" + shopItem.userId, title: "<div style='display: inline-block'><img class='wxr-image-box wxr-image-box-36' src='" +
                        shopItem.picUrl + "'/></div><div style='display: inline-block;vertical-align: middle'><ul><li><a href='//" + shopItem.linkUrl + "' target='_blank' title='" + shopItem.name + "'>" + shopItem.name +
                        "</a></li><li>" + shopItem.userId + "</li></ul></div><div style='float: right'><span class='wxr-text-color-block' style='background: " + shopItem.backgroundColor + "'>" + shopItem.alias +
                        "</span></div></br></br>支付金额占比", minWidth: 250, sort: true, isPercentValue: true});
            }
            tableData = moduleCache.data.compareData[moduleCache.currentClickButton];
        }
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: tableData,
            height: 'full-' + heightGap,
            cols: cols,
            initSort: {
                field: 'payAmtRatio',
                type: "desc"
            },
            done: function () {
                if (activeTableModel == "merge") {
                    $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "'] .layui-table-body td").css({padding: "4px 0px"});
                }
            }
        };
        if (activeTableModel == "compare") {
            renderTableOptions.skin = "";
        }
        commonModule.renderTable(renderTableOptions, layero);
    }

    return {
        init: function () {
            var targetDom = $("#shopAnalysisTrade .oui-card-header-item.oui-card-header-item-pull-right"),
                buttons = [
                    {btnName: "类目", class: "", clickEventFunction: oneClickTransformForCate, cssStyle: "width:70px"},
                    {btnName: "价格带", class: "", clickEventFunction: oneClickTransformForPriceSeg, cssStyle: "width:70px"}
                ];
            commonModule.injectButtons(targetDom, "after", buttons, true, function (targetDom) {
                // $(".wxr-tool-buttons-inject-container").css("float", "none");
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  竞争-竞品分析-关键指标对比
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var itemAnalysisCoreIndexCompareModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "竞品分析 | 关键指标对比",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        // mergeData: {},// 年龄-性别与年龄-城市数据的合并
        data: {
            hasSelectedItems: [],// 曾经选择过的店铺
            mergeData: [],
            compareData: [],
            // activeShops: {} // 被选中的店铺
        },// 表格展示需要的数据
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "item-analysis-core-index-compare-table", //table的dom控件的id属性
        tableLayId: "itemAnalysisCoreIndexCompareTable", //table在layui中定义的id，即lay-ui属性
        tabElementId: "item-analysis-core-index-compare-tab",
        chartElementId: "item-analysis-core-index-compare-trend-chart",
        statisticEndTimeStr: "",
        sortedIndexCards: [
            {indexCode: "tradeIndex", indexName: "交易金额", isActive: true},
            {indexCode: "uvIndex", indexName: "访客人数"},
            {indexCode: "payByrCntIndex", indexName: "支付人数"},
            {indexCode: "payRateIndex", indexName: "支付转化率", isPercentValue: true},
            {indexCode: "payItemCnt", indexName: "支付件数"},
            {indexCode: "perTicketSales", indexName: "客单价"},
            {indexCode: "seIpvUvHits", indexName: "搜索人数"},
            {indexCode: "cltHits", indexName: "收藏人数"},
            {indexCode: "cartHits", indexName: "加购人数"},
            {indexCode: "uvValue", indexName: "uv价值"},
            {indexCode: "seIpvUvHitsRate", indexName: "搜索占比"},
            {indexCode: "cltRate", indexName: "收藏率"},
            {indexCode: "cartRate", indexName: "加购率"}
        ]
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + statisticsTimeText + " | "
                + $("#shopAnalysisSelect").next().find(".oui-card-header-wrapper .ant-select-selection-selected-value").text();
        var dialogWidth;
        var dialogOptions = {
            title: dialogTitle,
            area: ['98%', '98%'],
            // offset: "100px",
            content: "<div class='wxr-dialog-sidebar'><div class='wxr-dialog-sidebar-inner'><ul></ul></div></div><div class='wxr-dialog-main'>" +
                "<div id='wxr-dialog-side-button'><i class='layui-icon layui-icon-spread-left' title='展开'></i></div>" +
                "<div class='wxr-cards-container'></div>" +
                "<div class='wxr-charts-container' id='" + moduleCache.chartElementId + "'></div>" +
                "<div id='" + moduleCache.tabElementId + "' class='layui-tab layui-tab-brief' lay-filter='tabLayFilter'><ul class='layui-tab-title'><li class='layui-this' value='merge'>合并模式</li><li value='compare'>对比模式</li></ul></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div></div>",
            success: function (layero, index) {
                var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0});
                setTimeout(function () {
                    try {
                        sideButtonEventBind();
                        drawDialogPageLeft();
                        drawIndexCards();
                        renderTabs();
                        renderChart();
                        renderTable(loading, layero);
                    } catch (e) {
                        layui.layer.close(loading);
                    }
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    function sideButtonEventBind() {
        $("#wxr-dialog-side-button .layui-icon").on("click", function () {
            if ($(this).hasClass("layui-icon-spread-left")) {
                $(this).removeClass("layui-icon-spread-left");
                $(this).addClass("layui-icon-shrink-right");
                $(this).attr("title", "折叠");
                // $(".dialog-sidebar").show(500, function () {
                //     $(".dialog-main").css({paddingLeft: "240px"});
                // });
                $(".wxr-dialog-sidebar").animate({
                    width: '260px', opacity: 'show'
                }, 500, function () {
                    $(".wxr-dialog-main").css({paddingLeft: "260px"});
                    $("#wxr-dialog-side-button").css({paddingLeft: "270px"});
                    var chartInstance = echarts.getInstanceByDom($("#" + moduleCache.chartElementId)[0]);
                    if (chartInstance) {
                        chartInstance.resize();
                    }
                    layui.table.resize(moduleCache.tableLayId);
                });
            } else if ($(this).hasClass("layui-icon-shrink-right")) {
                $(this).removeClass("layui-icon-shrink-right");
                $(this).addClass("layui-icon-spread-left");
                $(this).attr("title", "展开");
                // $(".dialog-sidebar").hide(500, function () {
                //     $(".dialog-main").css({paddingLeft: "0px"});
                // });
                $(".wxr-dialog-sidebar").animate({
                    width: '0px', opacity: 'hide'
                }, 500, function () {
                    $(".wxr-dialog-main").css({paddingLeft: "0"});
                    $("#wxr-dialog-side-button").css({paddingLeft: "10px"});
                    var chartInstance = echarts.getInstanceByDom($("#" + moduleCache.chartElementId)[0]);
                    if (chartInstance) {
                        chartInstance.resize();
                    }
                    layui.table.resize(moduleCache.tableLayId);
                });
            }

        });
        // $("#wxr-dialog-side-button .layui-icon").trigger("click");
    }

    function renderTabs() {
        $("#" + moduleCache.tabElementId).css({padding: "5px 0px"});
        if ($(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length <= 1) {
            $("#" + moduleCache.tabElementId + " li:last").addClass("wxr-tab-disabled");
        }
        layui.element.on("tab(tabLayFilter)", function () {
            renderTable();
        });
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 首先获取所有的竞品列表
        var rivalItemsCacheKey = globalUrlPrefix + "/mc/ci/config/rival/item/getMonitoredListExcludeGreatShop.json?firstCateId=" +
            moduleCache.urlParams.cateId + "&rivalType=item",
            rivalItemsCacheData = commonModule.getUsableOriginalJsonDataFromCache(rivalItemsCacheKey, false),
            // 保存竞品临时集合
            rivalItems = {};
        // 找到数据后进行格式转化，以itemId为key来保存，方便后面使用
        if (rivalItemsCacheData) {
            for (var i in rivalItemsCacheData) {
                var item = rivalItemsCacheData[i];
                rivalItems[item.itemId] = item;
            }
        }
        // 本店推荐的商品列表，同样要保存到rivalItems临时集合中
        var recommendItemsCacheKey = globalUrlPrefix + "/mc/rivalShop/recommend/item.json",
            recommendItemsCacheData = commonModule.getUsableOriginalJsonDataFromCache(recommendItemsCacheKey, true);
        if (recommendItemsCacheData) {
            for (var i in recommendItemsCacheData) {
                var recommendItem = recommendItemsCacheData[i], rivalItem = {
                    itemId: recommendItem.itemId,
                    linkUrl: recommendItem.detailUrl,
                    name: recommendItem.title,
                    picUrl: recommendItem.pictUrl
                };
                rivalItems[recommendItem.itemId] = rivalItem;
            }
        }

        // 开始组装趋势数据，对于实时数据，需要找到唯一的缓存key，其他时间类型的数据可以在缓存中根据userId来直接覆盖
        var selfItemName = $("#itemAnalysisSelect .sycm-common-select-wrapper .alife-dt-card-sycm-common-select").eq(0).find(".sycm-common-select-selected-title").attr("title"),
            rivalItem1Name = $("#itemAnalysisSelect .sycm-common-select-wrapper .alife-dt-card-sycm-common-select").eq(1).find(".sycm-common-select-selected-title").attr("title"),
            rivalItem2Name = $("#itemAnalysisSelect .sycm-common-select-wrapper .alife-dt-card-sycm-common-select").eq(2).find(".sycm-common-select-selected-title").attr("title"),
            selfItemId, rivalItem1Id, rivalItem2Id, trendDataCacheKeyPrefix = getTrendCacheKeyPrefix(), trendCacheData;
        // 根据名称找到本店商品、竞店1和竞店2的id
        for (var key in rivalItems) {
            if (rivalItems[key].name == selfItemName) {
                selfItemId = rivalItems[key].itemId;
            }
            if (rivalItems[key].name == rivalItem1Name) {
                rivalItem1Id = rivalItems[key].itemId;
            }
            if (rivalItems[key].name == rivalItem2Name) {
                rivalItem2Id = rivalItems[key].itemId;
            }
        }
        if (moduleCache.urlParams.dateType == "today") {
            var trendCacheKey = trendDataCacheKeyPrefix;
            if (selfItemId) {
                trendCacheKey += "&selfItemId=" + selfItemId;
            }
            if (rivalItem1Id) {
                trendCacheKey += "&rivalItem1Id=" + rivalItem1Id;
            }
            if (rivalItem2Id) {
                trendCacheKey += "&rivalItem2Id=" + rivalItem2Id;
            }
            trendCacheData = commonModule.getUsableOriginalJsonDataFromCache(trendCacheKey, true);
            if (trendCacheData) {
                trendCacheData = trendCacheData.data;
            }
            parseTrendData(rivalItems, trendCacheKey, trendCacheData);
        } else {
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key.slice(0, trendDataCacheKeyPrefix.length) == trendDataCacheKeyPrefix) {
                    trendCacheData = commonModule.getUsableOriginalJsonDataFromCache(key, true);
                    parseTrendData(rivalItems, key, trendCacheData);
                }
            }
        }
        // 将店铺按照一定顺序存入集合
        moduleCache.data.hasSelectedItems = [];
        var colorArray = commonModule.getChartColors().hex;
        if (selfItemId) {
            var selfItem = rivalItems[selfItemId];
            selfItem.isActive = true;
            selfItem.alias = "本店商品";
            selfItem.backgroundColor = colorArray[0 % colorArray.length];
            selfItem.shopName = "本店";
            moduleCache.data.hasSelectedItems.push(selfItem);
        }
        if (rivalItem1Id) {
            rivalItems[rivalItem1Id].isActive = true;
            rivalItems[rivalItem1Id].alias = "竞品1";
            rivalItems[rivalItem1Id].backgroundColor = colorArray[1 % colorArray.length];
            rivalItems[rivalItem1Id].shopName = rivalItems[rivalItem1Id].shop.name;
            moduleCache.data.hasSelectedItems.push(rivalItems[rivalItem1Id]);
        }
        if (rivalItem2Id) {
            rivalItems[rivalItem2Id].isActive = true;
            rivalItems[rivalItem2Id].alias = "竞品2";
            rivalItems[rivalItem2Id].backgroundColor = colorArray[2 % colorArray.length];
            rivalItems[rivalItem2Id].shopName = rivalItems[rivalItem2Id].shop.name;
            moduleCache.data.hasSelectedItems.push(rivalItems[rivalItem2Id]);
        }
        var backgroundIndex = 3;
        for (var key in rivalItems) {
            var rivalItem = rivalItems[key];
            if (rivalItem.isSelected && !rivalItem.isActive) {
                rivalItem.alias = "竞品" + backgroundIndex;
                rivalItem.backgroundColor = colorArray[backgroundIndex % colorArray.length];
                rivalItem.shopName = rivalItem.shop.name;
                moduleCache.data.hasSelectedItems.push(rivalItem);
                backgroundIndex++;
            }
        }
        transformData();
    }

    function parseTrendData(rivalItems, key, trendCacheData) {
        if (trendCacheData) {
            var params = commonModule.extractLocationParams(key);
            try {
                if (trendCacheData.selfItem) {
                    rivalItems[params.selfItemId].trendData = trendCacheData.selfItem;
                    rivalItems[params.selfItemId].isActive = true;
                }
                if (trendCacheData.rivalItem1) {
                    rivalItems[params.rivalItem1Id].trendData = trendCacheData.rivalItem1;
                    rivalItems[params.rivalItem1Id].isSelected = true;
                }
                if (trendCacheData.rivalItem2) {
                    rivalItems[params.rivalItem2Id].trendData = trendCacheData.rivalItem2;
                    rivalItems[params.rivalItem2Id].isSelected = true;
                }
            } catch (e) {

            }
        }
    }

    /**
     * @Author xuyefei
     * @Description  趋势数据的缓存key前缀
     * @Date 10:48 2020/11/11
     * @Param
     * @return
     **/
    function getTrendCacheKeyPrefix() {
        var deviceText = $("#itemAnalysisSelect").next().find(".oui-card-header-wrapper .ant-select-selection-selected-value").text(),
            deviceCode, activeTypeText = $("#itemAnalysisSelect").next().find(".oui-card-switch-item-active").text(), shopType,
            cacheKeyPrefix = globalUrlPrefix + "/mc/rivalItem/analysis";
        if (deviceText == "所有终端") {
            deviceCode = 0;
        } else if (deviceText == "PC端") {
            deviceCode = 1;
        } else if (deviceText == "无线端") {
            deviceCode = 2;
        }
        if (moduleCache.urlParams.dateType == "today") {
            cacheKeyPrefix += "/getLiveCoreTrend.json?";
        } else {
            cacheKeyPrefix += "/getCoreTrend.json?";
        }
        cacheKeyPrefix += "dateType=" + moduleCache.urlParams.dateType + "&dateRange=" + moduleCache.urlParams.dateRange + "&indexCode=&device=" +
            deviceCode + "&cateId=" + moduleCache.urlParams.cateId;
        return cacheKeyPrefix;
    }

    function transformData() {
        if (moduleCache.data.hasSelectedItems.length == 0) {
            return;
        }
        var trendDataLength = moduleCache.data.hasSelectedItems[0].trendData.tradeIndex.length, endTimeStr;
        if (moduleCache.urlParams.dateType == "today") {
            endTimeStr = "today";
        } else {
            endTimeStr = moduleCache.urlParams.dateRange.split("|")[1];
        }
        moduleCache.dateTimes = commonModule.generateStatisticTimes(trendDataLength, endTimeStr, moduleCache.urlParams.dateType);
        moduleCache.data.mergeData = [], moduleCache.data.compareData = [];
        var chartHexColors = commonModule.getChartColors().hex;
        for (var j = 0; j < trendDataLength; j++) {
            var compareDataItem = {dateTime: moduleCache.dateTimes[j]};
            $.each(moduleCache.data.hasSelectedItems, function (index, item) {
                // if (item.isDataTransformCompleted) {
                //     return true;
                // }
                if (j == 0) {// 第一次要重新初始化相关数据
                    // 为每个商品准备一个已转化的趋势数据集合
                    item.transformTrendData = {};
                    // 每个商品单独存储一份自己的合并数据
                    item.mergeData = [];
                }
                if (!item.isActive) {
                    return true;
                }
                var trendData = item.trendData, mergeDataItem = {
                    itemName: item.name,
                    type: item.alias,
                    itemPic: item.picUrl,
                    dateTime: moduleCache.dateTimes[j],
                    itemId: item.itemId,
                    itemUrl: item.linkUrl,
                    backgroundColor: item.backgroundColor,
                    shopName: item.shopName
                };
                // 对店铺趋势数据中原有的指标的当前循环索引进行转换
                for (var indexCode in trendData) {
                    var indexValue = trendData[indexCode][j];
                    if (indexCode != "payRateIndex") {
                        if (indexCode == "payItemCnt") {// 无需转换的指标

                        } else {
                            indexValue = commonModule.calculateFormula(indexValue, 1, 0);
                        }
                    } else {
                        indexValue = commonModule.calculateFormula(indexValue, 0, 8);
                    }
                    if (!item.transformTrendData[indexCode]) {
                        item.transformTrendData[indexCode] = [];
                    }
                    item.transformTrendData[indexCode].push(indexValue);
                    if (indexValue != null) {// 所有的指标如果有一个存在有效值，则设置有效标记，没有有效值标记的对象将不会放入merge和compare集合
                        mergeDataItem.isEffective = true;
                        compareDataItem.isEffective = true;
                    }
                    mergeDataItem[indexCode] = indexValue;
                    compareDataItem[indexCode + "_" + item.itemId] = indexValue;
                }
                // 原有的指标转化完毕之后，计算其他指标
                // 支付人数
                if (!item.transformTrendData.payByrCntIndex) {
                    item.transformTrendData.payByrCntIndex = [];
                }
                if (mergeDataItem.payRateIndex == null && mergeDataItem.uvIndex == null) {
                    mergeDataItem.payByrCntIndex = null;
                } else {
                    mergeDataItem.payByrCntIndex = Number((mergeDataItem.uvIndex * mergeDataItem.payRateIndex / 100).toFixed(0));
                }
                compareDataItem["payByrCntIndex_" + item.itemId] = mergeDataItem.payByrCntIndex;
                item.transformTrendData.payByrCntIndex.push(mergeDataItem.payByrCntIndex);
                // uv价值
                if (!item.transformTrendData.uvValue) {
                    item.transformTrendData.uvValue = [];
                }
                if (mergeDataItem.tradeIndex == null && mergeDataItem.uvIndex == null) {
                    mergeDataItem.uvValue = null;
                } else {
                    mergeDataItem.uvValue = !mergeDataItem.uvIndex ? 0 : Number((mergeDataItem.tradeIndex / mergeDataItem.uvIndex).toFixed(2));
                }
                compareDataItem["uvValue_" + item.itemId] = mergeDataItem.uvValue;
                item.transformTrendData.uvValue.push(mergeDataItem.uvValue);
                // 客单价
                if (!item.transformTrendData.perTicketSales) {
                    item.transformTrendData.perTicketSales = [];
                }
                if (mergeDataItem.tradeIndex == null && mergeDataItem.payByrCntIndex == null) {
                    mergeDataItem.perTicketSales = null;
                } else {
                    mergeDataItem.perTicketSales = !mergeDataItem.payByrCntIndex ? 0 : Number((mergeDataItem.tradeIndex / mergeDataItem.payByrCntIndex).toFixed(2));
                }
                compareDataItem["perTicketSales_" + item.itemId] = mergeDataItem.perTicketSales;
                item.transformTrendData.perTicketSales.push(mergeDataItem.perTicketSales);
                // 搜索占比
                if (!item.transformTrendData.seIpvUvHitsRate) {
                    item.transformTrendData.seIpvUvHitsRate = [];
                }
                if (mergeDataItem.seIpvUvHits == null && mergeDataItem.uvIndex == null) {
                    mergeDataItem.seIpvUvHitsRate = null;
                } else {
                    mergeDataItem.seIpvUvHitsRate = !mergeDataItem.uvIndex ? 0 : Number((mergeDataItem.seIpvUvHits / mergeDataItem.uvIndex * 100).toFixed(2));
                }
                compareDataItem["seIpvUvHitsRate_" + item.itemId] = mergeDataItem.seIpvUvHitsRate;
                item.transformTrendData.seIpvUvHitsRate.push(mergeDataItem.seIpvUvHitsRate);
                // 收藏率
                if (!item.transformTrendData.cltRate) {
                    item.transformTrendData.cltRate = [];
                }
                if (mergeDataItem.cltHits == null && mergeDataItem.uvIndex == null) {
                    mergeDataItem.cltRate = null;
                } else {
                    mergeDataItem.cltRate = !mergeDataItem.uvIndex ? 0 : Number((mergeDataItem.cltHits / mergeDataItem.uvIndex * 100).toFixed(2));
                }
                compareDataItem["cltRate_" + item.itemId] = mergeDataItem.cltRate;
                item.transformTrendData.cltRate.push(mergeDataItem.cltRate);
                // 加购率
                if (!item.transformTrendData.cartRate) {
                    item.transformTrendData.cartRate = [];
                }
                if (mergeDataItem.cartHits == null && mergeDataItem.uvIndex == null) {
                    mergeDataItem.cartRate = null;
                } else {
                    mergeDataItem.cartRate = !mergeDataItem.uvIndex ? 0 : Number((mergeDataItem.cartHits / mergeDataItem.uvIndex * 100).toFixed(2));
                }
                compareDataItem["cartRate_" + item.itemId] = mergeDataItem.cartRate;
                item.transformTrendData.cartRate.push(mergeDataItem.cartRate);
                item.mergeData.push(mergeDataItem);
                if (mergeDataItem.isEffective) {
                    moduleCache.data.mergeData.push(mergeDataItem);
                }
                // 店铺的所有指标数据已转化完毕，汇总一下数据
                // if (j == trendDataLength - 1) {
                //     for (var indexCode in item.transformTrendData) {
                //         item[indexCode + "_total"] = eval(item.transformTrendData[indexCode].join("+"));
                //     }
                //     // 除了交易金额、访客人数、支付人数之外，支付转化率、uv价值以及客单价都需要按月份数据汇总之后重新计算
                //     item["payRateIndex_total"] = !item["uvIndex_total"] ? 0 : Number((item["payByrCntIndex_total"] / item["uvIndex_total"] * 100).toFixed(2));
                //     item["uvValue_total"] = !item["uvIndex_total"] ? 0 : Number((item["tradeIndex_total"] / item["uvIndex_total"]).toFixed(2));
                //     item["perTicketSales_total"] = !item["payByrCntIndex_total"] ? 0 : Number((item["tradeIndex_total"] / item["payByrCntIndex_total"]).toFixed(2));
                //     item.isDataTransformCompleted = true;
                // }
            });
            if (compareDataItem.isEffective) {
                moduleCache.data.compareData.push(compareDataItem);
            }
        }
    }

    function drawDialogPageLeft() {
        var searchShopInputDom = "<li><div style='position:relative;'><input class='wxr-side-bar-search-input layui-input' style='padding: 0px 10px 0px 30px' placeholder='搜索名称'><i class='layui-icon layui-icon-search' style='color: #1E9FFF;position: absolute;top: 10px;left: 8px;font-size: 16px'></i></div></li>";
        $(".wxr-dialog-sidebar-inner>ul").append(searchShopInputDom);
        $.each(moduleCache.data.hasSelectedItems, function (index, item) {
            // $("#wxr-side-bar-filter-selector select").append("<option value='" + item.userId + "'>" + item.name + "</option>");
            var singleShopDom = $("<li id='" + item.name + "' class='shop-display-item'><div style='display: inline-block;'><img class='wxr-image-box wxr-image-box-36' src='" + item.picUrl + "'/></div>" +
                "<div style='display: inline-block; vertical-align: middle;width: 70%'><ul><li style='padding-bottom: 5px'>" +
                "<a href='//" + item.linkUrl + "' target='_blank' title='" + item.name + "'>" + item.name + "</a></li>" +
                "<li><span class='wxr-text-color-block'>" + item.alias +
                "</span></li></ul></div><i class='layui-icon layui-icon-circle' style='width: 15%'></i></li>");
            if (item.isActive) {
                singleShopDom.find(".layui-icon").removeClass("layui-icon-circle");
                singleShopDom.find(".layui-icon").addClass("layui-icon-ok-circle");
                // moduleCache.data.activeShops[item.userId] = item;
            }
            singleShopDom.find(".wxr-text-color-block").css({backgroundColor: item.backgroundColor});
            singleShopDom.find(".layui-icon").on("click", function () {
                if ($(this).hasClass("layui-icon-ok-circle")) {
                    if ($(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length > 1) {
                        $(this).removeClass("layui-icon-ok-circle");
                        $(this).addClass("layui-icon-circle");
                        item.isActive = false;
                    } else {
                        return;
                    }
                } else {
                    $(this).removeClass("layui-icon-circle");
                    $(this).addClass("layui-icon-ok-circle");
                    item.isActive = true;
                }
                if ($(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length <= 1) {
                    $("#" + moduleCache.tabElementId + " li:last").addClass("wxr-tab-disabled");
                } else {
                    $("#" + moduleCache.tabElementId + " li:last").removeClass("wxr-tab-disabled");
                }
                var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0});
                // transformData();
                setTimeout(function () {
                    transformData();
                    // drawIndexCards();
                    renderChart();
                    renderTable(loading);
                }, 100);
            });
            // 图片加载不成功则显示默认图片
            singleShopDom.find("img").on("error", function () {
                $(this).attr("src", "//img.alicdn.com/tps/TB1P1W_LXXXXXXoXVXXXXXXXXXX-74-74.png_48x48.jpg");
            });
            $(".wxr-dialog-sidebar-inner>ul").append(singleShopDom);
        });
        var searchInputDom = $(".wxr-dialog-sidebar-inner>ul .wxr-side-bar-search-input"),
            inputCompletedFlag = true;
        searchInputDom.on("compositionstart", function () {
            inputCompletedFlag = false;
        });
        searchInputDom.on("compositionend", function () {
            inputCompletedFlag = true;
        });
        searchInputDom.on("input propertychange", function () {
            setTimeout(function () {
                var searchText = searchInputDom.val();
                if (inputCompletedFlag) {
                    if (!searchText) {
                        $(".wxr-dialog-sidebar-inner>ul .shop-display-item").show();
                        return;
                    }
                    $(".wxr-dialog-sidebar-inner>ul .shop-display-item").hide();
                    $(".wxr-dialog-sidebar-inner>ul li[id*=" + searchText + "]").show();
                }
            }, 10);
        });
    }

    function drawIndexCards() {
        // 已选中的指标块初始化
        moduleCache.activeIndexCards = {};
        $(".wxr-cards-container").html("");
        // var sortedIndexCards = assembleIndexCards();
        // 计算每个小块宽度的百分比
        var cardItemWrapperPercent = (100 / moduleCache.sortedIndexCards.length).toFixed(4);
        // 舍去最后一位，防止宽度超出
        cardItemWrapperPercent = cardItemWrapperPercent.substring(0, cardItemWrapperPercent.length - 2);
        $(".wxr-cards-container").css({width: "96%", padding: "0px 35px"});
        // for (var i in moduleCache.firstLevelCategoryArray) {
        var activeIndexCode = $("#itemAnalysisSelect").next().find(".alife-one-design-sycm-indexes-trend-index-item-selectable.active .oui-index-cell").attr("value");
        if (activeIndexCode == "pvIndex") {
            activeIndexCode = "uvIndex";
        } else if (activeIndexCode == "cltByrCntIndex") {
            activeIndexCode = "cltHits";
        }
        $.each(moduleCache.sortedIndexCards, function (index, indexItem) {
            var cardItemWrapper = $("<div class='wxr-card-item-wrapper' style='width: " +
                cardItemWrapperPercent + "%'></div>"),
                // cardItemBody = $("<div class='wxr-card-item-body wxr-card-item-body-solid'><i class='layui-icon layui-icon-ok-circle wxr-card-item-body-icon'></i></div>");
                cardItemBody = $("<div class='wxr-card-item-body wxr-card-item-body-solid' style='text-align: center; white-space: nowrap;overflow: hidden;text-overflow: ellipsis'></div>");
            cardItemWrapper.append(cardItemBody);
            if (indexItem.indexCode == activeIndexCode) {
                indexItem.isActive = true;
                cardItemBody.addClass("wxr-card-item-body-active");
                cardItemBody.find(".wxr-card-item-body-icon").addClass("wxr-card-item-body-icon-checked");
                moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
            }
            // 填充内容
            // var bodyContent = $("<ul><li class='wxr-card-item-body-title'><div class='wxr-text-ellipsis' title='" + indexItem.indexName + "'>" + indexItem.indexName + "</div></li>" +
            //     // "<li class='wxr-card-item-body-data' style='font-size: 18px;line-height: 20px;color: #0C0C0C'><div class='wxr-text-ellipsis'>" + indexItem.indexValue + "</div></li>" +
            //     // "<li class='wxr-card-item-body-data' style='font-size: 12px'><div class='wxr-text-ellipsis'>" + indexItem.compareText + "</div><div class='wxr-text-ellipsis'>" + indexItem.indexCycleCrc + "<i class='" + indexItem.cycleCrcIconClassName + "'></i></div></li>" +
            //     "</ul>");
            var bodyContent = $("<span title='" + indexItem.indexName + "'>" + indexItem.indexName + "</span>");
            // $.each(moduleCache.data.hasSelectedShops, function(shopIndex, shopItem) {
            //     if (shopItem.isActive) {
            //         bodyContent.append("<li class='wxr-card-item-body-data'><div class='wxr-text-ellipsis' title='" + shopItem.alias + "'>" + shopItem.alias + "</div><div class='wxr-text-ellipsis'>" + shopItem[indexItem.indexCode + "_total"] + (indexItem.isPercentValue ? "%" : "") + "</div></li>");
            //     }
            // });
            // bodyContent.find("li").each(function (index, item) {
            //     $(this).css({margin: "4px 0px"});
            //     if ($(this).find("div").length == 2) {
            //         $(this).find("div:first-child").css({width: "40%"});
            //         $(this).find("div:nth-child(2)").css({width: "60%", textAlign: "right"});
            //     }
            // });
            // bodyContent.find(".wxr-card-item-body-data").css({color: "#ffffff"});
            cardItemBody.append(bodyContent);
            $(".wxr-cards-container").append(cardItemWrapper);
            // 点击事件绑定
            cardItemBody.on("click", function () {
                var activeShopCount = $(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length;
                // $(".wxr-cards-container .wxr-card-item-body").removeClass("wxr-card-item-body-active");
                if (activeShopCount > 1) {// 每次只能选中一个指标
                    $(".wxr-cards-container .wxr-card-item-body-active").removeClass("wxr-card-item-body-active");
                    $(".wxr-cards-container .layui-icon-ok-circle").removeClass("wxr-card-item-body-icon-checked");
                    $(this).addClass("wxr-card-item-body-active");
                    $(this).find(".layui-icon-ok-circle").addClass("wxr-card-item-body-icon-checked");
                    moduleCache.activeIndexCards = {};
                    moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                } else {// 可选中多个指标
                    if ($(this).hasClass("wxr-card-item-body-active")) {
                        if ($(".wxr-cards-container .wxr-card-item-body-active").length > 1) {
                            $(this).removeClass("wxr-card-item-body-active");
                            cardItemBody.find(".layui-icon-ok-circle").removeClass("wxr-card-item-body-icon-checked");
                            delete moduleCache.activeIndexCards[indexItem.indexCode];
                        }
                    } else {
                        $(this).addClass("wxr-card-item-body-active");
                        cardItemBody.find(".layui-icon-ok-circle").addClass("wxr-card-item-body-icon-checked");
                        moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                    }
                }
                renderChart();
            });
        });
    }

    function renderChart() {
        var thisChart = echarts.init($("#" + moduleCache.chartElementId + "")[0]),
            xAxisData = moduleCache.dateTimes, seriesDataArray = [], count = 0, interval = 1;
        if (moduleCache.urlParams.dateType == "day" || moduleCache.urlParams.dateType == "recent7" || moduleCache.urlParams.dateType == "recent30") {
            interval = 3;
        }
        var activeItemCount = $(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length, colorArray = [];
        if (activeItemCount > 1) {
            // count = 1;
            for (var i in moduleCache.data.hasSelectedItems) {
                var item = moduleCache.data.hasSelectedItems[i];
                if (!item.isActive) {
                    continue;
                }
                // 当前选中的指标code，只能选中一个
                var activeIndexCode = Object.keys(moduleCache.activeIndexCards)[0],
                    seriesObj = {
                        name: item.alias + "(" + moduleCache.activeIndexCards[activeIndexCode].indexName + ")",
                        type: 'line',
                        data: item.transformTrendData[activeIndexCode],
                        smooth: true,
                        symbol: "circle",
                        showSymbol: false,
                        symbolSize: 6
                    };
                seriesDataArray.push(seriesObj);
                colorArray.push(item.backgroundColor);
                // count++;
            }

        } else {
            var activeItem;
            $.each(moduleCache.data.hasSelectedItems, function (index, item) {
                if (item.isActive) {
                    activeItem = item;
                    return false;
                }
            });
            for (var indexCode in moduleCache.activeIndexCards) {
                var activeCardItem = moduleCache.activeIndexCards[indexCode], seriesObj = {
                    name: activeCardItem.indexName,
                    type: 'line',
                    data: activeItem.transformTrendData[indexCode],
                    smooth: true,
                    symbol: "circle",
                    showSymbol: false,
                    symbolSize: 6,
                    yAxisIndex: count
                };
                seriesDataArray.push(seriesObj);
                count++;
            }
        }
        var chartOptions = {
            xAxis: {
                type: 'category',
                axisLabel: {
                    interval: interval
                },
                axisLine: {},
                data: xAxisData,
            },
            series: seriesDataArray
        };
        if (activeItemCount > 1) {
            chartOptions.color = colorArray;
        }
        commonModule.renderLineCharts(chartOptions, thisChart, count);
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(loading, layero) {
        var activeTableModel = $("#" + moduleCache.tabElementId + " .layui-this").attr("value"),
            heightGap = ($(window).height() * 0.02 + 260 + 104 + 50 + 44).toFixed(0),
            cols, tableData = [];
        if (activeTableModel == "merge") {
            cols = [[
                {
                    field: 'shopName', title: "商品名称", minWidth: 240, sort: true, templet: function (row) {
                        // return "<img src='" + row.shop.pictureUrl + "'/><span>" + row.shopName + "</span>";
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='" + row.itemPic + "' style='float: left'/><ul>" +
                            "<li><a href='//" + row.itemUrl + "' target='_blank' title='" + row.itemName + "'>" + row.itemName + "</a></li><li>" + row.shopName + "</li></ul></div>";
                    }
                },
                {
                    field: "type", title: "类别", sort: true, minWidth: 100, templet: function (row) {
                        return "<span class='wxr-text-color-block' style='background: " + row.backgroundColor + "'>" + row.type + "</span>";
                    }
                },
                {field: "dateTime", title: "日期", sort: true, minWidth: 110},
                {field: "tradeIndex", title: "交易金额", minWidth: 90, sort: true},
                {field: "uvIndex", title: "访客人数", minWidth: 90, sort: true},
                {field: "payByrCntIndex", title: "支付人数", minWidth: 90, sort: true},
                {field: "payRateIndex", title: "支付转化率", minWidth: 100, sort: true, isPercentValue: true},
                {field: "payItemCnt", title: "支付件数", minWidth: 90, sort: true},
                {field: "perTicketSales", title: "客单价", minWidth: 70, sort: true},
                {field: "seIpvUvHits", title: "搜索人数", minWidth: 90, sort: true},
                {field: "cltHits", title: "收藏人数", minWidth: 90, sort: true},
                {field: "cartHits", title: "加购人数", minWidth: 90, sort: true},
                {field: "uvValue", title: "uv价值", minWidth: 70, sort: true},
                {field: "seIpvUvHitsRate", title: "搜索占比", minWidth: 90, sort: true, isPercentValue: true},
                {field: "cltRate", title: "收藏率", minWidth: 80, sort: true, isPercentValue: true},
                {field: "cartRate", title: "加购率", minWidth: 80, sort: true, isPercentValue: true}
            ]];
            tableData = moduleCache.data.mergeData;
        } else {
            cols = [[], []];
            cols[0].push({field: "dateTime", title: "日期", minWidth: 110, sort: true, rowspan: 2});
            for (var i in moduleCache.data.hasSelectedItems) {
                var item = moduleCache.data.hasSelectedItems[i];
                if (item.isActive) {
                    cols[0].push({title: "<div style='display: inline-block'><img class='wxr-image-box wxr-image-box-36' src='" +
                            item.picUrl + "'/></div><div style='display: inline-block;vertical-align: middle'><ul><li><a href='//" + item.linkUrl + "' target='_blank' title='" + item.name + "'>" + item.name +
                            "</a></li><li>" + item.itemId + "</li></ul></div><div style='float: right'><span class='wxr-text-color-block' style='background: " + item.backgroundColor + "'>" + item.alias +
                            "</span></div>", colspan: 13, field: "colspan_" + item.itemId});
                    cols[1].push.apply(cols[1], [
                        {field: "tradeIndex_" + item.itemId, title: "交易金额", minWidth: 100, sort: true},
                        {field: "uvIndex_" + item.itemId, title: "访客人数", minWidth: 100, sort: true},
                        {field: "payByrCntIndex_" + item.itemId, title: "支付人数", minWidth: 100, sort: true},
                        {field: "payRateIndex_" + item.itemId, title: "支付转化率", minWidth: 110, sort: true, isPercentValue: true},
                        {field: "payItemCnt_" + item.itemId, title: "支付件数", minWidth: 90, sort: true},
                        {field: "perTicketSales_" + item.itemId, title: "客单价", minWidth: 90, sort: true},
                        {field: "seIpvUvHits_" + item.itemId, title: "搜索人数", minWidth: 90, sort: true},
                        {field: "cltHits_" + item.itemId, title: "收藏人数", minWidth: 90, sort: true},
                        {field: "cartHits_" + item.itemId, title: "加购人数", minWidth: 90, sort: true},
                        {field: "uvValue_" + item.itemId, title: "uv价值", minWidth: 90, sort: true},
                        {field: "seIpvUvHitsRate_" + item.itemId, title: "搜索占比", minWidth: 90, sort: true, isPercentValue: true},
                        {field: "cltRate_" + item.itemId, title: "收藏率", minWidth: 80, sort: true, isPercentValue: true},
                        {field: "cartRate_" + item.itemId, title: "加购率", minWidth: 80, sort: true, isPercentValue: true}
                    ]);
                }
            }
            tableData = moduleCache.data.compareData;
        }
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: tableData,
            height: 'full-' + heightGap,
            cols: cols,
            layFilter: moduleCache.tableLayId + "LayFilter",
            done: function () {
                if (loading) {
                    layui.layer.close(loading);
                }
                var currentTableDom = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']"),
                    colorArray = commonModule.getChartColors();
                currentTableDom.find(".layui-table-body td").css({padding: "5px 0px"});
                currentTableDom.find(".layui-table-cell").css({padding: "0px 5px"});
                if (activeTableModel == "compare") {
                    $.each(moduleCache.data.hasSelectedItems, function (index, item) {
                        if (item.isActive) {
                            currentTableDom.find("th[data-field*='_" + item.itemId + "']").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                            currentTableDom.find("td[data-field*='_" + item.itemId + "']").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                        }
                    });
                }
                $(".wxr-tool-dialog-content-wrapper .wxr-dialog-sidebar").css({height: $(".wxr-tool-dialog-content-wrapper .wxr-dialog-main").height()});
            },
            initSort: {
                field: 'dateTime',
                type: "desc"
            }
        };
        if (activeTableModel == "compare") {
            renderTableOptions.skin = "";
        }
        commonModule.renderTable(renderTableOptions, layero);
    }

    return {
        init: function () {
            var targetDom = $("#itemAnalysisTrend .oui-card-header-item.oui-card-header-item-pull-right"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "after", buttons, true, function (targetDom) {

            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  监控品牌
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var ciBrandMonitorModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "监控品牌 | 品牌列表",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        tableData: {
            pages: {},
            total: []
        }, // 弹出框的表格需要的数据
        localCacheKey: "", // 组装好的localStorage的缓存key
        maxPageNo: 1, // 分页的最大值
        tableElementId: "ci-item-monitor-table", //table的dom控件的id属性
        tableLayId: "ciItemMonitorTable" //table在layui中定义的id，即lay-ui属性
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存数据
        assembleCacheData();
        // 转换指数
        transformData();
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogOptions = {
            title: dialogTitle,
            area: ['96%', '80%'],
            // offset: "100px",
            content: "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                renderTable(layero);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        var localCacheKey = globalUrlPrefix + "/mc";
        if (moduleCache.urlParams.dateType == "today") {
            localCacheKey += "/live";
        }
        localCacheKey += "/ci/brand/monitor/list.json?";
        if (moduleCache.urlParams.dateType != "today") {
            var type = "all", tabText = $("#completeBrand .oui-card-header-item.oui-card-header-item-pull-left .oui-tab-switch-item-active").text();
            if (tabText.indexOf("全部监控品牌") != -1) {
                type = "all";
            } else if (tabText.indexOf("排名增长") != -1) {
                type = "rankIncrease";
            }  else if (tabText.indexOf("交易突增") != -1) {
                type = "tradeIncrease";
            } else if (tabText.indexOf("流量突增") != -1) {
                type = "flowIncrease";
            }
            localCacheKey += "type=" + type;
        }
        if (localCacheKey.indexOf("?", localCacheKey.length - 1) == -1) {// 不是以问号结尾，要加上&
            localCacheKey += "&";
        }
        localCacheKey += "dateRange=" + moduleCache.urlParams.dateRange + "&dateType=" + moduleCache.urlParams.dateType;
        var cacheKeyPageAndSortParams = commonModule.getCachePageAndSortParams($("#mqBrandMonitor"));
        moduleCache.maxPageNo = cacheKeyPageAndSortParams.maxPageNo;
        moduleCache.currentPageNo = cacheKeyPageAndSortParams.pageNo;
        localCacheKey += "&pageSize=10&page=1" +
            "&order=" + cacheKeyPageAndSortParams.order + "&orderBy=" + cacheKeyPageAndSortParams.orderBy +
            "&device=" + moduleCache.urlParams.device + "&cateId=" + moduleCache.urlParams.cateId +
            "&sellerType=" + moduleCache.urlParams.sellerType + "&indexCode=" + cacheKeyPageAndSortParams.indexCode;
        // 遍历localStorage，获取所有页的缓存，注意初次找到相关缓存是需要对分页数据和汇总数据的集合进行初始化
        var count = 0;
        for (var i = 1; i <= moduleCache.maxPageNo; i++) {
            var pageCacheUrl = localCacheKey.replace(/&page=\S+&order=/, "&page=" + i + "&order="),
                decodeJsonData = commonModule.getUsableOriginalJsonDataFromCache(pageCacheUrl, true);
            if (decodeJsonData) {
                count++;
                if (count == 1) {// 初次找到相关缓存
                    moduleCache.tableData.pages = {}, moduleCache.tableData.total = [];
                }
                var finalData = decodeJsonData.data;
                if (moduleCache.urlParams.dateType == "today") {
                    finalData = decodeJsonData.data.data;
                }
                moduleCache.tableData.pages[i] = finalData;
                moduleCache.tableData.total.push.apply(moduleCache.tableData.total, finalData);
            }
        }
        transformData();
    }


    function transformData() {
        var willTransformData = moduleCache.tableData.total;
        for (var i in willTransformData) {
            var data = willTransformData[i];
            commonModule.indexCodeValueTransform(data);
            data.cateRankIdValue = data.cateRankId ? (data.cateRankId.value ? Number(data.cateRankId.value) : 0) : 0;
        }
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var heightGap = ($(window).height() * 0.2 + 104).toFixed(0),
            cols = [[
                {
                    field: "name", title: "品牌名称", minWidth: 250, templet: function (row) {
                        var compareText = "";
                        if (moduleCache.urlParams.dateType != "today") {
                            compareText = "--" + commonModule.getCompareText(moduleCache.urlParams.dateType);
                        }
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='//img.alicdn.com/tps/" + row.brandModel.logo + "'/>" +
                            "<span>" + row.brandModel.brandName + "</span></div>";
                        // return "<div style='display: flex'><div><img class='image-box image-box-36' src='" + row.item.pictUrl + "'></div><div><div style='overflow: hidden;text-overflow: ellipsis'>" + row.item.title + "</div><div>" + row.shop.title + "</div></div></div>"
                    }
                },
                {
                    field: "cateRankIdValue", title: "行业排名", minWidth: 110, sort: true, templet: function (row) {
                        var cateRankIdValue, cateRankIdCycleCqc, className = "wxr-font-small-normal-color";
                        if (row.cateRankId) {
                            if (row.cateRankId.value != null && row.cateRankId.value != undefined) {
                                cateRankIdValue = row.cateRankId.value;
                            } else {
                                cateRankIdValue = "-";
                            }
                            if (row.cateRankId.cycleCqc != null && row.cateRankId.cycleCqc != undefined) {
                                cateRankIdCycleCqc = row.cateRankId.cycleCqc;
                            } else {
                                cateRankIdCycleCqc = "-";
                            }
                        } else {
                            cateRankIdValue = "-", cateRankIdCycleCqc = "-";
                        }
                        if (cateRankIdCycleCqc < 0) {
                            className = "wxr-font-small-red-color";
                            cateRankIdCycleCqc = "升" + Math.abs(cateRankIdCycleCqc) + "名";
                        } else if (cateRankIdCycleCqc > 0) {
                            className = "wxr-font-small-green-color";
                            cateRankIdCycleCqc = "降" + cateRankIdCycleCqc + "名";
                        } else if (cateRankIdCycleCqc == 0) {
                            cateRankIdCycleCqc = "持平";
                        }
                        return "<ul><li>" + cateRankIdValue + "\n</li><li class='" + className + "'>" + cateRankIdCycleCqc + "\n</li></ul>";
                    }
                },
                {field: "tradeIndexValue", title: "交易金额", minWidth: 110, sort: true, templet: function (row) {
                        if (moduleCache.urlParams.dateType != "today") {
                            var cycleCrc = row.tradeIndex.cycleCrc;
                            if (cycleCrc) {
                                cycleCrc = (row.tradeIndex.cycleCrc * 100).toFixed(2) + "%";
                            } else {
                                cycleCrc = "-";
                            }
                            return "<ul><li>" + (!row.tradeIndexValue ? "-" : row.tradeIndexValue) + "\n</li><li class='wxr-table-increase-percent-text'>" + cycleCrc + "\n</li></ul>";
                        } else {
                            return (!row.tradeIndexValue ? "-" : row.tradeIndexValue);
                        }
                    }},
                {field: "uvIndexValue", title: "访客人数", minWidth: 110, sort: true, templet: function (row) {
                        if (moduleCache.urlParams.dateType != "today") {
                            var cycleCrc = row.uvIndex.cycleCrc;
                            if (cycleCrc) {
                                cycleCrc = (row.uvIndex.cycleCrc * 100).toFixed(2) + "%";
                            } else {
                                cycleCrc = "-";
                            }
                            return "<ul><li>" + (!row.uvIndexValue ? "-" : row.uvIndexValue) + "\n</li><li class='wxr-table-increase-percent-text'>" + cycleCrc + "\n</li></ul>";
                        } else {
                            return (!row.uvIndexValue ? "-" : row.uvIndexValue);
                        }
                    }},
                {field: "seIpvUvHitsValue", title: "搜索人数", minWidth: 110, sort: true, templet: function (row) {
                        if (moduleCache.urlParams.dateType != "today") {
                            var cycleCrc = row.seIpvUvHits.cycleCrc;
                            if (cycleCrc) {
                                cycleCrc = (row.seIpvUvHits.cycleCrc * 100).toFixed(2) + "%";
                            } else {
                                cycleCrc = "-";
                            }
                            return "<ul><li>" + (!row.seIpvUvHitsValue ? "-" : row.seIpvUvHitsValue) + "\n</li><li class='wxr-table-increase-percent-text'>" + cycleCrc + "\n</li></ul>";
                        } else {
                            return (!row.seIpvUvHitsValue ? "-" : row.seIpvUvHitsValue);
                        }
                    }},
                {field: "cltHitsValue", title: "收藏人数", minWidth: 110, sort: true, templet: function (row) {
                        if (moduleCache.urlParams.dateType != "today") {
                            var cycleCrc = row.cltHits.cycleCrc;
                            if (cycleCrc) {
                                cycleCrc = (row.cltHits.cycleCrc * 100).toFixed(2) + "%";
                            } else {
                                cycleCrc = "-";
                            }
                            return "<ul><li>" + (!row.cltHitsValue ? "-" : row.cltHitsValue) + "\n</li><li class='wxr-table-increase-percent-text'>" + cycleCrc + "\n</li></ul>";
                        } else {
                            return (!row.cltHitsValue ? "-" : row.cltHitsValue);
                        }
                    }},
                {field: "cartHitsValue", title: "加购人数", minWidth: 110, sort: true, templet: function (row) {
                        if (moduleCache.urlParams.dateType != "today") {
                            var cycleCrc = row.cartHits.cycleCrc;
                            if (cycleCrc) {
                                cycleCrc = (row.cartHits.cycleCrc * 100).toFixed(2) + "%";
                            } else {
                                cycleCrc = "-";
                            }
                            return "<ul><li>" + (!row.cartHitsValue ? "-" : row.cartHitsValue) + "\n</li><li class='wxr-table-increase-percent-text'>" + cycleCrc + "\n</li></ul>";
                        } else {
                            return (!row.cartHitsValue ? "-" : row.cartHitsValue);
                        }
                    }},
                {field: "payRateIndexValue", title: "支付转化率", minWidth: 130, sort: true, isPercentValue: true, templet: function (row) {
                        if (moduleCache.urlParams.dateType != "today") {
                            var cycleCrc = row.payRateIndex.cycleCrc;
                            if (cycleCrc) {
                                cycleCrc = (row.payRateIndex.cycleCrc * 100).toFixed(2) + "%";
                            } else {
                                cycleCrc = "-";
                            }
                            return "<ul><li>" + (!row.payRateIndexValue ? "-" : row.payRateIndexValue.toFixed(2) + "%") + "\n</li><li class='wxr-table-increase-percent-text'>" + cycleCrc + "\n</li></ul>";
                        } else {
                            return (!row.payRateIndexValue ? "-" : row.payRateIndexValue.toFixed(2) + "%");
                        }
                    }},
                {field: "payByrCnt", title: "支付人数", minWidth: 110, sort: true},
                {field: "perTicketSales", title: "客单价", minWidth: 110, sort: true},
                {field: "uvValue", title: "uv价值", minWidth: 110, sort: true},
                {field: "seIpvUvHitsRate", title: "搜素占比", minWidth: 110, sort: true, isPercentValue: true},
                {field: "cltCntRate", title: "收藏率", minWidth: 110, sort: true, isPercentValue: true},
                {field: "addCartRate", title: "加购率", minWidth: 110, sort: true, isPercentValue: true}
            ]];
        // console.log(moduleCache.tableData[moduleCache.activeTabCode].total);
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: moduleCache.tableData.total,
            height: 'full-' + heightGap,
            // showSearchInput: false,// 扩展字段
            cols: cols,
            done: function () {
                if (moduleCache.maxPageNo > 1) {
                    drawCachePageBar(heightGap, cols);
                }
            }
        };
        var inst = commonModule.renderTable(renderTableOptions, layero);
    }

    function drawCachePageBar(heightGap, cols) {
        $(".wxr-table-bottom-page-number-bar").append("<div id='selfPageBar'></div>");
        layui.laypage.render({
            elem: "selfPageBar",
            // prev: "&#8592",
            // next: "&#8594",
            layout: ['page'],
            curr: moduleCache.currentPageNo,
            limit: 10,
            count: moduleCache.maxPageNo * 10,
            // limits: [5, 10, 20, 50, 100],
            jump: function (obj, first) {
                // 页码添加未缓存标志
                $("#selfPageBar .layui-laypage a").each(function (index) {
                    var className = $(this).attr("class"), pageNo = $(this).text();
                    if (className && (className.indexOf("layui-laypage-prev") != -1 ||
                        className.indexOf("layui-laypage-next") != -1)) {
                        return true;
                    }
                    var pageData = moduleCache.tableData.pages[pageNo];
                    if (!pageData) {
                        // $(this).css({"opacity": "0.5", "filter":"alpha(opacity=50)", "background":"gray", "color":"#fff"});
                        $(this).css("position", "relative");
                        $(this).append("<i class='layui-badge-dot' style='position: absolute;top:4px;right: 2px'></i>");
                    }
                });
                if (!first) {
                    // 同步点击生意参谋页面的第几页按钮
                    $("#mqBrandMonitor .alife-dt-card-common-table-pagination-wrapper .ant-pagination-item")
                        .each(function (index) {
                            if ($(this).text() == obj.curr) {
                                $(this).trigger("click");
                                var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0}), count = 0;
                                function myTimer() {
                                    var timer = setTimeout(function () {
                                        assembleCacheData();
                                        if (!moduleCache.tableData.pages[String(obj.curr)]) {
                                            count++;
                                            if (count > 40) {
                                                layui.layer.msg('数据获取超时', {
                                                    offset: 't',
                                                    anim: 6
                                                });
                                                layui.layer.close(loading);
                                                return;
                                            }
                                            myTimer();
                                        } else {
                                            renderTable();
                                            layui.layer.close(loading);
                                        }
                                    }, 500);
                                }
                                myTimer();
                            }
                        });
                }
            }
        });
    }

    return {
        init: function () {
            var targetDom = $("#completeBrand .oui-card-header-item.oui-card-header-item-pull-right").eq(0),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "after", buttons, true, function () {

            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  竞争-品牌识别
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var brandRecognitionModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "竞店识别",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        // mergeData: {},// 年龄-性别与年龄-城市数据的合并
        data: {
            hasSelectedBrands: [],// 曾经选择过的品牌
            mergeData: [],
            compareData: [],
            // activeShops: {} // 被选中的店铺
        },// 表格展示需要的数据
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "brand-recognition-table", //table的dom控件的id属性
        tableLayId: "brandShopRecognitionTable", //table在layui中定义的id，即lay-ui属性
        tabElementId: "brand-recognition-tab",
        chartElementId: "brand-recognition-trend-chart",
        statisticEndTimeStr: "",
        sortedIndexCards: [
            {indexCode: "tradeIndex", indexName: "交易金额", isActive: true},
            {indexCode: "uvIndex", indexName: "访客人数"},
            {indexCode: "payByrCntIndex", indexName: "支付人数"},
            {indexCode: "payRateIndex", indexName: "支付转化率", isPercentValue: true},
            {indexCode: "perTicketSales", indexName: "客单价"},
            {indexCode: "uvValue", indexName: "uv价值"}
        ]
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + (moduleCache.urlParams.activeKey == "drain" ? "流失竞店" : "高潜竞店") +
                " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogWidth;
        var dialogOptions = {
            title: dialogTitle,
            area: ['96%', '96%'],
            // offset: "100px",
            content: "<div class='wxr-dialog-sidebar'><div class='wxr-dialog-sidebar-inner'><ul></ul></div></div><div class='wxr-dialog-main'>" +
                "<div id='wxr-dialog-side-button'><i class='layui-icon layui-icon-spread-left' title='展开'></i></div>" +
                "<div class='wxr-cards-container'></div>" +
                "<div class='wxr-charts-container' id='" + moduleCache.chartElementId + "'></div>" +
                "<div id='" + moduleCache.tabElementId + "' class='layui-tab layui-tab-brief' lay-filter='tabLayFilter'><ul class='layui-tab-title'><li class='layui-this' value='merge'>合并模式</li><li value='compare'>对比模式</li></ul></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div></div>",
            success: function (layero, index) {
                var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0});
                setTimeout(function () {
                    try {
                        sideButtonEventBind();
                        drawDialogPageLeft();
                        drawIndexCards();
                        renderChart();
                        renderTabs();
                        renderTable(loading, layero);
                    } catch (e) {
                        layui.layer.close(loading);
                    }
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    function sideButtonEventBind() {
        $("#wxr-dialog-side-button .layui-icon").on("click", function () {
            if ($(this).hasClass("layui-icon-spread-left")) {
                $(this).removeClass("layui-icon-spread-left");
                $(this).addClass("layui-icon-shrink-right");
                $(this).attr("title", "折叠");
                // $(".dialog-sidebar").show(500, function () {
                //     $(".dialog-main").css({paddingLeft: "240px"});
                // });
                $(".wxr-dialog-sidebar").animate({
                    width: '260px', opacity: 'show'
                }, 500, function () {
                    $(".wxr-dialog-main").css({paddingLeft: "260px"});
                    $("#wxr-dialog-side-button").css({paddingLeft: "270px"});
                    var chartInstance = echarts.getInstanceByDom($("#" + moduleCache.chartElementId)[0]);
                    if (chartInstance) {
                        chartInstance.resize();
                    }
                    layui.table.resize(moduleCache.tableLayId);
                });
            } else if ($(this).hasClass("layui-icon-shrink-right")) {
                $(this).removeClass("layui-icon-shrink-right");
                $(this).addClass("layui-icon-spread-left");
                $(this).attr("title", "展开");
                // $(".dialog-sidebar").hide(500, function () {
                //     $(".dialog-main").css({paddingLeft: "0px"});
                // });
                $(".wxr-dialog-sidebar").animate({
                    width: '0px', opacity: 'hide'
                }, 500, function () {
                    $(".wxr-dialog-main").css({paddingLeft: "0"});
                    $("#wxr-dialog-side-button").css({paddingLeft: "10px"});
                    var chartInstance = echarts.getInstanceByDom($("#" + moduleCache.chartElementId)[0]);
                    if (chartInstance) {
                        chartInstance.resize();
                    }
                    layui.table.resize(moduleCache.tableLayId);
                });
            }

        });
        // $("#wxr-dialog-side-button .layui-icon").trigger("click");
    }

    function renderTabs() {
        $("#" + moduleCache.tabElementId).css({padding: "5px 0px"});
        if ($(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length <= 1) {
            $("#" + moduleCache.tabElementId + " li:last").addClass("wxr-tab-disabled");
        }
        layui.element.on("tab(tabLayFilter)", function () {
            renderTable();
        });
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        moduleCache.data.hasSelectedBrands = [];
        var brandPotentialListCacheKey = globalUrlPrefix + "/mc/ci/brand/recognition", brandPotentialListData, dateRangeEndPoint = moduleCache.urlParams.dateRange.split("|")[1].replace(/-/g, "/"),
            endDate = new Date(dateRangeEndPoint), startDate = endDate.setDate(endDate.getDate() - 29),
            dateRangeStartPoint = endDate.getFullYear() + "-" + ((endDate.getMonth() + 1) < 10 ? "0"
                + (endDate.getMonth() + 1) : (endDate.getMonth() + 1)) + "-" + (endDate.getDate() < 10 ?
                "0" + endDate.getDate() : endDate.getDate()), newDateRange = dateRangeStartPoint + "|" + moduleCache.urlParams.dateRange.split("|")[1];
        brandPotentialListCacheKey += "/getPotentialList.json?page=1&pageSize=30&indexCode=tradeIndex,tradeGrowthRange&orderBy=tradeGrowthRange&order=desc" +
            "&dateType=recent30&dateRange=" + newDateRange + "&device=" + moduleCache.urlParams.device + "&sellerType="
            + moduleCache.urlParams.sellerType + "&cateId=" + moduleCache.urlParams.cateId;
        brandPotentialListData = commonModule.getUsableOriginalJsonDataFromCache(brandPotentialListCacheKey, true);
        var selectedBrandsTempArray = [];
        if (brandPotentialListData) {
            var trendCacheKey = globalUrlPrefix + "/mc/ci/brand/trend.json?dateType=" + moduleCache.urlParams.dateType
                + "&dateRange=" + (moduleCache.statisticEndTimeStr + "|" + moduleCache.statisticEndTimeStr) + "&cateId=" + moduleCache.urlParams.cateId
                + "&brandId=&device=" + moduleCache.urlParams.device + "&sellerType=" + moduleCache.urlParams.sellerType
                + "&indexCode=uvIndex,payRateIndex,tradeIndex,payByrCntIndex",
                currentBrandName = $("#drainRecognition .alife-dt-card-sycm-common-select .sycm-common-shop-td").attr("title");
            for (var i in brandPotentialListData) {
                var brandItem = brandPotentialListData[i], thisBrandTrendCacheKey = trendCacheKey.replace(/&brandId\S+&device/,
                    "&brandId=" + brandItem.brandId + "&device"),
                    thisBrandTrendData = commonModule.getUsableOriginalJsonDataFromCache(thisBrandTrendCacheKey, true);
                if (brandItem.brandModel.brandName == currentBrandName) {
                    brandItem.brandModel.isActive = true;
                }
                if (thisBrandTrendData) {
                    brandItem.brandModel.trendData = thisBrandTrendData;
                    moduleCache.data.hasSelectedBrands.push(brandItem.brandModel);
                }
            }
        }
        // 临时存储集合，窄化集合大小，加快遍历速度
        // var trendDataKeyTempArray = [], selectedShopsTempArray = [],
        //     currentShopName = $("#drainRecognition .alife-dt-card-sycm-common-select .sycm-common-shop-td").attr("title");
        // // 寻找所有已选择过的店铺
        // for (var i = 0; i < localStorage.length; i++) {
        //     var key = localStorage.key(i);
        //     if (key.indexOf("/mc/ci/config/rival/shop/getSingleMonitoredInfo.json?") != -1) {
        //         var data = commonModule.getUsableOriginalJsonDataFromCache(key, true);
        //         if (data) {
        //             if (data.name == currentShopName) {
        //                 data.isActive = true;
        //             }
        //             selectedShopsTempArray.push(data);
        //         }
        //     }
        //     if (key.indexOf("/mc/ci/shop/trend.json?") != -1) {
        //         trendDataKeyTempArray.push(key);
        //     }
        // }
        // 查找店铺所对应的趋势数据
        // var existObj = {};// 去重
        // for (var i in selectedShopsTempArray) {
        //     var shopItem = selectedShopsTempArray[i];
        //     for (var j in trendDataKeyTempArray) {
        //         var key = trendDataKeyTempArray[j];
        //         if (key.indexOf(shopItem.userId) != -1 && key.indexOf(moduleCache.statisticEndTimeStr) != -1) {
        //             var trendData = commonModule.getUsableOriginalJsonDataFromCache(key, true);
        //             if (trendData) {
        //                 if (existObj[shopItem.userId]) {
        //                     break;
        //                 }
        //                 existObj[shopItem.userId] = true;
        //                 shopItem.trendData = trendData;
        //                 moduleCache.data.hasSelectedShops.push(shopItem);
        //             }
        //         }
        //     }
        // }
        transformData();
    }

    function transformData() {
        if (moduleCache.data.hasSelectedBrands.length == 0) {
            return;
        }
        var trendDataLength = moduleCache.data.hasSelectedBrands[0].trendData.tradeIndex.length;
        moduleCache.dateTimes = commonModule.generateStatisticTimes(trendDataLength, moduleCache.statisticEndTimeStr, moduleCache.urlParams.dateType);
        moduleCache.data.mergeData = [], moduleCache.data.compareData = [];
        var chartHexColors = commonModule.getChartColors().hex;
        for (var j = 0; j < trendDataLength; j++) {
            var compareDataItem = {dateTime: moduleCache.dateTimes[j]};
            $.each(moduleCache.data.hasSelectedBrands, function (index, item) {
                // if (item.isDataTransformCompleted) {
                //     return true;
                // }
                if (j == 0) {// 第一次要重新初始化店铺相关数据
                    item.alias = "品牌" + (index + 1);
                    item.backgroundColor = chartHexColors[index % chartHexColors.length];
                    // 为每个品牌准备一个已转化的趋势数据集合
                    item.transformTrendData = {};
                    // 每个品牌单独存储一份自己店铺的合并数据
                    item.mergeData = [];
                }
                if (!item.isActive) {
                    return true;
                }
                var trendData = item.trendData, mergeDataItem = {
                    brandName: item.brandName,
                    type: item.alias,
                    dateTime: moduleCache.dateTimes[j],
                    brandId: item.brandId,
                    typeIndex: index,
                    backgroundColor: item.backgroundColor
                };
                // 对趋势数据中原有的指标的当前循环索引进行转换
                for (var indexCode in trendData) {
                    var indexValue = trendData[indexCode][j];
                    if (indexCode != "payRateIndex") {
                        indexValue = commonModule.calculateFormula(indexValue, 1, 0);
                    } else {
                        indexValue = commonModule.calculateFormula(indexValue, 0, 2);
                    }
                    if (!item.transformTrendData[indexCode]) {
                        item.transformTrendData[indexCode] = [];
                    }
                    item.transformTrendData[indexCode].push(indexValue);
                    mergeDataItem[indexCode] = indexValue;
                    compareDataItem[indexCode + "_" + item.brandId] = indexValue;
                }
                // 原有的指标转化完毕之后，计算客单价和uv价值
                if (!item.transformTrendData.uvValue) {
                    item.transformTrendData.uvValue = [];
                }
                mergeDataItem.uvValue = !mergeDataItem.uvIndex ? 0 : Number((mergeDataItem.tradeIndex / mergeDataItem.uvIndex).toFixed(2));
                compareDataItem["uvValue_" + item.brandId] = mergeDataItem.uvValue;
                item.transformTrendData.uvValue.push(mergeDataItem.uvValue);
                if (!item.transformTrendData.perTicketSales) {
                    item.transformTrendData.perTicketSales = [];
                }
                mergeDataItem.perTicketSales = !mergeDataItem.payByrCntIndex ? 0 : Number((mergeDataItem.tradeIndex / mergeDataItem.payByrCntIndex).toFixed(2));
                compareDataItem["perTicketSales_" + item.brandId] = mergeDataItem.perTicketSales;
                item.transformTrendData.perTicketSales.push(mergeDataItem.perTicketSales);
                item.mergeData.push(mergeDataItem);
                moduleCache.data.mergeData.push(mergeDataItem);
                // 店铺的所有指标数据已转化完毕，汇总一下数据
                if (j == trendDataLength - 1) {
                    for (var indexCode in item.transformTrendData) {
                        item[indexCode + "_total"] = eval(item.transformTrendData[indexCode].join("+"));
                    }
                    // 除了交易金额、访客人数、支付人数之外，支付转化率、uv价值以及客单价都需要按月份数据汇总之后重新计算
                    item["payRateIndex_total"] = !item["uvIndex_total"] ? 0 : Number((item["payByrCntIndex_total"] / item["uvIndex_total"] * 100).toFixed(2));
                    item["uvValue_total"] = !item["uvIndex_total"] ? 0 : Number((item["tradeIndex_total"] / item["uvIndex_total"]).toFixed(2));
                    item["perTicketSales_total"] = !item["payByrCntIndex_total"] ? 0 : Number((item["tradeIndex_total"] / item["payByrCntIndex_total"]).toFixed(2));
                    item.isDataTransformCompleted = true;
                }
            });
            moduleCache.data.compareData.push(compareDataItem);
        }
    }

    function drawDialogPageLeft() {
        var searchShopInputDom = "<li><div style='position:relative;'><input class='wxr-side-bar-search-input layui-input' style='padding: 0px 10px 0px 30px' placeholder='搜索名称/ID'><i class='layui-icon layui-icon-search' style='color: #1E9FFF;position: absolute;top: 10px;left: 8px;font-size: 16px'></i></div></li>";
        $(".wxr-dialog-sidebar-inner>ul").append(searchShopInputDom);
        $.each(moduleCache.data.hasSelectedBrands, function (index, item) {
            var singleBrandpDom = $("<li id='" + item.brandId + "-" + item.brandName + "' class='shop-display-item'><div style='display: inline-block;'><img class='wxr-image-box wxr-image-box-36' src='" + item.pictureUrl + "'/></div>" +
                "<div style='display: inline-block; vertical-align: middle;width: 70%'><ul><li style='padding-bottom: 5px'>"
                 + item.brandName + "</li><li><span class='wxr-text-color-block'>" + item.alias +
                "</span></li></ul></div><i class='layui-icon layui-icon-circle' style='width: 15%'></i></li>");
            if (item.isActive) {
                singleBrandpDom.find(".layui-icon").removeClass("layui-icon-circle");
                singleBrandpDom.find(".layui-icon").addClass("layui-icon-ok-circle");
                // moduleCache.data.activeShops[item.userId] = item;
            }
            singleBrandpDom.find(".wxr-text-color-block").css({backgroundColor: item.backgroundColor});
            singleBrandpDom.find(".layui-icon").on("click", function () {
                if ($(this).hasClass("layui-icon-ok-circle")) {
                    if ($(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length > 1) {
                        $(this).removeClass("layui-icon-ok-circle");
                        $(this).addClass("layui-icon-circle");
                        item.isActive = false;
                    } else {
                        return;
                    }
                } else {
                    $(this).removeClass("layui-icon-circle");
                    $(this).addClass("layui-icon-ok-circle");
                    item.isActive = true;
                }
                if ($(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length <= 1) {
                    $("#" + moduleCache.tabElementId + " li:last").addClass("wxr-tab-disabled");
                } else {
                    $("#" + moduleCache.tabElementId + " li:last").removeClass("wxr-tab-disabled");
                }
                var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0});
                // transformData();
                setTimeout(function () {
                    transformData();
                    drawIndexCards();
                    renderChart();
                    renderTable(loading);
                }, 100);
            });
            // 图片加载不成功则显示默认图片
            singleBrandpDom.find("img").on("error", function () {
                $(this).attr("src", "//img.alicdn.com/tps/TB1P1W_LXXXXXXoXVXXXXXXXXXX-74-74.png_48x48.jpg");
            });
            $(".wxr-dialog-sidebar-inner>ul").append(singleBrandpDom);
        });
        var searchInputDom = $(".wxr-dialog-sidebar-inner>ul .wxr-side-bar-search-input"),
            inputCompletedFlag = true;
        searchInputDom.on("compositionstart", function () {
            inputCompletedFlag = false;
        });
        searchInputDom.on("compositionend", function () {
            inputCompletedFlag = true;
        });
        searchInputDom.on("input propertychange", function () {
            setTimeout(function () {
                var searchText = searchInputDom.val();
                if (inputCompletedFlag) {
                    if (!searchText) {
                        $(".wxr-dialog-sidebar-inner>ul .shop-display-item").show();
                        return;
                    }
                    $(".wxr-dialog-sidebar-inner>ul .shop-display-item").hide();
                    $(".wxr-dialog-sidebar-inner>ul li[id*=" + searchText + "]").show();
                }
            }, 10);
        });
    }

    function drawIndexCards() {
        // 已选中的指标块初始化
        moduleCache.activeIndexCards = {};
        $(".wxr-cards-container").html("");
        // var sortedIndexCards = assembleIndexCards();
        // 计算每个小块宽度的百分比
        var cardItemWrapperPercent = (100 / moduleCache.sortedIndexCards.length).toFixed(4);
        // 舍去最后一位，防止宽度超出
        cardItemWrapperPercent = cardItemWrapperPercent.substring(0, cardItemWrapperPercent.length - 2);
        $(".wxr-cards-container").css({width: "96%", padding: "0px 35px"});
        // for (var i in moduleCache.firstLevelCategoryArray) {
        $.each(moduleCache.sortedIndexCards, function (index, indexItem) {
            var cardItemWrapper = $("<div class='wxr-card-item-wrapper' style='width: " +
                cardItemWrapperPercent + "%'></div>"),
                // cardItemBody = $("<div class='wxr-card-item-body wxr-card-item-body-solid'><i class='layui-icon layui-icon-ok-circle wxr-card-item-body-icon'></i></div>");
                cardItemBody = $("<div class='wxr-card-item-body wxr-card-item-body-solid'></div>");
            cardItemWrapper.append(cardItemBody);
            if (indexItem.isActive) {
                cardItemBody.addClass("wxr-card-item-body-active");
                cardItemBody.find(".wxr-card-item-body-icon").addClass("wxr-card-item-body-icon-checked");
                moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
            }
            // 填充内容
            var bodyContent = $("<ul><li class='wxr-card-item-body-title'><div class='wxr-text-ellipsis' title='" + indexItem.indexName + "'>" + indexItem.indexName + "</div><div class='wxr-text-ellipsis'>汇总</div></li>" +
                // "<li class='wxr-card-item-body-data' style='font-size: 18px;line-height: 20px;color: #0C0C0C'><div class='wxr-text-ellipsis'>" + indexItem.indexValue + "</div></li>" +
                // "<li class='wxr-card-item-body-data' style='font-size: 12px'><div class='wxr-text-ellipsis'>" + indexItem.compareText + "</div><div class='wxr-text-ellipsis'>" + indexItem.indexCycleCrc + "<i class='" + indexItem.cycleCrcIconClassName + "'></i></div></li>" +
                "</ul>");
            $.each(moduleCache.data.hasSelectedBrands, function(brandIndex, brandItem) {
                if (brandItem.isActive) {
                    bodyContent.append("<li class='wxr-card-item-body-data'><div class='wxr-text-ellipsis' title='" + brandItem.alias + "'>" + brandItem.alias + "</div><div class='wxr-text-ellipsis'>" + brandItem[indexItem.indexCode + "_total"] + (indexItem.isPercentValue ? "%" : "") + "</div></li>");
                }
            });
            bodyContent.find("li").each(function (index, item) {
                $(this).css({margin: "4px 0px"});
                if ($(this).find("div").length == 2) {
                    $(this).find("div:first-child").css({width: "40%"});
                    $(this).find("div:nth-child(2)").css({width: "60%", textAlign: "right"});
                }
            });
            // bodyContent.find(".wxr-card-item-body-data").css({color: "#ffffff"});
            cardItemBody.append(bodyContent);
            $(".wxr-cards-container").append(cardItemWrapper);
            // 点击事件绑定
            cardItemBody.on("click", function () {
                var activeBrandCount = $(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length;
                // $(".wxr-cards-container .wxr-card-item-body").removeClass("wxr-card-item-body-active");
                if (activeBrandCount > 1) {// 每次只能选中一个指标
                    $(".wxr-cards-container .wxr-card-item-body-active").removeClass("wxr-card-item-body-active");
                    $(".wxr-cards-container .layui-icon-ok-circle").removeClass("wxr-card-item-body-icon-checked");
                    $(this).addClass("wxr-card-item-body-active");
                    $(this).find(".layui-icon-ok-circle").addClass("wxr-card-item-body-icon-checked");
                    moduleCache.activeIndexCards = {};
                    moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                } else {// 可选中多个指标
                    if ($(this).hasClass("wxr-card-item-body-active")) {
                        if ($(".wxr-cards-container .wxr-card-item-body-active").length > 1) {
                            $(this).removeClass("wxr-card-item-body-active");
                            cardItemBody.find(".layui-icon-ok-circle").removeClass("wxr-card-item-body-icon-checked");
                            delete moduleCache.activeIndexCards[indexItem.indexCode];
                        }
                    } else {
                        $(this).addClass("wxr-card-item-body-active");
                        cardItemBody.find(".layui-icon-ok-circle").addClass("wxr-card-item-body-icon-checked");
                        moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                    }
                }
                renderChart();
            });
        });
    }

    function renderChart() {
        var thisChart = echarts.init($("#" + moduleCache.chartElementId + "")[0]),
            xAxisData = moduleCache.dateTimes, seriesDataArray = [], count = 0, interval = 1;
        if (moduleCache.urlParams.dateType == "day" || moduleCache.urlParams.dateType == "recent7" || moduleCache.urlParams.dateType == "recent30") {
            interval = 3;
        }
        var activeShopCount = $(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length, colorArray = [];
        if (activeShopCount > 1) {
            count = 1;
            for (var i in moduleCache.data.hasSelectedBrands) {
                var brandItem = moduleCache.data.hasSelectedBrands[i];
                if (!brandItem.isActive) {
                    continue;
                }
                // 当前选中的指标code，只能选中一个
                var activeIndexCode = Object.keys(moduleCache.activeIndexCards)[0],
                    seriesObj = {
                        name: brandItem.alias,
                        type: 'line',
                        data: brandItem.transformTrendData[activeIndexCode],
                        smooth: true,
                        symbol: "circle",
                        showSymbol: false,
                        symbolSize: 6
                    };
                seriesDataArray.push(seriesObj);
                colorArray.push(brandItem.backgroundColor);
            }

        } else {
            var activeBrand;
            $.each(moduleCache.data.hasSelectedBrands, function (index, brandItem) {
                if (brandItem.isActive) {
                    activeBrand = brandItem;
                    return false;
                }
            });
            for (var indexCode in moduleCache.activeIndexCards) {
                var activeCardItem = moduleCache.activeIndexCards[indexCode], seriesObj = {
                    name: activeCardItem.indexName,
                    type: 'line',
                    data: activeBrand.transformTrendData[indexCode],
                    smooth: true,
                    symbol: "circle",
                    showSymbol: false,
                    symbolSize: 6,
                    yAxisIndex: count
                };
                seriesDataArray.push(seriesObj);
                count++;
            }
        }
        var chartOptions = {
            xAxis: {
                type: 'category',
                axisLabel: {
                    interval: interval
                },
                axisLine: {},
                data: xAxisData,
            },
            series: seriesDataArray
        };
        if (activeShopCount > 1) {
            chartOptions.color = colorArray;
        }
        commonModule.renderLineCharts(chartOptions, thisChart, count);
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(loading, layero) {
        var activeTableModel = $("#" + moduleCache.tabElementId + " .layui-this").attr("value"),
            cols, tableData = [];
        if (activeTableModel == "merge") {
            cols = [[
                {
                    field: 'brandName', title: "品牌名称", minWidth: 220, sort: true, templet: function (row) {
                        // return "<img src='" + row.shop.pictureUrl + "'/><span>" + row.shopName + "</span>";
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='" + row.shopPic + "'/>" +
                            "<span>" + row.brandName + "</span></div>";
                    }
                },
                {
                    field: "type", title: "类别", sort: true, minWidth: 120, templet: function (row) {
                        return "<span class='wxr-text-color-block' style='background: " + row.backgroundColor + "'>" + row.type + "</span>";
                    }
                },
                {field: "dateTime", title: "日期", sort: true, minWidth: 120},
                {field: "tradeIndex", title: "交易金额", minWidth: 110, sort: true},
                {field: "uvIndex", title: "访客人数", minWidth: 110, sort: true},
                {field: "payByrCntIndex", title: "支付人数", minWidth: 110, sort: true},
                {field: "payRateIndex", title: "支付转化率", minWidth: 110, sort: true, isPercentValue: true},
                {field: "perTicketSales", title: "客单价", minWidth: 110, sort: true},
                {field: "uvValue", title: "uv价值", minWidth: 110, sort: true}
            ]];
            tableData = moduleCache.data.mergeData;
        } else {
            cols = [[], []];
            cols[0].push({field: "dateTime", title: "日期", minWidth: 110, sort: true, rowspan: 2});
            for (var i in moduleCache.data.hasSelectedBrands) {
                var brandItem = moduleCache.data.hasSelectedBrands[i];
                if (brandItem.isActive) {
                    cols[0].push({title: "<div style='display: inline-block'><img class='wxr-image-box wxr-image-box-36' src='" +
                            brandItem.pictureUrl + "'/></div><div style='display: inline-block;vertical-align: middle'><ul><li><a href='" + brandItem.shopUrl + "' title='" + brandItem.brandName + "'>" + brandItem.brandName +
                            "</a></li><li>" + brandItem.brandId + "</li></ul></div><div style='float: right'><span class='wxr-text-color-block' style='background: " + brandItem.backgroundColor + "'>" + brandItem.alias +
                            "</span></div>", colspan: 6, field: "colspan_" + brandItem.userId});
                    cols[1].push.apply(cols[1], [
                        {field: "tradeIndex_" + brandItem.brandId, title: "交易金额", minWidth: 100, sort: true},
                        {field: "uvIndex_" + brandItem.brandId, title: "访客人数", minWidth: 100, sort: true},
                        {field: "payByrCntIndex_" + brandItem.brandId, title: "支付人数", minWidth: 100, sort: true},
                        {field: "payRateIndex_" + brandItem.brandId, title: "支付转化率", minWidth: 110, sort: true, isPercentValue: true},
                        {field: "perTicketSales_" + brandItem.brandId, title: "客单价", minWidth: 90, sort: true},
                        {field: "uvValue_" + brandItem.brandId, title: "uv价值", minWidth: 90, sort: true}
                    ]);
                }
            }
            tableData = moduleCache.data.compareData;
        }
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: tableData,
            height: '600',
            cols: cols,
            layFilter: moduleCache.tableLayId + "LayFilter",
            done: function () {
                if (loading) {
                    layui.layer.close(loading);
                }
                var currentTableDom = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']"), colorArray = commonModule.getChartColors();
                if (activeTableModel == "compare") {
                    $.each(moduleCache.data.hasSelectedBrands, function (index, item) {
                        if (item.isActive) {
                            currentTableDom.find("th[data-field*='_" + item.brandId + "']").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                            currentTableDom.find("td[data-field*='_" + item.brandId + "']").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                        }
                    });
                } else {

                }
                $(".wxr-tool-dialog-content-wrapper .wxr-dialog-sidebar").css({height: $(".wxr-tool-dialog-content-wrapper .wxr-dialog-main").height()});
            },
            initSort: {
                field: 'dateTime',
                type: "desc"
            }
        };
        if (activeTableModel == "compare") {
            renderTableOptions.skin = "";
        }
        commonModule.renderTable(renderTableOptions, layero);
    }

    return {
        init: function () {
            var targetDom = $("#drainRecognition .op-mc-rival-trend-analysis-info"),
                buttons = [
                    {btnName: "叶飞测试一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "append", buttons, false, function (targetDom) {
                var buttonInjectContainer = targetDom.parent().find(".wxr-tool-buttons-inject-container");
                buttonInjectContainer.find(".wxr-tool-name-container").remove();
                buttonInjectContainer.find(".layui-btn").eq(0).css({height: "32px", width: "140px"});
                buttonInjectContainer.css({margin: "17px 10px 0px 0px"});
            });
            // 第一次页面打开时做个标记，记住这个统计时间
            if ($(".ebase-FaCommonFilter__top .ebase-FaCommonFilter__item-date .page-first-open-flag").length == 0) {
                // 获取统计时间
                moduleCache.statisticEndTimeStr = $(".ebase-FaCommonFilter__right .oui-date-picker-current-date").text().replace("统计时间 ", "");
                $(".ebase-FaCommonFilter__top .ebase-FaCommonFilter__item-date").append("<span class='page-first-open-flag'></span>");
            }
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  竞争-品牌分析
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var brandAnalysisCoreIndexCompareModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "品牌分析 | 关键指标对比",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        data: {
            hasSelectedBrands: [],
            mergeData: [],
            compareData: [],
        },// 表格展示需要的数据
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "brand-analysis-core-index-compare-table", //table的dom控件的id属性
        tableLayId: "brandAnalysisCoreIndexCompareTable", //table在layui中定义的id，即lay-ui属性
        tabElementId: "brand-analysis-core-index-compare-tab",
        chartElementId: "brand-analysis-core-index-compare-trend-chart",
        statisticEndTimeStr: "",
        sortedIndexCards: [
            {indexCode: "tradeIndex", indexName: "交易金额", isActive: true},
            {indexCode: "uvIndex", indexName: "访客人数"},
            {indexCode: "payByrCntIndex", indexName: "支付人数"},
            {indexCode: "payRateIndex", indexName: "支付转化率", isPercentValue: true},
            {indexCode: "perTicketSales", indexName: "客单价"},
            {indexCode: "seIpvUvHits", indexName: "搜索人数"},
            {indexCode: "cltHits", indexName: "收藏人数"},
            {indexCode: "cartHits", indexName: "加购人数"},
            {indexCode: "uvValue", indexName: "uv价值"},
            {indexCode: "seIpvUvHitsRate", indexName: "搜索占比"},
            {indexCode: "cltRate", indexName: "收藏率"},
            {indexCode: "cartRate", indexName: "加购率"},
            {indexCode: "payItemCnt", indexName: "支付商品数"},
            {indexCode: "slrCnt", indexName: "卖家数"},
            {indexCode: "paySlrCnt", indexName: "有支付卖家数"},
        ]
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + statisticsTimeText + " | "
                + $("#shopAnalysisSelect").next().find(".oui-card-header-wrapper .ant-select-selection-selected-value").text();
        var dialogWidth;
        var dialogOptions = {
            title: dialogTitle,
            area: ['98%', '98%'],
            // offset: "100px",
            content: "<div class='wxr-dialog-sidebar'><div class='wxr-dialog-sidebar-inner'><ul></ul></div></div><div class='wxr-dialog-main'>" +
                "<div id='wxr-dialog-side-button'><i class='layui-icon layui-icon-spread-left' title='展开'></i></div>" +
                "<div class='wxr-cards-container'></div>" +
                "<div class='wxr-charts-container' id='" + moduleCache.chartElementId + "'></div>" +
                "<div id='" + moduleCache.tabElementId + "' class='layui-tab layui-tab-brief' lay-filter='tabLayFilter'><ul class='layui-tab-title'><li class='layui-this' value='merge'>合并模式</li><li value='compare'>对比模式</li></ul></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div></div>",
            success: function (layero, index) {
                var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0});
                setTimeout(function () {
                    try {
                        sideButtonEventBind();
                        drawDialogPageLeft();
                        drawIndexCards();
                        renderTabs();
                        renderChart();
                        renderTable(loading, layero);
                    } catch (e) {
                        layui.layer.close(loading);
                    }
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    function sideButtonEventBind() {
        $("#wxr-dialog-side-button .layui-icon").on("click", function () {
            if ($(this).hasClass("layui-icon-spread-left")) {
                $(this).removeClass("layui-icon-spread-left");
                $(this).addClass("layui-icon-shrink-right");
                $(this).attr("title", "折叠");
                // $(".dialog-sidebar").show(500, function () {
                //     $(".dialog-main").css({paddingLeft: "240px"});
                // });
                $(".wxr-dialog-sidebar").animate({
                    width: '260px', opacity: 'show'
                }, 500, function () {
                    $(".wxr-dialog-main").css({paddingLeft: "260px"});
                    $("#wxr-dialog-side-button").css({paddingLeft: "270px"});
                    var chartInstance = echarts.getInstanceByDom($("#" + moduleCache.chartElementId)[0]);
                    if (chartInstance) {
                        chartInstance.resize();
                    }
                    layui.table.resize(moduleCache.tableLayId);
                });
            } else if ($(this).hasClass("layui-icon-shrink-right")) {
                $(this).removeClass("layui-icon-shrink-right");
                $(this).addClass("layui-icon-spread-left");
                $(this).attr("title", "展开");
                // $(".dialog-sidebar").hide(500, function () {
                //     $(".dialog-main").css({paddingLeft: "0px"});
                // });
                $(".wxr-dialog-sidebar").animate({
                    width: '0px', opacity: 'hide'
                }, 500, function () {
                    $(".wxr-dialog-main").css({paddingLeft: "0"});
                    $("#wxr-dialog-side-button").css({paddingLeft: "10px"});
                    var chartInstance = echarts.getInstanceByDom($("#" + moduleCache.chartElementId)[0]);
                    if (chartInstance) {
                        chartInstance.resize();
                    }
                    layui.table.resize(moduleCache.tableLayId);
                });
            }

        });
        // $("#wxr-dialog-side-button .layui-icon").trigger("click");
    }

    function renderTabs() {
        $("#" + moduleCache.tabElementId).css({padding: "5px 0px"});
        if ($(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length <= 1) {
            $("#" + moduleCache.tabElementId + " li:last").addClass("wxr-tab-disabled");
        }
        layui.element.on("tab(tabLayFilter)", function () {
            renderTable();
        });
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 获取cateId，遍历localStorage，直接从缓存中获取shopCate
        var shopCateArray = [];
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key.indexOf("https://sycm.taobao.com/mc/common/getShopCate.json?") == 0) {
                var decodeCache = commonModule.getUsableOriginalJsonDataFromCache(key, true);
                if (decodeCache) {
                    shopCateArray.push.apply(shopCateArray, decodeCache);
                    break;
                }
            }
        }
        // 选中的第一级类目名称
        var firstCateName = $(".ebase-FaCommonFilter__top .oui-pro-common-picker .common-picker-header").attr("title"),
            firstCateId;
        if (firstCateName && firstCateName.indexOf(">") != -1) {
            var tempArray = firstCateName.split(">");
            firstCateName = $.trim(tempArray[0]);
        } else {
            firstCateName = $.trim(firstCateName);
        }
        for (var index in shopCateArray) {
            var cateItem = shopCateArray[index];
            if (cateItem) {
                if (cateItem[2] === firstCateName) {
                    firstCateId = cateItem[1];
                    break;
                }
            }
        }
        // 首先获取所有的监控的品牌列表
        var rivalBrandCacheKey = globalUrlPrefix + "/mc/ci/config/rival/brand/getMonitoredList.json?firstCateId=" +
            firstCateId + "&rivalType=item",
            rivalBrandCacheData = commonModule.getUsableOriginalJsonDataFromCache(rivalBrandCacheKey, true),
            // 保存竞品临时集合
            rivalBrands = {};
        // 找到数据后进行格式转化，以brandId为key来保存，方便后面使用
        if (rivalBrandCacheData) {
            for (var i in rivalBrandCacheData) {
                var brand = rivalBrandCacheData[i];
                rivalBrands[brand.brandId] = brand;
            }
        }
        // 遍历localStorage查找所有的曾选择过的品牌, 组装趋势数据
        var trendDataCacheKeyPrefix = globalUrlPrefix + "/mc/rivalBrand/analysis/getCoreTrend.json?dateType=" + moduleCache.urlParams.dateType +
            "&dateRange=" + moduleCache.urlParams.dateRange + "&indexCode=&device=" + moduleCache.urlParams.device +
            "&cateId=" + moduleCache.urlParams.cateId + "&sellerType=" + moduleCache.urlParams.sellerType, trendCacheData;
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key.slice(0, trendDataCacheKeyPrefix.length) == trendDataCacheKeyPrefix) {
                trendCacheData = commonModule.getUsableOriginalJsonDataFromCache(key, true);
                var cacheKeyParams = commonModule.extractLocationParams(key);
                if (trendCacheData) {
                    for (var trendKey in trendCacheData) {
                        if (cacheKeyParams[trendKey + "Id"]) {
                            var brandItem = rivalBrands[cacheKeyParams[trendKey + "Id"]];
                            if (brandItem) {
                                brandItem.trendData = trendCacheData[trendKey];
                                brandItem.isSelected = true;
                            }
                        }
                    }
                }
            }
        }
        var colorArray = commonModule.getChartColors().hex;
        moduleCache.data.hasSelectedBrands = [];
        $("#brandAnalysisSelect .sycm-common-select-wrapper .alife-dt-card-sycm-common-select").each(function (index, item) {
            var rivalBrandName = $(this).find(".sycm-common-select-selected-title").attr("title");
            $.each(rivalBrands, function (brandId, brandItem) {
                if (rivalBrandName == brandItem.name) {
                    brandItem.isActive = true;
                    brandItem.alias = "品牌" + (index + 1);
                    brandItem.backgroundColor = colorArray[index % colorArray.length];
                    moduleCache.data.hasSelectedBrands.push(brandItem);
                    return false;
                }
            });
        });
        var backgroundIndex = 3;
        $.each(rivalBrands, function (brandId, brandItem) {
            if (brandItem.isSelected && !brandItem.isActive) {
                brandItem.alias = "品牌" + backgroundIndex;
                brandItem.backgroundColor = colorArray[backgroundIndex % colorArray.length];
                moduleCache.data.hasSelectedBrands.push(brandItem);
                backgroundIndex++;
            }
        });
        transformData();
    }

    function transformData() {
        if (moduleCache.data.hasSelectedBrands.length == 0) {
            return;
        }
        var trendDataLength = moduleCache.data.hasSelectedBrands[0].trendData.tradeIndex.length,
            endTimeStr = moduleCache.urlParams.dateRange.split("|")[1];
        moduleCache.dateTimes = commonModule.generateStatisticTimes(trendDataLength, endTimeStr, moduleCache.urlParams.dateType);
        moduleCache.data.mergeData = [], moduleCache.data.compareData = [];
        for (var j = 0; j < trendDataLength; j++) {
            var compareDataItem = {dateTime: moduleCache.dateTimes[j]};
            $.each(moduleCache.data.hasSelectedBrands, function (index, item) {
                // if (item.isDataTransformCompleted) {
                //     return true;
                // }
                if (j == 0) {// 第一次要重新初始化相关数据
                    // 为每个商品准备一个已转化的趋势数据集合
                    item.transformTrendData = {};
                    // 每个商品单独存储一份自己的合并数据
                    item.mergeData = [];
                }
                if (!item.isActive) {
                    return true;
                }
                var trendData = item.trendData, mergeDataItem = {
                    brandName: item.name,
                    type: item.alias,
                    picUrl: item.picUrl,
                    dateTime: moduleCache.dateTimes[j],
                    brandId: item.brandId,
                    backgroundColor: item.backgroundColor
                };
                // 对店铺趋势数据中原有的指标的当前循环索引进行转换
                for (var indexCode in trendData) {
                    var indexValue = trendData[indexCode][j];
                    if (indexCode != "payRateIndex") {
                        if (indexCode == "payItemCnt" || indexCode == "slrCnt" || indexCode == "paySlrCnt") {// 无需转换的指标

                        } else {
                            indexValue = commonModule.calculateFormula(indexValue, 1, 0);
                        }
                    } else {
                        indexValue = commonModule.calculateFormula(indexValue, 0, 8);
                    }
                    if (!item.transformTrendData[indexCode]) {
                        item.transformTrendData[indexCode] = [];
                    }
                    item.transformTrendData[indexCode].push(indexValue);
                    if (indexValue != null) {// 所有的指标如果有一个存在有效值，则设置有效标记，没有有效值标记的对象将不会放入merge和compare集合
                        mergeDataItem.isEffective = true;
                        compareDataItem.isEffective = true;
                    }
                    mergeDataItem[indexCode] = indexValue;
                    compareDataItem[indexCode + "_" + item.brandId] = indexValue;
                }
                // 原有的指标转化完毕之后，计算其他指标
                if (!trendData.payByrCntIndex) {
                    // 支付人数
                    if (!item.transformTrendData.payByrCntIndex) {
                        item.transformTrendData.payByrCntIndex = [];
                    }
                    if (mergeDataItem.payRateIndex == null && mergeDataItem.uvIndex == null) {
                        mergeDataItem.payByrCntIndex = null;
                    } else {
                        mergeDataItem.payByrCntIndex = Number((mergeDataItem.uvIndex * mergeDataItem.payRateIndex / 100).toFixed(0));
                    }
                    compareDataItem["payByrCntIndex_" + item.brandId] = mergeDataItem.payByrCntIndex;
                    item.transformTrendData.payByrCntIndex.push(mergeDataItem.payByrCntIndex);
                }
                // uv价值
                if (!item.transformTrendData.uvValue) {
                    item.transformTrendData.uvValue = [];
                }
                if (mergeDataItem.tradeIndex == null && mergeDataItem.uvIndex == null) {
                    mergeDataItem.uvValue = null;
                } else {
                    mergeDataItem.uvValue = !mergeDataItem.uvIndex ? 0 : Number((mergeDataItem.tradeIndex / mergeDataItem.uvIndex).toFixed(2));
                }
                compareDataItem["uvValue_" + item.brandId] = mergeDataItem.uvValue;
                item.transformTrendData.uvValue.push(mergeDataItem.uvValue);
                // 客单价
                if (!item.transformTrendData.perTicketSales) {
                    item.transformTrendData.perTicketSales = [];
                }
                if (mergeDataItem.tradeIndex == null && mergeDataItem.payByrCntIndex == null) {
                    mergeDataItem.perTicketSales = null;
                } else {
                    mergeDataItem.perTicketSales = !mergeDataItem.payByrCntIndex ? 0 : Number((mergeDataItem.tradeIndex / mergeDataItem.payByrCntIndex).toFixed(2));
                }
                compareDataItem["perTicketSales_" + item.brandId] = mergeDataItem.perTicketSales;
                item.transformTrendData.perTicketSales.push(mergeDataItem.perTicketSales);
                // 搜索占比
                if (!item.transformTrendData.seIpvUvHitsRate) {
                    item.transformTrendData.seIpvUvHitsRate = [];
                }
                if (mergeDataItem.seIpvUvHits == null && mergeDataItem.uvIndex == null) {
                    mergeDataItem.seIpvUvHitsRate = null;
                } else {
                    mergeDataItem.seIpvUvHitsRate = !mergeDataItem.uvIndex ? 0 : Number((mergeDataItem.seIpvUvHits / mergeDataItem.uvIndex * 100).toFixed(2));
                }
                compareDataItem["seIpvUvHitsRate_" + item.brandId] = mergeDataItem.seIpvUvHitsRate;
                item.transformTrendData.seIpvUvHitsRate.push(mergeDataItem.seIpvUvHitsRate);
                // 收藏率
                if (!item.transformTrendData.cltRate) {
                    item.transformTrendData.cltRate = [];
                }
                if (mergeDataItem.cltHits == null && mergeDataItem.uvIndex == null) {
                    mergeDataItem.cltRate = null;
                } else {
                    mergeDataItem.cltRate = !mergeDataItem.uvIndex ? 0 : Number((mergeDataItem.cltHits / mergeDataItem.uvIndex * 100).toFixed(2));
                }
                compareDataItem["cltRate_" + item.brandId] = mergeDataItem.cltRate;
                item.transformTrendData.cltRate.push(mergeDataItem.cltRate);
                // 加购率
                if (!item.transformTrendData.cartRate) {
                    item.transformTrendData.cartRate = [];
                }
                if (mergeDataItem.cartHits == null && mergeDataItem.uvIndex == null) {
                    mergeDataItem.cartRate = null;
                } else {
                    mergeDataItem.cartRate = !mergeDataItem.uvIndex ? 0 : Number((mergeDataItem.cartHits / mergeDataItem.uvIndex * 100).toFixed(2));
                }
                compareDataItem["cartRate_" + item.brandId] = mergeDataItem.cartRate;
                item.transformTrendData.cartRate.push(mergeDataItem.cartRate);
                item.mergeData.push(mergeDataItem);
                if (mergeDataItem.isEffective) {
                    moduleCache.data.mergeData.push(mergeDataItem);
                }
                // 店铺的所有指标数据已转化完毕，汇总一下数据
                // if (j == trendDataLength - 1) {
                //     for (var indexCode in item.transformTrendData) {
                //         item[indexCode + "_total"] = eval(item.transformTrendData[indexCode].join("+"));
                //     }
                //     // 除了交易金额、访客人数、支付人数之外，支付转化率、uv价值以及客单价都需要按月份数据汇总之后重新计算
                //     item["payRateIndex_total"] = !item["uvIndex_total"] ? 0 : Number((item["payByrCntIndex_total"] / item["uvIndex_total"] * 100).toFixed(2));
                //     item["uvValue_total"] = !item["uvIndex_total"] ? 0 : Number((item["tradeIndex_total"] / item["uvIndex_total"]).toFixed(2));
                //     item["perTicketSales_total"] = !item["payByrCntIndex_total"] ? 0 : Number((item["tradeIndex_total"] / item["payByrCntIndex_total"]).toFixed(2));
                //     item.isDataTransformCompleted = true;
                // }
            });
            if (compareDataItem.isEffective) {
                moduleCache.data.compareData.push(compareDataItem);
            }
        }
    }

    function drawDialogPageLeft() {
        var searchShopInputDom = "<li><div style='position:relative;'><input class='wxr-side-bar-search-input layui-input' style='padding: 0px 10px 0px 30px' placeholder='搜索名称'><i class='layui-icon layui-icon-search' style='color: #1E9FFF;position: absolute;top: 10px;left: 8px;font-size: 16px'></i></div></li>";
        $(".wxr-dialog-sidebar-inner>ul").append(searchShopInputDom);
        $.each(moduleCache.data.hasSelectedBrands, function (index, item) {
            // $("#wxr-side-bar-filter-selector select").append("<option value='" + item.userId + "'>" + item.name + "</option>");
            var singleShopDom = $("<li id='" + item.name + "' class='shop-display-item'><div style='display: inline-block;'><img class='wxr-image-box wxr-image-box-36' src='//img.alicdn.com/tps/" + item.picUrl + "'/></div>" +
                "<div style='display: inline-block; vertical-align: middle;width: 70%'><ul><li style='padding-bottom: 5px'>" + item.name + "</li>" +
                "<li><span class='wxr-text-color-block'>" + item.alias +
                "</span></li></ul></div><i class='layui-icon layui-icon-circle' style='width: 15%'></i></li>");
            if (item.isActive) {
                singleShopDom.find(".layui-icon").removeClass("layui-icon-circle");
                singleShopDom.find(".layui-icon").addClass("layui-icon-ok-circle");
                // moduleCache.data.activeShops[item.userId] = item;
            }
            singleShopDom.find(".wxr-text-color-block").css({backgroundColor: item.backgroundColor});
            singleShopDom.find(".layui-icon").on("click", function () {
                if ($(this).hasClass("layui-icon-ok-circle")) {
                    if ($(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length > 1) {
                        $(this).removeClass("layui-icon-ok-circle");
                        $(this).addClass("layui-icon-circle");
                        item.isActive = false;
                    } else {
                        return;
                    }
                } else {
                    $(this).removeClass("layui-icon-circle");
                    $(this).addClass("layui-icon-ok-circle");
                    item.isActive = true;
                }
                if ($(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length <= 1) {
                    $("#" + moduleCache.tabElementId + " li:last").addClass("wxr-tab-disabled");
                } else {
                    $("#" + moduleCache.tabElementId + " li:last").removeClass("wxr-tab-disabled");
                }
                var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0});
                // transformData();
                setTimeout(function () {
                    transformData();
                    // drawIndexCards();
                    renderChart();
                    renderTable(loading);
                }, 100);
            });
            // 图片加载不成功则显示默认图片
            singleShopDom.find("img").on("error", function () {
                $(this).attr("src", "//img.alicdn.com/tps/TB1P1W_LXXXXXXoXVXXXXXXXXXX-74-74.png_48x48.jpg");
            });
            $(".wxr-dialog-sidebar-inner>ul").append(singleShopDom);
        });
        var searchInputDom = $(".wxr-dialog-sidebar-inner>ul .wxr-side-bar-search-input"),
            inputCompletedFlag = true;
        searchInputDom.on("compositionstart", function () {
            inputCompletedFlag = false;
        });
        searchInputDom.on("compositionend", function () {
            inputCompletedFlag = true;
        });
        searchInputDom.on("input propertychange", function () {
            setTimeout(function () {
                var searchText = searchInputDom.val();
                if (inputCompletedFlag) {
                    if (!searchText) {
                        $(".wxr-dialog-sidebar-inner>ul .shop-display-item").show();
                        return;
                    }
                    $(".wxr-dialog-sidebar-inner>ul .shop-display-item").hide();
                    $(".wxr-dialog-sidebar-inner>ul li[id*=" + searchText + "]").show();
                }
            }, 10);
        });
    }

    function drawIndexCards() {
        // 已选中的指标块初始化
        moduleCache.activeIndexCards = {};
        $(".wxr-cards-container").html("");
        // var sortedIndexCards = assembleIndexCards();
        // 计算每个小块宽度的百分比
        var cardItemWrapperPercent = (100 / moduleCache.sortedIndexCards.length).toFixed(4);
        // 舍去最后一位，防止宽度超出
        cardItemWrapperPercent = cardItemWrapperPercent.substring(0, cardItemWrapperPercent.length - 2);
        $(".wxr-cards-container").css({width: "96%", padding: "0px 35px"});
        // for (var i in moduleCache.firstLevelCategoryArray) {
        var activeIndexCode = $("#brandAnalysisSelect").next().find(".alife-one-design-sycm-indexes-trend-index-item-selectable.active .oui-index-cell").attr("value");
        // if (activeIndexCode == "pvIndex") {
        //     activeIndexCode = "uvIndex";
        // } else if (activeIndexCode == "cltByrCntIndex") {
        //     activeIndexCode = "cltHits";
        // }
        $.each(moduleCache.sortedIndexCards, function (index, indexItem) {
            var cardItemWrapper = $("<div class='wxr-card-item-wrapper' style='width: " +
                cardItemWrapperPercent + "%'></div>"),
                // cardItemBody = $("<div class='wxr-card-item-body wxr-card-item-body-solid'><i class='layui-icon layui-icon-ok-circle wxr-card-item-body-icon'></i></div>");
                cardItemBody = $("<div class='wxr-card-item-body wxr-card-item-body-solid' style='text-align: center; white-space: nowrap;overflow: hidden;text-overflow: ellipsis'></div>");
            cardItemWrapper.append(cardItemBody);
            if (indexItem.indexCode == activeIndexCode) {
                indexItem.isActive = true;
                cardItemBody.addClass("wxr-card-item-body-active");
                cardItemBody.find(".wxr-card-item-body-icon").addClass("wxr-card-item-body-icon-checked");
                moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
            }
            // 填充内容
            // var bodyContent = $("<ul><li class='wxr-card-item-body-title'><div class='wxr-text-ellipsis' title='" + indexItem.indexName + "'>" + indexItem.indexName + "</div></li>" +
            //     // "<li class='wxr-card-item-body-data' style='font-size: 18px;line-height: 20px;color: #0C0C0C'><div class='wxr-text-ellipsis'>" + indexItem.indexValue + "</div></li>" +
            //     // "<li class='wxr-card-item-body-data' style='font-size: 12px'><div class='wxr-text-ellipsis'>" + indexItem.compareText + "</div><div class='wxr-text-ellipsis'>" + indexItem.indexCycleCrc + "<i class='" + indexItem.cycleCrcIconClassName + "'></i></div></li>" +
            //     "</ul>");
            var bodyContent = $("<span title='" + indexItem.indexName + "'>" + indexItem.indexName + "</span>");
            // $.each(moduleCache.data.hasSelectedShops, function(shopIndex, shopItem) {
            //     if (shopItem.isActive) {
            //         bodyContent.append("<li class='wxr-card-item-body-data'><div class='wxr-text-ellipsis' title='" + shopItem.alias + "'>" + shopItem.alias + "</div><div class='wxr-text-ellipsis'>" + shopItem[indexItem.indexCode + "_total"] + (indexItem.isPercentValue ? "%" : "") + "</div></li>");
            //     }
            // });
            // bodyContent.find("li").each(function (index, item) {
            //     $(this).css({margin: "4px 0px"});
            //     if ($(this).find("div").length == 2) {
            //         $(this).find("div:first-child").css({width: "40%"});
            //         $(this).find("div:nth-child(2)").css({width: "60%", textAlign: "right"});
            //     }
            // });
            // bodyContent.find(".wxr-card-item-body-data").css({color: "#ffffff"});
            cardItemBody.append(bodyContent);
            $(".wxr-cards-container").append(cardItemWrapper);
            // 点击事件绑定
            cardItemBody.on("click", function () {
                var activeShopCount = $(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length;
                // $(".wxr-cards-container .wxr-card-item-body").removeClass("wxr-card-item-body-active");
                if (activeShopCount > 1) {// 每次只能选中一个指标
                    $(".wxr-cards-container .wxr-card-item-body-active").removeClass("wxr-card-item-body-active");
                    $(".wxr-cards-container .layui-icon-ok-circle").removeClass("wxr-card-item-body-icon-checked");
                    $(this).addClass("wxr-card-item-body-active");
                    $(this).find(".layui-icon-ok-circle").addClass("wxr-card-item-body-icon-checked");
                    moduleCache.activeIndexCards = {};
                    moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                } else {// 可选中多个指标
                    if ($(this).hasClass("wxr-card-item-body-active")) {
                        if ($(".wxr-cards-container .wxr-card-item-body-active").length > 1) {
                            $(this).removeClass("wxr-card-item-body-active");
                            cardItemBody.find(".layui-icon-ok-circle").removeClass("wxr-card-item-body-icon-checked");
                            delete moduleCache.activeIndexCards[indexItem.indexCode];
                        }
                    } else {
                        $(this).addClass("wxr-card-item-body-active");
                        cardItemBody.find(".layui-icon-ok-circle").addClass("wxr-card-item-body-icon-checked");
                        moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                    }
                }
                renderChart();
            });
        });
    }

    function renderChart() {
        var thisChart = echarts.init($("#" + moduleCache.chartElementId + "")[0]),
            xAxisData = moduleCache.dateTimes, seriesDataArray = [], count = 0, interval = 1;
        if (moduleCache.urlParams.dateType == "day" || moduleCache.urlParams.dateType == "recent7" || moduleCache.urlParams.dateType == "recent30") {
            interval = 3;
        }
        var activeItemCount = $(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length, colorArray = [];
        if (activeItemCount > 1) {
            // count = 1;
            for (var i in moduleCache.data.hasSelectedBrands) {
                var item = moduleCache.data.hasSelectedBrands[i];
                if (!item.isActive) {
                    continue;
                }
                // 当前选中的指标code，只能选中一个
                var activeIndexCode = Object.keys(moduleCache.activeIndexCards)[0],
                    seriesObj = {
                        name: item.alias + "(" + moduleCache.activeIndexCards[activeIndexCode].indexName + ")",
                        type: 'line',
                        data: item.transformTrendData[activeIndexCode],
                        smooth: true,
                        symbol: "circle",
                        showSymbol: false,
                        symbolSize: 6
                    };
                seriesDataArray.push(seriesObj);
                colorArray.push(item.backgroundColor);
                // count++;
            }

        } else {
            var activeBrand;
            $.each(moduleCache.data.hasSelectedBrands, function (index, item) {
                if (item.isActive) {
                    activeBrand = item;
                    return false;
                }
            });
            for (var indexCode in moduleCache.activeIndexCards) {
                var activeCardItem = moduleCache.activeIndexCards[indexCode], seriesObj = {
                    name: activeCardItem.indexName,
                    type: 'line',
                    data: activeBrand.transformTrendData[indexCode],
                    smooth: true,
                    symbol: "circle",
                    showSymbol: false,
                    symbolSize: 6,
                    yAxisIndex: count
                };
                seriesDataArray.push(seriesObj);
                count++;
            }
        }
        var chartOptions = {
            xAxis: {
                type: 'category',
                axisLabel: {
                    interval: interval
                },
                axisLine: {},
                data: xAxisData,
            },
            series: seriesDataArray
        };
        if (activeItemCount > 1) {
            chartOptions.color = colorArray;
        }
        commonModule.renderLineCharts(chartOptions, thisChart, count);
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(loading, layero) {
        var activeTableModel = $("#" + moduleCache.tabElementId + " .layui-this").attr("value"),
            heightGap = ($(window).height() * 0.02 + 260 + 104 + 50 + 44).toFixed(0),
            cols, tableData = [];
        if (activeTableModel == "merge") {
            cols = [[
                {
                    field: 'brandName', title: "品牌名称", minWidth: 180, sort: true, templet: function (row) {
                        // return "<img src='" + row.shop.pictureUrl + "'/><span>" + row.shopName + "</span>";
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='//img.alicdn.com/tps/" + row.picUrl + "'/>" +
                            "<span>" + row.brandName + "</span></div>";
                    }
                },
                {
                    field: "type", title: "类别", sort: true, minWidth: 100, templet: function (row) {
                        return "<span class='wxr-text-color-block' style='background: " + row.backgroundColor + "'>" + row.type + "</span>";
                    }
                },
                {field: "dateTime", title: "日期", sort: true, minWidth: 110},
                {field: "tradeIndex", title: "交易金额", minWidth: 90, sort: true},
                {field: "uvIndex", title: "访客人数", minWidth: 90, sort: true},
                {field: "payByrCntIndex", title: "支付人数", minWidth: 90, sort: true},
                {field: "payRateIndex", title: "支付转化率", minWidth: 100, sort: true, isPercentValue: true},
                {field: "perTicketSales", title: "客单价", minWidth: 70, sort: true},
                {field: "seIpvUvHits", title: "搜索人数", minWidth: 90, sort: true},
                {field: "cltHits", title: "收藏人数", minWidth: 90, sort: true},
                {field: "cartHits", title: "加购人数", minWidth: 90, sort: true},
                {field: "uvValue", title: "uv价值", minWidth: 70, sort: true},
                {field: "seIpvUvHitsRate", title: "搜索占比", minWidth: 90, sort: true, isPercentValue: true},
                {field: "cltRate", title: "收藏率", minWidth: 80, sort: true, isPercentValue: true},
                {field: "cartRate", title: "加购率", minWidth: 80, sort: true, isPercentValue: true},
                {field: "payItemCnt", title: "支付件数", minWidth: 90, sort: true},
                {field: "slrCnt", title: "卖家数", minWidth: 90, sort: true},
                {field: "paySlrCnt", title: "有支付卖家数", minWidth: 130, sort: true},
            ]];
            tableData = moduleCache.data.mergeData;
        } else {
            cols = [[], []];
            cols[0].push({field: "dateTime", title: "日期", minWidth: 110, sort: true, rowspan: 2});
            for (var i in moduleCache.data.hasSelectedBrands) {
                var item = moduleCache.data.hasSelectedBrands[i];
                if (item.isActive) {
                    cols[0].push({title: "<div style='display: inline-block'><img class='wxr-image-box wxr-image-box-36' src='//img.alicdn.com/tps/" +
                            item.picUrl + "'/></div><div style='display: inline-block;vertical-align: middle'><ul><li>" + item.name +
                            "</li><li>" + item.brandId + "</li></ul></div><div style='float: right'><span class='wxr-text-color-block' style='background: " + item.backgroundColor + "'>" + item.alias +
                            "</span></div>", colspan: 15, field: "colspan_" + item.brandId});
                    cols[1].push.apply(cols[1], [
                        {field: "tradeIndex_" + item.brandId, title: "交易金额", minWidth: 100, sort: true},
                        {field: "uvIndex_" + item.brandId, title: "访客人数", minWidth: 100, sort: true},
                        {field: "payByrCntIndex_" + item.brandId, title: "支付人数", minWidth: 100, sort: true},
                        {field: "payRateIndex_" + item.brandId, title: "支付转化率", minWidth: 110, sort: true, isPercentValue: true},
                        {field: "perTicketSales_" + item.brandId, title: "客单价", minWidth: 90, sort: true},
                        {field: "seIpvUvHits_" + item.brandId, title: "搜索人数", minWidth: 90, sort: true},
                        {field: "cltHits_" + item.brandId, title: "收藏人数", minWidth: 90, sort: true},
                        {field: "cartHits_" + item.brandId, title: "加购人数", minWidth: 90, sort: true},
                        {field: "uvValue_" + item.brandId, title: "uv价值", minWidth: 90, sort: true},
                        {field: "seIpvUvHitsRate_" + item.brandId, title: "搜索占比", minWidth: 90, sort: true, isPercentValue: true},
                        {field: "cltRate_" + item.brandId, title: "收藏率", minWidth: 80, sort: true, isPercentValue: true},
                        {field: "cartRate_" + item.brandId, title: "加购率", minWidth: 80, sort: true, isPercentValue: true},
                        {field: "payItemCnt_" + item.brandId, title: "支付件数", minWidth: 90, sort: true},
                        {field: "slrCnt_" + item.brandId, title: "卖家数", minWidth: 90, sort: true},
                        {field: "paySlrCnt_" + item.brandId, title: "有支付卖家数", minWidth: 130, sort: true},
                    ]);
                }
            }
            tableData = moduleCache.data.compareData;
        }
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: tableData,
            height: 'full-' + heightGap,
            cols: cols,
            layFilter: moduleCache.tableLayId + "LayFilter",
            done: function () {
                if (loading) {
                    layui.layer.close(loading);
                }
                var currentTableDom = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']"),
                    colorArray = commonModule.getChartColors();
                currentTableDom.find(".layui-table-body td").css({padding: "5px 0px"});
                currentTableDom.find(".layui-table-cell").css({padding: "0px 5px"});
                if (activeTableModel == "compare") {
                    $.each(moduleCache.data.hasSelectedBrands, function (index, item) {
                        if (item.isActive) {
                            currentTableDom.find("th[data-field*='_" + item.brandId + "']").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                            currentTableDom.find("td[data-field*='_" + item.brandId + "']").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                        }
                    });
                }
                $(".wxr-tool-dialog-content-wrapper .wxr-dialog-sidebar").css({height: $(".wxr-tool-dialog-content-wrapper .wxr-dialog-main").height()});
            },
            initSort: {
                field: 'dateTime',
                type: "desc"
            }
        };
        if (activeTableModel == "compare") {
            renderTableOptions.skin = "";
        }
        commonModule.renderTable(renderTableOptions, layero);
    }

    return {
        init: function () {
            var targetDom = $("#brandAnalysisTrend .oui-card-header-item.oui-card-header-item-pull-right"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "after", buttons, true, function (targetDom) {

            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  竞争-品牌分析-Top商品榜
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var brandAnalysisTopItemsModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "品牌分析 | Top商品榜",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        data: [],
        activeIndexCards: {},
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "brand-analysis-top-items-table", //table的dom控件的id属性
        tableLayId: "brandAnalysisTopItemsTable", //table在layui中定义的id，即lay-ui属性
        tabElementId: "brand-analysis-top-items-tab"
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogOptions = {
            title: dialogTitle,
            area: ['96%', '90%'],
            // offset: "100px",
            content: "<div id='" + moduleCache.tabElementId + "' class='layui-tab layui-tab-brief' lay-filter='tabLayFilter'><ul class='layui-tab-title'><li class='layui-this' value='merge'>合并模式</li><li value='compare'>对比模式</li></ul></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                setTimeout(function () {
                    renderTabs();
                    renderTable(layero);
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    function renderTabs() {
        // moduleCache.tableShowModel = "shop";
        $("#" + moduleCache.tabElementId).css({padding: "5px 0px"});
        if (moduleCache.data.length <= 1) {
            $("#" + moduleCache.tabElementId + " li:last").addClass("wxr-tab-disabled");
        }
        layui.element.on("tab(tabLayFilter)", function () {
            renderTable();
        });
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 获取cateId，遍历localStorage，直接从缓存中获取shopCate
        var shopCateArray = [];
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key.indexOf("https://sycm.taobao.com/mc/common/getShopCate.json?") == 0) {
                var decodeCache = commonModule.getUsableOriginalJsonDataFromCache(key, true);
                if (decodeCache) {
                    shopCateArray.push.apply(shopCateArray, decodeCache);
                    break;
                }
            }
        }
        // 选中的第一级类目名称
        var firstCateName = $(".ebase-FaCommonFilter__top .oui-pro-common-picker .common-picker-header").attr("title"),
            firstCateId;
        if (firstCateName && firstCateName.indexOf(">") != -1) {
            var tempArray = firstCateName.split(">");
            firstCateName = $.trim(tempArray[0]);
        } else {
            firstCateName = $.trim(firstCateName);
        }
        for (var index in shopCateArray) {
            var cateItem = shopCateArray[index];
            if (cateItem) {
                if (cateItem[2] === firstCateName) {
                    firstCateId = cateItem[1];
                    break;
                }
            }
        }
        // 首先获取所有的监控的品牌列表
        var rivalBrandCacheKey = globalUrlPrefix + "/mc/ci/config/rival/brand/getMonitoredList.json?firstCateId=" +
            firstCateId + "&rivalType=item",
            rivalBrandCacheData = commonModule.getUsableOriginalJsonDataFromCache(rivalBrandCacheKey, true),
            rivalBrandList = [];
        if (rivalBrandCacheData) {
            rivalBrandList = rivalBrandCacheData;
        }
        moduleCache.data = [];
        var selectedBrandCount = $("#brandAnalysisSelect .sycm-common-select-wrapper " +
            ".alife-dt-card-sycm-common-select .sycm-common-select-selected-title").length;
        $("#brandAnalysisSelect .sycm-common-select-wrapper .alife-dt-card-sycm-common-select").each(function (index, item) {
            var brandName = $(this).find(".sycm-common-select-selected-title").attr("title");
            if (brandName) {
                $.each(rivalBrandList, function (i, brandItem) {
                    if (brandItem.name == brandName) {
                        brandItem.type = "品牌" + (index + 1);
                        brandItem.backgroundColor = commonModule.getChartColors().hex[index];
                        moduleCache.data.push(brandItem);
                        // 拼接热销与流量数据的缓存key
                        var flowCacheKey = globalUrlPrefix + "/mc/rivalBrand/analysis/getTopItems.json?dateRange=" + moduleCache.urlParams.dateRange +
                            "&dateType=" + moduleCache.urlParams.dateType, tradeCacheKey, flowCacheData, tradeCacheData;
                        // var pageAndSortParams = commonModule.getCachePageAndSortParams($("#brandAnalysisItems .op-mc-brand-analysis-items-table").eq(index));
                        flowCacheKey += "&pageSize=10&page=1&order=desc&brandId=" + brandItem.brandId +
                            "&topType=flow&device=" + moduleCache.urlParams.device + "&sellerType=" + moduleCache.urlParams.sellerType +
                            "&cateId=" + moduleCache.urlParams.cateId + "&indexCode=";
                        if (selectedBrandCount > 1) {
                            flowCacheKey += "uvIndex";
                            tradeCacheKey = flowCacheKey.replace("&topType=flow&", "&topType=trade&").replace(/&indexCode\S+/, "&indexCode=tradeIndex");
                        } else {
                            flowCacheKey += "uvIndex,seIpvUvHits,tradeIndex";
                            tradeCacheKey = flowCacheKey.replace("&topType=flow&", "&topType=trade&").replace(/&indexCode\S+/, "&indexCode=tradeIndex,tradeGrowthRange,payRateIndex");
                        }
                        flowCacheData = commonModule.getUsableOriginalJsonDataFromCache(flowCacheKey, true);
                        brandItem.flowData = [];
                        if (flowCacheData) {
                            brandItem.flowData = flowCacheData;
                        }
                        tradeCacheData = commonModule.getUsableOriginalJsonDataFromCache(tradeCacheKey, true);
                        brandItem.tradeData = [];
                        if (tradeCacheData) {
                            brandItem.tradeData = tradeCacheData;
                        }
                        return false;
                    }
                });
            }
        });
        transformData();
    }

    function transformData() {
        for (var m in moduleCache.data) {
            var brandItem = moduleCache.data[m], flowData = brandItem.flowData, tradeData = brandItem.tradeData, mergeData = [];
            // 合并流量数据和交易数据
            if (tradeData.length > 0) {
                for (var i in tradeData) {
                    var mergeItem = {}, tradeObj = tradeData[i];
                    mergeItem.name = tradeObj.item.title;
                    mergeItem.shopName = tradeObj.shop.title;
                    mergeItem.pictUrl = tradeObj.item.pictUrl;
                    mergeItem.detailUrl = tradeObj.item.detailUrl;
                    mergeItem.type = brandItem.type;
                    mergeItem.backgroundColor = brandItem.backgroundColor;
                    // if (shopItem.discountPrice) {
                    //     mergeItem.discountPrice = Number((shopItem.discountPrice * 1).toFixed(2));
                    // }
                    // 交易金额
                    mergeItem.tradeIndex = commonModule.calculateFormula(tradeObj.tradeIndex.value, 1, 0);
                    // 支付转化率
                    mergeItem.payRateIndex = commonModule.calculateFormula(tradeObj.payRateIndex.value, 0, 8);
                    // 交易增长幅度
                    mergeItem.tradeGrowthRange = Number((tradeObj.tradeGrowthRange.value * 100).toFixed(2));
                    for (var j = flowData.length - 1; j >= 0; j--) {
                        var flowObj = flowData[j];
                        if (tradeObj.item.title == flowObj.item.title) {
                            // 交易金额
                            mergeItem.tradeIndex = commonModule.calculateFormula(flowObj.tradeIndex.value, 1, 0);
                            // 搜索人数
                            mergeItem.seIpvUvHits = commonModule.calculateFormula(flowObj.seIpvUvHits.value, 1, 0);
                            // 访客人数
                            mergeItem.uvIndex = commonModule.calculateFormula(flowObj.uvIndex.value, 1, 0);
                            flowData.splice(j, 1);
                            break;
                        }
                    }
                    mergeItem.uvValue = Number((mergeItem.tradeIndex / mergeItem.uvIndex).toFixed(2));
                    // 搜索占比
                    mergeItem.seIpvUvRate = Number((mergeItem.seIpvUvHits / mergeItem.uvIndex).toFixed(2));
                    // 支付人数
                    mergeItem.payByrCnt = Number((mergeItem.uvIndex * mergeItem.payRateIndex / 100).toFixed(0));
                    // 客单价
                    mergeItem.perTicketSales = Number((mergeItem.tradeIndex / mergeItem.payByrCnt).toFixed(2));
                    mergeData.push(mergeItem);
                }
                // 此时如果flowData中还留有数据则直接添加到合并的集合中
                flowDataToMerge(flowData, brandItem, mergeData);
            } else {
                flowDataToMerge(flowData, brandItem, mergeData);
            }
            brandItem.mergeData = mergeData;
        }
    }

    function flowDataToMerge(flowData, brandItem, mergeData) {
        for (var index in flowData) {
            var mergeItem = {}, flowObj = flowData[index];
            mergeItem.name = flowObj.item.title;
            mergeItem.shopName = flowObj.shop.name;
            mergeItem.pictUrl = flowObj.item.pictUrl;
            mergeItem.detailUrl = flowObj.item.detailUrl;
            mergeItem.type = brandItem.type;
            mergeItem.backgroundColor = brandItem.backgroundColor;
            // 交易金额
            mergeItem.tradeIndex = commonModule.calculateFormula(flowObj.tradeIndex.value, 1, 0);
            // 搜索人数
            mergeItem.seIpvUvHits = commonModule.calculateFormula(flowObj.seIpvUvHits.value, 1, 0);
            // 访客人数
            mergeItem.uvIndex = commonModule.calculateFormula(flowObj.uvIndex.value, 1, 0);
            mergeItem.uvValue = Number((mergeItem.tradeIndex / mergeItem.uvIndex).toFixed(2));
            // 搜索占比
            mergeItem.seIpvUvRate = Number((mergeItem.seIpvUvHits / mergeItem.uvIndex).toFixed(2));
            // 支付人数
            mergeItem.payByrCnt = Number((mergeItem.uvIndex * mergeItem.payRateIndex / 100).toFixed(0));
            // 客单价
            mergeItem.perTicketSales = Number((mergeItem.tradeIndex / mergeItem.payByrCnt).toFixed(2));
            mergeData.push(mergeItem);
        }
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var activeTableModel = $("#" + moduleCache.tabElementId + " .layui-this").attr("value"),
            heightGap = ($(window).height() * 0.1 + 104 + 50).toFixed(0), cols, tableData = [];
        $("#" + moduleCache.tableElementId).html("");
        if (activeTableModel == "merge"){
            cols = [[
                {field: 'name', title: "商品", minWidth: 400, sort: true, templet: function (row) {
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' style='float: left' src='" + row.pictUrl    + "'/>" +
                            "<ul><li><a title='" + row.name + "' target='_blank' href='" + row.detailUrl + "'>" + row.name + "</a>\n</li><li class='wxr-font-light-color'>" + row.shopName + "\n</li></ul></div>";
                    }},
                {field: "shopType", title: "类别", minWidth: 120, sort: true, templet: function (row) {
                        return "<span class='wxr-text-color-block' style='background: " + row.backgroundColor + "'>" + row.type + "</span>";
                    }},
                {field: "tradeIndex", title: "交易金额", minWidth: 110, sort: true},
                {field: "uvIndex", title: "访客人数", minWidth: 110, sort: true},
                {field: "seIpvUvHits", title: "搜索人数", minWidth: 110, sort: true},
                {field: "seIpvUvRate", title: "搜索占比", minWidth: 110, sort: true, isPercentValue: true},
                {field: "payRateIndex", title: "支付转化率", minWidth: 110, sort: true, isPercentValue: true},
                {field: "payByrCnt", title: "支付人数", minWidth: 110, sort: true},
                {field: "perTicketSales", title: "客单价", minWidth: 110, sort: true},
                {field: "uvValue", title: "uv价值", minWidth: 110, sort: true},
                {field: "tradeGrowthRange", title: "交易增长幅度", minWidth: 110, sort: true, isPercentValue: true}
            ]];
            for (var i in moduleCache.data) {
                var shopItem = moduleCache.data[i], mergeData = shopItem.mergeData;
                tableData.push.apply(tableData, mergeData);
            }
            var renderTableOptions = {
                id: moduleCache.tableLayId,
                elem: "#" + moduleCache.tableElementId,
                data: tableData,
                height: 'full-' + heightGap,
                cols: cols,
                initSort: {
                    field: 'tradeIndex',
                    type: "desc"
                },
                done: function () {
                    $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "'] .layui-table-body td").css({padding: "4px 0px"});
                }
            };
            commonModule.renderTable(renderTableOptions);
        } else if (activeTableModel == "compare") {
            var mergeTable = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']");
            mergeTable.next(".wxr-table-bottom-info-bar").remove();
            mergeTable.remove();
            cols = [[
                {field: 'name', title: "商品", minWidth: 200, sort: true, templet: function (row) {
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' style='float: left' src='" + row.pictUrl    + "'/>" +
                            "<ul><li><a title='" + row.name + "' target='_blank' href='" + row.detailUrl + "'>" + row.name + "</a>\n</li><li class='wxr-font-light-color'>" + row.shopName + "\n</li></ul></div>";
                    }},
                // {field: "shopType", title: "类别", minWidth: 120, sort: true, templet: function (row) {
                //         return "<span class='wxr-text-color-block' style='background: " + row.shopTypeColor + "'>" + row.shopType + "</span>";
                //     }},
                {field: "tradeIndex", title: "交易金额", minWidth: 100, sort: true},
                {field: "uvIndex", title: "访客人数", minWidth: 100, sort: true},
                {field: "seIpvUvHits", title: "搜索人数", minWidth: 100, sort: true},
                {field: "seIpvUvRate", title: "搜索占比", minWidth: 100, sort: true, isPercentValue: true},
                {field: "payRateIndex", title: "支付转化率", minWidth: 110, sort: true, isPercentValue: true},
                {field: "payByrCnt", title: "支付人数", minWidth: 100, sort: true},
                {field: "perTicketSales", title: "客单价", minWidth: 90, sort: true},
                {field: "uvValue", title: "uv价值", minWidth: 90, sort: true},
                {field: "tradeGrowthRange", title: "交易增长幅度", minWidth: 120, sort: true, isPercentValue: true}
            ]];
            var tableItemWidth = (100 / moduleCache.data.length).toFixed(4);
            tableItemWidth = tableItemWidth.substring(0, tableItemWidth.length - 2);
            //为每个店铺绘制表格
            $.each(moduleCache.data, function (index, item) {
                var tableItemWrapper = $("<div style='width: " +
                    tableItemWidth + "%; padding: 0px 5px;display: inline-block;position:relative;'><div id='rivalShop" + index + "'></div>" +
                    "<div style='position: absolute; left: 5px;top: 0px;z-index: 1000000000'><span class='wxr-text-color-block' style='background: " + item.backgroundColor + "'>" + item.type + "</span></div></div>");
                $("#" + moduleCache.tableElementId).append(tableItemWrapper);
                var renderTableOptions = {
                    id: "rival-shop-table" + index,
                    elem: "#rivalShop" + index,
                    data: moduleCache.data[index].mergeData,
                    height: 'full-' + heightGap,
                    cols: cols,
                    initSort: {
                        field: 'tradeIndex',
                        type: "desc"
                    },
                    done: function () {
                        var currentTableDom = $(".layui-table-view[lay-id='rival-shop-table" + index + "']"),
                            colorArray = commonModule.getChartColors();
                        currentTableDom.find(".layui-table-body td").css({padding: "4px 0px"});
                        // currentTableDom.find(".layui-table-tool").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                        // currentTableDom.find(".layui-table-tool .wxr-tool-table-search-input").parent().hide();
                        currentTableDom.find("th").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                        currentTableDom.find("td").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                    }
                };
                commonModule.renderTable(renderTableOptions, layero);
            });
        }
    }

    return {
        init: function () {
            var targetDom = $("#brandAnalysisItems .oui-card-header-pull-right"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "prepend", buttons, true, function (targetDom) {
                $("#brandAnalysisItems .wxr-tool-buttons-inject-container").css("float", "none");
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  竞争-品牌分析-Top店铺榜
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var brandAnalysisTopShopsModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "品牌分析 | Top店铺榜",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        data: [],
        activeIndexCards: {},
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "brand-analysis-top-shops-table", //table的dom控件的id属性
        tableLayId: "brandAnalysisTopShopsTable", //table在layui中定义的id，即lay-ui属性
        tabElementId: "brand-analysis-top-shops-tab"
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogOptions = {
            title: dialogTitle,
            area: ['96%', '90%'],
            // offset: "100px",
            content: "<div id='" + moduleCache.tabElementId + "' class='layui-tab layui-tab-brief' lay-filter='tabLayFilter'><ul class='layui-tab-title'><li class='layui-this' value='merge'>合并模式</li><li value='compare'>对比模式</li></ul></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                setTimeout(function () {
                    renderTabs();
                    renderTable(layero);
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    function renderTabs() {
        $("#" + moduleCache.tabElementId).css({padding: "5px 0px"});
        if (moduleCache.data.length <= 1) {
            $("#" + moduleCache.tabElementId + " li:last").addClass("wxr-tab-disabled");
        }
        layui.element.on("tab(tabLayFilter)", function () {
            renderTable();
        });
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 获取cateId，遍历localStorage，直接从缓存中获取shopCate
        var shopCateArray = [];
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key.indexOf("https://sycm.taobao.com/mc/common/getShopCate.json?") == 0) {
                var decodeCache = commonModule.getUsableOriginalJsonDataFromCache(key, true);
                if (decodeCache) {
                    shopCateArray.push.apply(shopCateArray, decodeCache);
                    break;
                }
            }
        }
        // 选中的第一级类目名称
        var firstCateName = $(".ebase-FaCommonFilter__top .oui-pro-common-picker .common-picker-header").attr("title"),
            firstCateId;
        if (firstCateName && firstCateName.indexOf(">") != -1) {
            var tempArray = firstCateName.split(">");
            firstCateName = $.trim(tempArray[0]);
        } else {
            firstCateName = $.trim(firstCateName);
        }
        for (var index in shopCateArray) {
            var cateItem = shopCateArray[index];
            if (cateItem) {
                if (cateItem[2] === firstCateName) {
                    firstCateId = cateItem[1];
                    break;
                }
            }
        }
        // 首先获取所有的监控的品牌列表
        var rivalBrandCacheKey = globalUrlPrefix + "/mc/ci/config/rival/brand/getMonitoredList.json?firstCateId=" +
            firstCateId + "&rivalType=item",
            rivalBrandCacheData = commonModule.getUsableOriginalJsonDataFromCache(rivalBrandCacheKey, true),
            rivalBrandList = [];
        if (rivalBrandCacheData) {
            rivalBrandList = rivalBrandCacheData;
        }
        moduleCache.data = [];
        var selectedBrandCount = $("#brandAnalysisSelect .sycm-common-select-wrapper " +
            ".alife-dt-card-sycm-common-select .sycm-common-select-selected-title").length;
        $("#brandAnalysisSelect .sycm-common-select-wrapper .alife-dt-card-sycm-common-select").each(function (index, item) {
            var brandName = $(this).find(".sycm-common-select-selected-title").attr("title");
            if (brandName) {
                $.each(rivalBrandList, function (i, brandItem) {
                    if (brandItem.name == brandName) {
                        brandItem.type = "品牌" + (index + 1);
                        brandItem.backgroundColor = commonModule.getChartColors().hex[index];
                        moduleCache.data.push(brandItem);
                        // 拼接热销与流量数据的缓存key
                        var flowCacheKey = globalUrlPrefix + "/mc/rivalBrand/analysis/getTopShops.json?dateRange=" + moduleCache.urlParams.dateRange +
                            "&dateType=" + moduleCache.urlParams.dateType, tradeCacheKey, flowCacheData, tradeCacheData;
                        var pageAndSortParams = commonModule.getCachePageAndSortParams($("#brandAnalysisItems .op-mc-brand-analysis-items-table").eq(index));
                        flowCacheKey += "&pageSize=10&page=1&order=desc&brandId=" + brandItem.brandId +
                            "&topType=flow&device=" + moduleCache.urlParams.device + "&sellerType=" + moduleCache.urlParams.sellerType +
                            "&cateId=" + moduleCache.urlParams.cateId + "&indexCode=";
                        if (selectedBrandCount > 1) {
                            flowCacheKey += "uvIndex";
                            tradeCacheKey = flowCacheKey.replace("&topType=flow&", "&topType=trade&").replace(/&indexCode\S+/, "&indexCode=tradeIndex");
                        } else {
                            flowCacheKey += "uvIndex,seIpvUvHits,tradeIndex";
                            tradeCacheKey = flowCacheKey.replace("&topType=flow&", "&topType=trade&").replace(/&indexCode\S+/, "&indexCode=tradeIndex,tradeGrowthRange,payRateIndex");
                        }
                        flowCacheData = commonModule.getUsableOriginalJsonDataFromCache(flowCacheKey, true);
                        brandItem.flowData = [];
                        if (flowCacheData) {
                            brandItem.flowData = flowCacheData;
                        }
                        tradeCacheData = commonModule.getUsableOriginalJsonDataFromCache(tradeCacheKey, true);
                        brandItem.tradeData = [];
                        if (tradeCacheData) {
                            brandItem.tradeData = tradeCacheData;
                        }
                        return false;
                    }
                });
            }
        });
        transformData();
    }

    function transformData() {
        for (var m in moduleCache.data) {
            var brandItem = moduleCache.data[m], flowData = brandItem.flowData, tradeData = brandItem.tradeData, mergeData = [];
            // 合并流量数据和交易数据
            if (tradeData.length > 0) {
                for (var i in tradeData) {
                    var mergeItem = {}, tradeObj = tradeData[i];
                    mergeItem.shopName = tradeObj.shop.title;
                    mergeItem.brandName = brandItem.name;
                    mergeItem.pictUrl = tradeObj.shop.pictureUrl;
                    mergeItem.shopUrl = tradeObj.shop.shopUrl;
                    mergeItem.type = brandItem.type;
                    mergeItem.backgroundColor = brandItem.backgroundColor;
                    // if (shopItem.discountPrice) {
                    //     mergeItem.discountPrice = Number((shopItem.discountPrice * 1).toFixed(2));
                    // }
                    // 交易金额
                    mergeItem.tradeIndex = commonModule.calculateFormula(tradeObj.tradeIndex.value, 1, 0);
                    // 支付转化率
                    mergeItem.payRateIndex = commonModule.calculateFormula(tradeObj.payRateIndex.value, 0, 8);
                    // 交易增长幅度
                    mergeItem.tradeGrowthRange = Number((tradeObj.tradeGrowthRange.value * 100).toFixed(2));
                    for (var j = flowData.length - 1; j >= 0; j--) {
                        var flowObj = flowData[j];
                        if (tradeObj.shop.title == flowObj.shop.title) {
                            // 交易金额
                            mergeItem.tradeIndex = commonModule.calculateFormula(flowObj.tradeIndex.value, 1, 0);
                            // 搜索人数
                            mergeItem.seIpvUvHits = commonModule.calculateFormula(flowObj.seIpvUvHits.value, 1, 0);
                            // 访客人数
                            mergeItem.uvIndex = commonModule.calculateFormula(flowObj.uvIndex.value, 1, 0);
                            flowData.splice(j, 1);
                            break;
                        }
                    }
                    mergeItem.uvValue = Number((mergeItem.tradeIndex / mergeItem.uvIndex).toFixed(2));
                    // 搜索占比
                    mergeItem.seIpvUvRate = Number((mergeItem.seIpvUvHits / mergeItem.uvIndex).toFixed(2));
                    // 支付人数
                    mergeItem.payByrCnt = Number((mergeItem.uvIndex * mergeItem.payRateIndex / 100).toFixed(0));
                    // 客单价
                    mergeItem.perTicketSales = Number((mergeItem.tradeIndex / mergeItem.payByrCnt).toFixed(2));
                    mergeData.push(mergeItem);
                }
                // 此时如果flowData中还留有数据则直接添加到合并的集合中
                flowDataToMerge(flowData, brandItem, mergeData);
            } else {
                flowDataToMerge(flowData, brandItem, mergeData);
            }
            brandItem.mergeData = mergeData;
        }
    }

    function flowDataToMerge(flowData, brandItem, mergeData) {
        for (var index in flowData) {
            var mergeItem = {}, flowObj = flowData[index];
            mergeItem.shopName = flowObj.shop.title;
            mergeItem.brandName = brandItem.name;
            mergeItem.pictUrl = flowObj.shop.pictureUrl;
            mergeItem.shopUrl = flowObj.shop.shopUrl;
            mergeItem.type = brandItem.type;
            mergeItem.backgroundColor = brandItem.backgroundColor;
            // 交易金额
            mergeItem.tradeIndex = commonModule.calculateFormula(flowObj.tradeIndex.value, 1, 0);
            // 搜索人数
            mergeItem.seIpvUvHits = commonModule.calculateFormula(flowObj.seIpvUvHits.value, 1, 0);
            // 访客人数
            mergeItem.uvIndex = commonModule.calculateFormula(flowObj.uvIndex.value, 1, 0);
            mergeItem.uvValue = Number((mergeItem.tradeIndex / mergeItem.uvIndex).toFixed(2));
            // 搜索占比
            mergeItem.seIpvUvRate = Number((mergeItem.seIpvUvHits / mergeItem.uvIndex).toFixed(2));
            // 支付人数
            mergeItem.payByrCnt = Number((mergeItem.uvIndex * mergeItem.payRateIndex / 100).toFixed(0));
            // 客单价
            mergeItem.perTicketSales = Number((mergeItem.tradeIndex / mergeItem.payByrCnt).toFixed(2));
            mergeData.push(mergeItem);
        }
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var activeTableModel = $("#" + moduleCache.tabElementId + " .layui-this").attr("value"),
            heightGap = ($(window).height() * 0.1 + 104 + 50).toFixed(0), cols, tableData = [];
        $("#" + moduleCache.tableElementId).html("");
        if (activeTableModel == "merge"){
            cols = [[
                {field: 'name', title: "店铺名称", minWidth: 400, sort: true, templet: function (row) {
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' style='float: left' src='" + row.pictUrl    + "'/>" +
                            "<ul><li><a title='" + row.shopName + "' target='_blank' href='" + row.shopUrl + "'>" + row.shopName + "</a>\n</li><li class='wxr-font-light-color'>" + row.brandName + "\n</li></ul></div>";
                    }},
                {field: "shopType", title: "类别", minWidth: 120, sort: true, templet: function (row) {
                        return "<span class='wxr-text-color-block' style='background: " + row.backgroundColor + "'>" + row.type + "</span>";
                    }},
                {field: "tradeIndex", title: "交易金额", minWidth: 110, sort: true},
                {field: "uvIndex", title: "访客人数", minWidth: 110, sort: true},
                {field: "seIpvUvHits", title: "搜索人数", minWidth: 110, sort: true},
                {field: "seIpvUvRate", title: "搜索占比", minWidth: 110, sort: true, isPercentValue: true},
                {field: "payRateIndex", title: "支付转化率", minWidth: 110, sort: true, isPercentValue: true},
                {field: "payByrCnt", title: "支付人数", minWidth: 110, sort: true},
                {field: "perTicketSales", title: "客单价", minWidth: 110, sort: true},
                {field: "uvValue", title: "uv价值", minWidth: 110, sort: true},
                {field: "tradeGrowthRange", title: "交易增长幅度", minWidth: 110, sort: true, isPercentValue: true}
            ]];
            for (var i in moduleCache.data) {
                var shopItem = moduleCache.data[i], mergeData = shopItem.mergeData;
                tableData.push.apply(tableData, mergeData);
            }
            var renderTableOptions = {
                id: moduleCache.tableLayId,
                elem: "#" + moduleCache.tableElementId,
                data: tableData,
                height: 'full-' + heightGap,
                cols: cols,
                initSort: {
                    field: 'tradeIndex',
                    type: "desc"
                },
                done: function () {
                    $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "'] .layui-table-body td").css({padding: "4px 0px"});
                }
            };
            commonModule.renderTable(renderTableOptions);
        } else if (activeTableModel == "compare") {
            var mergeTable = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']");
            mergeTable.next(".wxr-table-bottom-info-bar").remove();
            mergeTable.remove();
            cols = [[
                {field: 'name', title: "店铺", minWidth: 200, sort: true, templet: function (row) {
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' style='float: left' src='" + row.pictUrl    + "'/>" +
                            "<ul><li><a title='" + row.shopName + "' target='_blank' href='" + row.shopUrl + "'>" + row.shopName + "</a>\n</li><li class='wxr-font-light-color'>" + row.brandName + "\n</li></ul></div>";
                    }},
                // {field: "shopType", title: "类别", minWidth: 120, sort: true, templet: function (row) {
                //         return "<span class='wxr-text-color-block' style='background: " + row.shopTypeColor + "'>" + row.shopType + "</span>";
                //     }},
                {field: "tradeIndex", title: "交易金额", minWidth: 100, sort: true},
                {field: "uvIndex", title: "访客人数", minWidth: 100, sort: true},
                {field: "seIpvUvHits", title: "搜索人数", minWidth: 100, sort: true},
                {field: "seIpvUvRate", title: "搜索占比", minWidth: 100, sort: true, isPercentValue: true},
                {field: "payRateIndex", title: "支付转化率", minWidth: 110, sort: true, isPercentValue: true},
                {field: "payByrCnt", title: "支付人数", minWidth: 100, sort: true},
                {field: "perTicketSales", title: "客单价", minWidth: 90, sort: true},
                {field: "uvValue", title: "uv价值", minWidth: 90, sort: true},
                {field: "tradeGrowthRange", title: "交易增长幅度", minWidth: 120, sort: true, isPercentValue: true}
            ]];
            var tableItemWidth = (100 / moduleCache.data.length).toFixed(4);
            tableItemWidth = tableItemWidth.substring(0, tableItemWidth.length - 2);
            //为每个店铺绘制表格
            $.each(moduleCache.data, function (index, item) {
                var tableItemWrapper = $("<div style='width: " +
                    tableItemWidth + "%; padding: 0px 5px;display: inline-block;position:relative;'><div id='rivalShop" + index + "'></div>" +
                    "<div style='position: absolute; left: 5px;top: 0px;z-index: 1000000000'><span class='wxr-text-color-block' style='background: " + item.backgroundColor + "'>" + item.type + "</span></div></div>");
                $("#" + moduleCache.tableElementId).append(tableItemWrapper);
                var renderTableOptions = {
                    id: "rival-shop-table" + index,
                    elem: "#rivalShop" + index,
                    data: moduleCache.data[index].mergeData,
                    height: 'full-' + heightGap,
                    cols: cols,
                    initSort: {
                        field: 'tradeIndex',
                        type: "desc"
                    },
                    done: function () {
                        var currentTableDom = $(".layui-table-view[lay-id='rival-shop-table" + index + "']"),
                            colorArray = commonModule.getChartColors();
                        currentTableDom.find(".layui-table-body td").css({padding: "4px 0px"});
                        // currentTableDom.find(".layui-table-tool").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                        // currentTableDom.find(".layui-table-tool .wxr-tool-table-search-input").parent().hide();
                        currentTableDom.find("th").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                        currentTableDom.find("td").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                    }
                };
                commonModule.renderTable(renderTableOptions, layero);
            });
        }
    }

    return {
        init: function () {
            var targetDom = $("#brandAnalysisShops .oui-card-header-pull-right"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "prepend", buttons, true, function (targetDom) {
                $("#brandAnalysisShops .wxr-tool-buttons-inject-container").css("float", "none");
            });
        }
    }
}());


/**
 * @Author xuyefei
 * @Description  竞争-品牌分析-关键成交构成
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var brandAnalysisTradeConstituteModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "品牌分析 | 关键成交构成",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        data: {
            brandData: [],
            mergeData: {
                cate: [],
                priceSeg: []
            },
            compareData: {
                cate: [],
                priceSeg: []
            }
        },
        activeIndexCards: {},
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "brand-analysis-trade-constitute-table", //table的dom控件的id属性
        tableLayId: "brandAnalysisTradeConstituteTable", //table在layui中定义的id，即lay-ui属性
        tabElementId: "brand-analysis-trade-constitute-tab",
        buttonType: {cate: "cate", priceSeg: "priceSeg"},
        currentClickButton: "",
        chartElementId: "brand-analysis-trade-constitute-chart"
    };

    // 类目按钮
    function oneClickTransformForCate() {
        moduleCache.currentClickButton = moduleCache.buttonType.cate;
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    // 价格带按钮
    function oneClickTransformForPriceSeg() {
        moduleCache.currentClickButton = moduleCache.buttonType.priceSeg;
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogWidth;
        if (moduleCache.data.brandData.length == 1) {
            dialogWidth = "65%";
        } else if (moduleCache.data.brandData.length == 2) {
            dialogWidth = "80%";
        }
        var dialogOptions = {
            title: dialogTitle,
            area: [dialogWidth, '95%'],
            // offset: "100px",
            content: "<div class='wxr-charts-container' id='" + moduleCache.chartElementId + "'></div>" +
                "<div id='" + moduleCache.tabElementId + "' class='layui-tab layui-tab-brief' lay-filter='tabLayFilter'><ul class='layui-tab-title'><li class='layui-this' value='merge'>合并模式</li><li value='compare'>对比模式</li></ul></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                setTimeout(function () {
                    renderPieChart();
                    renderTabs();
                    renderTable(layero);
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    function renderTabs() {
        // moduleCache.tableShowModel = "shop";
        $("#" + moduleCache.tabElementId).css({padding: "5px 0px"});
        if (moduleCache.data.brandData.length <= 1) {
            $("#" + moduleCache.tabElementId + " li:last").addClass("wxr-tab-disabled");
        }
        layui.element.on("tab(tabLayFilter)", function () {
            renderTable();
        });
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 获取cateId，遍历localStorage，直接从缓存中获取shopCate
        var shopCateArray = [];
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key.indexOf("https://sycm.taobao.com/mc/common/getShopCate.json?") == 0) {
                var decodeCache = commonModule.getUsableOriginalJsonDataFromCache(key, true);
                if (decodeCache) {
                    shopCateArray.push.apply(shopCateArray, decodeCache);
                    break;
                }
            }
        }
        // 选中的第一级类目名称
        var firstCateName = $(".ebase-FaCommonFilter__top .oui-pro-common-picker .common-picker-header").attr("title"),
            firstCateId;
        if (firstCateName && firstCateName.indexOf(">") != -1) {
            var tempArray = firstCateName.split(">");
            firstCateName = $.trim(tempArray[0]);
        } else {
            firstCateName = $.trim(firstCateName);
        }
        for (var index in shopCateArray) {
            var cateItem = shopCateArray[index];
            if (cateItem) {
                if (cateItem[2] === firstCateName) {
                    firstCateId = cateItem[1];
                    break;
                }
            }
        }
        // 首先获取所有的监控的品牌列表
        var rivalBrandCacheKey = globalUrlPrefix + "/mc/ci/config/rival/brand/getMonitoredList.json?firstCateId=" +
            firstCateId + "&rivalType=item",
            rivalBrandCacheData = commonModule.getUsableOriginalJsonDataFromCache(rivalBrandCacheKey, true),
            rivalBrandList = [];
        if (rivalBrandCacheData) {
            rivalBrandList = rivalBrandCacheData;
        }
        moduleCache.data.brandData = [];
        var selectedBrandCount = $("#brandAnalysisSelect .sycm-common-select-wrapper " +
            ".alife-dt-card-sycm-common-select .sycm-common-select-selected-title").length;
        $("#brandAnalysisSelect .sycm-common-select-wrapper .alife-dt-card-sycm-common-select").each(function (index, item) {
            var brandName = $(this).find(".sycm-common-select-selected-title").attr("title");
            if (brandName) {
                $.each(rivalBrandList, function (i, brandItem) {
                    if (brandItem.name == brandName) {
                        brandItem.alias = "品牌" + (index + 1);
                        brandItem.backgroundColor = commonModule.getChartColors().hex[index];
                        moduleCache.data.brandData.push(brandItem);
                        // 找到当前店铺的类目与价格带的数据并分类存储
                        var cateCacheKey = globalUrlPrefix + "/mc/rivalBrand/analysis/getCateConstitute.json?dateRange="
                            + moduleCache.urlParams.dateRange + "&dateType=" + moduleCache.urlParams.dateType
                            + "&pageSize=10&page=1";
                        if (selectedBrandCount > 1) {
                            cateCacheKey += "&brandId=" + brandItem.brandId + "&device=" + moduleCache.urlParams.device
                                + "&sellerType=" + moduleCache.urlParams.sellerType + "&cateId=" + moduleCache.urlParams.cateId
                                + "&indexCode=payAmt";
                        } else {
                            cateCacheKey += "&order=desc&orderBy=payAmt&brandId=" + brandItem.brandId + "&device=" + moduleCache.urlParams.device
                                + "&sellerType=" + moduleCache.urlParams.sellerType + "&cateId=" + moduleCache.urlParams.cateId
                                + "&indexCode=payAmt,uv,payItemCnt,paySlrCnt";
                        }
                        var priceSegCacheKey = globalUrlPrefix + "/mc/rivalBrand/analysis/getPriceSegConstitute.json?sellerType="
                            + moduleCache.urlParams.sellerType + "&device=" + moduleCache.urlParams.device + "&brandId=" + brandItem.brandId
                            + "&cateId=" + moduleCache.urlParams.cateId + "&dateType=" + moduleCache.urlParams.dateType + "&dateRange=" + moduleCache.urlParams.dateRange,
                            cateCacheData = commonModule.getUsableOriginalJsonDataFromCache(cateCacheKey, true),
                            priceSegCacheData = commonModule.getUsableOriginalJsonDataFromCache(priceSegCacheKey, true);
                        brandItem.cateData = [];
                        if (cateCacheData) {
                            brandItem.cateData = cateCacheData;
                        }
                        brandItem.priceSegData = [];
                        if (priceSegCacheData) {
                            brandItem.priceSegData = priceSegCacheData;
                        }
                        return false;
                    }
                });
            }
        });
        transformData();
    }

    function transformData() {
        var statisticsTime = $(".oui-date-picker-current-date").text().replace("统计时间", "");
        moduleCache.data.mergeData = {cate: [], priceSeg: []}, moduleCache.data.compareData = {cate: [], priceSeg: []};
        var compareCate = {}, comparePriceSeg = {};
        for (var i in moduleCache.data.brandData) {
            var brandItem = moduleCache.data.brandData[i], cateData = brandItem.cateData, priceSegData = brandItem.priceSegData;
            for (var j in cateData) {
                var cateItem = cateData[j], cateMergeItem = {
                    brandName: brandItem.name,
                    brandPic: brandItem.picUrl,
                    type: brandItem.alias,
                    backgroundColor: brandItem.backgroundColor,
                    dateTime: statisticsTime,
                    cateName: cateItem.cateName,
                    payAmtRatio: cateItem.payAmt ? Number((cateItem.payAmt.ratio * 100).toFixed(2)) : 0,
                    paySlrCntRatio: cateItem.paySlrCnt ? Number((cateItem.paySlrCnt.ratio * 100).toFixed(2)) : 0,
                    payItemCntRatio: cateItem.payItemCnt ? Number((cateItem.payItemCnt.ratio * 100).toFixed(2)) : 0,
                    uvRatio: cateItem.uv.ratio
                };
                moduleCache.data.mergeData.cate.push(cateMergeItem);
                var compareCateItem = compareCate[cateItem.cateName];
                if (!compareCateItem) {
                    compareCateItem = {cateName: cateItem.cateName};
                    compareCate[cateItem.cateName] = compareCateItem;
                }
                compareCateItem["payAmtRatio_" + brandItem.brandId] = cateItem.payAmt ? Number((cateItem.payAmt.ratio * 100).toFixed(2)) : 0;
                compareCateItem["paySlrCntRatio_" + brandItem.brandId] = cateItem.paySlrCnt.ratio;
                compareCateItem["payItemCntRatio_" + brandItem.brandId] = cateItem.payItemCnt.ratio;
                compareCateItem["uvRatio_" + brandItem.brandId] = cateItem.uv.ratio;
            }
            for (var j in priceSegData) {
                var priceSegItem = priceSegData[j], priceSegMergeItem = {
                    brandName: brandItem.name,
                    brandPic: brandItem.picUrl,
                    type: brandItem.alias,
                    backgroundColor: brandItem.backgroundColor,
                    dateTime: statisticsTime,
                    priceSegName: priceSegItem.attrName.value,
                    payAmtRatio: priceSegItem.payAmt ? Number((priceSegItem.payAmt.ratio * 100).toFixed(2)) : 0,
                    payAmtValue: priceSegItem.payAmt ? Number((priceSegItem.payAmt.value * 100).toFixed(0)) : 0,
                    payItemCnt: priceSegItem.payItemCnt.value
                };
                moduleCache.data.mergeData.priceSeg.push(priceSegMergeItem);
                var comparePriceSegItem = comparePriceSeg[priceSegItem.attrName.value];
                if (!comparePriceSegItem) {
                    comparePriceSegItem = {
                        priceSegName: priceSegItem.attrName.value
                    };
                    comparePriceSeg[priceSegItem.attrName.value] = comparePriceSegItem;
                }
                comparePriceSegItem["payAmtRatio_" + brandItem.brandId] = priceSegItem.payAmt ? Number((priceSegItem.payAmt.ratio * 100).toFixed(2)) : 0;
                comparePriceSegItem["payItemCnt_" + brandItem.brandId] = priceSegItem.payItemCnt.value;
                comparePriceSegItem["payAmtValue_" + brandItem.brandId] = priceSegItem.payAmt ? Number((priceSegItem.payAmt.value * 100).toFixed(2)) : 0;
            }
        }
        // 转换对比模式下的数据为数组
        for (var key in compareCate) {
            var compareCateItem = compareCate[key];
            moduleCache.data.compareData.cate.push(compareCateItem);
        }
        for (var key in comparePriceSeg) {
            var comparePriceSegItem = comparePriceSeg[key];
            moduleCache.data.compareData.priceSeg.push(comparePriceSegItem);
        }
    }

    function renderPieChart() {
        var chartItemWidth = (100 / moduleCache.data.brandData.length).toFixed(4);
        chartItemWidth = chartItemWidth.substring(0, chartItemWidth.length - 2);
        $.each(moduleCache.data.brandData, function (index, item) {
            var chartItemWrapper = $("<div style='width: " +
                chartItemWidth + "%; height: 100%; padding: 0px 5px;display: inline-block;position:relative;'>" +
                "<div id='rivalShopPie" + index + "' style='height: 100%'></div>");
            $("#" + moduleCache.chartElementId).append(chartItemWrapper);
            var legendData = [], seriesData = [];
            if (moduleCache.currentClickButton == moduleCache.buttonType.cate) {
                var brandCateData = item.cateData;
                for (var i in brandCateData) {
                    var brandCateDataItem = brandCateData[i], seriesItem = {
                        name: brandCateDataItem.cateName,
                        value: brandCateDataItem.payAmt ? Number((brandCateDataItem.payAmt.ratio * 100).toFixed(2)) : 0
                    };
                    legendData.push(brandCateDataItem.cateName), seriesData.push(seriesItem);
                }
            } else {
                var brandPriceSegData = item.priceSegData;
                for (var i in brandPriceSegData) {
                    var brandPriceSegDataItem = brandPriceSegData[i], seriesItem = {
                        name: brandPriceSegDataItem.attrName.value,
                        value: brandPriceSegDataItem.payAmt ? Number((brandPriceSegDataItem.payAmt.ratio * 100).toFixed(2)) : 0
                    };
                    legendData.push(brandPriceSegDataItem.attrName.value), seriesData.push(seriesItem);
                }
            }
            var option = {
                title: {
                    text: item.alias,
                    top: "top",
                    left: "center",
                    textStyle: {
                        fontSize: 12,
                        fontWeight: "bold"
                    }
                },
                legend: {
                    data: legendData,
                    left: "center",
                    top: 200,
                    icon: "circle",
                    textStyle: {
                        fontSize: 12
                    },
                    itemHeight: 10
                },
                tooltip: {
                    trigger: 'item',
                    backgroundColor: "#fff",
                    textStyle: {
                        color: "black",
                        fontSize: 12
                    },
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                    formatter: '{a} <br/>{b} : {d}%'
                },
                color: commonModule.getChartColors().hex,
                series: [
                    {
                        name: '支付金额占比',
                        type: 'pie',
                        radius: '62%',
                        center: ['50%', '43%'],
                        data: seriesData,
                        label: {
                            position: "inside",
                            formatter: '{d}%'
                        }
                    }]
            };
            var thisChart = echarts.init($("#rivalShopPie" + index)[0]);
            thisChart.setOption(option, true);
            window.addEventListener("resize", function () {
                thisChart.resize();
            });
        });
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var activeTableModel = $("#" + moduleCache.tabElementId + " .layui-this").attr("value"),
            heightGap = ($(window).height() * 0.05 + 104 + 50 + 260).toFixed(0), cols, tableData = [];
        if (activeTableModel == "merge"){
            cols = [[
                {field: 'name', title: "品牌名称", minWidth: 200, sort: true, templet: function (row) {
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='//img.alicdn.com/tps/" + row.brandPic + "'/><span>" +
                            row.brandName + "</span></div>";
                    }},
                {field: "shopType", title: "类别", minWidth: 100, sort: true, templet: function (row) {
                        return "<span class='wxr-text-color-block' style='background: " + row.backgroundColor + "'>" + row.type + "</span>";
                    }},
                {field: "dateTime", title: "日期", minWidth: 180, sort: true}
            ]];
            if (moduleCache.currentClickButton == moduleCache.buttonType.cate) {
                cols[0].push.apply(cols[0], [
                    {field: "cateName", title: "类目名称", minWidth: 110, sort: true},
                    {field: "payAmtRatio", title: "支付金额占比", minWidth: 130, sort: true, isPercentValue: true},
                    {field: "uvRatio", title: "访客数占比", minWidth: 110, sort: true, isPercentValue: true},
                    {field: "payItemCntRatio", title: "支付商品数占比", minWidth: 150, sort: true, isPercentValue: true},
                    {field: "paySlrCntRatio", title: "支付卖家数占比", minWidth: 150, sort: true, isPercentValue: true},
                ]);
                // tableData = moduleCache.data.mergeData.cate;
            } else {
                cols[0].push.apply(cols[0], [
                    {field: "priceSegName", title: "价格带", minWidth: 110, sort: true},
                    {field: "payAmtValue", title: "支付金额", minWidth: 130, sort: true},
                    {field: "payAmtRatio", title: "支付金额占比", minWidth: 150, sort: true, isPercentValue: true},
                    {field: "payItemCnt", title: "支付件数", minWidth: 130, sort: true}
                ]);
                // tableData = moduleCache.data.mergeData.priceSeg;
            }
            tableData = moduleCache.data.mergeData[moduleCache.currentClickButton];
        } else if (activeTableModel == "compare") {
            cols = [[], []];
            if (moduleCache.currentClickButton == moduleCache.buttonType.cate) {
                cols[0].push({field: "cateName", title: "类目名称", minWidth: 110, sort: true, rowspan: 2});
            } else {
                cols[0].push({field: "priceSegName", title: "价格带", minWidth: 110, sort: true, rowspan: 2});
            }
            for (var i in moduleCache.data.brandData) {
                var brandItem = moduleCache.data.brandData[i];
                if (moduleCache.currentClickButton == moduleCache.buttonType.cate) {
                    cols[0].push({field: "colspan_" + brandItem.brandId, title: "<div style='display: inline-block'><img class='wxr-image-box wxr-image-box-36' src='//img.alicdn.com/tps/" +
                            brandItem.picUrl + "'/></div><div style='display: inline-block;vertical-align: middle'><ul><li>" + brandItem.name +
                            "</li><li>" + brandItem.brandId + "</li></ul></div><div style='float: right'><span class='wxr-text-color-block' style='background: " + brandItem.backgroundColor + "'>" + brandItem.alias +
                            "</span></div>", colspan: 4});
                    cols[1].push.apply(cols[1], [
                        {field: "payAmtRatio_" + brandItem.brandId, title: "支付金额占比", minWidth: 110, sort: true},
                        {field: "uvRatio_" + brandItem.brandId, title: "访客数占比", minWidth: 110, sort: true},
                        {field: "payItemCntRatio_" + brandItem.brandId, title: "支付商品数占比", minWidth: 110, sort: true},
                        {field: "paySlrCntRatio_" + brandItem.brandId, title: "支付卖家数占比", minWidth: 110, sort: true}
                    ]);
                } else {
                    cols[0].push({field: "colspan_" + brandItem.brandId, title: "<div style='display: inline-block'><img class='wxr-image-box wxr-image-box-36' src='//img.alicdn.com/tps/" +
                            brandItem.picUrl + "'/></div><div style='display: inline-block;vertical-align: middle'><ul><li>" + brandItem.name +
                            "</li><li>" + brandItem.brandId + "</li></ul></div><div style='float: right'><span class='wxr-text-color-block' style='background: " + brandItem.backgroundColor + "'>" + brandItem.alias +
                            "</span></div>", colspan: 3});
                    cols[1].push.apply(cols[1], [
                        {field: "payAmtValue_" + brandItem.brandId, title: "支付金额", minWidth: 110, sort: true},
                        {field: "payAmtRatio_" + brandItem.brandId, title: "支付金额占比", minWidth: 110, sort: true},
                        {field: "payItemCnt_" + brandItem.brandId, title: "支付件数", minWidth: 110, sort: true}
                    ]);
                }
            }
            tableData = moduleCache.data.compareData[moduleCache.currentClickButton];
        }
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: tableData,
            height: 'full-' + heightGap,
            cols: cols,
            initSort: {
                field: 'payAmtRatio',
                type: "desc"
            },
            done: function () {
                if (activeTableModel == "merge") {
                    $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "'] .layui-table-body td").css({padding: "4px 0px"});
                }
            }
        };
        if (activeTableModel == "compare") {
            renderTableOptions.skin = "";
        }
        commonModule.renderTable(renderTableOptions, layero);
    }

    return {
        init: function () {
            var targetDom = $("#brandAnalysisTradeTrade .oui-card-header-wrapper .oui-card-title"),
                buttons = [
                    {btnName: "子类目", class: "", clickEventFunction: oneClickTransformForCate, cssStyle: "width:70px"},
                    {btnName: "价格带", class: "", clickEventFunction: oneClickTransformForPriceSeg, cssStyle: "width:70px"}
                ];
            commonModule.injectButtons(targetDom, "after", buttons, true, function (targetDom) {
                // $(".wxr-tool-buttons-inject-container").css("float", "none");
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  竞争-品牌客群趋势
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var brandCustomerTrendModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "品牌客群趋势",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        data: {
            hasSelectedBrands: [],
            mergeData: [],
            compareData: [],
        },// 表格展示需要的数据
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "brand-customer-trend-table", //table的dom控件的id属性
        tableLayId: "brandCustomerTrendTable", //table在layui中定义的id，即lay-ui属性
        tabElementId: "brand-customer-trend-tab",
        chartElementId: "brand-customer-trend-chart",
        statisticEndTimeStr: "",
        sortedIndexCards: [
            {indexCode: "tradeIndex", indexName: "交易金额", isActive: true},
            {indexCode: "uvIndex", indexName: "访客人数"},
            {indexCode: "payRateIndex", indexName: "支付转化率", isPercentValue: true},
            {indexCode: "payByrCntIndex", indexName: "支付人数"},
            {indexCode: "perTicketSales", indexName: "客单价"},
            {indexCode: "uvValue", indexName: "uv价值"}
        ]
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + statisticsTimeText + " | "
                + $("#shopAnalysisSelect").next().find(".oui-card-header-wrapper .ant-select-selection-selected-value").text();
        var dialogOptions = {
            title: dialogTitle,
            // offset: "100px",
            area: ['98%', '98%'],
            // offset: "100px",
            content: "<div class='wxr-cards-container'></div>" +
                "<div class='wxr-charts-container' id='" + moduleCache.chartElementId + "'></div>" +
                "<div id='" + moduleCache.tabElementId + "' class='layui-tab layui-tab-brief' lay-filter='tabLayFilter'><ul class='layui-tab-title'><li class='layui-this' value='merge'>合并模式</li><li value='compare'>对比模式</li></ul></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0});
                setTimeout(function () {
                    try {
                        drawIndexCards();
                        renderTabs();
                        renderChart();
                        renderTable(loading, layero);
                    } catch (e) {
                        console.error(e);
                        layui.layer.close(loading);
                    }
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    function renderTabs() {
        $("#" + moduleCache.tabElementId).css({padding: "5px 0px"});
        if (moduleCache.data.hasSelectedBrands.length <= 1) {
            $("#" + moduleCache.tabElementId + " li:last").addClass("wxr-tab-disabled");
        }
        layui.element.on("tab(tabLayFilter)", function () {
            renderTable();
        });
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 获取cateId，遍历localStorage，直接从缓存中获取shopCate
        var cateName = $(".ebase-FaCommonFilter__top .oui-pro-common-picker .common-picker-header").attr("title"),
            parsedCate = commonModule.parseShopCateName(cateName);
        if (!parsedCate) {
            return;
        }
        // 首先获取所有的监控的品牌列表
        var rivalBrandCacheKey = globalUrlPrefix + "/mc/ci/config/rival/brand/getMonitoredList.json?firstCateId=" +
            parsedCate[6] + "&keyword=",
            rivalBrandCacheData = commonModule.getUsableOriginalJsonDataFromCache(rivalBrandCacheKey, true),
            // 保存竞品临时集合
            rivalBrands = {};
        // 找到数据后进行格式转化，以brandId为key来保存，方便后面使用
        if (rivalBrandCacheData) {
            for (var i in rivalBrandCacheData) {
                var brand = rivalBrandCacheData[i];
                rivalBrands[brand.brandId] = brand;
            }
        }
        // 遍历localStorage查找所有的曾选择过的品牌, 组装趋势数据
        var activeIndexCode = $("#sycmMqBrandCunstomer .index-picker-container .oui-index-picker-item .ant-radio-checked input[type='radio']").attr("value"),
            trendDataCacheKey = globalUrlPrefix + "/mc/ci/brand/crowd/trend.json?cateId=" + moduleCache.urlParams.cateId +
            "&diffBrandIds=&device=" + moduleCache.urlParams.device + "&sellerType=" + moduleCache.urlParams.sellerType +
            "&dateType=" + moduleCache.urlParams.dateType + "&dateRange=" + moduleCache.urlParams.dateRange +
                "&indexCode=" + activeIndexCode, trendCacheData, diffBrandIds = "";
        var colorArray = commonModule.getChartColors().hex;
        moduleCache.data.hasSelectedBrands = [];
        $("#completeShop .sycm-common-select-wrapper .alife-dt-card-sycm-common-select").each(function (index, item) {
            var rivalBrandName = $(this).find(".sycm-common-select-selected-title").attr("title");
            if (!rivalBrandName) {
                diffBrandIds += ",";
                return true;
            }
            $.each(rivalBrands, function (brandId, brandItem) {
                if (rivalBrandName == brandItem.name) {
                    brandItem.isActive = true;
                    brandItem.alias = "品牌" + (index + 1);
                    brandItem.backgroundColor = colorArray[index % colorArray.length];
                    moduleCache.data.hasSelectedBrands.push(brandItem);
                    diffBrandIds += brandId + ",";
                    return false;
                }
            });
        });
        diffBrandIds = diffBrandIds.substring(0, diffBrandIds.length - 1);
        trendDataCacheKey = trendDataCacheKey.replace(/&diffBrandIds\S+&device/, "&diffBrandIds=" + diffBrandIds + "&device");
        trendCacheData = commonModule.getUsableOriginalJsonDataFromCache(trendDataCacheKey, true);
        if (trendCacheData) {
            for (var brandId in trendCacheData) {
                var trendItemByBrandId = trendCacheData[brandId];
                rivalBrands[brandId].trendData = trendItemByBrandId;
            }
        }
        transformData();
    }

    function transformData() {
        if (moduleCache.data.hasSelectedBrands.length == 0) {
            return;
        }
        var trendDataLength = moduleCache.data.hasSelectedBrands[0].trendData.tradeIndex.length,
            endTimeStr = moduleCache.urlParams.dateRange.split("|")[1];
        moduleCache.dateTimes = commonModule.generateStatisticTimes(trendDataLength, endTimeStr, moduleCache.urlParams.dateType);
        moduleCache.data.mergeData = [], moduleCache.data.compareData = [];
        for (var j = 0; j < trendDataLength; j++) {
            var compareDataItem = {dateTime: moduleCache.dateTimes[j]};
            $.each(moduleCache.data.hasSelectedBrands, function (index, item) {
                // if (item.isDataTransformCompleted) {
                //     return true;
                // }
                if (j == 0) {// 第一次要重新初始化相关数据
                    // 为每个商品准备一个已转化的趋势数据集合
                    item.transformTrendData = {};
                    // 每个商品单独存储一份自己的合并数据
                    item.mergeData = [];
                }
                if (!item.isActive) {
                    return true;
                }
                var trendData = item.trendData, mergeDataItem = {
                    brandName: item.name,
                    type: item.alias,
                    picUrl: item.picUrl,
                    dateTime: moduleCache.dateTimes[j],
                    brandId: item.brandId,
                    backgroundColor: item.backgroundColor
                };
                // 对店铺趋势数据中原有的指标的当前循环索引进行转换
                for (var indexCode in trendData) {
                    var indexValue = trendData[indexCode][j];
                    if (indexCode != "payRateIndex") {
                        if (indexCode == "payItemCnt" || indexCode == "slrCnt" || indexCode == "paySlrCnt") {// 无需转换的指标

                        } else {
                            indexValue = commonModule.calculateFormula(indexValue, 1, 0);
                        }
                    } else {
                        indexValue = commonModule.calculateFormula(indexValue, 0, 2);
                    }
                    if (!item.transformTrendData[indexCode]) {
                        item.transformTrendData[indexCode] = [];
                    }
                    item.transformTrendData[indexCode].push(indexValue);
                    if (indexValue != null) {// 所有的指标如果有一个存在有效值，则设置有效标记，没有有效值标记的对象将不会放入merge和compare集合
                        mergeDataItem.isEffective = true;
                        compareDataItem.isEffective = true;
                    }
                    mergeDataItem[indexCode] = indexValue;
                    compareDataItem[indexCode + "_" + item.brandId] = indexValue;
                }
                // 原有的指标转化完毕之后，计算其他指标
                // 访客人数
                if (!item.transformTrendData.uvIndex) {
                    item.transformTrendData.uvIndex = [];
                }
                if (mergeDataItem.payRateIndex == null && mergeDataItem.payByrCntIndex == null) {
                    mergeDataItem.uvIndex = null;
                } else {
                    mergeDataItem.uvIndex = Number((mergeDataItem.payByrCntIndex / mergeDataItem.payRateIndex * 100).toFixed(0));
                }
                compareDataItem["uvIndex_" + item.brandId] = mergeDataItem.uvIndex;
                item.transformTrendData.uvIndex.push(!mergeDataItem.uvIndex ? 0 : mergeDataItem.uvIndex);
                // uv价值
                if (!item.transformTrendData.uvValue) {
                    item.transformTrendData.uvValue = [];
                }
                if (mergeDataItem.tradeIndex == null && mergeDataItem.uvIndex == null) {
                    mergeDataItem.uvValue = null;
                } else {
                    mergeDataItem.uvValue = !mergeDataItem.uvIndex ? 0 : Number((mergeDataItem.tradeIndex / mergeDataItem.uvIndex).toFixed(2));
                }
                compareDataItem["uvValue_" + item.brandId] = mergeDataItem.uvValue;
                item.transformTrendData.uvValue.push(mergeDataItem.uvValue);
                // 客单价
                if (!item.transformTrendData.perTicketSales) {
                    item.transformTrendData.perTicketSales = [];
                }
                if (mergeDataItem.tradeIndex == null && mergeDataItem.payByrCntIndex == null) {
                    mergeDataItem.perTicketSales = null;
                } else {
                    mergeDataItem.perTicketSales = !mergeDataItem.payByrCntIndex ? 0 : Number((mergeDataItem.tradeIndex / mergeDataItem.payByrCntIndex).toFixed(2));
                }
                compareDataItem["perTicketSales_" + item.brandId] = mergeDataItem.perTicketSales;
                item.transformTrendData.perTicketSales.push(mergeDataItem.perTicketSales);
                item.mergeData.push(mergeDataItem);
                if (mergeDataItem.isEffective) {
                    moduleCache.data.mergeData.push(mergeDataItem);
                }
                // 店铺的所有指标数据已转化完毕，汇总一下数据
                if (j == trendDataLength - 1) {
                    for (var indexCode in item.transformTrendData) {
                        try {
                            item[indexCode + "_total"] = eval(item.transformTrendData[indexCode].join("+"));
                        } catch (e) {

                        }
                    }
                    // 除了交易金额、访客人数、支付人数之外，支付转化率、uv价值以及客单价都需要按月份数据汇总之后重新计算
                    item["payRateIndex_total"] = !item["uvIndex_total"] ? 0 : Number((item["payByrCntIndex_total"] / item["uvIndex_total"] * 100).toFixed(2));
                    item["uvValue_total"] = !item["uvIndex_total"] ? 0 : Number((item["tradeIndex_total"] / item["uvIndex_total"]).toFixed(2));
                    item["perTicketSales_total"] = !item["payByrCntIndex_total"] ? 0 : Number((item["tradeIndex_total"] / item["payByrCntIndex_total"]).toFixed(2));
                    item.isDataTransformCompleted = true;
                }
            });
            if (compareDataItem.isEffective) {
                moduleCache.data.compareData.push(compareDataItem);
            }
        }
    }

    function drawIndexCards() {
        // 已选中的指标块初始化
        moduleCache.activeIndexCards = {};
        $(".wxr-cards-container").html("");
        // var sortedIndexCards = assembleIndexCards();
        // 计算每个小块宽度的百分比
        var cardItemWrapperPercent = (100 / moduleCache.sortedIndexCards.length).toFixed(4);
        // 舍去最后一位，防止宽度超出
        cardItemWrapperPercent = cardItemWrapperPercent.substring(0, cardItemWrapperPercent.length - 2);
        $(".wxr-cards-container").css({width: "80%", padding: "0px 35px"});
        // for (var i in moduleCache.firstLevelCategoryArray) {
        var activeIndexCode = $("#sycmMqBrandCunstomer .index-picker-container .oui-index-picker-item .ant-radio-checked input[type='radio']").attr("value");
        // if (activeIndexCode == "pvIndex") {
        //     activeIndexCode = "uvIndex";
        // } else if (activeIndexCode == "cltByrCntIndex") {
        //     activeIndexCode = "cltHits";
        // }
        $.each(moduleCache.sortedIndexCards, function (index, indexItem) {
            var cardItemWrapper = $("<div class='wxr-card-item-wrapper' style='width: " +
                cardItemWrapperPercent + "%'></div>"),
                // cardItemBody = $("<div class='wxr-card-item-body wxr-card-item-body-solid'><i class='layui-icon layui-icon-ok-circle wxr-card-item-body-icon'></i></div>");
                cardItemBody = $("<div class='wxr-card-item-body wxr-card-item-body-solid' style='white-space: nowrap;overflow: hidden;text-overflow: ellipsis'><i class='layui-icon layui-icon-ok-circle wxr-card-item-body-icon'></i></div>");
            cardItemWrapper.append(cardItemBody);
            if (indexItem.indexCode == activeIndexCode) {
                indexItem.isActive = true;
                cardItemBody.addClass("wxr-card-item-body-active");
                cardItemBody.find(".wxr-card-item-body-icon").addClass("wxr-card-item-body-icon-checked");
                moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
            }
            // 填充内容
            // var bodyContent = $("<ul><li class='wxr-card-item-body-title'><div class='wxr-text-ellipsis' title='" + indexItem.indexName + "'>" + indexItem.indexName + "</div></li>" +
            //     // "<li class='wxr-card-item-body-data' style='font-size: 18px;line-height: 20px;color: #0C0C0C'><div class='wxr-text-ellipsis'>" + indexItem.indexValue + "</div></li>" +
            //     // "<li class='wxr-card-item-body-data' style='font-size: 12px'><div class='wxr-text-ellipsis'>" + indexItem.compareText + "</div><div class='wxr-text-ellipsis'>" + indexItem.indexCycleCrc + "<i class='" + indexItem.cycleCrcIconClassName + "'></i></div></li>" +
            //     "</ul>");
            var bodyContent = $("<ul><li class='wxr-card-item-body-title'><div class='wxr-text-ellipsis' title='" + indexItem.indexName + "'>" + indexItem.indexName + "</div></li></ul>");
            $.each(moduleCache.data.hasSelectedBrands, function(brandIndex, brandItem) {
                if (brandItem.isActive) {
                    bodyContent.append("<li class='wxr-card-item-body-data'><div class='wxr-text-ellipsis' title='" + brandItem.alias + "'>" + brandItem.alias + "</div><div class='wxr-text-ellipsis'>" + brandItem[indexItem.indexCode + "_total"] + (indexItem.isPercentValue ? "%" : "") + "</div></li>");
                }
            });
            bodyContent.find("li").each(function (index, item) {
                $(this).css({margin: "4px 0px"});
                if ($(this).find("div").length == 2) {
                    $(this).find("div:first-child").css({width: "40%"});
                    $(this).find("div:nth-child(2)").css({width: "60%", textAlign: "right"});
                }
            });
            // bodyContent.find(".wxr-card-item-body-data").css({color: "#ffffff"});
            cardItemBody.append(bodyContent);
            $(".wxr-cards-container").append(cardItemWrapper);
            // 点击事件绑定
            cardItemBody.on("click", function () {
                var activeShopCount = moduleCache.data.hasSelectedBrands.length;
                // $(".wxr-cards-container .wxr-card-item-body").removeClass("wxr-card-item-body-active");
                if (activeShopCount > 1) {// 每次只能选中一个指标
                    $(".wxr-cards-container .wxr-card-item-body-active").removeClass("wxr-card-item-body-active");
                    $(".wxr-cards-container .layui-icon-ok-circle").removeClass("wxr-card-item-body-icon-checked");
                    $(this).addClass("wxr-card-item-body-active");
                    $(this).find(".layui-icon-ok-circle").addClass("wxr-card-item-body-icon-checked");
                    moduleCache.activeIndexCards = {};
                    moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                } else {// 可选中多个指标
                    if ($(this).hasClass("wxr-card-item-body-active")) {
                        if ($(".wxr-cards-container .wxr-card-item-body-active").length > 1) {
                            $(this).removeClass("wxr-card-item-body-active");
                            cardItemBody.find(".layui-icon-ok-circle").removeClass("wxr-card-item-body-icon-checked");
                            delete moduleCache.activeIndexCards[indexItem.indexCode];
                        }
                    } else {
                        $(this).addClass("wxr-card-item-body-active");
                        cardItemBody.find(".layui-icon-ok-circle").addClass("wxr-card-item-body-icon-checked");
                        moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                    }
                }
                renderChart();
            });
        });
    }

    function renderChart() {
        var thisChart = echarts.init($("#" + moduleCache.chartElementId + "")[0]),
            xAxisData = moduleCache.dateTimes, seriesDataArray = [], count = 0, interval = 1;
        if (moduleCache.urlParams.dateType == "day" || moduleCache.urlParams.dateType == "recent7" || moduleCache.urlParams.dateType == "recent30") {
            interval = 3;
        }
        var activeItemCount = moduleCache.data.hasSelectedBrands.length, colorArray = [];
        if (activeItemCount > 1) {
            // count = 1;
            for (var i in moduleCache.data.hasSelectedBrands) {
                var item = moduleCache.data.hasSelectedBrands[i];
                if (!item.isActive) {
                    continue;
                }
                // 当前选中的指标code，只能选中一个
                var activeIndexCode = Object.keys(moduleCache.activeIndexCards)[0],
                    seriesObj = {
                        name: item.alias + "(" + moduleCache.activeIndexCards[activeIndexCode].indexName + ")",
                        type: 'line',
                        data: item.transformTrendData[activeIndexCode],
                        smooth: true,
                        symbol: "circle",
                        showSymbol: false,
                        symbolSize: 6
                    };
                seriesDataArray.push(seriesObj);
                colorArray.push(item.backgroundColor);
                // count++;
            }

        } else {
            var activeBrand;
            $.each(moduleCache.data.hasSelectedBrands, function (index, item) {
                if (item.isActive) {
                    activeBrand = item;
                    return false;
                }
            });
            for (var indexCode in moduleCache.activeIndexCards) {
                var activeCardItem = moduleCache.activeIndexCards[indexCode], seriesObj = {
                    name: activeCardItem.indexName,
                    type: 'line',
                    data: activeBrand.transformTrendData[indexCode],
                    smooth: true,
                    symbol: "circle",
                    showSymbol: false,
                    symbolSize: 6,
                    yAxisIndex: count
                };
                seriesDataArray.push(seriesObj);
                count++;
            }
        }
        var chartOptions = {
            xAxis: {
                type: 'category',
                axisLabel: {
                    interval: interval
                },
                axisLine: {},
                data: xAxisData,
            },
            series: seriesDataArray
        };
        if (activeItemCount > 1) {
            chartOptions.color = colorArray;
        }
        commonModule.renderLineCharts(chartOptions, thisChart, count);
        // thisChart.resize();
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(loading, layero) {
        var activeTableModel = $("#" + moduleCache.tabElementId + " .layui-this").attr("value"),
            heightGap = ($(window).height() * 0.02 + 260 + 104 + 50 + 44).toFixed(0),
            cols, tableData = [];
        if (activeTableModel == "merge") {
            cols = [[
                {
                    field: 'brandName', title: "品牌名称", minWidth: 180, sort: true, templet: function (row) {
                        // return "<img src='" + row.shop.pictureUrl + "'/><span>" + row.shopName + "</span>";
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='//img.alicdn.com/tps/" + row.picUrl + "'/>" +
                            "<span>" + row.brandName + "</span></div>";
                    }
                },
                {
                    field: "type", title: "类别", sort: true, minWidth: 100, templet: function (row) {
                        return "<span class='wxr-text-color-block' style='background: " + row.backgroundColor + "'>" + row.type + "</span>";
                    }
                },
                {field: "dateTime", title: "日期", sort: true, minWidth: 110},
                {field: "tradeIndex", title: "交易金额", minWidth: 90, sort: true},
                {field: "uvIndex", title: "访客人数", minWidth: 90, sort: true},
                {field: "payByrCntIndex", title: "支付人数", minWidth: 90, sort: true},
                {field: "payRateIndex", title: "支付转化率", minWidth: 100, sort: true, isPercentValue: true},
                {field: "perTicketSales", title: "客单价", minWidth: 70, sort: true},
                // {field: "seIpvUvHits", title: "搜索人数", minWidth: 90, sort: true},
                // {field: "cltHits", title: "收藏人数", minWidth: 90, sort: true},
                // {field: "cartHits", title: "加购人数", minWidth: 90, sort: true},
                {field: "uvValue", title: "uv价值", minWidth: 70, sort: true},
                // {field: "seIpvUvHitsRate", title: "搜索占比", minWidth: 90, sort: true, isPercentValue: true},
                // {field: "cltRate", title: "收藏率", minWidth: 80, sort: true, isPercentValue: true},
                // {field: "cartRate", title: "加购率", minWidth: 80, sort: true, isPercentValue: true},
                // {field: "payItemCnt", title: "支付件数", minWidth: 90, sort: true},
                // {field: "slrCnt", title: "卖家数", minWidth: 90, sort: true},
                // {field: "paySlrCnt", title: "有支付卖家数", minWidth: 130, sort: true},
            ]];
            tableData = moduleCache.data.mergeData;
        } else {
            cols = [[], []];
            cols[0].push({field: "dateTime", title: "日期", minWidth: 110, sort: true, rowspan: 2});
            for (var i in moduleCache.data.hasSelectedBrands) {
                var item = moduleCache.data.hasSelectedBrands[i];
                if (item.isActive) {
                    cols[0].push({title: "<div style='display: inline-block'><img class='wxr-image-box wxr-image-box-36' src='//img.alicdn.com/tps/" +
                            item.picUrl + "'/></div><div style='display: inline-block;vertical-align: middle'><ul><li>" + item.name +
                            "</li><li>" + item.brandId + "</li></ul></div><div style='float: right'><span class='wxr-text-color-block' style='background: " + item.backgroundColor + "'>" + item.alias +
                            "</span></div>", colspan: 6, field: "colspan_" + item.brandId});
                    cols[1].push.apply(cols[1], [
                        {field: "tradeIndex_" + item.brandId, title: "交易金额", minWidth: 100, sort: true},
                        {field: "uvIndex_" + item.brandId, title: "访客人数", minWidth: 100, sort: true},
                        {field: "payByrCntIndex_" + item.brandId, title: "支付人数", minWidth: 100, sort: true},
                        {field: "payRateIndex_" + item.brandId, title: "支付转化率", minWidth: 110, sort: true, isPercentValue: true},
                        {field: "perTicketSales_" + item.brandId, title: "客单价", minWidth: 90, sort: true},
                        // {field: "seIpvUvHits_" + item.brandId, title: "搜索人数", minWidth: 90, sort: true},
                        // {field: "cltHits_" + item.brandId, title: "收藏人数", minWidth: 90, sort: true},
                        // {field: "cartHits_" + item.brandId, title: "加购人数", minWidth: 90, sort: true},
                        {field: "uvValue_" + item.brandId, title: "uv价值", minWidth: 90, sort: true},
                        // {field: "seIpvUvHitsRate_" + item.brandId, title: "搜索占比", minWidth: 90, sort: true, isPercentValue: true},
                        // {field: "cltRate_" + item.brandId, title: "收藏率", minWidth: 80, sort: true, isPercentValue: true},
                        // {field: "cartRate_" + item.brandId, title: "加购率", minWidth: 80, sort: true, isPercentValue: true},
                        // {field: "payItemCnt_" + item.brandId, title: "支付件数", minWidth: 90, sort: true},
                        // {field: "slrCnt_" + item.brandId, title: "卖家数", minWidth: 90, sort: true},
                        // {field: "paySlrCnt_" + item.brandId, title: "有支付卖家数", minWidth: 130, sort: true},
                    ]);
                }
            }
            tableData = moduleCache.data.compareData;
        }
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: tableData,
            height: 'full-' + heightGap,
            cols: cols,
            layFilter: moduleCache.tableLayId + "LayFilter",
            done: function () {
                if (loading) {
                    layui.layer.close(loading);
                }
                var currentTableDom = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']"),
                    colorArray = commonModule.getChartColors();
                currentTableDom.find(".layui-table-body td").css({padding: "5px 0px"});
                currentTableDom.find(".layui-table-cell").css({padding: "0px 5px"});
                if (activeTableModel == "compare") {
                    $.each(moduleCache.data.hasSelectedBrands, function (index, item) {
                        if (item.isActive) {
                            currentTableDom.find("th[data-field*='_" + item.brandId + "']").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                            currentTableDom.find("td[data-field*='_" + item.brandId + "']").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                        }
                    });
                }
                // $(".wxr-tool-dialog-content-wrapper .wxr-dialog-sidebar").css({height: $(".wxr-tool-dialog-content-wrapper .wxr-dialog-main").height()});
            },
            initSort: {
                field: 'dateTime',
                type: "desc"
            }
        };
        if (activeTableModel == "compare") {
            renderTableOptions.skin = "";
        }
        commonModule.renderTable(renderTableOptions, layero);
    }

    return {
        init: function () {
            var targetDom = $("#sycmMqBrandCunstomer .oui-card-header-item.oui-card-header-item-pull-right"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "append", buttons, true, function (targetDom) {

            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  竞争-品牌客群-购买偏好
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var brandCustomerPreferModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "品牌客群 | 购买偏好",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        data: {
            hasSelectedBrands: [],
            mergeData: [],
            compareData: []
        },
        activeIndexCards: {},
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "brand-customer-prefer-table", //table的dom控件的id属性
        tableLayId: "brandCustomerPreferTable", //table在layui中定义的id，即lay-ui属性
        tabElementId: "brand-customer-prefer-tab",
        buttonType: {cate: "cate", brand: "brand"},
        currentClickButton: "",
        chartElementId: "brand-customer-prefer-chart"
    };

    // 类目偏好按钮
    function oneClickTransformForCate() {
        moduleCache.currentClickButton = moduleCache.buttonType.cate;
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    // 品牌偏好按钮
    function oneClickTransformForBrand() {
        moduleCache.currentClickButton = moduleCache.buttonType.brand;
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogOptions = {
            title: dialogTitle,
            area: ['70%', '95%'],
            // offset: "100px",
            content: "<div id='" + moduleCache.tabElementId + "' class='layui-tab layui-tab-brief' lay-filter='tabLayFilter'><ul class='layui-tab-title'><li class='layui-this' value='merge'>合并模式</li><li value='compare'>对比模式</li></ul></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                setTimeout(function () {
                    // renderPieChart();
                    renderTabs();
                    renderTable(layero);
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    function renderTabs() {
        // moduleCache.tableShowModel = "shop";
        $("#" + moduleCache.tabElementId).css({padding: "5px 0px"});
        if (moduleCache.data.hasSelectedBrands.length <= 1) {
            $("#" + moduleCache.tabElementId + " li:last").addClass("wxr-tab-disabled");
        }
        layui.element.on("tab(tabLayFilter)", function () {
            renderTable();
        });
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 获取cateId，遍历localStorage，直接从缓存中获取shopCate
        var cateName = $(".ebase-FaCommonFilter__top .oui-pro-common-picker .common-picker-header").attr("title"),
            parsedCate = commonModule.parseShopCateName(cateName);
        if (!parsedCate) {
            return;
        }
        // 首先获取所有的监控的品牌列表
        var rivalBrandCacheKey = globalUrlPrefix + "/mc/ci/config/rival/brand/getMonitoredList.json?firstCateId=" +
            parsedCate[6] + "&keyword=",
            rivalBrandCacheData = commonModule.getUsableOriginalJsonDataFromCache(rivalBrandCacheKey, true),
            // 保存竞品临时集合
            rivalBrands = {};
        // 找到数据后进行格式转化，以brandId为key来保存，方便后面使用
        if (rivalBrandCacheData) {
            for (var i in rivalBrandCacheData) {
                var brand = rivalBrandCacheData[i];
                rivalBrands[brand.brandId] = brand;
            }
        }
        var activeIndexCode = $("#sycmMqBrandCunstomer .index-picker-container .oui-index-picker-item .ant-radio-checked input[type='radio']").attr("value"),
            preferCacheKey = globalUrlPrefix + "/mc/ci/brand/crowd.json?cateId=" + moduleCache.urlParams.cateId +
                "&diffBrandIds=&device=" + moduleCache.urlParams.device + "&sellerType=" + moduleCache.urlParams.sellerType +
                "&attrType=" + moduleCache.currentClickButton + "_prefer" +
                "&dateType=" + moduleCache.urlParams.dateType + "&dateRange=" + moduleCache.urlParams.dateRange, preferCacheData, diffBrandIds = "";
        var colorArray = commonModule.getChartColors().hex;
        moduleCache.data.hasSelectedBrands = [];
        $("#completeShop .sycm-common-select-wrapper .alife-dt-card-sycm-common-select").each(function (index, item) {
            var rivalBrandName = $(this).find(".sycm-common-select-selected-title").attr("title");
            if (!rivalBrandName) {
                diffBrandIds += ",";
                return true;
            }
            $.each(rivalBrands, function (brandId, brandItem) {
                if (rivalBrandName == brandItem.name) {
                    brandItem.isActive = true;
                    brandItem.alias = "品牌" + (index + 1);
                    brandItem.backgroundColor = colorArray[index % colorArray.length];
                    moduleCache.data.hasSelectedBrands.push(brandItem);
                    diffBrandIds += brandId + ",";
                    return false;
                }
            });
        });
        diffBrandIds = diffBrandIds.substring(0, diffBrandIds.length - 1);
        preferCacheKey = preferCacheKey.replace(/&diffBrandIds\S+&device/, "&diffBrandIds=" + diffBrandIds + "&device");
        preferCacheData = commonModule.getUsableOriginalJsonDataFromCache(preferCacheKey, true);
        if (preferCacheData) {
            for (var brandId in preferCacheData) {
                var preferItemByBrandId = preferCacheData[brandId];
                rivalBrands[brandId].preferData = preferItemByBrandId;
            }
        }
        transformData();
    }

    function transformData() {
        var statisticsTime = $(".oui-date-picker-current-date").text().replace("统计时间", "");
        moduleCache.data.mergeData = [], moduleCache.data.compareData = [];
        var compareItems = {};
        for (var i in moduleCache.data.hasSelectedBrands) {
            var brandItem = moduleCache.data.hasSelectedBrands[i];
            for (var j in brandItem.preferData) {
                var preferDataItem = brandItem.preferData[j], mergeItem = {
                    brandName: brandItem.name,
                    brandPic: brandItem.picUrl,
                    brandType: brandItem.alias,
                    backgroundColor: brandItem.backgroundColor,
                    dateTime: statisticsTime,
                    preferName: preferDataItem.name,
                    preferValue: preferDataItem.value
                };
                moduleCache.data.mergeData.push(mergeItem);
                var compareItem = compareItems[preferDataItem.name];
                if (!compareItem) {
                    compareItem = {preferName: preferDataItem.name};
                    compareItems[preferDataItem.name] = compareItem;
                }
                compareItem["preferValue_" + brandItem.brandId] = preferDataItem.value;
            }
        }
        // 转换对比模式下的数据为数组
        for (var key in compareItems) {
            var compareItem = compareItems[key];
            moduleCache.data.compareData.push(compareItem);
        }
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var activeTableModel = $("#" + moduleCache.tabElementId + " .layui-this").attr("value"),
            heightGap = ($(window).height() * 0.05 + 104 + 50).toFixed(0), cols, tableData = [];
        if (activeTableModel == "merge"){
            cols = [[
                {field: 'name', title: "品牌名称", minWidth: 220, sort: true, templet: function (row) {
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='//img.alicdn.com/tps/" + row.brandPic + "'/><span>"
                             + row.brandName + "</span></div>";
                    }},
                {field: "brandType", title: "类别", minWidth: 100, sort: true, templet: function (row) {
                        return "<span class='wxr-text-color-block' style='background: " + row.backgroundColor + "'>" + row.brandType + "</span>";
                    }},
                {field: "dateTime", title: "日期", minWidth: 100, sort: true},
                {field: "preferName", title: moduleCache.currentClickButton == moduleCache.buttonType.brand ? "偏好品牌" : "偏好类目", minWidth: 100, sort: true},
                {field: "preferValue", title: "偏好人数", minWidth: 100, sort: true}
            ]];

            tableData = moduleCache.data.mergeData;
        } else if (activeTableModel == "compare") {
            cols = [[]];
            if (moduleCache.currentClickButton == moduleCache.buttonType.cate) {
                cols[0].push({field: "preferName", title: "偏好类目", minWidth: 110, sort: true});
            } else {
                cols[0].push({field: "preferName", title: "偏好品牌", minWidth: 110, sort: true});
            }
            for (var i in moduleCache.data.hasSelectedBrands) {
                var brandItem = moduleCache.data.hasSelectedBrands[i];
                // cols[0].push({title: "<div style='display: inline-block'><img class='wxr-image-box wxr-image-box-36' src='" +
                //         shopItem.picUrl + "'/></div><div style='display: inline-block;vertical-align: middle'><ul><li><a href='//" + shopItem.linkUrl + "' target='_blank' title='" + shopItem.name + "'>" + shopItem.name +
                //         "</a></li><li>" + shopItem.userId + "</li></ul></div><div style='float: right'><span class='wxr-text-color-block' style='background: " + shopItem.backgroundColor + "'>" + shopItem.alias +
                //         "</span></div>", colspan: 1, field: "colspan_" + shopItem.userId});
                cols[0].push({field: "preferValue_" + brandItem.brandId, title: "<div style='display: inline-block'><img class='wxr-image-box wxr-image-box-36' src='//img.alicdn.com/tps/" +
                        brandItem.picUrl + "'/></div><div style='display: inline-block;vertical-align: middle'><ul><li>" + brandItem.name +
                        "</li><li>" + brandItem.brandId + "</li></ul></div><div style='float: right'><span class='wxr-text-color-block' style='background: " + brandItem.backgroundColor + "'>" + brandItem.alias +
                        "</span></div></br></br>偏好人数", minWidth: 250, sort: true});
            }
            tableData = moduleCache.data.compareData;
        }
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: tableData,
            height: 'full-' + heightGap,
            cols: cols,
            initSort: {
                field: 'preferValue',
                type: "desc"
            },
            done: function () {
                if (activeTableModel == "merge") {
                    $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "'] .layui-table-body td").css({padding: "4px 0px"});
                }
                if (activeTableModel == "compare") {
                    var currentTableDom = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']"), colorArray = commonModule.getChartColors();
                    $.each(moduleCache.data.hasSelectedBrands, function (index, item) {
                        if (item.isActive) {
                            currentTableDom.find("th[data-field*='_" + item.brandId + "']").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                            currentTableDom.find("td[data-field*='_" + item.brandId + "']").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                        }
                    });
                }
            }
        };
        if (activeTableModel == "compare") {
            renderTableOptions.skin = "";
        }
        commonModule.renderTable(renderTableOptions, layero);
    }

    return {
        init: function () {
            var targetDom = $("#completeShopPurchase .oui-card-header-wrapper .oui-card-header"),
                buttons = [
                    {btnName: "品牌偏好", class: "", clickEventFunction: oneClickTransformForBrand, cssStyle: "width:100px"},
                    {btnName: "类目偏好", class: "", clickEventFunction: oneClickTransformForCate, cssStyle: "width:100px"}
                ];
            commonModule.injectButtons(targetDom, "before", buttons, true, function (targetDom) {
                // $(".wxr-tool-buttons-inject-container").css("float", "none");
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  竞争-品牌客群-支付偏好
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var brandCustomerPayFondnessModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "品牌客群 | 支付偏好",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        data: {
            hasSelectedBrands: [],
            mergeData: [],
            compareData: []
        },
        activeIndexCards: {},
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "brand-customer-pay-fondness-table", //table的dom控件的id属性
        tableLayId: "brandCustomerPayFondnessTable", //table在layui中定义的id，即lay-ui属性
        tabElementId: "brand-customer-pay-fondness-tab",
        buttonType: {payPrice: "payPrice", payCnt: "payCnt"},
        currentClickButton: "",
        chartElementId: "brand-customer-pay-fondness-chart"
    };

    // 类目偏好按钮
    function oneClickTransformForPayPrice() {
        moduleCache.currentClickButton = moduleCache.buttonType.payPrice;
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    // 品牌偏好按钮
    function oneClickTransformForPayCnt() {
        moduleCache.currentClickButton = moduleCache.buttonType.payCnt;
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + " | " + statisticsTimeText + " | "
                + $(".ebase-FaCommonFilter__bottom .ant-select-selection-selected-value").eq(0).text();
        var dialogOptions = {
            title: dialogTitle,
            area: ['70%', '95%'],
            // offset: "100px",
            content: "<div id='" + moduleCache.tabElementId + "' class='layui-tab layui-tab-brief' lay-filter='tabLayFilter'><ul class='layui-tab-title'><li class='layui-this' value='merge'>合并模式</li><li value='compare'>对比模式</li></ul></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div>",
            success: function (layero, index) {
                setTimeout(function () {
                    // renderPieChart();
                    renderTabs();
                    renderTable(layero);
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    function renderTabs() {
        // moduleCache.tableShowModel = "shop";
        $("#" + moduleCache.tabElementId).css({padding: "5px 0px"});
        if (moduleCache.data.hasSelectedBrands.length <= 1) {
            $("#" + moduleCache.tabElementId + " li:last").addClass("wxr-tab-disabled");
        }
        layui.element.on("tab(tabLayFilter)", function () {
            renderTable();
        });
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 获取cateId，遍历localStorage，直接从缓存中获取shopCate
        var cateName = $(".ebase-FaCommonFilter__top .oui-pro-common-picker .common-picker-header").attr("title"),
            parsedCate = commonModule.parseShopCateName(cateName);
        if (!parsedCate) {
            return;
        }
        // 首先获取所有的监控的品牌列表
        var rivalBrandCacheKey = globalUrlPrefix + "/mc/ci/config/rival/brand/getMonitoredList.json?firstCateId=" +
            parsedCate[6] + "&keyword=",
            rivalBrandCacheData = commonModule.getUsableOriginalJsonDataFromCache(rivalBrandCacheKey, true),
            // 保存竞品临时集合
            rivalBrands = {};
        // 找到数据后进行格式转化，以brandId为key来保存，方便后面使用
        if (rivalBrandCacheData) {
            for (var i in rivalBrandCacheData) {
                var brand = rivalBrandCacheData[i];
                rivalBrands[brand.brandId] = brand;
            }
        }
        var activeIndexCode = $("#sycmMqBrandCunstomer .index-picker-container .oui-index-picker-item .ant-radio-checked input[type='radio']").attr("value"),
            preferCacheKey = globalUrlPrefix + "/mc/ci/brand/crowd/payFondness.json?cateId=" + moduleCache.urlParams.cateId +
                "&diffBrandIds=&device=" + moduleCache.urlParams.device + "&sellerType=" + moduleCache.urlParams.sellerType +
                "&attrType=" + (moduleCache.currentClickButton == moduleCache.buttonType.payPrice ? "price_prefer" : "pay_cnt") +
                "&dateType=" + moduleCache.urlParams.dateType + "&dateRange=" + moduleCache.urlParams.dateRange, preferCacheData, diffBrandIds = "";
        var colorArray = commonModule.getChartColors().hex;
        moduleCache.data.hasSelectedBrands = [];
        $("#completeShop .sycm-common-select-wrapper .alife-dt-card-sycm-common-select").each(function (index, item) {
            var rivalBrandName = $(this).find(".sycm-common-select-selected-title").attr("title");
            if (!rivalBrandName) {
                diffBrandIds += ",";
                return true;
            }
            $.each(rivalBrands, function (brandId, brandItem) {
                if (rivalBrandName == brandItem.name) {
                    brandItem.isActive = true;
                    brandItem.alias = "品牌" + (index + 1);
                    brandItem.backgroundColor = colorArray[index % colorArray.length];
                    moduleCache.data.hasSelectedBrands.push(brandItem);
                    diffBrandIds += brandId + ",";
                    return false;
                }
            });
        });
        diffBrandIds = diffBrandIds.substring(0, diffBrandIds.length - 1);
        preferCacheKey = preferCacheKey.replace(/&diffBrandIds\S+&device/, "&diffBrandIds=" + diffBrandIds + "&device");
        preferCacheData = commonModule.getUsableOriginalJsonDataFromCache(preferCacheKey, true);
        if (preferCacheData) {
            for (var brandId in preferCacheData) {
                var preferItemByBrandId = preferCacheData[brandId];
                rivalBrands[brandId].preferData = preferItemByBrandId;
            }
        }
        transformData();
    }

    function transformData() {
        var statisticsTime = $(".oui-date-picker-current-date").text().replace("统计时间", "");
        moduleCache.data.mergeData = [], moduleCache.data.compareData = [];
        var compareItems = {};
        for (var i in moduleCache.data.hasSelectedBrands) {
            var brandItem = moduleCache.data.hasSelectedBrands[i];
            for (var j in brandItem.preferData) {
                var preferDataItem = brandItem.preferData[j], mergeItem = {
                    brandName: brandItem.name,
                    brandPic: brandItem.picUrl,
                    brandType: brandItem.alias,
                    backgroundColor: brandItem.backgroundColor,
                    dateTime: statisticsTime,
                    preferName: preferDataItem.name,
                    preferValue: Number(preferDataItem.value * 100)
                };
                moduleCache.data.mergeData.push(mergeItem);
                var compareItem = compareItems[preferDataItem.name];
                if (!compareItem) {
                    compareItem = {preferName: preferDataItem.name};
                    compareItems[preferDataItem.name] = compareItem;
                }
                compareItem["preferValue_" + brandItem.brandId] = Number(preferDataItem.value * 100);
            }
        }
        // 转换对比模式下的数据为数组
        for (var key in compareItems) {
            var compareItem = compareItems[key];
            moduleCache.data.compareData.push(compareItem);
        }
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(layero) {
        var activeTableModel = $("#" + moduleCache.tabElementId + " .layui-this").attr("value"),
            heightGap = ($(window).height() * 0.05 + 104 + 50).toFixed(0), cols, tableData = [];
        if (activeTableModel == "merge"){
            cols = [[
                {field: 'name', title: "品牌名称", minWidth: 220, sort: true, templet: function (row) {
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='//img.alicdn.com/tps/" + row.brandPic + "'/><span>"
                            + row.brandName + "</span></div>";
                    }},
                {field: "brandType", title: "类别", minWidth: 100, sort: true, templet: function (row) {
                        return "<span class='wxr-text-color-block' style='background: " + row.backgroundColor + "'>" + row.brandType + "</span>";
                    }},
                {field: "dateTime", title: "日期", minWidth: 100, sort: true},
                {field: "preferName", title: moduleCache.currentClickButton == moduleCache.buttonType.payPrice ? "支付金额分布" : "支付频次", minWidth: 100, sort: true},
                {field: "preferValue", title: "客群占比", minWidth: 100, sort: true, isPercentValue: true}
            ]];

            tableData = moduleCache.data.mergeData;
        } else if (activeTableModel == "compare") {
            cols = [[]];
            if (moduleCache.currentClickButton == moduleCache.buttonType.payPrice) {
                cols[0].push({field: "preferName", title: "支付金额分布", minWidth: 110, sort: true});
            } else {
                cols[0].push({field: "preferName", title: "支付频次", minWidth: 110, sort: true});
            }
            for (var i in moduleCache.data.hasSelectedBrands) {
                var brandItem = moduleCache.data.hasSelectedBrands[i];
                // cols[0].push({title: "<div style='display: inline-block'><img class='wxr-image-box wxr-image-box-36' src='" +
                //         shopItem.picUrl + "'/></div><div style='display: inline-block;vertical-align: middle'><ul><li><a href='//" + shopItem.linkUrl + "' target='_blank' title='" + shopItem.name + "'>" + shopItem.name +
                //         "</a></li><li>" + shopItem.userId + "</li></ul></div><div style='float: right'><span class='wxr-text-color-block' style='background: " + shopItem.backgroundColor + "'>" + shopItem.alias +
                //         "</span></div>", colspan: 1, field: "colspan_" + shopItem.userId});
                cols[0].push({field: "preferValue_" + brandItem.brandId, title: "<div style='display: inline-block'><img class='wxr-image-box wxr-image-box-36' src='//img.alicdn.com/tps/" +
                        brandItem.picUrl + "'/></div><div style='display: inline-block;vertical-align: middle'><ul><li>" + brandItem.name +
                        "</li><li>" + brandItem.brandId + "</li></ul></div><div style='float: right'><span class='wxr-text-color-block' style='background: " + brandItem.backgroundColor + "'>" + brandItem.alias +
                        "</span></div></br></br>客群占比", minWidth: 250, sort: true, isPercentValue: true});
            }
            tableData = moduleCache.data.compareData;
        }
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: tableData,
            height: 'full-' + heightGap,
            cols: cols,
            initSort: {
                field: 'preferValue',
                type: "desc"
            },
            done: function () {
                if (activeTableModel == "merge") {
                    $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "'] .layui-table-body td").css({padding: "4px 0px"});
                }
                if (activeTableModel == "compare") {
                    var currentTableDom = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']"), colorArray = commonModule.getChartColors();
                    $.each(moduleCache.data.hasSelectedBrands, function (index, item) {
                        if (item.isActive) {
                            currentTableDom.find("th[data-field*='_" + item.brandId + "']").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                            currentTableDom.find("td[data-field*='_" + item.brandId + "']").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                        }
                    });
                }
            }
        };
        if (activeTableModel == "compare") {
            renderTableOptions.skin = "";
        }
        commonModule.renderTable(renderTableOptions, layero);
    }

    return {
        init: function () {
            var targetDom = $("#completeShopPayment .oui-card-header-wrapper .oui-card-header"),
                buttons = [
                    {btnName: "支付金额分布", class: "", clickEventFunction: oneClickTransformForPayPrice, cssStyle: "width:120px"},
                    {btnName: "支付频次分布", class: "", clickEventFunction: oneClickTransformForPayCnt, cssStyle: "width:120px"}
                ];
            commonModule.injectButtons(targetDom, "before", buttons, true, function (targetDom) {
                // $(".wxr-tool-buttons-inject-container").css("float", "none");
            });
        }
    }
}());

/**
 * @Author xuyefei
 * @Description  品牌客群-属性画像
 * @Date 11:07 2020/9/27
 * @Param
 * @return
 **/
var brandCustomerPortraitModule = (function () {
    var moduleCache = {
        dialogTitlePrefix: "品牌客群 | 属性画像",// 模块名称前缀
        urlParams: {}, // URL地址中解析出来的参数
        data: {
            hasSelectedBrands: [],
            mergeData: [],
            compareData: [],
        },// 表格展示需要的数据
        localCacheKey: "", // 组装好的localStorage的缓存key
        tableElementId: "brand-customer-portrait-table", //table的dom控件的id属性
        tableLayId: "brandCustomerPortraitTable", //table在layui中定义的id，即lay-ui属性
        tabElementId: "brand-customer-portrait-tab",
        chartElementId: "brand-customer-portrait-chart",
        statisticEndTimeStr: "",
        sortedIndexCards: [
            {indexCode: "tradeIndex", indexName: "交易金额", isActive: true},
            {indexCode: "payByrCntIndex", indexName: "支付人数"},
            {indexCode: "payRateIndex", indexName: "支付转化率", isPercentValue: true},
            {indexCode: "payByrCntRate", indexName: "支付占比"},
            {indexCode: "uvIndex", indexName: "访客人数"},
            {indexCode: "perTicketSales", indexName: "客单价"},
            {indexCode: "uvValue", indexName: "uv价值"}
        ]
    };

    // 一键转化
    function oneClickTransform() {
        // 组装缓存key
        assembleCacheData();
        // 组装表格缓存数据
        // 打开弹出框
        openDialog();
    }

    function openDialog() {
        var statisticsTimeText = $(".oui-date-picker-current-date").text().replace("统计时间", ""),
            dialogTitle = moduleCache.dialogTitlePrefix + statisticsTimeText + " | "
                + $("#shopAnalysisSelect").next().find(".oui-card-header-wrapper .ant-select-selection-selected-value").text();
        var dialogWidth;
        var dialogOptions = {
            title: dialogTitle,
            area: ['98%', '98%'],
            // offset: "100px",
            content:
                "<div class='wxr-dialog-sidebar'><div class='wxr-dialog-sidebar-inner'><ul></ul></div></div><div class='wxr-dialog-main'>" +
                // "<div id='wxr-dialog-side-button'><i class='layui-icon layui-icon-spread-left' title='展开'></i></div>" +
                "<div class='wxr-cards-container'></div>" +
                "<div class='wxr-charts-container' id='" + moduleCache.chartElementId + "'></div>" +
                "<div id='" + moduleCache.tabElementId + "' class='layui-tab layui-tab-brief' lay-filter='tabLayFilter'><ul class='layui-tab-title'><li class='layui-this' value='merge'>合并模式</li><li value='compare'>对比模式</li></ul></div>" +
                "<div id='" + moduleCache.tableElementId + "' lay-filter='" + moduleCache.tableLayId + "LayFilter'></div></div>",
            success: function (layero, index) {
                var loading = layui.layer.msg('正在加载', {icon: 16, shade: 0.3, time: 0});
                setTimeout(function () {
                    try {
                        // sideButtonEventBind();
                        // drawDialogPageLeft();
                        drawIndexCards();
                        renderTabs();
                        renderChart();
                        renderTable(loading, layero);
                    } catch (e) {
                        layui.layer.close(loading);
                    }
                }, 50);
            }
        };
        commonModule.openDialog(dialogOptions);
    }

    function renderTabs() {
        $("#" + moduleCache.tabElementId).css({padding: "5px 0px"});
        if (moduleCache.data.hasSelectedBrands.length <= 1) {
            $("#" + moduleCache.tabElementId + " li:last").addClass("wxr-tab-disabled");
        }
        layui.element.on("tab(tabLayFilter)", function () {
            renderTable();
        });
    }

    // 按照需要的结构封装数据
    function assembleCacheData() {
        moduleCache.urlParams = commonModule.extractLocationParams(window.location);
        // 获取cateId，遍历localStorage，直接从缓存中获取shopCate
        var cateName = $(".ebase-FaCommonFilter__top .oui-pro-common-picker .common-picker-header").attr("title"),
            parsedCate = commonModule.parseShopCateName(cateName);
        if (!parsedCate) {
            return;
        }
        // 首先获取所有的监控的品牌列表
        var rivalBrandCacheKey = globalUrlPrefix + "/mc/ci/config/rival/brand/getMonitoredList.json?firstCateId=" +
            parsedCate[6] + "&keyword=",
            rivalBrandCacheData = commonModule.getUsableOriginalJsonDataFromCache(rivalBrandCacheKey, true),
            rivalBrands = {};
        // 找到数据后进行格式转化，以brandId为key来保存，方便后面使用
        if (rivalBrandCacheData) {
            for (var i in rivalBrandCacheData) {
                var brand = rivalBrandCacheData[i];
                rivalBrands[brand.brandId] = brand;
            }
        }
        var activeIndexCode = $("#sycmMqBrandCunstomer .index-picker-container .oui-index-picker-item .ant-radio-checked input[type='radio']").attr("value"),
            tempCacheKey = globalUrlPrefix + "/mc/ci/brand/crowd/trend.json?cateId=" + moduleCache.urlParams.cateId +
                "&diffBrandIds=&device=" + moduleCache.urlParams.device + "&sellerType=" + moduleCache.urlParams.sellerType +
                "&indexCode=&attrType=&dateType=" + moduleCache.urlParams.dateType + "&dateRange=" + moduleCache.urlParams.dateRange
                , diffBrandIds = "", colorArray = commonModule.getChartColors().hex;
        moduleCache.data.hasSelectedBrands = [];
        $("#completeShop .sycm-common-select-wrapper .alife-dt-card-sycm-common-select").each(function (index, item) {
            var rivalBrandName = $(this).find(".sycm-common-select-selected-title").attr("title");
            if (!rivalBrandName) {
                diffBrandIds += ",";
                return true;
            }
            $.each(rivalBrands, function (brandId, brandItem) {
                if (rivalBrandName == brandItem.name) {
                    brandItem.isActive = true;
                    brandItem.alias = "品牌" + (index + 1);
                    brandItem.backgroundColor = colorArray[index % colorArray.length];
                    moduleCache.data.hasSelectedBrands.push(brandItem);
                    diffBrandIds += brandId + ",";
                    return false;
                }
            });
        });
        diffBrandIds = diffBrandIds.substring(0, diffBrandIds.length - 1);
        // 寻找所有指标项的性别、年龄、职业、省、市属性缓存
        var indexCodeArray = ["payByrCntRate", "tradeIndex", "payByrCntIndex", "payRateIndex"],
            attrTypeArray = ["all", "gender", "age", "career", "prov", "city"];
        for (var i in indexCodeArray) {
            var indexCode = indexCodeArray[i];
            for (var j in attrTypeArray) {
                var attrTypeCode = attrTypeArray[j],
                    cacheUrlKey = tempCacheKey.replace(/&diffBrandIds\S+&device/, "&diffBrandIds=" + diffBrandIds + "&device")
                    .replace(/&indexCode=\S+&dateType/, "&indexCode=" + indexCode + "&attrType=" + attrTypeCode);
                cache.originalData[indexCode][attrTypeCode] = commonModule.getUsableOriginalJsonDataFromCache(cacheUrlKey);
            }
        }
        trendDataCacheKey = trendDataCacheKey.replace(/&diffBrandIds\S+&device/, "&diffBrandIds=" + diffBrandIds + "&device");
        trendCacheData = commonModule.getUsableOriginalJsonDataFromCache(trendDataCacheKey, true);
        if (trendCacheData) {
            for (var brandId in trendCacheData) {
                var trendItemByBrandId = trendCacheData[brandId];
                rivalBrands[brandId].trendData = trendItemByBrandId;
            }
        }
        transformData();
    }

    function transformData() {
        if (moduleCache.data.hasSelectedBrands.length == 0) {
            return;
        }
        var trendDataLength = moduleCache.data.hasSelectedBrands[0].trendData.tradeIndex.length,
            endTimeStr = moduleCache.urlParams.dateRange.split("|")[1];
        moduleCache.dateTimes = commonModule.generateStatisticTimes(trendDataLength, endTimeStr, moduleCache.urlParams.dateType);
        moduleCache.data.mergeData = [], moduleCache.data.compareData = [];
        for (var j = 0; j < trendDataLength; j++) {
            var compareDataItem = {dateTime: moduleCache.dateTimes[j]};
            $.each(moduleCache.data.hasSelectedBrands, function (index, item) {
                // if (item.isDataTransformCompleted) {
                //     return true;
                // }
                if (j == 0) {// 第一次要重新初始化相关数据
                    // 为每个商品准备一个已转化的趋势数据集合
                    item.transformTrendData = {};
                    // 每个商品单独存储一份自己的合并数据
                    item.mergeData = [];
                }
                if (!item.isActive) {
                    return true;
                }
                var trendData = item.trendData, mergeDataItem = {
                    brandName: item.name,
                    type: item.alias,
                    picUrl: item.picUrl,
                    dateTime: moduleCache.dateTimes[j],
                    brandId: item.brandId,
                    backgroundColor: item.backgroundColor
                };
                // 对店铺趋势数据中原有的指标的当前循环索引进行转换
                for (var indexCode in trendData) {
                    var indexValue = trendData[indexCode][j];
                    if (indexCode != "payRateIndex") {
                        if (indexCode == "payItemCnt" || indexCode == "slrCnt" || indexCode == "paySlrCnt") {// 无需转换的指标

                        } else {
                            indexValue = commonModule.calculateFormula(indexValue, 1, 0);
                        }
                    } else {
                        indexValue = commonModule.calculateFormula(indexValue, 0, 8);
                    }
                    if (!item.transformTrendData[indexCode]) {
                        item.transformTrendData[indexCode] = [];
                    }
                    item.transformTrendData[indexCode].push(indexValue);
                    if (indexValue != null) {// 所有的指标如果有一个存在有效值，则设置有效标记，没有有效值标记的对象将不会放入merge和compare集合
                        mergeDataItem.isEffective = true;
                        compareDataItem.isEffective = true;
                    }
                    mergeDataItem[indexCode] = indexValue;
                    compareDataItem[indexCode + "_" + item.brandId] = indexValue;
                }
                // 原有的指标转化完毕之后，计算其他指标
                if (!trendData.payByrCntIndex) {
                    // 支付人数
                    if (!item.transformTrendData.payByrCntIndex) {
                        item.transformTrendData.payByrCntIndex = [];
                    }
                    if (mergeDataItem.payRateIndex == null && mergeDataItem.uvIndex == null) {
                        mergeDataItem.payByrCntIndex = null;
                    } else {
                        mergeDataItem.payByrCntIndex = Number((mergeDataItem.uvIndex * mergeDataItem.payRateIndex / 100).toFixed(0));
                    }
                    compareDataItem["payByrCntIndex_" + item.brandId] = mergeDataItem.payByrCntIndex;
                    item.transformTrendData.payByrCntIndex.push(mergeDataItem.payByrCntIndex);
                }
                // uv价值
                if (!item.transformTrendData.uvValue) {
                    item.transformTrendData.uvValue = [];
                }
                if (mergeDataItem.tradeIndex == null && mergeDataItem.uvIndex == null) {
                    mergeDataItem.uvValue = null;
                } else {
                    mergeDataItem.uvValue = !mergeDataItem.uvIndex ? 0 : Number((mergeDataItem.tradeIndex / mergeDataItem.uvIndex).toFixed(2));
                }
                compareDataItem["uvValue_" + item.brandId] = mergeDataItem.uvValue;
                item.transformTrendData.uvValue.push(mergeDataItem.uvValue);
                // 客单价
                if (!item.transformTrendData.perTicketSales) {
                    item.transformTrendData.perTicketSales = [];
                }
                if (mergeDataItem.tradeIndex == null && mergeDataItem.payByrCntIndex == null) {
                    mergeDataItem.perTicketSales = null;
                } else {
                    mergeDataItem.perTicketSales = !mergeDataItem.payByrCntIndex ? 0 : Number((mergeDataItem.tradeIndex / mergeDataItem.payByrCntIndex).toFixed(2));
                }
                compareDataItem["perTicketSales_" + item.brandId] = mergeDataItem.perTicketSales;
                item.transformTrendData.perTicketSales.push(mergeDataItem.perTicketSales);
                // 搜索占比
                if (!item.transformTrendData.seIpvUvHitsRate) {
                    item.transformTrendData.seIpvUvHitsRate = [];
                }
                if (mergeDataItem.seIpvUvHits == null && mergeDataItem.uvIndex == null) {
                    mergeDataItem.seIpvUvHitsRate = null;
                } else {
                    mergeDataItem.seIpvUvHitsRate = !mergeDataItem.uvIndex ? 0 : Number((mergeDataItem.seIpvUvHits / mergeDataItem.uvIndex * 100).toFixed(2));
                }
                compareDataItem["seIpvUvHitsRate_" + item.brandId] = mergeDataItem.seIpvUvHitsRate;
                item.transformTrendData.seIpvUvHitsRate.push(mergeDataItem.seIpvUvHitsRate);
                // 收藏率
                if (!item.transformTrendData.cltRate) {
                    item.transformTrendData.cltRate = [];
                }
                if (mergeDataItem.cltHits == null && mergeDataItem.uvIndex == null) {
                    mergeDataItem.cltRate = null;
                } else {
                    mergeDataItem.cltRate = !mergeDataItem.uvIndex ? 0 : Number((mergeDataItem.cltHits / mergeDataItem.uvIndex * 100).toFixed(2));
                }
                compareDataItem["cltRate_" + item.brandId] = mergeDataItem.cltRate;
                item.transformTrendData.cltRate.push(mergeDataItem.cltRate);
                // 加购率
                if (!item.transformTrendData.cartRate) {
                    item.transformTrendData.cartRate = [];
                }
                if (mergeDataItem.cartHits == null && mergeDataItem.uvIndex == null) {
                    mergeDataItem.cartRate = null;
                } else {
                    mergeDataItem.cartRate = !mergeDataItem.uvIndex ? 0 : Number((mergeDataItem.cartHits / mergeDataItem.uvIndex * 100).toFixed(2));
                }
                compareDataItem["cartRate_" + item.brandId] = mergeDataItem.cartRate;
                item.transformTrendData.cartRate.push(mergeDataItem.cartRate);
                item.mergeData.push(mergeDataItem);
                if (mergeDataItem.isEffective) {
                    moduleCache.data.mergeData.push(mergeDataItem);
                }
                // 店铺的所有指标数据已转化完毕，汇总一下数据
                // if (j == trendDataLength - 1) {
                //     for (var indexCode in item.transformTrendData) {
                //         item[indexCode + "_total"] = eval(item.transformTrendData[indexCode].join("+"));
                //     }
                //     // 除了交易金额、访客人数、支付人数之外，支付转化率、uv价值以及客单价都需要按月份数据汇总之后重新计算
                //     item["payRateIndex_total"] = !item["uvIndex_total"] ? 0 : Number((item["payByrCntIndex_total"] / item["uvIndex_total"] * 100).toFixed(2));
                //     item["uvValue_total"] = !item["uvIndex_total"] ? 0 : Number((item["tradeIndex_total"] / item["uvIndex_total"]).toFixed(2));
                //     item["perTicketSales_total"] = !item["payByrCntIndex_total"] ? 0 : Number((item["tradeIndex_total"] / item["payByrCntIndex_total"]).toFixed(2));
                //     item.isDataTransformCompleted = true;
                // }
            });
            if (compareDataItem.isEffective) {
                moduleCache.data.compareData.push(compareDataItem);
            }
        }
    }

    function drawIndexCards() {
        // 已选中的指标块初始化
        moduleCache.activeIndexCards = {};
        $(".wxr-cards-container").html("");
        // var sortedIndexCards = assembleIndexCards();
        // 计算每个小块宽度的百分比
        var cardItemWrapperPercent = (100 / moduleCache.sortedIndexCards.length).toFixed(4);
        // 舍去最后一位，防止宽度超出
        cardItemWrapperPercent = cardItemWrapperPercent.substring(0, cardItemWrapperPercent.length - 2);
        $(".wxr-cards-container").css({width: "96%", padding: "0px 35px"});
        // for (var i in moduleCache.firstLevelCategoryArray) {
        var activeIndexCode = $("#brandAnalysisSelect").next().find(".alife-one-design-sycm-indexes-trend-index-item-selectable.active .oui-index-cell").attr("value");
        // if (activeIndexCode == "pvIndex") {
        //     activeIndexCode = "uvIndex";
        // } else if (activeIndexCode == "cltByrCntIndex") {
        //     activeIndexCode = "cltHits";
        // }
        $.each(moduleCache.sortedIndexCards, function (index, indexItem) {
            var cardItemWrapper = $("<div class='wxr-card-item-wrapper' style='width: " +
                cardItemWrapperPercent + "%'></div>"),
                // cardItemBody = $("<div class='wxr-card-item-body wxr-card-item-body-solid'><i class='layui-icon layui-icon-ok-circle wxr-card-item-body-icon'></i></div>");
                cardItemBody = $("<div class='wxr-card-item-body wxr-card-item-body-solid' style='text-align: center; white-space: nowrap;overflow: hidden;text-overflow: ellipsis'></div>");
            cardItemWrapper.append(cardItemBody);
            if (indexItem.indexCode == activeIndexCode) {
                indexItem.isActive = true;
                cardItemBody.addClass("wxr-card-item-body-active");
                cardItemBody.find(".wxr-card-item-body-icon").addClass("wxr-card-item-body-icon-checked");
                moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
            }
            // 填充内容
            // var bodyContent = $("<ul><li class='wxr-card-item-body-title'><div class='wxr-text-ellipsis' title='" + indexItem.indexName + "'>" + indexItem.indexName + "</div></li>" +
            //     // "<li class='wxr-card-item-body-data' style='font-size: 18px;line-height: 20px;color: #0C0C0C'><div class='wxr-text-ellipsis'>" + indexItem.indexValue + "</div></li>" +
            //     // "<li class='wxr-card-item-body-data' style='font-size: 12px'><div class='wxr-text-ellipsis'>" + indexItem.compareText + "</div><div class='wxr-text-ellipsis'>" + indexItem.indexCycleCrc + "<i class='" + indexItem.cycleCrcIconClassName + "'></i></div></li>" +
            //     "</ul>");
            var bodyContent = $("<span title='" + indexItem.indexName + "'>" + indexItem.indexName + "</span>");
            // $.each(moduleCache.data.hasSelectedShops, function(shopIndex, shopItem) {
            //     if (shopItem.isActive) {
            //         bodyContent.append("<li class='wxr-card-item-body-data'><div class='wxr-text-ellipsis' title='" + shopItem.alias + "'>" + shopItem.alias + "</div><div class='wxr-text-ellipsis'>" + shopItem[indexItem.indexCode + "_total"] + (indexItem.isPercentValue ? "%" : "") + "</div></li>");
            //     }
            // });
            // bodyContent.find("li").each(function (index, item) {
            //     $(this).css({margin: "4px 0px"});
            //     if ($(this).find("div").length == 2) {
            //         $(this).find("div:first-child").css({width: "40%"});
            //         $(this).find("div:nth-child(2)").css({width: "60%", textAlign: "right"});
            //     }
            // });
            // bodyContent.find(".wxr-card-item-body-data").css({color: "#ffffff"});
            cardItemBody.append(bodyContent);
            $(".wxr-cards-container").append(cardItemWrapper);
            // 点击事件绑定
            cardItemBody.on("click", function () {
                var activeShopCount = $(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length;
                // $(".wxr-cards-container .wxr-card-item-body").removeClass("wxr-card-item-body-active");
                if (activeShopCount > 1) {// 每次只能选中一个指标
                    $(".wxr-cards-container .wxr-card-item-body-active").removeClass("wxr-card-item-body-active");
                    $(".wxr-cards-container .layui-icon-ok-circle").removeClass("wxr-card-item-body-icon-checked");
                    $(this).addClass("wxr-card-item-body-active");
                    $(this).find(".layui-icon-ok-circle").addClass("wxr-card-item-body-icon-checked");
                    moduleCache.activeIndexCards = {};
                    moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                } else {// 可选中多个指标
                    if ($(this).hasClass("wxr-card-item-body-active")) {
                        if ($(".wxr-cards-container .wxr-card-item-body-active").length > 1) {
                            $(this).removeClass("wxr-card-item-body-active");
                            cardItemBody.find(".layui-icon-ok-circle").removeClass("wxr-card-item-body-icon-checked");
                            delete moduleCache.activeIndexCards[indexItem.indexCode];
                        }
                    } else {
                        $(this).addClass("wxr-card-item-body-active");
                        cardItemBody.find(".layui-icon-ok-circle").addClass("wxr-card-item-body-icon-checked");
                        moduleCache.activeIndexCards[indexItem.indexCode] = indexItem;
                    }
                }
                renderChart();
            });
        });
    }

    function renderChart() {
        var thisChart = echarts.init($("#" + moduleCache.chartElementId + "")[0]),
            xAxisData = moduleCache.dateTimes, seriesDataArray = [], count = 0, interval = 1;
        if (moduleCache.urlParams.dateType == "day" || moduleCache.urlParams.dateType == "recent7" || moduleCache.urlParams.dateType == "recent30") {
            interval = 3;
        }
        var activeItemCount = $(".wxr-dialog-sidebar-inner .layui-icon-ok-circle").length, colorArray = [];
        if (activeItemCount > 1) {
            // count = 1;
            for (var i in moduleCache.data.hasSelectedBrands) {
                var item = moduleCache.data.hasSelectedBrands[i];
                if (!item.isActive) {
                    continue;
                }
                // 当前选中的指标code，只能选中一个
                var activeIndexCode = Object.keys(moduleCache.activeIndexCards)[0],
                    seriesObj = {
                        name: item.alias + "(" + moduleCache.activeIndexCards[activeIndexCode].indexName + ")",
                        type: 'line',
                        data: item.transformTrendData[activeIndexCode],
                        smooth: true,
                        symbol: "circle",
                        showSymbol: false,
                        symbolSize: 6
                    };
                seriesDataArray.push(seriesObj);
                colorArray.push(item.backgroundColor);
                // count++;
            }

        } else {
            var activeBrand;
            $.each(moduleCache.data.hasSelectedBrands, function (index, item) {
                if (item.isActive) {
                    activeBrand = item;
                    return false;
                }
            });
            for (var indexCode in moduleCache.activeIndexCards) {
                var activeCardItem = moduleCache.activeIndexCards[indexCode], seriesObj = {
                    name: activeCardItem.indexName,
                    type: 'line',
                    data: activeBrand.transformTrendData[indexCode],
                    smooth: true,
                    symbol: "circle",
                    showSymbol: false,
                    symbolSize: 6,
                    yAxisIndex: count
                };
                seriesDataArray.push(seriesObj);
                count++;
            }
        }
        var chartOptions = {
            xAxis: {
                type: 'category',
                axisLabel: {
                    interval: interval
                },
                axisLine: {},
                data: xAxisData,
            },
            series: seriesDataArray
        };
        if (activeItemCount > 1) {
            chartOptions.color = colorArray;
        }
        commonModule.renderLineCharts(chartOptions, thisChart, count);
    }

    /**
     * @Author xuyefei
     * @Description 渲染表格
     * @Date 14:54 2020/9/28
     * @Param
     * @return
     **/
    function renderTable(loading, layero) {
        var activeTableModel = $("#" + moduleCache.tabElementId + " .layui-this").attr("value"),
            heightGap = ($(window).height() * 0.02 + 260 + 104 + 50 + 44).toFixed(0),
            cols, tableData = [];
        if (activeTableModel == "merge") {
            cols = [[
                {
                    field: 'brandName', title: "品牌名称", minWidth: 180, sort: true, templet: function (row) {
                        // return "<img src='" + row.shop.pictureUrl + "'/><span>" + row.shopName + "</span>";
                        return "<div class='wxr-pic-wrapper'><img class='wxr-image-box wxr-image-box-36' src='//img.alicdn.com/tps/" + row.picUrl + "'/>" +
                            "<span>" + row.brandName + "</span></div>";
                    }
                },
                {
                    field: "type", title: "类别", sort: true, minWidth: 100, templet: function (row) {
                        return "<span class='wxr-text-color-block' style='background: " + row.backgroundColor + "'>" + row.type + "</span>";
                    }
                },
                {field: "dateTime", title: "日期", sort: true, minWidth: 110},
                {field: "tradeIndex", title: "交易金额", minWidth: 90, sort: true},
                {field: "uvIndex", title: "访客人数", minWidth: 90, sort: true},
                {field: "payByrCntIndex", title: "支付人数", minWidth: 90, sort: true},
                {field: "payRateIndex", title: "支付转化率", minWidth: 100, sort: true, isPercentValue: true},
                {field: "perTicketSales", title: "客单价", minWidth: 70, sort: true},
                {field: "seIpvUvHits", title: "搜索人数", minWidth: 90, sort: true},
                {field: "cltHits", title: "收藏人数", minWidth: 90, sort: true},
                {field: "cartHits", title: "加购人数", minWidth: 90, sort: true},
                {field: "uvValue", title: "uv价值", minWidth: 70, sort: true},
                {field: "seIpvUvHitsRate", title: "搜索占比", minWidth: 90, sort: true, isPercentValue: true},
                {field: "cltRate", title: "收藏率", minWidth: 80, sort: true, isPercentValue: true},
                {field: "cartRate", title: "加购率", minWidth: 80, sort: true, isPercentValue: true},
                {field: "payItemCnt", title: "支付件数", minWidth: 90, sort: true},
                {field: "slrCnt", title: "卖家数", minWidth: 90, sort: true},
                {field: "paySlrCnt", title: "有支付卖家数", minWidth: 130, sort: true},
            ]];
            tableData = moduleCache.data.mergeData;
        } else {
            cols = [[], []];
            cols[0].push({field: "dateTime", title: "日期", minWidth: 110, sort: true, rowspan: 2});
            for (var i in moduleCache.data.hasSelectedBrands) {
                var item = moduleCache.data.hasSelectedBrands[i];
                if (item.isActive) {
                    cols[0].push({title: "<div style='display: inline-block'><img class='wxr-image-box wxr-image-box-36' src='//img.alicdn.com/tps/" +
                            item.picUrl + "'/></div><div style='display: inline-block;vertical-align: middle'><ul><li>" + item.name +
                            "</li><li>" + item.brandId + "</li></ul></div><div style='float: right'><span class='wxr-text-color-block' style='background: " + item.backgroundColor + "'>" + item.alias +
                            "</span></div>", colspan: 15, field: "colspan_" + item.brandId});
                    cols[1].push.apply(cols[1], [
                        {field: "tradeIndex_" + item.brandId, title: "交易金额", minWidth: 100, sort: true},
                        {field: "uvIndex_" + item.brandId, title: "访客人数", minWidth: 100, sort: true},
                        {field: "payByrCntIndex_" + item.brandId, title: "支付人数", minWidth: 100, sort: true},
                        {field: "payRateIndex_" + item.brandId, title: "支付转化率", minWidth: 110, sort: true, isPercentValue: true},
                        {field: "perTicketSales_" + item.brandId, title: "客单价", minWidth: 90, sort: true},
                        {field: "seIpvUvHits_" + item.brandId, title: "搜索人数", minWidth: 90, sort: true},
                        {field: "cltHits_" + item.brandId, title: "收藏人数", minWidth: 90, sort: true},
                        {field: "cartHits_" + item.brandId, title: "加购人数", minWidth: 90, sort: true},
                        {field: "uvValue_" + item.brandId, title: "uv价值", minWidth: 90, sort: true},
                        {field: "seIpvUvHitsRate_" + item.brandId, title: "搜索占比", minWidth: 90, sort: true, isPercentValue: true},
                        {field: "cltRate_" + item.brandId, title: "收藏率", minWidth: 80, sort: true, isPercentValue: true},
                        {field: "cartRate_" + item.brandId, title: "加购率", minWidth: 80, sort: true, isPercentValue: true},
                        {field: "payItemCnt_" + item.brandId, title: "支付件数", minWidth: 90, sort: true},
                        {field: "slrCnt_" + item.brandId, title: "卖家数", minWidth: 90, sort: true},
                        {field: "paySlrCnt_" + item.brandId, title: "有支付卖家数", minWidth: 130, sort: true},
                    ]);
                }
            }
            tableData = moduleCache.data.compareData;
        }
        var renderTableOptions = {
            id: moduleCache.tableLayId,
            elem: "#" + moduleCache.tableElementId,
            data: tableData,
            height: 'full-' + heightGap,
            cols: cols,
            layFilter: moduleCache.tableLayId + "LayFilter",
            done: function () {
                if (loading) {
                    layui.layer.close(loading);
                }
                var currentTableDom = $(".layui-table-view[lay-id='" + moduleCache.tableLayId + "']"),
                    colorArray = commonModule.getChartColors();
                currentTableDom.find(".layui-table-body td").css({padding: "5px 0px"});
                currentTableDom.find(".layui-table-cell").css({padding: "0px 5px"});
                if (activeTableModel == "compare") {
                    $.each(moduleCache.data.hasSelectedBrands, function (index, item) {
                        if (item.isActive) {
                            currentTableDom.find("th[data-field*='_" + item.brandId + "']").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                            currentTableDom.find("td[data-field*='_" + item.brandId + "']").css({background: "rgba(" + colorArray.rgb[index] + ",0.08)"});
                        }
                    });
                }
                $(".wxr-tool-dialog-content-wrapper .wxr-dialog-sidebar").css({height: $(".wxr-tool-dialog-content-wrapper .wxr-dialog-main").height()});
            },
            initSort: {
                field: 'dateTime',
                type: "desc"
            }
        };
        if (activeTableModel == "compare") {
            renderTableOptions.skin = "";
        }
        commonModule.renderTable(renderTableOptions, layero);
    }

    return {
        init: function () {
            var targetDom = $("#completeShopPortrait .oui-card-header-wrapper .oui-card-header"),
                buttons = [
                    {btnName: "一键转化", class: "", clickEventFunction: oneClickTransform, cssStyle: ""}
                ];
            commonModule.injectButtons(targetDom, "before", buttons, true, function (targetDom) {

            });
        }
    }
}());


/**
 * @Author xuyefei
 * @Description  启动定时器，扫描目标节点，插入按钮
 * 有很多节点使用了懒加载方式，难以监控，所以使用定时器
 * @Date 11:01 2020/9/8
 **/
var injectButtonTimer = function () {
    // 根据浏览器的地址对各个不同模块进行初始化
    var location = window.location.href;
    setTimeout(function () {
        try {
            // 市场-监控看板模块初始化
            if (location.indexOf("sycm.taobao.com/mc/mq/market_monitor") != -1) {
                // 我的监控
                marketMonitorOfMineModule.init();
                // 行业监控
                marketMonitorOfIndustryModule.init();
            }
            // 市场-市场大盘模块初始化
            if (location.indexOf("sycm.taobao.com/mc/mq/overview") != -1) {
                // 行业趋势
                marketOverviewIndustryTrendModule.init();
                // 子行业构成
                marketOverviewIndustryConstructModule.init();
                // 子行业分布
                marketOverviewSubDistributeModule.init();
                // 地域分布
                marketOverviewRegionDistributeModule.init();
            }
            // 市场-市场排行
            if (location.indexOf("sycm.taobao.com/mc/mq/market_rank") != -1) {
                marketRankModule.init();
            }
            // 市场-搜索排行
            if (location.indexOf("sycm.taobao.com/mc/mq/search_rank") != -1) {
                searchRankModule.init();
            }
            // 市场-搜索分析-趋势分析
            if (location.indexOf("sycm.taobao.com/mc/mq/search_analyze?activeKey=overview") != -1) {
                searchAnalyzeOverviewTrendModule.init();
            }
            // 市场-搜索分析-相关分析
            if (location.indexOf("sycm.taobao.com/mc/mq/search_analyze?activeKey=relation") != -1) {
                searchAnalyzeRelationModule.init();
            }
            // 市场-搜索分析-类目构成
            if (location.indexOf("sycm.taobao.com/mc/mq/search_analyze?activeKey=cate") != -1) {
                searchAnalyzeCategoryModule.init();
            }
            // 市场-产品洞察-热门产品
            if (location.indexOf("sycm.taobao.com/mc/mq/product_insight?activeKey=hot") != -1) {
                productInsightHotModule.init();
            }
            // 市场-产品洞察-产品分析
            if (location.indexOf("sycm.taobao.com/mc/mq/product_insight?activeKey=analyse") != -1) {
                // 产品趋势
                productInsightAnalyzeTrendModule.init();
                // 热销榜单
                productInsightAnalyzeHotSellModule.init();
            }
            // 市场-属性洞察-热门属性
            if (location.indexOf("sycm.taobao.com/mc/mq/property_insight?activeKey=hot") != -1) {
                propertyInsightHotModule.init();
            }
            // 市场-属性洞察-属性分析
            if (location.indexOf("sycm.taobao.com/mc/mq/property_insight?activeKey=analyse") != -1) {
                // 属性趋势
                propertyInsightAnalyzeTrendModule.init();
                // 热销榜单
                propertyInsightAnalyzeHotSellModule.init();
            }
            // 市场-行业客群-客群趋势
            if (location.indexOf("sycm.taobao.com/mc/mq/industry_customer") != -1) {
                industryCustomerTrendModule.init();
            }
            // 市场-客群透视-透视分析
            if (location.indexOf("sycm.taobao.com/mc/mq/customer_analysis") != -1) {
                customerGroupPerspectiveModule.init();
                customerPerspectiveTrendModule.init();
            }

            /**
             * @Description  以下为竞争菜单下的模块
             * @Date 11:23 2020/9/10
             **/
            // 监控店铺
            if (location.indexOf("sycm.taobao.com/mc/ci/shop/monitor") != -1) {
                competitionListOfShopMonitorModule.init();
            }
            // 竞店识别
            if (location.indexOf("sycm.taobao.com/mc/ci/shop/recognition") != -1) {
                competitionShopRecognitionModule.init();
            }
            // 竞店分析
            if (location.indexOf("sycm.taobao.com/mc/ci/shop/analysis") != -1) {
                // 关键指标对比
                shopAnalysisCoreIndexCompareModule.init();
                // Top商品榜
                rivalShopAnalysisTopItemsModule.init();
                // 交易构成
                rivalShopAnalysisTradeConstituteModule.init();
            }
            // 监控商品
            if (location.indexOf("sycm.taobao.com/mc/ci/item/monitor") != -1) {
                ciItemMonitorModule.init();
            }
            // 竞品识别
            if (location.indexOf("sycm.taobao.com/mc/ci/item/recognition") != -1) {
                ciItemRecognitionModule.init();
            }
            // 竞品分析
            if (location.indexOf("sycm.taobao.com/mc/ci/item/analysis") != -1) {
                // 关键指标对比
                itemAnalysisCoreIndexCompareModule.init();
            }
            // 监控品牌
            if (location.indexOf("sycm.taobao.com/mc/ci/brand/monitor") != -1) {
                ciBrandMonitorModule.init();
            }
            // 品牌识别
            if (location.indexOf("sycm.taobao.com/mc/ci/brand/recognition") != -1) {
                brandRecognitionModule.init();
            }
            // 品牌分析
            if (location.indexOf("sycm.taobao.com/mc/ci/brand/analysis") != -1) {
                brandAnalysisCoreIndexCompareModule.init();
                // Top商品榜
                brandAnalysisTopItemsModule.init();
                // Top店铺榜
                brandAnalysisTopShopsModule.init();
                // 关键交易构成
                brandAnalysisTradeConstituteModule.init();
            }
            // 品牌客群
            if (location.indexOf("sycm.taobao.com/mc/ci/brand/customer") != -1) {
                // 客群趋势
                brandCustomerTrendModule.init();
                // 购买偏好
                brandCustomerPreferModule.init();
                // 支付偏好
                brandCustomerPayFondnessModule.init();
                // 属性画像
                brandCustomerPortraitModule.init();
            }
        } catch (e) {
            console.error(e);
        }
        injectButtonTimer();
    }, 100);
};
injectButtonTimer();