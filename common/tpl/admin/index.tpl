<?php
require_once("common/tpl/admin/body_header.tpl");
require_once("common/tpl/admin/left_panel.tpl");
require_once("common/tpl/admin/content.tpl");
require_once("common/tpl/admin/footer.tpl");
require_once("common/tpl/admin/shortcut.tpl");
switch($page->current) {
        case "Profile":
                require_once("common/tpl/script.tpl");
                break;
        default:
                require_once("common/tpl/admin/script.tpl");
                break;
}
?>
