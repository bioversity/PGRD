/*jshint scripturl:true*/
/*jshint -W030 */

/**
* Defined global variables
*
* @author Alessandro Gubitosi <gubi.ale@iod.io>
* @license http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @link https://github.com/bioversity/PGRDG/
*/

/*=======================================================================================
*	COMMON FUNCTIONS
*======================================================================================*/

/**
* Convert all applicable characters to HTML entities
*
* This function is a porting of php's htmlentities()
*
* @param  string        str             The html string to encode
* @return string                        The string encoded
*/
$.html_encode = function(str){ return $("<div/>").text(str).html(); };

/**
* Convert all HTML entities to their applicable characters
*
* This function is a porting of php's html_entity_decode()
*
* @param  string 	str             The htmlentity string to decode
* @return string                        The string decoded
*/
$.html_decode = function(str){ return $("<div/>").html(str).text(); };

/**
* URL-encode according to RFC 3986
*
* This function is a porting of php's rawurlencode()
*
* @param  string        str      	The string to encode
* @return string                        The string encoded
*/
$.rawurlencode = function(str) { str = (str+'').toString(); return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A'); };

/**
* Decode URL-encoded strings
*
* This function is a porting of php's rawurldecode()
*
* @param  string        str             The string to decode
* @return string                        The string decoded
*/
$.rawurldecode = function(str) { return decodeURIComponent((str + '').replace(/%(?![\da-f]{2})/gi, function () { return '%25'; })); };

/**
* Encodes data with MIME base64
*
* This function is a porting of php's base64_encode()
*
* @param  string 	str           The string to encode
* @return string                      The string encoded
*/
$.utf8_to_b64 = function(str) { return window.btoa(unescape(encodeURIComponent(str))); };

/**
* Decodes data encoded with MIME base64
*
* This function is a porting of php's base64_decode()
*
* @param  string 	str           The string to decode
* @return string                      The string decoded
*/
$.b64_to_utf8 = function(str) { return decodeURIComponent(escape(window.atob(str))); };

/**
* Make a string's first character uppercase
*
* This function is a porting of php's ucfirst()
*
* @param  string      str               The string to manipulate
* @return string                        Ucase converted string
*/
$.ucfirst = function(str) { str += ""; var f = str.charAt(0).toUpperCase(); return f + str.substr(1); };

/**
 * Repeat a string for 'n' times
 *
 * @param  string     string            The string to repeat
 * @param  number     n                 The number of times to repeat
 * @return string                       Repeated string
 */
$.str_repeat = function(string, n) { return new Array(parseInt(num) + 1).join(string); };

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * @param int 		min			The minimum number
 * @param int 		max			The maximum number
 */
$.rand_int = function(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; };

/**
 * Removes duplicate values from an array
 *
 * @param  array      array             The array to parse
 * @return array                        The filtered array
 */
$.array_unique = function(array){ return array.filter(function(el, index, arr) { return index == arr.indexOf(el); }); };

/**
 * Clean an array from empty fields
 * @param  array      array             The array to clean
 * @return array                        The cleaned array
 */
$.array_clean = function(array) { return array.filter(function(v){ return v !== ""; }); };

/**
 * Remove an item from an array
 * @param  array      array             The target array
 * @param  string     item              The item to remove
 * @return array                        The array without the provided item
 */
$.array_remove = function(array, item) { y = $.grep(array, function(value) { return value != item; }); return y; };

/**
* Return if browser has cookie allowed
* @return {bool}   Browser cookie permission
*/
$.browser_cookie_status = function() { var cookieEnabled = (navigator.cookieEnabled) ? true : false; if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) { document.cookie = "testcookie"; cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false; } return (cookieEnabled); };

/**
* Generates a random id
* @return string Random uuid
*/
$.makeid = function() { var text = "", possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; for(var i = 0; i <= 16; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); } return text; };

/**
* Generates a random uuid
* @return string Random uuid
*/
$.uuid = function() { return Math.round(new Date().getTime() + (Math.random() * 100)); };

/**
* Like $.serializeArray(), serialize a form as object
* @return {object}     Forms data
*/
$.fn.serializeObject = function() { var o = {}; var a = this.serializeArray(); $.each(a, function() { if (o[this.name] !== undefined) { if (!o[this.name].push) { o[this.name] = [o[this.name]]; } o[this.name].push(this.value || ''); } else { o[this.name] = this.value || ''; }}); return o; };

/**
* Determine the length of an object
* @param  {object}  The object to analize
* @return {int}     The object length
*/
$.obj_len = function(obj) { var count = 0, i; for(i in obj) { if (obj.hasOwnProperty(i)) { count++; }} return count; };

