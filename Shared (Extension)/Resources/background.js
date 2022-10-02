browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);

    if (request.description = "extracted text") {
        browser.runtime.sendNativeMessage("application.id", {message: request.greeting.textContent}, function(response) {
            console.log("Received sendNativeMessage response");
            const responseReplace = response[0].replace(/\u21B5/gi, "<br/>").trim();
            const summary = {summary: responseReplace, description: "summary"};
            console.log("Sending summary to popup")
            browser.runtime.sendMessage({ message: summary }).then((response) => {
                console.log("Received response from popup: ", response);
            });
        });
    } else {
        console.log("Received unknown request: ", request);
    }
});
