chrome.browserAction.onClicked.addListener(function (tab) {
  var videoId = new URL(tab.url).searchParams.get('v');
  if (!videoId) {
    alert('This extension can only be used from a Youtube video', 'ok');
  } else {
    open(`https://tournesol.app/expert/${videoId}/...`);
  }
});

chrome.contextMenus.removeAll(function () {
  chrome.contextMenus.create(
    {
      id: 'tournesol_add_rate_later',
      title: 'Rate later on Tournesol',
      contexts: ['link'],
    },
    function () {
      chrome.contextMenus.onClicked.addListener(function (e, tab) {
        var videoId = new URL(e.linkUrl).searchParams.get('v');
        if (!videoId) {
          alert('This must be used on a link to a youtube video', 'ok');
        } else {
          open(`https://tournesol.app/rate_later_add/${videoId}`, '_blank');
          chrome.tabs.update(tab.id, { active: true });
        }
      });
    },
  );
});
