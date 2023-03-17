$progress.trigger("step", 6);





//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////





/*
	Define Variables
*/

var dataSettings = {};

var energyMeter_firstRun = true;
var skipEnergyMeterTest = false;

var solarControllers_firstRun = true;

var batteryCharging_firstRun = true;
var batteryCharging_count = 0; // run 5 times (5sec delay), then finish
var batteryCharging_datetime = "";
var batteryCharging_alreadyCharged = false;
var batteryMinLevel = 20;
var batteryMaxLevel = 95;
var batteryMinVoltage = 350;
var batteryMaxVoltage = 395;
var batteryWaitCounter = 0;

var upsMode_firstRun = true;
var upsMode_count = 0; // run 5 times (5sec delay), then finish

function isLiFePO () { return batteryType == "lifepo"; }
function isCarbon () { return batteryType == "carbon"; }
function isOther  () { return batteryType == "other" ; }





//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////





/*
	Helper Function - Scroll To Bottom
*/

function scrollToBottom() { $("#log").scrollTop($("#log").prop("scrollHeight")); }





/*
	Helper Function - Show Loading
*/

function showLoading_energyMeter() {
	$("#testEnergyMeter .notif").removeClass("loading error success").addClass("loading");
	if(energyMeter_firstRun) $("#log").append(`<p class="head"><b>${lang.system_test.energy_meter}</b></p>`);
	$("#log").append(`<p>${lang.system_test.performing_test}</p>`);
	scrollToBottom();
}

function showLoading_solarControllers() {
	$("#testSolarControllers .notif").removeClass("loading error success").addClass("loading");
	if(solarControllers_firstRun) $("#log").append(`<p class="head"><b>${lang.system_test.solar_controllers}</b></p>`);
	$("#log").append(`<p>${lang.system_test.performing_test}</p>`);
	scrollToBottom();
}

function showLoading_batteryCharging() {
	$("#testBatteryCharging .notif").removeClass("loading error success").addClass("loading");
	if(batteryCharging_firstRun) $("#log").append(`<p class="head"><b>${lang.system_test.battery_charging}</b></p>`);
	$("#log").append(`<p>${lang.system_test.verifying_battery_soc}</p>`);
	scrollToBottom();
}

function showLoading_upsMode() {
	$("#testUpsMode .notif").removeClass("loading error success").addClass("loading");
	if(upsMode_firstRun) $("#log").append(`<p class="head"><b>${lang.system_test.ups_mode}</b></p>`);
	$("#log").append(`<p>${lang.system_test.check_output_active}</p>`);
	scrollToBottom();
}





/*
	Helper Function - Finish Step
*/

function finishStep() {
	setTimeout(() => { $("#btn_next").attr("disabled", false); }, 1000);
	$("#btn_next").on("click", () => { window.location.href = "accept_terms.php"; });
}





/*
	Helper Functions - Check if setting exists
*/

function hasSetting(varname, entity) {
	return dataSettings.hasOwnProperty(varname) && dataSettings[varname].hasOwnProperty(entity);
}





//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////





/*
	Get Settings
*/

function getSettings() {
	$.get({
		url: "api.php?get=settings",
		error: () => { alert("E001. Please refresh the page!"); },
		success: (response) => {
			if(!response || typeof response !== "object" || response === null)
				return alert("E002. Please refresh the page!");
			dataSettings = response;
			testEnergyMeter();
		}
	});
}





//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////





/*
	Test Energy Meter
*/

