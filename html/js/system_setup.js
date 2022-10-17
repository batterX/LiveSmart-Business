$progress.trigger("step", 5);










//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////










/*
	Define Variables
*/

var skipSetup = false;

var systemApikey   = apikey;
var deviceDatetime = "";

var newParameters  = {};
var oldParameters  = {};

var tempDatetime   = "";

var isAlreadyRegistered = false;
var isSettingParameters = false;
var checkParametersInterval;
var checkParametersCounter;

var dataSettings = {};
var importedData = {};










//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////










/*
	Helper Functions
*/

function isLiFePO () { return $("#bx_battery_type_0").is(":checked"); }
function isCarbon () { return $("#bx_battery_type_1").is(":checked"); }
function isOther  () { return $("#bx_battery_type_9").is(":checked"); }










/*
    Helper Functions
*/

function disableBtnNext() { $("#btn_next").attr("disabled", true); }










/*
    Helper Functions
*/

function allFieldsCorrect() {
    
    // Return If Empty Field
	if(	$("#installation_date").val() == "" ||
		$("#bx_system        ").val() == "" ||
		$("#bx_model         ").val() == "" ||
		$("#bx_box           ").val() == ""
	) return false;

	// LiFePO
	if(isLiFePO()) {
		var countMaster    = 0;
		var countSlave     = 0;
		var countBatteries = 0;
		$("#lifepo_bms").val().trim().split("\n").forEach(sn => {
			if(sn.trim() != "") { if(sn.trim().startsWith("PPTBB0")) countMaster += 1; else countSlave += 1; }
		});
		$("#lifepo_serialnumbers").val().trim().split("\n").forEach(sn => {
			if(sn.trim() != "") countBatteries += 1;
		});
		if($("#lifepo_portname").val() == "") return false;
		if(countMaster != 1 || countSlave < 2 || countBatteries < 22) return false;
		if(countBatteries % 22 != 0 && countBatteries % 24 != 0) return false;
		if(countBatteries / 11 != countSlave && countBatteries / 12 != countSlave) return false;
	}
	// Carbon
	else if(isCarbon()) {
		if( $("#carbon_battery_model   ").val() == "" ||
			$("#carbon_battery_strings ").val() == "" ||
			$("#carbon_battery_capacity").val() == "" ||
			$("#carbon_battery_ah      ").val() == ""
    	) return false;
	}
	// Other
	else {
		if( $("#other_battery_ah                 ").val() == "" ||
			$("#other_battery_maxChargeC         ").val() == "" ||
			$("#other_battery_maxDischargeC      ").val() == "" ||
			$("#other_battery_minDischargeVoltage").val() == "" ||
			$("#other_battery_voltageHysteresis  ").val() == "" ||
			$("#other_battery_dischargeCurrent   ").val() == ""
		) return false;
	}

    return true;

}










/*
    Helper Functions
*/

function showSettingParametersError(errorStr) {
    clearInterval(checkParametersInterval);
    checkParametersInterval = undefined;
    isSettingParameters = false;
    $("#notif").removeClass("loading error success").addClass("error");
    $("#message").html(errorStr).css("color", "red");
    $("#btn_next").attr("disabled", false).unbind().on("click", () => { mainFormSubmit(); });
}










/*
    Helper Functions
*/

function refreshDevicesList() {
	$.get({
		url: "cmd/usbdevices.php",
		success: (response) => {
			if(!response) return;
			$("#modbus_portlist").html("");
			$("#lifepo_portlist").html("");
			var tempArr = response.trim().split("\n");
			for(var x = 0; x < tempArr.length; x++) {
				tempArr[x] = tempArr[x].replace("/dev/serial/by-id/", "").trim();
				$("#modbus_portlist").append("<option>" + tempArr[x] + "</option>");
				$("#lifepo_portlist").append("<option>" + tempArr[x] + "</option>");
			}
		}
	});
}










/*
    Helper Functions
*/

function verifySolarControllers() {

	var system_serial = $("#bx_system").val();
	var tempArr = [];
	if($("#solar_c1_serial").val().trim() != "") tempArr.push($("#solar_c1_serial").val().trim());
	if($("#solar_c2_serial").val().trim() != "") tempArr.push($("#solar_c2_serial").val().trim());
	if($("#solar_c3_serial").val().trim() != "") tempArr.push($("#solar_c3_serial").val().trim());
	if($("#solar_c4_serial").val().trim() != "") tempArr.push($("#solar_c4_serial").val().trim());
	if($("#solar_c5_serial").val().trim() != "") tempArr.push($("#solar_c5_serial").val().trim());
	if($("#solar_c6_serial").val().trim() != "") tempArr.push($("#solar_c6_serial").val().trim());
	if($("#solar_c7_serial").val().trim() != "") tempArr.push($("#solar_c7_serial").val().trim());
	if($("#solar_c8_serial").val().trim() != "") tempArr.push($("#solar_c8_serial").val().trim());
	
	var canContinue = true;
	tempArr.forEach(sn => {
		if(canContinue) {
			canContinue = false;
			$.post({
				url: "https://api.batterx.app/v1/install.php",
				async: false,
				data: {
					action: "verify_controller",
					system: system_serial,
					serialnumber: sn.trim()
				},
				error: () => { alert("E008. Please refresh the page!"); },
				success: (response) => {
					if(response === "1") {
						canContinue = true;
					} else {
						$("#errorControllerSerial").val(sn.trim());
						$("#errorControllerNotExistOrWithOtherSystem").modal("show");
					}
				}
			});
		}
	});
	
	return canContinue;
}










/*
	Helper Functions
*/

function verifyModulesLiFePO() {
	
	var system_serial = $("#bx_system").val();
	var masterBMS = "";
	var slaveBMS  = [];
	var batteries = [];
	$("#lifepo_bms").val().trim().split("\n").forEach(sn => {
		if(sn.trim() != "") { if(sn.trim().startsWith("PPTBB0")) masterBMS = sn.trim(); else slaveBMS.push(sn.trim()); }
	});
	$("#lifepo_serialnumbers").val().trim().split("\n").forEach(sn => {
		if(sn.trim() != "") batteries.push(sn.trim());
	});

	var canContinue = true;
	batteries.forEach(sn => {
		if(canContinue) {
			canContinue = false;
			$.post({
				url: "https://api.batterx.app/v1/install.php",
				async: false,
				data: {
					action: "verify_battery",
					system: system_serial,
					serialnumber: sn.trim()
				},
				error: () => { alert("E008. Please refresh the page!"); },
				success: (response) => {
					if(response === "1") {
						canContinue = true;
					} else {
						$("#errorBatterySerial").val(sn.trim());
						$("#errorBatteryNotExistOrWithOtherSystem").modal("show");
					}
				}
			});
		}
	});
	slaveBMS.forEach(sn => {
		if(canContinue) {
			canContinue = false;
			$.post({
				url: "https://api.batterx.app/v1/install.php",
				async: false,
				data: {
					action: "verify_bms",
					system: system_serial,
					serialnumber: sn.trim()
				},
				error: () => { alert("E008. Please refresh the page!"); },
				success: (response) => {
					if(response === "1") {
						canContinue = true;
					} else {
						$("#errorBmsSerial").val(sn.trim());
						$("#errorBmsNotExistOrWithOtherSystem").modal("show");
					}
				}
			});
		}
	});
	if(canContinue) {
		canContinue = false;
		$.post({
			url: "https://api.batterx.app/v1/install.php",
			async: false,
			data: {
				action: "verify_bms",
				system: system_serial,
				serialnumber: masterBMS },
			error: () => { alert("E008. Please refresh the page!"); },
			success: (response) => {
				if(response === "1") {
					canContinue = true;
				} else {
					$("#errorBmsSerial").val(sn.trim());
					$("#errorBmsNotExistOrWithOtherSystem").modal("show");
				}
			}
		});
	}
	
	return canContinue;

}










/*
    Helper Functions
*/

