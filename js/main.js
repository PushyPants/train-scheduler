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
    
    

    //Working code to set database information
        // database.ref('/trains').set({
        //     trainId:{
        //         trainName : 'Name 1',
        //         dest : 'Dest 1',
        //         freq : 'Freq 1',
        //         nextArrival : 'Arrival 1',
        //     }
        // })

    //on submit: take all values and enters them into an object with unique id
    $('#trainSubmit').on('click', function(event){
        event.preventDefault();
        numSubmits++
        database.ref('/submits').set(numSubmits);
        console.log(numSubmits)

        
        database.ref('/trains').update({
                ['trainId-'+numSubmits] :{
                    trainName : $('#train-name').val(),
                    dest : $('#destination').val(),
                    freq : $('#train-time').val(),
                    nextArrival : $('#frequency').val(),
                }
            })

    });

    //take values (convert times) and add them to database

    //take most recent database values and append them to DOM




    
});