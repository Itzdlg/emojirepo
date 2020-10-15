function copyURI(evt) {
    evt.preventDefault();
    navigator.clipboard.writeText(evt.target.getAttribute('href')).then(() => {

    }, () => {

    });
}

function search() {
  if (document.getElementById("favorites").style.display == "") {
    searchFavorites();
  } else {
    var table;
    table = document.getElementsByClassName("table-wrap");
    
    for (i = 0; i < table.length; i++) {
      searchTable(table[i]);
    }
  }
}

function searchTable(wrap) {
  var input, filter, tr, td, i, txtValue, matches, table;
  table = wrap.getElementsByTagName("table")[0];
  
  
  input = document.getElementById("searchBox");
  filter = input.value.toUpperCase();
  tr = table.getElementsByTagName("tr");
  matches = 0;

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
        matches++;
      } else {
        tr[i].style.display = "none";
      }
    }
  }
  
  if (matches == 0) {
    wrap.style.display = "none";
  } else {
    wrap.style.display = "";
  }
}

function searchFavorites() {
  var input, filter, tr, td, i, txtValue, table;
  table = document.getElementById("favorite-table");
  
  
  input = document.getElementById("searchBox");
  filter = input.value.toUpperCase();
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function favorite(emojiID) {
  var storage = window.localStorage;
  var favorites = getFavorites();
  favorites.push(emojiID);
  
  storage.setItem('favorites', JSON.stringify(favorites));
}

function unfavorite(emojiID) {
  var storage = window.localStorage;
  var favorites = getFavorites();
  var index = favorites.indexOf(emojiID);
  if (index !== -1) {
    favorites.splice(index, 1);
  }
  
  storage.setItem('favorites', JSON.stringify(favorites));
}

function getFavorites() {
  var storage = window.localStorage;
  var favorites = storage.getItem('favorites');
  if (favorites) {
    return JSON.parse(favorites);
  } else {
    return [];
  }
}

function isFavorited(emojiID) {
  return getFavorites().indexOf(emojiID) != -1;
}

function toggleFavorites() {
  let showingFavorites = document.getElementById("favorites").style.display == "";
  let children = document.getElementById("content").children;
  for (i = 0; i < children.length; i++) {
    if (showingFavorites == false) {
      if (children[i].id == "favorites" || children[i].id == "searchBox" || children[i].id == "showFavorites") {
        children[i].style.display = "";
        document.getElementById("showFavorites").innerHTML = "Hide Favorites";
      } else {
        children[i].style.display = "none";
      }
    } else if (showingFavorites == true) {
      if (children[i].id == "favorites") {
        children[i].style.display = "none";
      } else {
        children[i].style.display = "";
        document.getElementById("showFavorites").innerHTML = "Show Favorites";
      }
    }
  }
}

function updateFavoritesTable(exists) {
  if (exists === true) {
    document.getElementById("content").removeChild(document.getElementById("favorites"));
  }
  
  var elem = document.createElement("div");
  elem.id = "favorites";
  document.getElementById("content").appendChild(elem);
  
  var header = document.createElement("h3");
  header.innerHTML = "Favorite Emojis";
  elem.appendChild(header);
  
  var tb = document.createElement("table");
  tb.className = "emoji-table";
  tb.id = "favorite-table";
  
  var headRow = tb.insertRow();
  var emojiCol = document.createElement("th");
  var emojiIDCol = document.createElement("th");
  var emojiLink = document.createElement("th");
  emojiCol.innerHTML = "Emoji";
  emojiIDCol.innerHTML = "Emoji ID";
  emojiLink.innerHTML = "Link";
  
  headRow.appendChild(emojiCol);
  headRow.appendChild(emojiIDCol);
  headRow.appendChild(emojiLink);
  
  var favorites = getFavorites();
  for (i = 0; i < favorites.length; i++) {
    var favorite = favorites[i];
    var row = tb.insertRow();
    var emoji = row.insertCell(0);
    var pic = document.createElement("img");
    pic.src = "https://itzdlg.github.io/emojis/" + favorite;
    pic.className = "emoji";
    emoji.appendChild(pic);
    
    var name = favorite;
    var index = favorite.lastIndexOf(".");
    if (index != -1) {
      name = favorite.substring(0, index);
    }
    
    var emojiName = row.insertCell(1);
    emojiName.innerHTML = name;
    
    var linkElem = document.createElement("a");
    linkElem.innerHTML = "Click To Copy";
    linkElem.href = "https://itzdlg.github.io/emojis/" + favorite;
    linkElem.addEventListener("click", copyURI);
    
    var linkCell = row.insertCell(2);
    linkCell.appendChild(linkElem);
  }
  
  elem.appendChild(tb);
}

window.onload = function() {
  document.getElementById("showFavorites").addEventListener("click", toggleFavorites);
  
  updateFavoritesTable(false);
  toggleFavorites();
}

document.addEventListener("click", function(e) {
  let emoji = e.target;
  if (emoji.className == "emoji") {
    e.stopPropagation();
    let td = emoji.parentElement;
    let tr = td.parentElement;
    let tdLink = tr.children[2].children[0].href;
    let tag = tdLink.substring(tdLink.lastIndexOf("/") + 1);
    if (isFavorited(tag)) {
      unfavorite(tag);
    } else {
      favorite(tag);
    }
    
    updateFavoritesTable(true);
  }
}, true);