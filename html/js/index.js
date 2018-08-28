// Set Warnings Begin Variables State

var lastWarningTime = new Date("2000-01-01T01:01:01");
var lastWarningList = [];





// Get Device Model

var model = "";
$.ajax({
	type: "POST",
	url: "db-interaction/data.php",
	data: {
		"action": "getDeviceModel"
	},
	success: function (response) {
		if(response) {
			model = response.toLowerCase();
			switch(response.toLowerCase()) {
				case 'batterx bs':
					$(".gpio").hide();
					break;
				default:
					$(".gpio").show();
					break;
			}
		}
		// Hide Overlay
		$('.overlay').fadeOut();
	}
});





// Set OnClick Listeners

$('#btnNotification').on('click', function() {
	$('#slider-right').offcanvas({
		placement: 'right',
		autohide: 'true'
	});
	$('#slider-right').offcanvas('show');
});

$('#slider-left').on('click', function() {
	if(window.innerHeight > window.innerWidth) {
		setTimeout(function() { $("#slider-left").offcanvas('hide'); }, 200);
	}
});

$('#slider-right').on('click', function() {
	setTimeout(function() { $("#slider-right").offcanvas('hide'); }, 200);
});

$('#live').on('click', function() {
	$('#frame').attr("src", "live.html");
	$('#title').html("LIVE");
	toggleActive("live");
});

$('#energy').on('click', function() {
	$('#frame').attr("src", "energy.html");
	$('#title').html("ENERGY");
	toggleActive("energy");
});

$('#device').on('click', function() {
	$('#frame').attr("src", "device.html");
	$('#title').html("SYSTEM");
	toggleActive("device");
});

$('#gpio').on('click', function() {
	if(model != 'batterx bs') {
		$('#frame').attr("src", "gpio.html");
		$('#title').html("GPIO");
		toggleActive("gpio");
	}
});

function toggleActive(id) {
	$('#live, #energy, #device, #gpio').find('h4').removeClass("active");
	$('#'+id).find('h4').addClass('active');
}





// Initialize Notifications
// Load the 10 latest Warnings for the current device

$.ajax({
	type: "POST",
	url: "db-interaction/data.php",
	data: {
		"action": "getWarningsData",
		"count": "10"
	},
	success: function(response) {
		// Parse Result to JSON
		var json = JSON.parse(response);
		// Display Latest Warnings in the Right-Side-Drawer
		for(var x = 0; x < json.length; x++) {
			if(lastWarningTime <= formatDate(json[x]['logtime'])) {
				if(json[x]['entityvalue'] != "") {
					var tempList = json[x]['entityvalue'].split(" ");
					for(var y = 0; y < tempList.length; y++)
						if(!lastWarningList.includes(tempList[y]))
							addWarning('orange', convertDate(json[x]['logtime']), warningsList[tempList[y]][0], warningsList[tempList[y]][1]);
					lastWarningList = json[x]['entityvalue'].split(" ");
				} else lastWarningList = [];
			}
		}
		// Update Active Notifications
		updateActiveNotifications();
		// Update Last Warning Time
		lastWarningTime = formatDate(json[json.length-1]['logtime']);
	}
});





// Update Notifications Drawer Every 5 Seconds

setTimeout(function() {	updateNotifications(); }, 5000);
function updateNotifications() {
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: {
			"action": "getWarningsData",
			"count": "1"
		},
		complete: function (data) {
			setTimeout(function() { updateNotifications(); }, 5000);
		},
		success: function (response) {
			// Parse Response to JSON
			var json = JSON.parse(response);
			// Display Latest Warnings in the Right-Side-Drawer
			for(var x = 0; x < json.length; x++) {
				if(lastWarningTime <= formatDate(json[x]['logtime'])) {
					if(json[x]['entityvalue'] != "") {
						var tempList = json[x]['entityvalue'].split(" ");
						for(var y = 0; y < tempList.length; y++)
							if(lastWarningList.indexOf(tempList[y]) == -1)
								addWarning('orange', convertDate(json[x]['logtime']), warningsList[tempList[y]][0], warningsList[tempList[y]][1]);
						lastWarningList = json[x]['entityvalue'].split(" ");
					} else lastWarningList = [];
				}
			}
			// Update Active Notifications
			updateActiveNotifications();
			// Update Last Warning Time
			lastWarningTime = formatDate(json[json.length-1]['logtime']);
		}
	});
}





// Update Active Notifications List

