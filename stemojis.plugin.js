/**
 * @name STEmojis
 * @author SchoolTests
 * @version 2.0.0
 * @description Implements a button to grab emojis from the website
 * 
 * @website https://itzdlg.github.io/emojirepo/
 */
 
/* Element Rundown:
* #stemojis-web : The panel of emojis that appears after clicking the textbox button
* #stemojis-button : The button in the textbox to make the emoji panel appear
* .stemojis-emoji : The emoji image themselves, which are all in the panel
*/
 
var stemojis_tree_content = '';
var stemojis_button_emojis = [
  'https://itzdlg.github.io/emojirepo/emojis/PandaMadSip.png',
  'https://itzdlg.github.io/emojirepo/emojis/PandaPlushie.gif',
  'https://itzdlg.github.io/emojirepo/emojis/PikaFacepalm.png',
  'https://itzdlg.github.io/emojirepo/emojis/PepePathetic.png',
  'https://itzdlg.github.io/emojirepo/emojis/WorryLook.png',
  'https://itzdlg.github.io/emojirepo/emojis/AnimeDetective.png',
  'https://itzdlg.github.io/emojirepo/emojis/BlobNo.png',
  'https://itzdlg.github.io/emojirepo/emojis/LieDown.png'
];
var stemojis_button_emoji = stemojis_button_emojis[Math.floor(Math.random() * stemojis_button_emojis.length)]

function isEnabled() {
  return BdApi.Plugins.isEnabled("STEmojis")
}

function exists(e) {
  return typeof(e) != 'undefined' && e != null
}

module.exports = class STEmojisPlugin {  
  start() {
    refreshEmojis()
    window.setInterval(function() {
      if (isEnabled() === true) {
        var buttonElement = document.getElementById("stemojis-button")
        if (!buttonElement && buttonElement !== undefined) {
          createElements()
        }
      }
    }, 500)
    
    document.addEventListener("click", function(e) {
      if (isEnabled() === true) {
        let target = e.target;
        if (target.className == "stemojis-emoji") {
          e.stopPropagation()
          copyURI(e)
          
          document.getElementById("stemojis-button").children[0].src = target.src
          stemojis_button_emoji = target.src
        } else if (target.id !== "stemojis-web" && target.id !== "stemojis-button") {
          document.getElementById("stemojis-web").style.display = 'none'
        }
      }
    }, true);
  }

  stop() {
    window.setInterval(function() {
      if (isEnabled() === false) {
        deleteCreatedElements()
      }
    }, 500)
  }
}

function refreshEmojis() {
  withUrlContent('https://api.github.com/repos/Itzdlg/emojirepo/git/trees/master', function (content) {
    var json = JSON.parse(content)
    var urlToEmojisFolder = ''
    json.tree.forEach(obj => {
      if (obj.path === 'emojis') {
        urlToEmojisFolder = obj.url
      }
    })
    
    withUrlContent(urlToEmojisFolder, function (emojiTree) {
      stemojis_tree_content = emojiTree
    })
  })
}

function deleteCreatedElements() {
  var button_ = document.getElementById('stemojis-button')
  var section_ = document.getElementById('stemojis-web-section')
  var panel_ = document.getElementById('stemojis-web')
  var emojis_ = document.getElementsByClassName('stemojis-emoji')
  
  if (exists(button_)) {
    if (exists(button_.children) && button_.children.length > 0) {
      button_.children[0].remove()
    }
    
    button_.remove()
  }
  
  if (exists(emojis_)) {
    for (var i = 0; i < emojis_.length; i++) {
      emojis_[i].remove()
    }
  }
  
  if (exists(panel_)) {
    panel_.remove()
  }
  
  if (exists(section_)) {
    section_.remove()
  }
}

function createElements() {
  deleteCreatedElements()
  
  var buttonsDiv = document.getElementsByClassName('buttons-3JBrkn')[0]
  var buttonDiv = document.createElement('button')
  buttonDiv.style.background = 'rgba(204, 204, 204, 0)'
  buttonDiv.id = "stemojis-button"
  
  var img = document.createElement('img')
  img.src = stemojis_button_emoji
  img.style.width = '32px'
  img.style.height = '32px'
  img.style.verticalAlign = 'middle'
 
  buttonDiv.appendChild(img)
  buttonsDiv.appendChild(buttonDiv)
  
  var sectionContainer = document.createElement('section')
  sectionContainer.className = "positionContainer-DEuh7X da-positionContainer"
  sectionContainer.id = "stemojis-web-section"
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
    console.log('[STEmojis] Copied URL to clipboard')
  }, () => {
    console.log('[STEmojis] Error copying URL to clipboard')
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