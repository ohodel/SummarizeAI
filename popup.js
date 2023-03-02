chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "summarize") {
        let summary = document.querySelector("body").innerText;

        sendResponse(summary);
    }
});

// popup
document.addEventListener("DOMContentLoaded", () => {
    // when the summarize button is clicked

    document.querySelector("button").addEventListener("click", () => {
        let inputText = document.querySelector("#input").value;
        if (!inputText) {
            return;
        }
        let responseDivs = document.querySelectorAll(".responseContainer");
        if (responseDivs.length > 0) {
            responseDivs.forEach((div) => div.remove());
        }
        console.log(responseDivs);
        console.log(inputText);
        console.log(inputText);
        // get the current tab's content and send it to the content for summarization
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(
                tabs[0].id,
                { action: "summarize", text: inputText },
                function (response) {
                    // send api request
                    let xhr = new XMLHttpRequest();
                    let url = "https://api.openai.com/v1/completions";
                    //"https://api.openai.com/v1/engines/davinci-codex/completions";
                    let authtoken =
                        "Bearer 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";
                    xhr.open("POST", url, true);
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.setRequestHeader("Method", "no-cors");
                    xhr.setRequestHeader("Authorization", authtoken);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4 && xhr.status == 200) {
                            /// parse the api response
                            let summary = JSON.parse(xhr.responseText)[
                                "choices"
                            ][0]["text"];

                            const responseContainer =
                                document.createElement("div");
                            responseContainer.className = "responseContainer";
                            const p = document.createElement("p");
                            const gptSays = document.createElement("h3");
                            gptSays.innerText = "GPT says: ";
                            p.style.maxWidth = "fit-content";
                            p.innerHTML = summary;
                            gptSays.marginBottom = "0px !important";
                            responseContainer.appendChild(gptSays);
                            responseContainer.appendChild(p);
                            document
                                .querySelector("body")
                                .appendChild(responseContainer);
                        }
                    };
                    let data = JSON.stringify({
                        model: "text-davinci-003",
                        max_tokens: 2000,
                        n: 1,
                        prompt: "Summarize this: " + inputText,
                    });
                    xhr.send(data);
                    document.querySelector("#input").value = "";
                }
            );
        });
    });
});
