$progress.trigger("step", 8);





var pdfData;





$.get({
	url: "api.php?get=settings",
	error: () => { alert("Error! Please refresh the page!") },
	success: (response) => {
		
		if(!response || typeof response != "object") return alert("Error! Please refresh the page!");

		var temp = {};

		var systemMode          = "";
		var autoPfcOff          = "";
		var autoEcoMode         = "";
		var maxChargeC          = "";
		var maxDischargeC       = "";
		var minDischargeVoltage = "";
		var voltageHysteresis   = "";
		var dischargeCurrent    = "";

		if(response.hasOwnProperty("NominalBattValue") && response["NominalBattValue"].hasOwnProperty("0")) {
			temp = response["NominalBattValue"]["0"];
			maxChargeC    = (parseInt(temp["v2"]) / 100).toFixed(2);
			maxDischargeC = (parseInt(temp["v3"]) / 100).toFixed(2);
		}
		if(response.hasOwnProperty("SystemMode") && response["SystemMode"].hasOwnProperty("0")) {
			temp = response["SystemMode"]["0"];
			minDischargeVoltage = (parseInt(temp["v2"]) / 100) + " V";
			voltageHysteresis   = (parseInt(temp["v3"]) / 100) + " V";
			dischargeCurrent    = (parseInt(temp["v4"]) / 100) + " A";
			systemMode          = lang.dict_bs_sysmode[temp["mode"]];
		}
		if(response.hasOwnProperty("EcoMode") && response["EcoMode"].hasOwnProperty("0")) {
			temp = response["EcoMode"]["0"];
			autoEcoMode = temp["v1"] == "0" ? lang.common.off : ("ECO " + temp["v1"]);
		}
		if(response.hasOwnProperty("PfcSet") && response["PfcSet"].hasOwnProperty("0")) {
			temp = response["PfcSet"]["0"];
			autoPfcOff = temp["v1"] == "1" ? lang.common.yes : lang.common.no;
		}

		$("#systemConfig_systemMode         ").html(systemMode         );
		$("#systemConfig_autoPfcOff         ").html(autoPfcOff         );
		$("#systemConfig_autoEcoMode        ").html(autoEcoMode        );
		$("#systemConfig_maxChargeC         ").html(maxChargeC         );
		$("#systemConfig_maxDischargeC      ").html(maxDischargeC      );
		$("#systemConfig_minDischargeVoltage").html(minDischargeVoltage);
		$("#systemConfig_voltageHysteresis  ").html(voltageHysteresis  );
		$("#systemConfig_dischargeCurrent   ").html(dischargeCurrent   );
		$(".system-config").removeClass("d-none");

		var enable               = "";
		var pin                  = "";
		var limitChargingCurrent = "";
		var switchOnWhen         = "";
		var minOnTime            = "";
		var switchOffWhen        = "";
		var minOffTime           = "";

		if(response.hasOwnProperty("GeneratorSetGlobal") && response["GeneratorSetGlobal"].hasOwnProperty("0")) {
			temp = response["GeneratorSetGlobal"]["0"];
			enable               = temp["mode"] == "2" ? lang.common.yes : lang.common.no;
			pin                  = lang.bs_system_setup.generator_output_pin + " " + temp["v1"];
			limitChargingCurrent = temp["v2"] != 1 ? "" : (Math.round(temp["v3"] / 10) / 10) + " A";
			if(temp["mode"] == "2") $(".generator").removeClass("d-none");
		}
		if(response.hasOwnProperty("GeneratorSetOn") && response["GeneratorSetOn"].hasOwnProperty("0")) {
			temp = response["GeneratorSetOn"]["0"];
			var tempVoltage = Math.round(parseInt(temp["v2"]) / 100) + " V";
			var tempHH = Math.floor(parseInt(temp["v2"]) / 3600).toString();
			var tempMM = Math.floor((parseInt(temp["v2"]) - tempHH * 3600) / 60).toString();
			if(tempHH.length == 1) tempHH = "0" + tempHH;
			if(tempMM.length == 1) tempMM = "0" + tempMM;
			var tempTime = tempHH + ":" + tempMM;
			if(temp["mode"] == "1" || temp["mode"] == "2") {
				switchOnWhen  = temp["mode"] == "1" ? lang.bs_system_setup.generator_time : lang.bs_system_setup.generator_battery_voltage;
				switchOnWhen += "<br>" + (temp["mode"] == "1" ? tempTime : tempVoltage);
			}
			minOnTime = Math.round(parseInt(temp["v1"]) / 60) + " min";
		}
		if(response.hasOwnProperty("GeneratorSetOff") && response["GeneratorSetOff"].hasOwnProperty("0")) {
			temp = response["GeneratorSetOff"]["0"];
			var tempVoltage = Math.round(parseInt(temp["v2"]) / 100) + " V";
			var tempHH = Math.floor(parseInt(temp["v2"]) / 3600).toString();
			var tempMM = Math.floor((parseInt(temp["v2"]) - tempHH * 3600) / 60).toString();
			if(tempHH.length == 1) tempHH = "0" + tempHH;
			if(tempMM.length == 1) tempMM = "0" + tempMM;
			var tempTime = tempHH + ":" + tempMM;
			if(temp["mode"] == "1" || temp["mode"] == "2") {
				switchOffWhen  = temp["mode"] == "1" ? lang.bs_system_setup.generator_time : lang.bs_system_setup.generator_battery_voltage;
				switchOffWhen += "<br>" + (temp["mode"] == "1" ? tempTime : tempVoltage);
			}
			minOffTime = Math.round(parseInt(temp["v1"]) / 60) + " min";
		}

		$("#generator_enable              ").html(enable              );
		$("#generator_pin                 ").html(pin                 );
		$("#generator_limitChargingCurrent").html(limitChargingCurrent);
		$("#generator_switchOnWhen        ").html(switchOnWhen        );
		$("#generator_minOnTime           ").html(minOnTime           );
		$("#generator_switchOffWhen       ").html(switchOffWhen       );
		$("#generator_minOffTime          ").html(minOffTime          );
		
	}
});





