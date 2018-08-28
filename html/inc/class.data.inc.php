<?php

/*
	Handles pulling device data from SQLite database
	
	* getDeviceInfo()
	* setDeviceInfo()
	* getDeviceModel()
	* getCurrentState()
	* getEnergyData()
	* getPowerData()
	* getWarningsData()
	
	@author Ivan Gavrilov
*/

class BatterXData
{
	public function __construct() {}
	
	/*
		Queries Data from Device_Info Table
		
		Outputs JSON Object
		
		{
			setting: value,
			...
		}
	*/
	public function getDeviceInfo() 
	{
		// Connect to Database
		$db = new PDO('sqlite:/srv/bx/usv.db3');
				
		$result = $db->query('SELECT `setting`, `value` FROM `device_info`');

		$dbh = new stdClass();

		foreach($result as $row) {
			$setting = (string) $row['setting'];
			$value = (string) $row['value'];
			
			$dbh->$setting = $value;
		}
		
		return json_encode($dbh, JSON_FORCE_OBJECT);
	}
	
	public function setDeviceInfo()
	{
		// Connect to Database
		$db = new PDO('sqlite:/srv/bx/usv.db3');
		
		$sql = "REPLACE INTO `device_info` (`value`, `setting`) VALUES ('" . $_POST['value'] . "', '" . $_POST['setting'] . "')";
		
		try {
			$stmt = $db->prepare($sql);
			$stmt->execute();
			if($stmt->rowCount() == 1)
				return TRUE;
			$stmt->closeCursor();
		} catch(PDOException $e) {}
		
		return FALSE;
	}
	
	public function getDeviceModel()
	{
		// Connect to Database
		$db = new PDO('sqlite:/srv/bx/usv.db3');
		
		$result = $db->query('SELECT `value` FROM `device_info` WHERE `setting`="device_model"');
		
		return $result->fetchColumn();
	}
	
	/*
		Queries Data from CurrentState Table
		
		Outputs JSON Object
		
		{
			type: {
				entity: {
					type: ...,
					entity: ...,
					entityvalue: ...,
					logtime: ...
				},
				...
			},
			...
		}
	*/
	public function getCurrentState() 
	{
		$db = new PDO('sqlite:/srv/bx/ram/currentD.db3');
		
		$result = $db->query('SELECT type, entity, entityvalue, logtime FROM CurrentState');

		$dbh = new stdClass();

		foreach($result as $row) {
			$type = (string) $row['type'];
			$entity = (string) $row['entity'];
			if(!isset($dbh->$type)) 
				$dbh->$type = new stdClass();
			$dbh->$type->$entity = $row;
		}
		
		return json_encode($dbh, JSON_FORCE_OBJECT);
	}
	
	/*
		Queries Data from EnergyData Table
		
		Outputs JSON Array
		
		1, 2, 3, 4, 5, 6, 7, 8, 9, ...
	*/
	public function getEnergyData()
	{
		if(isset($_POST['type']) && isset($_POST['entity'])) {
			// Create Array With IDs (Keys)
			$keys = explode(",", $_POST["type"]);
			// Create Array Full with Zeros (Values)
			$values = array_fill(0, count($keys), 0);
			
			// Build the Array [type: entityvalue, type: entityvalue, ...]
			$resultArray = array_combine($keys, $values);
			
			// Connect to Database
			$db = new PDO('sqlite:/srv/bx/usv.db3');
			
			// Build SQL String
			$sql = "SELECT type, entityvalue FROM EnergyData WHERE entity=" . $_POST['entity'] . " AND type IN(" . implode(',', $keys) . ") LIMIT " . count($keys);
			
			// Fetch All Rows That Exist
			$result = $db->query($sql);
			
			foreach($result as $row) {
				$resultArray[$row["type"]] = $row["entityvalue"];
			}
			
			return implode(',', $resultArray);
		}
		else
			return "0";
	}
	
