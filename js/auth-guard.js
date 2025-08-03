// Redirect to Login.html if not authenticated
import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Not logged in, redirect to login page
    if (!window.location.pathname.endsWith("/html/Login.html")) {
      window.location.href = "/html/Login.html";
    }
  }
});
