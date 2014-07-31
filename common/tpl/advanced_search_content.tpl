<div id="breadcrumb">
	<ol class="breadcrumb">
		<li id="goto_forms_btn"><span class="text-muted fa fa-tasks"></span> <span class="txt">Forms</span></li>
		<li id="goto_summary_btn" style="display: none;"><span class="text-muted fa fa-list-alt"></span> <span class="txt">Summary</span></li>
		<li id="goto_results_btn" style="display: none;"><span class="text-muted fa fa-list-alt"></span> <span class="txt">Results</span></li>
		<li id="goto_map_btn" style="display: none;"><span class="text-muted ionicons ion-map"></span> <span class="txt">Map<span></li>
	</ol>
</div>
<div id="contents">
	<?php
	// IMPORTANT: Do not change the following structure, might not work nothing!
	require_once("common/tpl/search_panels/search_panel_form.tpl");
	require_once("common/tpl/search_panels/search_panel_summary.tpl");
	require_once("common/tpl/search_panels/search_panel_result.tpl");
	require_once("common/tpl/search_panels/search_panel_map.tpl");
	require_once("common/tpl/search_panels/search_panel_start.tpl");
	?>
</div>