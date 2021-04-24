// Youtube doesnt completely load a video page, so content script doesn't lauch correctly without these events

// This part is called on connection for the first time on youtube.com/*
/* ********************************************************************* */

document.addEventListener('yt-navigate-finish', process);

if (document.body) process();
else document.addEventListener('DOMContentLoaded', process);

/* ********************************************************************* */


function process()
{
  // Only enable on youtube.com/
  if (location.pathname != '/')
    return;

  /* Send message to background.js to get recommendations from the API of Tournesol.
  ** I put video amount here because we can get the value of --ytd-rich-grid-posts-per-row (css) to know how many videos we should retreive from api
  */
  chrome.runtime.sendMessage({ message: 'getTournesolRecommendations', video_amount: 4 });
}


// This part creates video boxes from API's response JSON
chrome.runtime.onMessage.addListener(function ({ data }, sender, sendResponse) {

  // Timer will run until needed elements are generated
  var timer = window.setInterval(function () {

    /*
  	** Wait for needed elements to be generated
  	** It seems those elements are generated via javascript, so run-at document_idle in manifest is not enough to prevent errors
  	**
    ** Some ids on video pages are duplicated, so I take the first non-duplicated id and search in its childs the correct div to add the button
    ** Note: using .children[index] when child has no id
    */
    var contents;
    try
    {
      // Get parent element for the boxes in youtube page
      contents = document.getElementById('page-manager').children[0].children[7].children.item('primary').children[0];
      if (!contents)
        return;
    }
    catch (error) { return; }


    window.clearInterval(timer);

    // Verify that Tournesol's container has not yet been rendered
    old_container = document.getElementById('tournesol_container');
    if (old_container) old_container.remove();


    // Create new container
    tournesol_container = document.createElement('div');
    tournesol_container.id = 'tournesol_container';

    // Add inline-block div
    inline_div = document.createElement('div');
    inline_div.setAttribute('class', 'inline_div');

    // Add tournesol icon
    tournesol_icon = document.createElement('img');
    tournesol_icon.setAttribute('id', 'tournesol_icon');
    tournesol_icon.setAttribute('src', chrome.extension.getURL('rate_now_icon.png'));
    tournesol_icon.setAttribute('width', '24');
    inline_div.append(tournesol_icon);

    // Add title
    tournesol_title = document.createElement('h1');
    tournesol_title.id = 'tournesol_title';
    tournesol_title.append('Recommended by Tournesol');
    inline_div.append(tournesol_title);

    tournesol_container.append(inline_div);


    // Add title
    tournesol_link = document.createElement('a');
    tournesol_link.id = 'tournesol_link';
    tournesol_link.href = 'https://tournesol.app';
    tournesol_link.append('learn more');
    inline_div.append(tournesol_link);


    // Push videos into new container
    video_box_height = contents.children[0].clientHeight;
    video_box_width = contents.children[0].clientWidth;

    function make_video_box(video) {
      // Div whith everything about a video
      const video_box = document.createElement('div');
      video_box.className = 'video_box';


      // Div with thumbnail and video duration
      const thumb_div = document.createElement('div');
      thumb_div.setAttribute('class', 'thumb_div');


      const video_thumb = document.createElement('img');
      video_thumb.className = 'video_thumb';
      video_thumb.src = `https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg`;
      thumb_div.append(video_thumb);


      const video_duration = document.createElement('p');
      video_duration.setAttribute('class', 'time_span');

      // Remove useless '00:' as hour value (we keep it if it is as minute value)
      var formatted_video_duration = video.duration;
      if (formatted_video_duration.startsWith('00:'))
        formatted_video_duration = formatted_video_duration.substring(3, formatted_video_duration.length);

      video_duration.append(document.createTextNode(formatted_video_duration));
      thumb_div.append(video_duration);

      video_box.append(thumb_div);


      // Div with uploader name, video title and tournesol score
      const details_div = document.createElement('div');
      details_div.setAttribute('class', 'details_div');


      const video_title = document.createElement('h2');
      video_title.className = 'video_title';
      video_title.append(video.name);
      details_div.append(video_title);


      const video_uploader = document.createElement('p');
      video_uploader.className = 'video_text';
      video_uploader.append(video.uploader);
      details_div.append(video_uploader);


      // Tournesol score
      const video_score = document.createElement('p');
      video_score.className = 'video_text';
      video_score.append('Rated ' + Number(video.score).toFixed(0) + ' points by ' + video.rating_n_experts + ' users');
      details_div.append(video_score);


      const video_link = document.createElement('a');
      video_link.className = 'video_link';
      video_link.href = '/watch?v=' + video.video_id;
      video_box.append(video_link);

      video_box.append(details_div);

      return video_box;
    }

    console.log('Making videos');
    data.forEach(
      (video, i) =>
      console.log(video.video_id) || tournesol_container.append(make_video_box(video)),
    );

    contents.insertBefore(tournesol_container, contents.children.item('header').nextSibling);
  }, 100);
});
