/**
* Main functions
*
* @author Alessandro Gubitosi <gubi.ale@iod.io>
* @license http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @link https://github.com/bioversity/PGRDG/
*/

/*=======================================================================================
*	MAIN FUNCTIONS
*======================================================================================*/

	/**
	* Encrypt asynchronous requests with jCryption
	*
	* Usage: call $.cryptAjax instead of simple $.ajax function
	*
	* @param {string} url     The request target
	* @param {object} options Request params
	*/
	$.cryptAjax = function(url, options) {
		if(!auth) {
			$.jCryption.authenticate(password, "common/include/funcs/_ajax/_decrypt.php?getPublicKey=true", "common/include/funcs/_ajax/_decrypt.php?handshake=true", function(AESKey) {
				auth = true;
				$.ajax(url, options);
			});
		} else {
			$.ajax(url, options);
		}
	};

	/**
	* Creates and send the request to Service
	* @param  {void}  options  String or object of the request to Service
	* @param  {Function} callback
	*/
	$.ask_to_service = function(options, callback) {
		var opt = $.extend({
			storage_group: "ask",
			loaderType: "external",
			kAPI_REQUEST_OPERATION: "",
			parameters: {
				kAPI_REQUEST_LANGUAGE: lang,
				kAPI_REQUEST_PARAMETERS: {
					kAPI_PAGING_LIMIT: 50,
					kAPI_PARAM_LOG_REQUEST: "true",
					kAPI_PARAM_TAG: ""
				}
			}
		}, options);
		var param, param_nob64, verbose_param, object_param = {};
		if(typeof(options) == "string") {
			param = kAPI_REQUEST_OPERATION + "=" + $.utf8_to_b64(options) + "&" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "={}";
			param_nob64 = "http://pgrdg.grinfo.private/Service.php?" + kAPI_REQUEST_OPERATION + "=" + options + "&" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "={}";
			verbose_param = "http://pgrdg.grinfo.private/Service.php?" + kAPI_REQUEST_OPERATION + " BASE64(" + options + ") &" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "={}";

			object_param[kAPI_REQUEST_OPERATION] = options;
			object_param[kAPI_REQUEST_LANGUAGE] = lang;
			object_param[kAPI_REQUEST_PARAMETERS] = {};
		} else {
			param = kAPI_REQUEST_OPERATION + "=" + $.utf8_to_b64(opt[kAPI_REQUEST_OPERATION] + "&" + kAPI_REQUEST_LANGUAGE + "=" + opt.parameters[kAPI_REQUEST_LANGUAGE] + "&" + kAPI_REQUEST_PARAMETERS + "=" + JSON.stringify(opt.parameters[kAPI_REQUEST_PARAMETERS]));
			param_nob64 = "http://pgrdg.grinfo.private/Service.php?" + kAPI_REQUEST_OPERATION + "=" + opt[kAPI_REQUEST_OPERATION] + "&" + kAPI_REQUEST_LANGUAGE + "=" + opt.parameters[kAPI_REQUEST_LANGUAGE] + "&" + kAPI_REQUEST_PARAMETERS + "=" + encodeURI(JSON.stringify(opt.parameters[kAPI_REQUEST_PARAMETERS]));
			verbose_param = "http://pgrdg.grinfo.private/Service.php?" + kAPI_REQUEST_OPERATION + "= BASE64(" + opt[kAPI_REQUEST_OPERATION] + "&" + kAPI_REQUEST_LANGUAGE + "=" + opt.parameters[kAPI_REQUEST_LANGUAGE] + "&" + kAPI_REQUEST_PARAMETERS + "= URL_ENCODED(" + JSON.stringify(opt.parameters[kAPI_REQUEST_PARAMETERS]) + "))";

			object_param[kAPI_REQUEST_OPERATION] = opt[kAPI_REQUEST_OPERATION];
			object_param[kAPI_REQUEST_LANGUAGE] = opt.parameters[kAPI_REQUEST_LANGUAGE];
			object_param[kAPI_REQUEST_PARAMETERS] = opt.parameters[kAPI_REQUEST_PARAMETERS];
		}
		if(!storage.isEmpty("pgrdg_cache." + opt.storage_group) && storage.isSet("pgrdg_cache." + opt.storage_group + "." + $.md5(param))) {
			var response = storage.get("pgrdg_cache." + opt.storage_group + "." + $.md5(param) + ".response");
			if(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok") {
				response.id = $.md5(param);
				callback(response);
			} else {
				if(developer_mode) {
					alert("There's an error in the response:<br />See the console for more informations");
					console.group("The Service has returned an error");
						console.error(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE]);
						console.warn(param);
						console.warn(param_nob64);
						console.warn(verbose_param);
						console.warn(object_param);
						console.dir(response);
					console.groupEnd();
				}

				$("body").bind("keydown", "esc", function(e) {
					$(".modal").modal("hide");
				});
			}
		} else {
			if(typeof(opt.loaderType) == "string") {
				if(!$("#marker_content").is(":visible")) {
					if($("#apprise.ask_service").length === 0) {
						apprise("", {class: "ask_service", title: "Extracting data...", titleClass: "text-info", icon: "fa-circle-o-notch fa-spin", progress: true, allowExit: false});
					} else {
						if($("#apprise.ask_service").css("display") == "none") {
							$("#apprise.ask_service").modal("show");
						}
					}
				}
			} else {
				var $element = opt.loaderType,
				element_data = $element.html();
				$element.html('<span class="fa fa-fa fa-refresh fa-spin"></span>');
			}
			if(developer_mode) {
				console.group("Storage \"" + opt.storage_group + "\" saved...");
				console.warn("id: ", $.md5(param));
				console.groupEnd();
			}
			$.cryptAjax({
				url: "API/",
				dataType: "json",
				type: "POST",
				timeout: 30000,
				data: {
					jCryption: $.jCryption.encrypt(param, password),
					type: "ask_service"
				},
				success: function(response) {
					response.id = $.md5(param);
					if(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok") {
						storage.set("pgrdg_cache." + opt.storage_group + "." + $.md5(param), {"date": {"utc": new Date(), "timestamp": $.now()}, "query": {"effective": param, "nob64": param_nob64, "verbose": verbose_param, "obj": object_param}, "response": response});
						if(typeof(opt.loaderType) == "string") {
							$("#apprise.ask_service").modal("hide");
							callback(response);
						} else {
							$element.html(element_data);
							callback(response);
						}
					} else {
						if(developer_mode) {
							console.warn("!!!", param_nob64, response);
							alert("There's an error in the response:<br />See the console for more informations");
							console.group("The Service has returned an error");
								console.error(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE]);
								console.warn(param);
								console.warn(param_nob64);
								console.warn(verbose_param);
								console.warn(object_param);
								console.dir(response);
							console.groupEnd();
						}
					}
				},
				error: function(response) {
					if(developer_mode) {
						console.warn("!!!", response);
						console.group("The Service has returned an error");
							console.error(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE]);
							console.warn(param);
							console.warn(param_nob64);
							console.warn(verbose_param);
							console.warn(object_param);
							console.dir(response);
						console.groupEnd();
					}
					$("#apprise.ask_service").modal("destroy");
					if($("#apprise.service_coffee").length === 0) {
						apprise("The Service is temporarily unavailable.<br />Try again later...", {class: "service_coffee", title: "Taking coffee...", titleClass: "text-warning", icon: "fa-coffee", progress: true, allowExit: false});
					}
					setTimeout(function() {
						$.ask_to_service(options, callback);
					}, 3000);
				}
			});
		}
	};

	/**
	* Manage the left panel
	* @param  {string}   subject  Direct action to execute (open|close)
	* @param  {int}      width    The size in pixel of the panel. Default is 488px
	* @param  {Function} callback
	*/
	$.left_panel = function(subject, width, callback) {
		if(width === "" || width === undefined) {
			width = ($(window).width() > 420) ? 300 : $(window).width();
		}
		movement = width;
		width += "px";
		$("#left_panel").css({
			"width": width
		});
		var content_witdth = $("#forms-body").css("width");

		//if($.is_touch_device()) {
			if($(window).width() < 420) {
				$(window).swipe({
					swipeStatus:function(event, phase, direction, distance, duration, fingerCount) {
						if(direction == "left") {
							if($("#left_panel").hasClass("visible") && distance >= 0 && distance < parseInt(width)) {
								$("#left_panel").css({"left": "-" + distance + "px"});
							//	$("header").css({"left": (parseInt($("#left_panel").css("left")) + parseInt(width)) + "px"});
							}
							$("section #contents").css({"left": ((parseInt($("#left_panel").css("left")) + parseInt(width)) + 5) + "px"});
						}
						if(direction == "right") {
							if(!$("#left_panel").hasClass("visible") && distance >= 0 && distance < parseInt(width)) {
								$("#left_panel").css({"left": "-" + (parseInt(width) - distance) + "px"});
							//	$("header").css({"left": ((parseInt($("#left_panel").css("left")) + parseInt(width)) + 5) + "px"});
							}
							$("section #contents").css({"left": ((parseInt($("#left_panel").css("left")) + parseInt(width)) + 5) + "px"});
						}
					},
					swipeLeft: function(event, direction, distance, duration, fingerCount) {
						if(parseInt($("#left_panel").css("left")) <= -(parseInt(width)/2)) {
							$.left_panel("close");
						} else {
							$.left_panel("open");
						}
					},
					swipeRight: function(event, direction, distance, duration, fingerCount) {
						if(parseInt($("#left_panel").css("left")) >= -(parseInt(width)/2)) {
							$.left_panel("open");
						} else {
							$.left_panel("close");
						}
					},
					treshold: 100
				});
			}
		//}
		if($("#left_panel").hasClass("visible") && subject !== "open") {
			switch(subject) {
				case "close":
					// Move all document to the left
					if($(window).width() < 420) {
						$("section #contents").animate({"left": "0px"}, 200, "swing");
						$("header").animate({"left": 0});
					}
					$(".olControlZoom, .leaflet-control-zoom").animate({"left": "0"}, 200);
					$("#left_panel").animate({"left": "-" + width}, 200, "swing", function() {
						$.resize_forms_mask();
						$(this).removeClass("visible");
						if($("#start h1").css("margin-top").replace("px", "") >= 85) {
							$("#start h1").animate({"margin-top": "85px"}, 200);
						}

						// Callback
						if (typeof callback == "function") {
							callback.call(this);
						}
					});
					$("#breadcrumb").animate({"padding-left": "0px"}, 200).find(".breadcrumb");
					if(document.location.hash !== "#Map") {
						$("#breadcrumb").animate({"padding-left": "0px"}, 200);
						$("#breadcrumb .breadcrumb").animate({"padding-left": "40px"}, 200);
					}
					if($(window).width() >= 420) {
						$(".panel_content-head, .panel_content-body, #start h1").animate({"padding-left": "35px"}, 200, function() {
							if(document.location.hash !== "#Map") {
								$("#left_panel .folder_menu").animate({"right": "-165px"}, 200);
							}
						});
					} else {
						$(".panel_content-head, .panel_content-body, #start h1").animate({"padding-left": "15px"}, 200, function() {
							if(document.location.hash !== "#Map") {
								$("#left_panel .folder_menu").animate({"right": "-165px"}, 200);
							}
						});
					}
					break;
				case "is_closed":
					return ($("#left_panel").css("left") !== "0px") ? true : false;
				default:
					$.left_panel("close");
					break;
			}
			// Save the left_panel position
			storage.set("pgrdg_cache.interface.left_panel", {status: "closed"});
		} else {
			switch(subject) {
				case "check":
					// Check the last left_panel saved position and restore it
					var left_panel_status = "open";
					if(storage.isSet("pgrdg_cache.interface")) {
						left_panel_status = storage.get("pgrdg_cache.interface.left_panel.status");
					}
					if(left_panel_status == "open") {
						$.left_panel("open");
					} else {
						$("#left_panel").addClass("visible").css({"left": "-" + width});
						$.left_panel("close");
						$("#start h1").animate({"margin-top": "85px"});
					}
					$.left_panel(left_panel_status);
					break;
				default:
					//console.log("open");
					// Move all document to the right
					if($(window).width() < 420) {
						$("section #contents").animate({"left": width}, 200);
					//	$("header").animate({"left": width}, 200);
					}
					$("#left_panel .folder_menu").animate({"right": (parseInt(width) - 2) + "px"}, 200, function() {
						$("#forms").animate({"left": "0"}, 200);
						if($("#start h1").css("margin-top").replace("px", "") <= 120) {
							$("#start h1").animate({"margin-top": "120px"}, 200);
						}
						$(".olControlZoom, .leaflet-control-zoom").animate({"left": width}, 200);
						$("#left_panel").animate({"left": "0"}, 200, "easeOutExpo", function() {
							$.resize_forms_mask();
							$(this).addClass("visible");

							$(this).find("input[type=search]");
							if($(window).width() < 420) {
								$(this).find("input[type=search]");
							} else {
								$(this).find("input[type=search]").focus();
							}
							// Callback
							if (typeof callback == "function") {
								callback.call(this);
							}
						});
						$("#breadcrumb").animate({"padding-left": width}, 200).find(".breadcrumb").animate({"padding-left": "15px"}, 200);
					});
					$(".panel_content-head, .panel_content-body, #start h1").delay(200).animate({"padding-left": (movement+15) + "px"}, 150);
					// Save the left_panel position
					storage.set("pgrdg_cache.interface.left_panel", {status: "open"});
					break;
			}
		}
	};

	/**
	* Dinamically adjust forms mask depending the document size
	*/
	$.resize_forms_mask = function() { $.each($(".panel-mask"), function(i, d) { $(this).css("width", (parseInt($(this).closest(".vcenter").find(".panel").css("width")) - 1) + "px"); }); };

	/**
	* Manage hash part of querystring
	* @param  {string} hash The hash to manage
	*/
	$.manage_url = function(hash) {
		var active_li = 0,
		visible_div = 0;

		if(hash === undefined || hash === null || hash === "") {
			hash = "";
		}
		$.each($("#contents > div:not(:hidden)"), function() {
			visible_div++;
		});
		if(hash.length > 0) {
			document.location.hash = hash;

			if($("#breadcrumb #goto_" + hash.toLowerCase() + "_btn").css("display") == "none") {
				$("#breadcrumb #goto_" + hash.toLowerCase() + "_btn").fadeIn(300);
			}
			// Show the content in page
			$("#" + hash.toLowerCase()).fadeIn(300);

			$.each($("#breadcrumb .breadcrumb li:visible"), function(i, v) {
				var item_id = $(this).attr("id"),
				ttext = item_id.replace("goto_", "").replace("_btn", "");

				if(hash.length > 0) {
					if($.trim($("#" + item_id).text()) !== hash) {
						var blink_title = "Return to " + ttext + " panel";
						$(this).find("span.txt").html('<a href="javascript:void(0);" onclick="$.manage_url(\'' + $.ucfirst(ttext) + '\');" title="' + blink_title + '">' + $.ucfirst(ttext) + '</a>').closest("li").removeClass("active");
					} else {
						$(this).find("span.txt").text(hash).closest("li").addClass("active");
					}
					$("#breadcrumb a").tooltip({container: "body"});
					$("#breadcrumb a").bind("click mousedown", function() { $(this).tooltip("hide"); });
				}

			});

			if(hash == "Map") {
				$.left_panel("close");
				$("#map_toolbox").delay(600).animate({"right": "0"}, 300);
				$("#contents .panel_content").hide();
				$("#map, #pgrdg_map").fadeIn(300);
			} else {
				if($.left_panel("is_closed")) {
					$.left_panel("check");
				}
				if(current_path !== "Map" || hash !== "Map") {
					if(hash.length > 0) {
						$("#contents > div:not(#" + hash.toLowerCase() + ")").hide();
						$("#contents #" + hash.toLowerCase()).fadeIn(300);
					}
				}
			}
		}
	};