setTimeout(() => { $("#modalSkipSetup input").val(""); }, 2500);
$("#modalSkipSetup input").on("keypress", (e) => {
    if(e.which == 13) {
        function sha1(str) {
            var rotate_left = function(n, s) { var t4 = (n << s) | (n >>> (32 - s)); return t4; };
            var cvt_hex = function(val) { var str = '', i, v; for(i = 7; i >= 0; i--) { v = (val >>> (i * 4)) & 0x0f; str += v.toString(16); } return str; };
            var blockstart, i, j, W = new Array(80), H0 = 0x67452301, H1 = 0xEFCDAB89, H2 = 0x98BADCFE, H3 = 0x10325476, H4 = 0xC3D2E1F0, A, B, C, D, E, temp;
            str = unescape(encodeURIComponent(str));
            var str_len = str.length;
            var word_array = [];
            for(i = 0; i < str_len - 3; i += 4) { j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3); word_array.push(j); }
            switch(str_len % 4) {
                case 0: i = 0x080000000; break;
                case 1: i = str.charCodeAt(str_len - 1) << 24 | 0x0800000; break;
                case 2: i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000; break;
                case 3: i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80; break;
            }
            word_array.push(i);
            while((word_array.length % 16) != 14) { word_array.push(0); }
            word_array.push(str_len >>> 29);
            word_array.push((str_len << 3) & 0x0ffffffff);
            for(blockstart = 0; blockstart < word_array.length; blockstart += 16) {
                for(i = 0; i < 16; i++) { W[i] = word_array[blockstart + i]; } for(i = 16; i <= 79; i++) { W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1); } A = H0; B = H1; C = H2; D = H3; E = H4;
                for(i = 0; i <= 19; i++) { temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff; E = D; D = C; C = rotate_left(B, 30); B = A; A = temp; }
                for(i = 20; i <= 39; i++) { temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff; E = D; D = C; C = rotate_left(B, 30); B = A; A = temp; }
                for(i = 40; i <= 59; i++) { temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff; E = D; D = C; C = rotate_left(B, 30); B = A; A = temp; }
                for(i = 60; i <= 79; i++) { temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff; E = D; D = C; C = rotate_left(B, 30); B = A; A = temp; }
                H0 = (H0 + A) & 0x0ffffffff; H1 = (H1 + B) & 0x0ffffffff; H2 = (H2 + C) & 0x0ffffffff; H3 = (H3 + D) & 0x0ffffffff; H4 = (H4 + E) & 0x0ffffffff;
            }
            temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
            return temp.toLowerCase();
        }
        var pw = $("#modalSkipSetup input").val();
        if(sha1(pw) !== "01b6951429065548a08cb881ca9151eb651b6c5f") return $("#modalSkipSetup").modal("hide");
        if($("#btn_next").is(":disabled")) return $("#modalSkipSetup").modal("hide");
        if(confirm("Are you sure you want to continue?")) { $("#modalSkipSetup").modal("hide"); skipSetup = true; $("#btn_next").trigger("click"); }
    }
});










/*
    Helper Functions
*/

function showSystemInfo(json) {

    if(!json) return;

	// Set System Info
	if(json.hasOwnProperty("system") && json.system.hasOwnProperty("serialnumber"))
		$("#bx_system").val(json.system.serialnumber).attr("disabled", true);

	// Set Device Info
	if(json.hasOwnProperty("device") && json.device.hasOwnProperty("nominal_power"))
		$("#bx_model").val(json.device.nominal_power).attr("disabled", true);

	// Set Installation Date
	if(json.hasOwnProperty("installation_date"))
		$("#installation_date").val(json.installation_date);

	// Set Solar Info
	if(json.hasOwnProperty("solar_info"))
		$("#solar_info").val(json.solar_info);

	// Set Generator Info
	if(json.hasOwnProperty("generator_info"))
		$("#generator_info").val(json.generator_info);

	// Set Installer Memo
	if(json.hasOwnProperty("note"))
		$("#installer_memo").val(json.note);

	// Set Solar Controllers Info
	if(json.hasOwnProperty("solar_controllers") && json.solar_controllers.length > 0) {
		if(json.solar_controllers.length > 0) {
			if(json.solar_controllers[0].hasOwnProperty("serialnumber"   )) $("#solar_c1_serial").val(json.solar_controllers[0].serialnumber   );
			if(json.solar_controllers[0].hasOwnProperty("installed_power")) $("#solar_c1_power ").val(json.solar_controllers[0].installed_power);
		}
		if(json.solar_controllers.length > 1) {
			if(json.solar_controllers[1].hasOwnProperty("serialnumber"   )) $("#solar_c2_serial").val(json.solar_controllers[1].serialnumber   );
			if(json.solar_controllers[1].hasOwnProperty("installed_power")) $("#solar_c2_power ").val(json.solar_controllers[1].installed_power);
		}
		if(json.solar_controllers.length > 2) {
			if(json.solar_controllers[2].hasOwnProperty("serialnumber"   )) $("#solar_c3_serial").val(json.solar_controllers[2].serialnumber   );
			if(json.solar_controllers[2].hasOwnProperty("installed_power")) $("#solar_c3_power ").val(json.solar_controllers[2].installed_power);
		}
		if(json.solar_controllers.length > 3) {
			if(json.solar_controllers[3].hasOwnProperty("serialnumber"   )) $("#solar_c4_serial").val(json.solar_controllers[3].serialnumber   );
			if(json.solar_controllers[3].hasOwnProperty("installed_power")) $("#solar_c4_power ").val(json.solar_controllers[3].installed_power);
		}
		if(json.solar_controllers.length > 4) {
			if(json.solar_controllers[4].hasOwnProperty("serialnumber"   )) $("#solar_c5_serial").val(json.solar_controllers[4].serialnumber   );
			if(json.solar_controllers[4].hasOwnProperty("installed_power")) $("#solar_c5_power ").val(json.solar_controllers[4].installed_power);
		}
		if(json.solar_controllers.length > 5) {
			if(json.solar_controllers[5].hasOwnProperty("serialnumber"   )) $("#solar_c6_serial").val(json.solar_controllers[5].serialnumber   );
			if(json.solar_controllers[5].hasOwnProperty("installed_power")) $("#solar_c6_power ").val(json.solar_controllers[5].installed_power);
		}
		if(json.solar_controllers.length > 6) {
			if(json.solar_controllers[6].hasOwnProperty("serialnumber"   )) $("#solar_c7_serial").val(json.solar_controllers[6].serialnumber   );
			if(json.solar_controllers[6].hasOwnProperty("installed_power")) $("#solar_c7_power ").val(json.solar_controllers[6].installed_power);
		}
		if(json.solar_controllers.length > 7) {
			if(json.solar_controllers[7].hasOwnProperty("serialnumber"   )) $("#solar_c8_serial").val(json.solar_controllers[7].serialnumber   );
			if(json.solar_controllers[7].hasOwnProperty("installed_power")) $("#solar_c8_power ").val(json.solar_controllers[7].installed_power);
		}
		if(json.solar_controllers.length > 2) $("#btnShowAllControllers").click();
	}

	// Set Batteries Info
	if(json.hasOwnProperty("batteries")) {
		// Multiple Batteries (LiFePO Only)
		if(json.batteries.length > 1) {
			var tempArr = [];
			json.batteries.forEach(battery => { tempArr.push(battery.serialnumber); });
			$("#lifepo_serialnumbers").val(tempArr.join("\n"));
			tempArr = [];
			json.batteries_bms.forEach(bms => { tempArr.push(bms.serialnumber); });
			$("#lifepo_bms").val(tempArr.join("\n"));
		}
		// Single Battery (LiFePO|Carbon|Other)
		else if(json.batteries.length == 1 && json.batteries[0].hasOwnProperty("serialnumber") && json.batteries[0].hasOwnProperty("type")) {
			var battery = json.batteries[0];
			// LiFePO
			if(battery.type == 0) {
				$("#lifepo_serialnumbers").val(battery.serialnumber);
			}
			// Carbon
			else if(battery.type == 1) {
				$("#bx_battery_type_1").prop("checked", true).trigger("change");
				if(battery.hasOwnProperty("capacity")) $("#carbon_battery_capacity").val(`${battery.capacity} Wh`);
				if(battery.hasOwnProperty("strings" )) $("#carbon_battery_strings ").val(battery.strings).trigger("change");
				if(battery.hasOwnProperty("model"   )) $("#carbon_battery_model   ").val(battery.model  ).trigger("change");
			}
			// Other
			else if(battery.type == 9) {
				$("#bx_battery_type_9").prop("checked", true).trigger("change");
			}
		}
		// No Batteries
		else {
			$("#bx_battery_type_9").prop("checked", true).trigger("change");
		}
	}

	isAlreadyRegistered = true;

}