function testEnergyMeter() {

	showLoading_energyMeter();

	var hasModbus    = (hasSetting("PowerModbusConnect"   , 0) && dataSettings["PowerModbusConnect"   ][0]["mode"] != 0);
	var hasUpsInput  = (hasSetting("ModbusUpsInputDevice" , 0) && dataSettings["ModbusUpsInputDevice" ][0]["mode"] != 0);
	var hasUpsOutput = (hasSetting("ModbusUpsOutputDevice", 0) && dataSettings["ModbusUpsOutputDevice"][0]["mode"] != 0);
	var hasGrid      = (hasSetting("ModbusGridDevice"     , 0) && dataSettings["ModbusGridDevice"     ][0]["mode"] != 0);
	var hasExtSolar  = (hasSetting("ModbusExtSolarDevice" , 0) && dataSettings["ModbusExtSolarDevice" ][0]["mode"] != 0);

	// Skip if Modbus or all E.Meters are off
	if(!hasModbus || (!hasUpsInput && !hasUpsOutput && !hasGrid && !hasExtSolar)) {
		$("#testEnergyMeter .notif").removeClass("loading error success").addClass("error");
		$("#log p:last-child").html(`<b class="mr-1">✗</b> ${lang.system_test.performing_test}`);
		return setTimeout(testSolarControllers, 1250);
	}

	// Check if all connected E.Meters are working
	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E003. Please refresh the page!"); },
		success: (response) => {
			if(!response || typeof response != "object") return alert("E004. Please refresh the page!");
			setTimeout(() => {
				$("#testEnergyMeter .notif").removeClass("loading error success");
				var allCorrect = true;
				if(response.hasOwnProperty("2913")) {
					if(hasUpsInput  && !response["2913"].hasOwnProperty("4")) allCorrect = false;
					if(hasUpsOutput && !response["2913"].hasOwnProperty("1")) allCorrect = false;
					if(hasGrid      && !response["2913"].hasOwnProperty("0")) allCorrect = false;
					if(hasExtSolar  && !response["2913"].hasOwnProperty("3")) allCorrect = false;
				} else allCorrect = false;
				if(allCorrect) {
					$("#testEnergyMeter .notif").addClass("success");
					$("#log p:last-child").html(`<b class="mr-1">✓</b> ${lang.system_test.performing_test}`);
					setTimeout(testSolarControllers, 1250);
				} else {
					$("#testEnergyMeter .notif").addClass("error");
					$("#log p:last-child").html(`<b class="mr-1">✗</b> ${lang.system_test.performing_test}`);
					if(skipEnergyMeterTest) {
						if(confirm("Continue without Energy Meter?")) {
							setTimeout(testSolarControllers, 1250);
						} else {
							skipEnergyMeterTest = false;
							setTimeout(testEnergyMeter, 5000);
						}
					} else {
						setTimeout(testEnergyMeter, 5000);
					}
				}
			}, 2500);
			energyMeter_firstRun = false;
		}
	});

}





//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////





/*
	Test Solar Controllers
*/

