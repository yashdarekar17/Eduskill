
// var typed = new Typed(".text",{
//     Strings:["Web development","App development","UI/UX","Data science"],
//     typeSpeed:100,
//     backSpeed:100,
//     backDelay:1000,
//     loop:true
// })

function toggleAuth() {
  const loginBtn = document.getElementById("btn1");
  
  if (localStorage.getItem("isLoggedIn") === "true") {
    // Logout
    localStorage.removeItem("isLoggedIn");
    loginBtn.textContent = "Login";
  } else {
    // Login
    localStorage.setItem("isLoggedIn", "true");
    loginBtn.textContent = "Logout";
  }
}

// Set button state on page load
window.onload = function () {
  const loginBtn = document.getElementById("btn1");

  if (localStorage.getItem("isLoggedIn") === "true") {
    loginBtn.textContent = "Logout";
  } else {
    loginBtn.textContent = "Login";
  }

  // Add event listener to toggle auth
  loginBtn.addEventListener("click", toggleAuth);
};


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


var typed =new Typed(".text" , {
    strings: ["Web development","App development","UI/UX","Data science"], // Your custom strings here
    typeSpeed:100,
     backSpeed:100,
      backDelay:1000,
    loop:true
});

var typed = new Typed("#typed-output", options);
