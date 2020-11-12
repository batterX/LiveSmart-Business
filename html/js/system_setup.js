$progress.trigger("step", 5);





//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////





/*
	Define Variables
*/

function isLiFePO() { return $("#bx_battery_type_0").is(":checked"); }
function isCarbon() { return $("#bx_battery_type_1").is(":checked"); }
function isOther()  { return $("#bx_battery_type_9").is(":checked"); }

var systemApikey   = apikey;
var deviceDatetime = "";

var newParameters  = {};
var oldParameters  = {};

var tempDatetime   = "";

var isAlreadyRegistered = false;
var isSettingParameters = false;
var checkParametersInterval;
var checkParametersCounter;





//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////





/*
	Show More Controllers (8)
*/

$("#btnShowAllControllers").on("click", function() {
	$("#listAllControllers").removeClass("d-none");
	$(this).addClass("d-none");
});





/*
	Calculate Total Solar Power Installed (Wp)
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
	Calculate Cut Peak Power Target
*/

$("#sysmode_cutpeak_max, #sysmode_cutpeak_hyst").on("input", () => {
	var powerMax  = $("#sysmode_cutpeak_max ").val(); powerMax  = (powerMax  == "") ? 0 : parseInt(powerMax );
	var powerHyst = $("#sysmode_cutpeak_hyst").val(); powerHyst = (powerHyst == "") ? 0 : parseInt(powerHyst);
    $("#sysmode_cutpeak_target").val(powerMax - powerHyst);
});





/*
	Battery Type Change
*/

$("input[name=bx_battery_type]").on("change", function() {

	// SET Other
	if(this.value == "9") {
		$("#battery_section_0").hide();
		$("#battery_section_1").hide();
		$("#battery_section_9").show();
	}
	// SET Carbon
	else if(this.value == "1") {
		$("#battery_section_0").hide();
		$("#battery_section_1").show();
		$("#battery_section_9").hide();
	}
	// SET LiFePO
	else {
		$("#battery_section_0").show();
		$("#battery_section_1").hide();
		$("#battery_section_9").hide();
	}

});





/*
	Carbon Batteries OnChange Listener
*/

