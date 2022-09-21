browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);

    if (request.greeting === "hello") {
        sendResponse({ farewell: "goodbye" });
    } else if (request.greeting === "summarizeJK") {
        const documentClone = document.cloneNode(true);
        import('https://cdn.skypack.dev/@mozilla/readability')
        .then((module) => {
            if (module.isProbablyReaderable(documentClone)) {
                console.log("Page is readable!");
                const article = new module.Readability(documentClone).parse();
                console.log(article.title);
                //console.log(article.content)
                console.log(article.textContent)
            } else {
                console.log("Page is not readable!")
            }
        })
        .catch((error) => {
            console.log(error);
        });
    } else {
        console.log(request.greeting)
        browser.runtime.sendNativeMessage("application.id", {message: request.greeting}, function(response) {
            console.log("Received sendNativeMessage response:");
            console.log(response);
        });
    }
});