/*
    Helper Functions
*/

function showSystemSettings(response) {

	// Show Solar Controllers Settings
	if(response.hasOwnProperty("NominalSol")) {
		var temp = response["NominalSol"];
		if(temp.hasOwnProperty("1")) { $("#solar_c1_power").val(temp["1"]["v1"]).trigger("input"); }
		if(temp.hasOwnProperty("2")) { $("#solar_c2_power").val(temp["2"]["v1"]).trigger("input"); }
		if(temp.hasOwnProperty("3")) { $("#solar_c3_power").val(temp["3"]["v1"]).trigger("input"); }
		if(temp.hasOwnProperty("4")) { $("#solar_c4_power").val(temp["4"]["v1"]).trigger("input"); }
		if(temp.hasOwnProperty("5")) { $("#solar_c5_power").val(temp["5"]["v1"]).trigger("input"); }
		if(temp.hasOwnProperty("6")) { $("#solar_c6_power").val(temp["6"]["v1"]).trigger("input"); }
		if(temp.hasOwnProperty("7")) { $("#solar_c7_power").val(temp["7"]["v1"]).trigger("input"); }
		if(temp.hasOwnProperty("8")) { $("#solar_c8_power").val(temp["8"]["v1"]).trigger("input"); }
	}

	// Show Battery Settings
	var ah                  = null;
	var maxChargeC          = null;
	var maxDischargeC       = null;
	var minDischargeVoltage = null;
	var voltageHysteresis   = null;
	var dischargeCurrent    = null;
	if(response.hasOwnProperty("NominalBattValue") && response["NominalBattValue"].hasOwnProperty("0")) {
		var temp = response["NominalBattValue"]["0"];
		ah                  = parseInt(temp["v1"]);
		maxChargeC          = parseInt(temp["v2"]) / 100;
		maxDischargeC       = parseInt(temp["v3"]) / 100;
	}
	if(response.hasOwnProperty("SystemMode") && response["SystemMode"].hasOwnProperty("0")) {
		var temp = response["SystemMode"]["0"];
		minDischargeVoltage = parseInt(temp["v2"]) / 100;
		voltageHysteresis   = parseInt(temp["v3"]) / 100;
		dischargeCurrent    = parseInt(temp["v4"]) / 100;
	}
	if(ah                  != null) $("#other_battery_ah                 ").val(ah                 );
	if(maxChargeC          != null) $("#other_battery_maxChargeC         ").val(maxChargeC         );
	if(maxDischargeC       != null) $("#other_battery_maxDischargeC      ").val(maxDischargeC      );
	if(minDischargeVoltage != null) $("#other_battery_minDischargeVoltage").val(minDischargeVoltage);
	if(voltageHysteresis   != null) $("#other_battery_voltageHysteresis  ").val(voltageHysteresis  );
	if(dischargeCurrent    != null) $("#other_battery_dischargeCurrent   ").val(dischargeCurrent   );

	// Show System Mode Settings
	if(response.hasOwnProperty("SystemMode") && response["SystemMode"].hasOwnProperty("0")) {
		var temp = response["SystemMode"]["0"];
		$("#sysmode_mode").val(temp["mode"]).trigger("change");
	}
	if(response.hasOwnProperty("EcoMode") && response["EcoMode"].hasOwnProperty("0")) {
		var temp = response["EcoMode"]["0"];
		$("#sysmode_eco").val(temp["v1"]);
	}
	if(response.hasOwnProperty("PfcSet") && response["PfcSet"].hasOwnProperty("0")) {
		var temp = response["PfcSet"]["0"];
		$("#sysmode_pfc").val(temp["v1"]);
	}
	if(response.hasOwnProperty("CutPowerPeak") && response["CutPowerPeak"].hasOwnProperty("0")) {
		var temp = response["CutPowerPeak"]["0"];
		$("#sysmode_cutpeak_max   ").val(parseInt(temp["v1"]));
		$("#sysmode_cutpeak_hyst  ").val(parseInt(temp["v2"]));
		$("#sysmode_cutpeak_target").val(parseInt(temp["v1"]) - parseInt(temp["v2"]));
	}

	// Show LiFePO Connection
	if(response.hasOwnProperty("BattModbusConnect") && response["BattModbusConnect"].hasOwnProperty("0")) {
		var temp = response["BattModbusConnect"]["0"];
		$("#lifepo_portname").val(temp["s1"]);
		$("#lifepo_portname")[0].scrollLeft = $("#lifepo_portname")[0].scrollWidth;
	}
	
	// Show Modbus Connection
	if(response.hasOwnProperty("PowerModbusConnect") && response["PowerModbusConnect"].hasOwnProperty("0")) {
		var temp = response["PowerModbusConnect"]["0"];
		$("#modbus_mode    ").val(temp["mode"]);
		$("#modbus_baudrate").val(temp["v1"]);
		$("#modbus_parity  ").val(temp["s2"].length > 0 ? temp["s2"].charAt(0) : "");
		$("#modbus_stopbits").val(temp["v3"]);
		$("#modbus_portname").val(temp["s1"]);
		$("#modbus_portname")[0].scrollLeft = $("#modbus_portname")[0].scrollWidth;
	}

	// Show Modbus Devices
	if(response.hasOwnProperty("ModbusUpsInputDevice") && response["ModbusUpsInputDevice"].hasOwnProperty("0")) {
		var temp = response["ModbusUpsInputDevice"]["0"];
		$("#modbus_input_on").val(temp["mode"]);
		$("#modbus_input_id").val(temp["v1"]);
	}
	if(response.hasOwnProperty("ModbusUpsOutputDevice") && response["ModbusUpsOutputDevice"].hasOwnProperty("0")) {
		var temp = response["ModbusUpsOutputDevice"]["0"];
		$("#modbus_output_on").val(temp["mode"]);
		$("#modbus_output_id").val(temp["v1"]);
	}
	if(response.hasOwnProperty("ModbusGridDevice") && response["ModbusGridDevice"].hasOwnProperty("0")) {
		var temp = response["ModbusGridDevice"]["0"];
		$("#modbus_grid_on").val(temp["mode"]);
		$("#modbus_grid_id").val(temp["v1"]);
	}
	if(response.hasOwnProperty("ModbusExtSolarDevice") && response["ModbusExtSolarDevice"].hasOwnProperty("0")) {
		var temp = response["ModbusExtSolarDevice"]["0"];
		$("#modbus_extsol_on").val(temp["mode"]);
		$("#modbus_extsol_id").val(temp["v1"]);
	}

	// Show Generator Settings
	if(response.hasOwnProperty("GeneratorSetGlobal") && response["GeneratorSetGlobal"].hasOwnProperty("0")) {
		var temp = response["GeneratorSetGlobal"]["0"];
		$("#generator_enable      ").val(temp["mode"] == "2" ? "1": "0");
		$("#generator_pin         ").val(temp["v1"]);
		$("#generator_pinOld      ").val(temp["v1"]);
		$("#generator_currentLimit").val(temp["v2"] != 1 ? "" : Math.round(temp["v3"] / 10) / 10);
	}
	if(response.hasOwnProperty("GeneratorSetOn") && response["GeneratorSetOn"].hasOwnProperty("0")) {
		var temp = response["GeneratorSetOn"]["0"];
		$("#generator_switchOnType   ").val(temp["mode"]).trigger("change");
		$("#generator_switchOnVoltage").val(Math.round(parseInt(temp["v2"]) / 100));
		$("#generator_minOnTime      ").val(Math.round(parseInt(temp["v1"]) / 60));
		var tempHH = Math.floor(parseInt(temp["v2"]) / 3600).toString();
		var tempMM = Math.floor((parseInt(temp["v2"]) - tempHH * 3600) / 60).toString();
		if(tempHH.length == 1) tempHH = "0" + tempHH;
		if(tempMM.length == 1) tempMM = "0" + tempMM;
		$("#generator_switchOnTime").val(tempHH + ":" + tempMM);
	}
	if(response.hasOwnProperty("GeneratorSetOff") && response["GeneratorSetOff"].hasOwnProperty("0")) {
		var temp = response["GeneratorSetOff"]["0"];
		$("#generator_switchOffType   ").val(temp["mode"]).trigger("change");
		$("#generator_switchOffVoltage").val(Math.round(parseInt(temp["v2"]) / 100));
		$("#generator_minOffTime      ").val(Math.round(parseInt(temp["v1"]) / 60));
		var tempHH = Math.floor(parseInt(temp["v2"]) / 3600).toString();
		var tempMM = Math.floor((parseInt(temp["v2"]) - tempHH * 3600) / 60).toString();
		if(tempHH.length == 1) tempHH = "0" + tempHH;
		if(tempMM.length == 1) tempMM = "0" + tempMM;
		$("#generator_switchOffTime").val(tempHH + ":" + tempMM);
	}

}










