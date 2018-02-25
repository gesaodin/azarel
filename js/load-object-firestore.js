
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

  function addNewData(){
//     var citiesRef = dbfirestore.collection("competitor").doc(UserUID).collection("bets");

//     var query = citiesRef.where("key", "==", "wD2idEhWvdmELCmGIZ1w");
//     query.get().then(d => {
//         console.log(d);
//         d.forEach(element => {
//          console.log('Element ', element.id);   
//         });
//     });  
    var dateplay = '20180225';
    var playing = 'LOTAC9AM10';
    dbfirestore.collection('bets').doc(dateplay)
    .collection(playing)
    .get().then( doc => {
        var winnerAll = [];        
        var total = 0;
        
        doc.forEach(d => {
            var money = d.data().bets.money;
            var winner = {
                uid: d.data().bets.uid,
                money : money,
                playin: playing, 
                status : 'P'
            }
            total += parseFloat(money);
            winnerAll.push(winner);
        });
        
        var winn = {
            timestamp : firebase.firestore.FieldValue.serverTimestamp(),
            date : dateplay,
            playin : playing,
            prize : winnerAll,
            money : total * 30
        };
        dbfirestore.collection('winner').add(winn)
        .then( doc => {
            console.log('Winer finished... ');
            return doc.id;
        }).catch(e => {
            console.log('Err winner: ', e);            
        })
    });
  }
  function winners(id){
    dbfirestore.collection('competitor').doc(id)
    .get().then( doc => {        
        
            console.log(doc.data().person.fullname);
        
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
    .orderBy('timestamp', "desc")
    .get()
    .then(snapshot => {        
        var table = getID('tblBody');
        var fil = '';
        var balance = 0;
        var deferred = 0;
        var row = 0;
        snapshot.forEach(function(ele) {
            var key = ele.key;
            var transf  = ele.data();
            var text = SelectCaseStatus('P');
            var load = 'CARGA';
            var money = parseFloat(transf.money);
            if(transf.status != undefined){
                text = SelectCaseStatus(transf.status);
                if(transf.status == 'P')deferred += money;               
            }
            if(transf.load != undefined)load = 'RETIRO';
            if(transf.bets != undefined)load = 'APUESTA';
            row++;
            fil += `<tr><td style="display:none">${row}</td><td>${load}</td><td>${money.toLocaleString()}</td>
            <td style="text-align:right">${text}</td></tr>`;
            balance += money;
        });
        table.innerHTML = fil;
        getID('spbalance').innerHTML = balance.toLocaleString();                   
        getID('spdeferred').innerHTML = deferred.toLocaleString(); 
        return snapshot;        
    }).catch( e => {

    });

  }



  /**
   * **************************
   * Write Bets
   * **************************
   */
//Write Data Bets for user
async function writeUserDataBets() {
    var btn = getID('btnGame');
    var btnAcept= getID('btnAcept');
    var btnGo = getID('btnGo');
    if(UserPlayingActive == ''){
      Materialize.toast('Intente mas tarde', 3000, 'rounded');
      return false;
    }
    var loadhtml = LoadIndeterminate();
    getID('modAlertBody').innerHTML = `<center>${loadhtml}<br>Cargando...</center>`;
    
    $("#modAlert").modal("open");
    btn.classList.add('disabled');   
    btnAcept.classList.add('disabled');
    btnGo.classList.add('disabled');
    var fil = getID('tblBody');
    if(fil == null || fil.length == 0 )return false;
    fil = fil.rows;
    var total = 0;
    
    var betsAll = [];
    var updates = {};
    var keyTag = '';
    for (let i = 0; i < fil.length; i++) {
        var obj = fil[i].cells;
        var number = obj[0].innerHTML.split(" ");
        keyTag = obj[1].innerHTML + obj[2].innerHTML + number[0];
        var money = parseFloat(obj[4].innerHTML);
        var betsTag = {
            uid: UserUID,
            money: money,      
            timestamp : firebase.firestore.FieldValue.serverTimestamp()
        }

        var newKey = await getIDBets(UserPlayingActive, keyTag, betsTag); 
        var bets = {              
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
   
    var objbets = {
        playing : UserPlayingActive,
        data: betsAll,
        timestamp : firebase.firestore.FieldValue.serverTimestamp()
    };
    var ticket = await getIDTickets(UserPlayingActive, keyTag, objbets);


    var deduction = {
        money : total * -1,
        ticket : ticket,
        bets: UserPlayingActive,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status : 'E'
    }
    dbfirestore.collection("competitor")
    .doc(UserUID).collection("money").add(deduction)
    .then(d => {        
        
    }).catch(e => {
        console.log('Bets Error: ', e);
        
    })

    getID('btnGame').classList.add('hide');
    getID('tblBody').innerHTML = '';
    getID('spsaldo').innerHTML = '0';
    getID('thTotal').innerHTML = '0 Bs.';
    cleanSelect('cmbHours');
    getID('modAlertBody').innerHTML = `Te deseamos suerte en la jugada <br> ticket: ${ticket}`;
    btn.classList.remove('disabled');   
    btnAcept.classList.remove('disabled');
    btnGo.classList.remove('disabled');
    
    return true;
  
}

function getIDBets(playin, tag, bets){
    return new Promise(resolv => {
        dbfirestore.collection("bets")
        .doc(playin).collection(tag).add({bets})
        .then(d => {        
            return resolv(d.id);
        }).catch(e => {
            console.log('Bets Error: ', e);
            return resolv(e);
        })
    });
}

function getIDTickets(playin, tag, betsAll){
    return new Promise(resolv =>{
        dbfirestore.collection("competitor").doc(UserUID).collection("bets").add(betsAll)
        .then(d => {        
            return resolv(d.id);
        }).catch(e => {
            console.log('Bets Error: ', e);
            return resolv(e);
        })
    });
}



function LoadMoneyTotal(){

    dbfirestore.collection("competitor").doc(UserUID).collection("money")
        .get()
        .then(snap => {        
            saldo = 0;
            snap.forEach(ele => {                
                var assigned = ele.data();
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
        }).catch(e => {
            
            
        })

  }