function run() {
    var hostname = '';
    //add a link to the list
    function addToList(bookmark) {
        var aTag = document.createElement('a');
        aTag.setAttribute('href', bookmark.url);
        aTag.setAttribute('target', "_blank");
        aTag.innerHTML = bookmark.title + "</br>";
        document.getElementById("pane").appendChild(aTag);
    }

    function onFulfilled(bookmarkItems) {
        bookmarkItems.forEach(bookmark => {
            if (bookmark.url) {
                // match if the bookmark has the host
                var r = new RegExp(hostname, 'gi');
                var result = r.test(bookmark.url);
                if (result)
                    addToList(bookmark);
            }
        });
    };

    function onRejected(error) {
        console.log(`An error: ${error}`);
    };

    // add host name to pane
    function updateView(tabs) {
        var currentTabUrl = tabs[0].url;
        hostname = extractRootDomain(currentTabUrl);
        document.getElementById('myHeading').innerText = 'Bookmark\'s from ' + hostname;
        //search all the bookmarks
        chrome.bookmarks.search({},(result)=>{
            onFulfilled(result)
        });
        //searching.then(onFulfilled, onRejected);
    };

    // get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (result) {
        updateView(result)
    });
    //gettingActiveTab.then(updateView);
};

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

// To address those who want the "root domain," use this function:
function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    //if there is a subdomain 
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}

run();
