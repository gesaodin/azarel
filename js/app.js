let pageNumber = 1;
let maxPageNumber = 6;
let MoneyType = 'Azr.';
let User = {};
let UserUID = '';
let UserMoney = '';
let UserMoneyTotal = 0;
let UserMoneyTotalDeferred = 0;
let ConexionUser = 0;
let CantTime = 0; //Cantidad de Sorteos 
let TokenNotification = '';
let MoneyGame = 0;
let UserPlayingActive = '';
let Prize = [];
let Settings = {};
let HTMLPrint = '';
let TicketPrint = '';
let MntAzr = 0;
let MntDolar = 0;
let AssignedMoney = 0;
const limitAnimals = 12;
const btnPerson = getID('btnPersona');
const lblEmail = getID('lblEmail');
const lblNameUser = getID('lblNameUser');
const hrfCerrar = getID('hrfCerrar');
const imgPhotoUser = getID('imgPhotoUser');

if (document.getElementById("qrcode") == undefined ){
  console.log("Desactivando visor QR");
}else{
  var qrcode = new QRCode(document.getElementById("qrcode"), {
    width : 160,
    height : 160
  });
}



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


let Animals = [];


firebase.auth().onAuthStateChanged(user => {
  if (user) {    
    var emailVerified = user.emailVerified;
    var isAnonymous = user.isAnonymous;
    var providerData = user.providerData;
    
  
    UserAPIKey = user.ca.a;
    lblEmail.innerHTML = user.email;
    lblNameUser.innerHTML = user.displayName;
    imgPhotoUser.src = user.photoURL; 
    UserUID = user.uid;
    $("#divLoading").hide();
    $("#divNav").show();
    LoadMoneyTotal();
    LoadClaims();
    readPlayingDay();
    loadUser();
    getSettings();
    SendTokenOnServer(user.email, TokenNotification);
  } else {
    location.href = "index.html";
  }
});

function LoadMoneyBets(){
  if (getID('totalmoney') != undefined) getID('totalmoney').innerHTML = UserMoney;
}

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
    Materialize.toast('Es posible que no reciba notificaciones', 3000);
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
  //localStorage.removeItem(`firebase:authUser:${UserAPIKey}`);
  firebase.auth().signOut();
  //location.href = "index.html";

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
  var pagBodyTableAnimals = getID('test-swipe-2');
  var makeTable = "";
  var min = 0;
  var max = limitAnimals;
  for (var i = 1; i < maxPageNumber; i++) {
    var pag = `<div class="row" id="pag${i}" style="display:none;padding-left:0px">`;
    var icon = "";
    if (max > ANIMALS.length) max = ANIMALS.length;
    for (var j = min; j < max; j++) {
      var animal = ANIMALS[j];
      icon += `
      <div class="col s3 m1" >
        <div class="cardAnimals cardAnimals-1" id="cardanimal${j}">
        <img src="img/${animal.key}.png" width="65px" 
          onclick="SelectModalAnimals('${animal.key}', ${j})">
        <div class="footcard" id="divfooter${j}" >${animal.value}</div>
        </div>
      </div>`;

    }
    min = max;
    max += limitAnimals;
    makeTable += pag + icon + "</div>";
  }

  var page = `<div class="row hide-on-large-only hide-on-med-and-up">
     <div>
       <a class="btn waves-effect blue left" onclick="OpenModalAnimals()" style="display:none" id="btnOpen"> 
        Apostar
       </a>      
       <a class="btn red right" onclick="ChangeNumberPage()"><i class="material-icons">arrow_forward</i></a>
     </div>
   </div>`;
  pagBodyTableAnimals.innerHTML = `<div class="col s12 hide-on-large-only hide-on-med-and-up">${makeTable}${page}</div>`;
  getID('totalmoney').innerHTML = UserMoney;
  $('#pag1').show();
  MakeTableAnimalsWeb(); 
}


