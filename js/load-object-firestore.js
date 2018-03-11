
function activeData(doc){
    dbfirestore
    .collection('competitor')
    .doc(UserUID).set({active:true})
    .then(doc => {})
    .catch(e => {  
        Materialize.toast('Ocurrio un error al enviar los datos', 4000, 'rounded');                  
    })
}

function loadUser(){
    dbfirestore.collection("competitor")
    .doc(UserUID)
    .get()
    .then(snap => { 
        if(snap.exists){
            User = snap.data();
        }else{
            Materialize.toast('Recuerde actualizar sus datos', 3000, 'rounded');
        }
    })
    .catch( e => {

    }); 
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
            User.person = person;
        })
        .catch(e => {
            Materialize.toast('Ocurrio un error al enviar los datos', 4000, 'rounded');      
            btn.classList.remove('disabled');
        })

}

//Loading for data personal
function LoadUserData(){    

    if(User.person != undefined){
        assingPerson(User.person);
        return true;
    }
    dbfirestore.collection("competitor")
    .doc(UserUID)
    .get()
    .then(snapshot => {
        var person = snapshot.data().person;   
        if(person == undefined){
            Materialize.toast('Por favor actualizar datos personales', 3000, 'rounded');
        }else{
            assingPerson(person);    
        }
    }).catch(e => {
        activeData();
        Materialize.toast('Por favor recuerde actualizar sus datos', 3000, 'rounded');
       
    });


  }
function assingPerson(person){
    getID('imgCompetitor').src = User.photoURL;
    getID('txtcid').value = person.cid
    getID('txtfullname').value = person.fullname;
    getID('cmbsex').value = person.sex;
    getID('txtdate').value = person.date;
    getID('txtphone').value = person.phone;
    getID('txtcel').value = person.cel;
    getID('txtdir').value = person.location;  
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
            User.bank = bank;
        })
        .catch( e => {
            Materialize.toast('Ocurrio un error al enviar los datos', 3000, 'rounded');
            btn.classList.remove('disabled');
        });
  }


  
  //Loading data for bank
  function LoadUserDataBank(){  
    LoadCmbBank('cmbName');
    if(User.bank != undefined){
        assingPersonBank(User.bank);
        return true;
    }
    dbfirestore.collection("competitor")
    .doc(UserUID)
    .get()
    .then(snapshot => {
        var bank = snapshot.data().bank;   
        if(bank == undefined){
            Materialize.toast('Por favor actualizar datos bancarios', 3000, 'rounded');
        }else{            
            assingPersonBank(bank);     
        }
    })
    .catch(e => {
        activeData();
        Materialize.toast('Por favor recuerde actualizar sus datos', 3000, 'rounded');       
    });
  }

  function assingPersonBank(bank){
    getPosBank(bank.name, 'cmbName');
    getPosCmb(bank.type,'cmbType');
    getID('txtNumber').value = bank.number;  
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
            getID('txtDate').value = '';
            getID('txtNumber').value = '';
            getID('txtMoney').value = '';
            cleanSelect('cmbName');
            cleanSelect('cmbNameTransferens');
            btn.classList.remove('disabled');
        })
        .catch(e => {
            console.log('Error: ', e);
        })
    })
    .catch(e => {
        console.log('Error: ', e);
    })
  }

  /**
   * **************************
   * Read Playing Transaction
   * **************************
   */

  function readPlayingDay(){
    dbfirestore.collection('playing').orderBy('orderby', "desc")
    .limit(1)
    .get()
    .then(d => {
        d.forEach(element => {    
            var key = element.id;
            var obj = element.data();
            UserPlayingActive = obj.date;  
        });      
    });
  }

  /**
   * **************************
   * Write Transaction
   * **************************
   */