/**
 * Detect if given item is an object
 * @param  {void}  item    The item to analyze
 * @return {Boolean}
 */
$.is_obj = function(item) { return ($.type(item) == "object" ? true : false); };

/**
* Detect if given item is an array
* @param  {void}  item    The item to analyze
* @return {Boolean}
*/
$.is_array = function(item) { return $.isArray(item); };

/**
 * Return current date and time in "yyyy/mm/dd hh:ii:ss" format
 * @return {string}       Current date and time
 */
$.now = function() { var d = new Date(); return d.getFullYear() + "/" + (((d.getMonth() + 1) <= 9) ? "0" : "") + (d.getMonth() + 1) + "/" + ((d.getDate() <= 9) ? "0" : "") + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(); };

/**
 * Convert an epoch date to locale formatted date
 * @param       int             date            Epoch date
 * @return      string                          Converted date
 */
$.epoch2locale = function(date) { return date.toLocaleString("en", {"day": "numeric", "month": "numeric", "year": "numeric", "hour": "numeric", "minute": "numeric"}); };

/**
 * An utility function to find all URLs - FTP, HTTP(S) and Email - in a text string
 * and return them in an html link.
 * Taken from http://stackoverflow.com/a/3890175
 *
 * @param       string        text            The text to be searched.
 * @param       string        ref             If text is passed will ask the service for the right name
 * @return an array of URLs.
 */
$.linkify = function(string, address) {
        var replacedText, replacePattern1, replacePattern2, replacePattern3;
        if(address === undefined) {
                if($.type(string) == "array") {
                        string = string.join(", ");
                }

                //URLs starting with http://, https://, or ftp://
                replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
                if(replacePattern1 !== undefined) {
                        replacedText = string.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
                } else {
                        replacedText = string;
                }

                //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
                replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
                if(replacePattern2 !== undefined) {
                        replacedText = replacedText.replace(replacePattern2, '$1 <a href="http://$2" target="_blank">$2</a>');
                } else {
                        replacedText = string;
                }

                //Change email addresses to mailto:: links.
                replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
                if(replacePattern3 !== undefined) {
                        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
                } else {
                        replacedText = string;
                }
        } else {
                replacedText = '<a href="' + address + '" target="_blank">' + string + '</a>';
        }

        return replacedText;
};

/**
 * Connvert a string to a local link
 */
