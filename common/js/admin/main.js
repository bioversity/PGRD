/**
* Main admin functions
*
* @author Alessandro Gubitosi <gubi.ale@iod.io>
* @license http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @link https://github.com/bioversity/PGRDG/
*/

/*=======================================================================================
*	MAIN ADMIN FUNCTIONS
*======================================================================================*/

/**
 * Display a password requiring dialog before save data
 * @param  function		callback	 	A function to execute if password is correct
 */
$.require_password = function(callback) {
	var s = storage.get("pgrdg_user_cache.user_data.current");
	$.each(s, function(id, ud) {
		var username = ud[kTAG_CONN_CODE][kAPI_PARAM_RESPONSE_FRMT_DISP];
		apprise(i18n[lang].messages.insert_password.message, {
			title: i18n[lang].messages.insert_password.title,
			icon: "fa-lock",
			titleClass: "text-warning",
			input: true,
			input_type: "password"
		}, function(r) {
			if(r) {
				if (typeof callback == "function") {
					callback.call($.sha1(r));
				}
			} else {
				return false;
			}
		});
	});
};

/**
 * Calculate the storage occupied space and fill a panel with percentege
 * @param  string 		label  			The label for percentage row
 * @param  string 		storage			The storage to evaluate
 */
$.add_storage_space_in_panel = function(label, storage) {
	/**
	 * Calculate the occupied space of given storage
	 * @param  string key The local storage to evaluate
	 * @return string     The occupied space in verbose mode
	 */
	$.get_localstorage_space = function(key){
		var allStrings = '';
		for(var keys in window.localStorage){
			// console.log(keys);
			if(window.localStorage.hasOwnProperty(keys)){
				allStrings += window.localStorage[key];
			}
		}
		return allStrings ? 3 + (Math.round(((allStrings.length*16)/(8*1024)) * 100) / 100) + " Kb" : "0 Kb";
	};

	var occupied_space_mb = $.get_localstorage_space(storage),
	occupied_space = parseInt($.get_localstorage_space(storage)),
	free_space = 1000 - occupied_space,
	percentage = (occupied_space * 100) / 1000,
	bar_colour = "progress-bar-success",
	text_colour = "txt-color-darken";

	if(percentage > 33) {
		bar_colour = "progress-bar-warning";
		text_colour = "text-warning";
	} else if(percentage > 66) {
		bar_colour = "progress-bar-danger";
		text_colour = "text-danger";
	}

	var $li = $('<li>'),
	$padding5 = $('<div class="padding-5">'),
	$p = $('<p class="' + text_colour + ' font-sm no-margin">'),
	$progress = $('<div class="progress progress-micro no-margin">'),
	$progress_bar = $('<div class="progress-bar ' + bar_colour + '" style="width: ' + percentage + '%">');


	$p.html("<b>" + label + ":</b><br /><small>" + occupied_space_mb + "</small>");
	$progress.append($progress_bar);
	$padding5.append($p).append($progress);
	$li.append($padding5);
	$("#local_storage_space").append($li);
};


/**
 * Extract the user's data from given user identifier
 * @param  string   		user_id  		The user Identifier
 * @param  function 		callback 		The function to execute when data are available
 */
$.get_user = function(user_id, callback) {
	$("#loader").show();
	if($.storage_exists("pgrdg_user_cache.user_data.all." + user_id)) {
		callback.call(this, storage.get("pgrdg_user_cache.user_data.all." + user_id));
	} else {
		if($.storage_exists("pgrdg_user_cache.user_data.current")) {
			if(user_id === null || user_id === undefined || user_id === "") {
				user_id = $.get_manager_id();
			}
			$.ask_cyphered_to_service({
				storage_group: "pgrdg_user_cache.user_data.all",
				data: {
					"user_id": user_id,
					"manager_id": $.get_manager_id()
				},
				type: "get_user"
			}, function(response) {
				if(typeof callback == "function") {
					$.each(response, function(id, ud) {
						storage.set("pgrdg_user_cache.user_data.all." + $.get_user_id(ud), ud);
						callback.call(this, ud);
					});
				}
				$("#loader").hide();
			});
		} else {
			$.cookie("l", null, {path: "/"});
			document.location = "./Signin"
		}
	}
};

/**
* Extract all managed users of a given user identifier
* @param  string   		user_id  		The user Identifier
* @param  function 		callback 		The function to execute when data are available
*/
$.get_managed_users = function(user_id, callback) {
	if($.storage_exists("pgrdg_user_cache.user_data.managed." + user_id)) {
		callback.call(this, storage.get("pgrdg_user_cache.user_data.managed." + user_id));
	} else {
		if(user_id === null || user_id === undefined || user_id === "") {
			user_id = $.get_manager_id();
		}
		$.ask_cyphered_to_service({
			storage_group: "pgrdg_user_cache.user_data.managed",
			data: {
				"user_id": user_id,
				"manager_id": $.get_manager_id()
			},
			type: "get_managed_users"
		}, function(response) {
			if(typeof callback == "function") {
				var managed = {};
				$.each(response, function(id, ud) {
					if($.storage_exists("pgrdg_user_cache.user_data.all." + $.get_user_id(ud))) {
						storage.set("pgrdg_user_cache.user_data.all." + $.get_user_id(ud), ud);
					}
					managed[$.get_user_id(ud)] = ud;
				});
				callback.call(this, managed);
			}
			$("#loader").hide();
		});
	}
};

/**
 * Extract the user identifier from a given user data object
 * @param  object		user_data 		The user data object
 * @return string 			   	     The user identifier
 */
$.get_user_id = function(user_data) { return user_data[kTAG_IDENTIFIER][kAPI_PARAM_RESPONSE_FRMT_DISP]; };

/**
* Extract the manager (logged) user identifier from the storage
* @param  bool 			return_data 		If true return the manager (logged) user data instead of its identifier
* @return void 			        		(string) The manager (logged) user identifier | (object) The manager (logged) user data
*/
$.get_manager_id = function() {
	var manager_id = "";
	$.each(storage.get("pgrdg_user_cache.user_data.current"), function(mid, mdata) {
		manager_id = $.get_user_id(mdata);
	});
	return manager_id;
};

