/**
 When we receive the message, execute the given script in the given
 tab.
 */
'use strict';
let currentPostData = [];
let headers = []
let curentHeaders = [];

// get POST data for each loaded page
browser.webRequest.onBeforeRequest.addListener(
    setCurrentPostData,
    { urls: ['<all_urls>'], types: ['main_frame'] }, 
    ['requestBody']
);


// add/modify headers before sending request
browser.webRequest.onBeforeSendHeaders.addListener(
    rewriteHeaders,
    { urls: ["<all_urls>"], types: ["main_frame"] },
    ["blocking", "requestHeaders"]
);


// get referer for each page loaded
browser.webRequest.onSendHeaders.addListener(
    getCurrentHeaders,
    { urls: ["<all_urls>"], types: ["main_frame"] },
    ["requestHeaders"]
);

function setCurrentPostData(e) {
    if (e.method === "POST" && e.requestBody) {
        let rawData = e.requestBody.formData;
        var post_data_array = [];
        for (let key in rawData) {
            if (rawData.hasOwnProperty(key)) {
                var item = key + "=" + rawData[key];
                post_data_array.push(item);
            }
        }

        browser.tabs.query(
            {currentWindow: true, active: true},
            function (tabArray) {
                const currentTabId = tabArray[0].id;
                currentPostData[currentTabId] = post_data_array.join("&");
            }
        );
    }
}

function rewriteHeaders(e) {
    let index_referer, index_user_agent, index_cookie;
    index_cookie = index_referer = index_user_agent = -1;
    for (let i = 0; i < e.requestHeaders.length; i++) {
        let h = e.requestHeaders[i];
        switch (h.name.toLowerCase()) {
            case 'referer':
                index_referer = i;
                break;
            case 'user-agent':
                index_user_agent = i;
                break;
            case 'cookie':
                index_cookie = i;
                break;
        }
    }
    //add referer
    if (headers.referer) {
        if (index_referer !== -1) {
            e.requestHeaders[index_referer].value = headers.referer;
        } else {
            e.requestHeaders.push({
                name: "Referer",
                value: headers.referer
            });
        }
    }
    //modify user agent
    if (headers.user_agent) {
        if (index_user_agent !== -1) {
            e.requestHeaders[index_user_agent].value = headers.user_agent;
        } else {
            e.requestHeaders.push({
                name: "User-Agent",
                value: headers.user_agent
            });
        }
    }
    //modify cookie
    if (headers.cookie) {
        if (index_cookie !== -1) {
            e.requestHeaders[index_cookie].value = headers.cookie;
        } else {
            e.requestHeaders.push({
                name: "Cookie",
                value: headers.cookie
            });
        }
    }
    return {requestHeaders: e.requestHeaders};
}

function getCurrentHeaders( e ) {
    browser.tabs.query(
        {currentWindow: true, active: true},
        function (tabArray) {
            const currentTabId = tabArray[0].id;
            let _headers = [];
            for( let h of e.requestHeaders ) {
                if( h.name.toLowerCase() == 'referer' ) {
                    _headers.referer = h.value;
                }else if( h.name.toLowerCase() == 'user-agent' ) {
                    _headers.user_agent = h.value;
                }else if( h.name.toLowerCase() == 'cookie' ) {
                    _headers.cookie = h.value;
                }
            }
            curentHeaders[currentTabId] = _headers;
        }
    );

}

function handleMessage(request, sender, sendResponse) {
    if (sender.url !== browser.runtime.getURL("/theme/hackbar-panel.html")) {
        return;
    }
    const tabId = request.tabId;
    const action = request.action;
    switch (action) {
        case 'load_url':
            browser.tabs.get(tabId, function (tab) {
                sendResponse({url: tab.url, data: currentPostData[tabId], headers: curentHeaders[tabId]});
            });
            break;
        case 'send_requests':
            headers = request.data.headers;
            sendResponse({status: true});
            break;
    }
    return true;
}

/**
 Listen for messages from our devtools panel.
 */
browser.runtime.onMessage.addListener(handleMessage);
