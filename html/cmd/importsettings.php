<?php

session_start();

if(!isset($_POST) || empty($_POST["data"])) exit;

// Get 2D Array
$rows = is_string($_POST["data"]) ? json_decode($_POST["data"]) : $_POST["data"];

// Connect Database
$db = new PDO("sqlite:/srv/bx/usv.db3");

// Get the number of rows provided
$len = count($rows);

// Exit if Empty
if($len < 1) exit;

// Define Variables
$allCorrect = true;
$sqlFields  = (array) [];
$params     = (array) [];

// Data Processing
foreach($rows as $row) {
    // Build Fields & Params
    if(count($row) != 15) { $allCorrect = false; break; }
    $sqlFields[] = "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $params[] = $row[ 0];
    $params[] = $row[ 1];
    $params[] = $row[ 2];
    $params[] = $row[ 3];
    $params[] = $row[ 4];
    $params[] = $row[ 5];
    $params[] = $row[ 6];
    $params[] = $row[ 7];
    $params[] = $row[ 8];
    $params[] = $row[ 9];
    $params[] = $row[10];
    $params[] = $row[11];
    $params[] = $row[12];
    $params[] = $row[13];
    $params[] = $row[14];
}
$sqlFields = implode(", ", $sqlFields);

// Exit if Data Error
if(!$allCorrect) exit;

// Build SQL Query
$sql = "REPLACE INTO `Settings` (`VarName`, `Entity`, `Name`, `InUse`, `Mode`, `V1`, `V2`, `V3`, `V4`, `V5`, `V6`, `S1`, `S2`, `UpDateTime`, `CRC`) VALUES " . $sqlFields;

// Execute SQL
if($stmt = $db->prepare($sql)) {
    $stmt->execute($params);
    $stmt->closeCursor();
} else exit;

// Return
echo "1"; exit;
