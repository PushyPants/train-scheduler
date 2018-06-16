$(document).ready(function(){

    //I did not get super fancy with this one. I had planned on more but I borked the code while refactoring... 
    //After some yelling and whatnot... I pulled myself back together and rebuilt it to this.
    //I do feel that it is cleaner and more efficient than what I originally did. I did do some of the bonus work. 


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

    //check current time to change DOM on the minute
    setInterval(function(){
        now = moment()
        if(moment() !== now) {
            $('tbody').empty();
            setTimes();
            now = moment();
        }
    },1000)

    function setTimes() {
        database.ref('/trains').on('child_added', function(snapshot){
            let trains = snapshot.val();

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
            $('tr#row-'+id).append($('<td>').attr('class','text-center').text(childData.freq));
            $('tr#row-'+id).append($('<td>').text(nextArr));
            if(minAway == freq) {
            $('tr#row-'+id).append($('<td>').attr('class','text-center').text('Arriving Now'));
            } else {
            $('tr#row-'+id).append($('<td>').attr('class','text-center').text(minAway));
            }
            
        });
    };
  

    //on submit: check for all fields having value and push object to database
    $('#trainSubmit').on('click', function(event){
        event.preventDefault();
        if ($('#train-name').val() !== '' && $('#destination').val() !== '' && $('#train-time').val() !== '' && $('#frequency').val() !== '' ) {
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

        } else {
            $('.alert-positioner').fadeIn()
            setTimeout(function(){$('.alert-positioner').fadeOut()},2000)
            console.log('form not complete')

        }

    });
    
  
});