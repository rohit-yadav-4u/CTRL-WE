// Load navbar.html and inject into the top of the body
fetch('./html/navbar.html')
  .then(res => res.text())
  .then(html => {
    document.body.insertAdjacentHTML('afterbegin', html);
  });
