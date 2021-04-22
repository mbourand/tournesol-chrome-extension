// Youtube doesnt completely load a video page, so content script doesn't lauch correctly without these events
document.addEventListener("yt-navigate-finish", process);

if (document.body) process();
else document.addEventListener('DOMContentLoaded', process);

// To wait for all needed elements to exist
function process()
{
  // Set redirect URL
  var videoId = new URL(location.href).searchParams.get('v');

  if (!location.pathname.startsWith('/watch') || !videoId)
    return;

  var timer = window.setInterval(createButtonIsReady, 300);

  function createButtonIsReady() {

    if (!document.getElementById("menu-container") ||
      !document.getElementById("menu-container").children.item("menu") ||
      !document.getElementById("menu-container").children.item("menu").children[0] ||
      !document.getElementById("menu-container").children.item("menu").children[0].children.item("top-level-buttons"))
      return;

    console.log("Adding rate later button");
    window.clearInterval(timer);

    // Create Button
    var rateNowButton = document.createElement("button");
    rateNowButton.setAttribute("id", "tournesol-rate-button");

	rateNowButton.setAttribute("onclick", "window.open('https://tournesol.app/rate_later_add/" + videoId + "', '_blank')");

    // Image td for better vertical alignment
    var img_td = document.createElement("td");
    img_td.setAttribute("valign", "middle");

    // Image
    var image = document.createElement("img");
    image.setAttribute("id", "tournesol-button-image");
    image.setAttribute("src", chrome.extension.getURL("rate_now_icon.png"));
    image.setAttribute("width", "20");
    img_td.append(image);
    rateNowButton.append(img_td);

    // Text td for better vertical alignment
    var text_td = document.createElement("td");
    text_td.setAttribute("valign", "middle");

    // Text
    text_td.append(document.createTextNode("Rate Later"));

    rateNowButton.append(text_td);

    /*
    ** Some ids on video pages are duplicated, so i take the first non-duplicated id
    ** and search in its childs the correct div to add the button
    ** Note: using [index] when child has no id
    */
    var div = document.getElementById("menu-container").children.item("menu").children[0].children.item("top-level-buttons");

    // Insert after like and dislike buttons
    div.insertBefore(rateNowButton, div.children[2]);
  }
}