$.str_to_local_link = function(string) {
        var host = $.url().attr("host"),
        link = string;
        if(link === undefined || link === null || link === "" || link == "/" || link == "./") {
                link = $.linkify(host, "http://" + host);
        } else {
                if(link.charAt(0) == "/" || link.charAt(0) == ".") {
                        link = $.linkify(link.replace(/\//g, ""), "http://" + host + link.replace(/(\.)\//g, ""));
                } else {
                        link = $.linkify(link);
                }
        }
        return link;
};

/**
 * Convert back a local link to a string
 */
$.local_link_to_str = function(local_link) {
        var host = $.url().attr("host"),
        local_link_txt = local_link.replace(/(<([^>]+)>)/ig, "");
        link_txt = "";

        if(local_link_txt == host) {
                link_txt = "./";
        } else {
                link_txt = local_link_txt.replace(host, "").replace(": ", ":").replace(/\s/g, "_");
        }
        return link_txt;
};

/**
 * Detect the type of value for table sorting purposes
 */
$.detect_type = function(value) {
        if($.isNumeric(value)) {
                if(value % 1 === 0){
                        return "int";
                } else{
                        return "float";
                }
        } else if(Date.parse(value)) {
                return "date";
        } else {
                return "string-ins";
        }
};

/**
 * Highlight text for more readability
 */
$.highlight = function(string) {
        $.searched_words = function(text) {
                if(current_path == "Search") {
                        var subj = [],
                        text_search = $("#search_form").val(),
                        re = new RegExp(text_search, "gi");

                        var quotes = text_search.match(/("[^"]+"|[^"\s]+)/gi);
                        $.each(quotes, function(k, v) {
                                if(v !== undefined) {
                                        if(v.charAt(0) == "-") {
                                                quotes.splice(k, 1);
                                        }
                                        if(v.charAt(0) == '"') {
                                                quotes[k] = v.replace(/^[^"]*"|".*/gi, "");
                                        }
                                }
                        });
                        $.each(quotes, function(k, v) {
                                var ree = new RegExp(v, "gi");
                                if(text.search(ree) > -1) {
                                        text = text.replace(ree, function(matched) {
                                                return '<strong class="text-danger">' + matched + '</strong>';
                                        });
                                }
                                if(text.toLowerCase() == v.toLowerCase()) {
                                        text = text.replace(text, '<strong class="text-danger">' + text + '</strong>');
                                }
                        });

                        return text;
                } else {
                        return text;
                }
        };
        // Is a number or a digit
        if($.isNumeric(string)) {
                return '<span style="color: #099;">' + string + '</span>';
        // Is a date
        } else if (Date.parse(string)) {
                return '<span style="color: #7c4a4a;">' + string + '</span> <sup class="text-muted"><span class="fa fa-clock-o"></span></sup>';
        } else {
                return $.searched_words($.linkify(string));
        }
};

/**
 * Detect the date type and returns in readable format
 * @param  string date The string to parse
 * @return string      The date in readable format
 */
$.right_date = function(date) {
        $.addZero = function(i) {
                if (i < 10) {
                        i = "0" + i;
                }
                return i;
        };
        $.datepicker.regional[lang];

        // Is year
        if(date.length == 4) {
                return date;
        } else if(date.length == 6) {
                return $.datepicker.formatDate("MM, yy", date);
        } else if(date.length == 8) {
                var d = date.split("");
                return $.datepicker.formatDate("MM dd, yy", new Date(d[0]+d[1]+d[2]+d[3]+ "/" + d[4]+d[5] + "/" + d[6]+d[7]));
        } else {
                var dd = new Date(date),
                time = $.addZero(dd.getHours()) + ":" + $.addZero(dd.getMinutes()) + ":" + $.addZero(dd.getSeconds());
                return $.datepicker.formatDate("MM dd, yy", new Date(date)) + " " +  time;
        }
};

/**
 * Clean the file name for upload purposes
 * @param  string 			text 					The file name
 * @return string      								The cleaned file name
 */
$.clean_file_name = function(text) { text = text.replace(/\./g, ""); return text.replace(/\//g, "-").replace(/\:/g, "~").replace(/\s/g, "_"); };

/**
 * Parse query string paramaters into an object.
 * taken from https://gist.github.com/kares/956897
 *
 * @param string query
 */
$.parse_params = function(query) {
        var re = /([^&=]+)=?([^&]*)/g,
        decodeRE = /\+/g, // Regex for replacing addition symbol with a space
        decode = function(str) {
                return decodeURIComponent(str.replace(decodeRE, " "));
        },
        params = {},
        e;
        while(e = re.exec(query)) {
                var k = decode(e[1]),
                v = decode(e[2]);
                if (k.substring(k.length - 2) === '[]') {
                        k = k.substring(0, k.length - 2);
                        (params[k] || (params[k] = [])).push(v);
                } else {
                        params[k] = v;
                }
        }
        return params;
};

/**
 * Detect touch device
 * @return {Boolean}
 */
$.is_touch_device = function() { return "ontouchstart" in window || "onmsgesturechange" in window; };

/**
* Encrypt asynchronous requests with jCryption
*
* Usage: call $.cryptAjax instead of simple $.ajax function
*
* @param string url     The request target
* @param {object} options Request params
*/
$.cryptAjax = function(url, options) {
        if(!config.site.developer_mode) {
                $.jCryption.authenticate(password, "common/include/funcs/_ajax/_decrypt.php?getPublicKey=true", "common/include/funcs/_ajax/_decrypt.php?handshake=true", function(AESKey) {
                        auth = true;
                        $.ajax(url, options);
                }, function(fail) {
                        console.warn("error");
                });
        } else {
                $.ajax(url, options);
        }
};

/**
* Display the coffee message
*/
$.service_coffee = function(options) {
        options = $.extend({
                message: "The Service is temporarily unavailable.<br />Try again later...",
                class: "service_coffee",
                title: "Taking coffee...",
                titleClass: "text-warning",
                icon: "fa-coffee"
        }, options);

        if($("#apprise.service_coffee").length === 0) {
                apprise(options.message, {
                        class: options.class,
                        title: options.title,
                        titleClass: options.titleClass,
                        icon: options.icon,
                        progress: true,
                        allowExit: false
                });
        } else {
                $("#apprise.service_coffee").modal("show");
        }
};

/**
* Load site configurations
*/
$.site_conf = function(callback) {
        if(config.site.developer_mode) {
                //console.log("Check maintenance status...");
        }
        $.cryptAjax({
                url: "common/include/conf/interface/maintenance.json",
                dataType: "json",
                success: function(maintenance) {
                        if(maintenance.status) {
                                $.service_coffee({
                                        titleClass: "text-danger",
                                        icon: "fa-wrench",
                                        title: i18n[lang].maintenance.title,
                                        message: i18n[lang].maintenance.message
                                });
                                setTimeout(function() {
                                        $.site_conf(callback);
                                }, maintenance.check_time.true_state);

                                load = false;
                                return false;
                        } else {
                                if($("#apprise.service_coffee").length > 0) {
                                        $("#apprise.service_coffee").modal("hide");
                                }
                                if (typeof callback == "function") {
                                        if(!load) {
                                                load = true;
                                                callback.call(this);
                                        }
                                }
                                setTimeout(function() {
                                        $.site_conf(callback);
                                }, maintenance.check_time.false_state);
                        }
                },
                error: function(maintenance) {
                        setTimeout(function() {
                                $.site_conf(callback);
                        }, maintenance.check_time.true_state);

                        load = false;
                        return false;
                }
        });
};

/**
 * Load all pages config
 */
$.get_all_pages_config = function(callback) {
        if(storage.isSet("pgrdg_cache.local.pages")) {
                if(typeof callback == "function") {
                        callback.call(this, storage.get("pgrdg_cache.local"));
                }
        } else {
                $.cryptAjax({
                        url: "common/include/conf/pages.json",
                        dataType: "json",
                        success: function(response) {
                                storage.set("pgrdg_cache.local", response);
                                if(typeof callback == "function") {
                                        callback.call(this, response);
                                }
                        }
                });
        }
};

/**
 * Load page config
 */
$.get_page_config = function(callback) {
        $.iterate_pages_config = function(response, callback) {
                if(current_path === "") {
                        current_path = "Home";
                }
                // Collect all pages and subpages to an array
                var pages = [];
                $.each(response.pages, function(page_type, page_data) {
                        if($.obj_len(page_data.subpages) === 0) {
                                if(current_path == page_data.address) {
                                        storage.set("pgrdg_cache.local.current_page", page_data);
                                }
                                pages.push(page_data);
                        } else {
                                $.each(page_data.subpages, function(subpage_type, subpage_data) {
                                        if(current_path == subpage_data.address) {
                                                storage.set("pgrdg_cache.local.current_page", page_data);
                                        }
                                        pages.push(subpage_data);
                                });
                        }
                });
                callback.call(this, pages);
        };

        if(storage.isSet("pgrdg_cache.local.pages")) {
                conf = storage.get("pgrdg_cache.local.pages");
                // $.iterate_pages_config(storage.get("pgrdg_cache.local.pages"), function(conf) {
                        if(typeof callback == "function") {
                                callback.call(this, conf);
                        }
                // });
        } else {
                $.cryptAjax({
                        url: "common/include/conf/pages.json",
                        dataType: "json",
                        success: function(response) {
                                $.iterate_pages_config(response, function(conf) {
                                        storage.set("pgrdg_cache.local.pages", conf);
                                        if(typeof callback == "function") {
                                                callback.call(this, conf);
                                        }
                                });
                        }
                });
        }
};


/*=======================================================================================
*	GLOBAL VARIABLES
*======================================================================================*/
// System
//
var system_constants,
storage = $.localStorage,
lang = (($.cookie("lang") !== undefined && $.cookie("lang") !== null && $.cookie("lang") !== "") ? $.cookie("lang") : config.site.default_language),
operators = [],
password = $.makeid(),
load = false, // Default status for continue to load javascript, do not edit
auth = false, // Default status for jcryption authentication, do not edit
url = $.url().attr(),
$hash = $.url().fsegment(),
url_paths = url.path.split("/"),
query = $.parse_params(url.query),
current_path = (url_paths[url_paths.length - 1] === "") ? "Profile" : url_paths[url_paths.length - 1],
parent_path = url_paths[url_paths.length - 2],
is_error_page = $("body").attr("data-error");

$.site_conf(function() {
        $(".fittext").fitText(1.2, {
                minFontSize: "20px",
                maxFontSize: "40px"
        });
        $.get_page_config(function(page_config) {
                if(page_config.is_backend && page_config.data_parent_menu !== undefined) {
                        $("#" + page_config.data_parent_menu).attr("aria-expanded", "true");
                        $("#" + page_config.data_parent_menu).closest("li").addClass("open");
                        $("#" + page_config.data_parent_menu).closest("li").find("ul").css("display", "block");
                }
                if(current_path == "Home") {
                        $("#your_data_menu").attr("aria-expanded", "true");
                        $("#your_data_menu").closest("li").addClass("open");
                        $("#your_data_menu").closest("li").find("ul").css("display", "block");
                }
        });
        if(!load) {
                return false;
        } else {
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
                }
        }
});