//Write Data Transferens for user
function wClaimsTransf() {
    
    
    if(getID('txtMoney').value == ""){
      Materialize.toast('Por favor verifique los campos', 3000, 'rounded');
      return false;
    }
    Materialize.toast('Enviando información...', 2000, 'rounded');
    
    var transferens = {
        uid : UserUID,
        timestamp : firebase.firestore.FieldValue.serverTimestamp(),
        money : parseFloat(getID('txtMoney').value),
        status : 'P'
    };
    dbfirestore.collection("claimstransf").
    add(transferens)
    .then(d => {
        var detail = {
            money : transferens.money * -1,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            status : 'P',
            type: 'R',
            load : 'R' //Assigned
        }
        dbfirestore.collection("competitor").doc(UserUID)
        .collection("money").doc(d.id).set(detail)
        .then(d => {
            Materialize.toast('Solicitud en proceso...', 2000, 'rounded');
            LoadUserDataTransferens();
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
            var key = ele.id;    
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
            var stype = transf.type == undefined?'': transf.type;
            if(stype == 'G'){
                load = 'PREMIO';
            }
            
            
            row++;
            fil += `<tr><td style="display:none">${row}</td><td>${load}</td><td>${money.toLocaleString()}</td>
            <td style="text-align:right">${text}</td></tr>`;
            balance += money;
        });
        table.innerHTML = fil;
        getID('spbalance').innerHTML = balance.toLocaleString();                   
        getID('spdeferred').innerHTML = deferred.toLocaleString();
        loadUser();
        return snapshot;        
    }).catch( e => {

    });

  }

  function GetTransferensMoney(){
    $("#modAlertTransf").modal();
    $("#modAlertTransf").modal("open");
  }

  /**
   * **************************
   * Write Bets
   * **************************
   */
