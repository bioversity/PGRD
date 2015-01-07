<?php
$menu["menu"]["admin"][0] = array(
        "Home" => array(
                "content" => array(
                        "icon" => "fa fa-home",
                        "text" => "Home"
                ),
                "attributes" => array(
                        "href" => "/",
                        "title" => "Go to Main Page",
                        "class" => "btn btn-link"
                )
        )
);
if(in_array(kTYPE_ROLE_INVITE, $user->roles) || in_array(kTYPE_ROLE_USERS, $user->roles)) {
        $menu["menu"]["admin"][1] = array(
                "Manage_user" => array(
                        "content" => array(
                                "icon" => "ionicons ion-person-stalker",
                                "text" => "Manage users"
                        ),
                        "attributes" => array(
                                "href" => "javascript:void(0);",
                                "title" => "",
                                "class" => "btn btn-link"
                        ),
                        "childs" => array(
                                "All_users" => array(
                                        "content" => array(
                                                "icon" => "fa fa-fw ionicons ion-ios7-people",
                                                "text" => "All users"
                                        ),
                                        "attributes" => array(
                                                "href" => "/Users",
                                                "title" => "See all users",
                                                "class" => "btn btn-link"
                                        )
                                ),
                                "Invite_user" => array(
                                        "content" => array(
                                                "icon" => "fa fa-fw ionicons ion-person-add",
                                                "text" => "Invite new"
                                        ),
                                        "attributes" => array(
                                                "href" => "/Users/Invite",
                                                "title" => "Invite an user",
                                                "class" => "btn btn-link btn-default"
                                        )
                                )
                        )
                )
        );
}
$menu["menu"]["admin"][2] = array(
        "Your_data" => array(
                "content" => array(
                        "icon" => "fa fa-cubes",
                        "text" => "Your data",
                        "class" => "open"
                ),
                "attributes" => array(
                        "href" => "javascript:void(0);",
                        "title" => "",
                        "class" => "btn btn-link"
                ),
                "childs" => array(
                        "History" => array(
                                "content" => array(
                                        "icon" => "fa fa-fw fa-history",
                                        "text" => "History"
                                ),
                                "attributes" => array(
                                        "href" => "/Your_data/History",
                                        "title" => "History",
                                        "class" => "btn btn-link"
                                )
                        )
                )
        )
);
if(in_array(kTYPE_ROLE_UPLOAD, $user->roles)) {
        $menu["menu"]["admin"][2]["Your_data"]["childs"] = array(
                "Upload" => array(
                        "content" => array(
                                "icon" => "fa fa-fw fa-upload",
                                "text" => "Upload"
                        ),
                        "attributes" => array(
                                "href" => "/Your_data/Upload",
                                "title" => "Upload",
                                "class" => "btn btn-link"
                        )
                )
        );
}

if(in_array(kTYPE_ROLE_EDIT, $user->roles)) {
        $menu["menu"]["admin"][3] = array(
                "Manage_contents" => array(
                        "content" => array(
                                "icon" => "fa fa-file-text-o",
                                "text" => "Manage contents"
                        ),
                        "attributes" => array(
                                "href" => "javascript:void(0);",
                                "title" => "",
                                "class" => "btn btn-link"
                        ),
                        "childs" => array(
                                "Static_contents" => array(
                                        "content" => array(
                                                "icon" => "fa fa-fw fa-file-text",
                                                "text" => "Static contents"
                                        ),
                                        "attributes" => array(
                                                "href" => "/Contents/Summary",
                                                "title" => "Static contents",
                                                "class" => "btn btn-link"
                                        )
                                ),
                                "Blog" => array(
                                        "content" => array(
                                                "icon" => "fa fa-fw fa-newspaper-o",
                                                "text" => "Blog"
                                        ),
                                        "attributes" => array(
                                                "href" => "/Blog",
                                                "title" => "Blog",
                                                "class" => "btn btn-link"
                                        )
                                )
                        ),
                        "divider" => "divider"
                )
        );
}
$menu["menu"]["admin"][] = array(
        "Logout" => array(
                "content" => array(
                        "icon" => "fa fa-sign-out",
                        "text" => "Logout"
                ),
                "attributes" => array(
                        "href" => "/Signout",
                        "title" => "",
                        "class" => "btn btn-link text-warning"
                )
        )
);
// header("Content-type: text/plain");
// print_r($menu["menu"]["admin"]);
// exit();
?>
