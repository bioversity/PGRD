<?php

/**
 * Root
 */
if(!defined("SYSTEM_ROOT")) { define("SYSTEM_ROOT", $_SERVER["DOCUMENT_ROOT"] . "/"); }

/**
 * root:common/
 */
if(!defined("COMMON_DIR")) { define("COMMON_DIR", SYSTEM_ROOT . "common/"); }
        /**
         * root:common/.gnupg/
         */
        if(!defined("GNUPG_DIR")) { define("GNUPG_DIR", COMMON_DIR . ".gnupg/"); }

        /**
         * root:common/css/
         */
        if(!defined("CSS_DIR")) { define("CSS_DIR", COMMON_DIR . "css/"); }

                /**
                 * root:common/css/admin/
                 */
                if(!defined("ADMIN_CSS_DIR")) { define("ADMIN_CSS_DIR", CSS_DIR . "admin/"); }

        /**
         * root:common/include/
         */
        if(!defined("INCLUDE_DIR")) { define("INCLUDE_DIR", COMMON_DIR . "include/"); }
                /**
                 * root:common/include/classes/
                 */
                if(!defined("CLASSES_DIR")) { define("CLASSES_DIR", INCLUDE_DIR . "classes/"); }

                /**
                 * root:common/include/conf/
                 */
                if(!defined("CONF_DIR")) { define("CONF_DIR", INCLUDE_DIR . "conf/"); }
                        /**
                         * root:common/include/conf/interface/
                         */
                        if(!defined("INTERFACE_CONF_DIR")) { define("INTERFACE_CONF_DIR", CONF_DIR . "interface/"); }


                /**
                 * root:common/include/funcs/
                 */
                if(!defined("FUNCS_DIR")) { define("FUNCS_DIR", INCLUDE_DIR . "funcs/"); }

                /**
                 * root:common/include/lib/
                 */
                if(!defined("LIB_DIR")) { define("LIB_DIR", INCLUDE_DIR . "lib/"); }

        /**
         * root:common/js/
         */
        if(!defined("JAVASCRIPT_DIR")) { define("JAVASCRIPT_DIR", COMMON_DIR . "js/"); }

                /**
                 * root:common/js/admin/
                 */
                if(!defined("ADMIN_JAVASCRIPT_DIR")) { define("ADMIN_JAVASCRIPT_DIR", JAVASCRIPT_DIR . "admin/"); }

        /**
         * root:common/md/
         */
        if(!defined("MARKDOWN_DIR")) { define("MARKDOWN_DIR", COMMON_DIR . "md/"); }

        /**
         * root:common/media/
         */
        if(!defined("MEDIA_DIR")) { define("MEDIA_DIR", COMMON_DIR . "media/"); }
                /**
                 * root:common/media/img/
                 */
                if(!defined("IMAGES_DIR")) { define("IMAGES_DIR", MEDIA_DIR . "img/"); }
                        /**
                         * root:common/media/img/
                         */
                        if(!defined("ADMIN_IMAGES_DIR")) { define("ADMIN_IMAGES_DIR", IMAGES_DIR . "admin/"); }
                                /**
                                 * root:common/media/img/
                                 */
                                if(!defined("ADMIN_IMAGES")) { define("ADMIN_IMAGES", ADMIN_IMAGES_DIR . "user_images/"); }

        /**
         * root:common/tpl/
         */
        if(!defined("TEMPLATE_DIR")) { define("TEMPLATE_DIR", COMMON_DIR . "tpl/"); }


        /**
         * root:common/tpl/admin/
         */
        if(!defined("ADMIN_TEMPLATE_DIR")) { define("ADMIN_TEMPLATE_DIR", TEMPLATE_DIR . "admin/"); }

$logged = false;
?>
