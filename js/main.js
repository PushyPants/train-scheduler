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
    
    //sets the number of submissions variable to the value in the db
    database.ref('/submits').on('value', function(snapshot){
        numSubmits = snapshot.val();
    });

    updateDOM();
 
    //on submit: take all values and enters them into an object with unique id
    $('#trainSubmit').on('click', function(event){
        event.preventDefault();
        numSubmits++
        database.ref('/submits').set(numSubmits);
        
        database.ref('/trains').update({
            ['trainId-'+numSubmits] : {
                trainName : $('#train-name').val(),
                dest : $('#destination').val(),
                freq : $('#frequency').val(),
                nextArrival : $('#train-time').val(),
                idVal: numSubmits,
            }
        })
        
        updateDOM();
        
    });
    
    //take values (convert times) and add them to database
    
    //take most recent database values and append them to DOM
    function updateDOM() {
        $('#train-name').val('');
        $('#destination').val('');
        $('#train-time').val('');
        $('#frequency').val('');

        //return object
        database.ref('/trains').on('value', function(snapshot){
            let trains = snapshot.val();
            $('tbody').empty();

            $.each(trains,function(){
                $('tbody').append($('<tr>').attr('id','row-'+this.idVal));
                $('tr#row-'+this.idVal).append($('<th>').attr('scope','row').text(this.trainName));
                $('tr#row-'+this.idVal).append($('<td>').text(this.dest));
                $('tr#row-'+this.idVal).append($('<td>').text(this.freq));
                $('tr#row-'+this.idVal).append($('<td>').text(this.nextArrival));
            })

        });
    };


    
});