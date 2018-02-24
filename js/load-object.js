


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
    firebase.database().ref('transferens').child(UserUID).push({
      name : getID('cmbName').value,
      type : getID('cmbType').value,
      bank : getID('cmbNameTransferens').value,
      date : getID('txtDate').value,
      number : getID('txtNumber').value,
      datereal : Date.now(),
      money : parseFloat(getID('txtMoney').value)
    })
    .then(d => {
      Materialize.toast('Saldo abonado a su monedero', 3000, 'rounded');
      firebase.database().ref('competitor').child(UserUID).child('money/assigned').push({
        value : parseFloat(getID('txtMoney').value),
        datereal : Date.now()
      }).catch(d => console.log('Error asignando saldo'));
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


