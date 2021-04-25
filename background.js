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

/*
 ** Useful method to extract a subset from an array
 ** Copied from https://stackoverflow.com/questions/11935175/sampling-a-random-subset-from-an-array
 ** Used for adding some randomness in recommendations
 */
function getRandomSubarray(arr, size) {
  var shuffled = arr.slice(0),
    i = arr.length,
    temp,
    index;
  while (i--) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  fetch(
    `https://tournesol.app/api/v2/videos/search_tournesol/?days_ago_lte=21&language=${
      request.language
    }&limit=${3 * request.video_amount}`,
  )
    .then((response) => response.json())
    .then((data) => {
      chrome.tabs.sendMessage(sender.tab.id, {
        data: getRandomSubarray(data.results, request.video_amount),
      });
    });
});
