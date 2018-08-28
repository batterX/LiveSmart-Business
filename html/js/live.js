// Get Device Model
var model = "";





// Device Model Details
var solarContNum = 1;
var solarNum = 4;
var batteryNum = 2;
var gridNum = 3;
var loadNum = 3;





// Get Device Model
// Update Device Image + Label
$.ajax({
	type: "POST",
	url: "db-interaction/data.php",
	data: {
		"action": "getDeviceModel"
	},
	success: function (response) {
		if(response) {
			switch(response.toLowerCase()) {
				case 'batterx h3':
					$(".device").css("background-image", "url('img/device-h3.png')");
					$(".bottom-right .img-label").css("background-image", "url(img/img-load.png)");
					$("#load .inside").css("background-image", "url(img/bg-load.png)");
					$("#load .inside-info").css("background-image", "linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)), url(img/bg-load.png)");
					model = response.toLowerCase();
					break;
				case 'batterx h5':
					$(".device").css("background-image", "url('img/device-h5.png')");
					$(".bottom-right .img-label").css("background-image", "url(img/img-load.png)");
					$("#load .inside").css("background-image", "url(img/bg-load.png)");
					$("#load .inside-info").css("background-image", "linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)), url(img/bg-load.png)");
					model = response.toLowerCase();
					break;
				case 'batterx h5-eco':
					$(".device").css("background-image", "url('img/device-h5e.png')");
					$(".bottom-right .img-label").css("background-image", "url(img/img-load.png)");
					$("#load .inside").css("background", "url(img/bg-load.png)");
					$("#load .inside-info").css("background-image", "linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)), url(img/bg-load.png)");
					model = response.toLowerCase();
					break;
				case 'batterx h10':
					$(".device").css("background-image", "url('img/device-h10.png')");
					$(".bottom-right .img-label").css("background-image", "url(img/img-load.png)");
					$("#load .inside").css("background-image", "url(img/bg-load.png)");
					$("#load .inside-info").css("background-image", "linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)), url(img/bg-load.png)");
					model = response.toLowerCase();
					break;
				case 'batterx bs':
					$(".device").css("background-image", "url('img/device-bs.png')");
					$(".bottom-right .img-label").css("background-image", "url(img/img-load-bs.png)");
					$("#load .inside").css("background-image", "url(img/bg-load-bs.png)");
					$("#load .inside-info").css("background-image", "linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)), url(img/bg-load-bs.png)");
					model = response.toLowerCase();
					break;
				default:
					$(".device").css("background-image", "url('img/device-h5.png')");
					$(".bottom-right .img-label").css("background-image", "url(img/img-load.png)");
					$("#load .inside").css("background-image", "url(img/bg-load.png)");
					$("#load .inside-info").css("background-image", "linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)), url(img/bg-load.png)");
					model = "batterx h5";
					break;
			}
		}
	}
});





// Set Device OnClick Listener
$('#device').click(function() {
	if($('#deviceMain').css('display') != 'none') {
		$('#deviceMain').fadeToggle();
		$('#deviceInfo1').fadeToggle();
	} else if($('#deviceInfo1').css('display') != 'none') {
		$('#deviceInfo1').fadeToggle();
		if(model == 'batterx bs') $('#deviceInfo2').fadeToggle();
		else $('#deviceMain').fadeToggle();
	} else if($('#deviceInfo2').css('display') != 'none') {
		$('#deviceInfo2').fadeToggle();
		$('#deviceMain').fadeToggle();
	}
});





// Set Solar OnClick Listener
$('#solar').click(function() {
	if($('#solarPower').css('display') != 'none') {
		if(solarContNum == 1) {
			$('#solarPower').fadeToggle();
			$('#solarInfo1').fadeToggle();
		} else {
			$(".modal").modal('show');
		}
	} else if($('#solarInfo1').css('display') != 'none') {
		$('#solarInfo1').fadeToggle();
		if(solarNum > 1) $('#solarInfo2').fadeToggle();
		else $('#solarPower').fadeToggle();
	} else if($('#solarInfo2').css('display') != 'none') {
		$('#solarInfo2').fadeToggle();
		if(solarNum > 2) $('#solarInfo3').fadeToggle();
		else $('#solarPower').fadeToggle();
	} else if($('#solarInfo3').css('display') != 'none') {
		$('#solarInfo3').fadeToggle(); 
		if(solarNum > 3) $('#solarInfo4').fadeToggle();
		else $('#solarPower').fadeToggle();
	} else if($('#solarInfo4').css('display') != 'none') {
		$('#solarInfo4').fadeToggle();
		$('#solarPower').fadeToggle();
	}
});

