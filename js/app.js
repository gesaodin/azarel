let pageNumber = 1;
let maxPageNumber = 5;
let UserAPIKey = '';
let UserAppName = '';
let UserPhoto = '';
let UserUID = '';
let UserMoney = '';
let UserMoneyTotal = 0;
let ConexionUser = 0;
let CantTime = 0; //Cantidad de Sorteos 
let TokenNotification = '';
let MoneyGame = 0;
let UserPlayingActive = '';

let Prize = [];

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
var dbfirestore = firebase.firestore();


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
      var emailVerified = user.emailVerified;
      var isAnonymous = user.isAnonymous;
      var providerData = user.providerData;
      var saldo = 0;
      UserPhoto = user.photoURL;
      UserAPIKey = user.ca.a;
      lblEmail.innerHTML = user.email;
      lblNameUser.innerHTML = user.displayName;
      imgPhotoUser.src = photoURL; 
      UserUID = user.uid;
      $("#divLoading").hide();
      $("#divNav").show();
      LoadMoneyTotal();
      LoadClaims();
      readPlayingDay();
      SendTokenOnServer(email, TokenNotification);
    } else {
      location.href = "index.html";
    }
});



function readNotification(){
  var ref = database.ref('notification')
  .child(UserUID)
  .limitToLast(1)
  .once(d => {
    $("#divNotifications").show();
  })
  .then(d => {

  })
  .catch(e => {
    console.log('Error de notificaciones: ', e);
  });

}

function readPlayingDay(){
  var ref = firebase.database().ref('playing')
  .limitToLast(1);
  ref.once('value', e => {    
    e.forEach(element => {
      var key = element.key;
      var obj = element.val();
      UserPlayingActive = obj.date;  
    });
    
  });
}

//On request permission
messaging.requestPermission()
.then( function() {  
  TokenNotification = messaging.getToken();
  return messaging.getToken();
})
.then(token => {
  console.log('Tokens notifications verificado: ');
})
.catch(function(err) {
  console.log('No se autorizarón las notificaciones.', err);
});

//On messaging realtime
messaging.onMessage(function(payload){
  console.log('onMessaging : ', payload);
});

function SendTokenOnServer(email, token){
  
  firebase.database().ref('chat').child(UserUID).set({
    email : email,
    token : token,
    status: false
  }).catch( e => {
    Materialize.toast('Es posible que no reciba notificaciones', 3000, 'rounded');
  });
}


