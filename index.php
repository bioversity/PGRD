<?php
//header("Content-type: text/plain");
require_once("common/include/funcs/nl2.php");
require_once("common/include/funcs/readmore.php");
require_once("common/include/lib/php-markdown-extra-extended/markdown.php");
require_once("common/include/funcs/optimize_markdown.php");
require_once("common/include/classes/parse_json_config.class.php");

$site_config = new parse_json_config();
$map_config = new parse_json_config("common/include/conf/map.json");
$i18n_config = new parse_json_config("common/include/conf/interface/i18n.js");
$interface_config = new parse_json_config("common/include/conf/interface/site.js");
$i18n = $i18n_config->parse_js_config("i18n");
$interface = $interface_config->parse_js_config("config");
if(isset($_COOKIE["lang"]) && trim($_COOKIE["lang"]) !== "") {
	$lang = $_COOKIE["lang"];
} else {
	$lang = $interface["site"]["default_language"];
}

function is_home() {
	return ($_GET["p"] == "" || strtolower($_GET["p"]) == "home") ? true : false;
}
if (isset($_GET["p"]) && trim($_GET["p"]) !== "") {
	$page = $_GET["p"];
	if (isset($_GET["s"]) && trim($_GET["s"]) !== "") {
		$sub_page = $_GET["s"];
		if (isset($_GET["ss"]) && trim($_GET["ss"]) !== "") {
			$sub_subpage = $_GET["ss"];
		}
	}
} else {
	$page = "";
}
$domain = (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] && $_SERVER["HTTPS"] != "off") ? "https" : "http" . "://" . $_SERVER["SERVER_NAME"];
?>
<!DOCTYPE html>
<html lang="en"<?php print (strtolower($page) == "map") ? ' class="map"' : ""; ?>>
	<head>
		<?php include("common/tpl/head.tpl"); ?>
	</head>
	<body>
		<div id="loader" class="system">
			<div></div>
			<div></div>
		</div>
		<?php include("common/tpl/body_header.tpl"); ?>

		<?php include("common/include/get_contents.php"); ?>

		<?php include("common/tpl/script.tpl"); ?>
	</body>
</html>
