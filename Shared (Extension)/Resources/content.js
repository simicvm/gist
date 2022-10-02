browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!sender.tab && request.greeting === "summarize") {
        console.log("Received request: ", request);

        const documentClone = document.cloneNode(true);
        
        import('https://cdn.skypack.dev/@mozilla/readability')
        .then((module) => {
            if (module.isProbablyReaderable(documentClone)) {
                console.log("Page is readable!");
                let article = new module.Readability(documentClone).parse();
                article.description = "extracted text";
                browser.runtime.sendMessage({ greeting: article }).then((response) => {
                    console.log("Received response: ", response);
                });
            } else {
                console.log("Page is not readable!")
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
});