// Get Instance ID token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
messaging.getToken()
.then(function(currentToken) {
  if (currentToken) {   
    TokenNotification = currentToken;
  } else { 
    console.log('No Instance ID token available. Request permission to generate one.'); 
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
    SendTokenOnServer(refreshedToken);
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

function LoadHomeAll(){
  LoadMoneyTotal();
  LoadClaims();
  readPlayingDay();
}

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
    var pag = `<div class="row" id="pag${i}" style="display:none;padding-left:0px">`;
    var icon = "";
    if (max > animals.length) max = animals.length;
    for (var j = min; j < max; j++) {
      var animal = animals[j];
      icon += `
      <div class="col s3 m1">
        <div class="cardAnimals cardAnimals-1 ">
        <img src="img/${animal.key}.jpeg" width="65px" 
          onclick="OpenModalAnimals('${animal.key}', ${j})">
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
  pagBodyTableAnimals.innerHTML = `<div class="col s12 m12 l12">${makeTable}${page}</div>`;
  getID('totalmoney').innerHTML = UserMoney;
  $('#pag1').show();
  console.log("Pasando...");
  

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


function ChangeTabs(id, val){
  if (val == undefined){
    var hours = getValuesSelectMultiple('cmbHours');
    if(hours.length == 0){
      Materialize.toast('Debe seleccionar sorteo', 3000, 'rounded');
      return true;
    }
  }
  $('ul.tabs').tabs('select_tab', id);

}

function ShowDisplayModal(){
  $('#mdlPag2').show();
  $('#mdlPag1').hide();
}


function AddGame(){
  var monto = getID('txtMonto').value;
  if ( monto == '')return true;
  var hours = getValuesSelectMultiple('cmbHours');
  if(hours.length == 0){
    Materialize.toast('Debe seleccionar sorteo', 3000, 'rounded');
    return true;
  }
  MoneyGame = MoneyGame + (parseFloat(monto) * hours.length);
  var animals = getID('numberAnimals').innerHTML;
  var lottery = getID('cmbLottery').value;
  var fil = '';
  var table = getID('tblBody');
  for (var i = 0; i < hours.length; i++) {
    var elem = hours[i];
    
    fil += `<tr><td>${animals}</td>
              <td>${lottery}</td>
              <td>${elem}</td>
              <td>${parseFloat(monto).toLocaleString()}</td>
              <td style="display:none">${parseFloat(monto)}</td>            
          </tr>`;
  }
  //console.log(fil);
  table.innerHTML += fil;  
  getID('spsaldo').innerHTML = MoneyGame.toLocaleString();
  getID('thTotal').innerHTML = MoneyGame.toLocaleString() + " Bs.";
  getID('btnGame').classList.remove('hide');
  Materialize.toast('Verifica tu lista de apuestas', 3000, 'rounded');
  return false;
}

function getValuesSelectMultiple(id){
  var x = getID(id);
  var hours = [];
  for (var i = 0; i < x.options.length; i++) {
     if(x.options[i].selected == true && x.options[i].value != "00x"){
          hours.push(x.options[i].value);
      }
  }
  return hours;
}

function cleanSelect(id){
  var select = $('#'+ id);
  select.prop('selectedIndex', 0);
  select.material_select();  
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

function LoadIndeterminate(){
  return `<div class="progress">
      <div class="indeterminate"></div>
    </div>`;
}

function GetTimeStamp(dateString){
  if(dateString != undefined) {  
    var dateString = new Date(dateString);
    return dateString.toLocaleString();
  }else{    
    return (new Date()).toLocaleString();
  } 
}

function GetDateStampServer(d){
  var offsetRef = firebase.database().ref(".info/serverTimeOffset");
  offsetRef.on("value", function(snap) {
    var offset = snap.val();
    var d = new Date().getTime() + offset;
    console.log(GetTimeStamp(d));
  });
}

function SelectCaseStatus(key){
  var status = '';
  switch (key) {
    case 'P':
      status = `<span class="new badge blue rigth" data-badge-caption="Pendiente"></span>`;
      break;
    case 'A':
      status = `<span class="new badge green rigth" data-badge-caption="Aprobado"></span>`;
      break;
    case 'R':
      status = `<span class="new badge red rigth" data-badge-caption="Rechazado"></span>`;
      break;
    case 'E':
      status = `<span class="new badge orange rigth" data-badge-caption="Ejecutada"></span>`;
      break;
    case 'G':
      status = `<span class="new badge green rigth" data-badge-caption="Premiado"></span>`;
      break;
    case 'N':
      status = `<span class="new badge red rigth" data-badge-caption="No Ganó"></span>`;
      break;
    default:
      status = `<span class="new badge blue rigth" data-badge-caption="Sin Premio"></span>`;
      break;
  }
  return status;
}


function AssignedBank(){
  $("#txtNumber").val($("#cmbName").val());
}


var Banks = [
  {key: 0, code: "0", value: "---------------"},
  {key: 1, code: "0156", value: "100%BANCO"},
  {key: 2, code: "0196", value: "ABN AMRO BANK"},
  {key: 3, code: "0172", value: "BANCAMIGA BANCO MICROFINANCIERO, C.A."},
  {key: 4, code: "0171", value: "BANCO ACTIVO BANCO COMERCIAL, C.A."},
  {key: 5, code: "0166", value: "BANCO AGRICOLA"},
  {key: 6, code: "0175", value: "BANCO BICENTENARIO"},
  {key: 7, code: "0128", value: "BANCO CARONI, C.A. BANCO UNIVERSAL"},
  {key: 8, code: "0164", value: "BANCO DE DESARROLLO DEL MICROEMPRESARIO"},
  {key: 9, code: "0102", value: "BANCO DE VENEZUELA S.A.I.C.A."},
  {key: 10, code: "0114", value: "BANCO DEL CARIBE C.A."},
  {key: 11, code: "0149", value: "BANCO DEL PUEBLO SOBERANO C.A."},
  {key: 12, code: "0163", value: "BANCO DEL TESORO"},
  {key: 13, code: "0176", value: "BANCO ESPIRITO SANTO, S.A."},
  {key: 14, code: "0115", value: "BANCO EXTERIOR C.A."},
  //{key: 0, code: "0003", value: "BANCO INDUSTRIAL DE VENEZUELA."},
  {key: 15, code: "0173", value: "BANCO INTERNACIONAL DE DESARROLLO, C.A."},
  {key: 16, code: "0105", value: "BANCO MERCANTIL C.A."},
  {key: 17, code: "0191", value: "BANCO NACIONAL DE CREDITO"},
  {key: 18, code: "0116", value: "BANCO OCCIDENTAL DE DESCUENTO."},
  {key: 19, code: "0138", value: "BANCO PLAZA"},
  {key: 20, code: "0108", value: "BANCO PROVINCIAL BBVA"},
  {key: 21, code: "0104", value: "BANCO VENEZOLANO DE CREDITO S.A."},
  {key: 22, code: "0168", value: "BANCRECER S.A. BANCO DE DESARROLLO"},
  {key: 23, code: "0134", value: "BANESCO BANCO UNIVERSAL"},
  {key: 24, code: "0177", value: "BANFANB"},
  {key: 25, code: "0146", value: "BANGENTE"},
  {key: 26, code: "0174", value: "BANPLUS BANCO COMERCIAL C.A"},
  {key: 27, code: "0190", value: "CITIBANK."},
  {key: 28, code: "0121", value: "CORP BANCA."},
  {key: 29, code: "0157", value: "DELSUR BANCO UNIVERSAL"},
  {key: 30, code: "0151", value: "FONDO COMUN"},
  {key: 31, code: "0601", value: "INSTITUTO MUNICIPAL DE CR&#201;DITO POPULAR"},
  {key: 32, code: "0169", value: "MIBANCO BANCO DE DESARROLLO, C.A."},
  {key: 33, code: "0137", value: "SOFITASA"}
];

function LoadCmbTransferens(){
  LoadCmbBank('cmbName');
  LoadCmbBank('cmbNameTransferens');
}


function LoadCmbBank(id){
  
  var Cmb = '';
  var select = $('#'+ id);
  for (let i = 0; i < Banks.length; i++) {
    const bank = Banks[i];
    Cmb += `<option value="${bank.code}">${bank.value}</option>`;    
  }
  getID(id).innerHTML = Cmb;
  select.prop('selectedIndex', 0);  
  select.material_select(); 
}

function getPosBank(code, id){
  var key = 0;
  for (let i = 0; i < Banks.length; i++) {    
    if(Banks[i].code == code){
      var select = $("#" + id);
      select.prop('selectedIndex',  Banks[i].key);  
      select.material_select(); 
      return false;
    }
  }
  cleanSelect(id);
}

function getPosCmb(value, id){
  var select = $("#" + id);
  select.prop('selectedIndex', value);  
  select.material_select(); 
}
