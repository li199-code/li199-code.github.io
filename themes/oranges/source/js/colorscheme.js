// colorscheme.js
let switchHandle = document.querySelector('#switch-color-scheme')
let themeIcon = document.querySelector('#theme-icon')
var html = document.documentElement

function changeGiscusTheme () {
    const theme = document.documentElement.getAttribute('color-mode') === 'dark' ?  'dark_dimmed' : 'light'

    function sendMessage(message) {
      const iframe = document.querySelector('iframe.giscus-frame');
      if (!iframe) return;
      iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
    }

    sendMessage({
      setConfig: {
        theme: theme
      }
    });
  }

function remainGiscusTheme () {
    const theme = localStorage.getItem('color-mode') === 'dark' ?  'dark_dimmed' : 'light'

    function sendMessage(message) {
        const iframe = document.querySelector('iframe.giscus-frame');
        if (!iframe) return;
        iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
    }

    sendMessage({
        setConfig: {
        theme: theme
        }
    });
}


const switchMode = () => {
    let attr = html.getAttribute('color-mode')
    let colorMode = 'light'
    if (attr === 'light') {
        html.setAttribute('color-mode', 'dark')
        themeIcon.classList = 'iconfont icon-sun'
        changeGiscusTheme();
        colorMode = 'dark'
    } else {
        html.setAttribute('color-mode', 'light')
        themeIcon.classList = 'iconfont icon-moon'
        changeGiscusTheme();
        colorMode = 'light'
    }
    localStorage.setItem('color-mode', colorMode)
}

switchHandle.addEventListener('click', switchMode, false)
window.addEventListener('load', function() {
    remainGiscusTheme();
});

const currColorMode = localStorage.getItem('color-mode')
if (currColorMode === 'light') {
    themeIcon.classList = 'iconfont icon-moon'
} else {
    themeIcon.classList = 'iconfont icon-sun'
}
