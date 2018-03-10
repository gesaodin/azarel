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
var txtRetryPassword = document.getElementById("txtRetryPassword");
var btnLogin = document.getElementById("btnLogin");
var btnRegister = document.getElementById("btnRegister");

btnLogin.addEventListener('click', e => {    
    location.href = 'index.html';
});

btnRegister.addEventListener('click', e => {    
    var email = txtEmail.value;
    var password = txtPassword.value;

    HideButton();
    if (txtPassword.value != txtRetryPassword.value){
        Materialize.toast("Las claves deben coincidir", 3000, 'rounded');
        txtPassword.value = '';
        txtRetryPassword.value = '';
        ShowButton();
        return false;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(data => {
        location.href = "home.html";
    })
    .catch(error => {
        ShowButton();
        ClearText();
        ErrorCodeMessage(error);
    }); 
})

function HideButton(){
    $("#divLoginBegin").show();
    btnRegister.classList.add('hide');
}
function ShowButton(){
    $("#divLoginBegin").hide();
    btnRegister.classList.remove('hide');
}
function ClearText(){
    txtEmail.value = '';
    txtPassword.value = '';
    txtRetryPassword.value = '';
}

function ErrorCodeMessage(err){
    var errorCode = err.code;        
    // var errorMessage = err.message;
    console.log(errorCode);
    Materialize.toast(selectError(err.code), 3000, 'rounded') ;
}

firebase.auth().onAuthStateChanged(user => {
    if (user) {
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