/**
* Extract the user full name from a given user data object
* @param  object		user_data 		The user data object
* @return string 				        The user full name
*/
$.get_user_full_name = function(user_data) { return user_data[kTAG_NAME][kAPI_PARAM_RESPONSE_FRMT_DISP]; };

/**
* Extract the user full name from a given user data object
* @param  object		user_data 		The user data object
* @param  bool			show_authority 		Display or not the authority name
* @return string 				        The user full name
*/
$.fn.get_user_work_position = function(user_data, show_authority) {
	var $item = $(this);
	sha = (show_authority === undefined) ? true : show_authority;

	$.get_authority(user_data[kTAG_ENTITY_AFFILIATION][kAPI_PARAM_RESPONSE_FRMT_VALUE][0][kTAG_UNIT_REF], function(authority) {
		var item_data = user_data[kTAG_ENTITY_TITLE][kAPI_PARAM_RESPONSE_FRMT_DISP];
		if(sha) {
			item_data += " at " + authority;
		}
		$item.html(item_data);
	});
};

/**
* Extract the user image path from a given user data object
* @param  object		user_data 		The user data object
* @return string 				        The user image source
*/
$.get_user_img_src = function(user_data) { return "./common/media/img/admin/" + ((user_data[kTAG_ENTITY_ICON][kAPI_PARAM_RESPONSE_FRMT_NAME] == undefined) ? "user_rand_images/" : "user_images/") + user_data[kTAG_ENTITY_ICON][kAPI_PARAM_RESPONSE_FRMT_DISP] };

/**
* Extract the count of user's managed users from a given user data object
* @param  object		user_data 		The user data object
* @return number 				        The count of managed users
*/
$.get_managed_users_count = function(user_data) { return parseInt(user_data[kTAG_MANAGED_COUNT][kAPI_PARAM_RESPONSE_FRMT_DISP]); };

/**
* Extract the count of user's invites from a given user data object
* @param  object		user_data 		The user data object
* @return number 				        The count of invited users
*/
$.get_invited_users_count = function(user_data) { return (user_data[kTAG_INVITES] === undefined) ? 0 : parseInt(user_data[kTAG_INVITES][kAPI_PARAM_RESPONSE_FRMT_DISP]); };

/**
* Generate the manager top box
* @param  object		manager_data 		The user manager data object
*/
$.fn.generate_manager_profile = function(manager_data) {
	var $item = $(this),
	$managers_box = $('<div id="managers">'),
	$managers_box_title = $('<h1>').text(i18n[lang].messages.managed_by),
	$manager_box = $('<div class="manager">'),
	$manager_box_name = $('<h2>'),
	$manager_box_name_link = $('<a>').attr({
		"href": "./Profile#" + $.get_user_id(manager_data)
	}),
	$manager_box_name_position = $('<small class="help-block">').html(i18n[lang].messages.loading_profile),
	$manager_picture_img = $('<img>').attr({
		"src": $.get_user_img_src(manager_data),
		"alt": "me"
	});
	$manager_box_name_position.get_user_work_position(manager_data, false);
	$manager_box_name_link.append($manager_picture_img);
	$manager_box_name_link.append($.get_user_full_name(manager_data));
	$manager_box_name_link.append($manager_box_name_position);
	if($.get_user_id(manager_data) == $.get_manager_id()) {
		$manager_box_name_link.attr("title", i18n[lang].interface.btns.back_to_your_profile);
	}
	$manager_box_name.append($manager_box_name_link);
	$manager_box.append($manager_box_name);
	$managers_box.append($managers_box_title);
	$managers_box.append($manager_box);
	if($("#managers").length === 0) {
		$item.prepend($managers_box);
	}
};

/**
 * Generate the profile of a given user
 * @param  object 		user_data 		The user data object
 */