function testSolarControllers() {

	showLoading_solarControllers();

	var hasController1 = (hasSetting("NominalSol", 1) && dataSettings["NominalSol"][1]["v1"] > 0);
	var hasController2 = (hasSetting("NominalSol", 2) && dataSettings["NominalSol"][2]["v1"] > 0);
	var hasController3 = (hasSetting("NominalSol", 3) && dataSettings["NominalSol"][3]["v1"] > 0);
	var hasController4 = (hasSetting("NominalSol", 4) && dataSettings["NominalSol"][4]["v1"] > 0);
	var hasController5 = (hasSetting("NominalSol", 5) && dataSettings["NominalSol"][5]["v1"] > 0);
	var hasController6 = (hasSetting("NominalSol", 6) && dataSettings["NominalSol"][6]["v1"] > 0);
	var hasController7 = (hasSetting("NominalSol", 7) && dataSettings["NominalSol"][7]["v1"] > 0);
	var hasController8 = (hasSetting("NominalSol", 8) && dataSettings["NominalSol"][8]["v1"] > 0);

	// Skip if all solar controllers are off
	if(!hasController1 && !hasController2 && !hasController3 && !hasController4 && !hasController5 && !hasController6 && !hasController7 && !hasController8) {
		$("#testSolarControllers .notif").removeClass("loading error success").addClass("error");
		$("#log p:last-child").html(`<b class="mr-1">✗</b> ${lang.system_test.performing_test}`);
		return setTimeout(disableAutomatic, 1250);
	}

	// Check if all connected solar controllers are working
	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E003. Please refresh the page!"); },
		success: (response) => {
			if(!response || typeof response != "object") return alert("E004. Please refresh the page!");
			setTimeout(() => {
				$("#testSolarControllers .notif").removeClass("loading error success");
				var allCorrect = true;
				if(response.hasOwnProperty("1553")) {
					if(hasController1 && !response["1553"].hasOwnProperty("1")) allCorrect = false;
					if(hasController2 && !response["1553"].hasOwnProperty("2")) allCorrect = false;
					if(hasController3 && !response["1553"].hasOwnProperty("3")) allCorrect = false;
					if(hasController4 && !response["1553"].hasOwnProperty("4")) allCorrect = false;
					if(hasController5 && !response["1553"].hasOwnProperty("5")) allCorrect = false;
					if(hasController6 && !response["1553"].hasOwnProperty("6")) allCorrect = false;
					if(hasController7 && !response["1553"].hasOwnProperty("7")) allCorrect = false;
					if(hasController8 && !response["1553"].hasOwnProperty("8")) allCorrect = false;
				} else allCorrect = false;
				if(allCorrect) {
					$("#testSolarControllers .notif").addClass("success");
					$("#log p:last-child").html(`<b class="mr-1">✓</b> ${lang.system_test.performing_test}`);
					setTimeout(disableAutomatic, 1250);
				} else {
					$("#testSolarControllers .notif").addClass("error");
					$("#log p:last-child").html(`<b class="mr-1">✗</b> ${lang.system_test.performing_test}`);
					setTimeout(testSolarControllers, 5000);
				}
			}, 2500);
			solarControllers_firstRun = false;
		}
	});

}





//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////





/*
	Disable Automatic
*/

function disableAutomatic() {
	$.get({
		url: "api.php?set=command&type=10&entity=21&text1=0 BxDrive&text2=0",
		error: () => { alert("E060. Please refresh the page!"); },
		success: (response) => {
			if(response != "1") return alert("E061. Please refresh the page!");
			setTimeout(testBatteryCharging, 1250);
		}
	});
}





/*
	Test Battery Charging
*/