	/*
		Queries Data from PowerData Table
		
		Outputs JSON Array
		
		1, 2, 3, 4, 5, 6, 7, 8, 9, ...
	*/
	public function getPowerData()
	{
		if(isset($_POST['type']) && isset($_POST['entity'])) {
			// Create Array With IDs (Keys)
			$keys = explode(",", $_POST["type"]);
			// Create Array Full with Zeros (Values)
			$values = array_fill(0, count($keys), 0);
			
			// Build the Array [type: entityvalue, type: entityvalue, ...]
			$resultArray = array_combine($keys, $values);
			
			// Connect to Database
			$db = new PDO('sqlite:/srv/bx/usv.db3');
			
			// Build SQL String
			$sql = "SELECT type, entityvalue FROM PowerData WHERE entity=" . $_POST['entity'] . " AND type IN(" . implode(',', $keys) . ") LIMIT " . count($keys);
			
			// Fetch All Rows That Exist
			$result = $db->query($sql);
			
			foreach($result as $row) {
				$resultArray[$row["type"]] = $row["entityvalue"];
			}
			
			return implode(',', $resultArray);
		}
		else
			return "0";
	}

	/*
		Queries Data from WarningsData Table using 'deviceid'
		
		Outputs JSON Object
	
		[
			{
				id: ...,
				type: ...,
				entity: ...,
				value: ...,
				logtime: ...
			}, 
			...
		]
	*/
	public function getWarningsData() 
	{
		if (isset($_POST['count'])) {
			// Connect to Database
			$db = new PDO('sqlite:/srv/bx/usv.db3');
			
			$result = $db->query("SELECT * FROM (SELECT id, type, entity, entityvalue, logtime FROM WarningsData ORDER BY id DESC LIMIT " . $_POST['count']. ") ORDER BY id ASC");

			$dbh = array();
			
			foreach($result as $r)
				$dbh[] = $r;
			
			return json_encode($dbh);
		}
		else
			return "";
	}
	
	
	
	
	
	
	
	
	
	
	/* Queries Data from CollectedData Table 
		
		Outputs JSON Object
	*/
	public function getCollectedData() 
	{
		if(isset($_POST['id'])) {
			$db = new PDO('sqlite:/srv/bx/usv.db3');
			
			$sql = "SELECT * FROM 'CollectedData' WHERE id >= (SELECT id FROM (SELECT id FROM 'CollectedData' WHERE type=1 ORDER BY id DESC LIMIT 1) ORDER BY id ASC LIMIT 1)";
			
			if($_POST['id'] > 1) 
			{
				$sql = "SELECT * FROM 'CollectedData' WHERE id BETWEEN (
							SELECT id FROM (SELECT id FROM 'CollectedData' WHERE type=1 ORDER BY id DESC LIMIT " . $_POST['id'] . ") ORDER BY id ASC LIMIT 1
						) AND (
							SELECT id FROM (SELECT id FROM 'CollectedData' WHERE type=1 ORDER BY id DESC LIMIT " . ($_POST['id'] - 1) . ") ORDER BY id ASC LIMIT 1
						)";
			}
						
			$result = $db->query($sql);
			
			$dbh = new stdClass();
			
			foreach($result as $row) {
				$type = (string) $row['type'];
				$entity = (string) $row['entity'];
				$specifier = (string) $row['specifier'];
				if(!isset($dbh->$type))
					$dbh->$type = new stdClass();
				if(!isset($dbh->$type->$entity))
					$dbh->$type->$entity = new stdClass();
				$dbh->$type->$entity->$specifier = $row;
			}

			return json_encode($dbh, JSON_FORCE_OBJECT);
		}
	}
	
	/* Queries Data from CollectedData Table for single Type and Entity
		
		Outputs JSON Object
	*/
	public function getCollectedData_compare() 
	{
		if(isset($_POST['id']) && isset($_POST['type']) && isset($_POST['entity']) && isset($_POST['count'])) {
			$db = new PDO('sqlite:/srv/bx/usv.db3');
			
			$dbh = new stdClass();
			$min = "2";
			$med = "1";
			$max = "4";
			$minArr = array();
			$medArr = array();
			$maxArr = array();
			
			
			// Query MIN Values
			
			$sql = "SELECT * FROM 'CollectedData' WHERE specifier=2 AND type=" . $_POST['type'] . " AND entity=" . $_POST['entity'] . " AND id >= (SELECT id FROM (SELECT id FROM 'CollectedData' WHERE type=1 ORDER BY id DESC LIMIT " . $_POST['count'] . ") ORDER BY id ASC LIMIT 1)";
			
			if($_POST['id'] > $_POST['count']) 
			{
				$sql = "SELECT * FROM 'CollectedData' WHERE specifier=2 AND type=" . $_POST['type'] . " AND entity=" . $_POST['entity'] . " AND id BETWEEN (
							SELECT id FROM (SELECT id FROM 'CollectedData' WHERE type=1 ORDER BY id DESC LIMIT " . $_POST['id'] . ") ORDER BY id ASC LIMIT 1
						) AND (
							SELECT id FROM (SELECT id FROM 'CollectedData' WHERE type=1 ORDER BY id DESC LIMIT " . ($_POST['id'] - $_POST['count']) . ") ORDER BY id ASC LIMIT 1
						)";
			}
			
			$result = $db->query($sql);
			
			foreach($result as $row) {
				$minArr[] = $row;
			}
			
			
			// Query MED Values
			
			$sql = "SELECT * FROM 'CollectedData' WHERE specifier=1 AND type=" . $_POST['type'] . " AND entity=" . $_POST['entity'] . " AND id >= (SELECT id FROM (SELECT id FROM 'CollectedData' WHERE type=1 ORDER BY id DESC LIMIT " . $_POST['count'] . ") ORDER BY id ASC LIMIT 1)";
			
			if($_POST['id'] > $_POST['count']) 
			{
				$sql = "SELECT * FROM 'CollectedData' WHERE specifier=1 AND type=" . $_POST['type'] . " AND entity=" . $_POST['entity'] . " AND id BETWEEN (
							SELECT id FROM (SELECT id FROM 'CollectedData' WHERE type=1 ORDER BY id DESC LIMIT " . $_POST['id'] . ") ORDER BY id ASC LIMIT 1
						) AND (
							SELECT id FROM (SELECT id FROM 'CollectedData' WHERE type=1 ORDER BY id DESC LIMIT " . ($_POST['id'] - $_POST['count']) . ") ORDER BY id ASC LIMIT 1
						)";
			}
			
			$result = $db->query($sql);
			
			foreach($result as $row) {
				$medArr[] = $row;
			}
			
			
			// Query MAX Values
			
			$sql = "SELECT * FROM 'CollectedData' WHERE specifier=4 AND type=" . $_POST['type'] . " AND entity=" . $_POST['entity'] . " AND id >= (SELECT id FROM (SELECT id FROM 'CollectedData' WHERE type=1 ORDER BY id DESC LIMIT " . $_POST['count'] . ") ORDER BY id ASC LIMIT 1)";
			
			if($_POST['id'] > $_POST['count']) 
			{
				$sql = "SELECT * FROM 'CollectedData' WHERE specifier=4 AND type=" . $_POST['type'] . " AND entity=" . $_POST['entity'] . " AND id BETWEEN (
							SELECT id FROM (SELECT id FROM 'CollectedData' WHERE type=1 ORDER BY id DESC LIMIT " . $_POST['id'] . ") ORDER BY id ASC LIMIT 1
						) AND (
							SELECT id FROM (SELECT id FROM 'CollectedData' WHERE type=1 ORDER BY id DESC LIMIT " . ($_POST['id'] - $_POST['count']) . ") ORDER BY id ASC LIMIT 1
						)";
			}
			
			$result = $db->query($sql);
			
			foreach($result as $row) {
				$maxArr[] = $row;
			}
			
			
			
			$dbh->$min = $minArr;
			$dbh->$med = $medArr;
			$dbh->$max = $maxArr;

			return json_encode($dbh, JSON_FORCE_OBJECT);
		}
	}
	
}

?>