$.fn.generate_profile = function(user_data) {
	/**
	 * Format a given type of user contact
	 * @param  string 	item      		The kTAG of the contavt item to display
	 * @param  object 	user_data 		The user data object
	 */
	$.fn.display_contact = function(item, user_data) {
		var $item = $(this);
		if(user_data[item] !== undefined) {
			var $root_dt = $('<dt>' + $.ucfirst(user_data[item][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("Entity ", "")) + ':</dt>'),
			$root_dd = $('<dd>'),
			$dl_contact = $('<dl class="dl-horizontal">');
			$.each(user_data[item][kAPI_PARAM_RESPONSE_FRMT_DISP], function(k, v) {
				var $cdt = $('<dt>').text(v[kAPI_PARAM_RESPONSE_FRMT_NAME]),
				$cdd = $('<dd>').html($.linkify(v[kAPI_PARAM_RESPONSE_FRMT_DISP]));
				$dl_contact.append($cdt);
				$dl_contact.append($cdd);
			});
			$root_dd.append($dl_contact);
			$item.append($root_dt);
			$item.append($root_dd);
		}
	};

	/**
	 * List formatted roles from given user data
	 * @param  object 	user_data 		The user data object
	 */
	$.fn.display_roles = function(user_data) {
		var $item = $(this),
		$roles_dl = $('<dl class="dl-horizontal roles">');
		$.each(user_data[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_DISP], function(k, v) {
			var $roles_dt = $('<dt>'),
			$roles_dd = $('<dd>'),
			icon = "";

			switch(user_data[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_VALUE][k]) {
				case kTYPE_ROLE_LOGIN:
					icon = "fa fa-fw fa-sign-in";
					break;
				case kTYPE_ROLE_INVITE:
					icon = "fa fa-fw fa-certificate";
					break;
				case kTYPE_ROLE_UPLOAD:
					icon = "fa fa-fw fa-upload";
					break;
				case kTYPE_ROLE_EDIT:
					icon = "fa fa-fw fa-file-text-o";
					break;
				case kTYPE_ROLE_USERS:
					icon = "fa fa-fw fa-group";
					break;
			}
			$roles_dt.html('<span class="' + icon + ' fa-3x text-success"></span>');
			$roles_dd.html(v[kAPI_PARAM_RESPONSE_FRMT_DISP] + '<i class="help-block">' + v[kAPI_PARAM_RESPONSE_FRMT_INFO] + '</i>');
			$roles_dl.append($roles_dt);
			$roles_dl.append($roles_dd);
		});
		$item.append($roles_dl);
	};

	var $item = $(this);
	if($.storage_exists("pgrdg_user_cache.user_data.current")) {
		if($.get_manager_id() !== $.get_user_id(user_data)) {
			// Managed user profile
			if($.storage_exists("pgrdg_user_cache.user_data.current")) {
				$.each(storage.get("pgrdg_user_cache.user_data.current"), function(mid, manager_data) {
					$("#contents").generate_manager_profile(manager_data);
				});
			}
		} else {
			$("#managers").remove();
		}
	}
	var $super_row = $('<div class="row">'),
	$picture_col = $('<div class="col-xs-12 col-sm-3 col-md-4 col-lg-2 pull-left">'),
	$form_col = $('<div class="col-xs-12 col-sm-9 col-md-8 col-lg-10 pull-right">'),
	$content_left_col = $('<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">'),
	$content_right_col = $('<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">'),
	$user_data_title_row = $('<h1>'),
	$user_data = $('<div class="col-xs-10 col-sm-7 col-sm-8 col-lg-8 pull-left">'),
	$user_data_right_btns = $('<div class="col-xs-2 col-sm-5 col-lg-4 pull-right">'),
	$title = $('<span class="text-left">'),
	$contact_title = $('<h3>').text(i18n[lang].messages.contacts),
	$roles_title = $('<h3>').text((($.get_manager_id() !== $.get_user_id(user_data)) ? i18n[lang].messages.user_permissions : i18n[lang].messages.you_can) + ":"),
	$contact_div = $('<div class="user_data">'),
	$roles_div = $('<div class="user_data">'),
	$edit_profile_btn = $('<a>').attr({
		"class": "btn btn-default-white pull-right",
		"href": "./Profile#Edit/" + $.get_user_id(user_data),
		"title": i18n[lang].interface.btns.edit_profile,
		"data-toggle": "tooltip",
		"data-placement": "right"
	}).html('<span class="hidden-xs">' + i18n[lang].interface.btns.edit_profile + '&nbsp;</span><span class="fa fa-edit"></span>'),
	$work_position = $('<h2>'),
	$picture_ex_upload_btn = $('<span>'),
	$picture_img = $('<img>').attr({
		"src": $.get_user_img_src(user_data),
		"alt": "me"
	}),
	$picture_div = $('<div id="picture">'),
	$static_data = $('<small class="help-block hidden-xs hidden-sm hidden-md">');
	$picture_col.append($picture_div);
	var data_labels = [
		{"label": "invited on","value": $.right_date(user_data[kTAG_VERSION][kAPI_PARAM_RESPONSE_FRMT_DISP])},
		{"label": "Subscribed on","value": $.right_date(user_data[kTAG_RECORD_CREATED][kAPI_PARAM_RESPONSE_FRMT_DISP])},
	];
	for (i = 0; i < 2; i++) {
		var $dl = $('<dl>'),
		$dt = $('<dt>'),
		$dd = $('<dd>');
		$dt.text(data_labels[i].label);
		$dd.text(data_labels[i].value);
		$dl.append($dt);
		$dl.append($dd);
		$static_data.append($dl);
	}

	$picture_col.append($static_data);
	$picture_ex_upload_btn.append($picture_img);
	$picture_div.append($picture_ex_upload_btn);
	$super_row.append($picture_col);
	$title.text($.get_user_full_name(user_data));
	if(user_data[kTAG_ENTITY_TITLE] !== undefined) {
		$work_position.get_user_work_position(user_data, true);
	}
	// Title row
		// User full name
		$user_data_title_row.append($title);
		// Edit button
		$user_data_title_row.append($edit_profile_btn);

		$form_col.append($user_data_title_row);
	// Work position
	$form_col.append($work_position);
	// Contacts
		// Contact title
		$content_left_col.append($contact_title);
		// Contact list
		var $root_dl = $('<dl>');
		$root_dl.display_contact(kTAG_ENTITY_PHONE, user_data);
		$root_dl.display_contact(kTAG_ENTITY_FAX, user_data);
		$root_dl.display_contact(kTAG_ENTITY_EMAIL, user_data);

		$contact_div.append($root_dl);
		$content_left_col.append($contact_div);
	$form_col.append($content_left_col);
	// Roles
		// Roles title
		$content_right_col.append($roles_title);
		// Roles list
		$roles_div.display_roles(user_data);
		$content_right_col.append($roles_div);
	$form_col.append($content_right_col);

	// Separator
	$form_col.append('<hr />');
	// Append all to body content
	$super_row.append($form_col);

	// Place all in the section
	$item.addClass("container-fluid").html($super_row);

	/**
	* Managed users display
	*/
	$item.load_active_users(user_data);

	/**
	 * Invited users display
	 */
	$("#managed_scroller").load_invited_users(user_data);

	$("#loader").hide();
};

/**
* Call the user profile generation depending if data of a given user id is store or not in the storage
* @param  string		user_id 		The user ID string
*/
$.fn.load_user_data = function(user_id) {
	var $item = $(this);
	if(user_id === undefined || user_id === null || user_id === "") {
		if($.storage_exists("pgrdg_user_cache.user_data.current")) {
			window.location.hash = $.get_manager_id();
			$item.generate_profile(storage.get("pgrdg_user_cache.user_data.current." + $.get_manager_id()));
		}
	} else {
		$.get_user(user_id, function(ud){
			$item.generate_profile(ud);
		});
	}
};

/**
* Load all managed users and generate a btns scroll of a given user data manager
* @param  void 			user_data 		The object of user data.
*/
$.fn.load_active_users = function(user_data){
	$.empty_scroller = function(user_data) {
		var $p = $('<p>'),
		$invite_user_btn = $('<a>').attr({
			"href": "javascript:void(0);"
		}).text(i18n[lang].interface.btns.invite_an_user);
		/**
		* Invite users button
		*/
		if($.inArray(kTYPE_ROLE_INVITE, user_data[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_VALUE]) !== -1) {
			$p.html('<span class="fa fa-times fa-2x"></span><br />' + i18n[lang].messages.no_active_users_yet);
			$p.append('<br />');
			$p.append($invite_user_btn);
		} else {
			$p.html('<span class="fa fa-times fa-2x"></span><br />' + i18n[lang].messages.no_created_users);
		}
		return $p;
	};

	var $item = $(this),
	$managed_scroller = ($("#managed_scroller").length == 0) ? $('<div id="managed_scroller">') : $("#managed_scroller"),
	$managed_scroller_title_count_data = $('<small class="text-info">').text($.get_managed_users_count(user_data)),
	$managed_scroller_title_count = $('<sup>').append($managed_scroller_title_count_data),
	$managed_scroller_title = ($("#managed_scroller_title").length === 0) ? $('<h2 id="managed_scroller_title">') : $("#managed_scroller_title"),
	user_id = $.get_user_id(user_data);
	// Fill the managed users title
	$managed_scroller_title.html(user_data[kTAG_MANAGED_COUNT][kAPI_PARAM_RESPONSE_FRMT_NAME] + " ");
	$managed_scroller_title.append($managed_scroller_title_count);
	// Check if current user has managed accounts
	if($.get_managed_users_count(user_data) === 0) {
		// There's no managed accounts, load empty scroll
		$managed_scroller.removeClass("has_data").html($.empty_scroller(user_data));
		if(user_id !== $.get_manager_id()) {
			$managed_scroller.find("p").html('<span class="fa fa-times fa-2x"></span><br />' + i18n[lang].messages.no_created_users);
		}
	} else {
		$managed_scroller.html("");
		// Load managed users in scroll
		$managed_scroller.addClass("has_data");
		$.get_managed_users($.get_user_id(user_data), function(managed_data) {
			var $hash = $.url().fsegment(),
			$managed_picture = $('<ul class="managed_picture list-inline">'),
			$li = $('<li>');

			$.each(managed_data, function(uid, ud) {
				var $h1 = $('<h1>'),
				$a = $('<a>').attr({
					"href": "./Profile#" + $.get_user_id(ud)
				});
				$span = $('<span>'),
				$user_img = $('<img>').attr({
					"src": $.get_user_img_src(ud),
					"alt": $.get_user_full_name(ud)
				});
				$span.text($.get_user_full_name(ud));
				$a.append($user_img).append($span);
				$h1.append($a);
				$li.attr("maged-user-id", $.get_user_id(ud)).append($h1);
				$managed_picture.append($li);
			});
			$managed_scroller.append($managed_picture);
			if($hash[0] !== "Edit") {
				$managed_scroller.fadeIn(300);
			}
		});
	}
	$managed_scroller.insertAfter($item);
	$managed_scroller_title.insertBefore($managed_scroller);
};

/**
* Load all invites of a given user data
* @param  void 			user_data 		The object of user data.
*/
$.fn.load_invited_users = function(user_data) {
	var $item = $(this),
	$invited_box = ($("#data_box").length == 0) ? $('<div id="data_box">') : $("#data_box"),
	$invited_box_title_count_data = $('<small class="text-info">').text($.get_invited_users_count(user_data)),
	$invited_box_title_count = $('<sup>').append($invited_box_title_count_data),
	$invited_box_title = ($("#invited_box_title").length === 0) ? $('<h2 id="invited_box_title">') : $("#invited_box_title"),
	$invited_box_col = ($("#invited_box").length == 0) ? $('<div id="invited_box" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">') : $("#invited_box"),
	$invite_user_btn = $('<a>').attr({
		"href": "./Invite",
		"class": "btn btn-default"
	}).html(i18n[lang].interface.btns.invite_an_user + ' <span class="fa fa-plus"></span>');
	user_id = $.get_user_id(user_data);
	// Fill the managed users title
		// Title provided by Service, replace when Milko come back to work
		// $invited_box_title.html(user_data[kTAG_MANAGED_COUNT][kAPI_PARAM_RESPONSE_FRMT_NAME] + " ");
	$invited_box_title.html(i18n[lang].messages.invited_users + " ");
	$invited_box_title.append($invited_box_title_count);

	if($.get_invited_users_count(user_data) > 0) {
		// Proceed with invites extraction
	} else {
		$invited_box_col.html("<p>" + i18n[lang].messages.no_invited_users_yet + "</p><br />").append($invite_user_btn);
		$invited_box.append($invited_box_col);
	}

	$invited_box.addClass("row").insertAfter($item);
	$invited_box_title.insertBefore($invited_box);
}


/*=======================================================================================
*	EDIT USER
*======================================================================================*/

$.cancel_user_editing = function() {
	apprise(i18n[lang].messages.undo_user_profile.message, {
		title: i18n[lang].messages.undo_user_profile.title,
		icon: "fa-warning",
		titleClass: "text-warning",
		confirm: true,
	}, function(r) {
		if(r) {
			var $hash = $.url().fsegment();
			document.location = "./Profile#" + $hash[1];
		}
	});
};

/**
 * Generate form for manage user data
 */
$.fn.load_user_data_in_form = function(user_id) {
	/**
	 * Add forms for edit typed lists
	 */
	$.fn.add_typed = function() {
		var $item = $(this).closest(".form-group"),
		form_group_type = $.trim($item.attr("class").replace("form-group", "")),
		placeholder = "",
		dataitem = "",
		mid = "",
		cont = 0,
		f = 0;

		$row = $('<div class="row">'),
		$form_group = $('<div class="form-group">'),
		$input_col = $('<div class="col-sm-5">'),
		$input_group = $('<div class="input-group">'),
		$input_group_btn = $('<div class="input-group-btn">'),
		$span_col0 = $('<div class="col-sm-5 control-label text-muted text-left">'),
		$span_col = $('<div class="col-sm-5 control-label text-muted text-left">'),
		$span_col2 = $('<div class="col-sm-5 control-label text-muted text-left">'),
		$label = $('<label class="col-sm-3 control-label">'),
		$label_empty = $('<label class="col-sm-3 control-label">'),
		$span = $('<div class="col-sm-3 control-label text-muted">'),
		$input = $('<input>'),
		$input2 = $('<input>'),
		$plus_btn = $('<a>').attr({
			"href": "javascript:void(0);",
			"onclick": "$(this).add_typed();",
			"class": "btn btn-default-white"
		});
		$span_col.attr("class", "col-sm-2 col-xs-5");
		$span_col2.attr("class", "col-sm-3 col-xs-6 row");

		$.each($item.find(".row:not(.col-xs-6) input"), function(i) {
			if($(this).val().length === 0) {
				cont++;
				$(this).focus();
				return false;
			}
		});
		$.each($item.find(".row:not(.col-xs-6.row) input"), function(i) {
			f++;
			placeholder = $(this).attr("placeholder");
			dataitem = $(this).attr("data-item");
			mid = dataitem + "_" + f;
		});
		if(cont === 0) {
			$input.attr({
				"type": "text",
				"class": "form-control",
				"data-item": dataitem,
				"id": mid + "k",
				"name": mid + "k",
				"placeholder": placeholder,
				"value": ""
			});
			$input2.attr({
				"type": "text",
				"class": "form-control",
				"data-item": dataitem,
				"id": mid + "v",
				"name": mid + "v",
				"placeholder": placeholder,
				"value": ""
			});
			$span_col.append($input);
			$span_col2.append($input2);
			$row.append($label_empty).append($span_col).append($span_col2);
			$item.append('<br />').append($row);
			$row.find("input[value='']:not(:checkbox,:button):visible:first").focus();
			return false;
		}
	};

	if(user_id === undefined || user_id === null || user_id === "") {
		user_id = $.get_manager_id();
	}
	var $item = $(this),
	ud = {},
	i = 0;
	ud[kTAG_RECORD_CREATED] = {};
	ud[kTAG_VERSION] = {};
	ud[kTAG_ENTITY_AFFILIATION] = {};
	ud[kTAG_ENTITY_FNAME] = {};
	ud[kTAG_ENTITY_FNAME] = {};
	ud[kTAG_ENTITY_LNAME] = {};
	ud[kTAG_NAME] = {};
	ud[kTAG_CONN_CODE] = {};
	ud[kTAG_ENTITY_EMAIL] = {};
	ud[kTAG_ENTITY_PHONE] = {};
	ud[kTAG_ENTITY_ICON] = {};
	$.get_user(user_id, function(user_data) {
		$.each(user_data, function(k, v){
			ud[kTAG_VERSION][kAPI_PARAM_DATA_TYPE] = "static";
			ud[kTAG_VERSION][kAPI_RESULT_ENUM_LABEL] = "Invited on";
			ud[kTAG_VERSION][kAPI_PARAM_DATA] = user_data[kTAG_VERSION];

			ud[kTAG_VERSION][kAPI_RESULT_ENUM_LABEL] = "Subscribed on";
			ud[kTAG_RECORD_CREATED][kAPI_PARAM_DATA_TYPE] = "static";
			ud[kTAG_RECORD_CREATED][kAPI_PARAM_DATA] = user_data[kTAG_RECORD_CREATED];

			ud[kTAG_ENTITY_AFFILIATION][kAPI_PARAM_DATA_TYPE] = "read";
			ud[kTAG_ENTITY_AFFILIATION][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_AFFILIATION];

			ud[kTAG_ENTITY_FNAME][kAPI_PARAM_DATA_TYPE] = "edit";
			ud[kTAG_ENTITY_FNAME][kAPI_PARAM_INPUT_TYPE] = "text";
			ud[kTAG_ENTITY_FNAME][kAPI_PARAM_ID] = user_data[kTAG_ENTITY_FNAME][kAPI_PARAM_RESPONSE_FRMT_NAME].replace(/\s+/g, "_").toLowerCase();
			ud[kTAG_ENTITY_FNAME][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_FNAME];

			ud[kTAG_ENTITY_LNAME][kAPI_PARAM_DATA_TYPE] = "edit";
			ud[kTAG_ENTITY_LNAME][kAPI_PARAM_INPUT_TYPE] = "text";
			ud[kTAG_ENTITY_LNAME][kAPI_PARAM_ID] = user_data[kTAG_ENTITY_LNAME][kAPI_PARAM_RESPONSE_FRMT_NAME].replace(/\s+/g, "_").toLowerCase();
			ud[kTAG_ENTITY_LNAME][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_LNAME];

			ud[kTAG_NAME][kAPI_RESULT_ENUM_LABEL] = "Full name";
			ud[kTAG_NAME][kAPI_PARAM_DATA_TYPE] = "edit";
			ud[kTAG_NAME][kAPI_PARAM_INPUT_TYPE] = "text";
			ud[kTAG_NAME][kAPI_PARAM_ID] = user_data[kTAG_NAME][kAPI_PARAM_RESPONSE_FRMT_NAME].replace(/\s+/g, "_").toLowerCase();
			ud[kTAG_NAME][kAPI_PARAM_DATA] = user_data[kTAG_NAME];

			ud[kTAG_CONN_CODE][kAPI_PARAM_DATA_TYPE] = "edit";
			ud[kTAG_CONN_CODE][kAPI_PARAM_INPUT_TYPE] = "text";
			ud[kTAG_CONN_CODE][kAPI_RESULT_ENUM_LABEL] = "Username";
			ud[kTAG_CONN_CODE][kAPI_PARAM_ID] = user_data[kTAG_CONN_CODE][kAPI_PARAM_RESPONSE_FRMT_NAME].replace(/\s+/g, "_").toLowerCase();
			ud[kTAG_CONN_CODE][kAPI_PARAM_DATA] = user_data[kTAG_CONN_CODE];

			ud[kTAG_ENTITY_EMAIL][kAPI_PARAM_DATA_TYPE] = "read_edit";
			ud[kTAG_ENTITY_EMAIL][kAPI_PARAM_INPUT_TYPE] = "email";
			ud[kTAG_ENTITY_EMAIL][kAPI_PARAM_ID] = user_data[kTAG_ENTITY_EMAIL][kAPI_PARAM_RESPONSE_FRMT_NAME].replace(/\s+/g, "_").toLowerCase();
			ud[kTAG_ENTITY_EMAIL][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_EMAIL];

			ud[kTAG_ENTITY_PHONE][kAPI_PARAM_DATA_TYPE] = "edit";
			ud[kTAG_ENTITY_PHONE][kAPI_PARAM_INPUT_TYPE] = "text";
			ud[kTAG_ENTITY_PHONE][kAPI_PARAM_ID] = user_data[kTAG_ENTITY_PHONE][kAPI_PARAM_RESPONSE_FRMT_NAME].replace(/\s+/g, "_").toLowerCase();
			ud[kTAG_ENTITY_PHONE][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_PHONE];

			ud[kTAG_ENTITY_ICON][kAPI_PARAM_DATA_TYPE] = "hide";
			ud[kTAG_ENTITY_ICON][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_ICON];
		});

		var $super_row = $('<div class="row">'),
		$picture_col = $('<div class="col-xs-12 col-sm-4 col-lg-2 pull-left" id="picture_container">'),
		$form_col = $('<div class="col-xs-12 col-sm-8 col-lg-10 pull-right" id="user_data_container">'),
		$picture_shade = $('<div>'),
		$picture_shade_content = $('<span class="fa fa-pencil"></span>'),
		$picture_upload_btn = $('<a id="upload_btn" href="javascript:void(0);">'),
		$picture_upload_btn_input = $('<input style="display: none;" type="file" multiple="" class="upload_btn_input" href="javascript:void(0);">'),
		$picture_img = $('<img>').attr({
			"src": $.get_user_img_src(user_data),
			"alt": "me"
		}),
		$picture_div = $('<div id="picture">'),
		$static_data = $('<small class="help-block">');
		$picture_shade.append($picture_shade_content);
		$picture_upload_btn.append($picture_shade);
		$picture_upload_btn.append($picture_img);
		$picture_div.append($picture_upload_btn);
		$picture_div.append($picture_upload_btn_input);
		$picture_col.append($picture_div);
		$item.html("");

		$.each(ud, function(k, v){
			i++;
			var $row = $('<div class="row">'),
			$form_group = $('<div class="form-group">'),
			$input_col = $('<div class="col-sm-5">'),
			$input_group = $('<div class="input-group">'),
			$input_group_btn = $('<div class="input-group-btn">'),
			$span_col0 = $('<div class="col-sm-5 control-label text-muted text-left">'),
			$span_col = $('<div class="col-sm-5 control-label text-muted text-left">'),
			$span_col2 = $('<div class="col-sm-5 control-label text-muted text-left">'),
			$label = $('<label class="col-sm-3 control-label">'),
			$label_empty = $('<label class="col-sm-3 control-label">'),
			$span = $('<div class="col-sm-3 control-label text-muted">'),
			$input = $('<input>'),
			$input2 = $('<input>'),
			$plus_btn = $('<a>').attr({
				"href": "javascript:void(0);",
				"onclick": "$(this).add_typed();",
				"class": "btn btn-default-white"
			});
			$cancel_btn = $('<a>').attr({
				"href": "javascript:void(0);",
				"onclick": "$.cancel_user_editing();",
				"class": "btn btn-default-white pull-left col-sm-offset-1"
			}).html('<span class="fa fa-angle-left"></span> ' + i18n[lang].interface.btns.cancel),
			$submit = $('<a>').attr({
				"href": "javascript:void(0);",
				"onclick": "$.save_user_data();",
				"class": "btn btn-default pull-right"
			}).html(i18n[lang].interface.btns.save + ' <span class="fa fa-angle-right"></span>');

			$super_row.prepend($picture_col);
			var d = "";
			switch(v[kAPI_PARAM_DATA_TYPE]) {
				case "static":
					var $dl = $('<dl class="visible-sm visible-md visible-lg">'),
					$dt = $('<dt>'),
					$dd = $('<dd>');

					$dt.text(
						(v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("Record ", ""))
					);
					$dd.text($.right_date(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]));

					$dl.append($dt);
					$dl.append($dd);
					$static_data.append($dl);

					$picture_col.append($static_data);
					break;
				case "read":
					if($.is_obj(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]) || $.is_array(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP])) {
						var span_label = (v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("Record ", ""));
						$span.text(span_label);

						var $ul = $('<ul class="list-unstyled">');
						$.each(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_VALUE], function(kk, vv) {
							if($.is_obj(vv) || $.is_array(vv)) {
								$.get_authority(vv[kTAG_UNIT_REF], function(authority) {
									$ul.append('<li>' + vv[kTAG_TYPE] + ": " + authority + '</li>');
								});
							} else {
								$ul.html('<li><i>none</i></li>');
							}
						});
						$span_col.html($ul);

						$row.addClass($.md5(span_label));
						$row.append($span);
						$row.append($span_col);
						$form_group.append($row);
					} else {
						var span_label = (v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("Record ", ""));
						$span.text(span_label);
						$span_col.text($.right_date(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]));

						$row.addClass($.md5(span_label));
						$form_group.append($span);
						$form_group.append($span_col);
					}

					$form_col.append($form_group);
					$super_row.append($form_col);
					break;
				case "read_edit":
					if($.is_obj(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]) || $.is_array(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP])) {
						var span_label = (v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME]);
						$label.attr("for", v[kAPI_PARAM_ID]);
						$label.text(span_label);
						$row.append($label);

						$.each(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP], function(kk, vv) {
							$.each(vv, function(kkk, vvv) {
								$.each(vv, function(kkk, vvv) {
									d = vv[kAPI_PARAM_RESPONSE_FRMT_DISP];
								});
							});
							$span_col0.attr("class", "col-sm-9 col-xs-12").append('<span class="help-block">' + vv[kAPI_PARAM_RESPONSE_FRMT_NAME] + ": " + $.linkify(d) + '</span>');
							$input.attr({
								"type": "text",
								"class": "form-control",
								"data-item": v[kAPI_PARAM_ID],
								"id": v[kAPI_PARAM_ID] + "_k",
								"name": v[kAPI_PARAM_ID] + "_k",
								"placeholder": v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME],
								"value": ""
							});
							$input2.attr({
								"type": (v[kAPI_PARAM_INPUT_TYPE] !== undefined) ? v[kAPI_PARAM_INPUT_TYPE] : "text",
								"class": "form-control",
								"data-item": v[kAPI_PARAM_ID],
								"id": v[kAPI_PARAM_ID] + "_v",
								"name": v[kAPI_PARAM_ID] + "_v",
								"placeholder": v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME],
								"value": ""
							});
							$row.addClass($.md5(span_label));
							$span_col.attr("class", "col-sm-2 col-xs-6 col-sm-offset-3").append($input);
							$span_col2.attr("class", "col-sm-3 col-xs-6 row");
							$plus_btn.html('<span class="fa fa-plus text-center">');
							$input_group_btn.append($plus_btn);
							$input_group.append($input2);
						});
						$input_group.append($input_group_btn);
						$input_col.append($span_col);
						$input_col.append($span_col2);
						$span_col2.append($input_group);
						$row.append($span_col0).append($span_col).append($span_col2);
						$form_group.append($row);
						// $form_col.append('<hr />');
					} else {
						var span_label = (v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("Record ", ""));
						$span.text(span_label);
						$span_col.text($.right_date(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]));

						$row.addClass($.md5(span_label));
						$form_group.append($span);
						$form_group.append($span_col);
					}
					$form_group.addClass(v[kAPI_PARAM_DATA_TYPE] + "_item");
					$form_col.append($form_group);
					$super_row.append($form_col);
					break;
				case "edit":
					// Chiedi a Milko di inserire "info" tra i tag
					var span_label = (v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("Entity ", ""));
					$label.addClass("col-xs-12").attr("for", v[kAPI_PARAM_ID]);
					$label.text(span_label);

					if($.is_obj(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]) || $.is_array(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP])) {
						$row.append($label);
						$.each(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP], function(kk, vv) {
							if($.is_obj(vv) || $.is_array(vv)) {
								$.each(vv, function(kkk, vvv) {
									$input.attr({
										"type": "text",
										"class": "form-control",
										"data-item": v[kAPI_PARAM_ID],
										"id": v[kAPI_PARAM_ID] + "_k",
										"name": v[kAPI_PARAM_ID] + "_k",
										"placeholder": v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME],
										"value": vv[kAPI_PARAM_RESPONSE_FRMT_NAME]
									});
									$input2.attr({
										"type": (v[kAPI_PARAM_INPUT_TYPE] != undefined) ? v[kAPI_PARAM_INPUT_TYPE] : "text",
										"class": "form-control",
										"data-item": v[kAPI_PARAM_ID],
										"id": v[kAPI_PARAM_ID] + "_v",
										"name": v[kAPI_PARAM_ID] + "_v",
										"placeholder": v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME],
										"value": vv[kkk]
									});
									$span_col.attr("class", "col-sm-2 col-xs-6").append($input);
									$span_col2.attr("class", "col-sm-3 col-xs-6 row");
									$plus_btn.html('<span class="fa fa-plus text-center">');
									$input_group_btn.append($plus_btn);
									$input_group.append($input2);
								});
							}
						});
						$input_group.append($input_group_btn);
						$input_col.append($span_col);
						$input_col.append($span_col2);
						$span_col2.append($input_group);
						$row.append($span_col).append($span_col2);
						$form_group.append($row);
						// $form_col.append('<hr />');
					} else {
						$row.append($label);
						$input.attr({
							"type": (v[kAPI_PARAM_INPUT_TYPE] != undefined) ? v[kAPI_PARAM_INPUT_TYPE] : "text",
							"class": "form-control",
							"id": v[kAPI_PARAM_ID],
							"name": v[kAPI_PARAM_ID],
							"placeholder": v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME],
							"value": v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]
						});
						$input_col.attr("class", "col-sm-3 col-xs-12").append($input);
						$row.append($input_col);
					}

					$row.addClass($.md5(span_label));
					$form_group.addClass(v[kAPI_PARAM_DATA_TYPE] + "_item");
					$form_group.append($row);
					$form_col.append($form_group);
					$super_row.append($form_col);

					break;
			}

			if(i === $.obj_len(ud)) {
				$span_col.attr("class", "col-xs-12 col-sm-8 col-md-8 col-lg-8 row").append($cancel_btn).append($submit);
				$row.append($span_col).append($span_col);
				$form_group.addClass("btns-group").append($row);
				$form_col.append($form_group);
				$super_row.append($form_col);
			}
		});
		$item.html($super_row);

		$("#loader").hide();
		// $("a.add_typed").on("click", function() {
		//
		// });
	});
};