$("#checkboxAccept1, #checkboxAccept2").on("click", () => {
	if($("#checkboxAccept1").is(":checked") && $("#checkboxAccept2").is(":checked"))
		$("#btnFinish").css("visibility", "visible");
	else
		$("#btnFinish").css("visibility", "hidden");
});





$("#btnFinishInstallation").on("click", () => {

	$("#btnFinishInstallation").attr("disabled", "disabled");

	deviceModel = "batterX UPS";

	var data = new FormData();

	data.append("action" , "finish_installation");
	data.append("has_device", "1");

	data.append("lang", ["de","fr","cs","es"].includes($("#lang").val()) ? $("#lang").val() : "en");

	if(dataObj.hasOwnProperty("box_serial") && dataObj["box_serial"].length >= 10) data.append("type", dataObj["box_serial"].substr(4, 2).toLowerCase());

	if(dataObj.hasOwnProperty("installation_date"              ) && dataObj["installation_date"              ] != "") data.append("installation_date"              , dataObj["installation_date"              ]);

	if(dataObj.hasOwnProperty("installer_gender"               ) && dataObj["installer_gender"               ] != "") data.append("installer_gender"               , dataObj["installer_gender"               ]);
	if(dataObj.hasOwnProperty("installer_firstname"            ) && dataObj["installer_firstname"            ] != "") data.append("installer_firstname"            , dataObj["installer_firstname"            ]);
	if(dataObj.hasOwnProperty("installer_lastname"             ) && dataObj["installer_lastname"             ] != "") data.append("installer_lastname"             , dataObj["installer_lastname"             ]);
	if(dataObj.hasOwnProperty("installer_company"              ) && dataObj["installer_company"              ] != "") data.append("installer_company"              , dataObj["installer_company"              ]);
	if(dataObj.hasOwnProperty("installer_telephone"            ) && dataObj["installer_telephone"            ] != "") data.append("installer_telephone"            , dataObj["installer_telephone"            ]);
	if(dataObj.hasOwnProperty("installer_email"                ) && dataObj["installer_email"                ] != "") data.append("installer_email"                , dataObj["installer_email"                ]);
	if(dataObj.hasOwnProperty("installer_password"             ) && dataObj["installer_password"             ] != "") data.append("installer_password"             , dataObj["installer_password"             ]);

	if(dataObj.hasOwnProperty("customer_gender"                ) && dataObj["customer_gender"                ] != "") data.append("customer_gender"                , dataObj["customer_gender"                ]);
	if(dataObj.hasOwnProperty("customer_firstname"             ) && dataObj["customer_firstname"             ] != "") data.append("customer_firstname"             , dataObj["customer_firstname"             ]);
	if(dataObj.hasOwnProperty("customer_lastname"              ) && dataObj["customer_lastname"              ] != "") data.append("customer_lastname"              , dataObj["customer_lastname"              ]);
	if(dataObj.hasOwnProperty("customer_email"                 ) && dataObj["customer_email"                 ] != "") data.append("customer_email"                 , dataObj["customer_email"                 ]);
	if(dataObj.hasOwnProperty("customer_telephone"             ) && dataObj["customer_telephone"             ] != "") data.append("customer_telephone"             , dataObj["customer_telephone"             ]);
	if(dataObj.hasOwnProperty("customer_company"               ) && dataObj["customer_company"               ] != "") data.append("customer_company"               , dataObj["customer_company"               ]);
	if(dataObj.hasOwnProperty("customer_country"               ) && dataObj["customer_country"               ] != "") data.append("customer_country"               , dataObj["customer_country"               ]);
	if(dataObj.hasOwnProperty("customer_city"                  ) && dataObj["customer_city"                  ] != "") data.append("customer_city"                  , dataObj["customer_city"                  ]);
	if(dataObj.hasOwnProperty("customer_zipcode"               ) && dataObj["customer_zipcode"               ] != "") data.append("customer_zipcode"               , dataObj["customer_zipcode"               ]);
	if(dataObj.hasOwnProperty("customer_address"               ) && dataObj["customer_address"               ] != "") data.append("customer_address"               , dataObj["customer_address"               ]);

	if(dataObj.hasOwnProperty("installation_country"           ) && dataObj["installation_country"           ] != "") data.append("installation_country"           , dataObj["installation_country"           ]);
	if(dataObj.hasOwnProperty("installation_city"              ) && dataObj["installation_city"              ] != "") data.append("installation_city"              , dataObj["installation_city"              ]);
	if(dataObj.hasOwnProperty("installation_zipcode"           ) && dataObj["installation_zipcode"           ] != "") data.append("installation_zipcode"           , dataObj["installation_zipcode"           ]);
	if(dataObj.hasOwnProperty("installation_address"           ) && dataObj["installation_address"           ] != "") data.append("installation_address"           , dataObj["installation_address"           ]);

	data.append("system_model", "batterX");
	if(dataObj.hasOwnProperty("system_serial"                  ) && dataObj["system_serial"                  ] != "") data.append("system_serial"                  , dataObj["system_serial"                  ]);

	if(dataObj.hasOwnProperty("device_serial"                  ) && dataObj["device_serial"                  ] != "") data.append("device_serial"                  , dataObj["device_serial"                  ]);
	if(dataObj.hasOwnProperty("device_model"                   ) && dataObj["device_model"                   ] != "") data.append("device_model"                   , dataObj["device_model"                   ]);
	if(dataObj.hasOwnProperty("device_power"                   ) && dataObj["device_power"                   ] != "") data.append("device_power"                   , dataObj["device_power"                   ]);
	if(dataObj.hasOwnProperty("solar_wattpeak"                 ) && dataObj["solar_wattpeak"                 ] != "") data.append("solar_wattpeak"                 , dataObj["solar_wattpeak"                 ]);
	if(dataObj.hasOwnProperty("solar_info"                     )                                                    ) data.append("solar_info"                     , dataObj["solar_info"                     ]);
	if(dataObj.hasOwnProperty("note"                           )                                                    ) data.append("note"                           , dataObj["note"                           ]);

	if(dataObj.hasOwnProperty("box_apikey"                     ) && dataObj["box_apikey"                     ] != "") data.append("box_apikey"                     , dataObj["box_apikey"                     ]);
	if(dataObj.hasOwnProperty("box_serial"                     ) && dataObj["box_serial"                     ] != "") data.append("box_serial"                     , dataObj["box_serial"                     ]);
	if(dataObj.hasOwnProperty("software_version"               ) && dataObj["software_version"               ] != "") data.append("software_version"               , dataObj["software_version"               ]);

	if(dataObj.hasOwnProperty("solar_controllers_serialnumbers") && dataObj["solar_controllers_serialnumbers"] != "") data.append("solar_controllers_serialnumbers", dataObj["solar_controllers_serialnumbers"]);
	if(dataObj.hasOwnProperty("solar_controllers_wattpeak"     ) && dataObj["solar_controllers_wattpeak"     ] != "") data.append("solar_controllers_wattpeak"     , dataObj["solar_controllers_wattpeak"     ]);

	if(dataObj.hasOwnProperty("generator_info"                 ) && dataObj["generator_info"                 ] != "") data.append("generator_info"                 , dataObj["generator_info"                 ]);

	if(dataObj.hasOwnProperty("battery_type")) {
		if(dataObj["battery_type"] == "lifepo") {
			data.append("has_battery"    , "1"     );
			data.append("battery_type"   , "lifepo");
			data.append("battery_voltage", "32"    );
			if(dataObj.hasOwnProperty("battery_bms_master"   ) && dataObj["battery_bms_master"   ] != "") data.append("battery_bms_master"   , dataObj["battery_bms_master"   ]);
			if(dataObj.hasOwnProperty("battery_bms_slave"    ) && dataObj["battery_bms_slave"    ] != "") data.append("battery_bms_slave"    , dataObj["battery_bms_slave"    ]);
			if(dataObj.hasOwnProperty("battery_serialnumbers") && dataObj["battery_serialnumbers"] != "") data.append("battery_serialnumbers", dataObj["battery_serialnumbers"]);
		} else if(dataObj["battery_type"] == "carbon") {
			data.append("has_battery"    , "1"     );
			data.append("battery_type"   , "carbon");
			data.append("battery_voltage", "720"   );
			if(dataObj.hasOwnProperty("battery_model"        ) && dataObj["battery_model"        ] != "") data.append("battery_model"        , dataObj["battery_model"        ]);
			if(dataObj.hasOwnProperty("battery_strings"      ) && dataObj["battery_strings"      ] != "") data.append("battery_strings"      , dataObj["battery_strings"      ]);
			if(dataObj.hasOwnProperty("battery_capacity"     ) && dataObj["battery_capacity"     ] != "") data.append("battery_capacity"     , dataObj["battery_capacity"     ]);
		} else if(dataObj["battery_type"] == "other") {
			if(dataObj.hasOwnProperty("battery_capacity") && dataObj["battery_capacity"] != "" && dataObj["battery_capacity"] != "0") {
				data.append("has_battery"    , "1"    );
				data.append("battery_type"   , "other");
				data.append("battery_voltage", "720"  );
				data.append("battery_capacity", dataObj["battery_capacity"]);
			} else {
				data.append("has_battery", "0");
			}
		}
	} else {
		data.append("has_battery", "0");
	}

	$("#confirmLoadCorrect").removeClass("d-none");

	html2canvas(document.querySelector("#summary1"), {
		windowWidth: 1200,
		scale: 2
	}).then(async canvas1 => {

		pdfData = new jsPDF("portrait", "mm", "a4");

		var img1 = canvas1.toDataURL("image/jpeg");
		var dimensions1 = await getImageDimensions(img1);

		var ratio1 = dimensions1.w / dimensions1.h;
		var w1 = 190, h1 = 190 / ratio1;
		if(ratio1 < 0.68) { h1 = 277; w1 = 277 * ratio1; }

		pdfData.addImage(img1, "JPEG", (210 - w1) / 2, 15, w1, h1); // img, type, x, y, width, height

		html2canvas(document.querySelector("#summary2"), {
			windowWidth: 1200,
			scale: 2
		}).then(async canvas2 => {

			var img2 = canvas2.toDataURL("image/jpeg");
			var dimensions2 = await getImageDimensions(img2);

			var ratio2 = dimensions2.w / dimensions2.h;
			var w2 = 190, h2 = 190 / ratio2;
			if(ratio2 < 0.68) { h2 = 277; w2 = 277 * ratio2; }

			pdfData.addPage();
			pdfData.addImage(img2, "JPEG", (210 - w2) / 2, 15, w2, h2); // img, type, x, y, width, height

			var pdfBlob = pdfData.output("blob");

			// HIDE FIELD AFTER CREATION

			$("#confirmLoadCorrect").addClass("d-none");

			// USE BLOB TO SAVE PDF-FILE TO CLOUD

			data.append("pdf_file", pdfBlob, lang.bs_summary.installation_summary);

			$.post({
				url: "https://api.batterx.app/v1/install.php",
				data: data,
				processData: false,
				contentType: false,
				cache: false,
				error: () => { alert("Error, please try again!"); },
				success: (response) => {
					if(response == "1") {
						showSuccess();
						$("#confirmLoadCorrect").removeClass("d-none");
					} else {
						$("#btnFinishInstallation").removeAttr("disabled");
						alert("Error: " + response);
					}
				}
			});

		});

	});

});





