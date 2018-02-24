
function activeData(doc){
    dbfirestore
    .collection('competitor')
    .doc(UserUID).set({active:true})
    .then(doc => {})
    .catch(e => {  
        Materialize.toast('Ocurrio un error al enviar los datos', 4000, 'rounded');                  
    })
}
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
      location: getID('txtdir').value,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    dbfirestore
        .collection('competitor')
        .doc(UserUID)
        .update({person:person})
        .then(doc => {
            Materialize.toast('Tus datos han sido actualizados', 4000, 'rounded');    
            btn.classList.remove('disabled');
        })
        .catch(e => {
            Materialize.toast('Ocurrio un error al enviar los datos', 4000, 'rounded');      
            btn.classList.remove('disabled');
        })

}

//Loading for data personal
function LoadUserData(){    
    dbfirestore.collection("competitor")
    .doc(UserUID) //.collection("person")
    .get()
    .then(snapshot => {
        var person = snapshot.data().person;   
        if(person == undefined){
            Materialize.toast('Por favor recuerde actualizar sus datos', 3000, 'rounded');
        }else{
            getID('imgCompetitor').src = UserPhoto;
            getID('txtcid').value = person.cid
            getID('txtfullname').value = person.fullname;
            getID('cmbsex').value = person.sex;
            getID('txtdate').value = person.date;
            getID('txtphone').value = person.phone;
            getID('txtcel').value = person.cel;
            getID('txtdir').value = person.location;      
        }
    }).catch(e => {
        activeData();
        Materialize.toast('Por favor recuerde actualizar sus datos', 3000, 'rounded');
       
    });
  }

  /**
   * **************************
   * Write Bank
   * **************************
   */

   //Write Data Bank for user
function writeUserDataBank() {
    var btn = getID('btnUserDataBank');
    
    if(getID('txtNumber').value == ""){
      Materialize.toast('Por favor verifique los campos', 3000, 'rounded');
      return false;
    }
    Materialize.toast('Enviando actualización...', 2000, 'rounded');
    btn.classList.add('disabled');

    var bank = {
        name: getID('cmbName').value,
        type: getID('cmbType').value,
        number : getID('txtNumber').value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    dbfirestore
        .collection('competitor')
        .doc(UserUID)
        .update({bank : bank})
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
    dbfirestore.collection("competitor")
    .doc(UserUID)
    .get()
    .then(snapshot => {
        var bank = snapshot.data().bank;   
        if(bank == undefined){
            Materialize.toast('Por favor recuerde actualizar sus datos', 3000, 'rounded');
        }else{            
            $('#cmbName').val(bank.name);
            $('#cmbType').val(bank.type);
            getID('txtNumber').value = bank.number;      
        }
    })
    .catch(e => {
        Materialize.toast('Por favor recuerde actualizar sus datos', 3000, 'rounded');
        activeData();
    });
  }



  /**
   * **************************
   * Write Transaction
   * **************************
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
    var transferens = {
        uid : UserUID,
        name : getID('cmbName').value,
        type : getID('cmbType').value,
        bank : getID('cmbNameTransferens').value,
        date : getID('txtDate').value,
        number : getID('txtNumber').value,
        timestamp : firebase.firestore.FieldValue.serverTimestamp(),
        money : parseFloat(getID('txtMoney').value),
        status : 'P'
    };
    dbfirestore.collection("transferens").
    add(transferens)
    .then(d => {
        var detail = {
            money : transferens.money,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            status : 'P',
            type:'A' //Assigned
        }
        dbfirestore.collection("competitor").doc(UserUID)
        .collection("money").doc(d.id).set(detail)
        .then(d => {
            Materialize.toast('Registro exitoso...', 2000, 'rounded');
        })
        .catch(e => {
            console.log('Error: ', e);
        })
    })
    .catch(e => {
        console.log('Error: ', e);
    })
  }
  
  //Loading data for Transferens
  function LoadUserDataTransferens(){  
    dbfirestore.collection("competitor")
    .doc(UserUID).collection("money")
    .get()
    .then(snapshot => {
        snapshot.forEach(element => {
            var table = getID('tblBody');
            var fil = '';
            var saldo = 0;
            var row = 0;
            snapshot.forEach(function(ele) {

            var key = ele.key;
            var transf  = element.data();
            var text = SelectCaseStatus('P');
            var load = 'CARGA';
            var money = parseFloat(transf.money).toLocaleString();
            if(transf.status != undefined)text = SelectCaseStatus(transf.status);
            if(transf.load != undefined)load = 'RETIRO';
            if(transf.bets != undefined)load = 'APUESTA';
            row++;
            fil += `<tr><td style="display:none">${row}</td><td>${load}</td><td>${money}</td>
            <td style="text-align:right">${text}</td></tr>`;
            saldo += parseFloat(transf.money);
            });
            table.innerHTML = fil;

            getID('spsaldo').innerHTML = saldo.toLocaleString();
            sortTable('tblMoney', 0);
        });
    })

  }