/**
 * Save the user data
 */
$.save_user_data = function() {
	$.require_password(function() {
		// $.log_activity("edit personal data");
		alert("ok");
	});
};


/*=======================================================================================
*	INVITE USER
*======================================================================================*/

$.generate_invite_form = function() {
	var $invite_div = ($("#invite_user").length > 0) ? $("#invite_user") : $('<div id="invite_user">'),
	$super_row = $('<div class="row">'),
	$form_col = $('<div class="col-xs-12 col-sm-8 col-lg-10 pull-right" id="invite_container">'),
	$picture_shade = $('<div>'),
	$picture_shade_content = $('<span class="fa fa-pencil"></span>'),
	$picture_upload_btn = $('<a id="upload_btn" href="javascript:void(0);">'),
	$picture_upload_btn_input = $('<input style="display: none;" type="file" multiple="" class="upload_btn_input" href="javascript:void(0);">'),
	$picture_img = $('<span class="ionicons ion-person-add">'),
	$picture_div = $('<div id="picture">'),
	$static_data = $('<small class="help-block">');
	$picture_shade.append($picture_shade_content);
	$picture_upload_btn.append($picture_shade);
	$picture_upload_btn.append($picture_img);
	$picture_div.append($picture_upload_btn);
	$picture_div.append($picture_upload_btn_input);
	// $picture_col.append($picture_div);

	$super_row.append($form_col);

	// $invite_div.html($super_row);
	$("#loader").hide();
};


