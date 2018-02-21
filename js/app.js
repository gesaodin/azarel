let pageNumber = 1;
let maxPageNumber = 5;
let UserAPIKey = '';
let UserAppName = '';
let UserPhoto = '';
let UserUID = '';

const limitAnimals = 12;
const pagBodyTableAnimals = getID('test-swipe-2');
const btnPerson = getID('btnPersona');
const lblNumberAnimalsModal = getID('numberAnimals');
const txtNumberAnimalsModal = getID('txtMonto');
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
    } else {
      location.href = "index.html";
    }
});


//On request permission
messaging.requestPermission()
.then( function() {
  console.log('Autorizando notificaciones');  
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
    console.log('Obtener Token: ', currentToken);
    if (currentToken) {
      //sendTokenToServer(currentToken);
      //updateUIForPushEnabled(currentToken);
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
    console.log('Token refreshed.');
    // Indicate that the new Instance ID token has not yet been sent to the
    // app server.
    //setTokenSentToServer(false);
    // Send Instance ID token to app server.
    //sendTokenToServer(refreshedToken);
    // ...
  })
  .catch(function(err) {
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
       <button class="btn waves-effect blue white-text darken-text-2" onclick="ChangeNumberPage()">Continuar
         <i class="material-icons right">send</i>
       </button>
     </div>
   </div>`;
  pagBodyTableAnimals.innerHTML = makeTable + page;
  $('#pag1').show();
}

function OpenModalAnimals(id, pos){
  var animal = animals[pos];
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


function writeUserData() {
    var btn = getID('btnUserData');
    
    if(getID('txtcid').value == ""){
      Materialize.toast('Por favor verifique los campos', 3000, 'rounded');
      return false;
    }
    btn.value = 'Cargando...';
    btn.disabled = true;
    firebase.database().ref('competitor/' + UserUID + '/person').set({
      cid: getID('txtcid').value,
      fullname: getID('txtfullname').value,
      sex : getID('cmbsex').value,
      date: getID('txtdate').value,
      phone: getID('txtphone').value,
      cel : getID('txtcel').value,
      location: getID('txtdir').value
    })
    .then(d => {
      Materialize.toast('Tus datos han sido actualizados', 3000, 'rounded');
      btn.value = 'Aceptar';
      btn.disabled = false;
    })
    .catch( e => {
      Materialize.toast('Ocurrio un error al enviar los datos', 3000, 'rounded');
      btn.value = 'Aceptar';
      btn.disabled = false;
    });
  
}

// const hrefPerson = getID('hrefPerson');
// hrefPerson.addEventListener('click', LoadUserData());

function LoadUserData(){
  console.log('competitor/' + UserUID);
  firebase.database().ref('competitor/' + UserUID + '/person').once('value')
  .then(function(snapshot) {
    
    return snapshot.val();
  })
  .then(snapshot => {
    
    if(snapshot == null){
      Materialize.toast('Por favor recuerde actualizar sus datos', 3000, 'rounded');
    }else{
      getID('imgCompetitor').src = UserPhoto;
      getID('txtcid').value = snapshot.cid
      getID('txtfullname').value = snapshot.fullname;
      getID('cmbsex').value = snapshot.sex;
      getID('txtdate').value = snapshot.date;
      getID('txtphone').value = snapshot.phone;
      getID('txtcel').value = snapshot.cel;
      getID('txtdir').value = snapshot.location;
    }
    
  })
  .catch(e => {
    console.log('Cargando datos E: ', e)
  });
  
}