$("#carbon_battery_model, #carbon_battery_strings").on("change", function() {

	var batteryModel    = $("#carbon_battery_model  ").val();
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
	System Mode Change
*/

$("#sysmode_mode").on("change", function() {

	// Cut Power Peak
	if(this.value == "3") $("#sysmode_cutpeak_section").show();
	else $("#sysmode_cutpeak_section").hide();

});





/*
	Activate Submit Button
*/

setInterval(() => {

	if(isLiFePO()) {
		var countMaster    = 0;
		var countSlave     = 0;
		var countBatteries = 0;
		$("#lifepo_bms").val().trim().split("\n").forEach(sn => {
				 if(sn.trim().startsWith("PPTBB0")) countMaster    += 1;
			else if(sn.trim().startsWith("PPTBP0")) countSlave     += 1;
		});
		$("#lifepo_serialnumbers").val().trim().split("\n").forEach(sn => {
				 if(sn.trim().startsWith("PPTBP1")) countBatteries += 1;
		});
		if( $("#installation_date      ").val() != "" &&
			$("#bx_system              ").val() != "" &&
			$("#bx_model               ").val() != "" &&
			$("#bx_box                 ").val() != "" &&
			$("#lifepo_portname        ").val() != "" &&
			countMaster         ==  1 &&
			countSlave          >=  2 &&
			countBatteries      >= 22 &&
			countBatteries % 22 ==  0 &&
			countBatteries / 11 == countSlave
		) {
			$("#btn_next").attr("disabled", isSettingParameters);
		} else {
			$("#btn_next").attr("disabled", true);
		}
	} else if(isCarbon()) {
		if( $("#installation_date      ").val() != "" &&
			$("#bx_system              ").val() != "" &&
			$("#bx_model               ").val() != "" &&
			$("#bx_box                 ").val() != "" &&
			$("#carbon_battery_model   ").val() != "" &&
			$("#carbon_battery_strings ").val() != "" &&
			$("#carbon_battery_capacity").val() != "" &&
			$("#carbon_battery_ah      ").val() != ""
		) {
			$("#btn_next").attr("disabled", isSettingParameters);
		} else {
			$("#btn_next").attr("disabled", true);
		}
	} else { // isOther()
		if( $("#installation_date                ").val() != "" &&
			$("#bx_system                        ").val() != "" &&
			$("#bx_model                         ").val() != "" &&
			$("#bx_box                           ").val() != "" &&
			$("#other_battery_ah                 ").val() != "" &&
			$("#other_battery_maxChargeC         ").val() != "" &&
			$("#other_battery_maxDischargeC      ").val() != "" &&
			$("#other_battery_minDischargeVoltage").val() != "" &&
			$("#other_battery_voltageHysteresis  ").val() != ""
		) {
			$("#btn_next").attr("disabled", isSettingParameters);
		} else {
			$("#btn_next").attr("disabled", true);
		}
	}

}, 1000);





/*
	Show Possible USB Devices
*/

refreshDevicesList();
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

$("#modbus_portlist_refresh").on("click", () => { refreshDevicesList(); });
$("#modbus_portlist_apply").on("click", () => {
	var selectedVal = $("#modbus_portlist").val();
	$("#modbus_portname").val(selectedVal != "" ? "/dev/serial/by-id/" + selectedVal : "");
	$("#modbus_portname")[0].scrollLeft = $("#modbus_portname")[0].scrollWidth;
});

$("#lifepo_portlist_refresh").on("click", () => { refreshDevicesList(); });
$("#lifepo_portlist_apply").on("click", () => {
	var selectedVal = $("#lifepo_portlist").val();
	$("#lifepo_portname").val(selectedVal != "" ? "/dev/serial/by-id/" + selectedVal : "");
	$("#lifepo_portname")[0].scrollLeft = $("#lifepo_portname")[0].scrollWidth;
});





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
	Check If Apikey Correct & Load Local Settings
*/

function step1() {
	
	if(!apikey || apikey.length != 40)
		return alert("E001. Please refresh the page!");

	// Load Settings
	$.get({
		url: "api.php?get=settings",
		error: () => { alert("E002. Please refresh the page!") },
		success: (response) => {
			
			if(!response || typeof response != "object") return alert("E003. Please refresh the page!");

			var temp = {};

			// Show Solar Controllers Settings
			if(response.hasOwnProperty("NominalSol")) {
				if(response["NominalSol"].hasOwnProperty("1")) { temp = response["NominalSol"]["1"]; $("#solar_c1_power").val(temp["v1"]).trigger("input"); }
				if(response["NominalSol"].hasOwnProperty("2")) { temp = response["NominalSol"]["2"]; $("#solar_c2_power").val(temp["v1"]).trigger("input"); }
				if(response["NominalSol"].hasOwnProperty("3")) { temp = response["NominalSol"]["3"]; $("#solar_c3_power").val(temp["v1"]).trigger("input"); }
				if(response["NominalSol"].hasOwnProperty("4")) { temp = response["NominalSol"]["4"]; $("#solar_c4_power").val(temp["v1"]).trigger("input"); }
				if(response["NominalSol"].hasOwnProperty("5")) { temp = response["NominalSol"]["5"]; $("#solar_c5_power").val(temp["v1"]).trigger("input"); }
				if(response["NominalSol"].hasOwnProperty("6")) { temp = response["NominalSol"]["6"]; $("#solar_c6_power").val(temp["v1"]).trigger("input"); }
				if(response["NominalSol"].hasOwnProperty("7")) { temp = response["NominalSol"]["7"]; $("#solar_c7_power").val(temp["v1"]).trigger("input"); }
				if(response["NominalSol"].hasOwnProperty("8")) { temp = response["NominalSol"]["8"]; $("#solar_c8_power").val(temp["v1"]).trigger("input"); }
			}

			// Show Battery Settings
			var ah                  = null;
			var maxChargeC          = null;
			var maxDischargeC       = null;
			var minDischargeVoltage = null;
			var voltageHysteresis   = null;

			if(response.hasOwnProperty("NominalBattValue") && response["NominalBattValue"].hasOwnProperty("0")) {
				temp = response["NominalBattValue"]["0"];
				ah                  = parseInt(temp["v1"]);
				maxChargeC          = parseInt(temp["v2"]) / 100;
				maxDischargeC       = parseInt(temp["v3"]) / 100;
			}
			if(response.hasOwnProperty("SystemMode") && response["SystemMode"].hasOwnProperty("0")) {
				temp = response["SystemMode"]["0"];
				minDischargeVoltage = parseInt(temp["v2"]) / 100;
				voltageHysteresis   = parseInt(temp["v3"]) / 100;
			}
			if(ah                  != null) $("#other_battery_ah                 ").val(ah                 );
			if(maxChargeC          != null) $("#other_battery_maxChargeC         ").val(maxChargeC         );
			if(maxDischargeC       != null) $("#other_battery_maxDischargeC      ").val(maxDischargeC      );
			if(minDischargeVoltage != null) $("#other_battery_minDischargeVoltage").val(minDischargeVoltage);
			if(voltageHysteresis   != null) $("#other_battery_voltageHysteresis  ").val(voltageHysteresis  );

			// Show System Mode Settings
			if(response.hasOwnProperty("SystemMode") && response["SystemMode"].hasOwnProperty("0")) {
				temp = response["SystemMode"]["0"];
				$("#sysmode_mode").val(temp["mode"]).trigger("change");
			}
			if(response.hasOwnProperty("EcoMode") && response["EcoMode"].hasOwnProperty("0")) {
				temp = response["EcoMode"]["0"];
				$("#sysmode_eco").val(temp["v1"]);
			}
			if(response.hasOwnProperty("PfcSet") && response["PfcSet"].hasOwnProperty("0")) {
				temp = response["PfcSet"]["0"];
				$("#sysmode_pfc").val(temp["v1"]);
			}
			if(response.hasOwnProperty("CutPowerPeak") && response["CutPowerPeak"].hasOwnProperty("0")) {
				temp = response["CutPowerPeak"]["0"];
				$("#sysmode_cutpeak_max   ").val(parseInt(temp["v1"]));
				$("#sysmode_cutpeak_hyst  ").val(parseInt(temp["v2"]));
				$("#sysmode_cutpeak_target").val(parseInt(temp["v1"]) - parseInt(temp["v2"]));
			}

			// Show LiFePO Connection
			if(response.hasOwnProperty("BattModbusConnect") && response["BattModbusConnect"].hasOwnProperty("0")) {
				temp = response["BattModbusConnect"]["0"];
				$("#lifepo_portname").val(temp["s1"]);
				$("#lifepo_portname")[0].scrollLeft = $("#lifepo_portname")[0].scrollWidth;
			}
			
			// Show Modbus Connection
			if(response.hasOwnProperty("PowerModbusConnect") && response["PowerModbusConnect"].hasOwnProperty("0")) {
				temp = response["PowerModbusConnect"]["0"];
				$("#modbus_mode    ").val(temp["mode"]);
				$("#modbus_baudrate").val(temp["v1"]);
				$("#modbus_parity  ").val(temp["s2"].length > 0 ? temp["s2"].charAt(0) : "");
				$("#modbus_stopbits").val(temp["v3"]);
				$("#modbus_portname").val(temp["s1"]);
				$("#modbus_portname")[0].scrollLeft = $("#modbus_portname")[0].scrollWidth;
			}

			// Show Modbus Devices
			if(response.hasOwnProperty("ModbusUpsInputDevice") && response["ModbusUpsInputDevice"].hasOwnProperty("0")) {
				temp = response["ModbusUpsInputDevice"]["0"];
				$("#modbus_input_on").val(temp["mode"]);
				$("#modbus_input_id").val(temp["v1"]);
			}
			if(response.hasOwnProperty("ModbusUpsOutputDevice") && response["ModbusUpsOutputDevice"].hasOwnProperty("0")) {
				temp = response["ModbusUpsOutputDevice"]["0"];
				$("#modbus_output_on").val(temp["mode"]);
				$("#modbus_output_id").val(temp["v1"]);
			}
			if(response.hasOwnProperty("ModbusGridDevice") && response["ModbusGridDevice"].hasOwnProperty("0")) {
				temp = response["ModbusGridDevice"]["0"];
				$("#modbus_grid_on").val(temp["mode"]);
				$("#modbus_grid_id").val(temp["v1"]);
			}
			if(response.hasOwnProperty("ModbusExtSolarDevice") && response["ModbusExtSolarDevice"].hasOwnProperty("0")) {
				temp = response["ModbusExtSolarDevice"]["0"];
				$("#modbus_extsol_on").val(temp["mode"]);
				$("#modbus_extsol_id").val(temp["v1"]);
			}

			step2();
			
		}
	});

}





/*
	Get Installation Info
*/

function step2() {

	$.post({
		url: "https://api.batterx.io/v3/install_bs.php",
		data: {
			action: "get_installation_info",
			apikey: systemApikey
		},
		error: () => { alert("E004. Please refresh the page!"); },
		success: (json) => {

			console.log(json);

			if(json) {

				// Set System Info
				if(json.hasOwnProperty("system")) {
					if(json.system.hasOwnProperty("serialnumber"))
						$("#bx_system").val(json.system.serialnumber).attr("disabled", true);
				}

				// Set Device Info
				if(json.hasOwnProperty("device")) {
					if(json.device.hasOwnProperty("nominal_power"))
						$("#bx_model").val(json.device.nominal_power).attr("disabled", true);
				}

				// Set Installation Date
				if(json.hasOwnProperty("installation_date"))
					$("#installation_date").val(json.installation_date);

				// Set Solar Info
				if(json.hasOwnProperty("solar_info"))
					$("#solar_info").val(json.solar_info);

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
					// No Batteries
					if(json.batteries.length == 0 || !json.batteries[0].hasOwnProperty("serialnumber") || !json.batteries[0].hasOwnProperty("type")) {
						$("#bx_battery_type_9").prop("checked", true).trigger("change");
					}
					// Single Battery (LiFePO|Carbon|Other)
					else if(json.batteries.length == 1) {
						var battery = json.batteries[0];
						// LiFePO
						if(battery.type == 0) {
							$("#lifepo_serialnumbers").val(battery.serialnumber);
						}
						// Carbon
						else if(battery.type == 1) {
							$("#bx_battery_type_1").prop("checked", true).trigger("change");
							if(battery.hasOwnProperty("capacity")) $("#carbon_battery_capacity").val(battery.capacity + " Wh");
							if(battery.hasOwnProperty("strings" )) $("#carbon_battery_strings ").val(battery.strings).trigger("change");
							if(battery.hasOwnProperty("model"   )) $("#carbon_battery_model   ").val(battery.model).trigger("change");
						}
						// Other
						else if(battery.type == 9) {
							$("#bx_battery_type_9").prop("checked", true).trigger("change");
						}
					}
					// Multiple Batteries (LiFePO Only)
					else {
						var tempArr = [];
						json.batteries.forEach(battery => { tempArr.push(battery.serialnumber); });
						$("#lifepo_serialnumbers").val(tempArr.join("\n"));
						tempArr = [];
						json.batteries_bms.forEach(bms => { tempArr.push(bms.serialnumber); });
						$("#lifepo_bms").val(tempArr.join("\n"));
					}
				}

				// Set Flag System Already Registered
				isAlreadyRegistered = true;

			}

			step3();

		}
	});

}





/*
	Set LiveX Serial-Number
*/

function step3() {

	$.post({
		url: "https://api.batterx.io/v3/install_bs.php",
		data: {
			action: "get_box_serial",
			apikey: systemApikey
		},
		error: () => { alert("E005. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			var box_serial = response;
			// Save Serial-Number to Session
			if(box_serial) {
				$.post({
					url: "cmd/session.php",
					data: { box_serial: box_serial },
					error: () => { alert("E006. Please refresh the page!"); },
					success: (response) => {
						console.log(response);
						if(response !== "1") return alert("E007. Please refresh the page!");
						$("#bx_box").val(box_serial);
					}
				});
			} else {
				return $("#errorBoxNotRegistered").modal("show");
			}
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

	checkParametersInterval = undefined;

	if(isLiFePO()) {
		var countMaster    = 0;
		var countSlave     = 0;
		var countBatteries = 0;
		$("#lifepo_bms").val().trim().split("\n").forEach(sn => {
				 if(sn.trim().startsWith("PPTBB0")) countMaster    += 1;
			else if(sn.trim().startsWith("PPTBP0")) countSlave     += 1;
		});
		$("#lifepo_serialnumbers").val().trim().split("\n").forEach(sn => {
				 if(sn.trim().startsWith("PPTBP1")) countBatteries += 1;
		});
		if( $("#installation_date      ").val() == "" ||
			$("#bx_system              ").val() == "" ||
			$("#bx_model               ").val() == "" ||
			$("#bx_box                 ").val() == "" ||
			$("#lifepo_portname        ").val() == "" ||
			countMaster         !=  1 ||
			countSlave          <   2 ||
			countBatteries      <  22 ||
			countBatteries % 22 !=  0 ||
			countBatteries / 11 != countSlave
		) return;
	} else if(isCarbon()) {
		if( $("#installation_date      ").val() == "" ||
			$("#bx_system              ").val() == "" ||
			$("#bx_model               ").val() == "" ||
			$("#bx_box                 ").val() == "" ||
			$("#carbon_battery_model   ").val() == "" ||
			$("#carbon_battery_strings ").val() == "" ||
			$("#carbon_battery_capacity").val() == "" ||
			$("#carbon_battery_ah      ").val() == ""
		) return;
	} else { // isOther()
		if( $("#installation_date                ").val() == "" ||
			$("#bx_system                        ").val() == "" ||
			$("#bx_model                         ").val() == "" ||
			$("#bx_box                           ").val() == "" ||
			$("#other_battery_ah                 ").val() == "" ||
			$("#other_battery_maxChargeC         ").val() == "" ||
			$("#other_battery_maxDischargeC      ").val() == "" ||
			$("#other_battery_minDischargeVoltage").val() == "" ||
			$("#other_battery_voltageHysteresis  ").val() == ""
		) return;
	}

	// Check UPS S/N
	var canContinue = false;
	$.post({
		url: "https://api.batterx.io/v3/install_bs.php",
		async: false,
		data: {
			action       : "verify_device",
			serialnumber : $("#bx_system").val(),
			system       : $("#bx_system").val()
		},
		error: () => { alert("E008. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			if(response === "1") canContinue = true;
			else $("#errorUpsRegisteredWithOtherSystem").modal("show");
		}
	});
	if(!canContinue) return;

	// Check Controllers S/N
	var tempControllersArr = [];
	if($("#solar_c1_serial").val().trim() != "") tempControllersArr.push($("#solar_c1_serial").val().trim());
	if($("#solar_c2_serial").val().trim() != "") tempControllersArr.push($("#solar_c2_serial").val().trim());
	if($("#solar_c3_serial").val().trim() != "") tempControllersArr.push($("#solar_c3_serial").val().trim());
	if($("#solar_c4_serial").val().trim() != "") tempControllersArr.push($("#solar_c4_serial").val().trim());
	if($("#solar_c5_serial").val().trim() != "") tempControllersArr.push($("#solar_c5_serial").val().trim());
	if($("#solar_c6_serial").val().trim() != "") tempControllersArr.push($("#solar_c6_serial").val().trim());
	if($("#solar_c7_serial").val().trim() != "") tempControllersArr.push($("#solar_c7_serial").val().trim());
	if($("#solar_c8_serial").val().trim() != "") tempControllersArr.push($("#solar_c8_serial").val().trim());
	canContinue = true;
	for(var i = 0; i < tempControllersArr.length; i++) {
		if(canContinue && tempControllersArr[i] != "") {
			canContinue = false;
			$.post({
				url: "https://api.batterx.io/v3/install_bs.php", async: false,
				data: { action: "verify_controller", system: $("#bx_system").val(), serialnumber: tempControllersArr[i] },
				error: () => { alert("E008. Please refresh the page!"); },
				success: (response) => { if(response === "1") canContinue = true; else { $("#errorControllerSerial").val(tempControllersArr[i]); $("#errorControllerNotExistOrWithOtherSystem").modal("show"); } }
			});
		}
	}
	if(!canContinue) return;

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

		#sysmode_mode,
		#sysmode_cutpeak_max,
		#sysmode_cutpeak_hyst,
		#sysmode_cutpeak_target,
		#sysmode_eco,
		#sysmode_pfc,

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
	$("#btn_next").attr("disabled", true);
	$(".setting-progress").removeClass("d-none");

	// Scroll To Bottom
	$("html, body").scrollTop($(document).height());

	// Start Setup
	checkParametersCounter = 0;
	     if(isLiFePO()) setupLiFePO();
	else if(isCarbon()) setupCarbon();
	else                setupOther();

}





function showSettingParametersError(errorStr) {
	clearInterval(checkParametersInterval);
	// Hide Loading Screen
	isSettingParameters = false;
	$("#notif").removeClass("loading error success").addClass("error");
	$("#message").html(errorStr).css("color", "red");
	$("#btn_next").attr("disabled", false).unbind().on("click", () => { mainFormSubmit(); });
}





/*
	Send Command (Set Setting)
*/

var bxSet = { "name":1, "mode":11, "v1":21, "v2":22, "v3":23, "v4":24, "v5":25, "v6":26, "s1":31, "s2":32 };

function setSetting(varname, entity, field, value) {
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
	Set Common Parameters
*/

function setCommonParameters() {
	


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
	setSetting("ModbusUpsInputDataFrom" , "0", "mode", "1");
	setSetting("ModbusUpsOutputDataFrom", "0", "mode", "1");



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



}





//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////





/*
	Setup For Other Batteries
*/

function setupOther() {
	


	// Show Loading

	$("#notif").removeClass("loading error success").addClass("loading");
	$("#message").html(lang.bs_system_setup.msg_setting_parameters).css("color", "");
	isSettingParameters = true;



	// Save To Session

	var tempData = {
		
		installation_date : $("#installation_date").val(),
		
		system_serial     : $("#bx_system").val(),
		device_serial     : $("#bx_system").val(),
		device_power      : $("#bx_model").val(),
		note              : $("#installer_memo").val(),
		
		solar_wattPeak    : $("#solar_total_power").val(),
		solar_info        : $("#solar_info").val(),

		battery_type      : "other",
		battery_capacity  : parseInt($("#other_battery_ah").val()) * 720

	}

	if($("#solar_c1_serial").val() != "" && $("#solar_c1_power").val() != "") { tempData["solar_c1_serial"] = $("#solar_c1_serial").val(); tempData["solar_c1_power"] = $("#solar_c1_power").val(); }
	if($("#solar_c2_serial").val() != "" && $("#solar_c2_power").val() != "") { tempData["solar_c2_serial"] = $("#solar_c2_serial").val(); tempData["solar_c2_power"] = $("#solar_c2_power").val(); }
	if($("#solar_c3_serial").val() != "" && $("#solar_c3_power").val() != "") { tempData["solar_c3_serial"] = $("#solar_c3_serial").val(); tempData["solar_c3_power"] = $("#solar_c3_power").val(); }
	if($("#solar_c4_serial").val() != "" && $("#solar_c4_power").val() != "") { tempData["solar_c4_serial"] = $("#solar_c4_serial").val(); tempData["solar_c4_power"] = $("#solar_c4_power").val(); }
	if($("#solar_c5_serial").val() != "" && $("#solar_c5_power").val() != "") { tempData["solar_c5_serial"] = $("#solar_c5_serial").val(); tempData["solar_c5_power"] = $("#solar_c5_power").val(); }
	if($("#solar_c6_serial").val() != "" && $("#solar_c6_power").val() != "") { tempData["solar_c6_serial"] = $("#solar_c6_serial").val(); tempData["solar_c6_power"] = $("#solar_c6_power").val(); }
	if($("#solar_c7_serial").val() != "" && $("#solar_c7_power").val() != "") { tempData["solar_c7_serial"] = $("#solar_c7_serial").val(); tempData["solar_c7_power"] = $("#solar_c7_power").val(); }
	if($("#solar_c8_serial").val() != "" && $("#solar_c8_power").val() != "") { tempData["solar_c8_serial"] = $("#solar_c8_serial").val(); tempData["solar_c8_power"] = $("#solar_c8_power").val(); }

	console.log(tempData);

	$.post({
		url: "cmd/session.php",
		data: tempData,
		error: () => { alert("E011. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			if(response != "1") return alert("E012. Please refresh the page!");
			setupOther_2();
		}
	});



}





/*
	Set Parameters
*/

function setupOther_2() {



	// Set Common Parameters

	setCommonParameters();



	// Set Battery Parameters

	var batteryAh                  = Math.round(parseFloat($("#other_battery_ah                 ").val()) * 1  );
	var batteryMaxChargeC          = Math.round(parseFloat($("#other_battery_maxChargeC         ").val()) * 100);
	var batteryMaxDischargeC       = Math.round(parseFloat($("#other_battery_maxDischargeC      ").val()) * 100);
	var batteryMinDischargeVoltage = Math.round(parseFloat($("#other_battery_minDischargeVoltage").val()) * 100);
	var batteryVoltageHysteresis   = Math.round(parseFloat($("#other_battery_voltageHysteresis  ").val()) * 100);
	var batteryDischargeCurrent    = Math.round(batteryAh * batteryMaxDischargeC * 0.40);
	var batteryChargeCurrent       = Math.round(batteryAh * batteryMaxChargeC);
	var redischargingVoltage       = Math.round(batteryMinDischargeVoltage + batteryVoltageHysteresis);

	setSetting("NominalBattType" , "0", "mode", "1"                       ); // Battery Type (1=AGM)
	setSetting("NominalBattType" , "0", "v1"  , "1200"                    ); // One Battery Voltage (12V)
	setSetting("NominalBattType" , "0", "v2"  , "30"                      ); // Battery Count N -> VDC+ (30)
	setSetting("NominalBattValue", "0", "v1"  , batteryAh                 ); // Battery Total Capacity Ah
	setSetting("NominalBattValue", "0", "v2"  , batteryMaxChargeC         ); // Battery Max Charge C
	setSetting("NominalBattValue", "0", "v3"  , batteryMaxDischargeC      ); // Battery Max Discharge C
	setSetting("NominalBattValue", "0", "v4"  , "-10"                     ); // Battery Start Charge Current (-0.1A Keep Disharging)
	setSetting("SystemMode"      , "0", "v1"  , batteryChargeCurrent      ); // Charge Current (?)
	setSetting("SystemMode"      , "0", "v2"  , batteryMinDischargeVoltage); // Min Discharge Voltage
	setSetting("SystemMode"      , "0", "v3"  , batteryVoltageHysteresis  ); // Min Discharge Voltage Hysteresis
	setSetting("SystemMode"      , "0", "v4"  , batteryDischargeCurrent   ); // Discharge Current (Auto-Discharge Mode)
	setSetting("WinterCharge"    , "0", "v1"  , batteryChargeCurrent      ); // Winter Charge Current (Ah * chargeC)
	setSetting("WinterCharge"    , "0", "v4"  , redischargingVoltage      ); // End Winter Charge Voltage (Redischarging Voltage)
	setSetting("PfcSet"          , "0", "v4"  , redischargingVoltage      ); // End User Charge Voltage (Redischarging Voltage)

	sendCommand("20481", "0", batteryMinDischargeVoltage, ""); // Set Discharge Limit (UPS Side)



	// Send Empty Command Every X Seconds (Keeps Updating Settings Active)
	
	setInterval(() => { sendCommand(0, 0, "", ""); }, 6666);



	// Notify BatterN about new Settings

	setTimeout(() => { sendCommand(12, 0, "", ""); }, 5000);



	// Wait While Setting Parameters

	waitToFinish();



}





//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////





/*
	Setup For Carbon Batteries
*/

function setupCarbon() {
	
	

	// Show Loading

	$("#notif").removeClass("loading error success").addClass("loading");
	$("#message").html(lang.bs_system_setup.msg_setting_parameters).css("color", "");
	isSettingParameters = true;



	// Save To Session

	var tempData = {
		
		installation_date : $("#installation_date").val(),
		
		system_serial     : $("#bx_system").val(),
		device_serial     : $("#bx_system").val(),
		device_power      : $("#bx_model").val(),
		note              : $("#installer_memo").val(),
		
		solar_wattPeak    : $("#solar_total_power").val(),
		solar_info        : $("#solar_info").val(),

		battery_type      : "carbon",
		battery_capacity  : $("#carbon_battery_capacity").val().split(" ")[0],
		battery_model     : $("#carbon_battery_model").val(),
		battery_strings   : $("#carbon_battery_strings").val()

	}

	if($("#solar_c1_serial").val() != "" && $("#solar_c1_power").val() != "") { tempData["solar_c1_serial"] = $("#solar_c1_serial").val(); tempData["solar_c1_power"] = $("#solar_c1_power").val(); }
	if($("#solar_c2_serial").val() != "" && $("#solar_c2_power").val() != "") { tempData["solar_c2_serial"] = $("#solar_c2_serial").val(); tempData["solar_c2_power"] = $("#solar_c2_power").val(); }
	if($("#solar_c3_serial").val() != "" && $("#solar_c3_power").val() != "") { tempData["solar_c3_serial"] = $("#solar_c3_serial").val(); tempData["solar_c3_power"] = $("#solar_c3_power").val(); }
	if($("#solar_c4_serial").val() != "" && $("#solar_c4_power").val() != "") { tempData["solar_c4_serial"] = $("#solar_c4_serial").val(); tempData["solar_c4_power"] = $("#solar_c4_power").val(); }
	if($("#solar_c5_serial").val() != "" && $("#solar_c5_power").val() != "") { tempData["solar_c5_serial"] = $("#solar_c5_serial").val(); tempData["solar_c5_power"] = $("#solar_c5_power").val(); }
	if($("#solar_c6_serial").val() != "" && $("#solar_c6_power").val() != "") { tempData["solar_c6_serial"] = $("#solar_c6_serial").val(); tempData["solar_c6_power"] = $("#solar_c6_power").val(); }
	if($("#solar_c7_serial").val() != "" && $("#solar_c7_power").val() != "") { tempData["solar_c7_serial"] = $("#solar_c7_serial").val(); tempData["solar_c7_power"] = $("#solar_c7_power").val(); }
	if($("#solar_c8_serial").val() != "" && $("#solar_c8_power").val() != "") { tempData["solar_c8_serial"] = $("#solar_c8_serial").val(); tempData["solar_c8_power"] = $("#solar_c8_power").val(); }

	console.log(tempData);

	$.post({
		url: "cmd/session.php",
		data: tempData,
		error: () => { alert("E013. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			if(response != "1") return alert("E014. Please refresh the page!");
			setupCarbon_2();
		}
	});



}





/*
	Set Parameters
*/

function setupCarbon_2() {



	// Set Common Parameters

	setCommonParameters();



	// Set Battery Parameters

	var batteryAh               = parseInt($("#carbon_battery_ah").val().split(" ")[0]);
	var batteryDischargeCurrent = Math.round(batteryAh * 0.40 * 100);
	var batteryChargeCurrent    = Math.round(batteryAh * 0.15 * 100);

	setSetting("NominalBattType" , "0", "mode", "3"                    ); // Battery Type (3=Carbon)
	setSetting("NominalBattType" , "0", "v1"  , "1200"                 ); // One Battery Voltage (12V)
	setSetting("NominalBattType" , "0", "v2"  , "30"                   ); // Battery Count N -> VDC+ (30)
	setSetting("NominalBattValue", "0", "v1"  , batteryAh              ); // Battery Total Capacity Ah
	setSetting("NominalBattValue", "0", "v2"  , "15"                   ); // Battery Max Charge C (0.15C)
	setSetting("NominalBattValue", "0", "v3"  , "100"                  ); // Battery Max Discharge C (1.00C)
	setSetting("NominalBattValue", "0", "v4"  , "-10"                  ); // Battery Start Charge Current (-0.1A Keep Disharging)
	setSetting("SystemMode"      , "0", "v1"  , batteryChargeCurrent   ); // Charge Current (?)
	setSetting("SystemMode"      , "0", "v2"  , "35000"                ); // Min Discharge Voltage (350V = 11.66V/Bat)
	setSetting("SystemMode"      , "0", "v3"  , "5500"                 ); // Min Discharge Voltage Hysteresis (350+55 = 405V @ 13.50V/Bat)
	setSetting("SystemMode"      , "0", "v4"  , batteryDischargeCurrent); // Discharge Current (Auto-Discharge Mode)
	setSetting("WinterCharge"    , "0", "v1"  , batteryChargeCurrent   ); // Winter Charge Current (Ah * chargeC)
	setSetting("WinterCharge"    , "0", "v4"  , "40500"                ); // End Winter Charge Voltage (Redischarging Voltage)
	setSetting("PfcSet"          , "0", "v4"  , "40500"                ); // End User Charge Voltage (Redischarging Voltage)

	sendCommand("20481", "0", "35000", ""); // Set Discharge Limit (UPS Side)



	// Send Empty Command Every X Seconds (Keeps Updating Settings Active)
	
	setInterval(() => { sendCommand(0, 0, "", ""); }, 6666);



	// Notify BatterN about new Settings

	setTimeout(() => { sendCommand(12, 0, "", ""); }, 5000);



	// Wait While Setting Parameters
	
	waitToFinish();



}





//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////





/*
	Setup for LiFePO Batteries - Verify Serial Numbers
*/

function setupLiFePO() {
	


	// Get Serial Numbers
	
	var system_serial = $("#bx_system").val();

	var masterBMS = "";
	var slaveBMS  = [];
	var batteries = [];

	$("#lifepo_bms").val().trim().split("\n").forEach(sn => {
			 if(sn.trim().startsWith("PPTBB0")) masterBMS = sn;
		else if(sn.trim().startsWith("PPTBP0")) slaveBMS.push(sn);
	});
	$("#lifepo_serialnumbers").val().trim().split("\n").forEach(sn => {
			 if(sn.trim().startsWith("PPTBP1")) batteries.push(sn);
	});

	var canContinue = true;



	// Check Batteries S/N

	for(var i = 0; i < batteries.length; i++) {
		if(canContinue && batteries[i] != "") {
			canContinue = false;
			$.post({
				url: "https://api.batterx.io/v3/install_bs.php", async: false,
				data: { action: "verify_battery", system: system_serial, serialnumber: batteries[i] },
				error: () => { alert("E015. Please refresh the page!"); },
				success: (response) => { if(response === "1") canContinue = true; else { $("#errorBatterySerial").val(batteries[i]); $("#errorBatteryNotExistOrWithOtherSystem").modal("show"); } }
			});
		}
	}

	// Check Master BMS S/N

	if(canContinue && masterBMS != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v3/install_bs.php", async: false,
			data: { action: "verify_bms", system: system_serial, serialnumber: masterBMS },
			error: () => { alert("E015. Please refresh the page!"); },
			success: (response) => { if(response === "1") canContinue = true; else { $("#errorBmsSerial").val(masterBMS); $("#errorBmsNotExistOrWithOtherSystem").modal("show"); } }
		});
	}

	// Check Slave BMS S/N

	for(var i = 0; i < slaveBMS.length; i++) {
		if(canContinue && slaveBMS[i] != "") {
			canContinue = false;
			$.post({
				url: "https://api.batterx.io/v3/install_bs.php", async: false,
				data: { action: "verify_bms", system: system_serial, serialnumber: slaveBMS[i] },
				error: () => { alert("E015. Please refresh the page!"); },
				success: (response) => { if(response === "1") canContinue = true; else { $("#errorBmsSerial").val(slaveBMS[i]); $("#errorBmsNotExistOrWithOtherSystem").modal("show"); } }
			});
		}
	}



	if(!canContinue) {
		// Enable Battery Fields
		$(` #lifepo_bms,
			#lifepo_serialnumbers,
			#lifepo_portname,
			#lifepo_portlist,
			#lifepo_portlist_refresh,
			#lifepo_portlist_apply
		`).attr("disabled", false);
		// Hide Loading Screen
		isSettingParameters = false;
		$("#btn_next").attr("disabled", false);
		$(".setting-progress").addClass("d-none");
	}



	// Continue with Step 2

	if(canContinue) setupLiFePO_2();



}





/*
	Set Session Variables
*/

function setupLiFePO_2() {



	// Show Loading
	$("#notif").removeClass("loading error success").addClass("loading");
	$("#message").html(lang.bs_system_setup.msg_setting_parameters).css("color", "");
	isSettingParameters = true;



	// Save To Session

	var tempData = {
		
		installation_date : $("#installation_date").val(),
		
		system_serial     : $("#bx_system").val(),
		device_serial     : $("#bx_system").val(),
		device_power      : $("#bx_model").val(),
		note              : $("#installer_memo").val(),
		
		solar_wattPeak    : $("#solar_total_power").val(),
		solar_info        : $("#solar_info").val(),

		battery_type      : "lifepo"
	}

	if($("#solar_c1_serial").val() != "" && $("#solar_c1_power").val() != "") { tempData["solar_c1_serial"] = $("#solar_c1_serial").val(); tempData["solar_c1_power"] = $("#solar_c1_power").val(); }
	if($("#solar_c2_serial").val() != "" && $("#solar_c2_power").val() != "") { tempData["solar_c2_serial"] = $("#solar_c2_serial").val(); tempData["solar_c2_power"] = $("#solar_c2_power").val(); }
	if($("#solar_c3_serial").val() != "" && $("#solar_c3_power").val() != "") { tempData["solar_c3_serial"] = $("#solar_c3_serial").val(); tempData["solar_c3_power"] = $("#solar_c3_power").val(); }
	if($("#solar_c4_serial").val() != "" && $("#solar_c4_power").val() != "") { tempData["solar_c4_serial"] = $("#solar_c4_serial").val(); tempData["solar_c4_power"] = $("#solar_c4_power").val(); }
	if($("#solar_c5_serial").val() != "" && $("#solar_c5_power").val() != "") { tempData["solar_c5_serial"] = $("#solar_c5_serial").val(); tempData["solar_c5_power"] = $("#solar_c5_power").val(); }
	if($("#solar_c6_serial").val() != "" && $("#solar_c6_power").val() != "") { tempData["solar_c6_serial"] = $("#solar_c6_serial").val(); tempData["solar_c6_power"] = $("#solar_c6_power").val(); }
	if($("#solar_c7_serial").val() != "" && $("#solar_c7_power").val() != "") { tempData["solar_c7_serial"] = $("#solar_c7_serial").val(); tempData["solar_c7_power"] = $("#solar_c7_power").val(); }
	if($("#solar_c8_serial").val() != "" && $("#solar_c8_power").val() != "") { tempData["solar_c8_serial"] = $("#solar_c8_serial").val(); tempData["solar_c8_power"] = $("#solar_c8_power").val(); }

	var masterBMS = "";
	var slaveBMS  = [];
	var batteries = [];

	$("#lifepo_bms").val().trim().split("\n").forEach(sn => {
			 if(sn.trim().startsWith("PPTBB0")) masterBMS = sn;
		else if(sn.trim().startsWith("PPTBP0")) slaveBMS.push(sn);
	});
	$("#lifepo_serialnumbers").val().trim().split("\n").forEach(sn => {
			 if(sn.trim().startsWith("PPTBP1")) batteries.push(sn);
	});

	tempData["battery_bms_master"   ] = masterBMS;
	tempData["battery_bms_slave"    ] = slaveBMS.join(",");
	tempData["battery_serialnumbers"] = batteries.join(",");

	console.log(tempData);

	$.post({
		url: "cmd/session.php",
		data: tempData,
		error: () => { alert("E016. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			if(response != "1") return alert("E017. Please refresh the page!");
			setupLiFePO_3();
		}
	});



}





/*
	Set Parameters
*/

function setupLiFePO_3() {




	// Set Common Parameters

	setCommonParameters();



	// Set Battery Parameters

	var totalBatteries = 0;
	$("#lifepo_serialnumbers").val().trim().split("\n").forEach(sn => { if(sn.trim().startsWith("PPTBP1")) totalBatteries += 1; });

	var batteryStrings          = Math.round(totalBatteries / 22);
	var batteryAh               = Math.round(148 * batteryStrings);
	var batteryDischargeCurrent = Math.round(batteryAh * 0.5 * 100);
	var batteryChargeCurrent    = Math.round(batteryAh * 0.5 * 100);

	setSetting("NominalBattType"  , "0", "mode", "4"                        ); // Battery Type (4=LiFePO)
	setSetting("NominalBattType"  , "0", "v1"  , "3200"                     ); // One Battery Voltage (32V)
	setSetting("NominalBattType"  , "0", "v2"  , "11"                       ); // Battery Count N -> VDC+ (11)
	setSetting("NominalBattValue" , "0", "v1"  , batteryAh                  ); // Battery Total Capacity Ah
	setSetting("NominalBattValue" , "0", "v2"  , "50"                       ); // Battery Max Charge C (0.5C)
	setSetting("NominalBattValue" , "0", "v3"  , "100"                      ); // Battery Max Discharge C (1.00C)
	setSetting("NominalBattValue" , "0", "v4"  , "-10"                      ); // Battery Start Charge Current (-0.1A Keep Disharging)
	setSetting("SystemMode"       , "0", "v1"  , batteryChargeCurrent       ); // Charge Current (?)
	setSetting("SystemMode"       , "0", "v2"  , "35000"                    ); // Min Discharge Voltage (350V = 31.8V/Bat)
	setSetting("SystemMode"       , "0", "v3"  , "2000"                     ); // Min Discharge Voltage Hysteresis (350+20 = 370V @ 33.6V/Bat)
	setSetting("SystemMode"       , "0", "v4"  , batteryDischargeCurrent    ); // Discharge Current (Auto-Discharge Mode)
	setSetting("WinterCharge"     , "0", "v1"  , batteryChargeCurrent       ); // Winter Charge Current (Ah * chargeC)
	setSetting("WinterCharge"     , "0", "v4"  , "37000"                    ); // End Winter Charge Voltage (Redischarging Voltage)
	setSetting("PfcSet"           , "0", "v4"  , "37000"                    ); // End User Charge Voltage (Redischarging Voltage)

	setSetting("BattModbusConnect", "0", "mode", "1"                        ); // Activate Battery Modbus
	setSetting("BattModbusConnect", "0", "s1"  , $("#lifepo_portname").val()); // Set Battery Modbus Port

	sendCommand("20481", "0", "35000", ""); // Set Discharge Limit (UPS Side)



	// Send Empty Command Every X Seconds (Keeps Updating Settings Active)
	
	setInterval(() => { sendCommand(0, 0, "", ""); }, 6666);



	// Notify BatterN about new Settings

	setTimeout(() => { sendCommand(12, 0, "", ""); }, 5000);



	// Wait While Setting Parameters
	
	waitToFinish();



}





//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////





/*
	Wait While Setting Parameters
*/

function waitToFinish() {

	var initialCount = null;
	var maxPercent   = 0;

	setInterval(() => {

		$.get({
			url: "api.php?count=commands",
			error: () => { alert("E018. Please refresh the page!") },
			success: (response) => {

				if(response == "") return;

				if(initialCount == null)
					initialCount = parseInt(response) + 2;

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
