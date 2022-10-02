browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);

    if (request.greeting === "hello") {
        sendResponse({ farewell: "goodbye" });
    } else if (request.description = "extracted text") {
        console.log(request.greeting)
        browser.runtime.sendNativeMessage("application.id", {message: request.greeting.textContent}, function(response) {
            console.log("Received sendNativeMessage response:");
            console.log(response);
            const responseReplace = response[0].replace(/\u21B5/gi, "<br/>").trim();
            //console.log(responseReplace);
            const summary = {summary: responseReplace, description: "summary"};
            console.log("sending to popup: ", summary)
            browser.runtime.sendMessage({ message: summary }).then((response) => {
                console.log("Received response from popup: ", response);
            });
        });
    } else {
        console.log("Received unknown request: ", request);
    }
});
