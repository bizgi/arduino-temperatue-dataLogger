
// $.getJSON("all/status", gotData);
//   function gotData(data){
//     console.log(data);
//     document.getElementById('status').innerHTML = data["status"];
//
//   }

window.onload=function() {

 // load top menu
  $("#menu").load("/menu.html");
//--

  // start - stop port reading
  if (bt = document.getElementById("btn") != null){
    var bt = document.getElementById("btn");
    //console.log(bt);
    bt.addEventListener("click",function(e){ submitStatus(); },false);
  }

  function submitStatus(){
   //console.log(val);
    var val = document.getElementById('btn').value;
    $.getJSON("stat/status/" + val);
	
    var currentvalue = document.getElementById('btn').value;
    if(currentvalue == "STOP"){
      document.getElementById("btn").value="START";
    }else{
      document.getElementById("btn").value="STOP";
    };

    window.location.replace("./dash.html");

  };


  // stop experiment from dash window
  if (sbt = document.getElementById("sbtn") != null){
    var sbt = document.getElementById("sbtn");
    //console.log(bt);
    sbt.addEventListener("click",function(e){ stopExp(); },false);


    $.getJSON("./status.json", gotData);
      function gotData(data){
        console.log(data);
        // document.getElementById('status').innerHTML = data["status"];

        let currentvalue =  data["status"];
        if(currentvalue == "STOP"){
          
          document.getElementById("sbtn").value="START";
		// location = location;
        }else{
          document.getElementById("sbtn").value="STOP";
		  // location = location;
        }
      };

    function stopExp(){
     //console.log(val);
      let val = document.getElementById('sbtn').value;
      $.getJSON("stat/status/" + val);
		location = location;
      $.getJSON("./status.json", gotData);
        function gotData(data){
          console.log(data);
          // document.getElementById('status').innerHTML = data["status"];

          let currentvalue =  data["status"];
          if(currentvalue == "STOP"){
            document.getElementById("sbtn").value="START";
			location = location;
          }else{
			
            document.getElementById("sbtn").value="STOP";
			location = location;
          };
        }
    };
  };


  // inint experiment-----------------------------------

  if (document.getElementById("init") != null){
  // load current exp setup into form
    $.getJSON("./expSetup.json", gotSetup);
      function gotSetup(data){
        // console.log(data);
        document.getElementById("expName").placeholder = data['expName'];
        document.getElementById("expTimeStep").placeholder = data['expTimeStep'];
        document.getElementById("expTotalTime").placeholder = data['expTotalTime'];
        // document.getElementById("expHotInletFlowRate").placeholder = data['expHotInletFlowRate'];
        // document.getElementById("expColdInletFlowRate").placeholder = data['expColdInletFlowRate'];
      };

    // init button
    var init = document.getElementById("init");
    //console.log(bt);
    init.addEventListener("click",function(e){ initExp(); },false);
  };

  function initExp(){

    var date = new Date();
    var startTime = date.getFullYear() + "-" + (date.getMonth()+1)+ "-" + date.getDate() + "-" + date.getHours() + "-" + date.getMinutes() + "-"
    console.log(startTime);

    var expName = startTime + document.getElementById("expName").value;
    var expTimeStep = document.getElementById("expTimeStep").value;
    var expTotalTime = document.getElementById("expTotalTime").value;


    $.getJSON("add/" + "expName/" + expName);
    $.getJSON("add/" + "expTimeStep/" + expTimeStep);
    $.getJSON("add/" + "expTotalTime/" + expTotalTime);


     document.getElementById("expName").value = null;
     document.getElementById("expName").placeholder = expName;
     document.getElementById("expTimeStep").value = null;
     document.getElementById("expTotalTime").value = null;


     document.getElementById("initExpName").innerHTML = expName;
     document.getElementById("initExpTimeStep").innerHTML = expTimeStep;
     document.getElementById("initTotalTime").innerHTML = expTotalTime;



  };


   // Sensor Names Init---------------------------------

  if (sensorInitBtn = document.getElementById("sensorInitBtn") != null){
      $("#sensor-area").hide();
     var sensorInitBtn = document.getElementById("sensorInitBtn");
     //console.log(bt);
     sensorInitBtn.addEventListener("click",function(e){ sensorInit(); },false);


   function sensorInit(){
    //console.log(val);


    $("#reading").html('Loading Sensors... ');
     var val = document.getElementById('sensorInitBtn').value;
     $.getJSON("stat/status/" + val);

     var currentvalue = document.getElementById('sensorInitBtn').value;
     if(currentvalue == "STOP"){
       document.getElementById("sensorInitBtn").value="START";
     }else{
       document.getElementById("sensorInitBtn").value="STOP";
     };

     readSensorJson()
     // setTimeout(readSensorJson, waitTime)

     setInterval(readSensorData, 5000)
     // readSensorData()
     // setTimeout(getSensorNames, 6000)


   };

   // get sensors and create form area for names
   var sId

   function readSensorJson(){
     $.ajax({
         type: 'GET',
         url: './sensorInit.json',
         dataType: 'json',
     		async: false,
     		success:   function (data){
          sId = Object.keys(data);

          let size = Object.keys(data).length;

          let sensors = "";
          for (let i = 0; i < size; i++) {
             sensors +=  "<div class='col-md-4'><p id='sId" + i +  "'></p></div><div class='col-md-4'><p id='sTemp" + i +  "'></p></div><div class='col-md-4'><input class='form-control' id='sName" + i + "'></div>"
         }
         // $("#sensor-names").append(sensors);
         document.getElementById("sensor-names").innerHTML = sensors;

     			}
     });
   };

    function readSensorData(){
     $("#sensor-area").show();
     $("#reading").hide();

     $.getJSON("./sensorInit.json", gotData);
     function gotData(data){
       // let sId = Object.keys(data);
        let temps = Object.values(data);

       for (let j =0; j<sId.length; j++){
          let id = "sId" + j;
          let temp ="sTemp" + j;
          let tempa ="#sTemp" + j;

          // console.log(id);
          document.getElementById(id).innerHTML = sId[j];
          let ch = document.getElementById(temp).innerHTML;
          console.log(ch);
          if (ch != temps[j]){
            document.getElementById(temp).innerHTML = temps[j];
            $(tempa).animate({color: '#FF0000'}, 'slow').animate({color: '#000'}, 'slow');
          }
        }
      }
    };

    //
    var saveSensorNames = document.getElementById("saveSensorNames");
    saveSensorNames.addEventListener("click",function(e){ getSensorNames(); },false);

    function getSensorNames(){
      for (let i=0; i<sId.length; i++){
        let sName = "sName" + i;
        let gName = [];
        gName[i] = document.getElementById(sName).value;
        $.getJSON("sensor/" + sId[i] + "/" + gName[i]);
      };
      alert('Sensor Names Saved')
      $.getJSON("stat/status/STOP");
      window.location.replace("./index.html");
    };


console.log(sId);

  }; // sensor ini if


/////// stopwatch
var interval = null;
var currentIncrement = 0;
var isPaused = false;
var initialised = false;
var clicked = false;
var sec = 0;


$.getJSON("./status.json", gotStat);
  function gotStat(data){
    console.log(data);
    if (data.status =="START"){
      initialiseTimer()
	  move()
    }

  }


$(".playpause").click(function(e) {
  if (clicked) {
    e.preventDefault();
    return false;
  }

  if (!initialised) {
    initialised = true;
    isPaused = false;
    $(".playpause span").removeClass();
    $(".playpause span").addClass("pause");
    initialiseTimer();
  } else {
    $(".playpause span").removeClass();
    if (isPaused) {
      isPaused = false;
      $(".playpause span").addClass("pause");
    } else {
      isPaused = true;
      $(".playpause span").addClass("play");
    }
  }
});

$(".stop").click(function() {
  reset();
});

function initialiseTimer() {
  interval = setInterval(function() {
    if (isPaused) return;
    var current = setCurrentIncrement();
    updateStopwatch(current);
	sec += 1;
	console.log(" sec: " + sec)
  }, 1000)
}

function updateStopwatch(increment) {
  var hours = Math.floor(increment / 3600);
  var minutes = Math.floor((increment - (hours * 3600)) / 60);
  var seconds = increment - (hours * 3600) - (minutes * 60);


  if(hours > 99)
    reset();

  $(".hours").text(hours < 10 ? ("0" + hours.toString()) : hours.toString())
  $(".minutes").text(minutes < 10 ? ("0" + minutes.toString()) : minutes.toString())
  $(".seconds").text(seconds < 10 ? ("0" + seconds.toString()) : seconds.toString())
}

function setCurrentIncrement() {
  currentIncrement += 1;
  return currentIncrement;
}

function reset() {
  currentIncrement = 0;
  isPaused = true;
  initialised = false;
  clearInterval(interval);
  $(".hours").text("00");
  $(".minutes").text("00");
  $(".seconds").text("00");
  $(".playpause span").removeClass();
  $(".playpause span").addClass("play");
}
//////// -- stopwatch ----

//////// bar
 function move() {
  $.getJSON("./expSetup.json", gotTime);
    function gotTime(data){
      // console.log(data);
      var expTotalTime = Number( data.expTotalTime) ;
	  // console.log(expTotalTime)
  	 
  var elem = document.getElementById("myBar");
  var end = expTotalTime * 60 // seconds
  var pers = (sec / end ) * 100
  var width = pers.toFixed(2)
   if (width >= 100) {
		elem.style.width = 100 + '%'; 
		elem.innerHTML = 100 * 1  + '%';
		var val = "STOP";
		$.getJSON("stat/status/" + val);
		location =	location;
   }else {
		elem.style.width = width + '%'; 
		elem.innerHTML = width * 1  + '%';
		}
  setTimeout(move, 1000);
}
}




	



};
