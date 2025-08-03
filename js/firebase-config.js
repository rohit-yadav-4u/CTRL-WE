// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDzCPsjpe57hLqkzaReqUtEkeEZcqTgJlU",
  authDomain: "kalayatra-57da8.firebaseapp.com",
  projectId: "kalayatra-57da8",
  storageBucket: "kalayatra-57da8.appspot.com",
  messagingSenderId: "30436098155",
  appId: "1:30436098155:web:51324588a0e473cef3312e",
  measurementId: "G-0YT4RR4353"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
