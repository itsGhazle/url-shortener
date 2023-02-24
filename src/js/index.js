let originalLink = [];
let shortLink = [];

$(document).ready(function () {
  getToStorage();
  getTable();
});

function timeOut() {
  setTimeout(() => {
    $("p").removeClass("error");
  }, 3000);
}
function getTable() {
  if (!originalLink.length == 0) {
    $(".addLinks").empty();
    for (let i = 0; i < originalLink.length; i++) {
      $(".addLinks").append(`<tr>
      <td class="original_links" colspan=2>
        <a href="${originalLink[i]} target="_blank"">${originalLink[i]}</a>
      </td>
      <td class="short redirect" colspan=2>
        <a href="${originalLink[i]}" target="_blank">${shortLink[i]}</a>
      </td>
    </tr>`);
    }
  } else {
    $(".addLinks").append(`<tr>
      <td class="text-center" colspan="6">
        No data have been found!
      </td>
    </tr>`);
  }
}


function getToStorage() {
  if (!(localStorage.length == 0)) {
    originalLink = JSON.parse(localStorage["original"]);
    shortLink = JSON.parse(localStorage["short"]);
  }
  return [originalLink, shortLink];
}
function addLinksToTable(data) {
  $(".addLinks").append(`<tr>
      <td class="original_links" colspan=2>
        <a href="${data[0]} target="_blank"">${data[0]}</a>
      </td>
      <td class="short redirect" colspan=2>
        <a href="${data[0]}" target="_blank">${data[1]}</a>
      </td>
    </tr>`);
}
function setToStorage(data) {
  let storage = getToStorage();
  storage[0].push(data[0]);
  localStorage.setItem("original", JSON.stringify(storage[0]));
  localStorage.setItem("short", JSON.stringify(data[1]));
}

function in_array(array, data) {
  for (var i = 0; i < array.length; i++) if (array[i] == data) return true;
  return false;
}

function get_rand() {
  let Txt = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
  let shortUrl = "";
  for (let i = 0; i < 6; i++) {
    shortUrl += Txt.charAt(Math.floor(Math.random() * Txt.length));
  }

  if (!in_array(shortLink, shortUrl)) {
    shortLink.push(shortUrl);
    
    return shortUrl;
  } else {
    shortUrl=""
    Txt = Txt + String(new Date().getSeconds());
    for (let i = 0; i < 6; i++) {
      shortUrl += Txt.charAt(Math.floor(Math.random() * Txt.length));
    }
    return shortUrl;
  }
}
function createRanString() {
  let url = $("#UrlInp").val();
  get_rand();
  setToStorage([url, shortLink]);
  addLinksToTable([url, get_rand()]);
  getTable();
}

function checkUrl(e) {
  e.preventDefault;
  this.disabled = true;
  let url = $("#UrlInp").val();
  if (url === "") {
    $("p").html("Please enter a url!").addClass("error");
    timeOut();
  } else if (originalLink.includes(url) || shortLink.includes(url)) {
    $("p").html("You've already tried this link").addClass("error");
    timeOut();
  } else {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      createRanString();
    } else {
      $("p").html("Please enter a valid url!").addClass("error");
      timeOut();
    }
  }
  $("#UrlInp").val("");
  this.disabled = false;
}

$(".submit-btn").on("click", checkUrl);
