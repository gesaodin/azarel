let pageNumber = 1;
let maxPageNumber = 5;
let UserAPIKey = '';
let UserAppName = '';
let UserPhoto = '';
let UserUID = '';
let ConexionUser = 0;
let CantTime = 0; //Cantidad de Sorteos 

const limitAnimals = 12;
const btnPerson = getID('btnPersona');
const lblEmail = getID('lblEmail');
const lblNameUser = getID('lblNameUser');
const hrfCerrar = getID('hrfCerrar');
const imgPhotoUser = getID('imgPhotoUser');

var config = {  
  apiKey: "AIzaSyCtWgfZWdUQVRyC0W1NdlV3Zx9Q16I6Nf4",
  authDomain: "azarel-1a865.firebaseapp.com",
  databaseURL: "https://azarel-1a865.firebaseio.com",
  projectId: "azarel-1a865",
  storageBucket: "azarel-1a865.appspot.com",
  messagingSenderId: "963834795291"
};


firebase.initializeApp(config);

// Get a reference to message
const messaging = firebase.messaging();
// Get a reference to the database service
var database = firebase.database();



const animals = [
    {key : "0",value : "DELFIN"},{key : "00",value : "BALLENA"},
    {key : "01",value : "CARNERO"},{key : "02",value : "TORO"},
    {key : "03",value : "CIEMPIES"},{key : "04",value : "ALACRAN"},
    {key : "05",value : "LEON"},{key : "06",value : "RANA"},
    {key : "07",value : "PERICO"},{key : "08",value : "RATON"},
    {key : "09",value : "AGUILA"},{key : "10",value : "TIGRE"},
    {key : "11",value : "GATO"},{key : "12",value : "CABALLO"},
    {key : "13",value : "MONO"},{key : "14",value : "PALOMA"},
    {key : "15",value : "ZORRO"},{key : "16",value : "OSO"},
    {key : "17",value : "PAVO"},{key : "18",value : "BURRO"},
    {key : "19",value : "CHIVO"},{key : "20",value : "COCHINO"},
    {key : "21",value : "GALLO"},{key : "22",value : "CAMELLO"},
    {key : "23",value : "CEBRA"},{key : "24",value : "IGUANA"},
    {key : "25",value : "GALLINA"},{key : "26",value : "VACA"},
    {key : "27",value : "PERRO"},{key : "28",value : "ZAMURO"},
    {key : "29",value : "ELEFANTE"},{key : "30",value : "CAIMAN"},
    {key : "31",value : "LAPA"},{key : "32",value : "ARDILLA"},
    {key : "33",value : "PESCADO"},{key : "34",value : "VENADO"},
    {key : "35",value : "JIRAFA"},{key : "36",value : "CULEBRA"}
  ];


  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      UserPhoto = photoURL;
      UserAPIKey = user.ca.a;
      lblEmail.innerHTML = email;
      lblNameUser.innerHTML = displayName;
      imgPhotoUser.src = photoURL; 
      UserUID = uid;
      $("#divLoading").hide();
      $("#divNav").show();
      var sChid = UserUID;
      let starCountRef = firebase.database().ref('competitor').child(sChid);
      starCountRef.on('value', function(snapshot) {       
        if (ConexionUser == 0){
          ConexionUser++;
        } else{
          Materialize.toast('Sus datos han sido actualizados', 3000, 'rounded');
        }
      });
    } else {
      location.href = "index.html";
    }
});


//On request permission
messaging.requestPermission()
.then( function() {  
  return messaging.getToken();
})
.then(token => {
  console.log('Tokens notifications: ', token);
})
.catch(function(err) {
  console.log('No se autorizarón las notificaciones.', err);
});

//On messaging realtime
messaging.onMessage(function(payload){
  console.log('onMessaging : ', payload);
});