/*=======================================================================================
*	KEYBOARD SHORTCUTS
*======================================================================================*/

	/**
	* Enable shortcuts
	*
	* You can see all available characters key here:
	* http://htmlpreview.github.io/?https://github.com/jeresig/jquery.hotkeys/master/test-static-05.html
	*
	* Note: consider that some browser can confuse keyboard layout.
	*/
	$.shortcuts = function() {
										// ALT + 0
		$("body, #find_location input").bind("keydown", "alt+0", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$.center_map_on("World");
				$("#selected_zone").text("World").fadeIn(300);
			}
			return false;
										// ALT + 1
		}).bind("keydown", "alt+1", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$.center_map_on("Africa");
			}
			return false;
										// ALT + 2
		}).bind("keydown", "alt+2", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$.center_map_on("Antarctica");
			}
			return false;
										// ALT + 3
		}).bind("keydown", "alt+3", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$.center_map_on("Asia");
			}
			return false;
										// ALT + 4
		}).bind("keydown", "alt+4", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$.center_map_on("Europe");
			}
			return false;
										// ALT + 5
		}).bind("keydown", "alt+5", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$.center_map_on("North America");
			}
			return false;
										// ALT + 6
		}).bind("keydown", "alt+6", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$.center_map_on("Oceania");
			}
			return false;
										// ALT + 7
		}).bind("keydown", "alt+7", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$.center_map_on("South America");
			}
			return false;
										// ALT + 8
		}).bind("keydown", "alt+8", function(e) {
			if($("header").hasClass("map")) {
			}
			return false;
										// ALT + 9
		}).bind("keydown", "alt+9", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				// Fix for ALT+I and F1 confusion
				if(e.keyCode == 105){
					return false;
				} else {
					return false;
				}
			}
			return false;
										// ALT + i and ALT + F1
		}).bind("keydown", "alt+i F1", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				if(e.keyCode != 105){
					$.show_help();
				}
			}
			return false;
										// ALT + F
		}).bind("keydown", "alt+f", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				// Fix for ALT+6 confusion
				if(e.keyCode == 70){
					if(!$("#pgrdg_map").hasClass("locked")) {
						$.sub_toolbox("find_location");
					}
					return false;
				} else {
					return false;
				}
			}
			return false;
										// ALT + L
		}).bind("keydown", "alt+l", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$.toggle_lock_view();
			}
			return false;
										// ALT + T
		}).bind("keydown", "alt+t", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				if(!$("#pgrdg_map").hasClass("locked")) {
					$.sub_toolbox("change_map");
				}
			}
			return false;
										// ALT + + (plus key)
		}).bind("keydown", "alt++", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				if(!$("#pgrdg_map").hasClass("locked")) {
					$("#selected_zone").text("Zoom in").fadeIn(300);
					$.increase_zoom();
				}
			}
			return false;
										// ALT + - (minus key)
		}).bind("keydown", "alt+-", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				if(!$("#pgrdg_map").hasClass("locked")) {
					$("#selected_zone").text("Zoom out").fadeIn(300);
					$.decrease_zoom();
				}
			}
			return false;
										// ALT + (left arrow key)
		}).bind("keydown", "alt+left", function(e) {
			$.left_panel("close");
			return false;
										// ALT + (right arrow key)
		}).bind("keydown", "alt+right", function(e) {
			$.left_panel("open");
			return false;
										// ESC
		}).bind("keydown", "esc", function(e) {
			e.preventDefault();
			//$.left_panel("close");
			if($("header").hasClass("map")) {
				//$.stop_measurements();
				$.sub_toolbox("close");
			}
			return false;
										// ALT [keydown]
		}).bind("keydown", "alt", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$("#information_zone").html('<table><tr><th><tt>ALT<small style="font-weight: normal;">+</small>F</tt></th><td>Search a location inside a map</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>L</tt></th><td>Lock/unlock map navigation</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>T</tt></th><td>Open/close map background layer preferences</td></tr><tr><th><br /><tt>ALT<small style="font-weight: normal;">+</small>+</tt></th><td><br />Zoom in</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>-</tt></th><td>Zoom out</td></tr><tr><th><br /><tt>ALT<small style="font-weight: normal;">+</small>0</tt></th><td><br />Entire world</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>1</tt></th><td>Africa</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>2</tt></th><td>Antarctica</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>3</tt></th><td>Asia</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>4</tt></th><td>Europe</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>5</tt></th><td>North America</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>6</tt></th><td>Oceania</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>7</tt></th><td>South America</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>9</tt></th><td>User position</td></tr></table>');
				$("#selected_zone").delay(1000).fadeOut(600, function() { $(this).text(""); });
			}
										// ALT [keyup]
		}).bind("keyup", "alt", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$("#information_zone").html("");
				if(!$("#pgrdg_map").hasClass("locked")) {
					$("#selected_zone").delay(1000).fadeOut(600, function() { $(this).text(""); });
				}
			}
		});
										// ENTER
		$("#find_location input").bind("keydown", "return", function() {
			//$.sub_toolbox("find_location");
			$.search_location($(this).val());
		});
	};


