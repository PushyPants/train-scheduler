$(document).ready(function(){

    var config = {
        apiKey: "AIzaSyDmWkwTbAol6LvYK6DIgRo41m2VG9r99x4",
        authDomain: "train-scheduler-b006b.firebaseapp.com",
        databaseURL: "https://train-scheduler-b006b.firebaseio.com",
        projectId: "train-scheduler-b006b",
        storageBucket: "",
        messagingSenderId: "512611692411"
    };

    firebase.initializeApp(config);

    let database = firebase.database();

    setTimes();

    function setTimes() {
        database.ref('/trains').on('child_added', function(snapshot){
            let trains = snapshot.val();
            console.log(snapshot.key)

            var childKey = snapshot.key;
            var childData = snapshot.val();
            let id = childKey;
            let freq;
            let currentTime = moment().format('HH:mm');
            let currentMinutes = (currentTime.split(':')[1]) - 00;
            freq = parseInt(childData.freq);
            let modulus = currentMinutes % freq; 
            let minAway = freq - modulus;
            let nextArr = moment().add(minAway,'minutes').format('h:mm a');

            $('tbody').append($('<tr>').attr('id','row-'+id));
            $('tr#row-'+id).append($('<th>').attr('scope','row').text(childData.trainName));
            $('tr#row-'+id).append($('<td>').text(childData.dest));
            $('tr#row-'+id).append($('<td>').text(childData.freq));
            $('tr#row-'+id).append($('<td>').text(nextArr));
            $('tr#row-'+id).append($('<td>').text(minAway));
            
        });
    };
  

    //on submit: take all values and enters them into an object with unique id
    $('#trainSubmit').on('click', function(event){
        event.preventDefault();
        
        database.ref('/trains').push({
            trainName : $('#train-name').val().trim(),
            dest : $('#destination').val().trim(),
            freq : $('#frequency').val().trim(),
            startTime : $('#train-time').val().trim(),
        })
       
        $('#train-name').val('');
        $('#destination').val('');
        $('#train-time').val('');
        $('#frequency').val('');
    });
    
  
});