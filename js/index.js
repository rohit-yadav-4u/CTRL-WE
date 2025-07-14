// --- Searchbar morph animation ---
document.addEventListener('DOMContentLoaded', function() {
  const searchMorph = document.querySelector('.searchbar-morph');
  const searchInput = document.getElementById('search-bar');
  if (searchMorph && searchInput) {
    function expandSearch() {
      searchMorph.classList.add('expanded');
      searchInput.focus();
    }
    function collapseSearch(e) {
      if (!searchMorph.contains(e.target)) {
        searchMorph.classList.remove('expanded');
        searchInput.value = '';
      }
    }
    searchMorph.addEventListener('click', expandSearch);
    searchInput.addEventListener('focus', expandSearch);
    document.addEventListener('mousedown', collapseSearch);
  }
});

// --- Minimal, clean code for hero grid, zoom, and navbar ---
// After showing the navbar and hero text after zoom, trigger nav link reveal
// Only one revealNavLinks function should exist below
function revealNavLinks(skipNavLogo = false) {
  const tl = gsap.timeline();
  if (!skipNavLogo) {
    tl.from("nav", {
      y: -100,
      opacity: 0,
      duration: 0.3,
      ease: "power2.out"
    });
    // Animate logo (fade in and slide from left)
    tl.from("#logo", {
      x: -100,
      opacity: 0,
      duration: 0.3,
      ease: "power1.out"
    });
    // Animate nav links upward, after logo
    tl.from("#nav-links li a", {
      y: -100,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: "power2.out"
    }, ">-0.2"); // slight overlap for smoothness
    tl.from(".search-container", {
      y: -100,
      opacity: 0,
      duration: 0.3,
      ease: "power2.out"
    }, ">-0.3"); // slight overlap for smoothness
    tl.from("#login-btn", {
      y: -100,
      opacity: 0,
      duration: 0.3,
      ease: "power2.out"
    }, ">-0.3"); // slight overlap for smoothness
  }

  tl.from("#hero-text-after-zoom h1", {
    opacity: 0,
    scale: 0,
    filter: "blur(70px)",
    duration: 0.4,
    delay: 0.1,
    ease: "ease.out"
  }); 

  // Wavy text animation for tagline (word by word, smooth)
  const taglineP = document.getElementById("hero-text-after-zoom-p");
  const originalText = 'WHERE TRADITION TRAVELS TIMELESSLY';
  if (taglineP && !taglineP.classList.contains("wavy-ready")) {
    let text = originalText;
    const words = text.split(/\s+/);
    taglineP.innerHTML = words.map(word => `<span class="wavy-word">${word}</span>`).join(' ');
    taglineP.classList.add("wavy-ready");
  }
  tl.set("#hero-text-after-zoom-p", {overflow: "hidden", display: "inline-block"});
  tl.fromTo(
    "#hero-text-after-zoom-p .wavy-word",
    {
      y: 40,
      opacity: 0,
      display: 'inline-block',
      filter: 'blur(8px)'
    },
    {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.8,
      ease: "power3.out",
      stagger: {
        each: 0.3,
        from: "start"
      },
      onComplete: () => {
        // Remove all spans and restore original text with <br> for mobile
        taglineP.innerHTML = originalText;
      }
    },
    ">-0.1"
  );
}
const body = document.body;
const enterButton = document.querySelector('.enter');
const fullview = document.querySelector('.fullview');
const grid = document.querySelector('.grid');
const gridRows = grid.querySelectorAll('.row');

let winsize = { width: window.innerWidth, height: window.innerHeight };
window.addEventListener('resize', () => {
  winsize = { width: window.innerWidth, height: window.innerHeight };
});

let mousepos = { x: winsize.width / 2, y: winsize.height / 2 };

const config = {
  translateX: true,
  contrast: true,
  brightness: true
};

const numRows = gridRows.length;
const middleRowIndex = Math.floor(numRows / 2);
const middleRow = gridRows[middleRowIndex];
const middleRowItems = middleRow.querySelectorAll('.row__item');
const numRowItems = middleRowItems.length;
const middleRowItemIndex = Math.floor(numRowItems / 2);
const middleRowItemInner = middleRowItems[middleRowItemIndex].querySelector('.row__item-inner');
const middleRowItemInnerImage = middleRowItemInner.querySelector('.row__item-img');
middleRowItemInnerImage.classList.add('row__item-img--large');

const baseAmt = 0.1;
const minAmt = 0.05;
const maxAmt = 0.1;

let renderedStyles = Array.from({ length: numRows }, (v, index) => {
  const distanceFromMiddle = Math.abs(index - middleRowIndex);
  const amt = Math.max(baseAmt - distanceFromMiddle * 0.03, minAmt);
  let style = { amt };
  if (config.translateX) style.translateX = { previous: 0, current: 0 };
  if (config.contrast) style.contrast = { previous: 100, current: 100 };
  if (config.brightness) style.brightness = { previous: 100, current: 100 };
  return style;
});

let requestId;

const lerp = (a, b, n) => (1 - n) * a + n * b;
const getMousePos = e => ({ x: e.clientX, y: e.clientY });

