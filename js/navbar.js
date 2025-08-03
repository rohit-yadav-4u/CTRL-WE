// Simple navbar logic for searchbar morph and active link (no animation)
import { auth } from './firebase-config.js';
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

document.addEventListener('navbarLoaded', () => {
  const authSection = document.getElementById('auth-section');

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is logged in
      authSection.innerHTML = `
        <button id="profile-btn">Profile</button>
        <button id="logout-btn">Logout</button>
      `;

      // Handle Profile Click (Load Profile Page)
      document.getElementById('profile-btn').addEventListener('click', (e) => {
        e.preventDefault();
        fetch('../html/profile.html')
          .then(res => res.text())
          .then(html => {
            document.body.innerHTML = html; // Replace full page with profile.html
            // You can also use a div like <div id="main-content"> instead of replacing body
          });
      });

      // Handle Logout
      document.getElementById('logout-btn').addEventListener('click', async () => {
        await signOut(auth);
        location.reload();
      });

    } else {
      // User not logged in
      authSection.innerHTML = `<a href="../html/login.html">Login</a>`;
    }
  });
});


document.addEventListener('DOMContentLoaded', function() {
  // Show mobile bottom navbar on phones
  const mobileBottomNavbar = document.getElementById('mobile-bottom-navbar');
  function toggleMobileNavbar() {
    if (mobileBottomNavbar) {
      if (window.innerWidth <= 600) {
        mobileBottomNavbar.classList.add('show');
      } else {
        mobileBottomNavbar.classList.remove('show');
      }
    }
  }
  toggleMobileNavbar();
  window.addEventListener('resize', toggleMobileNavbar);
  // Mobile menu logic (no animation)
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menuOverlay = document.getElementById('mobile-menu-overlay');
  const menuClose = document.getElementById('mobile-menu-close');
  if (menuBtn && menuOverlay && menuClose) {
    menuBtn.addEventListener('click', function() {
      menuOverlay.style.display = 'block';
    });
    menuClose.addEventListener('click', function() {
      menuOverlay.style.display = 'none';
    });
    // Optional: close overlay when clicking outside menu
    menuOverlay.addEventListener('click', function(e) {
      if (e.target === menuOverlay) menuOverlay.style.display = 'none';
    });
  }
  // Searchbar morph logic
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

  // Active nav link logic
  const navLinks = document.querySelectorAll('#nav-links li a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Mobile bottom navbar active state
  const mobileLinks = document.querySelectorAll('#mobile-bottom-navbar li');
  mobileLinks.forEach(li => {
    li.addEventListener('click', function() {
      mobileLinks.forEach(item => item.classList.remove('active'));
      this.classList.add('active');
    });
  });
});
// Attach search logic to morphsearch-form
window.attachUnifiedSearchLogic = function() {
    // Attach search logic
    const searchForm = document.querySelector('.morphsearch-form');
    if (searchForm && !searchForm.__searchAttached) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchForm.querySelector('input').value.trim();
            if (!query) return;
            localStorage.setItem('searchQuery', query);
            // Robust path handling for searchresult.html
            let resultPath = '';
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
                resultPath = 'html/searchresult.html';
            } else if (window.location.pathname.includes('shop.html')) {
                resultPath = '../html/searchresult.html';
            } else if (window.location.pathname.includes('about_us.html')) {
                resultPath = '../html/searchresult.html';
            } else {
                resultPath = 'searchresult.html';
            }
            window.location.href = resultPath;
        });
        searchForm.__searchAttached = true;
    }
    // Mobile navbar logic (ensure it runs after dynamic injection)
    const mobileBottomNavbar = document.getElementById('mobile-bottom-navbar');
    function toggleMobileNavbar() {
        if (mobileBottomNavbar) {
            if (window.innerWidth <= 600) {
                mobileBottomNavbar.classList.add('show');
            } else {
                mobileBottomNavbar.classList.remove('show');
            }
        }
    }
    toggleMobileNavbar();
    window.addEventListener('resize', toggleMobileNavbar);
    // Mobile menu logic (no animation)
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menuOverlay = document.getElementById('mobile-menu-overlay');
    const menuClose = document.getElementById('mobile-menu-close');
    if (menuBtn && menuOverlay && menuClose) {
        menuBtn.addEventListener('click', function() {
            menuOverlay.style.display = 'block';
        });
        menuClose.addEventListener('click', function() {
            menuOverlay.style.display = 'none';
        });
        // Optional: close overlay when clicking outside menu
        menuOverlay.addEventListener('click', function(e) {
            if (e.target === menuOverlay) menuOverlay.style.display = 'none';
        });
    }
};
// Attach on DOMContentLoaded for static navbar.html
document.addEventListener('DOMContentLoaded', function() {
    window.attachUnifiedSearchLogic();
});
// Add this where navbar is rendered
const loginContainer = document.getElementById('login-container');
const user = JSON.parse(sessionStorage.getItem('loggedInUser'));

