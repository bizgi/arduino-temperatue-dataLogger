
class plot {
	constructor(plotPoints) {
		this.plotPoints = plotPoints;
		this.layout = {
			paper_bgcolor : '#1f1f1f',
			plot_bgcolor : '#1f1f1f',
			// width: 800,
			height: 800,
			//title: 'Sıcaklık Dağılımı',
			legend: {
				// y: 0,
				// x: 0.2,
				orientation: "h",
				// traceorder: 'reversed',
				font: {color:'#ababab'},
			},
			margin:{
				b:150,
				l:150
			},

			xaxis: {
				showgrid: true,
				zeroline: true,
				showline: true,
				ticks: 'inside',
				mirror: 'ticks',
				tick0: 0,
				rangemode: 'tozero',
				autorange: true,
				// multiple plot
				//domain: [0, 0.45],

				title: 't [dk]',
					tickfont: {
						family: 'Old Standard TT, serif',
						// size: 30,
						color: '#ababab'
					},
					titlefont: {
						//family: 'Courier New, monospace',
						// size: 30,
						color: '#ababab'
					},
				},

			yaxis: {
				showgrid: true,
				zeroline: true,
				showline: true,
				ticks: 'inside',
				mirror: 'ticks',

				title: 'T [<sup>o</sup>C]',
				tickfont: {
					family: 'Old Standard TT, serif',
					// size: 30,
					color: '#ababab',
				},

				titlefont: {
					//	family: 'Courier New, monospace',
						// size: 30,
						color: '#ababab'
						}
			}
		};

		this.symbols = [ "square-open",  "diamond-open",  "circle-open", "circle", "diamond", "square"];
		this.colors = ["#e46a6b","#d9d9d9" , "#91c7a9", "#44B5DF", "#a2482b", "#de8d47"]
		this.saveName = this.layout['yaxis']['title'] + " - " + this.layout['xaxis']['title']

		this.xName = Object.keys(this.plotPoints[0])
		this.xPoints = this.plotPoints[0][this.xName[0]]

		this.yNames = Object.keys(this.plotPoints[1])
		this.yPoints = Object.values(this.plotPoints[1]);
		console.log(this.yPoints);
		console.log(this.yNames);

		this.data = [];

	}

	makePlot() {

		for (let i=0; i<this.yPoints.length; i++){

			var yDatas = this.yPoints[i]
			var yDataNames = this.yNames[i]


			var trace = {
				x: this.xPoints,
				y: yDatas,
				mode: 'lines+markers',
				name: yDataNames,
				marker: {
					symbol: this.symbols[i],
					color: this.colors[i],
					maxdisplayed: 20,
					size: 10
				}
			};
			this.data.push(trace);
		};

		Plotly.newPlot('plot', this.data, this.layout)
	}

	plotSave (){
		console.log(document.getElementById('plot'));



		Plotly.downloadImage(plot, {
			format: 'png',
			width: 1920,
			height: 1080,
			filename: "newPlot"
		});

		// Plotly.newPlot ('plot',this.data, this.layout, this.saveName).then(function(gd) {
		// 	Plotly.downloadImage(gd, {
		// 		format: 'png',
		// 		width: 1920,
		// 		height: 1080,
		// 		filename: "newPlot"
		// 	})
		// });



	};

	downloadData() {
		var dataNames ='';
		for (let j=0; j<this.yNames.length; j++){
			dataNames += "<td class='tborder'>" + this.yNames[j] + "</td>";
		};
		document.getElementById("plotData").innerHTML +=  "<table><tr><td class='tborder'> x </td>" + dataNames + "</tr></table>"

		var dataTableX = '';
		var dataTableY = '';

		for (let i=0; i<this.yPoints[0].length; i++){
			dataTableX += "<table><tr><td class='tborder'>" + this.xPoints[i] + "</td></tr></table>";
		};

		for (let j=0; j<this.yNames.length; j++){
			dataTableY += "<td>"
			for (let i=0; i<this.yPoints[j].length; i++){
				dataTableY += "<table><tr><td class='tborder'>" + this.yPoints[j][i] + "</td></tr></table>";
			};
			dataTableY += "</td>"
		}

		document.getElementById("plotData").innerHTML += "<table><tr><td class='tborder'>" + dataTableX + "</td>" + dataTableY + "</tr></table>"


		document.getElementById("save-Data").innerHTML = "<a href='#' name ='copy-p'>Copy all data</a>"


		$(document).ready(function(){
		 $("a[name=copy-p]").click(function() {
 			 var el = document.getElementById("plotData");
			 var range = document.createRange();
			 range.selectNodeContents(el);
			 var sel = window.getSelection();
			 sel.removeAllRanges();
			 sel.addRange(range);
			 document.execCommand('copy');
			 alert("Contents copied to clipboard.");
			 return false;
		 });
		});

		// var a = document.body.appendChild(
		// 	document.createElement("a")
		// );
		// a.download = this.saveName + ".html";
		// a.href = "data:text/html," + document.getElementById("plotData").innerHTML;
		// a.click(); //Trigger a click on the element

	};


};