/*=======================================================================================
*	COMMON FUNCTIONS
*======================================================================================*/

$.log_activity = function(action){
	var st = storage.get("pgrdg_user_cache.user_activity"),
	log = {};
	log[action] = $.now();
	st.push(log);

	storage.set("pgrdg_user_cache.user_activity", st);
	$("span.timeago").timeago();
};

/**
 * Load the last activity saved in log storage
 * @param  bool 	 	full 			If false or unset display only the date in "Y/m/d H:i:s" format
 * @return string		        		Last logged activity
 */
$.last_activity = function(full) {
	full = (full === undefined) ? false : full;
	var last_activity = "";

	if($.storage_exists("pgrdg_user_cache.user_activity")) {
		last_activity = storage.get("pgrdg_user_cache.user_activity");
		var l = last_activity[last_activity.length-1];
		$.each(l, function(label, time) {
			if(full) {
				last_activity = $.ucfirst(label) + ": " + time;
			} else {
				last_activity = time;
			}
		});
	} else {
		if(full) {
			last_activity = "Loaded page (no registered previous data): " + $.now();
		} else {
			last_activity = $.now();
		}
	}
	return last_activity;
};

/**
 * Load profile form or interface depending on the hash
 */
$.load_profile = function() {
	var $hash = $.url().fsegment();
	if($hash.length > 0) {
		if($hash[0] === "Edit") {
			$.get_user($hash[1], function(){
				$("#personal_data").load_user_data_in_form($hash[1]);
				if($("#managed_scroller_title").length > 0) {
					$("#managed_scroller_title").hide();
				}
				if($("#managed_scroller").length > 0) {
					$("#managed_scroller").hide();
				}
				if($("#invited_box_title").length > 0) {
					$("#invited_box_title").hide();
				}
				if($("#data_box").length > 0) {
					$("#data_box").hide();
				}
			});
		} else {
			var user_id = ($hash[0].length > 0 ? $hash[0] : "");
			$("#personal_data").load_user_data(user_id);
			if($("#managed_scroller_title").length > 0) {
				$("#managed_scroller_title").show();
			}
			if($("#managed_scroller").length > 0) {
				$("#managed_scroller").show();
			}
			if($("#invited_box_title").length > 0) {
				$("#invited_box_title").show();
			}
			if($("#data_box").length > 0) {
				$("#data_box").show();
			}
		}
	} else {
		$("#personal_data").load_user_data();
	}
};


