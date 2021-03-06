<div id="breadcrumb">
	<ol class="breadcrumb">
		<li id="goto_main_btn"><span class="text-muted fa fa-calendar-o"></span> <span class="txt">Main</span></li>
		<li id="goto_forms_btn" class="hidden"><span class="text-muted fa fa-tasks"></span> <span class="txt">Forms</span></li>
		<li id="goto_summary_btn" class="hidden"><span class="text-muted fa fa-list-alt"></span> <span class="txt">Summary</span></li>
		<li id="goto_results_btn" class="hidden"><span class="text-muted fa fa-list-alt"></span> <span class="txt">Results</span></li>
		<li id="goto_stats_btn" class="hidden"><span class="text-muted fa fa-list-alt"></span> <span class="txt">Statistics</span></li>
		<li id="goto_map_btn" class="hidden"><span class="text-muted ionicons ion-map"></span> <span class="txt">Map<span></li>
	</ol>
</div>
<div id="contents">
	<?php
	// IMPORTANT: Do not change the following structure: everyting will not work!
	require_once(TEMPLATE_SEARCH_PANEL_DIR . "search_panel_form.tpl");
	require_once(TEMPLATE_SEARCH_PANEL_DIR . "search_panel_summary.tpl");
	require_once(TEMPLATE_SEARCH_PANEL_DIR . "search_panel_result.tpl");
	require_once(TEMPLATE_SEARCH_PANEL_DIR . "search_panel_statistics.tpl");
	require_once(TEMPLATE_SEARCH_PANEL_DIR . "search_panel_map.tpl");
	require_once(TEMPLATE_SEARCH_PANEL_DIR . "search_panel_start.tpl");
	?>
	<div id="loader_bg" class="panel_content" style="display: block">
		<h1 unselectable="on"><span class="fa fa-gear fa-spin"></span> Searching...</h1>
	</div>
</div>
