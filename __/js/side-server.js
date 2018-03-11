
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

function selectPrize(sdate, lottery, hours, number){
  sdate = '20180225';
  lottery = 'LOTACT';
  hours = '9AM';
}


function readPlayin(sdate, lottery, hours){
  sdate = '20180225';
  lottery = 'LOTACT';
  hours = '9AM';
  
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

  console.log(dateplay);
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
    function winners(id){
      dbfirestore.collection('competitor').doc(id)
      .get().then( doc => {        
          
              console.log(doc.data().person.fullname);
          
      });
    }
    

    function testData(){
      dbfirestore.collection('competitor').doc(UserUID).collection("bets")
      .where("playing", "==", "20180225")
      .get().then( snap => { 
        console.log(snap);    
          snap.forEach(e => {
            console.log(e.data());
          })
              
          
      });
    }


    