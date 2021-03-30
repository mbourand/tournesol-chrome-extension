'use strict';

function rate_now() {
  chrome.tabs.executeScript(null, {
    code:
      "var videoId = new URL(location.href).searchParams.get('v'); if (!videoId) { alert('This must be used on a link to a youtube video', 'ok'); } else { open(`https://tournesol.app/rate/${videoId}/...`, '_blank'); chrome.tabs.update(tab.id, { active: true }); }",
  });
}

function rate_later() {
  chrome.tabs.executeScript(null, {
    code:
      "var videoId = new URL(location.href).searchParams.get('v'); if (!videoId) { alert('This must be used on a link to a youtube video', 'ok'); } else { open(`https://tournesol.app/rate_later_add/${videoId}`, '_blank'); chrome.tabs.update(tab.id, { active: true }); }",
  });
}

function details() {
  chrome.tabs.executeScript(null, {
    code:
      "var videoId = new URL(location.href).searchParams.get('v'); if (!videoId) { alert('This must be used on a link to a youtube video', 'ok'); } else { open(`https://tournesol.app/details/${videoId}`, '_blank'); chrome.tabs.update(tab.id, { active: true }); }",
  });
}

function report() {
  chrome.tabs.executeScript(null, {
    code:
      "var videoId = new URL(location.href).searchParams.get('v'); if (!videoId) { alert('This must be used on a link to a youtube video', 'ok'); } else { open(`https://tournesol.app/report/${videoId}`, '_blank'); chrome.tabs.update(tab.id, { active: true }); }",
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('rate_now').addEventListener('click', rate_now);
  document.getElementById('rate_later').addEventListener('click', rate_later);
  document.getElementById('details').addEventListener('click', details);
  document.getElementById('report').addEventListener('click', report);
});
