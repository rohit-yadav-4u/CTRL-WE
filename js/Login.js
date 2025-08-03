// js/login.js
import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const form = document.getElementById("auth-form");
const toggleLink = document.getElementById("toggle-form");
const errorDisplay = document.getElementById("auth-error");
const formTitle = document.getElementById("form-title");
const authButton = document.getElementById("auth-button");

let isLogin = true; // toggle between login and signup

toggleLink.addEventListener("click", () => {
  isLogin = !isLogin;
  formTitle.textContent = isLogin ? "Login" : "Sign Up";
  authButton.textContent = isLogin ? "Login" : "Sign Up";
  toggleLink.textContent = isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login";
  errorDisplay.textContent = "";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = form.email.value;
  const password = form.password.value;
  errorDisplay.textContent = "";

  try {
    if (isLogin) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
    } else {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date()
      });
    }

    // Redirect after success
    window.location.href = "../index.html";
  } catch (error) {
    errorDisplay.textContent = error.message;
  }
});
