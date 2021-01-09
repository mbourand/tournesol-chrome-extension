chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      code:
        'var videoId = (new URL(document.location)).searchParams.get("v"); \
        if(!videoId) { \
            alert("this extension can only be used from a Youtube video") \
        } else { \
            window.open(`https://dev.tournesol.app/expert/${videoId}/...`) \
        };',
    });
  });
});