/*======================================================================================*/

$(document).ready(function() {
	if(!$.browser_cookie_status()) {
		apprise('Your browser has cookies disabled.<br />Please, activate your cookies to let the system works properly, and then <a href="javascript:void(0);" onclick="location.reload();">reload the page</a>.', {title: "Enable yor cookie", icon: "warning", progress: true, allowExit: false});
	} else {
		// Use bootstrap apprise instead javascript's alert
		window.alert = function(string, args, callback) {
			if(args === undefined) {
				args = [];
				args.title = "Warning";
				args.icon = "warning";
			}
			return apprise(string, args, callback);
		};
		$("#loginform").jCryption();
		$("nav a[title]").tooltip({placement: "bottom", container: "body"});
		$("#map_toolbox a, #map_sub_toolbox a").tooltip({placement: "left", container: "body"}).click(function() {
			$(this).tooltip("hide");
		});

		$("#btn-login").click(function() {

		});
		$.shortcuts();
		$("#login").on("shown.bs.modal", function() {
			$("#login_btn").removeClass("disabled").attr("disabled", false).click(function() {
				$.cryptAjax({
					url: "API/index.php",
					dataType: "json",
					type: "POST",
					data: {
						jCryption: $.jCryption.encrypt($("#loginform").serialize(), password),
						type: "login"
					},
					success: function(response) {
						if(developer_mode) {
							//console.log(response);
						}
					}
				});
			});
			$("#login-username").focus();
		});

		if(current_path == "Search") {
			document.location.hash = "";
			window.onhashchange = function() {
				$.manage_url();
			};
			$.manage_url();
		}
	}
});
