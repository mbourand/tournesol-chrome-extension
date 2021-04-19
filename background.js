chrome.contextMenus.removeAll(function (e, tab) {
  chrome.contextMenus.create({
    id: 'tournesol_add_rate_later',
    title: 'Rate later on Tournesol',
    contexts: ['link'],
  });
});

chrome.contextMenus.onClicked.addListener(function (e, tab) {
  var videoId = new URL(e.linkUrl).searchParams.get('v');
  if (!videoId) {
    alert('This must be used on a link to a youtube video', 'ok');
  } else {
    open(`https://tournesol.app/rate_later_add/${videoId}`, '_blank');
    chrome.tabs.update(tab.id, { active: true });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  fetch(
    'https://tournesol.app/api/v2/videos/search_tournesol/?importance=100&reliability=100&engaging=100&better_habits=1000&days_ago_lte=21&language=en&limit=4',
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      chrome.tabs.sendMessage(sender.tab.id, { data: data.results });
    });
});
