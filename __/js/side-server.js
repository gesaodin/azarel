
function ViewGames(){
  var table = '';
  console.log('Entrando en ver jugadas');
  return table;
}

function writePlayingDay() {
    var d = $("#txtDate").val();
    if (d == "")return false;
    var f = d.split("/");
    var dateplay = f[2] + f[1] + f[0];
    Materialize.toast('Enviando actualización...', 2000, 'rounded');    
    dbfirestore.collection('playing').add({
        date: dateplay,
        orderby: firebase.firestore.FieldValue.serverTimestamp(),
        status: true
    })
    .then(d => {
      Materialize.toast('El día ha sido iniciado', 4000, 'rounded');    
    })
    .catch( e => {
      Materialize.toast('Ocurrio un error intente más tarde', 4000, 'rounded');      
    });  
}

function assignedPrize(){
  if ( $("#ngames").val() == ''){
    Materialize.toast("Ocurrio un error actualiza e intente de nuevo", 3000, 'rounded');
    return false;
  }
  var f = $("#txtDate").val().split("/");
  var s = $("#cmbHours").val();
  var l = $("#cmbLottery").val();
  var ngames = $("#ngames").val();
  var dateplay = f[2] + f[1] + f[0];

  var playing = l + s + ngames; //Ganador
  
  dbfirestore.collection('result').doc(dateplay).collection(l).add({
    timestamp : firebase.firestore.FieldValue.serverTimestamp(),        
    playin : s,
    games : ngames
    }        
  ).then(d => {
    console.log('Se ha creado los resultados');
  });

  dbfirestore.collection('bets').doc(dateplay)
  .collection(playing)
  .get().then( doc => {
      var winnerAll = [];        
      var total = 0;
      doc.forEach(d => {         
          var money = d.data().bets.money;
          var uid =  d.data().bets.uid;
          var id = d.id;
          var winner = {
              id : id,
              uid:uid,
              money : money,
              playin: playing, 
              status : 'P'
          }
          var assigned = {
            dateplay: dateplay,
            id : id,
            money : money * 30,
            playin: playing, 
            status : 'P'
          }
          total += parseFloat(money);
          winnerAll.push(winner);

          console.log(assigned);
          dbfirestore.collection("competitor").doc(uid).collection("winner")
          .add(assigned)
          .then( d => {
            console.log("Asignado ganador ", d);
          }).catch(e => {
            console.log("No se logro asignar ganador", e);
          });
      });
      if(total > 0 ){
        var tot = total * 30;
        var winn = {
          timestamp : firebase.firestore.FieldValue.serverTimestamp(),
          date : dateplay,
          playin : playing,
          prize : winnerAll,
          money : tot
        };

        dbfirestore.collection('winner').add(winn)
        .then( doc => {
            console.log('Winer finished... ');
            return doc.id;
        }).catch(e => {
            console.log('Err winner: ', e);            
        });
        var premio = `Monto por premio: ${parseFloat(tot)} Bs.`;
        Materialize.toast(premio, 2000, 'rounded');
      }else{
        Materialize.toast('No se registraron ganadores...', 3000, 'rounded');
      }
      
      
  });
}    


//Make Hours | Sorteos
function MakeHoursLottery(){

}

let lstTransf = [];
function loadTableAccept(idTbl){
  var fil = getID(idTbl);
  lstTransf = [];
  if(fil == null || fil.length == 0 )return false;
  fil = fil.rows;

  for (let i = 0; i < fil.length; i++) {
    var obj = fil[i].cells;
    if($('#chk' + i).prop("checked") == true){
      lstTransf.push({
        id: obj[0].innerHTML,
        uid: obj[1].innerHTML
      });
    }
  }
}
/**
 * -------------------------------------
 * Load Transferens for acepting
 * -------------------------------------
 */
