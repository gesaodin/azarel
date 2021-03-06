/**
*
*/

//Configuración del sistema
class Config{
  construct(){
    this.IP = '';
    this.URL = '';
    this.IMG = '';
  }

}

class Ticket{
  construct(){
    this.date = '';
    this.lotery = '';
    this.hours = '';
    this.animals = '';
    this.monto = 0.00;
    this.status = false;
  }
  Total(){
    var cant = this.animalitos.length;
    return monto * cant;
  }
}

class Playing{
  construct(){
    this.datetime = '';
    this.ticket = new Ticket();
  }
}

class Transferens{
  construct(){
    this.uid = '';
    this.bank = '';
    this.datereport = '';
    this.date = '';    
    this.number = '';
    this.observation = '';
  }
}

class Bank{
  construct(){
    this.name = '';
    this.number = '';
    this.type = '';
  }
}

class Person {
  construct(){
    this.id = '';
    this.fullname = '';
    this.sex = '';
    this.date = '';
    this.location = '';
    this.state = '';
    this.phone = '';
    this.cel = '';
    this.email = '';
    this.bank = new Bank();

  }
}

let Ddd;
function operar(){
  getCollectiondb('bets/20180225')
  .then( d => {
    console.log('JSON ', d);
    for (key in d){
      var hijo = d[key]; 
      for (k in hijo){
        var obj = hijo[k];
        console.log('Monto: ', obj.money, ' UID: ', obj.uid);
      }
    }
    
  }).catch( e => {
    console.log(e);
  });
}

//Cargar Remotamente Objetos JSON
function getCollectiondb(collection){
  return new Promise( function (resolv, reject){
    firebase.auth().currentUser.getIdToken(true)
    .then(e => {
      var url = `https://azarel-1a865.firebaseio.com/${collection}.json?orderBy="$key"&startAt="LOTAC10AM"&endAt="LOTAC10AM\uf8ff"&auth=${e}`;
      var request = new Request(url, {
        method: 'GET',
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'text/json',
        })
      });
      fetch(request)
      .then((res) => {
        return res.json();
      })
      .then(r => {
        return resolv(r);
        console.log(r);
      })
      .catch((err) =>{
        
        console.log('Huy que error: ', err);
        return reject(err);
      });
    });
  });
  

  
}


//Cargar localmente archivos y escribir en un div
function LoadLocalFile(file, idDiv, func){
  $("#divClaims").hide();
  if(idDiv == undefined){
    idDiv = 'divCuerpo';
  } else if(idDiv == ''){
    idDiv = 'divCuerpo';      
  }
  getID(idDiv).innerHTML = LoadingViewHTML();
  var url = 'inc/' + file + ".html";
  var request = new Request(url, {
  	method: 'GET',
  	// mode: 'cors',
  	redirect: 'follow',
  	headers: new Headers({
  		'Content-Type': 'text/plain'
  	})
  });

  
  fetch(request)
  .then( res => { 
    return res.text() 
  })
  .then( data => {
    getID(idDiv).innerHTML = data;
    LoadComponentMaterialize();
    if(func != undefined)func();
    
  })
  .catch( err => {
    console.log(err);
  })
}

function LoadComponentMaterialize(){
  $('ul.tabs').tabs();
  $('select').material_select();
  $('.collapsible').collapsible();
  $(".dropdown-button").dropdown({
    constrainWidth: false, // Does not change width of dropdown to that of the activator
    hover: true, // Activate on hover
    gutter: 0, // Spacing from edge
    belowOrigin: false, // Displays dropdown below the button
    alignment: 'left', // Displays dropdown with edge aligned to the left of button
    stopPropagation: false // Stops event propagation
  });
  $('.datepicker').pickadate({
    regional: ['es'],
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 100, // Creates a dropdown of 15 years to control year,
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
    dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
    today: 'Hoy',
    //maxDate: today,
    clear: 'Limpiar',
    close: 'Ok',
    closeOnSelect: false, // Close upon selecting a date,
    format: 'dd/mm/yyyy'
  });
  $('.button-collapse').sideNav('hide');
}

function LoadComponentGeneral(){
  var pipsSlider = document.getElementById('test-slider');
  noUiSlider.create(pipsSlider, {
    range: {
        'min': 1,
        '10%': 10,
        '20%': 20,
        '30%': 30,
        '40%': 40,          
        '50%': 50,
        '60%': 60,
        '70%': 70,
        '80%': 80,
        '100%': 90,
        'max': 100
    },
    snap: true,
      start: [ 100 ],
      format: wNumb({
        decimals: 0
      }),
      pips: { mode: 'count', values: 5  }
  });
  
  pipsSlider.noUiSlider.on('update', function( values, handle ){
    getID('txtMonto').value = values[handle];
  });
  
  $('ul.tabs').tabs();
        $('.modal').modal();
        $('select').material_select();
        $('.button-collapse').sideNav({
            menuWidth: 260, // Default is 300
            //edge: 'right', // Choose the horizontal origin
            closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: true, // Choose whether you can drag to open on touch screens
            onOpen: function(el) { /* Do Stuff */ }, 
            onClose: function(el) { /* Do Stuff */ }
          }
        );
}

let pos = ['LOTAC', 'LGRAN', 'RULEACT', 'AZAN'];