$('#controller1').click(function() {
	if($('#controller1Power').css('display') != 'none')      { $('#controller1Power').fadeToggle(); $('#controllerInfo11').fadeToggle(); }
	else if($('#controllerInfo11').css('display') != 'none') { $('#controllerInfo11').fadeToggle(); $('#controllerInfo12').fadeToggle(); }
	else if($('#controllerInfo12').css('display') != 'none') { $('#controllerInfo12').fadeToggle(); $('#controllerInfo13').fadeToggle(); }
	else if($('#controllerInfo13').css('display') != 'none') { $('#controllerInfo13').fadeToggle(); $('#controllerInfo14').fadeToggle(); }
	else if($('#controllerInfo14').css('display') != 'none') { $('#controllerInfo14').fadeToggle(); $('#controller1Power').fadeToggle(); }
});
$('#controller2').click(function() {
	if($('#controller2Power').css('display') != 'none')      { $('#controller2Power').fadeToggle(); $('#controllerInfo21').fadeToggle(); }
	else if($('#controllerInfo21').css('display') != 'none') { $('#controllerInfo21').fadeToggle(); $('#controllerInfo22').fadeToggle(); }
	else if($('#controllerInfo22').css('display') != 'none') { $('#controllerInfo22').fadeToggle(); $('#controllerInfo23').fadeToggle(); }
	else if($('#controllerInfo23').css('display') != 'none') { $('#controllerInfo23').fadeToggle(); $('#controllerInfo24').fadeToggle(); }
	else if($('#controllerInfo24').css('display') != 'none') { $('#controllerInfo24').fadeToggle(); $('#controller2Power').fadeToggle(); }
});
$('#controller3').click(function() {
	if($('#controller3Power').css('display') != 'none')      { $('#controller3Power').fadeToggle(); $('#controllerInfo31').fadeToggle(); }
	else if($('#controllerInfo31').css('display') != 'none') { $('#controllerInfo31').fadeToggle(); $('#controllerInfo32').fadeToggle(); }
	else if($('#controllerInfo32').css('display') != 'none') { $('#controllerInfo32').fadeToggle(); $('#controllerInfo33').fadeToggle(); }
	else if($('#controllerInfo33').css('display') != 'none') { $('#controllerInfo33').fadeToggle(); $('#controllerInfo34').fadeToggle(); }
	else if($('#controllerInfo34').css('display') != 'none') { $('#controllerInfo34').fadeToggle(); $('#controller3Power').fadeToggle(); }
});
$('#controller4').click(function() {
	if($('#controller4Power').css('display') != 'none')      { $('#controller4Power').fadeToggle(); $('#controllerInfo41').fadeToggle(); }
	else if($('#controllerInfo41').css('display') != 'none') { $('#controllerInfo41').fadeToggle(); $('#controllerInfo42').fadeToggle(); }
	else if($('#controllerInfo42').css('display') != 'none') { $('#controllerInfo42').fadeToggle(); $('#controllerInfo43').fadeToggle(); }
	else if($('#controllerInfo43').css('display') != 'none') { $('#controllerInfo43').fadeToggle(); $('#controllerInfo44').fadeToggle(); }
	else if($('#controllerInfo44').css('display') != 'none') { $('#controllerInfo44').fadeToggle(); $('#controller4Power').fadeToggle(); }
});
$('#controller5').click(function() {
	if($('#controller5Power').css('display') != 'none')      { $('#controller5Power').fadeToggle(); $('#controllerInfo51').fadeToggle(); }
	else if($('#controllerInfo51').css('display') != 'none') { $('#controllerInfo51').fadeToggle(); $('#controllerInfo52').fadeToggle(); }
	else if($('#controllerInfo52').css('display') != 'none') { $('#controllerInfo52').fadeToggle(); $('#controllerInfo53').fadeToggle(); }
	else if($('#controllerInfo53').css('display') != 'none') { $('#controllerInfo53').fadeToggle(); $('#controllerInfo54').fadeToggle(); }
	else if($('#controllerInfo54').css('display') != 'none') { $('#controllerInfo54').fadeToggle(); $('#controller5Power').fadeToggle(); }
});
$('#controller6').click(function() {
	if($('#controller6Power').css('display') != 'none')      { $('#controller6Power').fadeToggle(); $('#controllerInfo61').fadeToggle(); }
	else if($('#controllerInfo61').css('display') != 'none') { $('#controllerInfo61').fadeToggle(); $('#controllerInfo62').fadeToggle(); }
	else if($('#controllerInfo62').css('display') != 'none') { $('#controllerInfo62').fadeToggle(); $('#controllerInfo63').fadeToggle(); }
	else if($('#controllerInfo63').css('display') != 'none') { $('#controllerInfo63').fadeToggle(); $('#controllerInfo64').fadeToggle(); }
	else if($('#controllerInfo64').css('display') != 'none') { $('#controllerInfo64').fadeToggle(); $('#controller6Power').fadeToggle(); }
});
$('#controller7').click(function() {
	if($('#controller7Power').css('display') != 'none')      { $('#controller7Power').fadeToggle(); $('#controllerInfo71').fadeToggle(); }
	else if($('#controllerInfo71').css('display') != 'none') { $('#controllerInfo71').fadeToggle(); $('#controllerInfo72').fadeToggle(); }
	else if($('#controllerInfo72').css('display') != 'none') { $('#controllerInfo72').fadeToggle(); $('#controllerInfo73').fadeToggle(); }
	else if($('#controllerInfo73').css('display') != 'none') { $('#controllerInfo73').fadeToggle(); $('#controllerInfo74').fadeToggle(); }
	else if($('#controllerInfo74').css('display') != 'none') { $('#controllerInfo74').fadeToggle(); $('#controller7Power').fadeToggle(); }
});
$('#controller8').click(function() {
	if($('#controller8Power').css('display') != 'none')      { $('#controller8Power').fadeToggle(); $('#controllerInfo81').fadeToggle(); }
	else if($('#controllerInfo81').css('display') != 'none') { $('#controllerInfo81').fadeToggle(); $('#controllerInfo82').fadeToggle(); }
	else if($('#controllerInfo82').css('display') != 'none') { $('#controllerInfo82').fadeToggle(); $('#controllerInfo83').fadeToggle(); }
	else if($('#controllerInfo83').css('display') != 'none') { $('#controllerInfo83').fadeToggle(); $('#controllerInfo84').fadeToggle(); }
	else if($('#controllerInfo84').css('display') != 'none') { $('#controllerInfo84').fadeToggle(); $('#controller8Power').fadeToggle(); }
});





// Set Battery OnClick Listener
$('#battery').click(function() {
	if($('#batteryPower').css('display') != 'none') {
		$('#batteryPower').fadeToggle();
		$('#batteryInfo1').fadeToggle();
	} else if($('#batteryInfo1').css('display') != 'none') {
		$('#batteryInfo1').fadeToggle();
		if(batteryNum > 1) $('#batteryInfo2').fadeToggle();
		else $('#batteryPower').fadeToggle();
	} else if($('#batteryInfo2').css('display') != 'none') {
		$('#batteryInfo2').fadeToggle();
		$('#batteryPower').fadeToggle();
	}
});





// Set Grid OnClick Listener
$('#grid').click(function() {
	if($('#gridPower').css('display') != 'none') {
		$('#gridPower').fadeToggle();
		$('#gridInfo1').fadeToggle();
	} else if($('#gridInfo1').css('display') != 'none') {
		$('#gridInfo1').fadeToggle();
		if(gridNum > 1) $('#gridInfo2').fadeToggle();
		else $('#gridPower').fadeToggle();
	} else if($('#gridInfo2').css('display') != 'none') {
		$('#gridInfo2').fadeToggle();
		if(gridNum > 2) $('#gridInfo3').fadeToggle();
		else $('#gridPower').fadeToggle();
	} else if($('#gridInfo3').css('display') != 'none') {
		$('#gridInfo3').fadeToggle();
		$('#gridPower').fadeToggle();
	}
});





