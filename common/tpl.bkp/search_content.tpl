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
	?>
	<div id="forms" class="panel_content">
		<div id="forms-head" class="left panel_content-head container-fluid">
			<h1 class="pull-left content-title"></h1>
			<div class="btn-group pull-right">
				<a href="javascript: void(0);" class="btn btn-default-grey" style="display: none;" id="right_btn"></a>
			</div>
			<div class="clearfix"></div>
		</div>
		<div id="forms-body" class="left panel_content-body container-fluid">
			<div class="content-body"></div>
		</div>
		<div id="forms-footer" class="left panel_content-footer container-fluid">
			<div class="btn-group pull-right">
				<a href="javascript: void(0);" class="btn btn-default-grey" style="display: none;" id="right_btn"></a>
			</div>
		</div>
	</div>
	<div id="summary" class="panel_content">
		<div id="summary-head" class="left panel_content-head container-fluid">
			<h1 class="content-title"></h1>
		</div>
		<div id="summary-body" class="left panel_content-body container-fluid">
			<div class="content-body"></div>
		</div>
	</div>
	<div id="results" class="panel_content">
		<div id="results-head" class="left panel_content-head container-fluid">
			<h1 class="content-title"></h1>
		</div>
		<div id="results-body" class="left panel_content-body container-fluid">
			<div class="content-body"></div>
		</div>
	</div>
	<div id="map" class="panel_content">
		<?php require_once("common/tpl/map_toolbox.tpl"); ?>

		<div id="map_hidden_elements" style="display: none;"></div>
		<!--script src="common/js/polyfills.js"></script-->
	</div>
	<div id="pgrdg_map"></div>
	<div id="start" class="panel_content">
		<div>
			<h1 unselectable="on"><span>&lsaquo;</span> Start typing the name of a field you want to search</h1>

			<div class="content">
				<?php require_once("common/tpl/pages/search_main.tpl"); ?>
			</div>
		</div>
	</div>
</div>