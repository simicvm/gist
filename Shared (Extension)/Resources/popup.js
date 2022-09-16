function printConsole() {
    console.log("Hello World!");
}

function handleResponse(message) {
    console.log(`Message from the background script: ${message}`);
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

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("scanPage").addEventListener("click", notifyBackgroundPage);
});
