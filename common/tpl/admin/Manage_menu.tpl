<?php
function get_menu($menu, $i18nl) {
        foreach($menu as $k => $v) {
                if($k !== "User") {
                        $title = ((!isset($v["attributes"]["title"]) || trim($v["attributes"]["title"]) == "") ? '<i class="text-muted">No title for this entry</i>' :  $v["attributes"]["title"]);
                        $link = ($v["attributes"]["href"] !== "./") ? str_replace("./", $_SERVER["HTTP_HOST"] . "/", $v["attributes"]["href"]) : $_SERVER["HTTP_HOST"];
                        $full_link = (strpos($v["attributes"]["href"], "javascript:") !== false) ? $link : '<a target="_blank" href="' . $link .'">' . $link . '</a>';
                        ?>
                        <li class="list-group-item" id="<?php print md5($k); ?>">
                                <div class="title_row">
                                        <div class="move-handle"></div>
                                        <div class="menu_data">
                                                <h4 class="list-group-item-heading">
                                                        <span class="<?php print $v["content"]["icon"]; ?> menu_icon"></span> <span class="menu_name"><?php print $v["content"]["text"]; ?></span><span class="fa fa-fw">&rsaquo;</span>
                                                        <tt>
                                                                <small class="<?php print (strpos($v["attributes"]["href"], "javascript:") !== false) ? "fa fa-code" : ""; ?>"></small> <span class="menu_link"><?php print $full_link; ?></span>
                                                        </tt>
                                                        <!-- Button groups -->
                                                        <div class="btn-group pull-right">
                                                                <button class="btn btn-default-white edit_menu_btn" onclick="$(this).edit_menu();" title="<?php print $i18nl["interface"]["btns"]["edit"]; ?>">
                                                                        <span class="fa fa-fw fa-edit"></span>
                                                                </button>
                                                                <button class="btn btn-default-white" onclick="$(this).hide_menu();" title="<?php print $i18nl["interface"]["btns"]["hide"]; ?>" data-toggle="tooltip" data-placement="top">
                                                                        <span class="fa fa-fw fa-eye-slash"></span>
                                                                </button>
                                                        </div>
                                                </h4>
                                                <p class="list-group-item-text list-group-item-body clearfix menu_title"><?php print $title; ?></p>
                                        </div>
                                        <div class="move-handle"></div>
                                </div>
                                <!-- Submenus -->
                                <?php
                                if(isset($v["childs"])) {
                                        ?>
                                        <div class="list-group">
                                                <ul class="subpanel-body list-group">
                                                        <?php
                                                        get_menu($v["childs"], $i18nl);
                                                        ?>
                                                </ul>
                                        </div>
                                        <?php
                                }
                                ?>
                        </li>
                        <?php
                        // print $k . "<br />";
                }
        }
}
?>

<div id="menu_management">
        <?php
        include(INCLUDE_DIR . "conf/menu.php");
        $config = $menu;
        ?>
        <h1>
                <?php print $page->title; ?>
                <button class="btn btn-orange save_btn pull-right" onclick="$.save_menu();"><?php print $i18n[$lang]["interface"]["btns"]["save"]; ?>&nbsp;&nbsp;&nbsp;<span class="fa fa-chevron-right"></span></button>
        </h1>

        <br />
        <br />
        <div id="menu_management_accordion" class="panel-group">
                <div class="panel panel-default">
                        <div class="panel-heading">
                                <h4 class="panel-title">
                                        <a href="#menu_management_stage" data-parent="#menu_management_accordion" data-toggle="collapse" class="">
                                                <span class="fa fa-list fa-fw"></span>Users menu
                                        </a>
                                </h4>
                        </div>
                        <div class="panel-body panel-collapse collapse in" id="menu_management_stage" style="">
                                <ul class="list-group">
                                        <?php
                                        get_menu($menu["menu"]["top"][0], $i18n[$lang]);
                                        ?>
                                </ul>
                        </div>
                </div>
        </div>
</div>