//Agregar Escuchadores a los elementos
function MakeTableAnimalsWeb(){
  LoadTimes();
  var pagBodyTableAnimals = getID('test-swipe-2');
  var makeTable = "";
  var min = 0;
  var max = ANIMALS.length;
 
    var pag = `<div class="row" id="pagWeb" style="padding-left:0px">`;
    var icon = "";
    
    for (var j = min; j < max; j++) {
      var animal = ANIMALS[j];
      icon += `
      <div class="col m3 l1" >
        <div class="cardAnimals cardAnimals-1" id="cardAnimalW${j}">
        <img src="img/${animal.key}.png" width="65px" 
          onclick="SelectModalAnimals('${animal.key}', ${j})">
        <div class="footcard" id="divfooterw${j}" >${animal.value}</div>
        </div>
      </div>`;

    }

    makeTable += pag + icon + "</div>";


 
  pagBodyTableAnimals.innerHTML += `<div class="col m12 l12 hide-on-small-only">${makeTable}
    <div class="center">
      <a class="btn waves-effect blue right" onclick="OpenModalAnimals()" style="display:none" id="btnOpenW"> 
        Apostar
      </a>       
     </div>
  </div>`;
  // getID('totalmoney').innerHTML = UserMoney;
  $('#pagWeb').show();  
}
let ANIMALGAMES = [];
function SelectModalAnimals(id, pos){
  $('#btnOpen').show();
  $('#btnOpenW').show();
  var cant = $('#divfooterw'+pos).attr('class').split(' ');
  if ( cant.length > 1 ) {
    getID('divfooter'+pos).classList.remove('blue');
    getID('divfooterw'+pos).classList.remove('blue');
    var animalgamespos = -1;
    var status = false;
    for (let i = 0; i < ANIMALGAMES.length; i++) {
      const ipos = ANIMALGAMES[i];
      if (ipos == pos){    
        ANIMALGAMES.splice(i, 1);
      }
    }
  }else{
    //var animal = ANIMALS[pos];  
    getID('divfooter'+pos).classList.add('blue');
    getID('divfooterw'+pos).classList.add('blue');
    ANIMALGAMES.push(pos);

  }

}

function OpenModalAnimals(){
  var cant = ANIMALGAMES.length;
  if( cant == 0 ){
    Materialize.toast('Debe seleccionar una apuesta', 3000);
    return true;
  }
  var animal = ANIMALS[pos];
  var lblNumberAnimalsModal = getID('numberAnimals');
  var txtNumberAnimalsModal = getID('txtMonto');
  // lblNumberAnimalsModal.innerHTML = `${animal.key} - ${animal.value}`;
  lblNumberAnimalsModal.innerHTML = `Se han elejido ( ${cant} ) animalitos`
  //txtNumberAnimalsModal.value = '';
  $('#modAnimals').modal('open');
  $('#mdlPag1').show();
  
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
      Materialize.toast('Debe seleccionar sorteo', 3000);
      return true;
    }
  }
  $('ul.tabs').tabs('select_tab', id);
  HTMLPrint = '';
  TicketPrint = '';
}

function PrintWEB(){
  PrintTicket(HTMLPrint, TicketPrint);
  ChangeTabs('test-swipe-1', true);
  HTMLPrint = '';
  TicketPrint = '';
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
    Materialize.toast('Debe seleccionar sorteo', 3000);
    return true;
  }
  MoneyGame += (parseFloat(monto) * hours.length) * ANIMALGAMES.length;
  if(MoneyGame > UserMoneyTotal){
    Materialize.toast('Debe realizar un tramite de transferencia', 3000);
    MoneyGame = 0;
    cleanSelect('cmbHours');
    ChangeTabs('test-swipe-1', true);
    HTMLPrint = '';
    TicketPrint = '';
    cleanAnimals();
    return false;
  }

  var animals = getID('numberAnimals').innerHTML;
  var lottery = getID('cmbLottery').value;
  var fil = '';
  var table = getID('tblBody');
  for (var i = 0; i < hours.length; i++) {
    var elem = hours[i];
    for (let j = 0; j < ANIMALGAMES.length; j++) {

      const animal = getAnimalsKeyValue(ANIMALGAMES[j]);
      fil += `<tr><td>${animal}</td>
              <td>${lottery}</td>
              <td>${elem}</td>
              <td>${parseFloat(monto).toLocaleString()}</td>
              <td style="display:none">${parseFloat(monto)}</td>            
          </tr>`;  
    }
  }
  //console.log(fil);
  table.innerHTML += fil;  
  getID('spsaldo').innerHTML = MoneyGame.toLocaleString();
  getID('thTotal').innerHTML = MoneyGame.toLocaleString() + MoneyType;
  getID('btnGame').classList.remove('hide');
  Materialize.toast('Verifica tu lista de apuestas', 3000);
  cleanAnimals();
  return false;
}

