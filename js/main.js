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
    let numSubmits; 
    
    //console.log(moment(['13:05']).format('h:mm a'))

    // function calcTime() {
    //     let runTime = moment(['12pm'])
    //     let currentTime = moment()
    //     console.log(runtime-currentTime)
    //     let freq = moment('1','hour')
    //     let nextTime;
    //     let minTil;
        
    //     for (i = runTime; i < currentTime; i + freq) {
    //         nextTime = i + freq
    //     }
    //     minTil = nextTime - currentTime 
    // }



    //sets the number of submissions variable to the value in the db
    database.ref('/submits').on('value', function(snapshot){
        numSubmits = snapshot.val();
    });

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

   
 
    //on submit: take all values and enters them into an object with unique id
    $('#trainSubmit').on('click', function(event){
        event.preventDefault();
        numSubmits++
        database.ref('/submits').set(numSubmits);
        
        database.ref('/trains').push({
            trainName : $('#train-name').val(),
            dest : $('#destination').val(),
            freq : $('#frequency').val(),
            startTime : $('#train-time').val(),
            idVal: numSubmits,
        })
        updateDOM();
    });
    
    //take values (convert times) and add them to database
    
    //take most recent database values and append them to DOM
    function setDom() {
        $('tbody').empty();
        //return object
        database.ref('/trains').on('child_added', function(snapshot){
            let id = snapshot.key;
            let val = snapshot.val()

            $('tbody').append($('<tr>').attr('id','row-'+id));
            $('tr#row-'+id).append($('<th>').attr('scope','row').text(val.trainName));
            $('tr#row-'+id).append($('<td>').text(val.dest));
            $('tr#row-'+id).append($('<td>').text(val.freq));
            $('tr#row-'+id).append($('<td>').text(val.startTime));

        });
    };

    function updateDOM() {
        $('#train-name').val('');
        $('#destination').val('');
        $('#train-time').val('');
        $('#frequency').val('');

        //return object
        database.ref('/trains').on('child_added', function(snapshot){
                $('tbody').append($('<tr>').attr('id','row-'+this.idVal));
                $('tr#row-'+this.idVal).append($('<th>').attr('scope','row').text(this.trainName));
                $('tr#row-'+this.idVal).append($('<td>').text(this.dest));
                $('tr#row-'+this.idVal).append($('<td>').text(this.freq));
                $('tr#row-'+this.idVal).append($('<td>').text(this.startTime));
        });
    };


    
});