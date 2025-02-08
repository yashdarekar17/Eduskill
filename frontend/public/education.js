
// var typed = new Typed(".text",{
//     Strings:["Web development","App development","UI/UX","Data science"],
//     typeSpeed:100,
//     backSpeed:100,
//     backDelay:1000,
//     loop:true
// })

function login() {
  // Simulate login (replace with actual login logic)
  localStorage.setItem("isLoggedIn", "true");

  // Update UI
  document.getElementById("Btn1").style.display = "none";
 
}
window.onload = function () {
  if (localStorage.getItem("isLoggedIn") === "true") {
      document.getElementById("loginBtn").style.display = "none";
  }
};

var typed =new Typed(".text" , {
    strings: ["Web development","App development","UI/UX","Data science"], // Your custom strings here
    typeSpeed:100,
     backSpeed:100,
      backDelay:1000,
    loop:true
});

var typed = new Typed("#typed-output", options);
