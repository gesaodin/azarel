


function writeUserDataPerson() {
    var btn = getID('btnUserData');
    ConexionUser = 0;
    if(getID('txtcid').value == ""){
      Materialize.toast('Por favor verifique los campos', 3000, 'rounded');
      return false;
    }
    Materialize.toast('Enviando actualización...', 2000, 'rounded');
    btn.classList.add('disabled');
    var person = {
      cid: getID('txtcid').value,
      fullname: getID('txtfullname').value,
      sex : getID('cmbsex').value,
      date: getID('txtdate').value,
      phone: getID('txtphone').value,
      cel : getID('txtcel').value,
      location: getID('txtdir').value
    };

    var sChild = 'competitor/' + UserUID + '/person'; 
    firebase.database().ref(sChild).set(person)
    .then(d => {
      Materialize.toast('Tus datos han sido actualizados', 4000, 'rounded');    
      btn.classList.remove('disabled');
    })
    .catch( e => {
      Materialize.toast('Ocurrio un error al enviar los datos', 4000, 'rounded');      
      btn.classList.remove('disabled');
    });  


}

//Loading for data personal
function LoadUserData(){

    var sChild = UserUID + '/person';
    firebase.database().ref("competitor").child(sChild).once('value')
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



//Write Data Bank for user
function writeUserDataBank() {
    var btn = getID('btnUserDataBank');
    
    if(getID('txtNumber').value == ""){
      Materialize.toast('Por favor verifique los campos', 3000, 'rounded');
      return false;
    }
    Materialize.toast('Enviando actualización...', 2000, 'rounded');
    btn.classList.add('disabled');
    var sChild = UserUID + '/bank'; 
    firebase.database().ref('competitor').child(sChild).set({
      name: getID('cmbName').value,
      type: getID('cmbType').value,
      number : getID('txtNumber').value
    })
    .then(d => {
      Materialize.toast('Tus datos han sido actualizados', 3000, 'rounded');
      btn.classList.remove('disabled');
    })
    .catch( e => {
      Materialize.toast('Ocurrio un error al enviar los datos', 3000, 'rounded');
      btn.classList.remove('disabled');
    });
  }
  
  
  //Loading data for bank
  function LoadUserDataBank(){  
    var sChild = UserUID + '/bank';
    
    firebase.database().ref("competitor").child(sChild).once('value')
    .then(function(snapshot) {      
      return snapshot.val();
    })
    .then(snapshot => {      
      console.log(snapshot);  
      if(snapshot == null){
        Materialize.toast('Por favor recuerde actualizar sus datos', 3000, 'rounded');
      }else{                
        $('#cmbName').val(snapshot.name);
        $('#cmbType').val(snapshot.type);
        getID('txtNumber').value = snapshot.number;        
      }     
    })
    .catch(e => {
      console.log('Error cargando: ');
    });
  }

  /**
   * Object Transferens
   * By Azarel
   */
//Write Data Transferens for user
function writeUserDataTransferens() {
    var btn = getID('btnUserDataTransferens');
    
    if(getID('txtNumber').value == ""){
      Materialize.toast('Por favor verifique los campos', 3000, 'rounded');
      return false;
    }
    Materialize.toast('Enviando actualización...', 2000, 'rounded');
    btn.classList.add('disabled');


    var newPostKey = firebase.database().ref().child('transferens').push().key;
    var transferens = {
      name : getID('cmbName').value,
      type : getID('cmbType').value,
      bank : getID('cmbNameTransferens').value,
      date : getID('txtDate').value,
      number : getID('txtNumber').value,
      datereal : firebase.database.ServerValue.TIMESTAMP,
      money : parseFloat(getID('txtMoney').value)
    };

    var updates = {};
    updates[`/transferens/${UserUID}/${newPostKey}`] = transferens;
    updates[`/competitor/${UserUID}/money/assigned/${newPostKey}`] = transferens;
  
    firebase.database().ref().update(updates)
    .then(d => {
      Materialize.toast('Saldo abonado a su monedero', 3000, 'rounded');
      getID('txtDate').value = '';
      getID('txtNumber').value = '';
      getID('txtMoney').value = '';
      btn.classList.remove('disabled');
    })
    .catch( e => {
      Materialize.toast('Ocurrio un error al enviar los datos', 3000, 'rounded');
      btn.classList.remove('disabled');
    });
  }
  
  //Loading data for Transferens
  function LoadUserDataTransferens(){  
    var sChild = UserUID;
    firebase.database().ref("competitor").child(sChild)
    .child('/money/assigned')
    .once('value')
    .then(function(snapshot) { 
      var table = getID('tblBody');
      var fil = '';
      var saldo = 0;
      var row = 0;
      snapshot.forEach(function(ele) {

        var key = ele.key;
        var transf  = ele.val();
        var text = SelectCaseStatus('P');
        var load = 'CARGA';
        var money = parseFloat(transf.money).toLocaleString();
        if(transf.status != undefined)text = SelectCaseStatus(transf.status);
        if(transf.load != undefined)load = 'RETIRO';
        if(transf.bets != undefined)load = 'APUESTA';
        row++;
        fil += `<tr><td style="display:none">${row}</td><td>${load}</td><td>${money}</td>
        <td>${text}</td></tr>`;
        saldo += parseFloat(transf.money);
      });
      table.innerHTML = fil;

      getID('spsaldo').innerHTML = saldo.toLocaleString();
      sortTable('tblMoney', 0);
    })
    .catch(e => {
      console.log('Cargando datos por erros', e);
    });
  }



  /**
   * Object Bets
   * By Azarel
   */
//Write Data Bets for user
function writeUserDataBets() {
  if(UserPlayingActive == ''){
    Materialize.toast('Intente mas tarde', 3000, 'rounded');
    return false;
  }
  
  // btn.classList.add('disabled');
  
 
  var fil = getID('tblBody');
  if(fil == null || fil.length == 0 )return false;
  fil = fil.rows;
  var total = 0;
  
  var betsAll = [];
  var updates = {};
    
  for (let i = 0; i < fil.length; i++) {
    var obj = fil[i].cells;
    var number = obj[0].innerHTML.split(" ");
    var keyTag = obj[1].innerHTML + obj[2].innerHTML + number[0];
    var money = parseFloat(obj[4].innerHTML);
    var betsTag = {
      uid: UserUID,
      money: money,      
      datereal : firebase.database.ServerValue.TIMESTAMP
    }
    var refString = `/bets/${UserPlayingActive}/${keyTag}`;
    var newKey = firebase.database().ref().child(refString).push(betsTag).key;
    
    var bets = {  
        datereal : firebase.database.ServerValue.TIMESTAMP,
        lottery : obj[1].innerHTML,
        hours: obj[2].innerHTML,
        number : number[0],
        detail : obj[0].innerHTML,
        money : money,
        key: newKey,                
        status : 'P'
    };
    total += money;
    betsAll.push(bets);
  }

 

  var refString = `/competitor/${UserUID}/bets/${UserPlayingActive}`;
  var ticket = firebase.database().ref().child(refString).push(betsAll).key;
  var deduction = {
    money : total * -1,
    ticket : ticket,
    bets: UserPlayingActive,
    datereal: firebase.database.ServerValue.TIMESTAMP,
    status : 'E'
  }
  var dedKey = firebase.database().ref('competitor')
  .child(UserUID).child('money/assigned').push(deduction).key;

  getID('btnGame').classList.add('hide');
  getID('tblBody').innerHTML = '';
  getID('spsaldo').innerHTML = '0';
  cleanSelect('cmbHours');
  getID('modAlertBody').innerHTML = `Te deseamos suerte en la jugada <br> ticket: ${ticket}`;
  $("#modAlert").modal("open");
  return true;
  
}
  
function LoadTickets(){
  var sChild = UserUID;
  var select = '<option value="00x">SELECCIONAR FECHA</option>';
  firebase.database().ref("competitor").child(sChild)
  .child('/bets')
  .once('value')
  .then(function(snapshot) {
    snapshot.forEach(function(ele) {
      var key = ele.key;
      var format = key.slice(6,8) + "-" + key.slice(4,6) + '-' + key.slice(0,4) ;
      select += `<option value='${key}'>${format}</option>`;
      
    });
    getID('cmbPlayins').innerHTML = select;
    cleanSelect('cmbPlayins');
  })
  .catch(e => {
    console.log('Cargando datos por erros', e);
  });
}

function LoadTicketsList(){
  var id = getID('cmbPlayins').value;
  var sChild = UserUID;
  var ul = '<ul class="collapsible" data-collapsible="accordion" id="ulBody">';
  var li = '';
  firebase.database().ref("competitor").child(sChild)
  .child('/bets/' + id)
  .once('value')
  .then(function(snapshot) {
    snapshot.forEach(function(ele) {      
      var key = ele.key;
      var cabecera = `<table class="bordered striped">
      <thead><tr><th>Jugada</th><th>Sorteo</th>
          <th>Monto</th><th>¿Premiado?</th></tr>
      </thead><tbody id="tblBody">`;
      var cuerpo = '';
      var total = 0;
      var fecha = '';
      var obj = ele.val();
      obj.forEach(o => {
        total += o.money;
        fecha = o.datereal;
        cuerpo += `<tr>
          <td>${o.detail}</td>
          <td>${o.lottery} ${o.hours}</td>
          <td>${parseFloat(o.money).toLocaleString()}</td>
          <td>${SelectCaseStatus(o.status)}</td>
        </tr>`;
      });
      var table = cabecera + cuerpo + `</tbody></table>`
      li = `<li>
        <div class="collapsible-header">
          <i class="material-icons">library_books</i>
          ${key} ( ${parseFloat(total).toLocaleString()} )
        </div>
        <div class="collapsible-body white" style="padding:2px">
        <p align='center'>Fecha y hora: ${GetTimeStamp(fecha)}</p>
        ${table}</div>
        </li>${li}`;
     
    });
    ul += li + '</ul>';
    getID('divTickets').innerHTML = ul;
    $('.collapsible').collapsible();
  })
  .catch(e => {
    console.log('Cargando datos por erros', e);
  });
}


function LoadMoneyTotal(){
  let starCountRef = database.ref('competitor')
  .child(sChid).child('money/assigned');
  starCountRef.once('value', function(snapshot) {  
  saldo = 0;
  snapshot.forEach(e => {
    var assigned = e.val();
    saldo += parseFloat(assigned.money);
  });
  if (getID('totalmoney') != undefined) getID('totalmoney').innerHTML = saldo.toLocaleString() + ' Bs.';
  UserMoney = saldo.toLocaleString() + ' Bs.';
  UserMoneyTotal = saldo;
  if (ConexionUser == 0){
    ConexionUser++;
  } else{
    Materialize.toast('Sus datos han sido actualizados', 3000, 'rounded');
  }
  });
}