<?php
header('Content-Type: text/html; charset=utf-8');

file_put_contents('ajaxlogg.txt', print_r($_POST, true) . print_r($_GET, true));

define('HIGHSCORE_FILE', 'players.xml');

// Open high score file for sorting
$xml = simplexml_load_file(HIGHSCORE_FILE);
$sxe = new SimpleXMLElement($xml->asXML());

// Get current player end time and current player name
$time = $_POST["time"];
$name = filter_var($_POST["name"], FILTER_SANITIZE_STRING);
//$name = htmlentities($name);

// Encode XML file to array
$json = json_encode($sxe);
$array = json_decode($json,TRUE);
$players = $array['player'];

// Add current player to array, med array_push
array_push($players, array("name" => $name, "time" => $time));

// Sort array based on time
uasort($players, "compArr");

//Slice players to 10 players
$n = count($players);
$len = 5;
for ($i = 0; $i + $len <= $n; $i += $len) {
    $playersHighscore = array_slice($players, $i, $len, true);
}

//Compare players time
function compArr($a, $b) {
	$a = $a['time'];
	$b = $b['time'];

	if ($a > $b) {
		return 1;
	} else if ($a < $b) {
		return -1;
	} else {
		return 0;
	}
}

$xml2 = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><players/>');

foreach($playersHighscore as $player) {

	// for each player add a new node to xml file
	$playerNode = $xml2->addChild("player");

	if(is_string($player["name"])) {
		$playerNode->addChild("name", $player["name"]);
		$playerNode->addChild("time", $player["time"]);

	}
}

$xml2->asXML(HIGHSCORE_FILE);


?>
