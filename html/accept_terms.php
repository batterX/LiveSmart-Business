<?php

/*
	Accept Terms
*/

// Include Base
include_once "common/base.php";
// Set Step
$step = 7;

// Disable Back Button
if(!isset($_SESSION["last_step"])) header("location: index.php");
if($_SESSION["last_step"] != $step && $_SESSION["last_step"] != $step - 1)
	header("location: " . (isset($_SESSION["back_url"]) ? $_SESSION["back_url"] : "index.php"));
$_SESSION["back_url" ] = $_SERVER["REQUEST_URI"];
$_SESSION["last_step"] = $step;

// Get Installer Country
$installerCountry = isset($_SESSION["installer_country"]) ? $_SESSION["installer_country"] : "";

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
		<link rel="stylesheet" href="css/accept_terms.css?v=<?php echo $versionHash ?>">

	</head>

	<body>





		<!-- Progress Bar -->
		<div id="progress" class="shadow-lg d-print-none">
			<div><div class="progress"><div class="progress-bar progress-bar-striped bg-success progress-bar-animated"></div></div></div>
			<div><button id="btn_next" class="btn btn-success ripple" disabled><?php echo $lang["btn"]["continue"]; ?></button></div>
		</div>
		<!-- Progress Bar -->





		<div class="container pb-5">



			<?php if($_SESSION["lang"] == "de"): ?>



				<h1>Garantiebedingungen von batterX Business / h / VIS</h1>

				<p class="text-center mb-5">für batterX Business, liveX, h-Serie und VIS on-grid-Inverter,<br>ausschließlich Batterien (siehe separate Batterie-Garantien),<br>gültig zwischen VISION UPS Systems Sàrl und Vertriebspartnern<br>Version 080220 vom 08. Februar 2020</p>

				<p>VISION UPS gewährt zusätzlich zu den gesetzlichen Gewährleistungsansprüchen und den Allgemeinen Geschäftsbedingungen eine Garantie nach Maßgabe der folgenden Bedingungen.</p>

				<h2>1. Garantieumfang</h2>
				<p><u>Business-Serie:</u> VISION UPS gewährt eine Standardgarantie von 2 Jahren ab Installationsdatum, jedoch maximal 2,5 Jahren nach Verkauf EXW Beiler (Datum Lieferschein).</p>
				<p><u>h-Serie</u>: VISION UPS gewährt eine Standardgarantie von 2 Jahren ab Installationsdatum, jedoch maximal 2,5 Jahren nach Verkauf EXW Beiler (Datum Lieferschein). Für h3600 und h5000 gilt eine Garantie von 5 Jahren nach Verkauf EXW Beiler (Datum Lieferschein).</p>
				<p><u>VIS-Serie</u>: VISION UPS gewährt eine Standardgarantie von 5 Jahren nach Verkauf EXW Beiler (Datum Lieferschein).</p>

				<p class="mt-5">a) Von VISION UPS erbrachte Garantieleistungen bewirken weder eine Verlängerung der Garantiefrist, noch setzen sie eine neue Garantiefrist in Lauf.</p>
				<p>b) Die Garantie wird in der Form geleistet, dass Teile, die nachweislich trotz sachgemäßer Behandlung und Beachtung der Gebrauchsanweisung, aufgrund von Fabrikations- und/oder Materialfehlern defekt geworden sind, nach Wahl von und bei VISION UPS kostenlos repariert werden. Reparaturen beim Vertriebspartner werden nur in Ausnahmefällen und kostenpflichtig  geleistet. Alternativ hierzu behält VISION UPS sich vor, das reklamierte Gerät gegen ein Ersatzgerät mit vergleichbarem Funktionsumfang auszutauschen. Handbücher, evtl. mitgelieferte Software einschließlich Firmware und Ersatzgeräte sowie Ersatzteile sind von der Garantie ausgeschlossen. Auf Wunsch des Vertriebspartners können im Garantiefall statt einer Reparatur Ersatzteile ab Werk bereitgestellt werden. </p>
				<p>b) Die Kosten für Material und Arbeitszeit zur Reparatur eines Produktes von VISION UPS werden von VISION UPS getragen. </p>
				<p>c) Ersetzte Teile gehen in das Eigentum von VISION UPS über.</p>
				<p>d) VISION UPS ist berechtigt, über die Instandsetzung und den Austausch hinaus, technische Änderungen (z. B. Firmware-Updates) vorzunehmen um das Gerät dem aktuellen Stand der Technik anzupassen. Hierfür entstehen dem Vertriebspartner keine zusätzlichen Kosten. Ein Rechtsanspruch hierauf besteht nicht.</p>

				<h2>2. Voraussetzungen für einen Garantieanspruch</h2>
				<p><i>Für Geräte mit liveX</i>: Ein Garantieanspruch kann nur dann zur Prüfung eingereicht werden, wenn das Gerät über eine Internetverbindung verfügt und ausreichend Analysedaten in der Cloud des Herstellers verfügbar gemacht wurden. Davon kann ausgegangen werden, wenn die Zeit ohne Internetverbindung insgesamt zwei Wochen pro Jahr nicht übersteigt.  </p>
				<p>Weitere Bedingungen sind:</p>
				<p>a. Das System besitzt eine gültige Seriennummer,</p>
				<p>b. <i>Für Business und h-Serie</i>: es wurde nach der Bedienungsanleitung und den gültigen Vorschriften von einem bei VISION UPS geschulten USV-Techniker, welcher im Besitz eines gültigen Schulungszertifikates (nicht älter als 3 Jahre) installiert, betrieben und gewartet.</p>
				<p>c. <i>Für Business-Serie</i>: VISION UPS wurde die ausgefüllte „Check-Liste zur Installation von Systemen der batterX Business-Serie“ mit Unterschrift und Firmenstempel der projektleitenden Firma zugesandt. </p>
				<p>d. es wurde eine regelmäßige Reiningung der Geräte, insbesondere der Ventilatoren, durchgeführt.</p>
				<p>e. es nimmt nicht mehr als 365 Volladezyklen pro Jahr vor.</p>

				<h2>3. Ausschluss der Garantie</h2>
				<p>Jegliche Garantieansprüche sind insbesondere ausgeschlossen,</p>
				<p>f. wenn der Aufkleber mit der Seriennummer vom Gerät entfernt worden ist,</p>
				<p>g. wenn das Gerät durch den Einfluss höherer Gewalt oder durch Vernachlässigung beschädigt oder zertört wurde.</p>
				<p>h. wenn das Gerät durch Umwelteinflüsse, für welche die Schutzklasse IP20 (bzw. IP65 für h3600 und h5000) des Gerätes nicht geeignet ist (Feuchtigkeit, Blitzschlag, Staub, Feuer, korrodierendes Gas, Witterungsverhältnisse), beschädigt oder zerstört wurde,</p>
				<p>i. wenn das Gerät unter Bedingungen gelagert oder betrieben wurde, die außerhalb der technischen Spezifikationen in Datenblatt und Bedienungsanleitung liegen,</p>
				<p>j. wenn die Schäden durch unsachgemäße Behandlung – insbesondere durch Nichtbeachtung der Systembeschreibung und der Betriebsanleitung – aufgetreten sind,</p>
				<p>k. wenn das Gerät durch nicht von VISION UPS beauftragte oder durch nicht autorisierte Personen geöffnet, repariert oder modifiziert wurde,</p>
				<p>l. wenn das Gerät mechanische Beschädigungen irgendwelcher Art aufweist, gleichgültig ob diese bei Transport oder danach enstanden sind,</p>
				<p>m. wenn das Gerät öfter als 3 Mal einer Überlast ausgesetzt war.</p>
				<p>n. wenn der das System oder Teile davon mit nicht vom Hersteller authorisierten Komponenten betrieben wurde. </p>
				<p>o. wenn der Garantieanspruch nicht den Garantiebedingungen entsprechend angemeldet worden ist, oder Transportschäden nicht gemäß den Garantiebedingungen angezeigt wurden.</p>
				<p>p. Bei Fehlen der Voraussetzungen aus Punkt 2.</p>

				<h2>3. Abwicklung des Garantieanspruches</h2>
				<p>a) Zeigen sich innerhalb der Garantiezeit Fehler des Gerätes, so sind Garantieansprüche unverzüglich, spätestens jedoch innerhalb von vierzehn Kalendertagen mittels offiziellem batterX-Fehlerbericht an die E-Mail-Adresse <a href="mailto:info@visionups.com">info@visionups.com</a> geltend zu machen. VISION UPS kann die Garantieabwicklung verweigern, wenn die Fehlerbeschreibung des Vertriebspartners keine Anhaltspunkte für das Vorliegen eines Garantiefalles ergibt.</p>
				<p>b) VISION UPS Systems Sàrl stellt bei Anerkennung des Garantiefalles Ersatzteile oder ein Austauschgerät ab Werk zur Verfügung. Im Zweifelsfall kann der Vertriebspartner das Gerät zur Prüfung an VISION UPS senden. </p>
				<p>c) Der Vertriebspartner hat das Gerät vor der Versendung zu VISION UPS oder seiner Servicepartner transportsicher zu verpacken. Die von VISION UPS mitgeteilte Warenrücksendegenehmigung (RMA) ist deutlich sichtbar außen auf der Transportverpackung anzubringen. Auf Verlangen ist VISION UPS das Rechnungsoriginal vorzulegen.</p>
				<p>d) Der Transport zu VISION UPS oder einem seiner Servicepartner geschieht auf eigene Gefahr und Kosten. VISION UPS stellt Ersatzteile bzw. ein Ersatzgeräte ab Werk kostenlos zur Verfügung.</p>
				<p>Kommt es auf dem Transport von VISION UPS zum Vertriebspartner zu einem Transportschaden, der äußerlich erkennbar ist, muss die Ware unter Vorbehalt angenommen und der Transportschaden auf dem Abliefernachweis vermerkt werden. Die Annahme kann auch verweigert werden. In beiden Fällen ist dies unverzüglich gegenüber dem mit dem Transport beauftragten Unternehmen und gegenüber VISION UPS anzuzeigen. Äußerlich nicht erkennbare Schäden sind unverzüglich nach Entdeckung, spätestens jedoch innerhalb von drei Tagen nach Anlieferung, schriftlich gegenüber dem Transportunternehmen und VISION UPS mitzuteilen. Für Transportschäden, die im Rahmen der Erstauslieferung von VISION-UPS-Produkten durch den Fachhandel auftreten, übernimmt VISION UPS keine Haftung.</p>
				<p>e) Im Lieferumfang des Austauschgerätes ist grundsätzlich kein Zubehör enthalten.</p>

				<h2>4. Nicht angemeldete Retouren</h2>
				<p>VISION UPS behält sich vor, nicht angemeldete und authorisierte Retouren abzulehnen. Auch im Fall einer Annahme der Retoure muß mit einer längeren Bearbeitungszeit gerechnet werden.</p>

				<h2>5. Datensicherung</h2>
				<p>Es obliegt dem Vertriebspartner, von ihm auf das Gerät aufgespielte oder dort gespeicherte Software und/oder Daten, insbesondere die Konfiguration des Geräts, zu sichern. VISION UPS ist berechtigt, die Konfiguration des vom Vertriebspartner eingesandten Geräts zu löschen und/oder dieses Gerät oder ein Austauschgerät mit einer anderen Version der Firmware zurückzusenden. Für Schäden, die durch Datenverluste, durch einen Gerätetausch oder durch das Aufspielen einer anderen Version der Firmware im Rahmen der Garantieabwicklung entstehen, übernimmt VISION UPS keine Haftung. Der Vertriebspartner hat keinen Anspruch auf Wiederherstellung seiner hard- oder softwareseitigen Konfiguration.</p>

				<h2>7. Bedienungsfehler</h2>
				<p>Stellt sich heraus, dass die gemeldete Fehlfunktion des Gerätes offensichtlich durch Fremd-Hardware, Fremd-Software, Installation oder Bedienung verursacht wurde oder stellt sich die Fehlerbeschreibung des Vertriebspartners als offensichtlich irreführend heraus, behält VISION UPS sich vor, den entstandenen Aufwand dem Vertriebspartner zu berechnen.</p>

				<h2>8. Ergänzende Regelungen</h2>
				<p>a) Durch diese Garantie werden weitergehende Ansprüche, insbesondere solche auf Schadensersatz (Ersatz von entgangenem Gewinn, mittelbaren oder Folgeschäden etc.), Rücktritt oder Minderung, nicht begründet. Gesetzliche Ansprüche, z.B. bei Personenschäden oder Schäden an privat genutzten Sachen nach dem Produkthaftungsgesetz oder in Fällen des Vorsatzes oder der groben Fahrlässig-keit, bleiben unberührt.</p>
				<p>b) Die Garantie wird lediglich dem Vertriebspartner gewährt.</p>
				<p>c) Mit Abschluss des Kaufs erkennt der Vertriebspartner die Garantiebestimmungen sowie die Allgemeinen Geschäftsbedingungen von VISION UPS Systems Sàrl an.</p>
				<p>d) Weitergehende oder andere Ansprüche, insbesondere solche auf Ersatz außerhalb des Gerätes entstandener Schäden sind, sofern eine Haftung nicht zwingend gesetzlich angeordnet ist, ausgeschlossen.</p>
				<p>e) Die Garantiebedingungen gelten jeweils in der Version, welche aktuell auf der Webseite von VISION UPS Systems Sàrl (www.visionups.com) hinterlegt bzw. verlinkt ist. </p>
				<p>f) Auf diese Garantie findet das Recht des Großherzogtums Luxemburg Anwendung. </p>
			


			<?php else: ?>



				<h1>Warranty conditions of batterX Business / h / VIS</h1>

				<p class="text-center mb-5">for batterX UPS, „HCC“ MPPT controllers, liveX, h series hybrid inverters and VIS series on-grid inverters, excluding batteries (see separate battery warranty), valid between VISION UPS Systems Sàrl and Distributors.<br>Version 080220 of February 08, 2020</p>

				<p>In addition to the General Terms and Conditions, VISION UPS grants a warranty in accordance with the following conditions. The warranty is non-transferable and limited to the Distributor.</p>

				<h2>1. Warranty scope</h2>
				<p><u>batterX Business</u>: 2 years from the date of installation, but no longer than 2.5 years after sales EXW Beiler (date of shipment).</p>
				<p><u>batterX h series</u>: 2 years from the date of installation, but no longer than 2.5 years after sales EXW Beiler (date of shipment). For h3600 and h5000 the warranty time is 5 years after sale EXW Beiler (date of shipment).</p>
				<p><u>batterX VIS series</u>: 5 years after sales EXW Beiler (date of shipment).</p>

				<p class="mt-5">a) Warranty services provided by VISION UPS do not extend the warranty period, nor initiate a new warranty period.</p>
				<p>b) The warranty is provided in the form that parts which are demonstrably defective due to manufacturing and/or material defects despite proper handling and observance of the instructions for use shall be repaired free of charge at VISION UPS's discretion. Repairs on-site are only carried out in exceptional cases and are subject to a charge. Alternatively, VISION UPS reserves the right to replace the device complained of with a replacement device with a comparable range of functions. Manuals, any software supplied with the product including firmware and replacement devices as well as spare parts are excluded from the warranty. </p>
				<p>b) The cost of materials used to repair a product shall be borne by VISION UPS.</p>
				<p>c) Replaced parts become the property of VISION UPS.</p>
				<p>d) VISION UPS is entitled to make technical changes (e.g. firmware updates) beyond repair and replacement in order to adapt the device to the current state of the art. The sales partner does not incur any additional costs for this. A legal claim to this does not exist.</p>

				<h2>2. Requirements for a warranty claim</h2>
				<p><i>For systems using liveX</i>: A warranty claim can only be submitted for review if the device has an Internet connection and sufficient analysis data has been made available in the manufacturer's cloud. This can be assumed if the time without an Internet connection does not exceed a total of two weeks per year.</p>
				<p>Other terms are:</p>
				<p>a) The system has a valid serial number,</p>
				<p>b) <i>For Business and h series</i>: it has been installed, operated and maintained in accordance with the operating instructions and applicable regulations by an engineer who was trained by VISION UPS and has a valid training certificate (not older than three years).</p>
				<p>c) <i>For Business series</i>: VISION UPS has received the completed "Check List for the Installation of batterX Business Series Systems" with signature and company stamp of the project managing company.</p>
				<p>d) regular cleaning of the system components, especially the fans has been carried out.</p>
				<p>e) it does not perform more than 365 full charge cycles per year.</p>

				<h2>3. Exclusion of warranty</h2>
				<p>Any warranty claims are particularly excluded, if</p>
				<p>a. the serial number label has been removed from the unit, </p>
				<p>b. the device has been damaged or destroyed by force majeure or neglect.</p>
				<p>c. the device has been damaged or destroyed by environmental influences for which the protection class IP20 (IP65 for h3600 and h5000) of the device is not suitable (moisture, lightning, dust, fire, corrosive gas, weather conditions),</p>
				<p>d. the device has been stored or operated under conditions that are outside the technical specifications in the data sheet and operating instructions, </p>
				<p>e. the damage has occurred due to improper handling - in particular due to non-observance of the system description and the operating instructions,</p>
				<p>f. the device has been opened, repaired or modified by persons not authorized by VISION UPS or by unauthorized persons, </p>
				<p>g. the device shows mechanical damage of any kind, regardless of whether it was caused during or after transportation,</p>
				<p>h. <i>For Business and h series</i>: there has occured an overload of the UPS/hybrid inverter for more than three times. </p>
				<p>i. the system has been operated with batteries or other system components not sold by Vision UPS Systems Sarl for this system, or with components not authorized by the manufacturer. </p>
				<p>j. the warranty claim has not been notified in accordance with the warranty conditions, or if transport damage has not been notified in accordance with the warranty conditions </p>
				<p>k. In the absence of the conditions set out in point 2.</p>

				<h2>5. Processing of warranty claims</h2>
				<p>a) If defects of the device become apparent within the warranty period, warranty claims must be asserted immediately, but at the latest within fourteen calendar days, by means of an official batterX error report sent to the e-mail address <a href="mailto:info@visionups.com">info@visionups.com</a>. VISION UPS may refuse to process a warranty claim if the description of the fault by the Distributor does not provide any indication of a warranty claim.</p>
				<p>b) VISION UPS Systems Sàrl will provide spare parts or a replacement unit ex works upon acceptance of the warranty claim. In case of doubt, the distributor may send the defective device to VISION UPS for inspection.</p>
				<p>c) The sales partner must pack the device securely for transportation before it is shipped to VISION UPS or its service partners. The Return Material Authorization (RMA) notified by VISION UPS must be clearly visible on the outside of the transport packaging. The original invoice must be presented to VISION UPS upon request.</p>
				<p>d) Transportation to VISION UPS or one of its service partners is at your own risk and expense. VISION UPS provides spare parts or a replacement device ex works free of charge.</p>
				<p>If the transportation from  VISION UPS to the distribution partner is result of a transport damage that is externally recognizable, the goods must be accepted with reservation and the transport damage noted on the proof of delivery. Acceptance may also be refused. In both cases, this must be reported immediately to the company commissioned with the transportation and to VISION UPS. Externally undetectable damage must be reported in writing to the transport company and VISION UPS immediately after discovery, at the latest within three days of delivery. VISION UPS is not liable for transport damages that occur during the initial delivery of VISION UPS products by the retailer.. </p>
				<p>e) The scope of delivery of the exchange unit does not include any accessories.</p>

				<h2>6. Non-registered returns</h2>
				<p>In case of unauthorized return VISION UPS may refuse the processing of the claim. A longer processing time must also be expected if the return is accepted.</p>

				<h2>7. Data Backup</h2>
				<p>It is the Distributor's responsibility to back up any software and/or data, in particular the configuration of the Device, that he has installed on or stored on the Device. VISION UPS may delete the configuration of the Device submitted by Distributor and/or return the Device or a replacement Device with a different version of the firmware. VISION UPS shall not be liable for any damage resulting from loss of data, replacement of equipment, or installation of any other version of the firmware under warranty. The Sales parter is not entitled has no right to restore its hardware or software configuration.</p>

				<h2>8. Operating error</h2>
				<p>In case when the reported malfunction of the device was obviously caused by third-party hardware, third-party software, installation or operation, or if the description of the fault by the sales partner turns out to be obviously misleading, VISION UPS reserves the right to charge the sales partner for the expenses incurred.</p>

				<h2>9. Supplementary regulations</h2>
				<p>a) Further claims, in particular claims for damages (compensation for loss of profit, indirect or consequential damages, etc.), rescission or loss of profit, indirect or consequential damages, etc.), rescission or reduction, not substantiated. Legal claims, e.g. in the case of personal injury or damage to privately used items under the Product Liability Act or in cases of intent or gross negligence, shall remain unaffected.</p>
				<p>b) The guarantee is only granted to the sales partner of VISION UPS.</p>
				<p>c) By concluding the purchase, the Distributor acknowledges the warranty conditions and the General Terms and Conditions of VISION UPS Systems Sàrl.</p>
				<p>d) Further or other claims, in particular claims for compensation for damages incurred outside the device, are excluded unless liability is mandatory by law.</p>
				<p>e) The warranty conditions apply in the version currently posted or linked on the VISION UPS Systems Sàrl website www.visionups.com. </p>
				<p>f) This warranty shall be governed by the laws of the Grand Duchy of Luxembourg.</p>



			<?php endif; ?>



		</div>





		<div class="d-print-none">
			
			<div class="divider"><hr></div>

			<div id="confirm" class="container py-5">
				<div class="custom-control custom-checkbox py-2">
					<input type="checkbox" class="custom-control-input" id="checkboxAccept">
					<?php if($_SESSION["lang"] == "de"): ?>
						<label class="custom-control-label" for="checkboxAccept">Ich bestätige, dass ich alle <a href="#">Garantiebestimmungen</a> sowie <a href="https://www.iubenda.com/privacy-policy/13455058" target="_blank">Datenschutz</a> und <a href="https://www.iubenda.com/privacy-policy/gdpr/13455058/cookie-policy" target="_blank">Cookie-Richtlinien</a> gelesen und sie vollständig verstanden und akzeptiert habe.</label>
					<?php else: ?>
						<label class="custom-control-label" for="checkboxAccept">I confirm that I have read all <a href="#">warranty conditions</a> as well as <a href="https://www.iubenda.com/privacy-policy/13455058" target="_blank">privacy</a> and <a href="https://www.iubenda.com/privacy-policy/gdpr/13455058/cookie-policy" target="_blank">cookie policies</a> and that I fully understand and accept them.</label>
					<?php endif; ?>
				</div>
			</div>

		</div>





		<script src="js/dist/bundle.js?v=<?php echo $versionHash ?>"></script>
		<script src="js/common.js?v=<?php echo $versionHash ?>"></script>
		<script>const lang = <?php echo json_encode($lang) ?>;</script>
		<script src="js/accept_terms.js?v=<?php echo $versionHash ?>"></script>





	</body>

</html>