/*
	Helper Functions
*/

var bxSet = { "name":1, "mode":11, "v1":21, "v2":22, "v3":23, "v4":24, "v5":25, "v6":26, "s1":31, "s2":32 };

function setSetting(varname, entity, field, value) {
	// Make sure it's not the same
	if(dataSettings.hasOwnProperty(varname))
		if(dataSettings[varname].hasOwnProperty(entity))
			if(dataSettings[varname][entity].hasOwnProperty(field))
				if(dataSettings[varname][entity][field] == value)
					return;
	// Send Command
	return sendCommand(11, bxSet[field], entity + " " + varname, value);
}

function sendCommand(type, entity, text1, text2) {
	$.get({
		url: `api.php?set=command&type=${type}&entity=${entity}&text1=${text1}&text2=${text2}`,
		error: () => { alert("E009. Please refresh the page!") },
		success: function(response) { if(response != "1") return alert("E010. Please refresh the page!"); }
	});
}










//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////










/*
    Show|Hide Import Data From Cloud Button
*/

$("#bx_system").on("change", () => showImportDataFromCloud());

function showImportDataFromCloud() {

    $("#bxBusiness").removeClass("can-import-cloud-data");

    if($("#bx_system").val().trim() == "") return;
    if(Object.keys(dataSettings).length == 0) return;
    if(!dataSettings.hasOwnProperty("CloudSet")) return;
    if(!dataSettings["CloudSet"].hasOwnProperty("0")) return;
    if(!dataSettings["CloudSet"]["0"].hasOwnProperty("mode")) return;
    if(dataSettings["CloudSet"]["0"]["mode"].toString() != "0") return;

    $.post({
        url: "https://api.batterx.app/v1/install.php",
        data: {
            action : "get_system_data",
            system : $("#bx_system").val().trim(),
            customer : customerEmail.trim()
        },
        error: () => { alert("E013. Please refresh the page!"); },
        success: (json) => {
            console.log(json);
            if(!json) return;
            importedData = json;
            $("#bxBusiness").addClass("can-import-cloud-data");
        }
    });

}










/*
    Show Imported Data From Cloud
*/

$("#btnImportDataFromCloud").on("click", () => {
    importSystemInfo();
    importSystemSettings();
    $("#bxBusiness").removeClass("can-import-cloud-data");
});










/*
    Show Imported Data From Cloud
*/

function importSystemInfo() {
    if(!importedData.hasOwnProperty("info")) return;
    showSystemInfo(importedData.info);
}










/*
    Log All Imported Settings to Database
*/

