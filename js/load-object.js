


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
      if(snapshot == null){
        Materialize.toast('Por favor recuerde actualizar sus datos', 3000, 'rounded');
      }else{        
        getID('cmbName').value = snapshot.name
        getID('cmbTypeBank').value = snapshot.type;
        getID('txtNumber').value = snapshot.number;        
      }      
    })
    .catch(e => {
      console.log('Cargando datos E: ', e)
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
    firebase.database().ref('transferens').child(UserUID).set({
      name : getID('cmbName').value,
      type : getID('cmbType').value,
      date : getID('txtDate').value,
      number : getID('txtNumber').value,
      money : getID('txtMoney').value,
      status: false
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
  
  //Loading data for Transferens
  function LoadUserDataTransferens(){  
    var sChild = UserUID;
    firebase.database().ref("transferens").child(sChild).once('value')
    .then(function(snapshot) {      
      return snapshot.val();
    })
    .then(snapshot => {      
      if(snapshot == null){
        Materialize.toast('Por favor recuerde actualizar sus datos', 3000, 'rounded');
      }else{        
        
      }      
    })
    .catch(e => {
      console.log('Cargando datos E: ', e)
    });
  }