function updateActiveNotifications() {
	// Set Title
	$("#notif-active .warnings").html(`
		<div class='row notif-head-active'>
			<h4 style='color:white; letter-spacing:0.75vh'>
				<b>ACTIVE WARNINGS</b>
			</h4>
		</div>
	`);
	// Set Active Warnings
	for(var y = 0; y < lastWarningList.length; y++) {
		$("#notif-active .warnings").append(`
			<div class='row notif-head-active'>
				<h4>${warningsList[lastWarningList[y]][0]}</h4>
			</div>
		`);
	}
	// Show/Hide Badge + Set Badge Number
	if(lastWarningList.length == 0) {
		$("#notif-active .warnings").append(`
			<div class='row notif-head-active'>
				<h4>THERE ARE NO WARNINGS</h4>
			</div>
		`);
		$(".button-badge").css("display", "none");
	} else {
		$(".button-badge").text((lastWarningList.length).toString());
		$(".button-badge").css("display", "block");
	}
}





// Update Fault Status From Iframe

var blinkInterval = null;
function updateFaultStatus(flag, fault, logtime) {
	// If Fault has Occured
	if(flag) {
		$(".notifbar").css("display", "block");
		$("#notifbar-text").html(warningsList[fault][0]);
		if(blinkInterval == null) {
			// Start Blinking the Bottom-Notifbar
			blinkInterval = setInterval(function() {
				$("#notifbar-parent").css('visibility', $("#notifbar-parent").css('visibility') === 'hidden' ? '' : 'hidden');
			}, 1000);
			// Add Fault to Notifications
			addWarning('red', convertDate(logtime), warningsList[fault][0], warningsList[fault][1]);
		}
	// If No Active Faults
	} else {
		$(".notifbar").css("display", "none");
		$("#notifbar-text").html("");
		if(blinkInterval != null) {
			clearInterval(blinkInterval);
			blinkInterval = null;
			$("#notifbar-parent").css('visibility', 'visible');
		}
	}
}





// Update LastTimestamp From Iframe

function updateLastTimestamp(str) {
	// Set Last Timestamp
	$("#notif-lastupdate").html(`
		<div class='row notif-head-active'>
			<h4 style='color:white; letter-spacing: 0.75vh;'>
				<b>LAST TIMESTAMP</b>
			</h4>
		</div>
		<div class='row notif-head-active'>
			<h4 class='last-timestamp'>
				${convertDate(str)}
			</h4>
		</div>
	`);
	// Set Text Color RED if not updated for 2 minutes
	if(moment.duration(moment().diff(moment.utc(str))).asMinutes() > 2) {
		// Last Timestamp RED
		$("#notif-lastupdate").css('border-color', 'red').css('background-color', 'black');
		$("#notif-lastupdate h4").css('color', 'red');
		// Notification Icon RED
		$(".notification").attr("src", "img/notification-red.png");
		$(".button-badge").css("color", "red");
		$(".button-badge").css("border-color", "red");
		if(lastWarningList.length != 0) $(".button-badge").css("display", "block");
	} else {
		// Last Timestamp GRAY
		$("#notif-lastupdate").css('border-color', 'gray').css('background-color', '');
		// Notification Icon RED
		$(".notification").attr("src", "img/notification-white.png");
		$(".button-badge").css("color", "orange");
		$(".button-badge").css("border-color", "orange");
		if(lastWarningList.length != 0) $(".button-badge").css("display", "block");
	}
}





// Add Warning + Sort Warnings by Logtime (Timestamp)

function addWarning(circle, logtime, title, description) {
	// Add Warnings
	var article = `
		<article data-val='${logtime.replace(/[^0-9]/g, '')}'>
			<div class='notif-head'>
				<img class='notif-circle' src='img/notif-${circle}.png'>
				<h4>${title}</h4>
			</div>
			<div class='row'>
				<div class='notif-bar'></div>
				<div class='notif-desc'>
					<img class='img-under' src='img/under.png'>
					<p class='time'>${logtime}</p>
					<p>${description}</p>
				</div>
			</div>
		</article>
	`;
	$("#notif-container").html(article + $("#notif-container").html());
	// Sort Warnings
	var items = $('#notif-container').children('article').sort(function(a, b) {
		var vA = $(a).attr('data-val');
		var vB = $(b).attr('data-val');
		return (vA < vB) ? 1 : (vA > vB) ? -1 : 0;
	});
	$('#notif-container').append(items);
}





// Convert Date from Database to Local Time
function convertDate(dateStr) {
	var utc = moment.utc(dateStr).toDate();
	return moment(utc).local().format("YYYY-MM-DD HH:mm:ss");
}

// Format Date
function formatDate(dateStr) {
	return new Date(dateStr.replace(" ", "T"));
}
