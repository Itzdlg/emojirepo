function copyURI(evt) {
    evt.preventDefault();
    navigator.clipboard.writeText(evt.target.getAttribute('href')).then(() => {

    }, () => {

    });
}

function search() {
  // Declare variables
  var table;
  table = document.getElementsByClassName("table-wrap");
  
  for (i = 0; i < table.length; i++) {
    searchTable(table[i]);
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