var provider = new firebase.auth.GoogleAuthProvider();


var txtEmail = document.getElementById("txtEmail");
var txtPassword = document.getElementById("txtPassword");
var btnLogin = document.getElementById("btnLogin");
var btnLoadRegister = document.getElementById("btnLoadRegister");

var btnGoogle = document.getElementById("btnGoogle");


var divLogin = document.getElementById("divLogin");


//Register new User
btnLoadRegister.addEventListener('click', e => {    
    location.href = 'register.html';
});

//Listener Login on authorization
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

//Init Google Session
btnGoogle.addEventListener('click', e => {
    HideButton();
    firebase.auth().signInWithPopup(provider)
    .then( result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        
        return user;
        // ...
    })   
    .catch( error => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        ClearText();
        ShowButton();
        ErrorCodeMessage(error);
        // ...
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
//Clean Forms
function ClearText(){
    txtEmail.value = "";
    txtPassword.value = "";
}


//Error Code Message
function ErrorCodeMessage(err){
    var errorCode = err.code;        
    var errorMessage = err.message;
    Materialize.toast(errorMessage, 3000, 'rounded') ;
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