function GetTransferensLocal(){
  var f = $("#txtDate").val();
  var bank = $("#cmbName option:selected").val();
  if(f == ''){
    Materialize.toast('Debe seleccionar una fecha', 3000, 'rounded');
    return false;
  }
  if(bank == '0'){
    Materialize.toast('Debe seleccionar un banco', 3000, 'rounded');
    return false;
  }
  $("#tblTransf").html('<tr><td colspan=4>Cargando...</td></tr>');
  dbfirestore.collection('transferens').where("status", "==", "P").where("bank", "==", bank).where("date", "==", f)
  .get()
  .then( snap => {
    var body = '';
    var i = 0;
    snap.forEach( doc => {
      var id = doc.id; //Identify
      var obj = doc.data();
      body += `<tr>
        <td style="display:none">${id}</td>
        <td style="display:none">${obj.uid}</td>
        <td>${obj.user}</td>
        <td>${obj.number}</td>
        <td>${parseFloat(obj.money)}</td>
        <td style="text-align:right"><div class="switch right">
        <label>
          <input type="checkbox" id="chk${i}">
          <span class="lever"></span>
        </label>
      </div></td></tr>`;
      i++;
    });
    $("#tblTransf").html(body);
  }).catch(e => {
    console.log("Transferens: ", e);
  });
}

function msgAceptTransferens(){
  loadTableAccept('tblTransf');
  if(lstTransf.length == 0){
    Materialize.toast('Debe aceptar transferencias', 3000, 'rounded');
    return false;
  }
  $("#modAlertBody").html(`Esta seguro que desea aceptar las trasferencias`);
  $("#modAlertFooter").html(`
    <a id="btnAcept"
            class="modal-action modal-close white-text waves-effect 
            waves-green btn-flat right" onclick="AceptTransferens()">Aceptar
    </a> 
    <a id="btnGo"
      class="modal-action modal-close white-text waves-effect 
      waves-green btn-flat right">Cancelar
    </a>`);
    $("#modAlert").modal();
    $("#modAlert").modal("open");
}
//Acepting transferend
function AceptTransferens(){
  for (let i = 0; i < lstTransf.length; i++) {
    var transf = lstTransf[i];
    dbfirestore.collection('competitor').doc(transf.uid)
    .collection('money').doc(transf.id).update({status:"A"}).then(d =>{
      
    });
    dbfirestore.collection('transferens').doc(transf.id).update({status:"A"}).then(d =>{
      Materialize.toast('Proceso finalizado', 3000, 'rounded');
      $("#tblTransf").html('');
    });
    
  }
}
/**
 * -------------------------------------
 * Load Request for acepting
 * -------------------------------------
 */

function RequestTransferens(){
  var f = $("#txtDate").val();
  var bank = $("#cmbName option:selected").val();
  if(f == ''){
    Materialize.toast('Debe seleccionar una fecha', 3000, 'rounded');
    return false;
  }
  if(bank == '0'){
    Materialize.toast('Debe seleccionar un banco', 3000, 'rounded');
    return false;
  }
  $("#tblRequest").html('<tr><td colspan=7>Cargando...</td></tr>');
  dbfirestore.collection('claimstransf').where("status", "==", "P").where("bankname", "==", bank)
  .get()
  .then( snap => {
    var body = '';
    var i = 0;
    snap.forEach( doc => {
      var id = doc.id; //Identify
      var obj = doc.data();
      
      body += `<tr>
        <td style="display:none">${id}</td>
        <td style="display:none">${obj.uid}</td>
        <td>${obj.user}</td>
        <td>${obj.cid}</td>
        <td>${getPosBankText(obj.bank.substring(0, 4))}</td>
        <td>${getBankType(obj.banktype)}</td>
        <td>${obj.bank}</td>
        <td>${obj.money}</td>
        <td style="text-align:right"><div class="switch right">
        <label>
          <input type="checkbox" id="chk${i}">
          <span class="lever"></span>
        </label>
      </div></td></tr>`;
        i++;
    });
    $("#tblRequest").html(body);
  }).catch(e => {
    console.log("Claims: ", e);
  });
}


