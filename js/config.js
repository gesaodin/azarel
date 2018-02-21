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
    this.oid = '';
    this.date = '';
    this.lotery = '';
    this.times = [];
    this.animals = [];
    this.monto = 0.00;
  }
  Total(){
    var cant = this.animalitos.length;
    return monto * cant;
  }
}

class Playing{
  construct(){
    this.uid = '';
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



//Cargar Remotamente Objetos JSON
function LoadRemoteJson(file, idDiv){
  fetch(url)
  .then((res) => res.json())
  .then((data) => {
    return data;
  })
  .catch((err)=> console.log(err));

}


//Cargar localmente archivos y escribir en un div
function LoadLocalFile(file, idDiv){
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
    if(idDiv == undefined) idDiv = 'divCuerpo';
    getID(idDiv).innerHTML = data;
    LoadComponentMaterialize();
  })
  .catch( err => {
    console.log(err);
  })
}

function LoadComponentMaterialize(){
  $('select').material_select();
  $('.carousel.carousel-slider').carousel({fullWidth: true});
  $('ul.tabs').tabs();
  console.log("Cargando scripts.");
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
    closeOnSelect: false // Close upon selecting a date,
  });
  $('.button-collapse').sideNav('hide');
}
