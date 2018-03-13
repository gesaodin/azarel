
/**
 *  
 * Update:
 */
 class App {
 	constructor(){
    this.ANIMALS = [
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
    this.BANKS = [
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
 	}

 	init(){
 		$("#divLoading").hide();
 		$("#divNav").show();		
 	}

 	SelectStatus(key){
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

const messaging = firebase.messaging();
var dbfirestore = firebase.firestore();

 let app = new App();
 app.init();
 

//Agregar Escuchadores a los elementos
function MakeTableAnimalsWeb(){
  console.log('Cargando animalitos Web...');
  var pagBodyTableAnimals = getID('divMakeAninmals');
  var makeTable = "";
  var min = 0;
  var max = app.ANIMALS.length;
  
  var pag = `<div class="row" id="pagWeb" style="padding-left:0px">`;
  var icon = "";
  for (var j = min; j < max; j++) {
    var animal = app.ANIMALS[j];
    icon += `
    <div class="col m3 l1 ">
      <div class="cardAnimals cardAnimals-1 ">
      <img src="img/${animal.key}.jpeg" width="65px" onclick="OpenModalAnimals('${animal.key}', ${j})">
      <div class="footcard ">${animal.value}</div>
      </div>
    </div>`;
  }
    makeTable += pag + icon + "</div>";
    pagBodyTableAnimals.innerHTML += `<div class="col m12 l12 hide-on-small-only">${makeTable}</div>`;
    $('#pagWeb').show();  
}
function OpenModalAnimals(id, pos){
  var fecha = getID('txtDate');
  var sorteo = $('#cmbHours option:selected');
  var loteria = $('#cmbLottery option:selected');
  if(fecha.value == '' || sorteo.val() == '00x' || loteria.val() == '00x'){
    Materialize.toast("Todos los campos son obligatorios", 3000, 'rounded');
    return false;
  }
  var animal = app.ANIMALS[pos];
  var bodyContents = getID('bodyContents'); 
  $("#ngames").val(animal.key);
  var msg = `<h5>Asignando premio</h5><br>
    Usted ha seleccionado: 
    <br>Fecha  : <label>${fecha.value}</label>
    <br>Loteria: <label>${loteria.text()}</label>
    <br>Sorteo : <label>${sorteo.text()}</label>.<br><br>
    ¿Está seguro que desea premiar el numero <label id='lblPremio'>${animal.key} - ${animal.value}</label>?
  `
  bodyContents.innerHTML = msg;

  $('#modAnimals').modal();
  $('#modAnimals').modal('open');
  $('#mdlPag1').show();
  $('#mdlPag2').hide();
}


function LoadCmbBank(id){ 
  var Cmb = '';
  var select = $('#'+ id);
  for (let i = 0; i < BANKS.length; i++) {
    const bank = BANKS[i];
    Cmb += `<option value="${bank.code}">${bank.value}</option>`;    
  }
  getID(id).innerHTML = Cmb;
  select.prop('selectedIndex', 0);  
  select.material_select(); 
}

function getPosBank(code, id){
  var key = 0;
  for (let i = 0; i < BANKS.length; i++) {    
    if(BANKS[i].code == code){
      var select = $("#" + id);
      select.prop('selectedIndex',  BANKS[i].key);  
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