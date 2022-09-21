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


function notifyContentAndBackgroundPage(e) {
  const sendingToBackground = browser.runtime.sendMessage({
    greeting: "summarize",
  });
  sendingToBackground.then(handleResponse, handleError);

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
    document.getElementById("summarize").addEventListener("click", notifyContentAndBackgroundPage);
});

/*document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("summarize").addEventListener("click", notifyBackgroundPage);
});

document.getElementById("summarize").onclick = function(){
    console.log("clicked button");

    browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if(tabs.length == 0){ 
            console.log("could not send mesage to current tab");
        }else{
            browser.tabs.sendMessage(tabs[0].id, {greeting: "hello, how are you content script?"}, function(response) {
                console.log("received message from content script: "+response.farewell);
            });
        }
    });
}*/
