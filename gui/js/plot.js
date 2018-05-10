document.addEventListener('DOMContentLoaded', lo);

function lo(){



// get experiment status
var expStatus;
$.getJSON('./status.json', gotStatus);
	function gotStatus(status){
		expStatus = status['status'];
		// console.log(expStatus);
	};

var csv;

// put all saved experiment data into selection form
if (document.getElementById('expDataLoad') != null){
	$.getJSON("/expDir", gotData);
		function gotData(data){
			//console.log('dir', data);
			let expDatas = data['exp'];
			let opts = "";
			for (let i = 0; i < expDatas.length; i++) {
			    opts += "<option value='" + expDatas[i] + "'>" + expDatas[i] + "</option>";
			}
			$("#expDataLoad").append(opts);
			// $("#expDataLoad2").append(opts);
		};
}


// load current experiment data
var expTimeStep,
		expTotalTime


$.ajax({
    type: 'GET',
    url: './expSetup.json',
    dataType: 'json',
		async: false,
		success:   function (data){
		    var dir = data["expName"];
				expTimeStep = data["expTimeStep"];
				expTotalTime = data["expTotalTime"];

				csv = "./expData/" + dir + "/data.csv"
				if (document.getElementById('expDataLoad') == null){
					document.getElementById('display').innerHTML = dir;
				}
			}
});



 	// show saved experiment data
	function showPlotValues() {
		// document.getElementById('plotValues').innerHTML = "";

		let value =  $('#expDataLoad').val();
		csv = "./expData/" + value + "/data.csv"

		console.log(csv);
		let plotPoints = processData(csv)
		console.log(plotPoints);
		plotDash = new plot(plotPoints)
		plotDash.makePlot();
		plotDash.downloadData();

	};


if (document.getElementById('expDataLoad') != null){
	document.getElementById('expDataLoad').addEventListener('change', showPlotValues);

};

// console.log(csv);
// var csv = "./data.csv";



function processData(csv) {
	var rawCsv;
	$.ajax({
			type: 'GET',
			url: csv,
			dataType: 'text',
			async: false,
			success:   function (data){
				rawCsv = data
				// console.log( data);
				}
	});

	var rawLines = rawCsv.split('\r\n');
	var csvHead = rawLines[0].split(',');

	var csvDatas = [];
	for (var k=1; k<rawLines.length-1; k++){
		var dataLine = {};
		for (var j=0; j<csvHead.length; j++){
			dataLine[csvHead[j]] = rawLines[k].split(',')[j];
		};
		csvDatas.push(dataLine);
	};

	allRows = csvDatas;
   // console.log(allRows);
		//console.log(allRows[0]["id"]);

	// get sensorNames
	var sensorNames = [];
	$.ajax({
	    type: 'GET',
	    url: './config.json',
	    dataType: 'json',
			async: false,
			success:   function (data){
					for (let i=0; i<Object.values(data).length; i++){
						sensorNames.push( Object.values(data)[i]) ;
					};
				}
	});

  var x = {},
			y = {}

	for (let i=0; i<sensorNames.length; i++){
		y[sensorNames[i]] = []
	};

	x['time'] = [];

	//var t_end = Number(allRows[allRows.length-1]["time"]);
	//console.log(t_end);
	var t_end = Number(expTotalTime);
	var timeStep = 0;

  for (var i=0; i<allRows.length; i++) {
      row = allRows[i];
		//	var formatedTime = new Date(Number(row["time"]));
		//console.log(time);
		//	var time =  Number(row["time"]);
		//x.push(time);

		// x axis values - 5 min
		x['time'].push(timeStep);
		timeStep = timeStep + Number(expTimeStep);

		// y-axis values
		for (let j=0; j<sensorNames.length; j++){
				if (row["id"] == sensorNames[j]) {
					y[sensorNames[j]].push(row["temp"])
				}
		};
	};

	// console.log(plotPoints);
	var plotPoints = [x, y];
	return plotPoints;

};


	// function richardson(t_top, t_bottom){
	// 	const g = 9.81;
	// 	const beta = 0.000247;
	// 	const H = 0.8;
	// 	var V = 0.2;
	//
	// 	var ri = ((g * beta * H * (t_top - t_bottom)) / (V*V)).toFixed(6) ;
	// 	//console.log(ri);
	// 	return ri
	// };


if (document.getElementById('expDataLoad') == null){
	let plotPoints = processData(csv)
	console.log(plotPoints);
	plotDash = new plot(plotPoints)
	plotDash.makePlot();
	// makePlotly(plotPoints);

}

// $('#plot').animate({ 'zoom': 0.6 }, 40);

/// temperatures
function getData() {

	var dashValues;
	$.ajax({
	    type: 'GET',
	    url: './data.json',
	    dataType: 'json',
			async: false,
			success:   function (data){
 				dashValues = data;
				}
	});

	let ids = Object.keys(dashValues)
	let vals = Object.values(dashValues)
	// console.log(vals);
	 var templ ="";


	for (let i=0; i<ids.length; i++){
		 templ += "<div class='col-md-6'><p id='sId" + i +  "'></p></div><div class='col-md-6'><p id='sTemp" + i +  "'></p></div>"
	};
	document.getElementById('dash-temps').innerHTML = templ;


	function readDatas() {
		$.getJSON("./data.json", gotData);
		function gotData(data){
			let sId = Object.keys(data);
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
			setTimeout(readDatas, 5000);

			if (document.getElementById('expDataLoad') == null){
				if (expStatus  == 'START') {
					// setTimeout(getData, 5000);
					function ref(){
						let plotPoints = processData(csv)
						console.log('ddddddd',plotPoints);
						plotDash = new plot(plotPoints)
						plotDash.makePlot();
					}
					setTimeout(ref, 5000);
				}

			}

	}

		readDatas()

 };

 if (document.getElementById('expDataLoad') == null){
getData(); // run once to start it

}

// setInterval(ciz, 5000);
// var autoRef2 = document.getElementById("onoff").value;
// if (autoRef2 == "On") {
// 		setInterval(ciz, 5000);
// 	};
}