const updateMousePosition = (ev) => {
  const pos = getMousePos(ev);
  mousepos.x = pos.x;
  mousepos.y = pos.y;
};

const calculateMappedX = () => ((mousepos.x / winsize.width) * 2 - 1) * 40 * winsize.width / 100;
const calculateMappedContrast = () => {
  const centerContrast = 100;
  const edgeContrast = 330;
  const t = Math.abs((mousepos.x / winsize.width) * 2 - 1);
  const factor = Math.pow(t, 2);
  return centerContrast - factor * (centerContrast - edgeContrast);
};
const calculateMappedBrightness = () => {
  const centerBrightness = 100;
  const edgeBrightness = 15;
  const t = Math.abs((mousepos.x / winsize.width) * 2 - 1);
  const factor = Math.pow(t, 2);
  return centerBrightness - factor * (centerBrightness - edgeBrightness);
};

const render = () => {
  const mappedValues = {
    translateX: calculateMappedX(),
    contrast: calculateMappedContrast(),
    brightness: calculateMappedBrightness()
  };
  gridRows.forEach((row, index) => {
    const style = renderedStyles[index];
    for (let prop in config) {
      if (config[prop]) {
        style[prop].current = mappedValues[prop];
        style[prop].previous = lerp(style[prop].previous, style[prop].current, style.amt);
      }
    }
    let gsapSettings = {};
    if (config.translateX) gsapSettings.x = style.translateX.previous;
    if (config.contrast) gsapSettings.filter = `contrast(${style.contrast.previous}%)`;
    if (config.brightness) gsapSettings.filter = `${gsapSettings.filter ? gsapSettings.filter + ' ' : ''}brightness(${style.brightness.previous}%)`;
    gsap.set(row, gsapSettings);
  });
  requestId = requestAnimationFrame(render);
};

const startRendering = () => { if (!requestId) render(); };
const stopRendering = () => { if (requestId) { cancelAnimationFrame(requestId); requestId = undefined; } };

const enterFullview = () => {
  const flipstate = Flip.getState(middleRowItemInner);
  fullview.appendChild(middleRowItemInner);
  gsap.timeline()
    .add(Flip.from(flipstate, {
      duration: 0.9,
      ease: 'power4',
      absolute: true,
      onComplete: () => {
        stopRendering();
        const mainNavbar = document.getElementById('main-navbar');
        const heroText = document.getElementById('hero-text-after-zoom');
        const mobileNav = document.getElementById('mobile-bottom-navbar');
        // MOBILE: Hide all, then animate in sequence
        if (window.innerWidth <= 600) {
          // Hide all first
          if (mainNavbar) mainNavbar.style.display = 'flex';
          if (heroText) heroText.style.display = 'none';
          if (mobileNav) mobileNav.classList.remove('show');
          // Animate top bar: logo (left) and login button (right) together
          const logo = document.getElementById('logo');
          const loginBtn = document.getElementById('login-btn');
          if (logo && loginBtn) {
            gsap.set([logo, loginBtn], {y: -60, opacity: 0});
            gsap.to([logo, loginBtn], {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
              stagger: 0.12,
              onComplete: () => {
                // Animate bottom navbar
                if (mobileNav) {
                  mobileNav.classList.add('show');
                  const tabs = mobileNav.querySelectorAll('ul li');
                  gsap.set(tabs, {y: 40, opacity: 0});
                  gsap.to(tabs, {
                    y: 0,
                    opacity: 1,
                    duration: 0.45,
                    ease: 'power3.out',
                    stagger: 0.09,
                    delay: 0.05,
                    onComplete: () => {
                      // Animate hero section
                      if (heroText) {
                        heroText.style.display = 'flex';
                        // Animate hero heading and tagline (skip nav/logo)
                        revealNavLinks(true);
                      }
                    }
                  });
                }
              }
            });
          }
        } else {
          // DESKTOP: normal sequence
          if (mainNavbar) mainNavbar.style.display = 'flex';
          if (heroText) heroText.style.display = 'flex';
          revealNavLinks();
        }
      }
    }))
    .to(grid, {
      duration: 0.9,
      ease: 'power4',
      opacity: 0.01
    }, 0)
    .to(middleRowItemInnerImage, {
      scale: 1.2,
      duration: 3,
      ease: 'sine'
    }, '<-=0.45');
  enterButton.classList.add('hidden');
  body.classList.remove('noscroll');
};

const preloadImages = (selector = 'img') => new Promise((resolve) => {
  imagesLoaded(document.querySelectorAll(selector), {background: true}, resolve);
});

const init = () => {
  startRendering();
  // Smooth scrolling is not required for minimal hero effect, so omitted
  enterButton.addEventListener('click', enterFullview);
  enterButton.addEventListener('touchstart', enterFullview);
};

preloadImages('.row__item-img').then(() => {
  document.body.classList.remove('loading');
  init();
});

window.addEventListener('mousemove', updateMousePosition);
window.addEventListener('touchmove', (ev) => {
  const touch = ev.touches[0];
  updateMousePosition(touch);
});
