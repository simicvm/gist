browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
    console.log("Received response: ", response);
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!sender.tab && request.greeting === "summarize") {
        console.log("Received request: ", request);

        const documentClone = document.cloneNode(true);
        
        import('https://cdn.skypack.dev/@mozilla/readability')
        .then((module) => {
            if (module.isProbablyReaderable(documentClone)) {
                console.log("Page is readable!");
                const article = new module.Readability(documentClone).parse();
                browser.runtime.sendMessage({ greeting: article }).then((response) => {
                    console.log("Received response: ", response);
                });
                //console.log(article.title);
                //console.log(article.content)
                //console.log(article.textContent)
            } else {
                console.log("Page is not readable!")
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
});

/*browser.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
    
    
        console.log("received message from popup: "+request.greeting);
    
        sendResponse({farewell: "I'm good, thank you popup!"});
    });*/

//console.log(document.body.innerHTML);
//console.log(document.body.innerText);
