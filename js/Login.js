$(document).ready(function () {
  // Load navbar dynamically using js/navbar.js
  fetch('../html/navbar.html')
    .then(response => response.text())
    .then(html => {
      $('#navbar-container').html(html);
      const script = document.createElement('script');
      script.src = '../js/navbar.js';
      document.body.appendChild(script);
      // Dispatch custom event after navbar is loaded
      document.dispatchEvent(new Event('navbarLoaded'));
    })
    .catch(err => console.error('Failed to load navbar:', err));
  });
  // Toggle between login and signup forms
  $(".info-item .btn").click(function () {
    $(".container").toggleClass("log-in");
  });

  // Handle login button click
  $(".form-item.log-in .btn").click(function () {
    var username = $(".form-item.log-in input[name='Username']").val().trim();
    var password = $(".form-item.log-in input[name='Password']").val().trim();

    if (username === "" || password === "") {
      alert("Please enter both username and password.");
      return;
    }

    // Call backend login API
    $.ajax({
      url: "http://localhost:3001/login",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ username: username, password: password }),
      success: function (response) {
        alert(response.message);
        // Store login state in sessionStorage
        sessionStorage.setItem("loggedInUser", JSON.stringify(response.user));
        $(".container").addClass("active");
      },
      error: function (xhr) {
        if (xhr.responseJSON && xhr.responseJSON.message) {
          alert("Login failed: " + xhr.responseJSON.message);
        } else {
          alert("Login failed: Unknown error");
        }
      }
    });
  });

  // Handle signup button click
  $(".form-item.sign-up .btn").click(function () {
    var email = $(".form-item.sign-up input[name='email']").val().trim();
    var fullName = $(".form-item.sign-up input[name='fullName']").val().trim();
    var username = $(".form-item.sign-up input[name='Username']").val().trim();
    var password = $(".form-item.sign-up input[name='Password']").val().trim();

    if (email === "" || fullName === "" || username === "" || password === "") {
      alert("Please fill in all signup fields.");
      return;
    }

    // Call backend signup API
    $.ajax({
      url: "http://localhost:3001/signup",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ email: email, fullName: fullName, username: username, password: password }),
      success: function (response) {
        alert(response.message);
        // Optionally switch to login form after successful signup
        $(".container").removeClass("log-in");
      },
      error: function (xhr) {
        if (xhr.responseJSON && xhr.responseJSON.message) {
          alert("Signup failed: " + xhr.responseJSON.message);
        } else {
          alert("Signup failed: Unknown error");
        }
      }
    });
  });