function testBatteryCharging() {

	// IF battery_type == other AND battery_capacity == 0
	if(noBattery) return finishStep();

	showLoading_batteryCharging();
	batteryCharging_firstRun = false;

	// Check Battery Level
	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E005. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object")
				return alert("E006. Please refresh the page!");

			var batteryLevel = 50; // Default Value (to skip level test for carbon and other bat.)
			if(response.hasOwnProperty("1074") && response["1074"].hasOwnProperty("1"))
				batteryLevel = parseInt(response["1074"]["1"]);

			var batteryVoltage = 0;
			if(response.hasOwnProperty("1042") && response["1042"].hasOwnProperty("1"))
				batteryVoltage = Math.round(parseInt(response["1042"]["1"]) / 100);

			// Charge Battery
			if(!batteryCharging_alreadyCharged && (isLiFePO() && batteryLevel < batteryMinLevel || !isLiFePO() && batteryVoltage < batteryMinVoltage)) {
				if(isLiFePO()) {
					$("#log p:last-child").html(`<b class="mr-1">✗</b> ${lang.system_test.verifying_battery_soc} (${batteryLevel}%)`);
					$("#log").append(`<p>${lang.system_test.charging_battery_to} ${batteryMinLevel}%</p>`);
				} else {
					$("#log p:last-child").html(`<b class="mr-1">✗</b> ${lang.system_test.verifying_battery_soc} (${batteryVoltage}V)`);
					$("#log").append(`<p>${lang.system_test.charging_battery_to} ${batteryMinVoltage}V</p>`);
				}
				$.get({
					url: "api.php?set=command&type=20480&entity=0&text1=500&text2=0",
					error: () => { alert("E008. Please refresh the page!"); },
					success: (response) => {
						if(response != "1") return alert("E009. Please refresh the page!");
						batteryCharging_count = 0;
						batteryWaitCounter = 25;
						setTimeout(testBatteryCharging_waitUntilCharged, 15000);
					}
				});
			}
			// Discharge Battery
			else if(!batteryCharging_alreadyCharged && (isLiFePO() && batteryLevel > batteryMaxLevel || !isLiFePO() && batteryVoltage > batteryMaxVoltage)) {
				if(isLiFePO()) {
					$("#log p:last-child").html(`<b class="mr-1">✗</b> ${lang.system_test.verifying_battery_soc} (${batteryLevel}%)`);
					$("#log").append(`<p>${lang.system_test.discharging_battery_to} ${batteryMaxLevel}%</p>`);
				} else {
					$("#log p:last-child").html(`<b class="mr-1">✗</b> ${lang.system_test.verifying_battery_soc} (${batteryVoltage}V)`);
					$("#log").append(`<p>${lang.system_test.discharging_battery_to} ${batteryMaxVoltage}V</p>`);
				}
				$.get({
					url: "api.php?set=command&type=20480&entity=0&text1=-500&text2=0",
					error: () => { alert("E010. Please refresh the page!"); },
					success: (response) => {
						if(response != "1") return alert("E011. Please refresh the page!");
						batteryCharging_count = 0;
						batteryWaitCounter = 25;
						setTimeout(testBatteryCharging_waitUntilDischarged, 15000);
					}
				});
			}
			// Continue Testing
			else {
				if(isLiFePO()) {
					$("#log p:last-child").html(`<b class="mr-1">✓</b> ${lang.system_test.verifying_battery_soc} (${batteryLevel}%)`);
					$("#log").append(`<p>${lang.system_test.enable_ac_charging}</p>`);
				} else {
					$("#log p:last-child").html(`<b class="mr-1">✓</b> ${lang.system_test.verifying_battery_soc} (${batteryVoltage}V)`);
					$("#log").append(`<p>${lang.system_test.enable_ac_charging}</p>`);
				}
				$.get({
					url: "api.php?set=command&type=20480&entity=0&text1=500&text2=0",
					error: () => { alert("E014. Please refresh the page!"); },
					success: (response) => {
						if(response != "1") return alert("E015. Please refresh the page!");
						batteryCharging_count = 0;
						setTimeout(() => {
							$("#log p:last-child").html(`<b class="mr-1">✓</b> ${lang.system_test.enable_ac_charging}`);
							$("#log").append(`<p>${lang.system_test.performing_test} (1 / 5)</p>`);
							testBatteryCharging_test();
						}, 15000); // Wait 15 seconds
					}
				});
			}

		}
	});

}





function testBatteryCharging_waitUntilCharged() {
	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E016. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object") return alert("E017. Please refresh the page!");
			if(!response.hasOwnProperty("1121") || !response["1121"].hasOwnProperty("1")) return alert("E018. Please refresh the page!");
			if(!response.hasOwnProperty("1074") || !response["1074"].hasOwnProperty("1")) return alert("E019. Please refresh the page!");
			if(!response.hasOwnProperty("1042") || !response["1042"].hasOwnProperty("1")) return alert("E020. Please refresh the page!");

			if(isLiFePO()) {
				if(batteryWaitCounter < 1 && response["1074"]["1"] >= batteryMinLevel) {
					$("#log p:last-child").html(`<b class="mr-1">✓</b> ${lang.system_test.charging_battery_to} ${batteryMinLevel}%`);
					batteryCharging_alreadyCharged = true;
					testBatteryCharging();
				} else {
					batteryWaitCounter -= 1;
					$("#log p:last-child").html(`${lang.system_test.charging_battery_to} ${batteryMinLevel}%<br>${lang.system_test.current_status}: ${response["1074"]["1"]}% / ${response["1121"]["1"]}W`);
					setTimeout(testBatteryCharging_waitUntilCharged, 5000);
				}
			} else {
				if(batteryWaitCounter < 1 && Math.round(parseInt(response["1042"]["1"]) / 100) >= batteryMinVoltage) {
					$("#log p:last-child").html(`<b class="mr-1">✓</b> ${lang.system_test.charging_battery_to} ${batteryMinVoltage}V`);
					batteryCharging_alreadyCharged = true;
					testBatteryCharging();
				} else {
					batteryWaitCounter -= 1;
					$("#log p:last-child").html(`${lang.system_test.charging_battery_to} ${batteryMinVoltage}V<br>${lang.system_test.current_status}: ${Math.round(parseInt(response["1042"]["1"]) / 100)}V / ${response["1121"]["1"]}W`);
					setTimeout(testBatteryCharging_waitUntilCharged, 5000);
				}
			}

		}
	});
}





