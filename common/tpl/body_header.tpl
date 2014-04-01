<header class="main<?php print (strtolower($page) == "map") ? " map" : ""; ?>">
	<div class="container">
		<div class="top">
			<div id="logo"<?php print (strtolower($page) == "map") ? ' class="map"' : ""; ?>>
				<a href="/">
					<!--object data="common/media/svg/<?php print (strtolower($page) == "map") ? "bioversity-logo_small.svg" : "bioversity-logo.svg"; ?>" type="image/svg+xml"-->
						<img alt="Bioversity logo" src="common/media/svg/<?php print (strtolower($page) == "map") ? "bioversity-logo_small.svg" : "bioversity-logo.svg"; ?>" />
					<!--/object-->
				</a>
				<p class="tagline">Bioversity International: research for development in agricultural and forest biodiversity</p>
			</div>
		</div>
		
		<nav role="navigation" id="nav" class="navbar right<?php print (strtolower($page) == "map") ? " map" : ""; ?>">
			<ul class="lvl1 nav navbar-nav navbar-right">
				<li><a href="javascript: void(0);" onclick="$.left_panel('filter');"><span class="fa fa-search"></span>&nbsp;Filter</a></li>
				<li><a href="/Map"><span class="fa fa-map-marker"></span>&nbsp;Map</a></li>
				<li><a href="/Data"><span class="fa fa-code-fork"></span>&nbsp;Data</a></li>
				<li><a href="/Charts"><span class="fa fa-bar-chart-o"></span>&nbsp;Charts</a></li>
				<li class="divider-vertical"></li>
				<li><a href="javascript: void(0);" data-toggle="modal" data-target="#myModal"><span class="fa fa-sign-in"></span>&nbsp;Sign in</a></li>
			</ul>
		</nav>
	</div>
</header>
<?php require_once("common/tpl/login_modal.tpl"); ?>