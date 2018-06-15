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

    setDom();

    function convertToMoment() {
        let unconverted = $('#train-time').val();
        console.log(unconverted);
        let tSplit = unconverted.split(':');
        console.log(tSplit);
        let hh = tSplit[0];
        console.log(hh)
        let mm = tSplit[1];
        console.log(mm)
       
    }

    function setTimes() {
        database.ref('/trains').on('value', function(snapshot){
            let train = snapshot.val();
            
            $.each(train, function() {
                let id = this.idVal;
                let freq;
                let currentTime = moment().format('HH:mm');
                let currentMinutes = (currentTime.split(':')[1]) - 00;
                freq = parseInt(this.freq);
                let modulus = currentMinutes % freq; 
                let minAway = freq - modulus;
                let nextArr = moment().add(minAway,'minutes').format('h:mm a');

                // console.log(this.idVal);
                // console.log(currentTime);
                // console.log(currentMinutes);
                // console.log(freq);
                // console.log(modulus);
                // console.log('minutes away ',minAway);
                // console.log('next arrival ',nextArr)
                

                $('tr#row-'+id).append($('<td>').text(nextArr));
                $('tr#row-'+id).append($('<td>').text(minAway));

            });
        });
    };
    setTimes();

    //on submit: take all values and enters them into an object with unique id
    $('#trainSubmit').on('click', function(event){
        event.preventDefault();
        numSubmits++
        database.ref('/submits').set(numSubmits);
        
        database.ref('/trains').push({
            trainName : $('#train-name').val().trim(),
            dest : $('#destination').val().trim(),
            freq : $('#frequency').val().trim(),
            startTime : $('#train-time').val().trim(),
            idVal: numSubmits,
        })
       
        $('#train-name').val('');
        $('#destination').val('');
        $('#train-time').val('');
        $('#frequency').val('');
    });
    
    //take values (convert times) and add them to database
    
    //take most recent database values and append them to DOM
    function setDom() {
        $('tbody').empty();
        //return object
        database.ref('/trains').on('child_added', function(snapshot){
            let val = snapshot.val()
            let id = val.idVal;
            
            $('tbody').append($('<tr>').attr('id','row-'+id));
            $('tr#row-'+id).append($('<th>').attr('scope','row').text(val.trainName));
            $('tr#row-'+id).append($('<td>').text(val.dest));
            $('tr#row-'+id).append($('<td>').text(val.freq));

        });
    };
    
});