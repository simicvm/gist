function handleResponse(message) {
    console.log(`Message from the background script: ${message}`);
}

function handleError(error) {
  console.log(`Error: ${error}`);
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
const body = document.querySelector("body");
const aiSummaryText = document.querySelector(".ai-summary-text");


theButton.addEventListener("click", () => {
    theButton.classList.add("button-loading");
    theButton.innerHTML = "Creating gist";
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message.description === "summary") {
        theButton.style.display = "none";
        body.style.width = "600px";
        aiSummaryText.style.display = "flex";
        aiSummaryText.innerHTML = request.message.summary;
        
    } else {
        console.log("Received unknown request: ", request);
        sendResponse({ farewell: "didn't manage to read it properly" });
    }
});
