// Simple navbar logic for searchbar morph and active link (no animation)
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