// Set Load OnClick Listener
$('#load').click(function() {
	if($('#loadPower').css('display') != 'none') {
		$('#loadPower').fadeToggle();
		$('#loadInfo1').fadeToggle();
	} else if($('#loadInfo1').css('display') != 'none') {
		$('#loadInfo1').fadeToggle();
		if(loadNum > 1) $('#loadInfo2').fadeToggle();
		else $('#loadPower').fadeToggle();
	} else if($('#loadInfo2').css('display') != 'none') {
		$('#loadInfo2').fadeToggle();
		if(loadNum > 2) $('#loadInfo3').fadeToggle();
		else $('#loadPower').fadeToggle();
	} else if($('#loadInfo3').css('display') != 'none') {
		$('#loadInfo3').fadeToggle();
		$('#loadPower').fadeToggle();
	}
});





// Fade-Toggle All Arrows Every 1 Second
setInterval(function() { $(".arrow-line").fadeToggle(1000); }, 900);





// Middle Section ProgressBar Design
var bar = new ProgressBar.Circle(progressBar, {
	color: '#87d403',
	trailColor: '#7b7b7b',
	strokeWidth: 4,
	trailWidth: 4,
	easing: 'easeInOut',
	duration: 5000,
	text: {
		style: {
			color: '#ffffff',
			position: 'absolute',
			left: '50%',
			top: '50%',
			padding: 0,
			margin: 0,
			fontFamily: "'Raleway'",
			transform: {
				prefix: true,
				value: 'translate(-50%, -50%)'
			}
		},
		autoStyleContainer: false
	},
	svgStyle: {
		transform: 'rotate(180deg)',
		display: 'block',
		width: '100%'
	},
	fill: '#000000',
	from: { color: '#ff0000', width: 4 },
	to: { color: '#87d403', width: 4 },
	step: function(state, circle) {
		circle.path.setAttribute('stroke', state.color);
		circle.path.setAttribute('stroke-width', state.width);
		// Set Value Inside Circle
		var value = Math.round(circle.value() * 100);
		circle.setText(value.toString() + "<sup>%</sup>");
	}
});