function testBatteryCharging_waitUntilDischarged() {
	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E022. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object") return alert("E023. Please refresh the page!");
			if(!response.hasOwnProperty("1121") || !response["1121"].hasOwnProperty("1")) return alert("E024. Please refresh the page!");
			if(!response.hasOwnProperty("1074") || !response["1074"].hasOwnProperty("1")) return alert("E025. Please refresh the page!");
			if(!response.hasOwnProperty("1042") || !response["1042"].hasOwnProperty("1")) return alert("E026. Please refresh the page!");
			if(!response.hasOwnProperty("1634") || !response["1634"].hasOwnProperty("0")) return alert("E027. Please refresh the page!");

			if(isLiFePO()) {
				if(batteryWaitCounter < 1 && response["1074"]["1"] <= batteryMaxLevel) {
					$("#log p:last-child").html(`<b class="mr-1">✓</b> ${lang.system_test.discharging_battery_to} ${batteryMaxLevel}%`);
					$("#testBatteryCharging span span").html("");
					testBatteryCharging();
				} else {
					batteryWaitCounter -= 1;
					$("#log p:last-child").html(`${lang.system_test.discharging_battery_to} ${batteryMaxLevel}%<br>${lang.system_test.current_status}: ${response["1074"]["1"]}% / ${response["1121"]["1"]}W`);
					$("#testBatteryCharging span span").html(parseInt(response["1634"]["0"]) > 100 ? lang.system_test.turn_solar_off : "");
					setTimeout(testBatteryCharging_waitUntilDischarged, 5000);
				}
			} else {
				if(batteryWaitCounter < 1 && Math.round(parseInt(response["1042"]["1"]) / 100) <= batteryMaxVoltage) {
					$("#log p:last-child").html(`<b class="mr-1">✓</b> ${lang.system_test.discharging_battery_to} ${batteryMaxVoltage}V`);
					$("#testBatteryCharging span span").html("");
					testBatteryCharging();
				} else {
					batteryWaitCounter -= 1;
					$("#log p:last-child").html(`${lang.system_test.discharging_battery_to} ${batteryMaxVoltage}V<br>${lang.system_test.current_status}: ${Math.round(parseInt(response["1042"]["1"]) / 100)}V / ${response["1121"]["1"]}W`);
					$("#testBatteryCharging span span").html(parseInt(response["1634"]["0"]) > 100 ? lang.system_test.turn_solar_off : "");
					setTimeout(testBatteryCharging_waitUntilDischarged, 5000);
				}
			}

		}
	});
}





