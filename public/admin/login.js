// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyACvMULzCWpxmAjCme3bhSrUDeehpuKIPI",
  authDomain: "drheshamngim.firebaseapp.com",
  databaseURL: "https://drheshamngim-default-rtdb.firebaseio.com",
  projectId: "drheshamngim",
  storageBucket: "drheshamngim.appspot.com",
  messagingSenderId: "810852052392",
  appId: "1:810852052392:web:669c45a698ca9296db819d",
  measurementId: "G-H8LE96VNHK",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const messageDiv = document.createElement("div");
loginForm.appendChild(messageDiv);

messageDiv.style.marginTop = "20px";
messageDiv.style.padding = "10px 15px";
messageDiv.style.borderRadius = "8px";
messageDiv.style.textAlign = "center";
messageDiv.style.display = "none";

function displayMessage(message, type) {
  messageDiv.innerHTML = message;
  messageDiv.style.display = "block";
  if (type === "success") {
    messageDiv.style.backgroundColor = "#4CAF50";
    messageDiv.style.color = "#fff";
  } else if (type === "error") {
    messageDiv.style.backgroundColor = "#f44336";
    messageDiv.style.color = "#fff";
  }

  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 1500);
}

// التعامل مع تسجيل الدخول
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    displayMessage("Please enter both email and password.", "error");
    return;
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      displayMessage("Login successful! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "dashboard";
      }, 500);
    })
    .catch((error) => {
      const errorCode = error.code;
      let errorMessage = "An error occurred during login.";

      if (errorCode === "auth/user-not-found") {
        errorMessage = "Email not found.";
      } else if (errorCode === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (errorCode === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      } else if (errorCode === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      }

      displayMessage(errorMessage, "error");
    });
});

// التعامل مع نسيان كلمة المرور
forgotPasswordLink.addEventListener("click", (e) => {
  e.preventDefault();

  const email = emailInput.value;

  if (!email) {
    displayMessage("Please enter your email to reset your password.", "error");
    return;
  }

  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      displayMessage(
        "Password reset message has been sent to the email registered in the control panel, check your emails.",
        "success"
      );
    })
    .catch((error) => {
      const errorCode = error.code;
      let errorMessage = "An error occurred.";

      if (errorCode === "auth/user-not-found") {
        errorMessage = "Email not found.";
      } else if (errorCode === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      }

      displayMessage(errorMessage, "error");
    });
});
