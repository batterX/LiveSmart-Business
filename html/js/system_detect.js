$progress.trigger("step", 4);





step1();





// Get CurrentState (Verify if inverter is working)

var previousLogtime = null;

function step1() {

	$.get({
		url: "api.php?get=currentstate",
		error: () => { setTimeout(step1, 5000); },
		success: (json) => {
			console.log(json);
			if(!json || typeof json != "object" || !json.hasOwnProperty("logtime")) {
				setTimeout(step1, 5000);
				return;
			}
			var curtime   = moment.utc().subtract(1, "minute").format("YYYY-MM-DD hh:mm:ss");
			var isWorking = moment(json["logtime"]).isAfter(moment(curtime));
			if(!isWorking) {
				if(previousLogtime == null) previousLogtime = json["logtime"];
				else if(previousLogtime != json["logtime"]) alert("Error! PC or liveX time/timezone not set correctly.");
				setTimeout(step1, 5000);
				return;
			}
			// Continue Next Step
			step2();
		}
	});

}





// Check if LiveX registered in Cloud & Show Working Status

function step2() {

	$.post({
		url: "https://api.batterx.io/v3/install.php",
		data: {
			action: "get_box_serial",
			apikey: apikey
		},
		error: () => { alert("E001. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			var box_serial = response;
			// Save Serial-Number to Session
			if(box_serial) {
				$.post({
					url: "cmd/session.php",
					data: { box_serial: box_serial },
					error: () => { alert("E002. Please refresh the page!"); },
					success: (response) => {
						console.log(response);
						if(response !== "1") return alert("E003. Please refresh the page!");
						$(".serialnumber b").text(box_serial);
						// Show Working
						$("#upsUnknown").addClass("d-none");
						$("#upsDetected").removeClass("d-none");
						// Enable Button
						$("#btn_next").attr("disabled", false);
					}
				});
			} else {
				// Show Working
				$("#upsUnknown").addClass("d-none");
				$("#upsDetected").removeClass("d-none");
				// Enable Button
				$("#btn_next").attr("disabled", false);
				// Hide Serial Number
				$(".serialnumber").css("visibility", "hidden").addClass("my-0");
			}
		}
	});
}





// Button Next On-Click

$("#btn_next").on("click", () => { window.location.href = "system_setup.php"; });
