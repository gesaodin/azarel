
var provider = new firebase.auth.GoogleAuthProvider();


var txtEmail = document.getElementById("txtEmail");
var txtPassword = document.getElementById("txtPassword");
var txtRetryPassword = document.getElementById("txtRetryPassword");
var btnLogin = document.getElementById("btnLogin");
var btnRegister = document.getElementById("btnRegister");


//Register new User
btnLogin.addEventListener('click', e => {    
    location.href = 'index.html';
});

//Register new User
btnRegister.addEventListener('click', e => {    
    var email = txtEmail.value;
    var password = txtPassword.value;
    HideButton();
    if (txtPassword.value != txtRetryPassword){
        Materialize.toast("Las claves deben coincidir", 3000, 'rounded');
        txtPassword.value = '';
        txtRetryPassword = '';
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
//Clean Forms
function ClearText(){
    txtEmail.value = '';
    txtPassword.value = '';
    txtRetryPassword = '';
}


//Error Code Message
function ErrorCodeMessage(err){
    var errorCode = err.code;        
    var errorMessage = err.message;
    Materialize.toast(errorMessage, 3000, 'rounded');
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

        location.href = "home.html";
        // ...
    } else {
        $("#divLoading").hide();
        $("#frmLogin").show(); 
    }
});
