<?php
require_once("../common/include/classes/frontend_api.class.php");

if(isset($_GET["proxy"]) && trim($_GET["proxy"]) == "true") {
	$api = new frontend_api();
	if($_GET["debug"] == "debug") {
		$api->debug();
	}
	switch($_GET["type"]) {
		case "service":
			print $api->ask_service($_GET["address"]);
			break;
	}
	
	exit();
	/*
	if($_GET["type"] == "post") {
		header("Content-type: " . $_GET["header"]);
		$fields_string = "";	
		if(isset($_GET["params"]) && trim($_GET["params"]) !== "") {
			foreach($_GET["params"] as $key=>$value) {
				$fields_string .= $key . "=" . $value . "&";
			}
			rtrim($fields_string, "&");
		}
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		if(isset($_GET["params"]) && trim($_GET["params"]) !== "") {
			curl_setopt($ch, CURLOPT_POST, count($_GET["params"]));
			curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
		}

		//execute post
		$result = curl_exec($ch);

		//close connection
		curl_close($ch);
	} else {
		$fields_string = "";	
		foreach($_GET["params"] as $key=>$value) {
			$fields_string .= $key . "=" . $value . "&";
		}
		if($_GET["debug"] == "true") {
			print $_GET["address"] . "?" . $fields_string . "\n\n";
		}
		
		print file_get_contents($_GET["address"] . "?" . $fields_string);
	}
	*/
} else {
	require_once("../common/include/lib/jcryption.php");
}
?>