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
  .then((res) => res.text())
  .then((data) => {
    if(idDiv == undefined) idDiv = 'divCuerpo';
    getID(idDiv).innerHTML = data;
    LoadComponentMaterialize();
  })
  .catch((err) => {
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
