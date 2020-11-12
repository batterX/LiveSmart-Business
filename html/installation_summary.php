<?php

/*
	Installation Summary
*/

// Include Base
include_once "common/base.php";
// Set Step
$step = 8;

// Disable Back Button
if(!isset($_SESSION["last_step"])) header("location: index.php");
if($_SESSION["last_step"] != $step && $_SESSION["last_step"] != $step - 1)
	header("location: " . (isset($_SESSION["back_url"]) ? $_SESSION["back_url"] : "index.php"));
$_SESSION["back_url" ] = $_SERVER["REQUEST_URI"];
$_SESSION["last_step"] = $step;

// Define Arrays
$arrayGender       = $lang["dict_gender"   ];
$arrayCountry      = $lang["dict_countries"];

// Get Battery Type
$batteryType = isset($_SESSION["battery_type"]) ? $_SESSION["battery_type"] : "";
if($batteryType == "other" && $_SESSION["battery_capacity"] == "0") $batteryType = "";

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
		<link rel="stylesheet" href="css/installation_summary.css?v=<?php echo $versionHash ?>">

	</head>

	<body>





		<!-- Progress Bar -->
		<div id="progress" class="shadow-lg">
			<div><div class="progress"><div class="progress-bar progress-bar-striped bg-success progress-bar-animated"></div></div></div>
		</div>
		<!-- Progress Bar -->





		<div id="summary" class="mt-5 mx-auto">

			<div class="head border box-margin">
				<div class="title br">
					<span><?php echo $lang["bs_summary"]["installation_summary"]; ?></span>
				</div>
				<div class="logo">
					<img src="img/batterx_logo.png">
				</div>
			</div>

			<div class="installation-date border box-margin">
				<div class="box-row bb">
					<span class="br"><?php echo $lang["bs_summary"]["installation_date"]; ?></span>
					<span><?php echo $_SESSION["installation_date"]; ?></span>
				</div>
				<div class="box-row">
					<span class="br"><?php echo $lang["bs_summary"]["latest_maintenance"]; ?></span>
					<span><?php echo date("Y-m-d"); ?></span>
				</div>
			</div>
			
			<div class="installer-info border box-margin">
				<div class="box-head">
					<span><?php echo $lang["bs_summary"]["installer"]; ?></span>
				</div>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["common"]["name"]; ?></span>
					<span><?php echo $arrayGender[$_SESSION["installer_gender"]] . " " . $_SESSION["installer_firstname"] . " " . $_SESSION["installer_lastname"]; ?></span>
				</div>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["common"]["company"]; ?></span>
					<span><?php echo $_SESSION["installer_company"]; ?></span>
				</div>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["common"]["email"]; ?></span>
					<span><?php echo $_SESSION["installer_email"]; ?></span>
				</div>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["common"]["telephone"]; ?></span>
					<span><?php echo $_SESSION["installer_telephone"]; ?></span>
				</div>
				<?php if(!empty($_SESSION["note"])): ?>
					<div class="box-row bt">
						<span class="br"><?php echo $lang["bs_summary"]["installer_memo"]; ?></span>
						<span style="white-space: pre-wrap"><?php echo $_SESSION["note"]; ?></span>
					</div>
				<?php endif; ?>
			</div>
			
			<div class="customer-info border box-margin">
				<div class="box-head">
					<span><?php echo $lang["bs_summary"]["customer"]; ?></span>
				</div>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["common"]["name"]; ?></span>
					<span><?php echo $arrayGender[$_SESSION["customer_gender"]] . " " . $_SESSION["customer_firstname"] . " " . $_SESSION["customer_lastname"]; ?></span>
				</div>
				<?php if(!empty($_SESSION["customer_company"])): ?>
					<div class="box-row bt">
						<span class="br"><?php echo $lang["common"]["company"]; ?></span>
						<span><?php echo $_SESSION["customer_company"]; ?></span>
					</div>
				<?php endif; ?>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["common"]["email"]; ?></span>
					<span><?php echo $_SESSION["customer_email"]; ?></span>
				</div>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["common"]["telephone"]; ?></span>
					<span><?php echo $_SESSION["customer_telephone"]; ?></span>
				</div>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["common"]["address"]; ?></span>
					<span><?php echo $_SESSION["customer_address"] . "<br>" . $_SESSION["customer_zipcode"] . " " . $_SESSION["customer_city"] . ", " . $arrayCountry[$_SESSION["customer_country"]]; ?></span>
				</div>
			</div>

			<div class="system-info border box-margin">
                <div class="box-head">
					<span><?php echo $lang["bs_summary"]["installation"]; ?></span>
				</div>
                <div class="box-row bt">
					<span class="br"><?php echo $lang["bs_summary"]["installation_sn_ups"]; ?></span>
					<span><?php echo $_SESSION["device_serial"]; ?></b></span>
				</div>
                <div class="box-row bt">
					<span class="br"><?php echo $lang["bs_summary"]["installation_nominal_power"]; ?></span>
					<span><?php echo round(intval($_SESSION["device_power"]) / 1000, 2); ?> kVA / <?php echo round(intval($_SESSION["device_power"]) / 1000 * 0.9, 2); ?> kW</span>
				</div>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["bs_summary"]["installation_power_factor"]; ?></span>
					<span>0.9</span>
				</div>
                <div class="box-row bt">
					<span class="br"><?php echo $lang["bs_summary"]["installation_sn_livex"]; ?></span>
					<span><?php echo $_SESSION["box_serial"] . " (" . $_SESSION["software_version"] . ")"; ?></span>
				</div>
                <?php if($batteryType == "lifepo"): ?>
                    <div class="box-row bt">
						<span class="br"><?php echo $lang["bs_summary"]["installation_bms"]; ?></span>
						<span>
                            <?php
                                $finalStr = "";
                                if(isset($_SESSION["battery_bms_master"]))
                                    $finalStr .= $_SESSION["battery_bms_master"];
                                if(isset($_SESSION["battery_bms_slave" ])) {
                                    $tempArr = explode(",", $_SESSION["battery_bms_slave"]);
                                    for($i = 1; $i < count($tempArr); $i += 2)
                                        $finalStr .= "<br>" . $tempArr[$i-1] . ", " . $tempArr[$i];
                                }
                                echo $finalStr;
                            ?>
                        </span>
					</div>
                    <div class="box-row bt">
						<span class="br"><?php echo $lang["bs_summary"]["installation_batteries"]; ?></span>
						<span>
                            <?php
                                $finalStr = "";
                                if(isset($_SESSION["battery_serialnumbers"])) {
                                    $tempArr = explode(",", $_SESSION["battery_serialnumbers"]);
									sort($tempArr);
                                    $tempArrFinal = [];
									for($i = 0; $i < count($tempArr); $i++) {
										if($i == 0) { // At Start
                                            $tempArrFinal[] = $tempArr[$i];
                                        } else if($i == count($tempArr) - 1) {
											$tempNumToCompare = intval(substr($tempArr[$i], 7));
                                            if($tempLastNum + 1 != $tempNumToCompare) {
												if(substr($tempArrFinal[count($tempArrFinal) - 1], -3) != substr($tempLastNum, -3))
	                                                $tempArrFinal[count($tempArrFinal) - 1] .= "-" . substr($tempLastNum, -3);
                                                $tempArrFinal[] = $tempArr[$i];
											} else {
												$tempArrFinal[count($tempArrFinal) - 1] .= "-" . substr($tempArr[$i], -3);
											}
										} else {
                                            $tempNumToCompare = intval(substr($tempArr[$i], 7));
                                            if($tempLastNum + 1 != $tempNumToCompare) {
												if(substr($tempArrFinal[count($tempArrFinal) - 1], -3) != substr($tempLastNum, -3))
	                                                $tempArrFinal[count($tempArrFinal) - 1] .= "-" . substr($tempLastNum, -3);
                                                $tempArrFinal[] = $tempArr[$i];
                                            }
                                        }
                                        $tempLastNum = intval(substr($tempArr[$i], 7));
									}
                                    $finalStr .= implode("<br>", $tempArrFinal);
                                }
                                echo $finalStr;
                            ?>
                        </span>
					</div>
                <?php elseif($batteryType == "carbon"): ?>
                    <div class="box-row bt">
						<span class="br"><?php echo $lang["bs_summary"]["installation_batteries"]; ?></span>
						<span><?php echo (intval($_SESSION["battery_strings"]) * 60) . "x " . $_SESSION["battery_model"] . " (" . $_SESSION["battery_capacity"] . " Wh)"; ?></span>
					</div>
                <?php elseif($batteryType == "other"): ?>
                    <div class="box-row bt">
						<span class="br"><?php echo $lang["bs_summary"]["installation_batteries"]; ?></span>
						<span><?php echo $_SESSION["battery_capacity"] . " Wh"; ?></span>
					</div>
                <?php endif; ?>
                <div class="box-row bt">
					<span class="br"><?php echo $lang["bs_summary"]["installation_solar_controllers"]; ?></span>
					<span>
                        <?php
                            if(isset($_SESSION["solar_c1_serial"])) echo     "" . $_SESSION["solar_c1_serial"] . " (" . (isset($_SESSION["solar_c1_power"]) ? $_SESSION["solar_c1_power"] . " Wp" : "") . ")";
                            if(isset($_SESSION["solar_c2_serial"])) echo "<br>" . $_SESSION["solar_c2_serial"] . " (" . (isset($_SESSION["solar_c2_power"]) ? $_SESSION["solar_c2_power"] . " Wp" : "") . ")";
                            if(isset($_SESSION["solar_c3_serial"])) echo "<br>" . $_SESSION["solar_c3_serial"] . " (" . (isset($_SESSION["solar_c3_power"]) ? $_SESSION["solar_c3_power"] . " Wp" : "") . ")";
                            if(isset($_SESSION["solar_c4_serial"])) echo "<br>" . $_SESSION["solar_c4_serial"] . " (" . (isset($_SESSION["solar_c4_power"]) ? $_SESSION["solar_c4_power"] . " Wp" : "") . ")";
                            if(isset($_SESSION["solar_c5_serial"])) echo "<br>" . $_SESSION["solar_c5_serial"] . " (" . (isset($_SESSION["solar_c5_power"]) ? $_SESSION["solar_c5_power"] . " Wp" : "") . ")";
                            if(isset($_SESSION["solar_c6_serial"])) echo "<br>" . $_SESSION["solar_c6_serial"] . " (" . (isset($_SESSION["solar_c6_power"]) ? $_SESSION["solar_c6_power"] . " Wp" : "") . ")";
                            if(isset($_SESSION["solar_c7_serial"])) echo "<br>" . $_SESSION["solar_c7_serial"] . " (" . (isset($_SESSION["solar_c7_power"]) ? $_SESSION["solar_c7_power"] . " Wp" : "") . ")";
                            if(isset($_SESSION["solar_c8_serial"])) echo "<br>" . $_SESSION["solar_c8_serial"] . " (" . (isset($_SESSION["solar_c8_power"]) ? $_SESSION["solar_c8_power"] . " Wp" : "") . ")";
                        ?>
                    </span>
				</div>
                <div class="box-row bt">
					<span class="br"><?php echo $lang["bs_summary"]["installation_solar_size"]; ?></span>
					<span><?php echo $_SESSION["solar_wattPeak"] . " Wp"; ?></span>
				</div>
                <?php if(!empty($_SESSION["solar_info"])): ?>
					<div class="box-row bt">
						<span class="br"><?php echo $lang["bs_summary"]["installation_solar_info"]; ?></span>
						<span style="white-space: pre-wrap"><?php echo $_SESSION["solar_info"]; ?></span>
					</div>
				<?php endif; ?>
                <div class="box-row bt">
					<span class="br"><?php echo $lang["common"]["address"]; ?></span>
					<span><?php echo $_SESSION["installation_address"] . "<br>" . $_SESSION["installation_zipcode"] . " " . $_SESSION["installation_city"] . ", " . $arrayCountry[$_SESSION["installation_country"]]; ?></span>
				</div>
            </div>

			<div id="confirmLoadCorrect" class="installer-accept border d-none">
				<div class="box-row">
					<span class="w-100 text-justify"><?php echo $lang["bs_summary"]["confirm_load_final"]; ?></span>
				</div>
			</div>

		</div>





		<div id="confirm" class="pt-5 pb-3 px-3 mx-auto">
			<div class="custom-control custom-checkbox">
				<input type="checkbox" class="custom-control-input" id="checkboxAccept2">
				<label class="custom-control-label" for="checkboxAccept2"><?php echo $lang["bs_summary"]["confirm_info"]; ?></label>
			</div>
			<div class="custom-control custom-checkbox mt-5">
				<input type="checkbox" class="custom-control-input" id="checkboxAccept1">
				<label class="custom-control-label" for="checkboxAccept1"><?php echo $lang["bs_summary"]["confirm_load"]; ?></label>
			</div>
		</div>

		



		<div id="btnFinish" class="px-3 mx-auto">
			<button id="btnFinishInstallation" class="btn btn-success ripple mb-3 mt-4 px-5 py-3"><?php echo $lang["bs_summary"]["finish_installation"]; ?></button>
		</div>





		<div id="successBox" class="container elevate-1 p-5 my-lg-5" style="display: none">

			<h1 class="text-success"><?php echo $lang["bs_summary"]["final_congratulations"]; ?></h1>

			<p class="mt-2rem"><?php echo $lang["bs_summary"]["final_text1"]; ?></p>

			<p><?php echo $lang["bs_summary"]["final_text2"]; ?></p>

			<p><?php echo $lang["bs_summary"]["final_text3"]; ?></p>

			<p class="mt-2rem"><?php echo $lang["bs_summary"]["final_text4"]; ?>: <br><a href="https://my.batterx.io" target="_blank">my.batterx.io</a></p>

			<p class="mt-2rem"><?php echo $lang["bs_summary"]["final_text5"]; ?></p>

			<button id="btnDownload" class="btn btn-sm btn-success ripple py-2 px-4"><?php echo $lang["bs_summary"]["final_download_pdf"]; ?></button>

			<p class="mt-2rem"><?php echo $lang["bs_summary"]["final_text6"]; ?></p>

			<div class="d-flex align-items-center">
				<button id="btnReboot" class="btn btn-sm btn-primary ripple py-2 px-4"><?php echo $lang["bs_summary"]["final_reboot_livex"]; ?></button>
				<div class="notif ml-3"></div>
			</div>

		</div>





		<input id="lang" type="hidden" value="<?php echo $_SESSION["lang"]; ?>">





		<script src="js/dist/bundle.js?v=<?php echo $versionHash ?>"></script>
		<script src="js/dist/jspdf.js?v=<?php echo $versionHash ?>"></script>
		<script src="js/dist/html2canvas.js?v=<?php echo $versionHash ?>"></script>
		<script src="js/common.js?v=<?php echo $versionHash ?>"></script>
		<script>const lang = <?php echo json_encode($lang); ?>;</script>
		<script>const dataObj = <?php echo json_encode($_SESSION); ?>;</script>
		<script src="js/installation_summary.js?v=<?php echo $versionHash ?>"></script>





	</body>

</html>
