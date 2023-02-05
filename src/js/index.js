let originalLink = [];
let shortLink = [];
// localStorage.clear()

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

function addLinks(data) {
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
  storage[1].push(data[1]);
  localStorage.setItem("original", JSON.stringify(storage[0]));
  localStorage.setItem("short", JSON.stringify(storage[1]));
}

function getrandom(e) {
  e.preventDefault();
  this.disabled = true;
  let url = $("#UrlInp").val();
  if (url === "") {
    $("p").html("Please enter a url!").addClass("error");
    timeOut();
  } else if (originalLink.includes(url)) {
    $("p").html("You've already tried this link").addClass("error");
    timeOut();
  } else {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      let Txt =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let shortUrl = "";
      for (let i = 0; i < 6; i++) {
        shortUrl += Txt.charAt(Math.floor(Math.random() * Txt.length));
      }

      addLinks([url, shortUrl]);
      setToStorage([url, shortUrl]);
      getTable();
      url = $("#UrlInp").val("");
    } else {
      $("p").html("Please enter a valid url!").addClass("error");
      timeOut();
    }
  }
  $("#UrlInp").val("");
  this.disabled = false;
}

$(".submit-btn").on("click", getrandom);
