
function activeData(doc){
    dbfirestore
    .collection('competitor')
    .doc(UserUID).set({active:true})
    .then(doc => {})
    .catch(e => {  
        Materialize.toast('Ocurrio un error al enviar los datos', 4000);                  
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
            Materialize.toast('Recuerde actualizar sus datos', 3000);
        }
    })
    .catch( e => {

    }); 
}

function writeUserDataPerson() {
    var btn = getID('btnUserData');
    ConexionUser = 0;
    if(getID('txtcid').value == ""){
      Materialize.toast('Por favor verifique los campos', 3000);
      return false;
    }
    Materialize.toast('Enviando actualización...', 2000);
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
            Materialize.toast('Tus datos han sido actualizados', 4000);    
            btn.classList.remove('disabled');
            User.person = person;
        })
        .catch(e => {
            Materialize.toast('Ocurrio un error al enviar los datos', 4000);      
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
            Materialize.toast('Por favor actualizar datos personales', 3000);
        }else{
            assingPerson(person);    
        }
    }).catch(e => {
        activeData();
        Materialize.toast('Por favor recuerde actualizar sus datos', 3000);
       
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
      Materialize.toast('Por favor verifique los campos', 3000);
      return false;
    }
    Materialize.toast('Enviando actualización...', 2000);
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
            Materialize.toast('Tus datos han sido actualizados', 3000);
            btn.classList.remove('disabled');
            User.bank = bank;
        })
        .catch( e => {
            Materialize.toast('Ocurrio un error al enviar los datos', 3000);
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
            Materialize.toast('Por favor actualizar datos bancarios', 3000);
        }else{            
            assingPersonBank(bank);     
        }
    })
    .catch(e => {
        activeData();
        Materialize.toast('Por favor recuerde actualizar sus datos', 3000);       
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
    if(User.person == undefined){
        Materialize.toast('Actualiza tus datos personales', 3000);
        return false;
    }
    if(getID('txtNumber').value == ""){
      Materialize.toast('Por favor verifique los campos', 3000);
      return false;
    }
    var azr =  parseFloat(getID('txtMoney').value) * SelMountMoney(getID('cmbMoney').value);
    $('#txtAzarel').val(azr);
    Materialize.toast('Enviando actualización...', 2000);
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
        status : 'P',
        user : User.person.fullname,
        cid : User.person.cid,
        moneda : getID('cmbMoney').value,
        azr: parseFloat(getID('txtMoney').value) * SelMountMoney(getID('cmbMoney').value)
    };
    dbfirestore.collection("transferens").
    add(transferens)
    .then(d => {
        var detail = {
            money : transferens.money,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            status : 'P',
            type:'A', //Assigned
            idt: d.id,
            moneda: transferens.moneda,
            azr: transferens.azr
        }
        dbfirestore.collection("competitor").doc(UserUID)
        .collection("money").doc(d.id).set(detail)
        .then(d => {
            getID('txtDate').value = '';
            getID('txtNumber').value = '';
            getID('txtMoney').value = '';
            getID('txtAzarel').value = '';
            cleanSelect('cmbName');
            cleanSelect('cmbNameTransferens');
            btn.classList.remove('disabled');
            UserMoneyTotal +=  transferens.money;
            Materialize.toast('Registro exitoso...', 2000);
        })
        .catch(e => {
            console.log('Error: ', e);
        })
    })
    .catch(e => {
        console.log('Error: ', e);
    })
  }

  function SelMountMoney(str){
      switch (str) {
          case "VEN":
            return Settings.limit.bolivar;  
            break;
          case "PER":
            return Settings.limit.sol;
            break;
          case "DOL":
            return Settings.limit.dolar;
            break;
          default:
            return 0;
            break;
      }
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
    var fmoney = parseFloat(getID('txtMoney').value);
    if(User.person == undefined){
        Materialize.toast('Actualiza tus datos personales', 3000);
        return false;
    }
    if(User.bank == undefined){
        Materialize.toast('Actualiza tus datos bancarios', 3000);
        return false;
    }

    if(getID('txtMoney').value == ""){
      Materialize.toast('Introduzca un monto', 3000);
      return false;
    }
    if(UserMoneyTotal <= fmoney){
        Materialize.toast('El retiro debe ser menor que el saldo', 3000);
        return false;   
    }
    Materialize.toast('Enviando información...', 2000);
    
    var transferens = {
        uid : UserUID,
        timestamp : firebase.firestore.FieldValue.serverTimestamp(),
        azr : parseFloat(getID('txtMoney').value),
        status : 'P',
        bankname: User.bank.name,
        bank : User.bank.number,
        banktype : User.bank.type,
        user : User.person.fullname,
        cid : User.person.cid
    };
    dbfirestore.collection("claimstransf").
    add(transferens)
    .then(d => {
        var detail = {
            azr : transferens.azr * -1,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            status : 'P',
            type: 'R',
            load : 'R', //Assigned}
            idt : d.id
        }
        dbfirestore.collection("competitor").doc(UserUID)
        .collection("money").doc(d.id).set(detail)
        .then(d => {
            Materialize.toast('Solicitud en proceso...', 2000);
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
            var money = parseFloat(transf.azr);
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
            
            if(money != 0){
                row++;
                fil += `<tr><td style="display:none">${row}</td><td>${load}</td><td>${money.toLocaleString()}</td>
                <td style="text-align:right">${text}</td></tr>`;
                balance += money;
            }

        });
        table.innerHTML = fil;
        getID('spbalance').innerHTML = balance.toLocaleString();                   
        getID('spdeferred').innerHTML = deferred.toLocaleString();
        UserMoneyTotalDeferred = balance - deferred;
        loadUser();
        return snapshot;        
    }).catch( e => {

    });

}