// Start Main Loop Function
// Handles Updating the Fields within the Page
// Loop - Long Polling - Every 5 seconds
mainLoop();
function mainLoop() {
	
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: { 
			"action": "getCurrentState" 
		},
		complete: function (data) {
			// Long Polling Every 5 Seconds
			setTimeout(function() { mainLoop(); }, 5000);
			// Fade Out the Overlay (Visible only on first run)
			$('.overlay').fadeOut();
		},
		success: function (response) {
			
			
			
			
			
			// Format Response To JSON
			var json = JSON.parse(response);
			
			
			
			
			
			// Update Last Timestamp in Index.php
			window.parent.updateLastTimestamp(json["273"][Object.keys(json["273"])[0]]['logtime']);
			
			
			
			
			
			// Update Fault Notification Bar
			if(json.hasOwnProperty("16385") && json.hasOwnProperty("16386"))
				window.parent.updateFaultStatus(
					parseInt(json["16385"][Object.keys(json["16385"])[0]]["entityvalue"]),
					parseInt(json["16386"][Object.keys(json["16386"])[0]]["entityvalue"]),
					json["16386"][Object.keys(json["16386"])[0]]["logtime"]
				);
			
			
			
			
			
			// Update Solar Section
			
			if(json.hasOwnProperty("1553")) {
				solarContNum = Object.keys(json["1553"]).length;
				solarNum = 1;
			}
			
			if(solarContNum == 1) {
				if(json.hasOwnProperty("1554")) solarNum += 1;
				if(json.hasOwnProperty("1555")) solarNum += 1;
				if(json.hasOwnProperty("1556")) solarNum += 1;
			}
			
			if(solarContNum == 1) {
				solarVoltage1 = 0; solarVoltage2 = 0; solarVoltage3 = 0; solarVoltage4 = 0;
				if(json.hasOwnProperty("1553")) solarVoltage1 = round(parseInt(json["1553"][Object.keys(json["1553"])[0]]["entityvalue"])*0.01, 0);
				if(json.hasOwnProperty("1554")) solarVoltage2 = round(parseInt(json["1554"][Object.keys(json["1554"])[0]]["entityvalue"])*0.01, 0);
				if(json.hasOwnProperty("1555")) solarVoltage3 = round(parseInt(json["1555"][Object.keys(json["1555"])[0]]["entityvalue"])*0.01, 0);
				if(json.hasOwnProperty("1556")) solarVoltage4 = round(parseInt(json["1556"][Object.keys(json["1556"])[0]]["entityvalue"])*0.01, 0);
				if(solarVoltage1 > 1 || solarVoltage2 > 1 || solarVoltage3 > 1 || solarVoltage4 > 1) 
					$(".top-left").css("visibility", "visible");
				else 
					$(".top-left").css("visibility", "hidden");
			} else if(solarContNum > 1) {
				$(".top-left").css("visibility", "visible");
				$("#controller1").css("display", "block");
				$("#controller2").css("display", "block");
				if(solarContNum > 2) $("#controller3").css("display", "block");
				if(solarContNum > 3) $("#controller4").css("display", "block");
				if(solarContNum > 4) $("#controller5").css("display", "block");
				if(solarContNum > 5) $("#controller6").css("display", "block");
				if(solarContNum > 6) $("#controller7").css("display", "block");
				if(solarContNum > 7) $("#controller8").css("display", "block");
			}
			
			if(solarContNum == 1 && solarNum == 1) $("#solarInfo1 h2").html("SOLAR");
			
			if(json.hasOwnProperty("1634")) { 
				$('#solarPowerTotal').html(round(parseInt(json["1634"]["0"]["entityvalue"]), 1).toString() + " W");
				if(parseInt(json["1634"]["0"]["entityvalue"]) > 1) 
					$(".top-left .arrow-line").css("visibility", "visible");
				else 
					$(".top-left .arrow-line").css("visibility", "hidden");
			}
			
			if(solarContNum == 1) 
			{
				if(json.hasOwnProperty("1553")) {
					if(json.hasOwnProperty("1553")) $('#solarVoltage1').html(round(parseInt(json["1553"][Object.keys(json["1553"])[0]]["entityvalue"])*0.01, 0).toString() + " V");
					if(json.hasOwnProperty("1569")) $('#solarCurrent1').html(round(parseInt(json["1569"][Object.keys(json["1569"])[0]]["entityvalue"])*0.01, 1).toString() + " A");
					if(json.hasOwnProperty("1617")) $('#solarPower1').html(round(parseInt(json["1617"][Object.keys(json["1617"])[0]]["entityvalue"]), 1).toString() + " W");
				}
				if(json.hasOwnProperty("1554")) {
					if(json.hasOwnProperty("1554")) $('#solarVoltage2').html(round(parseInt(json["1554"][Object.keys(json["1554"])[0]]["entityvalue"])*0.01, 0).toString() + " V");
					if(json.hasOwnProperty("1570")) $('#solarCurrent2').html(round(parseInt(json["1570"][Object.keys(json["1570"])[0]]["entityvalue"])*0.01, 1).toString() + " A");
					if(json.hasOwnProperty("1618")) $('#solarPower2').html(round(parseInt(json["1618"][Object.keys(json["1618"])[0]]["entityvalue"]), 1).toString() + " W");
				}
				if(json.hasOwnProperty("1555")) {
					if(json.hasOwnProperty("1555")) $('#solarVoltage3').html(round(parseInt(json["1555"][Object.keys(json["1555"])[0]]["entityvalue"])*0.01, 0).toString() + " V");
					if(json.hasOwnProperty("1571")) $('#solarCurrent3').html(round(parseInt(json["1571"][Object.keys(json["1571"])[0]]["entityvalue"])*0.01, 1).toString() + " A");
					if(json.hasOwnProperty("1619")) $('#solarPower3').html(round(parseInt(json["1619"][Object.keys(json["1619"])[0]]["entityvalue"]), 1).toString() + " W");
				}
				if(json.hasOwnProperty("1556")) {
					if(json.hasOwnProperty("1556")) $('#solarVoltage4').html(round(parseInt(json["1556"][Object.keys(json["1556"])[0]]["entityvalue"])*0.01, 0).toString() + " V");
					if(json.hasOwnProperty("1572")) $('#solarCurrent4').html(round(parseInt(json["1572"][Object.keys(json["1572"])[0]]["entityvalue"])*0.01, 1).toString() + " A");
					if(json.hasOwnProperty("1620")) $('#solarPower4').html(round(parseInt(json["1620"][Object.keys(json["1620"])[0]]["entityvalue"]), 1).toString() + " W");
				}
			}
			else if(solarContNum > 1)
			{
				// Solar Power X Total
				if(json.hasOwnProperty("1633")) {
					if(json["1633"].hasOwnProperty("1")) $('#controller1PowerTotal').html(round(parseInt(json["1633"]["1"]["entityvalue"]), 1).toString() + " W");
					if(json["1633"].hasOwnProperty("2")) $('#controller2PowerTotal').html(round(parseInt(json["1633"]["2"]["entityvalue"]), 1).toString() + " W");
					if(json["1633"].hasOwnProperty("3")) $('#controller3PowerTotal').html(round(parseInt(json["1633"]["3"]["entityvalue"]), 1).toString() + " W");
					if(json["1633"].hasOwnProperty("4")) $('#controller4PowerTotal').html(round(parseInt(json["1633"]["4"]["entityvalue"]), 1).toString() + " W");
					if(json["1633"].hasOwnProperty("5")) $('#controller5PowerTotal').html(round(parseInt(json["1633"]["5"]["entityvalue"]), 1).toString() + " W");
					if(json["1633"].hasOwnProperty("6")) $('#controller6PowerTotal').html(round(parseInt(json["1633"]["6"]["entityvalue"]), 1).toString() + " W");
					if(json["1633"].hasOwnProperty("7")) $('#controller7PowerTotal').html(round(parseInt(json["1633"]["7"]["entityvalue"]), 1).toString() + " W");
					if(json["1633"].hasOwnProperty("8")) $('#controller8PowerTotal').html(round(parseInt(json["1633"]["8"]["entityvalue"]), 1).toString() + " W");
				}

				// Solar Voltage X-1
				if(json.hasOwnProperty("1553")) {
					if(json["1553"].hasOwnProperty("1")) $('#controllerVoltage11').html(round(parseInt(json["1553"]["1"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1553"].hasOwnProperty("2")) $('#controllerVoltage21').html(round(parseInt(json["1553"]["2"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1553"].hasOwnProperty("3")) $('#controllerVoltage31').html(round(parseInt(json["1553"]["3"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1553"].hasOwnProperty("4")) $('#controllerVoltage41').html(round(parseInt(json["1553"]["4"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1553"].hasOwnProperty("5")) $('#controllerVoltage51').html(round(parseInt(json["1553"]["5"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1553"].hasOwnProperty("6")) $('#controllerVoltage61').html(round(parseInt(json["1553"]["6"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1553"].hasOwnProperty("7")) $('#controllerVoltage71').html(round(parseInt(json["1553"]["7"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1553"].hasOwnProperty("8")) $('#controllerVoltage81').html(round(parseInt(json["1553"]["8"]["entityvalue"])*0.01, 0).toString() + " V");
				}
				// Solar Voltage X-2
				if(json.hasOwnProperty("1554")) {
					if(json["1554"].hasOwnProperty("1")) $('#controllerVoltage12').html(round(parseInt(json["1554"]["1"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1554"].hasOwnProperty("2")) $('#controllerVoltage22').html(round(parseInt(json["1554"]["2"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1554"].hasOwnProperty("3")) $('#controllerVoltage32').html(round(parseInt(json["1554"]["3"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1554"].hasOwnProperty("4")) $('#controllerVoltage42').html(round(parseInt(json["1554"]["4"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1554"].hasOwnProperty("5")) $('#controllerVoltage52').html(round(parseInt(json["1554"]["5"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1554"].hasOwnProperty("6")) $('#controllerVoltage62').html(round(parseInt(json["1554"]["6"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1554"].hasOwnProperty("7")) $('#controllerVoltage72').html(round(parseInt(json["1554"]["7"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1554"].hasOwnProperty("8")) $('#controllerVoltage82').html(round(parseInt(json["1554"]["8"]["entityvalue"])*0.01, 0).toString() + " V");
				}
				// Solar Voltage X-3
				if(json.hasOwnProperty("1555")) {
					if(json["1555"].hasOwnProperty("1")) $('#controllerVoltage13').html(round(parseInt(json["1555"]["1"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1555"].hasOwnProperty("2")) $('#controllerVoltage23').html(round(parseInt(json["1555"]["2"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1555"].hasOwnProperty("3")) $('#controllerVoltage33').html(round(parseInt(json["1555"]["3"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1555"].hasOwnProperty("4")) $('#controllerVoltage43').html(round(parseInt(json["1555"]["4"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1555"].hasOwnProperty("5")) $('#controllerVoltage53').html(round(parseInt(json["1555"]["5"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1555"].hasOwnProperty("6")) $('#controllerVoltage63').html(round(parseInt(json["1555"]["6"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1555"].hasOwnProperty("7")) $('#controllerVoltage73').html(round(parseInt(json["1555"]["7"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1555"].hasOwnProperty("8")) $('#controllerVoltage83').html(round(parseInt(json["1555"]["8"]["entityvalue"])*0.01, 0).toString() + " V");
				}
				// Solar Voltage X-4
				if(json.hasOwnProperty("1556")) {
					if(json["1556"].hasOwnProperty("1")) $('#controllerVoltage14').html(round(parseInt(json["1556"]["1"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1556"].hasOwnProperty("2")) $('#controllerVoltage24').html(round(parseInt(json["1556"]["2"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1556"].hasOwnProperty("3")) $('#controllerVoltage34').html(round(parseInt(json["1556"]["3"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1556"].hasOwnProperty("4")) $('#controllerVoltage44').html(round(parseInt(json["1556"]["4"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1556"].hasOwnProperty("5")) $('#controllerVoltage54').html(round(parseInt(json["1556"]["5"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1556"].hasOwnProperty("6")) $('#controllerVoltage64').html(round(parseInt(json["1556"]["6"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1556"].hasOwnProperty("7")) $('#controllerVoltage74').html(round(parseInt(json["1556"]["7"]["entityvalue"])*0.01, 0).toString() + " V");
					if(json["1556"].hasOwnProperty("8")) $('#controllerVoltage84').html(round(parseInt(json["1556"]["8"]["entityvalue"])*0.01, 0).toString() + " V");
				}

				// Solar Current X-1
				if(json.hasOwnProperty("1569")) {
					if(json["1569"].hasOwnProperty("1")) $('#controllerCurrent11').html(round(parseInt(json["1569"]["1"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1569"].hasOwnProperty("2")) $('#controllerCurrent21').html(round(parseInt(json["1569"]["2"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1569"].hasOwnProperty("3")) $('#controllerCurrent31').html(round(parseInt(json["1569"]["3"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1569"].hasOwnProperty("4")) $('#controllerCurrent41').html(round(parseInt(json["1569"]["4"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1569"].hasOwnProperty("5")) $('#controllerCurrent51').html(round(parseInt(json["1569"]["5"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1569"].hasOwnProperty("6")) $('#controllerCurrent61').html(round(parseInt(json["1569"]["6"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1569"].hasOwnProperty("7")) $('#controllerCurrent71').html(round(parseInt(json["1569"]["7"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1569"].hasOwnProperty("8")) $('#controllerCurrent81').html(round(parseInt(json["1569"]["8"]["entityvalue"])*0.01, 1).toString() + " A");
				}
				// Solar Current X-2
				if(json.hasOwnProperty("1570")) {
					if(json["1570"].hasOwnProperty("1")) $('#controllerCurrent12').html(round(parseInt(json["1570"]["1"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1570"].hasOwnProperty("2")) $('#controllerCurrent22').html(round(parseInt(json["1570"]["2"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1570"].hasOwnProperty("3")) $('#controllerCurrent32').html(round(parseInt(json["1570"]["3"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1570"].hasOwnProperty("4")) $('#controllerCurrent42').html(round(parseInt(json["1570"]["4"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1570"].hasOwnProperty("5")) $('#controllerCurrent52').html(round(parseInt(json["1570"]["5"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1570"].hasOwnProperty("6")) $('#controllerCurrent62').html(round(parseInt(json["1570"]["6"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1570"].hasOwnProperty("7")) $('#controllerCurrent72').html(round(parseInt(json["1570"]["7"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1570"].hasOwnProperty("8")) $('#controllerCurrent82').html(round(parseInt(json["1570"]["8"]["entityvalue"])*0.01, 1).toString() + " A");
				}
				// Solar Current X-3
				if(json.hasOwnProperty("1571")) {
					if(json["1571"].hasOwnProperty("1")) $('#controllerCurrent13').html(round(parseInt(json["1571"]["1"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1571"].hasOwnProperty("2")) $('#controllerCurrent23').html(round(parseInt(json["1571"]["2"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1571"].hasOwnProperty("3")) $('#controllerCurrent33').html(round(parseInt(json["1571"]["3"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1571"].hasOwnProperty("4")) $('#controllerCurrent43').html(round(parseInt(json["1571"]["4"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1571"].hasOwnProperty("5")) $('#controllerCurrent53').html(round(parseInt(json["1571"]["5"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1571"].hasOwnProperty("6")) $('#controllerCurrent63').html(round(parseInt(json["1571"]["6"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1571"].hasOwnProperty("7")) $('#controllerCurrent73').html(round(parseInt(json["1571"]["7"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1571"].hasOwnProperty("8")) $('#controllerCurrent83').html(round(parseInt(json["1571"]["8"]["entityvalue"])*0.01, 1).toString() + " A");
				}
				// Solar Current X-4
				if(json.hasOwnProperty("1572")) {
					if(json["1572"].hasOwnProperty("1")) $('#controllerCurrent14').html(round(parseInt(json["1572"]["1"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1572"].hasOwnProperty("2")) $('#controllerCurrent24').html(round(parseInt(json["1572"]["2"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1572"].hasOwnProperty("3")) $('#controllerCurrent34').html(round(parseInt(json["1572"]["3"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1572"].hasOwnProperty("4")) $('#controllerCurrent44').html(round(parseInt(json["1572"]["4"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1572"].hasOwnProperty("5")) $('#controllerCurrent54').html(round(parseInt(json["1572"]["5"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1572"].hasOwnProperty("6")) $('#controllerCurrent64').html(round(parseInt(json["1572"]["6"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1572"].hasOwnProperty("7")) $('#controllerCurrent74').html(round(parseInt(json["1572"]["7"]["entityvalue"])*0.01, 1).toString() + " A");
					if(json["1572"].hasOwnProperty("8")) $('#controllerCurrent84').html(round(parseInt(json["1572"]["8"]["entityvalue"])*0.01, 1).toString() + " A");
				}

				// Solar Power X-1
				if(json.hasOwnProperty("1617")) {
					if(json["1617"].hasOwnProperty("1")) $('#controllerPower11').html(round(parseInt(json["1617"]["1"]["entityvalue"]), 1).toString() + " W");
					if(json["1617"].hasOwnProperty("2")) $('#controllerPower21').html(round(parseInt(json["1617"]["2"]["entityvalue"]), 1).toString() + " W");
					if(json["1617"].hasOwnProperty("3")) $('#controllerPower31').html(round(parseInt(json["1617"]["3"]["entityvalue"]), 1).toString() + " W");
					if(json["1617"].hasOwnProperty("4")) $('#controllerPower41').html(round(parseInt(json["1617"]["4"]["entityvalue"]), 1).toString() + " W");
					if(json["1617"].hasOwnProperty("5")) $('#controllerPower51').html(round(parseInt(json["1617"]["5"]["entityvalue"]), 1).toString() + " W");
					if(json["1617"].hasOwnProperty("6")) $('#controllerPower61').html(round(parseInt(json["1617"]["6"]["entityvalue"]), 1).toString() + " W");
					if(json["1617"].hasOwnProperty("7")) $('#controllerPower71').html(round(parseInt(json["1617"]["7"]["entityvalue"]), 1).toString() + " W");
					if(json["1617"].hasOwnProperty("8")) $('#controllerPower81').html(round(parseInt(json["1617"]["8"]["entityvalue"]), 1).toString() + " W");
				}
				// Solar Power X-2
				if(json.hasOwnProperty("1618")) {
					if(json["1618"].hasOwnProperty("1")) $('#controllerPower12').html(round(parseInt(json["1618"]["1"]["entityvalue"]), 1).toString() + " W");
					if(json["1618"].hasOwnProperty("2")) $('#controllerPower22').html(round(parseInt(json["1618"]["2"]["entityvalue"]), 1).toString() + " W");
					if(json["1618"].hasOwnProperty("3")) $('#controllerPower32').html(round(parseInt(json["1618"]["3"]["entityvalue"]), 1).toString() + " W");
					if(json["1618"].hasOwnProperty("4")) $('#controllerPower42').html(round(parseInt(json["1618"]["4"]["entityvalue"]), 1).toString() + " W");
					if(json["1618"].hasOwnProperty("5")) $('#controllerPower52').html(round(parseInt(json["1618"]["5"]["entityvalue"]), 1).toString() + " W");
					if(json["1618"].hasOwnProperty("6")) $('#controllerPower62').html(round(parseInt(json["1618"]["6"]["entityvalue"]), 1).toString() + " W");
					if(json["1618"].hasOwnProperty("7")) $('#controllerPower72').html(round(parseInt(json["1618"]["7"]["entityvalue"]), 1).toString() + " W");
					if(json["1618"].hasOwnProperty("8")) $('#controllerPower82').html(round(parseInt(json["1618"]["8"]["entityvalue"]), 1).toString() + " W");
				}
				// Solar Power X-3
				if(json.hasOwnProperty("1619")) {
					if(json["1619"].hasOwnProperty("1")) $('#controllerPower13').html(round(parseInt(json["1619"]["1"]["entityvalue"]), 1).toString() + " W");
					if(json["1619"].hasOwnProperty("2")) $('#controllerPower23').html(round(parseInt(json["1619"]["2"]["entityvalue"]), 1).toString() + " W");
					if(json["1619"].hasOwnProperty("3")) $('#controllerPower33').html(round(parseInt(json["1619"]["3"]["entityvalue"]), 1).toString() + " W");
					if(json["1619"].hasOwnProperty("4")) $('#controllerPower43').html(round(parseInt(json["1619"]["4"]["entityvalue"]), 1).toString() + " W");
					if(json["1619"].hasOwnProperty("5")) $('#controllerPower53').html(round(parseInt(json["1619"]["5"]["entityvalue"]), 1).toString() + " W");
					if(json["1619"].hasOwnProperty("6")) $('#controllerPower63').html(round(parseInt(json["1619"]["6"]["entityvalue"]), 1).toString() + " W");
					if(json["1619"].hasOwnProperty("7")) $('#controllerPower73').html(round(parseInt(json["1619"]["7"]["entityvalue"]), 1).toString() + " W");
					if(json["1619"].hasOwnProperty("8")) $('#controllerPower83').html(round(parseInt(json["1619"]["8"]["entityvalue"]), 1).toString() + " W");
				}
				// Solar Power X-4
				if(json.hasOwnProperty("1620")) {
					if(json["1620"].hasOwnProperty("1")) $('#controllerPower14').html(round(parseInt(json["1620"]["1"]["entityvalue"]), 1).toString() + " W");
					if(json["1620"].hasOwnProperty("2")) $('#controllerPower24').html(round(parseInt(json["1620"]["2"]["entityvalue"]), 1).toString() + " W");
					if(json["1620"].hasOwnProperty("3")) $('#controllerPower34').html(round(parseInt(json["1620"]["3"]["entityvalue"]), 1).toString() + " W");
					if(json["1620"].hasOwnProperty("4")) $('#controllerPower44').html(round(parseInt(json["1620"]["4"]["entityvalue"]), 1).toString() + " W");
					if(json["1620"].hasOwnProperty("5")) $('#controllerPower54').html(round(parseInt(json["1620"]["5"]["entityvalue"]), 1).toString() + " W");
					if(json["1620"].hasOwnProperty("6")) $('#controllerPower64').html(round(parseInt(json["1620"]["6"]["entityvalue"]), 1).toString() + " W");
					if(json["1620"].hasOwnProperty("7")) $('#controllerPower74').html(round(parseInt(json["1620"]["7"]["entityvalue"]), 1).toString() + " W");
					if(json["1620"].hasOwnProperty("8")) $('#controllerPower84').html(round(parseInt(json["1620"]["8"]["entityvalue"]), 1).toString() + " W");
				}
			}
			
			
			
			
			
			// Update Grid Section
			num = 0;
			if(json.hasOwnProperty("273")) num += 1;
			if(json.hasOwnProperty("274")) num += 1;
			if(json.hasOwnProperty("275")) num += 1;
			if(num != 0) gridNum = num;
			
			gridVoltageL1 = 0; gridVoltageL2 = 0; gridVoltageL3 = 0;
			if(json.hasOwnProperty("273")) gridVoltageL1 = round(parseInt(json["273"][Object.keys(json["273"])[0]]["entityvalue"])*0.01, 0);
			if(json.hasOwnProperty("274")) gridVoltageL2 = round(parseInt(json["274"][Object.keys(json["274"])[0]]["entityvalue"])*0.01, 0);
			if(json.hasOwnProperty("275")) gridVoltageL3 = round(parseInt(json["275"][Object.keys(json["275"])[0]]["entityvalue"])*0.01, 0);
			
			if(gridVoltageL1 > 1 || gridVoltageL2 > 1 || gridVoltageL3 > 1) 
				$(".top-right").css("visibility", "visible");
			else 
				$(".top-right").css("visibility", "hidden");
			
			if(gridNum == 1) $("#gridInfo1 h2").html("GRID");
			
			if(json.hasOwnProperty("353")) {
				$('#gridPowerTotal').html(round(Math.abs(parseInt(json["353"][Object.keys(json["353"])[0]]["entityvalue"])), 1).toString() + " W");
				// Update Grid Arrow
				if(round(parseInt(json["353"][Object.keys(json["353"])[0]]["entityvalue"]), 1) > 0) {
					$('.top-right .arrow').removeClass('arrow-up');
					$('.top-right .arrow').addClass('arrow-down');
					$(".top-right .arrow-line").css("visibility", "visible");
				} else if(round(parseInt(json["353"][Object.keys(json["353"])[0]]["entityvalue"]), 1) < 0) {
					$('.top-right .arrow').removeClass('arrow-down');
					$('.top-right .arrow').addClass('arrow-up');
					$(".top-right .arrow-line").css("visibility", "visible");
				} else {
					$(".top-right .arrow-line").css("visibility", "hidden");
				}
			}
			
			if(gridNum > 0) {
				if(json.hasOwnProperty("273")) $('#gridVoltageL1').html(round(parseInt(json["273"][Object.keys(json["273"])[0]]["entityvalue"])*0.01, 0).toString() + " V");
				if(json.hasOwnProperty("337")) $('#gridPowerL1').html(round(parseInt(json["337"][Object.keys(json["337"])[0]]["entityvalue"]), 1).toString() + " W");
			}
			if(gridNum > 1) {
				if(json.hasOwnProperty("274")) $('#gridVoltageL2').html(round(parseInt(json["274"][Object.keys(json["274"])[0]]["entityvalue"])*0.01, 0).toString() + " V");
				if(json.hasOwnProperty("338")) $('#gridPowerL2').html(round(parseInt(json["338"][Object.keys(json["338"])[0]]["entityvalue"]), 1).toString() + " W");
			}
			if(gridNum > 2) {
				if(json.hasOwnProperty("275")) $('#gridVoltageL3').html(round(parseInt(json["275"][Object.keys(json["275"])[0]]["entityvalue"])*0.01, 0).toString() + " V");
				if(json.hasOwnProperty("339")) $('#gridPowerL3').html(round(parseInt(json["339"][Object.keys(json["339"])[0]]["entityvalue"]), 1).toString() + " W");
			}
			
			
			
			
			
			// Update Battery Section
			num = 0;
			if(json.hasOwnProperty("1042")) num += 1;
			if(json.hasOwnProperty("1041")) num += 1;
			if(num != 0) batteryNum = num;
			
			batteryVoltagePlus = 0; batteryVoltageMinus = 0;
			if(json.hasOwnProperty("1042")) batteryVoltagePlus = round(parseInt(json["1042"][Object.keys(json["1042"])[0]]["entityvalue"])*0.01, 1);
			if(json.hasOwnProperty("1041")) batteryVoltageMinus = round(parseInt(json["1041"][Object.keys(json["1041"])[0]]["entityvalue"])*0.01, 1);
			
			if(batteryVoltagePlus > 1 || batteryVoltageMinus > 1) 
				$(".bottom-left").css("visibility", "visible");
			else 
				$(".bottom-left").css("visibility", "hidden");
			
			if(batteryNum == 1) $("#batteryInfo1 h2").html("BATTERY");
			
			if(json.hasOwnProperty("1121")) {
				if(model == "batterx bs") {
					if(json.hasOwnProperty("1042") && json.hasOwnProperty("1041")) {
						var voltPlus = "+" + round(parseInt(json["1042"][Object.keys(json["1042"])[0]]["entityvalue"])*0.01, 0).toString();
						var voltMinus = "-" + round(parseInt(json["1041"][Object.keys(json["1041"])[0]]["entityvalue"])*0.01, 0).toString();
						$('#batteryPowerTotal').html(voltPlus + " " + voltMinus + " V");
					}
				} else $('#batteryPowerTotal').html(round(Math.abs(parseInt(json["1121"][Object.keys(json["1121"])[0]]["entityvalue"])), 1).toString() + " W");
				// Update Battery Arrow
				if(round(parseInt(json["1121"][Object.keys(json["1121"])[0]]["entityvalue"]), 1) < 0) {
					$('.bottom-left .arrow').removeClass('arrow-down');
					$('.bottom-left .arrow').addClass('arrow-up');
					$(".bottom-left .arrow-line").css("visibility", "visible");
				} else if(round(parseInt(json["1121"][Object.keys(json["1121"])[0]]["entityvalue"]), 1) > 0) {
					$('.bottom-left .arrow').removeClass('arrow-up');
					$('.bottom-left .arrow').addClass('arrow-down');
					$(".bottom-left .arrow-line").css("visibility", "visible");
				} else {
					$(".bottom-left .arrow-line").css("visibility", "hidden");
				}
			}
			
			if(batteryNum > 0) {
				if(json.hasOwnProperty("1042")) $('#batteryVoltage1').html(round(parseInt(json["1042"][Object.keys(json["1042"])[0]]["entityvalue"])*0.01, 1).toString() + " V");
				if(json.hasOwnProperty("1058")) $('#batteryCurrent1').html(round(parseInt(json["1058"][Object.keys(json["1058"])[0]]["entityvalue"])*0.01, 1).toString() + " A");
				if(json.hasOwnProperty("1074")) $('#batteryCapacity1').html(round(parseInt(json["1074"][Object.keys(json["1074"])[0]]["entityvalue"]), 1).toString() + " %");
			}
			if(batteryNum > 1) {
				if(json.hasOwnProperty("1041")) $('#batteryVoltage2').html(round(parseInt(json["1041"][Object.keys(json["1041"])[0]]["entityvalue"])*0.01, 1).toString() + " V");
				if(json.hasOwnProperty("1057")) $('#batteryCurrent2').html(round(parseInt(json["1057"][Object.keys(json["1057"])[0]]["entityvalue"])*0.01, 1).toString() + " A");
				if(json.hasOwnProperty("1073")) $('#batteryCapacity2').html(round(parseInt(json["1073"][Object.keys(json["1073"])[0]]["entityvalue"]), 1).toString() + " %");
			}
			
			
			
			
			
			// Update Load Section
			num = 0;
			if(json.hasOwnProperty("1297")) num += 1;
			if(json.hasOwnProperty("1298")) num += 1;
			if(json.hasOwnProperty("1299")) num += 1;
			if(num != 0) loadNum = num;
			
			loadVoltageL1 = 0; loadVoltageL2 = 0; loadVoltageL3 = 0;
			if(json.hasOwnProperty("1297")) loadVoltageL1 = round(parseInt(json["1297"][Object.keys(json["1297"])[0]]["entityvalue"])*0.01, 0);
			if(json.hasOwnProperty("1298")) loadVoltageL2 = round(parseInt(json["1298"][Object.keys(json["1298"])[0]]["entityvalue"])*0.01, 0);
			if(json.hasOwnProperty("1299")) loadVoltageL3 = round(parseInt(json["1299"][Object.keys(json["1299"])[0]]["entityvalue"])*0.01, 0);
			
			if(loadVoltageL1 > 1 || loadVoltageL2 > 1 || loadVoltageL3 > 1) 
				$(".bottom-right").css("visibility", "visible");
			else 
				$(".bottom-right").css("visibility", "hidden");
			
			if(loadNum == 1) $("#loadInfo1 h2").html("LOAD");
			
			if(json.hasOwnProperty("1377")) {
				$('#loadPowerTotal').html(round(parseInt(json["1377"][Object.keys(json["1377"])[0]]["entityvalue"]), 1).toString() + " W");
				if(parseInt(json["1377"][Object.keys(json["1377"])[0]]["entityvalue"]) > 1) 
					$(".bottom-right .arrow-line").css("visibility", "visible");
				else 
					$(".bottom-right .arrow-line").css("visibility", "hidden");
			}
			
			if(loadNum > 0) {
				if(json.hasOwnProperty("1297")) $('#loadVoltageL1').html(round(parseInt(json["1297"][Object.keys(json["1297"])[0]]["entityvalue"])*0.01, 0).toString() + " V");
				if(json.hasOwnProperty("1361")) $('#loadPowerL1').html(round(parseInt(json["1361"][Object.keys(json["1361"])[0]]["entityvalue"]), 1).toString() + " W");
			}				
			if(loadNum > 1) {
				if(json.hasOwnProperty("1298")) $('#loadVoltageL2').html(round(parseInt(json["1298"][Object.keys(json["1298"])[0]]["entityvalue"])*0.01, 0).toString() + " V");
				if(json.hasOwnProperty("1362")) $('#loadPowerL2').html(round(parseInt(json["1362"][Object.keys(json["1362"])[0]]["entityvalue"]), 1).toString() + " W");
			}
			if(loadNum > 2) {
				if(json.hasOwnProperty("1299")) $('#loadVoltageL3').html(round(parseInt(json["1299"][Object.keys(json["1299"])[0]]["entityvalue"])*0.01, 0).toString() + " V");
				if(json.hasOwnProperty("1363")) $('#loadPowerL3').html(round(parseInt(json["1363"][Object.keys(json["1363"])[0]]["entityvalue"]), 1).toString() + " W");
			}
			
			
			
			
			
			// Update Autarky Progress-Bar
			gridPower = 0; loadPower = 0; batteryPower = 0
			if(json.hasOwnProperty("353")) gridPower = round(parseInt(json["353"][Object.keys(json["353"])[0]]["entityvalue"]), 1);
			if(json.hasOwnProperty("1377")) loadPower = round(parseInt(json["1377"][Object.keys(json["1377"])[0]]["entityvalue"]), 1);
			if(json.hasOwnProperty("1121")) batteryPower = round(parseInt(json["1121"][Object.keys(json["1121"])[0]]["entityvalue"]), 1);
			if(gridPower <= 0) bar.animate(1); else bar.animate(Math.max(1 - gridPower / (loadPower + Math.max(batteryPower, 0)), 0));
			
			
			
			
			
			// Update Device Status (BS Only)
			if(model == 'batterx bs') {
				var devicePFC = '-';
				var deviceBoost = '-';
				var deviceECO = '-';
				
				var temp = null;
				if(json.hasOwnProperty("24577")) temp = parseInt(json["24577"][Object.keys(json["24577"])[0]]["entityvalue"]);
				if(temp == 1) devicePFC = "ON"; else if(temp == 0) devicePFC = "OFF";
				
				temp = null;
				if(json.hasOwnProperty("24578")) temp = parseInt(json["24578"][Object.keys(json["24578"])[0]]["entityvalue"]);
				if(temp == 1) deviceBoost = "ON"; else if(temp == 0) deviceBoost = "OFF";
				
				temp = null;
				if(json.hasOwnProperty("24579")) temp = parseInt(json["24579"][Object.keys(json["24579"])[0]]["entityvalue"]);
				if(temp == 1) deviceECO = "ON"; else if(temp == 0) deviceECO = "OFF";
				
				$('#devicePFC').html(devicePFC);
				$('#deviceBoost').html(deviceBoost);
				$('#deviceECO').html(deviceECO);
			}
			
			
			
			
			
		}
	});
	
}





// Round Number to X decimal places (in order to avoid 230.70000000000002)
function round(value, precision) {
	var multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
}
