var config = {
    apiKey: "AIzaSyCtWgfZWdUQVRyC0W1NdlV3Zx9Q16I6Nf4",
    authDomain: "azarel-1a865.firebaseapp.com",
    projectId: "azarel-1a865",
    storageBucket: "azarel-1a865.appspot.com",
    messagingSenderId: "963834795291"
};
firebase.initializeApp(config);
  
var provider = new firebase.auth.GoogleAuthProvider();
var txtEmail = document.getElementById("txtEmail");
var txtPassword = document.getElementById("txtPassword");
var btnLogin = document.getElementById("btnLogin");
var btnLoadRegister = document.getElementById("btnLoadRegister");
var btnGoogle = document.getElementById("btnGoogle");
var divLogin = document.getElementById("divLogin");


btnLoadRegister.addEventListener('click', e => {    
    location.href = 'register.html';
});
btnLogin.addEventListener('click', e => {    
    var email = txtEmail.value;
    var password = txtPassword.value;
    HideButton();
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(data => {
        location.href = "home.html";
    })
    .catch(error => {
        ClearText();
        ShowButton();
        ErrorCodeMessage(error);
    });
})
btnGoogle.addEventListener('click', e => {
    HideButton();
    firebase.auth().signInWithPopup(provider)
    .then( result => {
        var token = result.credential.accessToken;
        var user = result.user;
        return user;
    })   
    .catch( error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        ClearText();
        ShowButton();
        ErrorCodeMessage(error);
    });

});
function HideButton(){
    $("#divLoginBegin").show();
    btnLogin.classList.add('hide');
    btnLoadRegister.classList.add('disabled');
    btnGoogle.classList.add('disabled');
}

function ShowButton(){
    $("#divLoginBegin").hide();    
    btnLogin.classList.remove('hide');
    btnLoadRegister.classList.remove('disabled');
    btnGoogle.classList.remove('disabled');
}
function ClearText(){
    txtEmail.value = "";
    txtPassword.value = "";
}
function ErrorCodeMessage(err){
    var errorCode = err.code;        
    // var errorMessage = err.message;
    console.log(errorCode);
    Materialize.toast(selectError(err.code), 3000, 'rounded') ;
}
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
        location.href = "home.html";
    } else {
        $("#divLoading").hide();
        $("#frmLogin").show(); 
    }
});

function selectError(sCode){
    var msg = '';
    switch (sCode) {
        case "auth/invalid-email":
            msg = 'Verifique el correo electrónico';
            break;
        case "auth/wrong-password":
            msg = 'Error en la clave';
            break;
        default:
            break;
    }
    return msg;
}

