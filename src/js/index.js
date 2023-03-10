let originalLink = [];
let shortLink = [];
let shortLinkArray =[];
// localStorage.clear()
$(document).ready(function () {
  getToStorage();
  getTable(getToStorage());
});

function timeOut() {
  setTimeout(() => {
    $("p").removeClass("error");
  }, 3000);
}
function getToStorage() {
  if (!(localStorage.length == 0)) {
    originalLink = JSON.parse(localStorage["original"]);
    shortLinkArray = JSON.parse(localStorage["short"]);
  }
  return [originalLink, shortLinkArray];
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
        No data have been found!
      </td>
    </tr>`);
  }
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

function generateRandomWords() {
  let characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
  let randomWord = "";
  let randomVal = new Uint32Array(6);
  window.crypto.getRandomValues(randomVal);
  for (let i = 0; i < 6; i++) {
    const randomIndex = randomVal[i] % characters.length;
    randomWord += characters[randomIndex];
  }
  if (!in_array(shortLink, randomWord)) {
   shortLinkArray.push(randomWord);
  } 
}
function createRanString() {
  let url = $("#UrlInp").val();
  generateRandomWords();
  setToStorage([url, shortLinkArray]);
  getTable(getToStorage());
}

function checkUrl() {
  let url = $("#UrlInp").val();
  if (url === "") {
    $("p").html("Please enter a url!").addClass("error");
    timeOut();
  } else if (originalLink.includes(url) || shortLinkArray.includes(url)) {
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
  $("#UrlInp").focus();
}

$("#shortenUrl").on("click", function (e) {
  checkUrl();
});
$("#UrlInp").on("keyup", function (e) {
  if (e.key === "Enter") checkUrl();
});