function showSuccess() {
	$("#summary1  ").hide();
	$("#summary2  ").hide();
	$("#confirm   ").hide();
	$("#btnFinish ").hide();
	$("#successBox").show();
	$("body").addClass("show-success");
}





$("#btnDownload").on("click", function() {
	pdfData.save(lang.bs_summary.installation_summary + ".pdf");
});





function getImageDimensions(file) {
	return new Promise (function (resolved, rejected) {
		var i = new Image();
		i.onload = function() { resolved({ w: i.width, h: i.height }) };
		i.src = file;
	});
}





var checkRebootInterval;

$("#btnReboot").on("click", () => {
	$.post({
		url: "cmd/reboot.php",
		success: (response) => { console.log(response); },
		error  : (response) => { console.log(response); }
	});
	setTimeout(() => { checkRebootInterval = setInterval(checkReboot_waitForError, 5000); }, 2500);
	// Disable Button
	$("#btnReboot").attr("disabled", "disabled");
	// Show Loading
	$(".notif").removeClass("loading error success").addClass("loading");
});

function checkReboot_waitForError() {
	$.get({
		url: "cmd/working.txt",
		cache: false,
		timeout: 2500,
		success: (response) => {
			if(!response) {
				clearInterval(checkRebootInterval);
				checkRebootInterval = undefined;
				checkRebootInterval = setInterval(checkReboot_waitForSuccess, 5000);
			}
		},
		error: () => {
			clearInterval(checkRebootInterval);
			checkRebootInterval = undefined;
			checkRebootInterval = setInterval(checkReboot_waitForSuccess, 5000);
		}
	});
}

function checkReboot_waitForSuccess() {
	$.get({
		url: "cmd/working.txt",
		cache: false,
		timeout: 2500,
		success: (response) => {
			if(response) {
				clearInterval(checkRebootInterval);
				checkRebootInterval = undefined;
				// Show Success
				$(".notif").removeClass("loading error success").addClass("success");
			}
		}
	});
}
