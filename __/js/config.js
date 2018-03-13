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
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 100, // Creates a dropdown of 15 years to control year,
    today: 'Hoy',
    clear: 'Limpiar',
    close: 'Ok',
    format: 'dd/mm/yyyy',
    closeOnSelect: false // Close upon selecting a date,
  });
  $('.button-collapse').sideNav('hide');

}

function LoadComponentGeneral(){
  var pipsSlider = document.getElementById('test-slider');
  noUiSlider.create(pipsSlider, {
    range: {
        'min': 100,
        '10%': 200,
        '20%': 300,
        '30%': 400,
        '40%': 500,          
        '50%': 600,
        '60%': 700,
        '70%': 800,
        '80%': 900,
        '100%': 1000,
        'max': 1200
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

