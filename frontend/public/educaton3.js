 
 function isloggedin(){
    return localStorage.getItem("isLoggedIn")==="true";
 }

 function checklogin(redirectUrl){
    if(!isloggedin()){
        window.location.href=redirectUrl;
    }else{
        window.location.href="/login.html";
    }
 }