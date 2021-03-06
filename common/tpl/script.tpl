<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>jquery.min.js"></script>
<!-- Jquery UI -->
<link rel="stylesheet" href="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>jquery-ui-1.11.2.custom/jquery-ui.min.css" type="text/css" />
<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>jquery-ui-1.11.2.custom/jquery-ui.min.js"></script>
<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>jquery.easing.1.3.js"></script>
<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>bootstrap/bootstrap.min.js"></script>
<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>apprise-bootstrap.js"></script>

<?php
if($page->is_backend) {
	?>
	<!-- jQuery-File-Upload -->
	<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>jquery-file-upload/js/jquery.iframe-transport.js"></script>
	<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>jquery-file-upload/js/jquery.fileupload.js"></script>
	<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>jquery-file-upload/js/jquery.fileupload-process.js"></script>
	<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>jquery-file-upload/js/jquery.fileupload-image.js"></script>
	<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>jquery-file-upload/js/jquery.fileupload-validate.js"></script>


	<!-- jQuery scrollTo -->
	<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>jquery.scrollTo/jquery.scrollTo.min.js"></script>

	<!-- IMPORTANT: APP CONFIG -->
	<script src="<?php print local2host(ADMIN_JAVASCRIPT_DIR); ?>app.config.js"></script>
	<!-- MAIN APP JS FILE -->
	<script src="<?php print local2host(ADMIN_JAVASCRIPT_DIR); ?>app.js"></script>

	<!-- Markitup Editor -->
	<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>markitup/jquery.markitup.js"></script>
	<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>markitup/sets/markdown_font-awesome/set.js"></script>


	<!-- Dropzone -->
	<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>dropzone-4.0.1/dist/dropzone.js"></script>
	<script type="text/javascript">
	Dropzone.autoDiscover = false;
	</script>
	<?php
}
?>
<!-- jQuery timeago -->
<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>jquery-timeago/jquery.timeago.js" type="text/javascript"></script>
<!-- FitText.js -->
<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>jquery.fittext.js"></script>
<!-- jquery.cookie & storage -->
<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>jquery-cookie/jquery.cookie.js"></script>
<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>jquery-storage/jquery.storageapi.js"></script>
<!-- Jcryption, MD5 & SHA1 -->
<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>jquery.jcryption.3.0.js"></script>
<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>jquery-md5/jquery.md5.js"></script>
<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>jquery.sha1.js"></script>
<!-- d3js -->
<!--script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>d3/d3.min.js" charset="utf-8"></script-->
<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>d3/d3_flare.js"></script>
<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>d3/d3.layout.js"></script>
<!-- Purl (A JavaScript URL parser) -->
<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>purl/purl.js"></script>
<!-- Jquery Choosen -->
<link rel="stylesheet" href="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>chosen/chosen-bootstrap.css" type="text/css" />
<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>chosen/chosen.jquery.js"></script>
<!--script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>bootstrap-multiselect/js/bootstrap-multiselect.js"></script-->
<!-- Jquery number formatter -->
<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>jquery-number/jquery.number.min.js"></script>
<!-- Typeahead -->
<link rel="stylesheet" href="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>typeahead/typeahead.css" type="text/css" />
<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>typeahead/typeahead.bundle.js"></script>
<!-- Jquery hotkeys -->
<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>jquery.hotkeys/jquery.hotkeys.js"></script>
<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>typeahead/typeahead.bundle.js"></script>
<!-- jQuery-Knob -->
<!--script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>jQuery-Knob/js/jquery.knob.js"></script-->
<!-- Stupid-Table-Plugin -->
<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>Stupid-Table-Plugin/stupidtable.js"></script>
<!-- ToucSwipe -->
<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>TouchSwipe/jquery.touchSwipe.min.js"></script>

	<!-- Core scripts -->
	<script type="text/javascript" src="<?php print local2host(INTERFACE_CONF_DIR); ?>i18n.js"></script>
	<script type="text/javascript" src="<?php print local2host(INTERFACE_CONF_DIR); ?>site.js"></script>
	<script type="text/javascript" src="<?php print HOST; ?>/API/?definitions=api&type=string&condensed=true"></script>
	<script type="text/javascript" src="<?php print HOST; ?>/API/?definitions=tags&type=string&condensed=true"></script>
	<script type="text/javascript" src="<?php print HOST; ?>/API/?definitions=types&type=string&condensed=true"></script>
	<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_DIR); ?>params<?php /*print ((!$interface["site"]["developer_mode"]) ? ".min" : "");*/ ?>.js"></script>
	<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_DIR); ?>shortcuts<?php /*print ((!$interface["site"]["developer_mode"]) ? ".min" : "");*/ ?>.js"></script>
	<script type="text/javascript">
	function load_firebug() {
		var fileref;
		if(config.site.developer_mode) {
			$("#loader").addClass("system").fadeIn(300, function() {
				document.body.style.cursor = "wait";
				fileref = document.createElement("script");
				fileref.setAttribute("type", "text/javascript");
				fileref.setAttribute("src", "<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>firebug-lite/build/firebug-lite-debug.js");
				fileref.innerHTML = '{ saveCookies: true, startOpened: false, startInNewWindow: false, showIconWhenHidden: true, overrideConsole: true, ignoreFirebugElements: true, disableXHRListener: false, disableWhenFirebugActive: true, enableTrace: false, enablePersistent: false }';

				var head = document.getElementsByTagName("head")[0];
				head.appendChild(fileref);

				document.body.style.cursor = "default";
				$("#loader").fadeOut(0);
			});
		}
	}
	</script>
	<!-- BootstrapSwitch -->
	<link href="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css" rel="stylesheet">
	<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>bootstrap-switch/dist/js/bootstrap-switch.js"></script>
	<?php
	if(LOGGED) {
		?>

		<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_DIR); ?>main<?php /*print ((!$interface["site"]["developer_mode"]) ? ".min" : "");*/ ?>.js"></script>
		<script type="text/javascript" src="<?php print local2host(ADMIN_JAVASCRIPT_DIR); ?>main<?php /*print ((!$interface["site"]["developer_mode"]) ? ".min" : "");*/ ?>.js"></script>
		<?php
		switch($page->address) {
			case "Menu":
				?><script type="text/javascript" src="<?php print local2host(ADMIN_JAVASCRIPT_DIR); ?>menu<?php /*print ((!$interface["site"]["developer_mode"]) ? ".min" : "");*/ ?>.js"></script><?php
				break;
			case "Invite":
				?><script type="text/javascript" src="<?php print local2host(ADMIN_JAVASCRIPT_DIR); ?>invite<?php /*print ((!$interface["site"]["developer_mode"]) ? ".min" : "");*/ ?>.js"></script><?php
				break;
			case "Pages":
				?><script type="text/javascript" src="<?php print local2host(ADMIN_JAVASCRIPT_DIR); ?>pages<?php /*print ((!$interface["site"]["developer_mode"]) ? ".min" : "");*/ ?>.js"></script><?php
				break;
			case "Upload":
				?><script type="text/javascript" src="<?php print local2host(ADMIN_JAVASCRIPT_DIR); ?>upload<?php /*print ((!$interface["site"]["developer_mode"]) ? ".min" : "");*/ ?>.js"></script><?php
				break;
		}
	} else {
		?>
		<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_DIR); ?>main<?php /*print ((!$interface["site"]["developer_mode"]) ? ".min" : "");*/ ?>.js"></script>
		<?php
	}
	if(strtolower($page->current) == "map" || strtolower($page->current) == "search" || strtolower($page->current) == "advanced_search") {
		?>
		<!-- OpenLayers2 -->
			<!--
			<script type="text/javascript" src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
			<link rel="stylesheet" href="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>OpenLayers/OpenLayers-2.13/theme/default/style.css" type="text/css">
			<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>OpenLayers/OpenLayers-2.13/OpenLayers.js"></script>
			<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>main.map.js"></script>
			-->
		<!-- OpenLayers 3 -->
		<!--link rel="stylesheet" href="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>OpenLayers/OpenLayers3/v3.0.0-beta.5/css/ol.css" type="text/css" />
		<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>OpenLayers/OpenLayers3/v3.0.0-beta.5/build/ol.js" type="text/javascript"></script>

		<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_DIR); ?>map3.js"></script-->

		<!-- Leaflet -->
		<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/Leaflet-0.7.3/leaflet.js"></script>
		<link rel="stylesheet" href="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/Leaflet-0.7.3/leaflet.css" />
			<!-- Providers -->
			<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/leaflet-providers/leaflet-providers.js"></script>
			<!-- Marker cluster-->
			<link rel="stylesheet" href="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.markercluster/dist/MarkerCluster.css" />
			<link rel="stylesheet" href="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.markercluster/dist/MarkerCluster.Default.css" />
			<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.markercluster/dist/leaflet.markercluster-src.js"></script>
			<!-- Heatmap -->
			<!-- <script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/leaflet-heat.js"></script> -->
			<!-- Leaflet Draw -->
			<link rel="stylesheet" href="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/dist/leaflet.draw.css" />
			<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/Leaflet.draw.js"></script>
				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/edit/handler/Edit.Poly.js"></script>
				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/edit/handler/Edit.SimpleShape.js"></script>
				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/edit/handler/Edit.Circle.js"></script>
				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/edit/handler/Edit.Rectangle.js"></script>

				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.Feature.js"></script>
				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.Polyline.js"></script>
				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.Polygon.js"></script>
				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.SimpleShape.js"></script>
				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.Rectangle.js"></script>
				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.Circle.js"></script>
				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.Marker.js"></script>

				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/ext/LatLngUtil.js"></script>
				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/ext/GeometryUtil.js"></script>
				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/ext/LineUtil.Intersect.js"></script>
				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/ext/Polyline.Intersect.js"></script>
				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/ext/Polygon.Intersect.js"></script>

				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/Control.Draw.js"></script>
				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/Tooltip.js"></script>
				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/Toolbar.js"></script>

				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/draw/DrawToolbar.js"></script>
				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/edit/EditToolbar.js"></script>
				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/edit/handler/EditToolbar.Edit.js"></script>
				<script src="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>leaflet/plugins/Leaflet.draw/src/edit/handler/EditToolbar.Delete.js"></script>

		<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_DIR); ?>form<?php /*print ((!$interface["site"]["developer_mode"]) ? ".min" : "");*/ ?>.js"></script>
		<script type="text/javascript" src="<?php print local2host(JAVASCRIPT_DIR); ?>map<?php /*print ((!$interface["site"]["developer_mode"]) ? ".min" : "");*/ ?>.js"></script>
		<!--script type="text/javascript" src="<?php //print local2host(JAVASCRIPT_DIR); ?>charts.js"></script-->
		<?php
	}
	?>
	<?php
	if(!$interface["site"]["developer_mode"]) {
		// include(CONF_DIR . "google_analytics.php");
	}
	?>
