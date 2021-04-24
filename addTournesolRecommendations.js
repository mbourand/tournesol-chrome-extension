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

  // Send message to background.js to get recommendations from the API of Tournesol
  chrome.runtime.sendMessage({ message: 'getTournesolRecommendations' });
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
      contents = document.getElementById('contents');
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


    // Add title
    tournesol_title = document.createElement('h1');
    tournesol_title.id = 'tournesol_title';
    tournesol_title.append('Recommended by Tournesol:');
    tournesol_container.append(tournesol_title);


    // Add title
    tournesol_link = document.createElement('a');
    tournesol_link.id = 'tournesol_link';
    tournesol_link.href = 'https://tournesol.app';
    tournesol_link.append('learn more');
    tournesol_container.append(tournesol_link);


    // Push videos into new container
    video_box_height = contents.children[0].clientHeight;
    video_box_width = contents.children[0].clientWidth;

    function make_video_box(video) {
      const video_box = document.createElement('div');
      video_box.className = 'video_box';
      video_box.style.width =
      video_box_width > 10 ? video_box_width + 'px' : '24%';

      const video_thumb = document.createElement('img');
      video_thumb.className = 'video_thumb';
      video_thumb.src = `https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg`;
      video_box.append(video_thumb);

      const video_title = document.createElement('h2');
      video_title.className = 'video_title';
      video_title.append(video.name);
      video_box.append(video_title);

      const video_uploader = document.createElement('h2');
      video_uploader.className = 'video_text';
      video_uploader.append(video.uploader);
      video_box.append(video_uploader);

      const video_ratings = document.createElement('h3');
      video_ratings.className = 'video_text';
      video_ratings.append('Rated by ' + video.rating_n_experts);
      video_box.append(video_ratings);

      const video_score = document.createElement('h3');
      video_score.className = 'video_text';
      video_score.append('Tournesol score: ' + Number(video.score).toFixed(0));
      video_box.append(video_score);

      const video_link = document.createElement('a');
      video_link.className = 'video_link';
      video_link.href = '/watch?v=' + video.video_id;
      video_box.append(video_link);

      return video_box;
    }

    console.log('Making videos');
    data.forEach(
      (video, i) =>
      console.log(video.video_id) || tournesol_container.append(make_video_box(video)),
    );

    contents.prepend(tournesol_container);
  }, 100);
});

