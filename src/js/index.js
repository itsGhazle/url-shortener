let originalLink = [];
let shortLinkArray = [];

$(document).ready(function () {
  getFromStorage();
  getTable([originalLink, shortLinkArray]);
});

function timeOut() {
  setTimeout(() => {
    $("p").removeClass("error");
  }, 3000);
}

function getFromStorage() {
  if (!(localStorage.length == 0)) {
    originalLink = JSON.parse(localStorage["originalLink"]);
    shortLinkArray = JSON.parse(localStorage["shortLinkArray"]);
    return [originalLink, shortLinkArray];
  } else {
    return [[], []];
  }
}

function getTable(data) {
  if (!data[0].length == 0) {
    $(".addLinks").empty();
    for (let i = 0; i < data[0].length; i++) {
      $(".addLinks").append(`<tr>
      <td class="original_links" colspan=2>
        <a href="${data[0][i]} target="_blank"">${data[0][i]}</a>
      </td>
      <td class="short redirect" colspan=2>
        <a href="${data[0][i]}" target="_blank">${data[1][i]}</a>
      </td>
    </tr>`);
    }
  } else {
    $(".addLinks").append(`<tr>
      <td class="text-center" colspan="6">
        No data has been found!
      </td>
    </tr>`);
  }
}

function saveToStorage() {
  localStorage.setItem("originalLink", JSON.stringify(originalLink));
  localStorage.setItem("shortLinkArray", JSON.stringify(shortLinkArray));
}
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}

function generateUniqueShortUrl(originalUrl, length = 8) {
  const hash = hashCode(originalUrl);
  const hashHex = hash.toString(16);
  return hashHex.slice(0, length);
}

function createShortUrl() {
  let url = $("#UrlInp").val();
  if (originalLink.includes(url)) {
    let index = originalLink.indexOf(url);
    let existsShortUrl = shortLinkArray[index];
    $("p")
      .html(
        `This link already has a short URL. The short URL is ${existsShortUrl}`
      )
      .addClass("error");
    timeOut();
  } else {
    let shortUrl = generateUniqueShortUrl(url);
    let retry = 0;
    while (
      shortLinkArray.includes(shortUrl) &&
      retry <= Math.pow(16, shortUrl.length)
    ) {
      let newShortUrl = generateUniqueShortUrl(url, shortUrl.length + 1);
      if (shortLinkArray.includes(newShortUrl)) {
        retry++;
      } else {
        shortUrl = newShortUrl;
        retry = 0;
      }
    }
    if (!shortLinkArray.includes(shortUrl)) {
      shortLinkArray.push(shortUrl);
      originalLink.push(url);
      saveToStorage();
      getTable([originalLink, shortLinkArray]);
    }
  }
}

function validateUrl() {
  let urlInput = $("#UrlInp");
  let url = urlInput.val().trim();
  if (url === "") {
    $("p").html("Please enter a url!").addClass("error");
    timeOut();
    urlInput.focus();
  } else if (!/^https?:\/\//i.test(url)) {
    $("p")
      .html("Invalid URL. Please include the http:// or https:// scheme.")
      .addClass("error");
    timeOut();
    urlInput.focus();
  } else {
    createShortUrl();
  }
  urlInput.val("");
  urlInput.focus();
}

$("#shortenUrl").on("click", function (e) {
  validateUrl();
});
$("#UrlInp").on("keyup", function (e) {
  if (e.key === "Enter") validateUrl();
});