let LOTAC = { 
  animals : [
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
  ],
  hours : [
    {key: 0, val : 9, des : "9:00 AM", opt: "9AM", turn: 'a.'}, 
    {key: 1, val : 10, des : "10:00 AM", opt: "10AM", turn: 'a.'}, 
    {key: 2, val : 11, des : "11:00 AM", opt: "11AM", turn: 'a.'}, 
    {key: 3, val : 12, des : "12:00 AM", opt: "12AM", turn: 'p.'}, 
    {key: 4, val : 1, des : "1:00 PM", opt: "1PM", turn: 'p.'}, 
    {key: 5, val : 3, des : "3:00 PM", opt: "3PM", turn: 'p.'}, 
    {key: 6, val : 4, des : "4:00 PM", opt: "4PM", turn: 'p.'}, 
    {key: 7, val : 5, des : "5:00 PM", opt: "5PM", turn: 'p.'}, 
    {key: 8, val : 6, des : "6:00 PM", opt: "6PM", turn: 'p.'}, 
    {key: 9, val : 7, des : "7:00 PM", opt: "7PM", turn: 'p.'} 
  ]
};

let LGRAN = { 
  animals : [
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
  ],
  hours : [
    {key: 0, val : 9, des : "9:00 AM", opt: "9AM", turn: 'a.'}, 
    {key: 1, val : 10, des : "10:00 AM", opt: "10AM", turn: 'a.'}, 
    {key: 2, val : 11, des : "11:00 AM", opt: "11AM", turn: 'a.'}, 
    {key: 3, val : 12, des : "12:00 AM", opt: "12AM", turn: 'p.'}, 
    {key: 4, val : 1, des : "1:00 PM", opt: "1PM", turn: 'p.'}, 
    {key: 5, val : 2, des : "2:00 PM", opt: "2PM", turn: 'p.'}, 
    {key: 6, val : 3, des : "3:00 PM", opt: "3PM", turn: 'p.'}, 
    {key: 7, val : 4, des : "4:00 PM", opt: "4PM", turn: 'p.'}, 
    {key: 8, val : 5, des : "5:00 PM", opt: "5PM", turn: 'p.'}, 
    {key: 9, val : 6, des : "6:00 PM", opt: "6PM", turn: 'p.'}, 
    {key: 10, val : 7, des : "7:00 PM", opt: "7PM", turn: 'p.'} 
  ]
};

let RULET = { 
  animals : [
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
  ],
  hours : [
    {key: 0, val : 9, des : "9:00 AM", opt: "9AM", turn: 'a.'}, 
    {key: 1, val : 10, des : "10:00 AM", opt: "10AM", turn: 'a.'}, 
    {key: 2, val : 11, des : "11:00 AM", opt: "11AM", turn: 'a.'}, 
    {key: 3, val : 12, des : "12:00 AM", opt: "12AM", turn: 'p.'}, 
    {key: 4, val : 1, des : "1:00 PM", opt: "1PM", turn: 'p.'}, 
    {key: 5, val : 3, des : "3:00 PM", opt: "3PM", turn: 'p.'}, 
    {key: 6, val : 4, des : "4:00 PM", opt: "4PM", turn: 'p.'}, 
    {key: 7, val : 5, des : "5:00 PM", opt: "5PM", turn: 'p.'}, 
    {key: 8, val : 6, des : "6:00 PM", opt: "6PM", turn: 'p.'}, 
    {key: 9, val : 7, des : "7:00 PM", opt: "7PM", turn: 'p.'} 
  ]
};

let AZAN = { 
  animals : [
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
    {key : "35",value : "JIRAFA"},{key : "36",value : "CULEBRA"},
    {key : "37",value : "ARAÑA"},{key : "38",value : "BÚHO"},
    {key : "39",value : "COLIBRI"},{key : "40",value : "CONEJO"},
    {key : "41",value : "FOCA"},{key : "42",value : "GRILLO"},
    {key : "43",value : "GUSANO"},{key : "44",value : "HORMIGA"},
    {key : "45",value : "LOBO"},{key : "46",value : "MARIPOSA"},
    {key : "47",value : "AVESTRUZ"},{key : "48",value : "PIRAÑA"}
  ],
  hours : [
    {key: 0, val : 9, des : "9:00 AM", opt: "9AM", turn: 'a.'}, 
    {key: 1, val : 10, des : "10:00 AM", opt: "10AM", turn: 'a.'}, 
    {key: 2, val : 11, des : "11:00 AM", opt: "11AM", turn: 'a.'}, 
    {key: 3, val : 12, des : "12:00 AM", opt: "12AM", turn: 'p.'}, 
    {key: 4, val : 1, des : "1:00 PM", opt: "1PM", turn: 'p.'}, 
    {key: 5, val : 3, des : "3:00 PM", opt: "3PM", turn: 'p.'}, 
    {key: 6, val : 4, des : "4:00 PM", opt: "4PM", turn: 'p.'}, 
    {key: 7, val : 5, des : "5:00 PM", opt: "5PM", turn: 'p.'}, 
    {key: 8, val : 6, des : "6:00 PM", opt: "6PM", turn: 'p.'}, 
    {key: 9, val : 7, des : "7:00 PM", opt: "7PM", turn: 'p.'} 
  ]
};