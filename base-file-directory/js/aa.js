var bytes, src, elements = document.querySelectorAll('img.pricecaptcha');
if (elements.length == 0) {
    elements = document.querySelectorAll('img[alt=\\\'Captcha\\\']');
} else {
    src = elements[0].src;
    // fetch(src).then(res => res.text()).then(data => bytes = data)
}
src;