function testBatteryCharging_test() {
	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E032. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty("1121") || !response["1121"].hasOwnProperty("1"))
				return alert("E033. Please refresh the page!");

			var batteryPower = parseInt(response["1121"]["1"]);
			batteryCharging_count += 1;
			$("#log p:last-child").html(`${lang.system_test.performing_test} (${batteryCharging_count} / 5)`);

			if(batteryPower > 250) { // Charging with over 250W
				if(batteryCharging_count < 5)
					setTimeout(testBatteryCharging_test, 5000);
				else {
					$("#log p:last-child").html(`<b class="mr-1">✓</b> ${lang.system_test.performing_test} (${batteryCharging_count} / 5)`);
					$.get({
						url: "api.php?set=command&type=20480&entity=0&text1=-500&text2=0", // Set Charging Current to -5A
						error: () => { alert("E034. Please refresh the page!"); },
						success: (response) => {
							if(response != "1") return alert("E035. Please refresh the page!");
							$.get({
								url: "api.php?set=command&type=10&entity=21&text1=0 BxDrive&text2=1", // Enable Automatic
								error: () => { alert("E036. Please refresh the page!"); },
								success: (response) => {
									if(response != "1") return alert("E037. Please refresh the page!");
									$("#log").append(`<p>${lang.system_test.disable_ac_charging}</p>`);
									scrollToBottom();
									setTimeout(() => {
										$("#testBatteryCharging .notif").removeClass("loading error success").addClass("success");
										$("#log p:last-child").html(`<b class="mr-1">✓</b> ${lang.system_test.disable_ac_charging}`);
										setTimeout(testUpsMode, 2500);
									}, 15000);
								}
							});
						}
					});
				}
			} else {
				$("#testBatteryCharging .notif").removeClass("loading error success").addClass("error");
				$("#log p:last-child").html(`<b class="mr-1">✗</b> ${lang.system_test.performing_test} (${batteryCharging_count} / 5)`);
				setTimeout(testBatteryCharging, 5000);
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
	Test UPS Mode
*/

function testUpsMode() {

	showLoading_upsMode();

	// Check Output Voltage
	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E046. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty("1297") || !response["1297"].hasOwnProperty("1"))
				return alert("E047. Please refresh the page!");

			var voltage1 = undefined;
			var voltage2 = undefined;
			var voltage3 = undefined;

			if(response.hasOwnProperty("1297") && response["1297"].hasOwnProperty("1")) voltage1 = response["1297"]["1"];
			if(response.hasOwnProperty("1298") && response["1298"].hasOwnProperty("1")) voltage2 = response["1298"]["1"];
			if(response.hasOwnProperty("1299") && response["1299"].hasOwnProperty("1")) voltage3 = response["1299"]["1"];

			outputIsActive = undefined;

			if(voltage1 != undefined && voltage2 != undefined && voltage3 != undefined)
				outputIsActive = (voltage1 > 10000 && voltage2 > 10000 && voltage3 > 10000);
			else alert("E048. Please refresh the page!");

			if(outputIsActive == true) {
				// Continue With Test
				$("#log p:last-child").html(`<b class="mr-1">✓</b> ${lang.system_test.check_output_active}`);
				$("#log").append(`<p>${lang.system_test.turn_input_off}</p>`);
				scrollToBottom();
				$("#testUpsMode span span").html(lang.system_test.turn_input_off);
				setTimeout(testUpsMode_waitingForInput, 5000);
			} else if(outputIsActive != undefined) {
				// Show Error
				$("#log p:last-child").html(`<b class="mr-1">✗</b> ${lang.system_test.check_output_active}`);
				$("#testUpsMode span span").html(lang.system_test.turn_output_on);
				setTimeout(() => { testUpsMode(); }, 5000);
			}

		}
	});

	upsMode_firstRun = false;

}





