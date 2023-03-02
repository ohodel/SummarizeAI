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
                            console.log(summary);

                            const p = document.createElement("p");
                            p.innerHTML = `GPT says: ${summary}`;
                            document.querySelector("body").appendChild(p);
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