//Loading data for Remesas
function LoadUserDataRemesas(){
    

    dbfirestore.collection("competitor")
    .doc(UserUID).collection("remesas")
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
            var load = '<i>TRNS</i>';
            var money = parseFloat(transf.bolivar);
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
            $("#divClaimsList").hide();
            $("#divTable").show();
        });
        table.innerHTML = fil;
        if(row == 0){
            $("#divClaimsList").hide();
            $("#divTable").show();
            table.innerHTML = `<tr><td colspan="4"><i>Sin Operaciones Pendientes</i></td></tr>`;
        }
        return snapshot;        
    }).catch( e => {
        
        
    });

  }



function GetTransferensMoney(){
    if(UserMoneyTotal <= 0){
        Materialize.toast('No posee saldo suficiente!!!', 2000);
        return false;
    }
    $("#modAlertTransf").modal();
    $("#modAlertTransf").modal("open");
}

function GetRetiroMoney(){
    if(UserMoneyTotal <= 0){
        Materialize.toast('No posee saldo suficiente!!!', 2000);
        return false;
    }
    $("#modAlertRetiro").modal();
    $("#modAlertRetiro").modal("open");
}


  /**
   * **************************
   * Write Bets
   * **************************
   */
//Write Data Bets for user
async function writeUserDataBets() {

    if(UserMoneyTotal <= 0){
        Materialize.toast('Debe realizar un tramite de transferencia', 3000);
        return false;
    }
    var btn = getID('btnGame');
    var btnAcept= getID('btnAcept');
    var btnGo = getID('btnGo');
    if(UserPlayingActive == ''){
      Materialize.toast('Intente mas tarde', 3000);
      return false;
    }
    var loadhtml = LoadIndeterminate();
    getID('modAlertBody').innerHTML = `<center>${loadhtml}<br>Cargando...</center>`;
    
    $("#modAlert").modal("open");
    btn.classList.add('disabled');   
    btnAcept.classList.add('disabled');
    btnGo.classList.add('disabled');
    HTMLPrint = '<center>' + getID('divPrint').innerHTML;
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
            azr : money,
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
        azr : total * -1,
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
    UserMoneyTotal = UserMoneyTotal - total;
    UserMoney = parseFloat(UserMoneyTotal) + ' ' + MoneyType;
    LoadMoneyBets();
    getID('btnGame').classList.add('hide');
    getID('tblBody').innerHTML = '';
    getID('spsaldo').innerHTML = '0';
    getID('thTotal').innerHTML = '0 ' + MoneyType;
    MoneyGame = 0;
    cleanSelect('cmbHours');
    getID('modAlertBody').innerHTML = `Te deseamos suerte en la jugada <br> ticket: ${ticket}`;
    TicketPrint = ticket;
    HTMLPrint += `<br>
    <canvas id="barcode"></canvas></center>`
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
            saldo += parseFloat(assigned.azr);
        });
        if (getID('totalmoney') != undefined) getID('totalmoney').innerHTML = saldo.toLocaleString() + ' ' + MoneyType;
        UserMoney = saldo.toLocaleString() + ' ' + MoneyType;
        UserMoneyTotal = saldo;
        if (ConexionUser == 0){
            ConexionUser++;
        } else{
            Materialize.toast('Sus datos han sido actualizados', 3000);
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
                
                ${key.substring(0,6)}... ${format} <br> ${parseFloat(total).toLocaleString()} ${MoneyType}
                
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
    getID('divClaimsList').innerHTML = '';
    var contents = '<ul class="collection">';
    var body = '';
    
    for (let i = 0; i < Prize.length; i++) {
        const prize = Prize[i];
        var img = prize.playin.split("M");
        body += `<li class="collection-item avatar blue  lighten-5">
        <img src="img/${img[1]}.png" alt="" class="circle">
        <span class="title">${prize.dateplay}</span>
        <p>${prize.playin} 
        <br> ${prize.money} ${MoneyType}
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
        Materialize.toast('Error de red intente más tarde...', 4000);
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
    
    //console.log(postKey);
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
        money : azr * 30,
        money : money * 30,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status : 'A',
        type:'G' //Assigned
    }
    dbfirestore.collection("competitor").doc(UserUID)
    .collection("money").add(detail)
    .then(d => {
        Materialize.toast('Felicitaciones, verifica el monedero...', 2000);
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
            body += `<tr><td>${obj.playin}</td><td><img src="img/${obj.games}.png" width="65px"></td></tr>`;
        })        
        getID("tblResultGames").innerHTML = body;
        $("#divTable").show();
        $("#divResultList").hide();
    });
  }
  
  function getSettings(){
    dbfirestore.collection('settings').doc('description').get()
    .then( doc => {
        if(doc.exists){
            Settings = doc.data();
        }     
    })
  }



function GenerarQR(){    
    var fmoney = parseFloat(getID('txtMoney').value);
    var btnQR = getID('btnQR');
    var btnMail = getID('btnMail');
    if(User.person == undefined){
        Materialize.toast('Actualiza tus datos personales', 3000);
        return false;
    }

    if(getID('txtMoney').value == ""){
      Materialize.toast('Introduzca un monto', 3000);
      return false;
    }
    if(UserMoneyTotalDeferred <= fmoney){
        Materialize.toast('El retiro debe ser menor al saldo', 3000);
        return false;   
    }
    btnQR.classList.add('disabled');
    btnMail.classList.add('disabled');

    var detail = {
        azr : 0,
        azrp : parseFloat(fmoney) * -1,
        money : parseFloat(fmoney),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status : 'P',
        claims : '',
        type:'D' //Deduction
    }
    dbfirestore.collection("competitor").doc(UserUID)
    .collection("money").add(detail)
    .then(d => {
        btnQR.classList.remove('disabled');
        btnMail.classList.remove('disabled');
        var codigoQR = UserUID + "|" + d.id + "|" + detail.money;
        qrcode.makeCode(codigoQR);
        $("#modAlertTransf").modal("close");
        $("#modQR").modal();
        $("#modQR").modal("open");
        Materialize.toast('Registro exitoso...', 2000);        
        return d;
    })
    .then( d => {
        AssignedMoney = 0;
        var unsubscribe = dbfirestore.collection("competitor").doc(UserUID)
        .collection("money").doc(d.id)
        .onSnapshot({           
                includeMetadataChanges: true
            }, function(doc) {
                AssignedMoney++;
                console.log(AssignedMoney);
                if(AssignedMoney > 1){
                    Materialize.toast('Se ha reclamado el saldo...', 2000);            
                    $("#modQR").modal("close");
                    LoadUserDataTransferens();
                    AssignedMoney = 0;
                    unsubscribe();
                }
        });
    })
    .catch(e => {
        console.log('Error: ');
    })

  }
  


function GenerarMAIL(){
    var fmoney = parseFloat(getID('txtMoney').value);
    if(User.person == undefined){
        Materialize.toast('Actualiza tus datos personales', 3000);
        return false;
    }
    if(getID('txtMoney').value == ""){
      Materialize.toast('Introduzca un monto', 3000);
      return false;
    }
    if(UserMoneyTotal <= fmoney){
        Materialize.toast('El retiro debe ser menor al saldo', 3000);
        return false;   
    }

    Materialize.toast('Actualmente el area está en proceso', 3000);
}


function ObtenerQR(str){
    var res = str.split("|");
    console.log(res);
    dbfirestore
    .collection('competitor')
    .doc(res[0])
    .collection('money')
    .doc(res[1])
    .get()
    .then(d => {
        if ( d.data().status == "P" ){
            dbfirestore.collection('competitor').doc(res[0]).collection('money')
            .doc(res[1]).update( {
                azr: parseFloat(res[2]) * -1,
                status : "A",
                claims : UserUID,
            }).then( e => {
                var detail = {
                    azr : parseFloat(res[2]),
                    money : parseFloat(res[2]),
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    status : 'A',
                    type:'A' //Deduction
                }
                dbfirestore.collection("competitor").doc(UserUID)
                .collection("money").add(detail)
                .then(d => { 
                    Materialize.toast('Los fondos se han transferido', 3000);
                    location.href = "home.html";
                })        
            })
        }else{
            Materialize.toast('Este saldo ya se ha transferido...', 3000); 
        }
        
    })
    .catch(e => {
        Materialize.toast('Verifique el QR', 3000);
    })
    
  
    
}

function selectCmbBnk(){
    switch ($('#cmbType').val())  {
        case "0":
            $('#divBnk').show();
            break;
    
        default:
            $('#divBnk').hide();
            break;
    }
}

/*
* Control de Remesas
*/

function LoadBeneficiario(){
    LoadCmbBank('cmbName');    
}
function LoadTramite(){
    //LoadCmbBank('cmbName');
    if (Settings.bank == undefined ){
      Materialize.toast('Fallo de conexión intente mas tarde', 3000);
      return false;
    }
    // var Cmb = '';
    // var select = $('#cmbNameTransferens');
    // for (let i = 0; i < Settings.bank.length; i++) {
    //   const bank = Settings.bank[i];
    //   Cmb += `<option value="${bank.name}">${getPosBankText(bank.name)} - ${bank.number}</option>`;    
    // }
    // getID('cmbNameTransferens').innerHTML = Cmb;
    // select.prop('selectedIndex', 0);  
    // select.material_select(); 
    LoadCmbDataBeneficiario();
}

function LoadCmbOperation(){
    var Cmb = '';
    var select = $('#cmbNameTransferens');
    for (let i = 0; i < Settings.bank.length; i++) {
        const bank = Settings.bank[i];
        
        if( $('#cmbOrigen').val() == bank.naci ){
            Cmb += `<option value="${bank.name}">${bank.desc} - ${bank.number}</option>`;            
        }
    }
    getID('cmbNameTransferens').innerHTML = Cmb;
    select.prop('selectedIndex', 0);  
    select.material_select();
    switch ($('#cmbOrigen').val()) {
        case 'VEN':
            LoadCmbBank('cmbName', Banks);
            
            break;
        case 'PER':
            LoadCmbBank('cmbName', BanksPERU);
            
            break;
        default:
            LoadCmbBank('cmbName', BanksUS);
            break;
    }
}

function SelectTypeAccount(){
    switch ($("#cmbType").val()) {
        case "0":
            $("#divNameBank").show()
            break;
        case "1":
            $("#divNameBank").hide();
            break;
        default:
            $("#divNameBank").hide();
            break;
    }
}

function writeUserDataBeneficiario() {
    var btn = getID('btnUserDataBeneficiario');
    ConexionUser = 0;
    if(getID('txtID').value == ""){
      Materialize.toast('Por favor verifique los campos', 3000);
      return false;
    }
    Materialize.toast('Enviando actualización...', 2000);
    btn.classList.add('disabled');
    var beneficiario = {
      nac: getID('cmbNacionalidad').value,
      cid: getID('txtID').value,
      fullname: getID('txtNombreCompleto').value,
      alias : getID('txtAlias').value,
      banco: getID('cmbName').value,
      tipo: getID('cmbType').value,
      number: getID('txtNumber').value,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    //console.log(beneficiario);
    dbfirestore
        .collection('competitor')
        .doc(UserUID)
        .collection("beneficiario")
        .add(beneficiario)
        .then(doc => {
            Materialize.toast('Tus datos han sido actualizados', 4000);    
            btn.classList.remove('disabled');
            LoadLocalFile('remesas/addbeneficiario','',LoadBeneficiario);
        })
        .catch(e => {
            Materialize.toast('Ocurrio un error al enviar los datos', 4000);      
            btn.classList.remove('disabled');
            LoadLocalFile('remesas/addbeneficiario','',LoadBeneficiario);
        })

}


  //Loading data for LoadUserDataBeneficiario
  function LoadUserDataBeneficiario(){
    dbfirestore.collection("competitor")
    .doc(UserUID).collection("beneficiario")
    .orderBy('timestamp', "desc")
    .get()
    .then(snapshot => {
        var table = getID('tblBodyBeneficiario');
        var fil = '';        
        var row = 0;
        snapshot.forEach(function(ele) {
            var key = ele.id;    
            var bnf  = ele.data();
            var text = "modificar";
            row++;
            fil += `<tr><td>${row}</td><td>${bnf.fullname}</td></tr>`;
        });
        table.innerHTML = fil;
        $("#divClaimsList").hide();
        $("#divBnf").show();
         
    }).catch( e => {
        $("#divClaimsList").hide();
        Materialize.toast('Debe crear un beneficiario', 4000); 
    });

  }


   //Loading data for LoadUserDataBeneficiario
   function LoadCmbDataBeneficiario(){
    var Cmb = '';
    var select = $('#cmbBeneficiario');
    dbfirestore.collection("competitor")
    .doc(UserUID).collection("beneficiario")
    .orderBy('timestamp', "desc")
    .get()
    .then(snapshot => {       
        snapshot.forEach(function(ele) {
            var key = ele.id;    
            var bnf  = ele.data();
            Cmb += `<option value="${key}">${bnf.alias}</option>`; 
        });

        getID('cmbBeneficiario').innerHTML = Cmb;
        select.prop('selectedIndex', 0);  
        select.material_select();
         
    }).catch( e => {
        $("#divClaimsList").hide();
        Materialize.toast('Debe crear un beneficiario', 4000); 
    });

  }

  function SelectionBankTransferens(){
    switch ($('#cmbMoney').val()) {
      case 'VEN':
        LoadCmbBank('cmbName', Banks);
        SelectAccountBank('VEN');
        break;
      case 'PER':
        LoadCmbBank('cmbName', BanksPERU);
        SelectAccountBank('PER');
        break;
      default:
        break;
    }
  }

  function SelectAccountBank(str){
    var Cmb = '';
    var select = $('#cmbNameTransferens');
    Cmb += `<option value="0">----------------</option>`; 
    for (let i = 0; i < Settings.bank.length; i++) {
        var bank = Settings.bank[i];
        if(bank.naci == str){
            Cmb += `<option value="${bank.number}">${bank.desc} - ${bank.number}</option>`; 
        }
    }
    getID('cmbNameTransferens').innerHTML = Cmb;
    select.prop('selectedIndex', 0);  
    select.material_select();

  }


   /**
   * **************************
   * Write Remesas
   * **************************
   */
//Write Data Remesas for user
function writeUserDataRemesas() {
    var btn = getID('btnUserDataRemesas');
    if(User.person == undefined){
        Materialize.toast('Actualiza tus datos personales', 3000);
        return false;
    }
    if(getID('txtNumber').value == ""){
      Materialize.toast('Por favor verifique los campos', 3000);
      return false;
    }
    var bolivar =  parseFloat(getID('txtMoney').value) * Settings.limit.solbolivar;
    var azr =  parseFloat(getID('txtMoney').value) * Settings.limit.sol;

    Materialize.toast('Enviando actualización...', 2000);
    btn.classList.add('disabled');
    var transferens = {
        uid : UserUID,
        origen: getID('cmbOrigen').value,
        destino: getID('cmbDestino').value,
        type : getID('cmbType').value,
        name : getID('cmbName').value,
        bank : getID('cmbNameTransferens').value,
        date : getID('txtDate').value,
        number : getID('txtNumber').value,
        timestamp : firebase.firestore.FieldValue.serverTimestamp(),
        money : parseFloat(getID('txtMoney').value),
        status : 'P',
        user : User.person.fullname,
        cid : User.person.cid,
        moneda : getID('cmbOrigen').value,
        benef : getID('cmbBeneficiario').value,
        azr: azr,
        bolivar: bolivar
    };
    dbfirestore.collection("claimstransf").
    add(transferens)
    .then(d => {
        var detail = {
            money : transferens.money * -1  ,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            status : 'P',
            type:'A', //Assigned
            idt: d.id,
            bolivar: transferens.bolivar,
            moneda: transferens.moneda,
            azr: transferens.azr * -1
        }
        dbfirestore.collection("competitor").doc(UserUID)
        .collection("remesas").doc(d.id).set(detail)
        .then(d => {
            getID('txtDate').value = '';
            getID('txtNumber').value = '';
            getID('txtMoney').value = '';
            getID('txtMoneyTransf').value = '';
            cleanSelect('cmbName');
            cleanSelect('cmbNameTransferens');
            btn.classList.remove('disabled');
            UserMoneyTotal +=  transferens.money;
            Materialize.toast('Registro exitoso...', 2000);
        })
        .catch(e => {
            console.log('Error: ', e);
        })
    })
    .catch(e => {
        console.log('Error: ', e);
    })
  }