// Get Instance ID token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
messaging.getToken()
.then(function(currentToken) {
  // console.log('Obtener Token: ', currentToken);
  if (currentToken) {
    //sendTokenToServer(currentToken);
    //updateUIForPushEnabled(currentToken);
    console.log('Obteniendo el Tokens: ', currentToken);
  } else {
    // Show permission request.
    console.log('No Instance ID token available. Request permission to generate one.');
    // Show permission UI.
    //updateUIForPushPermissionRequired();
    //setTokenSentToServer(false);
  }
})
.catch(function(err) {
  console.log('An error occurred while retrieving token. ', err);
  //showToken('Error retrieving Instance ID token. ', err);
  //setTokenSentToServer(false);
});


 // Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(function() {
  messaging.getToken()
  .then(function(refreshedToken) {
    console.log('Token de mensajes actualizado.');
    // Indicate that the new Instance ID token has not yet been sent to the
    // app server.
    //setTokenSentToServer(false);
    // Send Instance ID token to app server.
    //sendTokenToServer(refreshedToken);
    // ...
  })
  .catch(err => {
    console.log('Unable to retrieve refreshed token ', err);
    //showToken('Unable to retrieve refreshed token ', err);
  });
});




//Close session for app
hrfCerrar.addEventListener('click', e => {
  localStorage.removeItem(`firebase:authUser:${UserAPIKey}`);
});

//serviceWorker 
if('serviceWorker' in navigator){
  window.addEventListener('load', function(){
      navigator.serviceWorker.register('js/sw.js').then(function(reg){
        console.log("serviceWorker registrado ", reg.scope);
      }).catch(function (err){
        console.log("serviceWorker ha fallado: ", err);
      });
  })
}

//Agregar Escuchadores a los elementos
function MakeTableAnimals(){
  console.log('Cargando animalitos...');
  var pagBodyTableAnimals = getID('test-swipe-2');
  var makeTable = "";
  var min = 0;
  var max = limitAnimals;
  for (var i = 1; i < maxPageNumber; i++) {
    var pag = `<div class="row" id="pag${i}" style="display:none">`;
    var icon = "";
    if (max > animals.length) max = animals.length;
    for (var j = min; j < max; j++) {
      var animal = animals[j];
      icon += `
      <div class="col s3 m1">
        <div class="cardAnimals cardAnimals-1 ">
        <img src="img/${animal.key}.jpeg" width="65px" onclick="OpenModalAnimals('${animal.key}', ${j})">
        <div class="footcard ">${animal.value}</div>
        </div>
      </div>`;

    }
    min = max;
    max += limitAnimals;
    makeTable += pag + icon + "</div>";
  }

  var page = `<div class="row">
     <div class="center">       
       <a class="btn-floating red" onclick="ChangeNumberPage()"><i class="material-icons">send</i></a>
     </div>
   </div>`;
  pagBodyTableAnimals.innerHTML = makeTable + page;
  $('#pag1').show();
}

function OpenModalAnimals(id, pos){
  var animal = animals[pos];
  var lblNumberAnimalsModal = getID('numberAnimals');
  var txtNumberAnimalsModal = getID('txtMonto');
  lblNumberAnimalsModal.innerHTML = `${animal.key} - ${animal.value}`;
  txtNumberAnimalsModal.value = '';
  $('#modAnimals').modal('open');
  $('#mdlPag1').show();
  $('#mdlPag2').hide();
}

function ChangeNumberPage(){
  var status = false;
  var total = maxPageNumber - 1;
  if(pageNumber == total) {
    pageNumber = 1;
    $('#pag1').show();
    $('#pag' + total).hide();
  }else{
    for (var i = 1; i < maxPageNumber; i++) {
      if (i != pageNumber){
        status = true;
        var pag = pageNumber + 1;
        $('#pag' + pag).show();
      }else{
        $('#pag' + pageNumber).hide();
      }
    }
    if (status){
      pageNumber++;
    }
  }
}


function ChangeTabs(id){
  $('ul.tabs').tabs('select_tab', id);
}

function ShowDisplayModal(){
  $('#mdlPag2').show();
  $('#mdlPag1').hide();
}





function NotificationDiscovery(){
  
}

function LoadingViewHTML(){
  return `<center>
    <div class="section" id="divLoginBody">
        <div class="section"></div>
        <div class="preloader-wrapper big active">
            <div class="spinner-layer spinner-green-only">
              <div class="circle-clipper left">
                <div class="circle"></div>
              </div><div class="gap-patch">
                <div class="circle"></div>
              </div><div class="circle-clipper right">
                <div class="circle"></div>
              </div>
            </div>
          </div><br>
      Cargando...
    </div>
    </center>
  `;
  
}