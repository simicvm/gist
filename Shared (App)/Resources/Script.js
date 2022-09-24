function show(platform, enabled, useSettingsInsteadOfPreferences) {
    document.body.classList.add(`platform-${platform}`);

    if (useSettingsInsteadOfPreferences) {
        document.getElementsByClassName('platform-mac state-on')[0].innerText = "gist’s extension is currently on. You can turn it off in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac state-off')[0].innerText = "gist’s extension is currently off. You can turn it on in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac state-unknown')[0].innerText = "You can turn on gist’s extension in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac open-preferences')[0].innerText = "Quit and Open Safari Settings…";
    }

    if (typeof enabled === "boolean") {
        document.body.classList.toggle(`state-on`, enabled);
        document.body.classList.toggle(`state-off`, !enabled);
    } else {
        document.body.classList.remove(`state-on`);
        document.body.classList.remove(`state-off`);
    }
}

function openPreferences() {
    webkit.messageHandlers.controller.postMessage({ command: "open-preferences" });
}

function saveApiKey(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    let formProps = Object.fromEntries(formData);
    formProps["command"] = "api-key"
    webkit.messageHandlers.controller.postMessage(formProps);
}

function retrieveApiKey() {
    webkit.messageHandlers.controller.postMessage({ command: "retrieve-api-key"});
}

document.querySelector("button.open-preferences").addEventListener("click", openPreferences);
document.querySelector("form.save-api-key").addEventListener("submit", saveApiKey);
document.querySelector("button.retrieve-api-key").addEventListener("click", retrieveApiKey);

