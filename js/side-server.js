
function writePlayingDay(d) {
    if (d == undefined)return false;
    Materialize.toast('Enviando actualización...', 2000, 'rounded');    
    firebase.database().ref('playing').push({
        date: d,
        orderby: firebase.database.ServerValue.TIMESTAMP,
        status: true
    })
    .then(d => {
      Materialize.toast('Tus datos han sido actualizados', 4000, 'rounded');    
    })
    .catch( e => {
      Materialize.toast('Ocurrio un error al enviar los datos', 4000, 'rounded');      
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
      var playing = 'LOTAC9AM05'; //Ganador
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
              dbfirestore.collection("competitor").doc(uid).collection("winner")
              .add(assigned);
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


    