function testUpsMode_waitingForInput() {

	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E049. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty("273") || !response["273"].hasOwnProperty("1") || !response.hasOwnProperty("1634") || !response["1634"].hasOwnProperty("0"))
				return alert("E050. Please refresh the page!");

			var voltage1 = undefined;
			var voltage2 = undefined;
			var voltage3 = undefined;
			var solPower = undefined;

			if(response.hasOwnProperty("273") && response["273"].hasOwnProperty("1")) voltage1 = response["273"]["1"];
			if(response.hasOwnProperty("274") && response["274"].hasOwnProperty("1")) voltage2 = response["274"]["1"];
			if(response.hasOwnProperty("275") && response["275"].hasOwnProperty("1")) voltage3 = response["275"]["1"];
			solPower = response["1634"]["0"];

			inputIsActive = undefined;
			solarIsActive = (solPower > 1);

			if(voltage1 != undefined && voltage2 != undefined && voltage3 != undefined)
				inputIsActive = (voltage1 > 10000 && voltage2 > 10000 && voltage3 > 10000);
			else alert("E051. Please refresh the page!");

			if(inputIsActive == false && solarIsActive == false) {
				// Continue With Test
				$("#log p:last-child").html(`<b class="mr-1">✓</b> ${lang.system_test.turn_input_off}`);
				$("#log").append(`<p>${lang.system_test.performing_test} (1 / 5)</p>`);
				scrollToBottom();
				$("#testUpsMode span span").html("");
				setTimeout(testUpsMode_test, 5000);
			} else if(inputIsActive != undefined && solarIsActive != undefined) {
				// Retry
				setTimeout(testUpsMode_waitingForInput, 5000);
			}

		}
	});

}





function testUpsMode_test() {

	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E052. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty("1297") || !response["1297"].hasOwnProperty("1"))
				return alert("E053. Please refresh the page!");

			upsMode_count += 1;
			$("#log p:last-child").html(`${lang.system_test.performing_test} (${upsMode_count} / 5)`);

			var voltage1 = undefined;
			var voltage2 = undefined;
			var voltage3 = undefined;

			if(response.hasOwnProperty("1297") && response["1297"].hasOwnProperty("1")) voltage1 = response["1297"]["1"];
			if(response.hasOwnProperty("1298") && response["1298"].hasOwnProperty("1")) voltage2 = response["1298"]["1"];
			if(response.hasOwnProperty("1299") && response["1299"].hasOwnProperty("1")) voltage3 = response["1299"]["1"];

			outputIsActive = undefined;

			if(voltage1 != undefined && voltage2 != undefined && voltage3 != undefined)
				outputIsActive = (voltage1 > 10000 && voltage2 > 10000 && voltage3 > 10000);
			else alert("E054. Please refresh the page!");

			if(outputIsActive == true) {
				if(upsMode_count < 5)
					setTimeout(testUpsMode_test, 5000);
				else {
					$("#log p:last-child").html(`<b class="mr-1">✓</b> ${lang.system_test.performing_test} (${upsMode_count} / 5)`);
					testUpsMode_finish();
				}
			} else if(outputIsActive != undefined) {
				$("#testUpsMode .notif").removeClass("loading error success").addClass("error");
				$("#log p:last-child").html(`<b class="mr-1">✗</b> ${lang.system_test.performing_test} (${upsMode_count} / 5)`);
				scrollToBottom();
			}

		}
	});

}





function testUpsMode_finish() {
	
	// Check Input Voltage
	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E055. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty("273") || !response["273"].hasOwnProperty("1"))
				return alert("E056. Please refresh the page!");

			var voltage1 = undefined;
			var voltage2 = undefined;
			var voltage3 = undefined;

			if(response.hasOwnProperty("273") && response["273"].hasOwnProperty("1")) voltage1 = response["273"]["1"];
			if(response.hasOwnProperty("274") && response["274"].hasOwnProperty("1")) voltage2 = response["274"]["1"];
			if(response.hasOwnProperty("275") && response["275"].hasOwnProperty("1")) voltage3 = response["275"]["1"];

			inputIsActive = undefined;

			if(voltage1 != undefined && voltage2 != undefined && voltage3 != undefined)
				inputIsActive = (voltage1 > 10000 && voltage2 > 10000 && voltage3 > 10000);
			else alert("E057. Please refresh the page!");

			if(inputIsActive == true) {
				// Finish Step
				$("#testUpsMode .notif").removeClass("loading error success").addClass("success");
				$("#testUpsMode span span").html("");
				finishStep();
			} else if(inputIsActive != undefined) {
				// Retry
				$("#testUpsMode span span").html(lang.system_test.turn_input_on);
				setTimeout(testUpsMode_finish, 5000);
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
	Begin Testing
*/

getSettings();
