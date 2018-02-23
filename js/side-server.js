
function writePlayingDay(d) {
    if (d == undefined)return false;
    Materialize.toast('Enviando actualización...', 2000, 'rounded');    
    firebase.database().ref('playing').push({
        date: d,
        orderby: firebase.database.ServerValue.TIMESTAMP,
        status: true
    })
    .then(d => {
      Materialize.toast('Tus datos han sido actualizados', 4000, 'rounded');    
    })
    .catch( e => {
      Materialize.toast('Ocurrio un error al enviar los datos', 4000, 'rounded');      
    });  
}

