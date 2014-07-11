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
* PHP ported
*/
        /**
        * Convert all applicable characters to HTML entities
        *
        * This function is a porting of php's htmlentities()
        *
        * @param  {string} 	The html string to encode
        * @return {string}         The string encoded
        */
        $.html_encode = function(str){ return $("<div/>").text(str).html(); };

        /**
        * Convert all HTML entities to their applicable characters
        *
        * This function is a porting of php's html_entity_decode()
        *
        * @param  {string} 	The htmlentity string to decode
        * @return {string}         The string decoded
        */
        $.html_decode = function(str){ return $("<div/>").html(str).text(); };

        /**
        * URL-encode according to RFC 3986
        *
        * This function is a porting of php's rawurlencode()
        *
        * @param  {string} 	The string to encode
        * @return {string}         The string encoded
        */
        $.rawurlencode = function(str) { str = (str+'').toString(); return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A'); };

        /**
        * Decode URL-encoded strings
        *
        * This function is a porting of php's rawurldecode()
        *
        * @param  {string} 	The string to decode
        * @return {string}         The string decoded
        */
        $.rawurldecode = function(str) { return decodeURIComponent((str + '').replace(/%(?![\da-f]{2})/gi, function () { return '%25'; })); };

        /**
        * Encodes data with MIME base64
        *
        * This function is a porting of php's base64_encode()
        *
        * @param  {string} 	The string to encode
        * @return {string}         The string encoded
        */
        $.utf8_to_b64 = function(str) { return window.btoa(unescape(encodeURIComponent(str))); };

        /**
        * Decodes data encoded with MIME base64
        *
        * This function is a porting of php's base64_decode()
        *
        * @param  {string} 	The string to decode
        * @return {string}         The string decoded
        */
        $.b64_to_utf8 = function(str) { return decodeURIComponent(escape(window.atob(str))); };

        /**
        * Make a string's first character uppercase
        *
        * This function is a porting of php's ucfirst()
        *
        * @param  {string}      The string to manipulate
        * @return {[type]}      Ucase converted string
        */
        $.ucfirst = function(str) { str += ""; var f = str.charAt(0).toUpperCase(); return f + str.substr(1); };

/**
* Return if browser has cookie allowed
* @return {bool}   Browser cookie permission
*/
$.browser_cookie_status = function() { var cookieEnabled = (navigator.cookieEnabled) ? true : false; if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) { document.cookie = "testcookie"; cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false; } return (cookieEnabled); };


/**
* Generates a random id
* @return {string} Random uuid
*/
$.makeid = function() { var text = "", possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; for(var i = 0; i <= 16; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); } return text; };

/**
* Generates a random uuid
* @return {string} Random uuid
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
 * An utility function to find all URLs - FTP, HTTP(S) and Email - in a text string
 * and return them in an html link.
 * Taken from http://stackoverflow.com/a/3890175
 *
 * @param text the text to be searched.
 * @return an array of URLs.
 */
$.linkify = function(inputText) {
        var replacedText, replacePattern1, replacePattern2, replacePattern3;

        //URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

        //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

        //Change email addresses to mailto:: links.
        replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

        return replacedText;
};

/**
 * Detect touch device
 * @return {Boolean}
 */
$.is_touch_device = function() {
        return "ontouchstart" in window || "onmsgesturechange" in window;
};

/*=======================================================================================
*	GLOBAL VARIABLES
*======================================================================================*/
var lang = "en",
service_url = "API/?type=service&proxy=",
system_constants,
operators = [],
password = $.makeid(),
auth = false,
storage = $.localStorage,
url = $.url().attr(),
url_paths = url.path.split("/"),
current_path = url_paths[url_paths.length - 1],
developer_mode = true;
