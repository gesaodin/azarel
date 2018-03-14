var provider = new firebase.auth.GoogleAuthProvider();


var txtEmail = document.getElementById("txtEmail");
var txtPassword = document.getElementById("txtPassword");
var btnLogin = document.getElementById("btnLogin");
var divLogin = document.getElementById("divLogin");
var config = {  
    apiKey: "AIzaSyCtWgfZWdUQVRyC0W1NdlV3Zx9Q16I6Nf4",
    authDomain: "azarel-1a865.firebaseapp.com",
    databaseURL: "https://azarel-1a865.firebaseio.com",
    projectId: "azarel-1a865",
    storageBucket: "azarel-1a865.appspot.com",
    messagingSenderId: "963834795291"
  };
  
  
  firebase.initializeApp(config);


//Listener Login on authorization
btnLogin.addEventListener('click', e => {    
    var email = txtEmail.value;
    var password = txtPassword.value;
    if(email != 'azarelvenezuela@gmail.com'){
        txtEmail.value = "";
        txtPassword.value = "";
        Materialize.toast("Error en el correo/adm", 3000, 'rounded') ;
        return false;
    }
    HideButton();
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(data => {
        location.href = "access.html";
    })
    .catch(error => {
        ClearText();
        ShowButton();
        ErrorCodeMessage(error);
    });
})



function HideButton(){
    $("#divLoginBegin").show();
    btnLogin.classList.add('hide');

}

function ShowButton(){
    $("#divLoginBegin").hide();    
    btnLogin.classList.remove('hide');
}
//Clean Forms
function ClearText(){
    txtEmail.value = "";
    txtPassword.value = "";
}


//Error Code Message
function ErrorCodeMessage(err){
    var errorCode = err.code;        
    var errorMessage = err.message;
    Materialize.toast(errorMessage, 4000, 'rounded');
}

// function ErrorTranslate()
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;

        location.href = "access.html";
        // ...
    } else {
        $("#divLoading").hide();
        $("#frmLogin").show(); 
    }
});