function getAnimalsKeyValue(key){
  var name = '';
  for (let i = 0; i < ANIMALS.length; i++) {
    const animal = ANIMALS[i];
    if (key == i) name = animal.key + ' ' + animal.value;
  }
  return name;
}
function cleanAnimals(){
  for (let i = 0; i < ANIMALS.length; i++) {
    getID('divfooter'+i).classList.remove('blue');
    getID('divfooterw'+i).classList.remove('blue');
  }
  ANIMALGAMES = [];
  
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

var BanksUS = [
  {key: 0, code: "0", value: "---------------"},
  {key: 0, code: "paypal", value: "---------------"}
];

var BanksPERU = [
  {key: 0, code: "0", value: "---------------"},
  {key: 1, code: "4323", value: "BANCO DE COMERCIO"},
  {key: 2, code: "4202", value: "BANCO DE CRÉDITO DEL PERU"},
  {key: 3, code: "4538", value: "BANCO INTERAMERICANO DE FINANZAS (BIF)"},
  {key: 4, code: "4218", value: "BANCO FINANCIERO DEL PERÚ"},
  {key: 5, code: "4111", value: "BBVA BANCO CONTINENTAL"},
  {key: 6, code: "4507", value: "CITIBANK DEL PERÚ S.A."},
  {key: 7, code: "4103", value: "BANCO INTERNACIONAL DEL PERÚ (INTERBANK)"},
  {key: 8, code: "4249", value: "BANCO DE LA MICROEMPRESA MIBANCO"},
  {key: 9, code: "4209", value: "SCOTIABANK PERÚ S.A.A."}
];

function LoadCmbTransferens(){
  LoadCmbBank('cmbName');
  
  if (Settings.bank == undefined ){
    Materialize.toast('Fallo de conexión intente mas tarde', 3000);
    return false;
  }
  var Cmb = '';
  var select = $('#cmbNameTransferens');
  for (let i = 0; i < Settings.bank.length; i++) {
    const bank = Settings.bank[i];
    Cmb += `<option value="${bank.bank}">${getPosBankText(bank.bank)} - ${bank.number}</option>`;    
  }
  getID('cmbNameTransferens').innerHTML = Cmb;
  select.prop('selectedIndex', 0);  
  select.material_select(); 
  
}

function getPosBankText(code){
  for (let i = 0; i < Banks.length; i++) {    
    if(Banks[i].code == code){
      return Banks[i].value;            
    }
  }

}


function LoadCmbBank(id, ObjBanks){
  if (ObjBanks == undefined){ObjBanks = Banks;}
  var Cmb = '';
  var select = $('#'+ id);
  for (let i = 0; i < ObjBanks.length; i++) {
    const bank = ObjBanks[i];
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

let intPos = -1;
let TIME = 0;
let HOURS = [];
function SelectionLottery(){
  $("#lblLoadGames").show();
  switch ($("#cmbLottery").val()) {
    case 'LOTAC':
      ANIMALS = LOTAC.animals; 
      HOURS = LOTAC.hours;
      LoadTimes();     
      break;
    case 'RULET':
      ANIMALS = RULET.animals; 
      HOURS = RULET.hours;
      LoadTimes();
      break;
    case 'LGRAN':
      ANIMALS = LGRAN.animals; 
      HOURS = LGRAN.hours;
      LoadTimes();
      break;
    case 'AZAN':
      ANIMALS = AZAN.animals; 
      HOURS = AZAN.hours;
      LoadTimes();
      break;
    default:
      $("#lblLoadGames").hide();
      break;
  }
  if (intPos >= 0)MakeTableAnimals();
}



function LoadTimes(){  
  database.ref("/.info/serverTimeOffset").once('value', function(offset) {
    var offsetVal = offset.val() || 0;
    var serverTime = Date.now() + offsetVal;
    TIME = GetTimeStamp(serverTime);
    $("#lblLoadGames").hide();
    LoadHours();
  });
  $("#lblLoadGames").hide();
}

function LoadHours(){
  intPos = -1;
  if (TIME == 0 ){
    Materialize.toast('No hay conexión para las apuestas', 3000);
    return false;
  }

  var stime = TIME.split(' ');
  var shours = stime[1].split(':');
  var hrs = parseInt(shours[0]);
  var min =  parseInt(shours[1]);
  var turn = stime[2];
  
  

  for (let i = 0; i < HOURS.length; i++) {    
    if (hrs == HOURS[i].val && turn == HOURS[i].turn){
     intPos = HOURS[i].key+1;
    }
  }

  if( intPos == -1 ){
    if( hrs >= 7 && turn == 'a.'){ //Esta es la linea original
    //if( hrs >= 7 ){
      intPos = 0;
    }
    if( hrs == 2 && turn == 'p.' ){
      intPos = 5
    }
  }
  
  if(intPos >= 0 && min > 54 ) intPos++;
  LoadHoursCmb();
  
}

function LoadHoursCmb(){
  var Cmb = `<option value='00x' disabled>---------</option>`;
  if (intPos > -1 ){    
    for (let i = intPos; i < HOURS.length; i++) {      
      Cmb += `<option value="${HOURS[i].opt}">${HOURS[i].des}</option>`;
    }
    var select = $('#cmbHours');
    getID('cmbHours').innerHTML = Cmb;
    select.prop('selectedIndex', 0);  
    select.material_select(); 
    
  }

  // 
}
function LoadIndicator(){
  getID('bolivar').innerHTML = Settings.limit.bolivar;
  getID('sol').innerHTML = Settings.limit.sol;
  getID('dolar').innerHTML = Settings.limit.dolar;
  getID('solbolivar').innerHTML = Settings.limit.solbolivar;
}

function TotalAzarel(){
  var azr =  parseFloat(getID('txtMoney').value) * SelMountMoney(getID('cmbMoney').value);
  $('#txtAzarel').val(azr);
}

function SelectionMontoRetiro(){
  var azr =  parseFloat(getID('txtMoneyR').value) / SelMountMoney(getID('cmbMoneyR').value);
  $('#txtAzarelR').val(azr);  
}

function SelectMoneyRemesa(){
  var azr =  parseFloat(getID('txtMoney').value) * Settings.limit.solbolivar;
  $('#txtMoneyTransf').val(azr); 
}

function PrintTicket(HTML, tickeID){
  var ventana = window.open("", "_blank");
  HTML = `<center><script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>${HTML}  
  </center>
  <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
  <script type="text/javascript" src="js/jsbarcode.code128.min.js"></script>
  <script>
      $("#barcode").JsBarcode("${tickeID}",{width:0.8,height:22,fontSize: 12});
  </script>`;
  ventana.document.write(HTML);    
  ventana.document.head.innerHTML = `<style>
  @charset "utf-8";
  @page {
      margin: 0cm;
      size: 5cm 20cm;
  }
  body {
    margin: 0px;
    font-family: Arial, Helvetica, sans-seri;
    font-size: 8px;
    font-weight: normal;
  }
  table {
      border: 0px solid black;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8px;
  }
  </style>`;

}

