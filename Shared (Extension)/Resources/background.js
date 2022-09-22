browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);

    if (request.greeting === "hello") {
        sendResponse({ farewell: "goodbye" });
    } else if (request.description = "extracted text") {
        console.log(request.greeting)
        browser.runtime.sendNativeMessage("application.id", {message: request.greeting}, function(response) {
            console.log("Received sendNativeMessage response:");
            console.log(response);
        });
    } else {
        console.log("Received unknown request: ", request);
    }
});
