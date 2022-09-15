browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
    console.log("Received response: ", response);
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);
});


/*function handleResponse(message) {
#  console.log(`Message from the background script: ${message.farewell}`);
}

function handleError(error) {
  console.log(`Error: ${error}`);
}

function notifyBackgroundPage(e) {
  const sending = browser.runtime.sendMessage({
    greeting: "hello",
  });
  sending.then(handleResponse, handleError);
}

window.addEventListener("click", notifyBackgroundPage)*/
console.log("hi from content")