//Write Data Bets for user
async function writeUserDataBets() {

    if(UserMoneyTotal <= 0){
        Materialize.toast('Debe realizar un tramite de depósito o transferencia', 3000, 'rounded');
        return false;
    }
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
            status : 'S'
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
    });
  }


 //Load Tickets
  function LoadTicketsList(){
    var ul = '<ul class="collapsible" data-collapsible="accordion" id="ulBody">';
    var li = '';
    
    dbfirestore.collection("competitor").doc(UserUID).collection("bets")
    .orderBy("timestamp", "desc").get()
    .then(snapshot => {        
        snapshot.forEach(function(ele) {        
            var key = ele.id;
            var cabecera = `<table class="bordered striped">
            <thead><tr><th>Jugada</th><th>Sorteo</th>
                <th>Monto</th><th valing="rigth">¿Premiado?</th></tr>
            </thead><tbody id="tblBody">`;
            var body = '';
            var total = 0;        
            var obj = ele.data().data;
            var date = ele.data().timestamp;
            var datestring = ele.data().playing;
            var format = datestring.slice(6,8) + "-" + datestring.slice(4,6) + '-' + datestring.slice(0,4) ;
            for (var i = 0; i < obj.length; i++) {
                var o = obj[i];
                total += o.money;
                body += `<tr>
                <td>${o.detail}</td>
                <td>${o.lottery} ${o.hours}</td>
                <td>${parseFloat(o.money).toLocaleString()}</td>
                <td>${SelectCaseStatus(o.status)}</td>
                </tr>`;
            }
            
            var table = cabecera + body + `</tbody></table>`
            li = `<li>
            <div class="collapsible-header">
                <i class="material-icons">local_offer</i>
                
                ${key.substring(0,6)}... ${format} <br> ${parseFloat(total).toLocaleString()} Bs.
                
                <span class="new badge white rigth" data-badge-caption="">
                    <a href="#" onclick="OpenModalAlertMail()">
                        <i class="material-icons waves-effect waves-light red-text">email</i>                    
                    </a>
                </span>        
                 
            </div>
            <div class="collapsible-body blue lighten-5" style="padding:2px">
            <p align='center'>Fecha y hora: ${GetTimeStamp(date)}</p>
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


  function LoadTickets(){
    //the version firestore no disponible
        
    $("#searchticket").hide();
    LoadTicketsList();
  }

  function OpenModalAlertMail(){
    getID('modAlertBodyMail').innerHTML = `¿Desea enviar el ticket a su correo?`;
    $("#modAlertMail").modal("open");
  }

  function LoadClaims(){
    dbfirestore
    .collection('competitor')
    .doc(UserUID).collection("winner").where("status", "==", "P")
    .get()
    .then(snap => {
        var status = false;
        snap.forEach(e =>{
            status = true;
            var prize = e.data();
            prize.key = e.id;
            Prize.push(prize);                    
        });
        if (status){
            $("#divClaims").show();
            $('.tap-target').tapTarget('open');
        }
        
    })
    .catch(e => {

    })
  }

  function ClaimsPrize(){
    var maxprize = Prize.length;
    var contents = '<ul class="collection">';
    var body = '';
    
    for (let i = 0; i < Prize.length; i++) {
        const prize = Prize[i];
        var img = prize.playin.split("M");
        body += `<li class="collection-item avatar blue  lighten-5">
        <img src="img/${img[1]}.jpeg" alt="" class="circle">
        <span class="title">${prize.dateplay}</span>
        <p>${prize.playin} 
        <br> ${prize.money} Bs.
        </p>
        <a class="secondary-content btn-floating green waves-effect waves-light" onclick="SignedPrize('${prize.id}','${prize.key}','${prize.dateplay}')">
        <i class="material-icons">thumb_up</i></a>
      </li>`;

    }
    contents += body + '</ul>';
    getID('divClaimsList').innerHTML = contents;
  }

  function SignedPrize(idPostkey, idWinn, dateplay){
    if(dateplay == undefined) {
        Materialize.toast('Error de red intente más tarde...', 4000, 'rounded');
        return false;
    }
    var postKey = '';
    var postData = {};
    var moneyPost = 0;
    dbfirestore.collection('competitor').doc(UserUID)
    .collection('bets').where('playing', '==', dateplay)
    .get()
    .then((snap) => {
        snap.forEach(doc => {
            var id = doc.id;
            
            var data = doc.data();
            var elem = data.data;
            for(var i = 0; i < elem.length; i++){
                var key = elem[i].key;
                if(key == idPostkey){
                    postKey = id;
                    moneyPost = elem[i].money;
                    elem[i].status = "G";
                    postData = {
                        data : elem,
                        playing : data.playing,
                        timestamp : data.timestamp
                    };
                }
                
            }

        });
        
        updateBets(postKey, postData);
        updateWinner(idWinn);
        updateMoney(moneyPost);
        LoadLocalFile('home', '', LoadHomeAll);
    })
  }

  function updateBets(postKey, postData){
    dbfirestore.collection('competitor').doc(UserUID)
    .collection('bets').doc(postKey)
    .update(postData)
    .then( d => {        
        console.log('Premio exitoso...');
    }).catch(e => {
        console.log('Err. de Bets...')
    });
  }

  function updateWinner(postKey){
    
    console.log(postKey);
    dbfirestore.collection('competitor').doc(UserUID)
    .collection('winner').doc(postKey)
    .update({'status' : 'A'})
    .then( d => {        
        console.log('XP...');
    }).catch(e => {
        console.log('Err. Winner...')
    });
  }

  function updateMoney(money){
    var detail = {
        money : money * 30,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status : 'A',
        type:'G' //Assigned
    }
    dbfirestore.collection("competitor").doc(UserUID)
    .collection("money").add(detail)
    .then(d => {
        Materialize.toast('Felicitaciones, verifica el monedero...', 2000, 'rounded');
    })
    .catch(e => {
        console.log('Error: ', e);
    })
  }

  function ResultGames(){
    $("#divTable").hide();
    $("#divResultList").show();
    var f = $("#txtDate").val().split("/");
    var l = $("#cmbLottery").val();
    var dateplay = f[2] + f[1] + f[0];
    dbfirestore.collection('result').doc(dateplay)
    .collection(l).orderBy('timestamp', 'desc')
    .get()
    .then(snap => {
        var body = ''
        snap.forEach(doc => {
            var obj = doc.data();
            body += `<tr><td>${obj.playin}</td><td><img src="img/${obj.games}.jpeg" width="65px"></td></tr>`;
        })        
        getID("tblResultGames").innerHTML = body;
        $("#divTable").show();
        $("#divResultList").hide();
    });
  }