if (loginContainer) {
  if (user && user.username) {
    loginContainer.innerHTML = `
      <span>Hello, ${user.username}</span>
      <button id="logout-btn" class="login-btn">Logout</button>
    `;
    document.getElementById('logout-btn').addEventListener('click', () => {
      sessionStorage.removeItem('loggedInUser');
      location.reload();
    });
  } else {
    loginContainer.innerHTML = `<a href="../html/login.html" class="login-btn">Login</a>`;
  }
}
import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const loginContainer = document.getElementById('login-container');

  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginContainer.innerHTML = `
        <span>Hello, ${user.email}</span>
        <button id="logout-btn">Logout</button>
      `;
      document.getElementById('logout-btn').addEventListener('click', async () => {
        await signOut(auth);
        location.reload();
      });
    } else {
      loginContainer.innerHTML = `<a href="../html/login.html">Login</a>`;
    }
  });
});


document.addEventListener("DOMContentLoaded", function () {
        var searchForm = document.getElementById("navbar-search-form");
        var searchInput = document.getElementById("navbar-search-input");
        if (searchForm && searchInput) {
          searchForm.addEventListener("submit", function (e) {
            e.preventDefault();
            var query = searchInput.value.trim();
          if (query) {
            localStorage.setItem("searchQuery", query);
            // Always redirect to /html/searchresult.html from any page
            window.location.href = window.location.origin + "/html/searchresult.html";
          }
          });
        }
        // Dummy column search links logic
        var searchLinks = document.querySelectorAll(
          ".search-link[data-search]"
        );
        searchLinks.forEach(function (link) {
          link.addEventListener("click", function (e) {
            var tag = link.getAttribute("data-search");
            if (tag) {
              e.preventDefault();
              localStorage.setItem("searchQuery", tag);
              window.location.href = link.getAttribute("href");
            }
          });
        });

        // New code to update login button with username if logged in
        const loginContainer = document.getElementById('login-container');
        const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (user && user.username) {
          loginContainer.innerHTML = `
            <div class="user-info">
              <span class="username">Hello, ${user.username}</span>
              <button id="logout-btn" class="login-btn">Logout</button>
            </div>
          `;
          document.getElementById('logout-btn').addEventListener('click', () => {
            sessionStorage.removeItem('loggedInUser');
            location.reload();
          });
        }
      });
      // Existing morphsearch open/close logic
      (function () {
        var morphSearch = document.getElementById("morphsearch"),
          input = morphSearch.querySelector("input.morphsearch-input"),
          ctrlClose = morphSearch.querySelector("span.morphsearch-close"),
          isOpen = (isAnimating = false),
          toggleSearch = function (evt) {
            if (evt.type.toLowerCase() === "focus" && isOpen) return false;
            if (isOpen) {
              classie.remove(morphSearch, "open");
              if (input.value !== "") {
                setTimeout(function () {
                  classie.add(morphSearch, "hideInput");
                  setTimeout(function () {
                    classie.remove(morphSearch, "hideInput");
                    input.value = "";
                  }, 300);
                }, 500);
              }
              input.blur();
            } else {
              classie.add(morphSearch, "open");
            }
            isOpen = !isOpen;
          };
        input.addEventListener("focus", toggleSearch);
        ctrlClose.addEventListener("click", toggleSearch);
        document.addEventListener("keydown", function (ev) {
          var keyCode = ev.keyCode || ev.which;
          if (keyCode === 27 && isOpen) {
            toggleSearch(ev);
          }
        });
      })();
