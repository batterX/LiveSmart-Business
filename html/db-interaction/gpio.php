<?php

if(isset($_POST['btn1'])) 
{
	$db = new PDO('sqlite:/srv/bx/ram/currentC.db3');
	$state = $_POST['btn1'];
	$sql = "INSERT INTO `CommandsIn` (`type`, `entity`, `text1`, `text2`) VALUES(20736, 0, '1', '" . $state . "')";
	try {
		$stmt = $db->prepare($sql);
		$stmt->execute();
		if($stmt->rowCount() == 1)
			echo TRUE;
		$stmt->closeCursor();
	} catch(PDOException $e) {}
} 
else if(isset($_POST['btn2'])) 
{
	$db = new PDO('sqlite:/srv/bx/ram/currentC.db3');
	$state = $_POST['btn2'];
	$sql = "INSERT INTO `CommandsIn` (`type`, `entity`, `text1`, `text2`) VALUES(20736, 0, '2', '" . $state . "')";
	try {
		$stmt = $db->prepare($sql);
		$stmt->execute();
		if($stmt->rowCount() == 1)
			echo TRUE;
		$stmt->closeCursor();
	} catch(PDOException $e) {}
} 
else if(isset($_POST['btn3'])) 
{
	$db = new PDO('sqlite:/srv/bx/ram/currentC.db3');
	$state = $_POST['btn3'];
	$sql = "INSERT INTO `CommandsIn` (`type`, `entity`, `text1`, `text2`) VALUES(20736, 0, '3', '" . $state . "')";
	try {
		$stmt = $db->prepare($sql);
		$stmt->execute();
		if($stmt->rowCount() == 1)
			echo TRUE;
		$stmt->closeCursor();
	} catch(PDOException $e) {}
} 
else if(isset($_POST['btn4'])) 
{
	$db = new PDO('sqlite:/srv/bx/ram/currentC.db3');
	$state = $_POST['btn4'];
	$sql = "INSERT INTO `CommandsIn` (`type`, `entity`, `text1`, `text2`) VALUES(20736, 0, '4', '" . $state . "')";
	try {
		$stmt = $db->prepare($sql);
		$stmt->execute();
		if($stmt->rowCount() == 1)
			echo TRUE;
		$stmt->closeCursor();
	} catch(PDOException $e) {}
}
