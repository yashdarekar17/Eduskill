
// var typed = new Typed(".text",{
//     Strings:["Web development","App development","UI/UX","Data science"],
//     typeSpeed:100,
//     backSpeed:100,
//     backDelay:1000,
//     loop:true
// })

// const mode = document.querySelector(".mode");
// let currmode = "light";

// mode.addEventListener("click", () => {
//   if (currmode === "light") {
//     currmode = "dark";
//     document.body.style.backgroundColor = "black";
//     document.body.style.color = "white";
//   } else {
//     currmode = "light";
//     document.body.style.backgroundColor = "rgb(248,247, 243)";
//     document.body.style.color = "black";
//   }

//   console.log(currmode);
// });


// function toggleAuth() {
//   const loginBtn = document.getElementById("btn1");
  
//   if (localStorage.getItem("isLoggedIn") === "true") {
//     // Logout
//     localStorage.removeItem("isLoggedIn");
//     loginBtn.textContent = "Login";
//   } else {
//     // Login
//     localStorage.setItem("isLoggedIn", "true");
//     loginBtn.textContent = "Logout";
//   }
// }

// Set button state on page load
// window.onload = function () {
//   const loginBtn = document.getElementById("btn1");

//   if (localStorage.getItem("isLoggedIn") === "true") {
//     loginBtn.textContent = "Logout";
//   } else {
//     loginBtn.textContent = "Login";
//   }

//   // Add event listener to toggle auth
//   loginBtn.addEventListener("click", toggleAuth);
// };


// Set button state on page load


window.onload = function () {
  const loginBtn = document.getElementById("loginBtn");

  if (localStorage.getItem("isLoggedIn") === "true") {
    loginBtn.textContent = "Logout";
  } else {
    loginBtn.textContent = "Login";
  }

  // Add event listener to toggle auth
  loginBtn.addEventListener("click", toggleAuth);
};

 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
 import { getAuth,GoogleAuthProvider,signInWithPopup } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaSyBZE7bglbQ3UhZACjE_LFd7CTgzNAGi4S8",
   authDomain: "login-647d5.firebaseapp.com",
   projectId: "login-647d5",
   storageBucket: "login-647d5.firebasestorage.app",
   messagingSenderId: "418341122972",
   appId: "1:418341122972:web:8a9404d6afa7b6e39dce59"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth=getAuth(app);
 auth.languageCode = 'en';
 const provider= new GoogleAuthProvider();

 const googlelogin= document.getElementById('google');
 googlelogin.addEventListener('click',()=>{
  signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    console.log(user);
    window.location.href="/";

  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    
  });
 });