function msgAceptRequest(){
  loadTableAccept('tblRequest');
  if(lstTransf.length == 0){
    Materialize.toast('Debe aceptar solicitudes', 3000, 'rounded');
    return false;
  }
  $("#modAlertBody").html(`Esta seguro que efectuo las trasferencias`);
  $("#modAlertFooter").html(`
    <a id="btnAcept"
            class="modal-action modal-close white-text waves-effect 
            waves-green btn-flat right" onclick="AceptRequest()">Aceptar
    </a> 
    <a id="btnGo"
      class="modal-action modal-close white-text waves-effect 
      waves-green btn-flat right">Cancelar
    </a>`);
    $("#modAlert").modal();
    $("#modAlert").modal("open");
}


//Acepting request transferens
function AceptRequest(){
  for (let i = 0; i < lstTransf.length; i++) {
    var transf = lstTransf[i];
    dbfirestore.collection('competitor').doc(transf.uid)
    .collection('money').doc(transf.id).update({status:"A"}).then(d =>{
      
    });
    dbfirestore.collection('claimstransf').doc(transf.id).update({status:"A"}).then(d =>{
      Materialize.toast('Proceso finalizado', 3000, 'rounded');
      $("#tblRequest").html('');
    });

  }
}


function loadTableBanks(idTbl){
  var fil = getID(idTbl);
  var lst = [];
  if(fil == null || fil.length == 0 )return false;
  fil = fil.rows;

  for (let i = 0; i < fil.length; i++) {
    var obj = fil[i].cells;   
    lst.push({
        bank: obj[0].innerHTML,
        type: obj[1].innerHTML,
        desc: obj[2].innerHTML,
        number: obj[5].innerHTML,
        status: true,
      });
  }
  return lst;
}
function LoadSettingsBegin(){

  dbfirestore.collection('settings').doc('description').get()
  .then( doc => {
    if(doc.exists){
      Settings = doc.data();
    }else{
      Materialize.toast('Debe actualizar configuración', 3000);
    }
    
  })

}
function LoadSettings(){
  LoadCmbBank('cmbName');
  if (Settings.data != undefined){
    GetInterfaceSettings();
  }else{
    dbfirestore.collection('settings').doc('description').get()
    .then( doc => {      
      Settings = doc.data();
      GetInterfaceSettings();
    })
  }
  
}
function GetInterfaceSettings(){
  $("#txtRif").val(Settings.data.rif);
  $("#txtSocial").val(Settings.data.name);
  $("#txtDirection").val(Settings.data.dir);
  $("#txtPhone").val(Settings.data.phone);
  $("#txtCel").val(Settings.data.cel);
  for (let i = 0; i < Settings.bank.length; i++) {
    const bank =  Settings.bank[i];
    $('#tblListBank').append(`<tr>
      <td style="display:none">${bank.name}</td>
      <td style="display:none">${bank.type}</td>
      <td>${bank.desc}</td>
      <td>${getPosBankText(bank.name)}</td>
      <td>${getBankType(bank.type)}</td>
      <td>${bank.number}</td>
      <td style="text-align:right"><div class="switch right">
      <label>
        <input type="checkbox" checked=true>
        <span class="lever"></span>
      </label>
      </div></td>
    </tr>`);   
  }
  $("#txtMin").val(Settings.limit.min);
  $("#txtMax").val(Settings.limit.max);
}

function saveSettings(){
  var data = {
    rif : $("#txtRif").val(),
    name : $("#txtSocial").val(),
    dir : $("#txtDirection").val(),
    phone : $("#txtPhone").val(),
    cel : $("#txtCel").val()
  }
  var bank = loadTableBanks('tblListBank');
  var limit = {
    min : $("#txtMin").val(), 
    max : $("#txtMax").val()
  }
  var settings = {
    data : data,
    bank : bank,
    limit: limit
  }
  console.log(settings);
  
  dbfirestore.collection('settings').doc('description').set(settings)
  .then( doc => {
    Materialize.toast('Proceso finalizado', 3000, 'rounded');
    console.log('Save settings...');
  }).catch(e => {
    console.log('Err. Settings', e);
  })
}
function loadBankSettings(){
  
}