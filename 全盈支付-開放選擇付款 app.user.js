// ==UserScript==
// @name         全盈支付-開放選擇付款 app
// @namespace    https://github.com/k1k2k3k4-dev
// @version      0.3
// @description  原本全盈支付網頁的開啟順序是先開啟全家 app，如果找不到全家 app，就會再開啟智生活 app，這導致智生活的用戶必須先卸載全家 app 才能順利開啟。這個 UserScript 可以解決這個問題，讓用戶可以自由選擇要使用哪一個 app 付款。
// @author       k1k2k3k4-dev
// @match        https://payment.pluspay.com.tw/payment/QRCode/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pluspay.com.tw
// @run-at       document-start
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    if (document.querySelector('.btn-box.bbx-btm .btn') && typeof callScheme !== 'undefined') {
        main();
    } else {
        const observer = new MutationObserver(function (mutations) {
            if (document.querySelector('.btn-box.bbx-btm .btn') && typeof callScheme !== 'undefined') {
                this.disconnect();
                main();
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    function main() {
        const fm = document.querySelector('.btn-box.bbx-btm .btn');
        fm.style.margin = '5px 0px';
        const smartdaily = fm.parentElement.appendChild(fm.cloneNode());
        const stayfun = fm.parentElement.appendChild(fm.cloneNode());
        editElement(fm, 'fm', '全家（或系統指定之 app）');
        editElement(smartdaily, 'smartdaily', '智生活');
        editElement(stayfun, 'stayfun', 'STAYFUN');
        window.callScheme = new Function('app',
            window.callScheme.toString()
                .replace(/.*{([\s\S]*)}/, '$1') //拆解 callScheme function
                .replace(/'([^']*)'/, '`$1`') // 改成模板字串
                .replace('fm', '${app}') // fm 改成模板
                .replace(/( *?)if.*?\((.*)\)(.*return;)/, '$1$2?.remove();\n$1document.getElementsByTagName("iframe")[0]?.remove();') // 失敗可重複觸發
                .replace(/insertBefore\((.*)\)/, 'insertBefore($1.nextSibling)'));
    }

    function editElement(element, app, appName) {
        element.textContent = appName;
        element.setAttribute('onclick', element.getAttribute('onclick').replace('(', `('${app}'`));
    }
})();
