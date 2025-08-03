// js/login.js
import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const form = document.getElementById("auth-form");
const toggleLink = document.getElementById("toggle-form");
const errorDisplay = document.getElementById("auth-error");
const formTitle = document.getElementById("form-title");
const authButton = document.getElementById("auth-button");
const nameInput = document.getElementById("name");

let isLogin = true; // toggle between login and signup

function showNameField(show) {
  if (show) {
    nameInput.style.display = "block";
    nameInput.setAttribute("required", "required");
    nameInput.classList.add("pop-in");
  } else {
    nameInput.style.display = "none";
    nameInput.removeAttribute("required");
    nameInput.classList.remove("pop-in");
  }
}

toggleLink.addEventListener("click", () => {
  isLogin = !isLogin;
  formTitle.textContent = isLogin ? "Login" : "Sign Up";
  authButton.textContent = isLogin ? "Login" : "Sign Up";
  toggleLink.textContent = isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login";
  errorDisplay.textContent = "";
  showNameField(!isLogin);
});

// On load, make sure name field is hidden for login
showNameField(false);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = form.email.value;
  const password = form.password.value;
  const name = nameInput.value.trim();
  errorDisplay.textContent = "";

  try {
    if (isLogin) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      if (!name) {
        errorDisplay.textContent = "Name is required.";
        nameInput.focus();
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        name: name,
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
