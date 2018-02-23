


function writeUserDataPerson() {
    var btn = getID('btnUserData');
    ConexionUser = 0;
    if(getID('txtcid').value == ""){
      Materialize.toast('Por favor verifique los campos', 3000, 'rounded');
      return false;
    }
    Materialize.toast('Enviando actualización...', 2000, 'rounded');
    btn.classList.add('disabled');
    var sChild = 'competitor/' + UserUID + '/person'; 
    firebase.database().ref(sChild).set({
      cid: getID('txtcid').value,
      fullname: getID('txtfullname').value,
      sex : getID('cmbsex').value,
      date: getID('txtdate').value,
      phone: getID('txtphone').value,
      cel : getID('txtcel').value,
      location: getID('txtdir').value
    })
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
    firebase.database().ref("transferens").child(sChild).once('value')
    .then(function(snapshot) { 
      var table = getID('tblBody');
      var fil = '';
      var saldo = 0;
      snapshot.forEach(function(ele) {
        var key = ele.key;
        var transf  = ele.val();
        var text = 'Pendiente';
        var load = 'CARGA';
        var money = parseFloat(transf.money).toLocaleString();
        if(transf.status != undefined)text = transf.status;
        if(transf.load != undefined)load = 'RETIRO';
        fil += `<tr><td>${load}</td><td>${money}</td>
        <td><span class="new badge blue left" data-badge-caption="${text}"></span></td></tr>`;
        saldo += parseFloat(transf.money);
      });
      table.innerHTML = fil;  
      getID('spsaldo').innerHTML = saldo.toLocaleString();    
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

  
  var betsAll = [];
  var updates = {};
    
  for (let i = 0; i < fil.length; i++) {
    var obj = fil[i].cells;
    var number = obj[0].innerHTML.split(" ");
    var keyTag = obj[1].innerHTML + obj[2].innerHTML + number[0];
    var money = obj[3].innerHTML;
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
        status : false
    };
    betsAll.push(bets);
    
    
  }

  var refString = `/competitor/${UserUID}/bets/${UserPlayingActive}`;
  firebase.database().ref().child(refString).push(betsAll)
  .then(d => {
    console.log('Exito en tu jugada');
  });
  getID('btnGame').classList.add('hide');
  getID('tblBody').innerHTML = '';
  getID('spsaldo').innerHTML = '0';
  Materialize.toast('Te deseamos suerte', 3000, 'rounded');
  console.log(betsAll);
}
  
