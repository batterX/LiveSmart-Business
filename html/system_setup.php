<?php

/*
	System Setup
*/

// Include Base
include_once "common/base.php";
// Set Step
$step = 5;

// Disable Back Button
if(!isset($_SESSION["last_step"])) header("location: index.php");
if($_SESSION["last_step"] != $step && $_SESSION["last_step"] != $step - 1)
	header("location: " . (isset($_SESSION["back_url"]) ? $_SESSION["back_url"] : "index.php"));
$_SESSION["back_url" ] = $_SERVER["REQUEST_URI"];
$_SESSION["last_step"] = $step;

// Get Apikey
$output = shell_exec("cat /proc/cpuinfo");
$find = "Serial";
$pos = strpos($output, $find);
$serial = substr($output, $pos + 10, 16);
$apikey = sha1(strval($serial));
$_SESSION["box_apikey"] = $apikey;

?>





<!DOCTYPE html>

<html>

	<head>

		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta name="author" content="Ivan Gavrilov">
		<link rel="icon" href="img/favicon.png">

		<title>batterX liveX</title>

		<link rel="stylesheet" href="css/dist/bundle.css?v=<?php echo $versionHash ?>">
		<link rel="stylesheet" href="css/common.css?v=<?php echo $versionHash ?>">
		<link rel="stylesheet" href="css/system_setup.css?v=<?php echo $versionHash ?>">

	</head>

	<body>





		<!-- Progress Bar -->
		<div id="progress" class="shadow-lg">
			<div><div class="progress"><div class="progress-bar progress-bar-striped bg-success progress-bar-animated"></div></div></div>
			<div><button id="btn_next" class="btn btn-success ripple" type="submit" form="mainForm" disabled><?php echo $lang["btn"]["continue"]; ?></button></div>
		</div>
		<!-- Progress Bar -->





		<div class="modal fade" id="errorBoxNotRegistered" tabindex="-1" role="dialog">
			<div class="modal-dialog modal-dialog-centered modal-sm">
				<div class="modal-content">
					<div class="modal-body text-center">
						<span style="color: red"><b><?php echo $lang["bs_system_setup"]["msg_livex_not_registered"] ?></b></span>
						<div class="mt-3">
							<span class="d-block"><b>APIKEY</b></span>
							<input type="text" class="form-control form-control-outline text-center mt-2 px-2" style="font-size:95%" value="<?php echo $apikey ?>" readonly>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="modal fade" id="errorUpsRegisteredWithOtherSystem" tabindex="-1" role="dialog">
			<div class="modal-dialog modal-dialog-centered modal-sm">
				<div class="modal-content">
					<div class="modal-body text-center">
						<span style="color: red"><b><?php echo $lang["bs_system_setup"]["msg_ups_registered_with_other_system"] ?></b></span>
					</div>
				</div>
			</div>
		</div>

		<div class="modal fade" id="errorBatteryNotExistOrWithOtherSystem" tabindex="-1" role="dialog">
			<div class="modal-dialog modal-dialog-centered modal-sm">
				<div class="modal-content">
					<div class="modal-body text-center">
						<span style="color: red"><b><?php echo $lang["bs_system_setup"]["msg_battery_not_exist_or_registered_with_other_system"] ?></b></span>
						<div class="mt-3">
							<span class="d-block"><b><?php echo $lang["common"]["serialnumber"] ?></b></span>
							<input id="errorBatterySerial" type="text" class="form-control form-control-outline text-center mt-2 px-2" style="font-size:95%" readonly>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="modal fade" id="errorControllerNotExistOrWithOtherSystem" tabindex="-1" role="dialog">
			<div class="modal-dialog modal-dialog-centered modal-sm">
				<div class="modal-content">
					<div class="modal-body text-center">
						<span style="color: red"><b><?php echo $lang["bs_system_setup"]["msg_controller_not_exist_or_registered_with_other_system"] ?></b></span>
						<div class="mt-3">
							<span class="d-block"><b><?php echo $lang["common"]["serialnumber"] ?></b></span>
							<input id="errorControllerSerial" type="text" class="form-control form-control-outline text-center mt-2 px-2" style="font-size:95%" readonly>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="modal fade" id="errorBmsNotExistOrWithOtherSystem" tabindex="-1" role="dialog">
			<div class="modal-dialog modal-dialog-centered modal-sm">
				<div class="modal-content">
					<div class="modal-body text-center">
						<span style="color: red"><b><?php echo $lang["bs_system_setup"]["msg_bms_not_exist_or_registered_with_other_system"] ?></b></span>
						<div class="mt-3">
							<span class="d-block"><b><?php echo $lang["common"]["serialnumber"] ?></b></span>
							<input id="errorBmsSerial" type="text" class="form-control form-control-outline text-center mt-2 px-2" style="font-size:95%" readonly>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="modal fade" id="modalInstallerMemo" tabindex="-1" role="dialog">
			<div class="modal-dialog modal-dialog-centered modal-sm">
				<div class="modal-content">
					<h5 class="modal-header mb-0"><?php echo $lang["bs_system_setup"]["system_installer_memo"]; ?></h5>
					<div class="modal-body"><textarea id="installer_memo" class="form-control form-control-outline"></textarea></div>
					<div class="modal-footer"><button type="button" class="btn btn-sm px-4 py-2 btn-success ripple" data-dismiss="modal"><b><?php echo $lang["btn"]["save"] ?></b></button></div>
				</div>
			</div>
		</div>

		<div class="modal fade" id="modalGenerator" tabindex="-1" role="dialog">
			<div class="modal-dialog modal-dialog-centered modal-sm">
				<div class="modal-content">
					<h5 class="modal-header mb-0"><?php echo $lang["bs_system_setup"]["generator_setup"] ?></h5>
					<div class="modal-body">

						<div class="form-group row mb-2">
							<label class="col-6 col-form-label col-form-label-sm"><?php echo $lang["bs_system_setup"]["generator_enable"] ?></label>
							<div class="col-6 d-flex align-items-center">
								<select id="generator_enable" class="form-control form-control-sm form-control-outline">
									<option value="1"><?php echo $lang["common"]["yes"]; ?></option>
									<option value="0"><?php echo $lang["common"]["no"]; ?></option>
								</select>
							</div>
						</div>
						<div class="form-group row mb-2">
							<label class="col-6 col-form-label col-form-label-sm"><?php echo $lang["bs_system_setup"]["generator_pin"] ?></label>
							<div class="col-6 d-flex align-items-center">
								<select id="generator_pin" class="form-control form-control-sm form-control-outline">
									<option value="0"><?php echo $lang["bs_system_setup"]["generator_none"] ?></option>
                            		<option value="1"><?php echo $lang["bs_system_setup"]["generator_output_pin"] ?> 1</option>
                            		<option value="2"><?php echo $lang["bs_system_setup"]["generator_output_pin"] ?> 2</option>
                            		<option value="3"><?php echo $lang["bs_system_setup"]["generator_output_pin"] ?> 3</option>
                            		<option value="4"><?php echo $lang["bs_system_setup"]["generator_output_pin"] ?> 4</option>
                            		<option value="5"><?php echo $lang["bs_system_setup"]["generator_output_pin"] ?> 5</option>
                            		<option value="6"><?php echo $lang["bs_system_setup"]["generator_output_pin"] ?> 6</option>
                            		<option value="7"><?php echo $lang["bs_system_setup"]["generator_output_pin"] ?> 7</option>
                            		<option value="8"><?php echo $lang["bs_system_setup"]["generator_output_pin"] ?> 8</option>
								</select>
							</div>
						</div>
						<div class="form-group row">
							<label class="col-6 col-form-label col-form-label-sm"><?php echo $lang["bs_system_setup"]["generator_limit_charging_current"] ?></label>
							<div class="col-6 d-flex align-items-center">
								<div class="input-group input-group-sm">
									<input id="generator_currentLimit" class="form-control form-control-outline" type="number" step="0.1" min="0">
									<div class="input-group-append"><span class="input-group-text">A</span></div>
								</div>
							</div>
						</div>

						<div class="form-group row mb-1 border-top pt-3">
							<label class="col-6 col-form-label col-form-label-sm"><?php echo $lang["bs_system_setup"]["generator_switch_on_when"] ?></label>
							<div class="col-6 d-flex align-items-center">
								<select id="generator_switchOnType" class="form-control form-control-sm form-control-outline">
                                    <option value="0"></option>
                                    <option value="1"><?php echo $lang["bs_system_setup"]["generator_time"] ?></option>
                                    <option value="2"><?php echo $lang["bs_system_setup"]["generator_battery_voltage"] ?></option>
                                </select>
							</div>
						</div>
						<div class="form-group row mb-2 d-none" id="generator_switchOnTime_container">
							<label class="col-6 col-form-label col-form-label-sm p-0"></label>
							<div class="col-6 d-flex align-items-center">
								<input id="generator_switchOnTime" type="time" class="form-control form-control-sm form-control-outline" placeholder="" step="60" value="">
							</div>
						</div>
						<div class="form-group row mb-2" id="generator_switchOnVoltage_container">
							<label class="col-6 col-form-label col-form-label-sm p-0"></label>
							<div class="col-6 d-flex align-items-center">
								<div class="input-group input-group-sm">
									<input id="generator_switchOnVoltage" class="form-control form-control-outline" type="number" step="1" min="0">
									<div class="input-group-append"><span class="input-group-text">V</span></div>
								</div>
							</div>
						</div>
						<div class="form-group row">
							<label class="col-6 col-form-label col-form-label-sm"><?php echo $lang["bs_system_setup"]["generator_min_on_time"] ?></label>
							<div class="col-6 d-flex align-items-center">
								<div class="input-group input-group-sm">
									<input id="generator_minOnTime" class="form-control form-control-outline" type="number" step="1" min="0">
									<div class="input-group-append"><span class="input-group-text">min</span></div>
								</div>
							</div>
						</div>

						<div class="form-group row mb-1 border-top pt-3">
							<label class="col-6 col-form-label col-form-label-sm"><?php echo $lang["bs_system_setup"]["generator_switch_off_when"] ?></label>
							<div class="col-6 d-flex align-items-center">
								<select id="generator_switchOffType" class="form-control form-control-sm form-control-outline">
                                    <option value="0"></option>
                                    <option value="1"><?php echo $lang["bs_system_setup"]["generator_time"] ?></option>
                                    <option value="2"><?php echo $lang["bs_system_setup"]["generator_battery_voltage"] ?></option>
                                </select>
							</div>
						</div>
						<div class="form-group row mb-2 d-none" id="generator_switchOffTime_container">
							<label class="col-6 col-form-label col-form-label-sm p-0"></label>
							<div class="col-6 d-flex align-items-center">
								<input id="generator_switchOffTime" type="time" class="form-control form-control-sm form-control-outline" placeholder="" step="60" value="">
							</div>
						</div>
						<div class="form-group row mb-2" id="generator_switchOffVoltage_container">
							<label class="col-6 col-form-label col-form-label-sm p-0"></label>
							<div class="col-6 d-flex align-items-center">
								<div class="input-group input-group-sm">
									<input id="generator_switchOffVoltage" class="form-control form-control-outline" type="number" step="1" min="0">
									<div class="input-group-append"><span class="input-group-text">V</span></div>
								</div>
							</div>
						</div>
						<div class="form-group row">
							<label class="col-6 col-form-label col-form-label-sm"><?php echo $lang["bs_system_setup"]["generator_min_off_time"] ?></label>
							<div class="col-6 d-flex align-items-center">
								<div class="input-group input-group-sm">
									<input id="generator_minOffTime" class="form-control form-control-outline" type="number" step="1" min="0">
									<div class="input-group-append"><span class="input-group-text">min</span></div>
								</div>
							</div>
						</div>

						<div class="mx-n3 px-3 border-top pt-3">
							<label><?php echo $lang["bs_system_setup"]["generator_info"] ?></label>
							<textarea id="generator_info" class="form-control form-control-outline" placeholder="Type here…"></textarea>
						</div>

						<input id="generator_pinOld" class="form-control form-control-outline" type="hidden">
						
					</div>
					<div class="modal-footer"><button type="button" class="btn btn-sm px-4 py-2 btn-success ripple" data-dismiss="modal"><b><?php echo $lang["btn"]["save"] ?></b></button></div>
				</div>
			</div>
		</div>





		<div class="container pb-5">
			<form id="mainForm" class="pb-4">

				<div class="row">



					<!-- batterX Business -->
					<div id="bxBusiness" class="col-lg-6 col-xl-4 pt-5">

						<h1 class="card-header bg-transparent border-0"><?php echo $lang["bs_system_setup"]["system"]; ?></h1>

						<div class="card elevate-1 h-100">
							<div class="card-body border-bottom">
								<label for="bx_system"><?php echo $lang["bs_system_setup"]["system_serialnumber_ups"]; ?></label>
								<input id="bx_system" class="form-control form-control-outline" type="text" placeholder="<?php echo $lang["common"]["serialnumber"]; ?>" required>
							</div>
							<div class="card-body border-bottom pt-3">
								<label for="bx_model"><?php echo $lang["bs_system_setup"]["system_ups_model"]; ?></label>
								<select id="bx_model" class="form-control form-control-outline" required>
									<option value="10000">batterX UPS 10kVA / 9kW</option>
									<option value="15000">batterX UPS 15kVA / 13,5kW</option>
									<option value="20000">batterX UPS 20kVA / 18kW</option>
									<option value="30000">batterX UPS 30kVA / 27kW</option>
									<option value="40000">batterX UPS 40kVA / 36kW</option>
									<option value="60000">batterX UPS 60kVA / 54kW</option>
									<option value="80000">batterX UPS 80kVA / 72kW</option>
									<option value="100000">batterX UPS 100kVA / 90kW</option>
									<option value="120000">batterX UPS 120kVA / 108kW</option>
									<option value="160000">batterX UPS 160kVA / 144kW</option>
									<option value="200000">batterX UPS 200kVA / 180kW</option>
									<option value="250000">batterX UPS 250kVA / 225kW</option>
									<option value="300000">batterX UPS 300kVA / 270kW</option>
									<option value="400000">batterX UPS 400kVA / 360kW</option>
									<option value="500000">batterX UPS 500kVA / 400kW</option>
									<option value="650000">batterX UPS 650kVA / 520kW</option>
								</select>
							</div>
							<div class="card-body border-bottom pt-3">
								<label for="bx_box"><?php echo $lang["bs_system_setup"]["system_serialnumber_livex"]; ?></label>
								<input id="bx_box" class="form-control form-control-outline" type="text" placeholder="<?php echo $lang["common"]["serialnumber"]; ?>" value="" disabled required>
							</div>
							<div class="card-body p-2">
								<button id="btnInstallerMemo" type="button" class="btn btn-custom btn-block ripple p-2" data-toggle="modal" data-target="#modalInstallerMemo"><small><b><?php echo $lang["bs_system_setup"]["system_installer_memo"]; ?></b></small></button>
							</div>
						</div>

					</div>



					<!-- Solar Panels -->
					<div id="solar" class="col-lg-6 col-xl-4 pt-5">

						<h1 class="card-header bg-transparent border-0"><?php echo $lang["bs_system_setup"]["solar"] ?></h1>

						<div class="card elevate-1 h-100">
							<div class="card-body border-bottom pb-2">
								<p class="mb-3"><?php echo $lang["bs_system_setup"]["solar_serialnumber"]; ?></p>
								<div class="form-row mt-2"><div class="col-7"><input id="solar_c1_serial" class="form-control form-control-outline form-control-sm" type="text" placeholder="<?php echo $lang["bs_system_setup"]["solar_controller"] ?> 1 S/N"></div><div class="col-5"><div class="input-group input-group-sm"><input id="solar_c1_power" class="solar-controller form-control form-control-outline" type="number" step="1" min="0"><div class="input-group-append"><span class="input-group-text">Wp</span></div></div></div></div>
								<div class="form-row mt-2"><div class="col-7"><input id="solar_c2_serial" class="form-control form-control-outline form-control-sm" type="text" placeholder="<?php echo $lang["bs_system_setup"]["solar_controller"] ?> 2 S/N"></div><div class="col-5"><div class="input-group input-group-sm"><input id="solar_c2_power" class="solar-controller form-control form-control-outline" type="number" step="1" min="0"><div class="input-group-append"><span class="input-group-text">Wp</span></div></div></div></div>
								<div id="listAllControllers" class="d-none">
									<div class="form-row mt-2"><div class="col-7"><input id="solar_c3_serial" class="form-control form-control-outline form-control-sm" type="text" placeholder="<?php echo $lang["bs_system_setup"]["solar_controller"] ?> 3 S/N"></div><div class="col-5"><div class="input-group input-group-sm"><input id="solar_c3_power" class="solar-controller form-control form-control-outline" type="number" step="1" min="0"><div class="input-group-append"><span class="input-group-text">Wp</span></div></div></div></div>
									<div class="form-row mt-2"><div class="col-7"><input id="solar_c4_serial" class="form-control form-control-outline form-control-sm" type="text" placeholder="<?php echo $lang["bs_system_setup"]["solar_controller"] ?> 4 S/N"></div><div class="col-5"><div class="input-group input-group-sm"><input id="solar_c4_power" class="solar-controller form-control form-control-outline" type="number" step="1" min="0"><div class="input-group-append"><span class="input-group-text">Wp</span></div></div></div></div>
									<div class="form-row mt-2"><div class="col-7"><input id="solar_c5_serial" class="form-control form-control-outline form-control-sm" type="text" placeholder="<?php echo $lang["bs_system_setup"]["solar_controller"] ?> 5 S/N"></div><div class="col-5"><div class="input-group input-group-sm"><input id="solar_c5_power" class="solar-controller form-control form-control-outline" type="number" step="1" min="0"><div class="input-group-append"><span class="input-group-text">Wp</span></div></div></div></div>
									<div class="form-row mt-2"><div class="col-7"><input id="solar_c6_serial" class="form-control form-control-outline form-control-sm" type="text" placeholder="<?php echo $lang["bs_system_setup"]["solar_controller"] ?> 6 S/N"></div><div class="col-5"><div class="input-group input-group-sm"><input id="solar_c6_power" class="solar-controller form-control form-control-outline" type="number" step="1" min="0"><div class="input-group-append"><span class="input-group-text">Wp</span></div></div></div></div>
									<div class="form-row mt-2"><div class="col-7"><input id="solar_c7_serial" class="form-control form-control-outline form-control-sm" type="text" placeholder="<?php echo $lang["bs_system_setup"]["solar_controller"] ?> 7 S/N"></div><div class="col-5"><div class="input-group input-group-sm"><input id="solar_c7_power" class="solar-controller form-control form-control-outline" type="number" step="1" min="0"><div class="input-group-append"><span class="input-group-text">Wp</span></div></div></div></div>
									<div class="form-row mt-2 mb-2 pb-1"><div class="col-7"><input id="solar_c8_serial" class="form-control form-control-outline form-control-sm" type="text" placeholder="<?php echo $lang["bs_system_setup"]["solar_controller"] ?> 8 S/N"></div><div class="col-5"><div class="input-group input-group-sm"><input id="solar_c8_power" class="solar-controller form-control form-control-outline" type="number" step="1" min="0"><div class="input-group-append"><span class="input-group-text">Wp</span></div></div></div></div>
								</div>
								<div class="text-center">
									<button type="button" id="btnShowAllControllers" class="btn btn-custom ripple mt-2 px-3"><small><b><?php echo $lang["btn"]["show_more"] ?></b></small></button>
								</div>
							</div>
							<div class="card-body border-bottom pt-3">
								<label><?php echo $lang["bs_system_setup"]["solar_total_power_installed"]; ?></label>
								<div class="input-group">
									<input id="solar_total_power" class="form-control form-control-outline" type="text" disabled>
									<div class="input-group-append"><span class="input-group-text">Wp</span></div>
								</div>
							</div>
							<div class="card-body pt-3">
								<label for="solar_info"><?php echo $lang["bs_system_setup"]["solar_info"]; ?></label>
								<textarea id="solar_info" class="form-control form-control-outline" placeholder="Paneltyp: …

