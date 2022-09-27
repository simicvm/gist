function handleResponse(message) {
    console.log(`Message from the background script: ${message}`);
}

function handleError(error) {
  console.log(`Error: ${error}`);
}

function notifyBackgroundPage(e) {
  const sending = browser.runtime.sendMessage({
    greeting: "hello from popup",
  });
  sending.then(handleResponse, handleError);
}

function notifyContentPage(e) {
  browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if(tabs.length == 0){
        console.log("could not send mesage to current tab");
      }else{
        const sendingToContent = browser.tabs.sendMessage(
            tabs[0].id,
            {greeting: "summarize",
        }); 
        sendingToContent.then(handleResponse, handleError);
    }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("summarize").addEventListener("click", notifyContentPage);
});

const theButton = document.querySelector(".button");

theButton.addEventListener("click", () => {
    theButton.classList.add("button--loading");
    theButton.innerHTML = 'Creating gist';
});