function importSystemSettings() {

    if(!importedData.hasOwnProperty("settings")) return;

    var response = importedData.settings;

    showSystemSettings(response);
	
	$("#importingDataFromCloud").modal("show");

	// "VarName","Entity","Name","InUse","Mode","V1","V2","V3","V4","V5","V6","S1","S2","UpDateTime","CRC"
	var crc_table = new Uint32Array(256);
	for(var i=256; i--;) {
		var tmp = i;
		for(var k=8; k--;) tmp = tmp & 1 ? 0xedb88320 ^ tmp >>> 1 : tmp >>> 1;
		crc_table[i] = tmp;
	}
	function long_to_bytearray(x) {
		let y = Math.floor(x/2**32);
		return [y, (y << 8), (y << 16), (y << 24), x, (x << 8), (x << 16), (x << 24)].map(z => z >>> 24);
	}
	function make_crc(longs) {
		var data = [];
		longs.forEach(long => { data.push(...long_to_bytearray(long).reverse()); });
		var crc = -1;
		for(var i=0, l=data.length; i<l; i++) crc = crc >>> 8 ^ crc_table[ crc & 255 ^ data[i] ];
		return (crc ^ -1) >>> 0;
	}
	var json_array = [];
	for(var varname in response) {
		if(response.hasOwnProperty(varname)) {
			for(var entity in response[varname]) {
				if(response[varname].hasOwnProperty(entity)) {
					json_array.push([
						varname,
						entity,
						response[varname][entity]["name"],
						response[varname][entity]["inuse"],
						response[varname][entity]["mode"],
						response[varname][entity]["v1"],
						response[varname][entity]["v2"],
						response[varname][entity]["v3"],
						response[varname][entity]["v4"],
						response[varname][entity]["v5"],
						response[varname][entity]["v6"],
						response[varname][entity]["s1"],
						response[varname][entity]["s2"],
						response[varname][entity]["updatetime"],
						make_crc([
							parseInt(response[varname][entity]["mode"]),
							parseInt(response[varname][entity]["v1"]),
							parseInt(response[varname][entity]["v2"]),
							parseInt(response[varname][entity]["v3"]),
							parseInt(response[varname][entity]["v4"]),
							parseInt(response[varname][entity]["v5"]),
							parseInt(response[varname][entity]["v6"])
						])
					]);
				}
			}
		}
	}

	$.post({
		url: "cmd/importsettings.php",
		data: { data: JSON.stringify(json_array) },
		error: () => { alert("E011. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			if(response !== "1") return alert("E012. Please refresh the page!");
			setTimeout(() => {
				alert("Data imported successfully!");
				$("#importingDataFromCloud").modal("hide");
			}, 2500);
		}
	});

}










/*
	More Controllers OnClick Listener
*/

$("#btnShowAllControllers").on("click", function() {
	$("#listAllControllers").removeClass("d-none");
	$(this).addClass("d-none");
});










/*
	Calculate Total Solar Power Installed OnInput Listener
*/

$(".solar-controller").on("input", () => {
	var sol1 = $("#solar_c1_power").val(); sol1 = (sol1 == "") ? 0 : parseInt(sol1);
	var sol2 = $("#solar_c2_power").val(); sol2 = (sol2 == "") ? 0 : parseInt(sol2);
	var sol3 = $("#solar_c3_power").val(); sol3 = (sol3 == "") ? 0 : parseInt(sol3);
	var sol4 = $("#solar_c4_power").val(); sol4 = (sol4 == "") ? 0 : parseInt(sol4);
	var sol5 = $("#solar_c5_power").val(); sol5 = (sol5 == "") ? 0 : parseInt(sol5);
	var sol6 = $("#solar_c6_power").val(); sol6 = (sol6 == "") ? 0 : parseInt(sol6);
	var sol7 = $("#solar_c7_power").val(); sol7 = (sol7 == "") ? 0 : parseInt(sol7);
    var sol8 = $("#solar_c8_power").val(); sol8 = (sol8 == "") ? 0 : parseInt(sol8);
    $("#solar_total_power").val(sol1 + sol2 + sol3 + sol4 + sol5 + sol6 + sol7 + sol8);
});










/*
	Cut Peak Power Target OnInput Listener
*/

$("#sysmode_cutpeak_max, #sysmode_cutpeak_hyst").on("input", () => {
	var powerMax  = $("#sysmode_cutpeak_max ").val(); powerMax  = (powerMax  == "") ? 0 : parseInt(powerMax );
	var powerHyst = $("#sysmode_cutpeak_hyst").val(); powerHyst = (powerHyst == "") ? 0 : parseInt(powerHyst);
    $("#sysmode_cutpeak_target").val(powerMax - powerHyst);
});










/*
	Battery Type OnChange Listener
*/

$("input[name=bx_battery_type]").on("change", function() {
	$(`#battery_section_0, #battery_section_1, #battery_section_9`).hide();
	$(`#battery_section_${this.value}`).show();
});










/*
	Carbon Batteries OnChange Listener
*/

$("#carbon_battery_model, #carbon_battery_strings").on("change", function() {

	var batteryModel    = $("#carbon_battery_model").val();
	var batteryStrings  = $("#carbon_battery_strings").val();
	var batteryCapacity = 0;
	var batteryAh       = 0;

	if(batteryModel == "LC+700") {
		batteryCapacity = 60 * 700 * parseInt(batteryStrings);
		batteryAh       = 50 * parseInt(batteryStrings);
	} else if(batteryModel == "LC+1300") {
		batteryCapacity = 60 * 1300 * parseInt(batteryStrings);
		batteryAh       = 100 * parseInt(batteryStrings);
	}

	$("#carbon_battery_capacity").val(`${batteryCapacity} Wh`);
	$("#carbon_battery_ah      ").val(`${batteryAh      } Ah`);

});










/*
	System Mode OnChange Listener
*/

$("#sysmode_mode").on("change", function() {
	if(this.value == "3") $("#sysmode_cutpeak_section").show();
	else $("#sysmode_cutpeak_section").hide();
});










/*
	Generator Switch Type OnChange Listener
*/

$("#generator_switchOnType").on("change", function() {
	if($(this).val() == 1) {
		$("#generator_switchOnTime_container").removeClass("d-none");
		$("#generator_switchOnVoltage_container").addClass("d-none");
		$("#generator_switchOnTime").removeAttr("disabled");
		$("#generator_switchOnVoltage").removeAttr("disabled");
	} else if($(this).val() == 2) {
		$("#generator_switchOnTime_container").addClass("d-none");
		$("#generator_switchOnVoltage_container").removeClass("d-none");
		$("#generator_switchOnTime").removeAttr("disabled");
		$("#generator_switchOnVoltage").removeAttr("disabled");
	} else {
		$("#generator_switchOnTime").attr("disabled", true);
		$("#generator_switchOnVoltage").attr("disabled", true);
	}
});

$("#generator_switchOffType").on("change", function() {
	if($(this).val() == 1) {
		$("#generator_switchOffTime_container").removeClass("d-none");
		$("#generator_switchOffVoltage_container").addClass("d-none");
		$("#generator_switchOffTime").removeAttr("disabled");
		$("#generator_switchOffVoltage").removeAttr("disabled");
	} else if($(this).val() == 2) {
		$("#generator_switchOffTime_container").addClass("d-none");
		$("#generator_switchOffVoltage_container").removeClass("d-none");
		$("#generator_switchOffTime").removeAttr("disabled");
		$("#generator_switchOffVoltage").removeAttr("disabled");
	} else {
		$("#generator_switchOffTime").attr("disabled", true);
		$("#generator_switchOffVoltage").attr("disabled", true);
	}
});










/*
	USB Devices OnClick Listener
*/

refreshDevicesList();

$("#modbus_portlist_refresh, #lifepo_portlist_refresh").on("click", () => { refreshDevicesList(); });

$("#modbus_portlist_apply").on("click", () => {
	var selectedVal = $("#modbus_portlist").val();
	$("#modbus_portname").val(selectedVal != "" ? "/dev/serial/by-id/" + selectedVal : "");
	$("#modbus_portname")[0].scrollLeft = $("#modbus_portname")[0].scrollWidth;
});

$("#lifepo_portlist_apply").on("click", () => {
	var selectedVal = $("#lifepo_portlist").val();
	$("#lifepo_portname").val(selectedVal != "" ? "/dev/serial/by-id/" + selectedVal : "");
	$("#lifepo_portname")[0].scrollLeft = $("#lifepo_portname")[0].scrollWidth;
});










/*
    Activate Submit Button
*/

setInterval(() => {

    // Return If Empty Fields
    if(!allFieldsCorrect()) return disableBtnNext();

    // Enable|Disable Button Next
    $("#btn_next").attr("disabled", isSettingParameters);

}, 1000);










//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////










/*
	Begin Process
*/

step1();










/*
    Check If Apikey Correct
*/

function step1() {

    if(!apikey || apikey.length != 40) return alert("E003. Please refresh the page!");

    step2();

}










/*
	Get Installation Info
*/

function step2() {

	$.post({
		url: "https://api.batterx.app/v1/install.php",
		data: {
			action: "get_installation_info",
			apikey: systemApikey
		},
		error: () => { alert("E004. Please refresh the page!"); },
		success: (json) => {

			console.log(json);

			if(!json) { step3(); return; }

			showSystemInfo(json);

			step3();

		}
	});

}










/*
	Set LiveX Serial-Number
*/

function step3() {

	$.post({
		url: "https://api.batterx.app/v1/install.php",
		data: {
			action: "get_box_serial",
			apikey: systemApikey
		},
		error: () => { alert("E005. Please refresh the page!"); },
		success: (response) => {

			console.log(response);

			var box_serial = response;

			if(!box_serial) return $("#errorBoxNotRegistered").modal("show");

			// Save LiveX Serial-Number to Session
			$.post({
				url: "cmd/session.php",
				data: { box_serial: box_serial },
				error: () => { alert("E006. Please refresh the page!"); },
				success: (response) => {
					console.log(response);
					if(response !== "1") return alert("E007. Please refresh the page!");
					$("#bx_box").val(box_serial);
					step4();
				}
			});

		}
	});

}










/*
	Load Other Parameters From Settings Table
*/

function step4() {

	$.get({
		url: "api.php?get=settings",
		error: () => { alert("E002. Please refresh the page!") },
		success: (response) => {

			console.log(response);

			if(!response || typeof response != "object") return alert("E003. Please refresh the page!");

			dataSettings = JSON.parse(JSON.stringify(response));

			showSystemSettings(response);

            // Show|Hide Import Data From Cloud Button
            showImportDataFromCloud();
			
		}
	});

}










//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////










/*
    Main Form On-Submit
*/

$("#mainForm").on("submit", (e) => {
	e.preventDefault();
	mainFormSubmit();
});

function mainFormSubmit() {
	if(isOther() && $("#other_battery_ah").val() != "0") {
		$("#modalConfirmOtherBatteries").modal("show");
		$("#modalConfirmOtherBatteries button").unbind().on("click", () => {
			$("#modalConfirmOtherBatteries").modal("hide");
			mainFormSubmit_2();
		});
	} else {
		mainFormSubmit_2();
	}
}










/*
    Check All Fields
*/

function mainFormSubmit_2() {

	// Return If Empty Fields
    if(!allFieldsCorrect()) return;

	// Verify Solar Controllers
	if(!verifySolarControllers()) return;

	// Verify Battery Modules
	if(isLiFePO() && !verifyModulesLiFePO()) return;

	// Check UPS S/N
	$.post({
		url: "https://api.batterx.app/v1/install.php",
		data: {
			action       : "verify_device",
			serialnumber : $("#bx_system").val(),
			system       : $("#bx_system").val()
		},
		error: () => { alert("E008. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			if(response !== "1") $("#errorUpsRegisteredWithOtherSystem").modal("show");
			mainFormSubmit_3();
		}
	});

}










/*
	Start Setup
*/

function mainFormSubmit_3() {





	// Disable All Fields

	$(` #bx_system,
		#bx_model,
		#bx_box,
		#btnInstallerMemo,
		#installer_memo,
		
		#solar_c1_serial, #solar_c1_power,
		#solar_c2_serial, #solar_c2_power,
		#solar_c3_serial, #solar_c3_power,
		#solar_c4_serial, #solar_c4_power,
		#solar_c5_serial, #solar_c5_power,
		#solar_c6_serial, #solar_c6_power,
		#solar_c7_serial, #solar_c7_power,
		#solar_c8_serial, #solar_c8_power,
		#btnShowAllControllers,
		#solar_total_power,
		#solar_info,

		#bx_battery_type_0,
		#lifepo_bms,
		#lifepo_serialnumbers,
		#lifepo_portname,
		#lifepo_portlist,
		#lifepo_portlist_refresh,
		#lifepo_portlist_apply,

		#bx_battery_type_1,
		#carbon_battery_model,
		#carbon_battery_strings,
		#carbon_battery_capacity,
		#carbon_battery_ah,
		
		#bx_battery_type_9,
		#other_battery_ah,
		#other_battery_maxChargeC,
		#other_battery_maxDischargeC,
		#other_battery_minDischargeVoltage,
		#other_battery_voltageHysteresis,
		#other_battery_dischargeCurrent,

		#sysmode_mode,
		#sysmode_cutpeak_max,
		#sysmode_cutpeak_hyst,
		#sysmode_cutpeak_target,
		#sysmode_eco,
		#sysmode_pfc,
		#btnGenerator,

		#modbus_mode,
		#modbus_baudrate,
		#modbus_parity,
		#modbus_stopbits,
		#modbus_portname,
		#modbus_portlist,
		#modbus_portlist_refresh,
		#modbus_portlist_apply,

		#modbus_input_on,
		#modbus_input_id,
		#modbus_output_on,
		#modbus_output_id,
		#modbus_grid_on,
		#modbus_grid_id,
		#modbus_extsol_on,
		#modbus_extsol_id
	`).attr("disabled", true);





	// Show Loading Screen

	isSettingParameters = true;
	disableBtnNext();
	$(".setting-progress").removeClass("d-none");





	// Scroll To Bottom

	$("html, body").scrollTop($(document).height());





	/*
		Set Values To Session
	*/

	setValuesToSession();





}










/*
    Set Values To Session
*/

function setValuesToSession() {





    var tempData = {};





    // Common Parameters

	tempData.installation_date      = $("#installation_date     ").val();
	tempData.system_serial          = $("#bx_system             ").val();
	tempData.device_serial          = $("#bx_system             ").val();
	tempData.device_model           = "batterX UPS";
	tempData.device_power           = $("#bx_model              ").val();
	tempData.note                   = $("#installer_memo        ").val();
	tempData.solar_wattpeak         = $("#solar_total_power     ").val();
	tempData.solar_info             = $("#solar_info            ").val();
	tempData.generator_info         = $("#generator_info        ").val();





	// Solar Controllers

	var solar_controllers_serialnumbers = [];
	var solar_controllers_wattpeak      = [];
	if($("#solar_c1_serial").val() != "" && $("#solar_c1_power").val() != "") { solar_controllers_serialnumbers.push($("#solar_c1_serial").val()); solar_controllers_wattpeak.push($("#solar_c1_power").val()); }
	if($("#solar_c2_serial").val() != "" && $("#solar_c2_power").val() != "") { solar_controllers_serialnumbers.push($("#solar_c2_serial").val()); solar_controllers_wattpeak.push($("#solar_c2_power").val()); }
	if($("#solar_c3_serial").val() != "" && $("#solar_c3_power").val() != "") { solar_controllers_serialnumbers.push($("#solar_c3_serial").val()); solar_controllers_wattpeak.push($("#solar_c3_power").val()); }
	if($("#solar_c4_serial").val() != "" && $("#solar_c4_power").val() != "") { solar_controllers_serialnumbers.push($("#solar_c4_serial").val()); solar_controllers_wattpeak.push($("#solar_c4_power").val()); }
	if($("#solar_c5_serial").val() != "" && $("#solar_c5_power").val() != "") { solar_controllers_serialnumbers.push($("#solar_c5_serial").val()); solar_controllers_wattpeak.push($("#solar_c5_power").val()); }
	if($("#solar_c6_serial").val() != "" && $("#solar_c6_power").val() != "") { solar_controllers_serialnumbers.push($("#solar_c6_serial").val()); solar_controllers_wattpeak.push($("#solar_c6_power").val()); }
	if($("#solar_c7_serial").val() != "" && $("#solar_c7_power").val() != "") { solar_controllers_serialnumbers.push($("#solar_c7_serial").val()); solar_controllers_wattpeak.push($("#solar_c7_power").val()); }
	if($("#solar_c8_serial").val() != "" && $("#solar_c8_power").val() != "") { solar_controllers_serialnumbers.push($("#solar_c8_serial").val()); solar_controllers_wattpeak.push($("#solar_c8_power").val()); }
	tempData.solar_controllers_serialnumbers = solar_controllers_serialnumbers.join(",");
	tempData.solar_controllers_wattpeak      = solar_controllers_wattpeak     .join(",");





    // Battery Parameters

    if(isLiFePO()) {
        tempData.battery_type    = "lifepo";
        tempData.battery_voltage = "32";
		var masterBMS = "";
		var slaveBMS  = [];
		var batteries = [];
		$("#lifepo_bms").val().trim().split("\n").forEach(sn => {
			if(sn.trim() != "") { if(sn.trim().startsWith("PPTBB0")) masterBMS = sn.trim(); else slaveBMS.push(sn.trim()); }
		});
		$("#lifepo_serialnumbers").val().trim().split("\n").forEach(sn => {
			if(sn.trim() != "") batteries.push(sn.trim());
		});
		tempData.battery_bms_master    = masterBMS;
		tempData.battery_bms_slave     = slaveBMS.join(",");
		tempData.battery_serialnumbers = batteries.join(",");
    } else if(isCarbon()) {
        tempData.battery_type     = "carbon";
		tempData.battery_voltage  = "720";
		tempData.battery_capacity = $("#carbon_battery_capacity").val().split(" ")[0];
		tempData.battery_model    = $("#carbon_battery_model   ").val();
		tempData.battery_strings  = $("#carbon_battery_strings ").val();
    } else {
        tempData.battery_type     = "other";
		tempData.battery_voltage  = "720";
		tempData.battery_capacity = parseInt($("#other_battery_ah").val()) * 720;
    }





    // Add Values To Session

    $.post({
        url: "cmd/session.php",
        data: tempData,
        error: () => { alert("E056. Please refresh the page!"); },
        success: (response) => {
            console.log(response);
            if(response !== "1") return alert("E057. Please refresh the page!");
            // Start Setup
            checkParametersCounter = 0;
            if(skipSetup)
                setTimeout(() => { window.location.href = "system_test.php"; }, 2500);
            else
                setup1();
        }
    });





}










//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////










/*
    Begin Setup
*/

function setup1() {
    




    isSettingParameters = true;
    $("#notif").removeClass("loading error success").addClass("loading");
    $("#message").html(lang.bs_system_setup.msg_setting_parameters).css("color", "");





	// Set Solar Controllers
	
	var sol1 = $("#solar_c1_power").val(); sol1 = (sol1 == "") ? 0 : parseInt(sol1);
	var sol2 = $("#solar_c2_power").val(); sol2 = (sol2 == "") ? 0 : parseInt(sol2);
	var sol3 = $("#solar_c3_power").val(); sol3 = (sol3 == "") ? 0 : parseInt(sol3);
	var sol4 = $("#solar_c4_power").val(); sol4 = (sol4 == "") ? 0 : parseInt(sol4);
	var sol5 = $("#solar_c5_power").val(); sol5 = (sol5 == "") ? 0 : parseInt(sol5);
	var sol6 = $("#solar_c6_power").val(); sol6 = (sol6 == "") ? 0 : parseInt(sol6);
	var sol7 = $("#solar_c7_power").val(); sol7 = (sol7 == "") ? 0 : parseInt(sol7);
	var sol8 = $("#solar_c8_power").val(); sol8 = (sol8 == "") ? 0 : parseInt(sol8);
	var sol0 = sol1 + sol2 + sol3 + sol4 + sol5 + sol6 + sol7 + sol8;

	setSetting("NominalSol", "1", "v1", sol1);
	setSetting("NominalSol", "2", "v1", sol2);
	setSetting("NominalSol", "3", "v1", sol3);
	setSetting("NominalSol", "4", "v1", sol4);
	setSetting("NominalSol", "5", "v1", sol5);
	setSetting("NominalSol", "6", "v1", sol6);
	setSetting("NominalSol", "7", "v1", sol7);
	setSetting("NominalSol", "8", "v1", sol8);
	setSetting("NominalSol", "0", "v1", sol0);





	// Set Modbus Connection

	setSetting("PowerModbusConnect", "0", "mode", $("#modbus_mode    ").val());
	setSetting("PowerModbusConnect", "0", "v1"  , $("#modbus_baudrate").val());
	setSetting("PowerModbusConnect", "0", "v3"  , $("#modbus_stopbits").val());
	setSetting("PowerModbusConnect", "0", "s1"  , $("#modbus_portname").val());
	setSetting("PowerModbusConnect", "0", "s2"  , $("#modbus_parity  ").val());





	// Set Modbus Devices

	setSetting("ModbusUpsInputDevice"   , "0", "mode", $("#modbus_input_on ").val());
	setSetting("ModbusUpsOutputDevice"  , "0", "mode", $("#modbus_output_on").val());
	setSetting("ModbusGridDevice"       , "0", "mode", $("#modbus_grid_on  ").val());
	setSetting("ModbusExtSolarDevice"   , "0", "mode", $("#modbus_extsol_on").val());
	setSetting("ModbusUpsInputDevice"   , "0", "v1"  , $("#modbus_input_id ").val());
	setSetting("ModbusUpsOutputDevice"  , "0", "v1"  , $("#modbus_output_id").val());
	setSetting("ModbusGridDevice"       , "0", "v1"  , $("#modbus_grid_id  ").val());
	setSetting("ModbusExtSolarDevice"   , "0", "v1"  , $("#modbus_extsol_id").val());
	setSetting("ModbusUpsInputDevice"   , "0", "v5"  , "1");
	setSetting("ModbusUpsOutputDevice"  , "0", "v5"  , "1");
	setSetting("ModbusGridDevice"       , "0", "v5"  , "1");
	setSetting("ModbusExtSolarDevice"   , "0", "v5"  , "1");
	setSetting("ModbusUpsInputDataFrom" , "0", "mode", "0");
	setSetting("ModbusUpsOutputDataFrom", "0", "mode", "0");





	// Set System Mode

	setSetting("SystemMode"  , "0", "mode", $("#sysmode_mode        ").val()); // System Mode
	setSetting("EcoMode"     , "0", "v1"  , $("#sysmode_eco         ").val()); // Automatic ECO Mode
	setSetting("PfcSet"      , "0", "v1"  , $("#sysmode_pfc         ").val()); // Automatic PFC OFF
	setSetting("CutPowerPeak", "0", "v1"  , $("#sysmode_cutpeak_max ").val()); // Cut Peak - Max Power
	setSetting("CutPowerPeak", "0", "v2"  , $("#sysmode_cutpeak_hyst").val()); // Cut Peak - Power Hysteresis





	// Set Other Parameters

	setSetting("BxDrive", "0", "v1", "1"); // Enable BxDrive (?)
	setSetting("BxDrive", "0", "v3", "1"); // Enable UPS Commands

	setSetting("AutoKeepBattV"  , "0", "mode", "1"  ); // Auto Keep Voltage (ON)
	setSetting("AutoKeepBattV"  , "0", "v1"  , "300"); // Voltage Keep Hysteresis (3V)
	setSetting("NominalBattType", "0", "v3"  , "1"  ); // Battery Voltage Correction (ON)





	// Enable Cloud

	setSetting("CloudSet", "0", "mode", "1"); // Enable Cloud Connection





	// Send Commands

	sendCommand("20483", "0", "0", ""); // Set Boost OFF
	sendCommand("20484", "0", "1", ""); // Set PFC ON
	sendCommand("20485", "0", "0", ""); // Set ECO Mode OFF





	// Set Generator

	if($("#generator_enable").val() == "1") {
		var switchOnType     = 0; if($("#generator_switchOnType    ").val().trim() != "") switchOnType     = parseFloat($("#generator_switchOnType    ").val().trim());
		var minOnTime        = 0; if($("#generator_minOnTime       ").val().trim() != "") minOnTime        = parseFloat($("#generator_minOnTime       ").val().trim());
		var switchOnVoltage  = 0; if($("#generator_switchOnVoltage ").val().trim() != "") switchOnVoltage  = parseFloat($("#generator_switchOnVoltage ").val().trim());
		var switchOffType    = 0; if($("#generator_switchOffType   ").val().trim() != "") switchOffType    = parseFloat($("#generator_switchOffType   ").val().trim());
		var minOffTime       = 0; if($("#generator_minOffTime      ").val().trim() != "") minOffTime       = parseFloat($("#generator_minOffTime      ").val().trim());
		var switchOffVoltage = 0; if($("#generator_switchOffVoltage").val().trim() != "") switchOffVoltage = parseFloat($("#generator_switchOffVoltage").val().trim());
		var pin              = 0; if($("#generator_pin             ").val().trim() != "") pin              = parseFloat($("#generator_pin             ").val().trim());
		var pinOld           = 0; if($("#generator_pinOld          ").val().trim() != "") pinOld           = parseFloat($("#generator_pinOld          ").val().trim());
		var currentLimit     = 0; if($("#generator_currentLimit    ").val().trim() != "") currentLimit     = parseFloat($("#generator_currentLimit    ").val().trim());
		var switchOnTime     = 0; if($("#generator_switchOnTime    ").val().trim() != "") { var tempOnTime  = $("#generator_switchOnTime ").val().trim().split(":"); switchOnTime  = parseInt(tempOnTime [0]) * 3600 + parseInt(tempOnTime [1]) * 60; }
		var switchOffTime    = 0; if($("#generator_switchOffTime   ").val().trim() != "") { var tempOffTime = $("#generator_switchOffTime").val().trim().split(":"); switchOffTime = parseInt(tempOffTime[0]) * 3600 + parseInt(tempOffTime[1]) * 60; }
		minOnTime        = Math.round(minOnTime        *  60);
		switchOnVoltage  = Math.round(switchOnVoltage  * 100);
		minOffTime       = Math.round(minOffTime       *  60);
		switchOffVoltage = Math.round(switchOffVoltage * 100);
		currentLimit     = Math.round(currentLimit     * 100);
		setSetting("GeneratorSetGlobal", "0", "mode", "2");
		setSetting("GeneratorSetGlobal", "0", "v1"  , pin);
		setSetting("GeneratorSetGlobal", "0", "v2"  , currentLimit > 0 ? 1 : 0);
		setSetting("GeneratorSetGlobal", "0", "v3"  , currentLimit);
		setSetting("GeneratorSetOn"    , "0", "mode", switchOnType);
		setSetting("GeneratorSetOn"    , "0", "v1"  , minOnTime);
		setSetting("GeneratorSetOn"    , "0", "v2"  , switchOnType == 2 ? switchOnVoltage : switchOnTime);
		setSetting("GeneratorSetOn"    , "0", "v3"  , "30");
		setSetting("GeneratorSetOff"   , "0", "mode", switchOffType);
		setSetting("GeneratorSetOff"   , "0", "v1"  , minOffTime);
		setSetting("GeneratorSetOff"   , "0", "v2"  , switchOffType == 2 ? switchOffVoltage : switchOffTime);
		setSetting("GeneratorSetOff"   , "0", "v3"  , "30");
		if(pin != pinOld) {
			if(pinOld != "0") {
				setSetting("BxOutPin", pinOld, "mode", "0");
				setSetting("BxOutPin", pinOld, "v5"  , "0");
				setSetting("BxOutPin", pinOld, "s2"  , "" );
			}
			if(pin != "0") {
				setSetting("BxOutPin", pin, "mode", "1");
				setSetting("BxOutPin", pin, "v5"  , "1");
				setSetting("BxOutPin", pin, "s2"  , "GeneratorSetGlobal");
			}
		}
	} else {
		setSetting("GeneratorSetGlobal", "0", "mode", "0");
	}





    // Set Battery Parameters

	var batteryType                = 1;
	var batteryVoltage             = 1200;
	var batteryCount               = 30;
	var batteryAh                  = 0;
	var batteryMaxChargeC          = 15;
	var batteryMaxDischargeC       = 100;
	var batteryStartChargeCurrent  = -10;
	var batteryChargeCurrent       = 0;
	var batteryMinDischargeVoltage = 0;
	var batteryVoltageHysteresis   = 0;
	var batteryDischargeCurrent    = 0;
	var redischargingVoltage       = 0;
	var batteryDischargeLimit      = 35000;

	if(isLiFePO()) {
		var lifepoCount = 0;
		$("#lifepo_serialnumbers").val().trim().split("\n").forEach(sn => { if(sn.trim() != "") lifepoCount += 1; });
		var lifepoStrings = Math.round(lifepoCount / 23); // Can have 22 modules or 24 modules, so divide by 23
		batteryType                = 4;
		batteryVoltage             = 3200;
		batteryCount               = (lifepoCount % 24 == 0) ? 12 : 11;
		batteryAh                  = Math.round(148 * lifepoStrings);
		batteryMaxChargeC          = 50;
		batteryMaxDischargeC       = 50;
		batteryChargeCurrent       = Math.round(batteryAh * 0.2 * 100);
		batteryMinDischargeVoltage = 34000;
		batteryVoltageHysteresis   = 2500;
		batteryDischargeCurrent    = Math.round(batteryAh * 0.5 * 100);
		redischargingVoltage       = 37000;
		batteryDischargeLimit      = 34000;
	} else if(isCarbon()) {
		batteryType                = 3;
		batteryVoltage             = 1200;
		batteryCount               = 30;
		batteryAh                  = parseInt($("#carbon_battery_ah").val().split(" ")[0]);
		batteryMaxChargeC          = 15;
		batteryMaxDischargeC       = 100;
		batteryChargeCurrent       = Math.round(batteryAh * 0.15 * 100);
		batteryMinDischargeVoltage = 35600;
		batteryVoltageHysteresis   = 5000;
		batteryDischargeCurrent    = Math.round(batteryAh * 0.40 * 100);
		redischargingVoltage       = 40500;
		batteryDischargeLimit      = 35000;
	} else {
		batteryType                = 1;
		batteryVoltage             = 1200;
		batteryCount               = 30;
		batteryAh                  = Math.round(parseFloat($("#other_battery_ah                 ").val()) *   1);
		batteryMaxChargeC          = Math.round(parseFloat($("#other_battery_maxChargeC         ").val()) * 100);
		batteryMaxDischargeC       = Math.round(parseFloat($("#other_battery_maxDischargeC      ").val()) * 100);
		batteryChargeCurrent       = Math.round(batteryAh * batteryMaxChargeC);
		batteryMinDischargeVoltage = Math.round(parseFloat($("#other_battery_minDischargeVoltage").val()) * 100);
		batteryVoltageHysteresis   = Math.round(parseFloat($("#other_battery_voltageHysteresis  ").val()) * 100);
		batteryDischargeCurrent    = Math.round(parseFloat($("#other_battery_dischargeCurrent   ").val()) * 100);
		redischargingVoltage       = Math.round(batteryMinDischargeVoltage + batteryVoltageHysteresis);
		batteryDischargeLimit      = batteryMinDischargeVoltage;
	}

	setSetting("NominalBattType" , "0", "mode", batteryType               ); // Battery Type (1=AGM|3=Carbon|4=LiFePO)
	setSetting("NominalBattType" , "0", "v1"  , batteryVoltage            ); // One Battery Voltage
	setSetting("NominalBattType" , "0", "v2"  , batteryCount              ); // Battery Count N -> VDC+
	setSetting("NominalBattValue", "0", "v1"  , batteryAh                 ); // Battery Total Capacity Ah
	setSetting("NominalBattValue", "0", "v2"  , batteryMaxChargeC         ); // Battery Max Charge C
	setSetting("NominalBattValue", "0", "v3"  , batteryMaxDischargeC      ); // Battery Max Discharge C
	setSetting("NominalBattValue", "0", "v4"  , batteryStartChargeCurrent ); // Battery Start Charge Current (-0.1A Keep Disharging)
	setSetting("SystemMode"      , "0", "v1"  , batteryChargeCurrent      ); // Charge Current (?)
	setSetting("SystemMode"      , "0", "v2"  , batteryMinDischargeVoltage); // Min Discharge Voltage
	setSetting("SystemMode"      , "0", "v3"  , batteryVoltageHysteresis  ); // Min Discharge Voltage Hysteresis
	setSetting("SystemMode"      , "0", "v4"  , batteryDischargeCurrent   ); // Discharge Current (Auto-Discharge Mode)
	setSetting("WinterCharge"    , "0", "v1"  , batteryChargeCurrent      ); // Winter Charge Current (Ah * chargeC)
	setSetting("WinterCharge"    , "0", "v4"  , redischargingVoltage      ); // End Winter Charge Voltage (Redischarging Voltage)
	setSetting("PfcSet"          , "0", "v4"  , redischargingVoltage      ); // End User Charge Voltage (Redischarging Voltage)
	
	sendCommand("20481", "0", batteryDischargeLimit, ""); // Set Discharge Limit (UPS Side)

	if(isLiFePO()) {
		setSetting("BattModbusConnect", "0", "mode", "1"                        ); // Activate Battery Modbus
		setSetting("BattModbusConnect", "0", "s1"  , $("#lifepo_portname").val()); // Set Battery Modbus Port
	}





	// Send Empty Command Every X Seconds (Keeps Updating Settings)
	
	setInterval(() => { sendCommand(0, 0, "", ""); }, 6666);

	// Notify BatterN about new Settings

	setTimeout(() => { sendCommand(12, 0, "", ""); }, 5000);





	// Wait To Finish Setting Parameters

	var initialCount = null;
	var maxPercent   = 0;

	setInterval(() => {

		$.get({
			url: "api.php?count=commands",
			error: () => { alert("E018. Please refresh the page!") },
			success: (response) => {

				if(response == "") return;

				if(initialCount == null) initialCount = parseInt(response) + 2;

				// Set Progress
				maxPercent = Math.max(maxPercent, Math.round(100 - parseInt(response) / initialCount * 100));
				$("#message").html(`${lang.bs_system_setup.msg_setting_parameters} (${maxPercent}%)`);

				// Continue Next Step
				if(parseInt(response) == 0) {
					$(".setting-progress span").html(lang.bs_system_setup.msg_setting_success).css("color", "#28a745");
					$("#notif").removeClass("loading error success").addClass("success");
					// Next Step
					setTimeout(() => { window.location.href = "system_test.php"; }, 2500);
				} else console.log("SETTING PARAMETERS");

			}
		});

	}, 2500);





}