MPPT 1
	String 1: …
	String 2: …
MPPT 2
	String 1: …
	String 2: …"></textarea>
							</div>
						</div>

					</div>



					<!-- Batteries -->
					<div id="battery" class="col-lg-6 col-xl-4 pt-5">

						<h1 class="card-header bg-transparent border-0"><?php echo $lang["bs_system_setup"]["batteries"] ?></h1>

						<div class="card elevate-1 h-100">
						
							<div class="card-body">
								<div class="custom-control custom-radio d-inline-block">
									<input type="radio" id="bx_battery_type_0" name="bx_battery_type" class="custom-control-input" value="0" checked>
									<label class="custom-control-label" for="bx_battery_type_0"><?php echo $lang["bs_system_setup"]["batteries_lifepo"] ?></label>
								</div>
								<div class="custom-control custom-radio d-inline-block ml-4">
									<input type="radio" id="bx_battery_type_1" name="bx_battery_type" class="custom-control-input" value="1">
									<label class="custom-control-label" for="bx_battery_type_1"><?php echo $lang["bs_system_setup"]["batteries_carbon"] ?></label>
								</div>
								<div class="custom-control custom-radio d-inline-block ml-4">
									<input type="radio" id="bx_battery_type_9" name="bx_battery_type" class="custom-control-input" value="9">
									<label class="custom-control-label" for="bx_battery_type_9"><?php echo $lang["bs_system_setup"]["batteries_other"] ?></label>
								</div>
							</div>

							<div class="card-body border-top">

								<div id="battery_section_0">
									<div class="card-body border-bottom pt-0" style="margin-left:-1.25rem;margin-right:-1.25rem">
										<label for="lifepo_bms"><?php echo $lang["bs_system_setup"]["batteries_lifepo_sn_bms_module"]; ?></label>
										<textarea id="lifepo_bms" class="form-control form-control-outline" style="min-height: 80px !important" placeholder="PPTBB0xxxxxxxxxx
