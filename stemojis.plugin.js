/**
 * @name STEmojis
 * @author SchoolTests
 * @version 0.0.1
 * @description Implements a button to grab emojis from the website
 * 
 * @website https://itzdlg.github.io/emojirepo/
 */

function insertButton() {
  var buttonsDiv = document.getElementsByClassName('buttons-3JBrkn')[0]
  var buttonDiv = document.createElement('button')
  buttonDiv.style.background = 'rgba(204, 204, 204, 0)'
  buttonDiv.id = "stemojis-button"
  
  var img = document.createElement('img')
  img.src = 'https://itzdlg.github.io/emojirepo/emojis/PandaMadSip.png'
  img.style.width = '32px'
  img.style.height = '32px'
  img.style.verticalAlign = 'middle'
  img.id = "stemojis-button"
 
  buttonDiv.appendChild(img)
  buttonsDiv.appendChild(buttonDiv)
  
  var sectionContainer = document.createElement('section')
  sectionContainer.className = "positionContainer-DEuh7X da-positionContainer"
  document.getElementsByClassName('da-channelTextArea')[0].appendChild(sectionContainer)
  
  var webDiv = document.createElement('div')
  webDiv.style.width = '424px'
  webDiv.style.height = '100%'
  webDiv.style.display = 'none'
  
  webDiv.style.position = 'absolute'
  webDiv.style.right = '0'
  webDiv.style.bottom = ''
  webDiv.style.background = 'rgba(0, 0, 0, .5)'
  webDiv.style.overflowY = 'scroll'
  webDiv.style.pointerEvents = 'all'
  webDiv.id = 'stemojis-web'
  
  fillWithEmojis(webDiv)
  sectionContainer.appendChild(webDiv)
  
  buttonDiv.addEventListener("click", function() {
    webDiv.style.display = webDiv.style.display === 'none' ? 'block' : 'none'
  })
}
  
function fillWithEmojis(div) {
    var treeJson = JSON.parse(stemojis_tree_content)
    var treeArr = treeJson.tree
    treeArr.forEach(obj => {
      if (obj.path.indexOf(".") !== -1) {
        let newImg = document.createElement('img')
        newImg.src = 'https://itzdlg.github.io/emojirepo/emojis/' + obj.path
        newImg.style.width = '48px'
        newImg.style.height = '48px'
        
        newImg.style.margin = '10px'
        newImg.style.cursor = 'pointer'
        newImg.className = "stemojis-emoji"
        div.appendChild(newImg)
      }
    })
}

function copyURI(evt) {
  evt.preventDefault();
  let link = evt.target.getAttribute('src');
  navigator.clipboard.writeText(link).then(() => {
    console.log('Copied URL to clipboard')
  }, () => {
    console.log('Error copying URL to clipboard')
  });
}

function withUrlContent(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;

  xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      callback(this.responseText);
    }
  });

  xhr.open("GET", url);

  
  xhr.send();
}

var stemojis_tree_content = '';
module.exports = class STEmojisPlugin {  
  start() {
    withUrlContent('https://api.github.com/repos/Itzdlg/emojirepo/git/trees/0a399bf163fabcb34e318626df6772fc73c3c3d7', function(urlContent) {
      stemojis_tree_content = urlContent
      
      var script = document.createElement('script');
      script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
      script.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(script);
      
      window.setInterval(function() {
        var buttonElement = document.getElementById("stemojis-button")
        if (!buttonElement && buttonElement !== undefined) {
          insertButton()
        }
      }, 500)
      
      document.addEventListener("click", function(e) {
        let target = e.target;
        if (target.className == "stemojis-emoji") {
          e.stopPropagation();
          copyURI(e)
        } else if (target.id !== "stemojis-web" && target.id !== "stemojis-button") {
          $('#stemojis-web').hide()
        }
      }, true);
    })
  }

  stop() {}
 
}