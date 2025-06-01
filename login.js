// login.js

// Replace this config with your Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyCQsc-_nnGKlxHfhMBD4rIovrjLla0yp-4",
  authDomain: "software-solutions-f17c1.firebaseapp.com",
  projectId: "software-solutions-f17c1",
  storageBucket: "software-solutions-f17c1.firebasestorage.app",
  messagingSenderId: "911290181585",
  appId: "1:911290181585:web:30109dccae395055aa62f0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Elements
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const forgotPasswordLink = document.getElementById("forgot-password");
const googleLoginBtn = document.getElementById("google-login");

const loginSection = document.getElementById("auth-container");
const signupSection = document.getElementById("signup-container");

document.getElementById("toggle-signup").addEventListener("click", () => {
  loginSection.style.display = "none";
  signupSection.style.display = "block";
});

document.getElementById("toggle-login").addEventListener("click", () => {
  signupSection.style.display = "none";
  loginSection.style.display = "block";
});

// Login with Email/Password
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Logged in successfully");
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});

// Signup
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Account created successfully");
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("Signup failed: " + error.message);
    });
});

// Forgot Password
forgotPasswordLink.addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  if (!email) {
    return alert("Please enter your email address first.");
  }

  auth.sendPasswordResetEmail(email)
    .then(() => {
      alert("Password reset link sent to your email.");
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
});

// Google Sign-In
googleLoginBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      localStorage.setItem("softwork_logged_in", "true"); // ✅ Must set this!
      alert("Welcome, " + result.user.displayName);
      window.location.href = "services.html"; // ✅ Redirect after login
    })
    .catch((error) => {
      alert("Google login failed: " + error.message);
    });
});


auth.signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    localStorage.setItem("softwork_logged_in", "true"); // ✅ ADD THIS
    alert("Logged in successfully");
    window.location.href = "services.html"; // ✅ Redirect to services
  })


  auth.signInWithPopup(provider)
  .then((result) => {
    localStorage.setItem("softwork_logged_in", "true"); // ✅ ADD THIS
    alert("Welcome, " + result.user.displayName);
    window.location.href = "services.html"; // ✅ Redirect to services
  })