PPTBP0xxxxxxxxxx
PPTBP0xxxxxxxxxx
…"></textarea>
										<label class="mt-3" for="lifepo_serialnumbers"><?php echo $lang["bs_system_setup"]["batteries_lifepo_sn_battery_modules"]; ?></label>
										<textarea id="lifepo_serialnumbers" class="form-control form-control-outline" placeholder="PPTBP1xxxxxxxxxx
PPTBP1xxxxxxxxxx
…"></textarea>
									</div>
									<div class="card-body border-bottom" style="margin-left:-1.25rem;margin-right:-1.25rem">
										<label><?php echo $lang["bs_system_setup"]["modbus_port_name"]; ?></label>
										<input id="lifepo_portname" class="form-control form-control-outline" type="text" placeholder="/dev/ttyUSB0">
									</div>
									<div class="card-body pb-0" style="margin-left:-1.25rem;margin-right:-1.25rem">
										<label><?php echo $lang["bs_system_setup"]["modbus_possible_usb_devices"]; ?></label>
										<select id="lifepo_portlist" class="form-control form-control-outline"></select>
										<div class="row m-0 p-0 mt-2">
											<div class="col-6 m-0 p-0 pr-1"><button id="lifepo_portlist_refresh" type="button" class="btn btn-sm px-3 py-2 btn-block btn-custom border ripple" style="border-color: transparent !important"><b><?php echo $lang["bs_system_setup"]["modbus_refresh_list"]; ?></b></button></div>
											<div class="col-6 m-0 p-0 pl-1"><button id="lifepo_portlist_apply" type="button" class="btn btn-sm px-3 py-2 btn-block btn-custom border ripple"><b><?php echo $lang["bs_system_setup"]["modbus_use_selected"]; ?></b></button></div>
										</div>
									</div>
								</div>

								<div id="battery_section_1" style="display:none">
									<div class="d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2"><?php echo $lang["bs_system_setup"]["batteries_carbon_model"]; ?></span>
										<select id="carbon_battery_model" class="form-control-sm form-control form-control-outline w-50">
											<option value="LC+700">LC+700 (60x12V)</option>
											<option value="LC+1300">LC+1300 (60x12V)</option>
										</select>
									</div>
									<div class="mt-2 d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2"><?php echo $lang["bs_system_setup"]["batteries_carbon_number_of_strings"] ?></span>
										<select id="carbon_battery_strings" class="form-control-sm form-control form-control-outline w-50">
											<option value="1">1</option>
											<option value="2">2</option>
											<option value="3">3</option>
											<option value="4">4</option>
											<option value="5">5</option>
										</select>
									</div>
									<div class="mt-3 d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2"><?php echo $lang["bs_system_setup"]["batteries_carbon_capacity"] ?></span>
										<input id="carbon_battery_capacity" type="text" class="form-control form-control-sm form-control-outline text-right w-50" value="42000 Wh" disabled>
									</div>
									<div class="mt-1 d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2"></span>
										<input id="carbon_battery_ah" type="text" class="form-control form-control-sm form-control-outline text-right w-50" value="50 Ah" disabled>
									</div>
								</div>

								<div id="battery_section_9" style="display:none">
									<div class="d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $lang["bs_system_setup"]["batteries_other_total_capacity"] ?></small></span>
										<input id="other_battery_ah" type="number" step="1" class="form-control form-control-outline p-1" style="width:30%;max-width:30%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
										<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>Ah</small></span>
									</div>
									<div class="mt-3 d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $lang["bs_system_setup"]["batteries_other_max_charge_c"] ?></small></span>
										<input id="other_battery_maxChargeC" type="number" step="0.01" class="form-control form-control-outline p-1" style="width:30%;max-width:30%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
										<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>C</small></span>
									</div>
									<div class="mt-2 d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $lang["bs_system_setup"]["batteries_other_max_discharge_c"] ?></small></span>
										<input id="other_battery_maxDischargeC" type="number" step="0.01" class="form-control form-control-outline p-1" style="width:30%;max-width:30%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
										<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>C</small></span>
									</div>
									<div class="mt-3 d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $lang["bs_system_setup"]["batteries_other_min_discharge_voltage"] ?></small></span>
										<input id="other_battery_minDischargeVoltage" type="number" step="1" class="form-control form-control-outline p-1" style="width:30%;max-width:30%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
										<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>V</small></span>
									</div>
									<div class="mt-2 d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $lang["bs_system_setup"]["batteries_other_voltage_hysteresis"] ?></small></span>
										<input id="other_battery_voltageHysteresis" type="number" step="1" class="form-control form-control-outline p-1" style="width:30%;max-width:30%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
										<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>V</small></span>
									</div>
									<div class="mt-2 d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $lang["bs_system_setup"]["batteries_other_discharge_current"] ?></small></span>
										<input id="other_battery_dischargeCurrent" type="number" step="0.1" class="form-control form-control-outline p-1" style="width:30%;max-width:30%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
										<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>A</small></span>
									</div>
								</div>

							</div>
						</div>

					</div>



					<!-- System Mode -->
					<div id="sysmode" class="col-lg-6 col-xl-4 pt-5">

						<h1 class="card-header bg-transparent border-0"><?php echo $lang["bs_system_setup"]["sysmode"]; ?></h1>

						<div class="card elevate-1 h-100">
							<div class="card-body border-bottom">
								<label for="sysmode_mode"><?php echo $lang["bs_system_setup"]["sysmode"]; ?></label>
								<select id="sysmode_mode" class="form-control form-control-outline">
									<option value="0"><?php echo $lang["dict_bs_sysmode"]["0"]; ?></option>
									<option value="1"><?php echo $lang["dict_bs_sysmode"]["1"]; ?></option>
									<option value="2"><?php echo $lang["dict_bs_sysmode"]["2"]; ?></option>
									<option value="3"><?php echo $lang["dict_bs_sysmode"]["3"]; ?></option>
								</select>
							</div>
							<div id="sysmode_cutpeak_section" class="card-body border-bottom" style="display:none">
								<p class="mb-3"><?php echo $lang["bs_system_setup"]["sysmode_cut_power_peak"]; ?></p>
								<div class="form-row mt-2">
									<label for="sysmode_cutpeak_max" class="col-6 col-form-label col-form-label-sm"><?php echo $lang["bs_system_setup"]["sysmode_max_power"]; ?></label>
									<div class="col-6">
										<div class="input-group input-group-sm">
											<input id="sysmode_cutpeak_max" class="form-control form-control-outline" type="number" step="1" min="0">
											<div class="input-group-append"><span class="input-group-text">W</span></div>
										</div>
									</div>
								</div>
								<div class="form-row mt-2">
									<label for="sysmode_cutpeak_hyst" class="col-6 col-form-label col-form-label-sm"><?php echo $lang["bs_system_setup"]["sysmode_max_power_hysteresis"]; ?></label>
									<div class="col-6">
										<div class="input-group input-group-sm">
											<input id="sysmode_cutpeak_hyst" class="form-control form-control-outline" type="number" step="1" min="0">
											<div class="input-group-append"><span class="input-group-text">W</span></div>
										</div>
									</div>
								</div>
								<div class="form-row mt-2">
									<label for="sysmode_cutpeak_target" class="col-6 col-form-label col-form-label-sm"><?php echo $lang["bs_system_setup"]["sysmode_power_target"]; ?></label>
									<div class="col-6">
										<div class="input-group input-group-sm">
											<input id="sysmode_cutpeak_target" class="form-control form-control-outline" type="text" disabled>
											<div class="input-group-append"><span class="input-group-text">W</span></div>
										</div>
									</div>
								</div>
							</div>
							<div class="card-body border-bottom">
								<label for="sysmode_eco"><?php echo $lang["bs_system_setup"]["sysmode_auto_eco_mode"]; ?></label>
								<select id="sysmode_eco" class="form-control form-control-outline">
									<option value="0"><?php echo $lang["common"]["off"]; ?></option>
									<option value="1">ECO 1</option>
									<option value="3">ECO 3</option>
								</select>
							</div>
							<div class="card-body border-bottom">
								<label for="sysmode_pfc"><?php echo $lang["bs_system_setup"]["sysmode_auto_pfc_off"]; ?></label>
								<select id="sysmode_pfc" class="form-control form-control-outline">
									<option value="1"><?php echo $lang["common"]["yes"]; ?></option>
									<option value="0"><?php echo $lang["common"]["no"]; ?></option>
								</select>
							</div>
							<div class="card-body p-2">
								<button id="btnGenerator" type="button" class="btn btn-custom btn-block ripple p-2" data-toggle="modal" data-target="#modalGenerator"><small><b><?php echo $lang["bs_system_setup"]["generator_setup"] ?></b></small></button>
							</div>
						</div>

					</div>



					<!-- Modbus Connection -->
					<div id="modbus_connection" class="col-lg-6 col-xl-4 pt-5">

						<h1 class="card-header bg-transparent border-0"><?php echo $lang["bs_system_setup"]["modbus_connection"]; ?></h1>

						<div class="card elevate-1 h-100">
							<div class="card-body border-bottom">
								<div class="d-flex justify-content-between align-items-center">
									<span class="d-inline-block pr-2"><?php echo $lang["common"]["mode"]; ?></span>
									<select id="modbus_mode" class="form-control-sm form-control form-control-outline w-50">
										<option value="1"><?php echo $lang["common"]["on"]; ?></option>
										<option value="0"><?php echo $lang["common"]["off"]; ?></option>
									</select>
								</div>
								<div class="mt-2 d-flex justify-content-between align-items-center">
									<span class="d-inline-block pr-2"><?php echo $lang["bs_system_setup"]["modbus_baud_rate"]; ?></span>
									<select id="modbus_baudrate" class="form-control-sm form-control form-control-outline w-50">
										<option value="2400">2400</option>
										<option value="4800">4800</option>
										<option value="9600">9600</option>
										<option value="19200">19200</option>
										<option value="38400">38400</option>
										<option value="115200">115200</option>
									</select>
								</div>
								<div class="mt-2 d-flex justify-content-between align-items-center">
									<span class="d-inline-block pr-2"><?php echo $lang["bs_system_setup"]["modbus_parity"]; ?></span>
									<select id="modbus_parity" class="form-control-sm form-control form-control-outline w-50">
										<option value="N">NONE</option>
										<option value="E">EVEN</option>
										<option value="O">ODD</option>
									</select>
								</div>
								<div class="mt-2 d-flex justify-content-between align-items-center">
									<span class="d-inline-block pr-2"><?php echo $lang["bs_system_setup"]["modbus_stop_bits"]; ?></span>
									<select id="modbus_stopbits" class="form-control-sm form-control form-control-outline w-50">
										<option value="1">1</option>
										<option value="2">2</option>
									</select>
								</div>
							</div>
							<div class="card-body border-bottom">
								<label><?php echo $lang["bs_system_setup"]["modbus_port_name"]; ?></label>
								<input id="modbus_portname" class="form-control form-control-outline" type="text" placeholder="/dev/ttyUSB0">
							</div>
							<div class="card-body">
								<label><?php echo $lang["bs_system_setup"]["modbus_possible_usb_devices"]; ?></label>
								<select id="modbus_portlist" class="form-control form-control-outline"></select>
								<div class="row m-0 p-0 mt-2">
									<div class="col-6 m-0 p-0 pr-1"><button id="modbus_portlist_refresh" type="button" class="btn btn-sm px-3 py-2 btn-block btn-custom border ripple" style="border-color: transparent !important"><b><?php echo $lang["bs_system_setup"]["modbus_refresh_list"]; ?></b></button></div>
									<div class="col-6 m-0 p-0 pl-1"><button id="modbus_portlist_apply" type="button" class="btn btn-sm px-3 py-2 btn-block btn-custom border ripple"><b><?php echo $lang["bs_system_setup"]["modbus_use_selected"]; ?></b></button></div>
								</div>
							</div>
						</div>

					</div>



					<!-- Modbus Devices -->
					<div id="modbus_devices" class="col-lg-6 col-xl-4 pt-5">

						<h1 class="card-header bg-transparent border-0"><?php echo $lang["bs_system_setup"]["modbus_devices"]; ?></h1>

						<div class="card elevate-1 h-100">
							<div class="card-body border-bottom">
								<p class="mb-3"><?php echo $lang["bs_system_setup"]["modbus_devices_ups_input_counter"]; ?></p>
								<div class="form-row mt-2">
									<label for="modbus_input_on" class="col-6 col-form-label col-form-label-sm"><?php echo $lang["bs_system_setup"]["modbus_devices_connected"]; ?></label>
									<div class="col-6"><select id="modbus_input_on" class="form-control form-control-outline form-control-sm"><option value="4"><?php echo $lang["common"]["yes"]; ?></option><option value="0" selected><?php echo $lang["common"]["no"]; ?></option></select></div>
								</div>
								<div class="form-row mt-2">
									<label for="modbus_input_id" class="col-6 col-form-label col-form-label-sm"><?php echo $lang["bs_system_setup"]["modbus_devices_id"] ?></label>
									<div class="col-6"><input id="modbus_input_id" class="form-control form-control-outline form-control-sm" type="number" step="1" min="0"></div>
								</div>
							</div>
							<div class="card-body border-bottom">
								<p class="mb-3"><?php echo $lang["bs_system_setup"]["modbus_devices_ups_output_counter"]; ?></p>
								<div class="form-row mt-2">
									<label for="modbus_output_on" class="col-6 col-form-label col-form-label-sm"><?php echo $lang["bs_system_setup"]["modbus_devices_connected"]; ?></label>
									<div class="col-6"><select id="modbus_output_on" class="form-control form-control-outline form-control-sm"><option value="4"><?php echo $lang["common"]["yes"]; ?></option><option value="0" selected><?php echo $lang["common"]["no"]; ?></option></select></div>
								</div>
								<div class="form-row mt-2">
									<label for="modbus_output_id" class="col-6 col-form-label col-form-label-sm"><?php echo $lang["bs_system_setup"]["modbus_devices_id"] ?></label>
									<div class="col-6"><input id="modbus_output_id" class="form-control form-control-outline form-control-sm" type="number" step="1" min="0"></div>
								</div>
							</div>
							<div class="card-body border-bottom">
								<p class="mb-3"><?php echo $lang["bs_system_setup"]["modbus_devices_grid_counter"]; ?></p>
								<div class="form-row mt-2">
									<label for="modbus_grid_on" class="col-6 col-form-label col-form-label-sm"><?php echo $lang["bs_system_setup"]["modbus_devices_connected"]; ?></label>
									<div class="col-6"><select id="modbus_grid_on" class="form-control form-control-outline form-control-sm"><option value="4"><?php echo $lang["common"]["yes"]; ?></option><option value="0" selected><?php echo $lang["common"]["no"]; ?></option></select></div>
								</div>
								<div class="form-row mt-2">
									<label for="modbus_grid_id" class="col-6 col-form-label col-form-label-sm"><?php echo $lang["bs_system_setup"]["modbus_devices_id"] ?></label>
									<div class="col-6"><input id="modbus_grid_id" class="form-control form-control-outline form-control-sm" type="number" step="1" min="0"></div>
								</div>
							</div>
							<div class="card-body">
								<p class="mb-3"><?php echo $lang["bs_system_setup"]["modbus_devices_external_solar_counter"]; ?></p>
								<div class="form-row mt-2">
									<label for="modbus_extsol_on" class="col-6 col-form-label col-form-label-sm"><?php echo $lang["bs_system_setup"]["modbus_devices_connected"]; ?></label>
									<div class="col-6"><select id="modbus_extsol_on" class="form-control form-control-outline form-control-sm"><option value="4"><?php echo $lang["common"]["yes"]; ?></option><option value="0" selected><?php echo $lang["common"]["no"]; ?></option></select></div>
								</div>
								<div class="form-row mt-2">
									<label for="modbus_extsol_id" class="col-6 col-form-label col-form-label-sm"><?php echo $lang["bs_system_setup"]["modbus_devices_id"] ?></label>
									<div class="col-6"><input id="modbus_extsol_id" class="form-control form-control-outline form-control-sm" type="number" step="1" min="0"></div>
								</div>
							</div>
						</div>

					</div>



				</div>
				
				<div class="text-center">
					<div class="setting-progress pt-4 mt-5 d-none">
						<div class="d-flex align-items-center justify-content-center">
							<div id="notif" class="loading d-block"></div>
							<span id="message"><?php echo $lang["bs_system_setup"]["msg_setting_parameters"]; ?></span>
						</div>
					</div>
				</div>

				<input id="installation_date" type="hidden" value="<?php echo date("Y-m-d"); ?>">

			</form>
		</div>



		<script src="js/dist/bundle.js?v=<?php echo $versionHash ?>"></script>
		<script src="js/common.js?v=<?php echo $versionHash ?>"></script>
		<script>const lang = <?php echo json_encode($lang) ?>;</script>
		<script>const apikey = <?php echo json_encode($apikey) ?>;</script>
		<script src="js/system_setup.js?v=<?php echo $versionHash ?>"></script>



	</body>

</html>