$.set_breadcrumb = function() {
	var $hash = $.url().fsegment(),
	user_name = "",
	$ol = ($("#ribbon > ol.breadcrum").length === 0) ? $('<ol class="breadcrumb">') : $("#ribbon > ol.breadcrum"),
	$li_home = $('<li>').addClass("home"),
	$li_home_link = (current_path == "Profile") ? $('<a href="./Profile#' + $.get_manager_id() + '">') : $('<a href="./' + current_path + '">'),
	$li = $('<li>');

	$("#ribbon > ol.breadcrum").remove();
	$li_home_link.text(current_path);
	$li_home.html($li_home_link);
	$ol.html($li_home);
	$.each($hash, function(k, v) {
		if(v.length == 40) {
			user_name = $.get_user_full_name(storage.get("pgrdg_user_cache.user_data.all." + v));
			$li.text(user_name);

			if($hash[1] !== undefined && $hash[1].length == 40) {
				hash_title = $hash[1];
			}
			$ol.append($li);
		}
	});
	$("#ribbon").html($ol);
};

/*======================================================================================*/

$(document).ready(function() {
	$.set_breadcrumb();
	$(window).on("hashchange", function(e) {
		$.set_breadcrumb();
	}).trigger("hashchange");
	switch(current_path) {
		case "Profile":
			var url = "",
			uploadButton = $('<button/>')
			.addClass('btn btn-primary')
			.prop('disabled', true)
			.text('Processing...')
			.on('click', function () {
				var $this = $(this),
				data = $this.data();
				$this
				.off('click')
				.text('Abort')
				.on('click', function () {
					$this.remove();
					data.abort();
				});
				data.submit().always(function () {
					$this.remove();
				});
			});


			$("#loader").addClass("decrypt").show();
			$.load_profile();
			$(window).on("hashchange", function(e) {
				$.load_profile();
			}).trigger("hashchange");

			$("span.timeago").attr("title", $.last_activity()).text($.last_activity(true)).timeago();

			$.add_storage_space_in_panel("Non-logged memory", "pgrdg_cache");
			$.add_storage_space_in_panel("User memory", "pgrdg_user_cache");

			$("#upload_btn").hover(function() {
				// console.log("hover");
				$("#upload_btn div").css("visibility", "visible");
			}, function() {
				// console.log("unhover");
				$("#upload_btn div").css("visibility", "hidden");
			});//.on("click", function() {
			// 	$("#upload_btn_input").trigger("click");
			// 	console.log("triggered");
			// }).fileupload({
			// 	url: url,
			// 	dataType: "json",
			// 	autoUpload: true,
			// 	acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
			// 	maxFileSize: 3000000, // 3 MB
			// 	// Enable image resizing, except for Android and Opera,
			// 	// which actually support image resizing, but fail to
			// 	// send Blob objects via XHR requests:
			// 	disableImageResize: /Android(?!.*Chrome)|Opera/
			// 	.test(window.navigator.userAgent),
			// 	previewMaxWidth: 180,
			// 	previewMaxHeight: 180,
			// 	previewCrop: true,
			// 	add: function (e, data) {
			// 		data.context = $('<button/>').text('Upload')
			// 		.appendTo(document.body)
			// 		.click(function () {
			// 			data.context = $('<p/>').text('Uploading...').replaceAll($(this));
			// 			data.submit();
			// 		});
			// 	},
			// 	done: function (e, data) {
			// 		data.context.text('Upload finished.');
			// 	}
			// });
			break;
		case "Invite":
			$("#loader").show();
			$.generate_invite_form();
			break;
	}
});
