$(function () {
    $("#test").text("测试链接"),
    $("#test").css({"color":"red","fontSize":"30px"}),
    $("#test").click(() => {
        chrome.tabs.create({url: 'https://www.baidu.com'})
    })
})