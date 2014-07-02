/**
* Map (Leaflet) functions
*
* @author Alessandro Gubitosi <gubi.ale@iod.io>
* @license http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @link https://github.com/bioversity/PGRDG/
*/


/*=======================================================================================
 *	CORE ENGINE
 *======================================================================================*/

        var lon, lat, zoom, default_bbox = [], map, control, current_layer, layers = [], l = {}, defaultLayer, baseLayers, overlayLayers;

        /**
         * Generate map
         */
        $.init_map = function() {
                var zindex = 0;
                $.cryptAjax({
                        url: "common/include/conf/_map.json",
                        dataType: "json",
                        success: function(map_data) {
                                lon = map_data.map.default.coordinates.lon;
                                lat = map_data.map.default.coordinates.lat;
                                zoom = map_data.map.default.zoom.default_zoom;
                                default_bbox = map_data.map.default.coordinates.bounding_box;
                                map = new L.Map('pgrdg_map', {
                                        center: [lat, lon],
                                        zoom: zoom,
                                                minZoom: map_data.map.default.zoom.min_zoom,

                                        inertia: true,
                                        zoomControl: true,
                                        attributionControl: true,
                                        fadeAnimation: true,
                                        zoomAnimation: true,
                                        markerZoomAnimation: true
                                });
                                L.control.scale().addTo(map);

                                // For a complete list of available layers see https://github.com/leaflet-extras/leaflet-providers/blob/master/index.html
                                defaultLayer = L.tileLayer.provider(map_data.map.layers.defaultLayer).addTo(map);
                                baseLayers = map_data.map.layers.baseLayers;
                                overlayLayers = map_data.map.layers.overlayLayers;

                                $("#change_map").append('<ul class="list-unstyled">');
                                var i = 0, h = 0;
                                $.each(map_data.map.layers.baseLayers, function(group, layers_list) {
                                        zindex = 1;

                                        h++;
                                        $.each(layers_list, function(k, v) {
                                                if(v == map_data.map.layers.defaultLayer) {
                                                        $("#change_map ul").append('<li class="selected" onclick="$.change_map_layer(\'' + v + '\', \'' + zindex + '\')"><a title="Change layer" href="javascript: void(0);" class="btn change_map_btn ' + v.replace(".", "_") + '"><span class="fa fa-check-circle"></span>&nbsp;&nbsp;' + v.replace(".", " ") + '</a>');
                                                } else {
                                                        $("#change_map ul").append('<li onclick="$.change_map_layer(\'' + v + '\', \'' + zindex + '\')"><a title="Change layer" href="javascript: void(0);" class="btn change_map_btn ' + v.replace(".", "_") + '"><span class="fa fa-circle-o"></span>&nbsp;&nbsp;' + v.replace(".", " ") + '</a>');
                                                }
                                                layers.push(v);
                                        });
                                        if(h < $.obj_len(map_data.map.layers.baseLayers)) {
                                                $("#change_map ul").append('<li class="divider"></li>');
                                        }
                                });
                                $.each(map_data.map.layers.overlayLayers, function(group, layers_list) {
                                        zindex = 25;

                                        i++;
                                        $.each(layers_list, function(k, v) {
                                                if(v !== undefined && v !== null && v !== "") {
                                                        $("#change_map ul").append('<li onclick="$.change_map_layer(\'' + v + '\', \'' + zindex + '\')"><a title="Add/remove overlay" href="javascript: void(0);" class="btn change_map_btn ' + v.replace(".", "_") + '"><span class="fa fa-square-o"></span>&nbsp;&nbsp;' + v.replace(".", " ") + '</a>');
                                                        layers.push(v);
                                                }
                                        });
                                        if(i < $.obj_len(map_data.map.layers.overlayLayers)) {
                                                $("#change_map ul").append('<li class="divider"></li>');
                                        }
                                });
                                current_layer = map_data.map.layers.defaultLayer;
                                //control = L.control.layers.provided(baseLayers, overlayLayers, {collapsed: true});//.addTo(map);
                                map.invalidateSize();
                                map.setMaxBounds([[85, -190], [-190, 190]]);

                                $(".leaflet-control-attribution.leaflet-control").html('<div class="attribution">' + $(".leaflet-control-attribution.leaflet-control").html() + '</div><a class="info" href="javascript: void(0);" onclick="$(\'.leaflet-control-attribution.leaflet-control div.attribution\').fadeToggle().parent(\'div\').toggleClass(\'open\');"><span class="fa fa-info-circle"></span></a>');

                                var geoJsonData = {
                                        "type": "FeatureCollection",
                                        "features": [
                                                { "type": "Feature", "id":"1", "properties": { "address": "2"   }, "geometry": { "type": "Polygon", "coordinates": [[[12.8199, 42.8422], [12.8207,42.8158], [12.8699,42.8166], [12.8678,42.8398], [12.8199,42.8422]]] } }
                                        ]
                                };
                        }
                });
                if(!$("#pgrdg_map").hasClass("locked")) {
                        $("#pgrdg_map").on("mousedown touchstart", function(em) {
                        }).on("mouseup touchend", function() {
                                $("#pgrdg_map").unbind("mousemove");
                                $(this).removeClass("grabbing");
                        });
                        // $.contextMenu(true);
                } else {
                        $.contextMenu(false);
                }
                $("#pgrdg_map.locked canvas").on("dragstart touchmove", function(e) { e.preventDefault(); return false; });
        };



/*=======================================================================================
 *	POSITIONING AND CENTERING
 *======================================================================================*/

        /**
         * Wrap longitude or latitude value
         * @param {[type]} value) { return value - (Math.floor((value + 180) / 360) * 360 [description]
         */
//        $.wrapLon = function(value) { return value - (Math.floor((value + 180) / 360) * 360); };

        /**
         * Return current boundingbox
         */
        $.get_current_bbox = function() { return map.getBounds(); };

        /**
         * Return current boundingbox in EPSG 43826
         */
//        $.get_current_bbox_epsg = function() { return ol.proj.transform(map.getView().getView2D().calculateExtent(map.getSize()), "EPSG:3857", "EPSG:4326"); };

        /**
         * Explode a boundingbox and returns an array for PGRDG Service
         * @param  {array} default_bbox A boundingbox
         * @return {array}              An array of coordinates for PGRDG service
         */
        $.get_current_bbox_pgrdg = function() {
                return [[default_bbox[0], default_bbox[3]], [default_bbox[2], default_bbox[3]], [default_bbox[2], default_bbox[1]], [default_bbox[0], default_bbox[1]], [default_bbox[0], default_bbox[3]]];
        };

        /**
         * Clean and adjust coordinates
         * @param {string} lon              Longitude
         * @param {string} lat              Latitude
         */
//        $.set_lonlat = function(lon, lat) { return ol.proj.transform([parseFloat(lon), parseFloat(lat)], "EPSG:4326", "EPSG:3857"); };

        /**
         * Set coordinates giving boundingbox axis
         */
//        $.set_lonlat_bbox = function(a, b, c, d) { return ol.extent.transform([parseFloat(a), parseFloat(b), parseFloat(c), parseFloat(d)], ol.proj.getTransform("EPSG:4326", "EPSG:3857")); };

        /**
         * Center map on given coordinates
         * @param {string} lon  Longitude
         * @param {string} lat  Latitude
         */
//        $.set_center = function(lon, lat) { view.setCenter($.set_lonlat(lon, lat)); };

        /**
         * Center map on given boundingbox
         */
//        $.set_center_bbox = function(a, b, c, d) { view.setCenter($.set_lonlat_bbox(a, b, c, d)); };

        /**
        * Center map on a defined place
        * @param  {string} location Selected place
        */
        $.center_map_on = function(location) {
                if(!$("#pgrdg_map").hasClass("locked")) {
                        var loc_data = {};
                        switch(location) {
                                case "World":
                                        loc_data.lon = 0;
                                        loc_data.lat = 35;
                                        loc_data.zoom = 2.3;
                                        break;
                                case "Africa":
                                        loc_data.lon = 16;
                                        loc_data.lat = 5;
                                        loc_data.zoom = 3.7;
                                        break;
                                case "Antarctica":
                                        loc_data.lon = -50;
                                        loc_data.lat = 68;
                                        loc_data.zoom = 3;
                                        break;
                                case "Asia":
                                        loc_data.lon = 100;
                                        loc_data.lat = 60;
                                        loc_data.zoom = 3;
                                        break;
                                case "Europe":
                                        loc_data.lon = 12;
                                        loc_data.lat = 55;
                                        loc_data.zoom = 4;
                                        break;
                                case "North America":
                                        loc_data.lon = -98;
                                        loc_data.lat = 39;
                                        loc_data.zoom = 4;
                                        break;
                                case "Oceania":
                                        loc_data.lon = 130;
                                        loc_data.lat = -12;
                                        loc_data.zoom = 4;
                                        break;
                                case "South America":
                                        loc_data.lon = -58;
                                        loc_data.lat = -23;
                                        loc_data.zoom = 4;
                                        break;
                                case "Your position":
                                        navigator.geolocation.getCurrentPosition(function(position) {
                                                // Success
                                                $.find_location({
                                                        lon: position.coords.longitude,
                                                        lat: position.coords.latitude,
                                                        addressdetails: 0,
                                                        success: function(data) {
                                                                datap = $.parseJSON(data);
                                                                //$.add_marker(position.coords.longitude, position.coords.latitude);
                                                                $.set_center(position.coords.longitude, position.coords.latitude);
                                                                $.set_zoom(13);
                                                                $("#selected_zone").text(datap.display_name).fadeIn(300);
                                                        }
                                                });
                                                return false;
                                        }, function(position) {
                                                // Fail
                                                $("#selected_zone").html("<i>Unable to find position</i>").fadeIn(300);
                                                return false;
                                        });
                                        break;
                        }
                        if(location != "Your position") {
                                $.set_center(loc_data.lon, loc_data.lat);
                                $.set_zoom(loc_data.zoom);
                                $("#selected_zone").text(location).fadeIn(300);
                        }
                }
        };


/*=======================================================================================
 *	ZOOM
 *======================================================================================*/

        /**
         * Return current zoom level
         */
        $.get_current_zoom = function() { return map.getZoom(); };
        /**
         * Set preferred zoom level
         */
        $.set_zoom = function(zoom) { return map.setZoom(zoom); };
        /**
         * Increase zoom level
         */
        $.increase_zoom = function() { map.setZoom((view.getZoom() + 1)); };
        /**
         * Decrease zoom level
         */
        $.decrease_zoom = function() { map.setZoom((view.getZoom() - 1)); };


/*=======================================================================================
 *	LAYERS
 *======================================================================================*/

        /**
         * Return the current layer
         */
        $.current_layer = function() { return current_layer; };

        /**
         * Show selected layer
         */
        $.show_layer = function(selected_layer, zindex) {
                l[selected_layer] = L.tileLayer.provider(selected_layer);
                map.addLayer(l[selected_layer]);
                l[selected_layer].setZIndex(zindex);
        };

        /**
         * Hide selected layer
         */
        $.hide_layer = function(selected_layer) {
                map.removeLayer(l[selected_layer]);
        };

        /**
         * Switch displayed layer
         */
        $.change_map_layer = function(selected_layer, zindex) {
                console.log(zindex);
                var $this = $("#change_map a." + selected_layer.replace(".", "_")).find("span");
                if(selected_layer !== $.current_layer) {
                        if($this.hasClass("fa-circle-o") || $this.hasClass("fa-check-circle")) {
                                //L.tileLayer.provider(selected_layer);
                                $.show_layer(selected_layer, zindex);
                                $("#change_map li").find("span.fa-check-circle").closest("li").removeClass("selected").find("span").removeClass("fa-check-circle").addClass("fa-circle-o");
                                $("#change_map a." + selected_layer.replace(".", "_")).parent("li").addClass("selected").find("span").removeClass("fa-circle-o").addClass("fa-check-circle");
                        } else {
                                if($this.hasClass("fa-square-o")) {
                                        //L.tileLayer.provider(selected_layer);
                                        $.show_layer(selected_layer, zindex);
                                        $("#change_map a." + selected_layer.replace(".", "_")).parent("li").addClass("selected").find("span").removeClass("fa-square-o").addClass("fa-check-square");
                                } else {
                                        //var this_layer = L.tileLayer.provider(selected_layer);
                                        $.hide_layer(selected_layer);
                                        $("#change_map a." + selected_layer.replace(".", "_")).parent("li").removeClass("selected").find("span").removeClass("fa-check-square").addClass("fa-square-o");
                                }
                        }
                        current_layer = selected_layer;
                }
                $.sub_toolbox('change_map');
        };


        /*=======================================================================================
         *	MAP ENVIRONMENT AND STAGE
         *======================================================================================*/

                /**
                * Map Toolbox
                */
                        /**
                        * Reset all selection on toolbox
                        */
                        $.reset_map_toolbox = function() { $("#map_sub_toolbox div").fadeOut(100); $("#map_toolbox li").removeClass("selected"); };

                        /**
                        * Disable all toolbox buttons
                        */
                        $.disable_map_toolbox = function() { $("#map_toolbox a:not(#lock_view_btn)").addClass("disabled").parent("li").addClass("disabled"); };

                        /**
                        * Re-enable disabled toolbox buttons
                        */
                        $.enable_map_toolbox = function() { $("#map_toolbox li, #map_toolbox a").removeClass("disabled"); };

                        /**
                        * Generate right subtoolbox panel
                        * @param  {string} action Selected tool
                        */
                        $.sub_toolbox = function(action) {
                                if($("#" + action).css("display") == "none") {
                                        $.reset_map_toolbox();

                                        $("#" + action + "_btn").parent("li").addClass("selected");
                                        $("#" + action).fadeIn(function() {
                                                switch(action) {
                                                        case "find_location":
                                                                if($(this).find("input").val().length === 0) {
                                                                        $(this).find("input").focus();
                                                                } else {
                                                                        $(this).find("input").select();
                                                                }
                                                                break;
                                                        case "change_map":
                                                                if($("#change_map").css("display") != "none") {
                                                                        var li = $("#change_map li");
                                                                        var liSelected;

                                                                        $(window).bind("keydown", "down", function(e) {
                                                                                e.preventDefault();
                                                                                $.each(li, function(item, value) {
                                                                                        $(this).removeClass("selected");
                                                                                });
                                                                                if(liSelected){
                                                                                        liSelected.removeClass("selected");
                                                                                        next = liSelected.nextAll('li[class!="divider"]').first();
                                                                                        if(next.length > 0){
                                                                                                liSelected = next.addClass("selected").focus();
                                                                                        } else {
                                                                                                liSelected = li.eq(0).addClass("selected").focus();
                                                                                        }
                                                                                } else {
                                                                                        liSelected = li.eq(0).addClass("selected").focus();
                                                                                }
                                                                        }).bind("keydown", "up", function(e) {
                                                                                e.preventDefault();
                                                                                $.each(li, function(item, value) {
                                                                                        $(this).removeClass("selected");
                                                                                });
                                                                                if(liSelected){
                                                                                        liSelected.removeClass("selected");
                                                                                        next = liSelected.prevAll('li[class!="divider"]').first();
                                                                                        if(next.length > 0){
                                                                                                liSelected = next.addClass("selected").focus();
                                                                                        } else {
                                                                                                liSelected = li.last().addClass("selected").focus();
                                                                                        }
                                                                                } else {
                                                                                        liSelected = li.last().addClass("selected").focus();
                                                                                }
                                                                        }).bind("keydown", "return space insert", function(e) {
                                                                                e.preventDefault();
                                                                                var item = liSelected.find("a"),
                                                                                selected_map = $.trim(item.attr("class").replace("btn change_map_btn ", "").replace("_", " "));
                                                                                $.change_map_layer(selected_map, item);
                                                                        });
                                                                }
                                                                //$(".change_map_btn." + $("#selected_map").text().replace(" ", "_") + " span").removeClass("fa-circle-o").addClass("fa-check-circle").closest("li").addClass("selected");
                                                                break;
                                                        case "tools":
                                                                break;
                                                }
                                        });
                                } else {
                                        if(action == "close") {
                                                $("#map_sub_toolbox div").fadeOut(300);
                                                $("#" + action + "_btn").parent("li").removeClass("selected");
                                        } else {
                                                $("#" + action + "_btn").parent("li").removeClass("selected");
                                                $("#" + action).fadeOut(300, function() {
                                                        switch(action) {
                                                                case "change_map":
                                                                        break;
                                                                case "tools":
                                                                        break;
                                                        }
                                                });
                                        }
                                }
                        };


        /**
         * Graphic interaction functions
         */
                /**
                 * Lock/unlock interactions on map
                 */
                $.toggle_lock_view = function() {
                        var current_view = $.get_current_bbox();
                        console.log(current_view);
                        if(!$("#pgrdg_map").hasClass("locked")) {
                                $(".leaflet-control-zoom").animate({"left": "-50px"}, 300);
                                $(".leaflet-control-attribution").animate({"margin-right": "-120px"}, 300);
                                $("#pgrdg_map").removeClass("grabbing");
                                $("#pgrdg_map").addClass("locked");
                                $("#lock_view_btn").addClass("pulse");
                                $.reset_map_toolbox();
                                $.disable_map_toolbox();
                                $("#selected_zone").text("Map locked").show();
                                $("#goto_map_btn").append('<sup class="lock"> <span class="fa fa-lock text-danger"></span></sup>');

                                map.dragging.disable();
                                map.touchZoom.disable();
                                map.doubleClickZoom.disable();
                                map.scrollWheelZoom.disable();

                                // Disable tap handler, if present.
                                if (map.tap) map.tap.disable();
                        } else {
                                $(".leaflet-control-zoom").animate({"left": "0"}, 300);
                                $(".leaflet-control-attribution").animate({"margin-right": "0"}, 300);
                                $("#pgrdg_map").removeClass("locked");
                                $("#lock_view_btn").removeClass("pulse");
                                $.enable_map_toolbox();
                                $("#selected_zone").text("Map unlocked").show().delay(2000).fadeOut(600);
                                $("#goto_map_btn").find("sup.lock").remove();

                                map.dragging.enable();
                                map.touchZoom.enable();
                                map.doubleClickZoom.enable();
                                map.scrollWheelZoom.enable();

                                // Disable tap handler, if present.
                                if (map.tap) map.tap.enable();
                        }
                };

                /**
                 * Show guides on map
                 */
                $.show_guides = function() {
                        $(document).on("mousemove", function(e){
                                $("#guides").find("#gx").css({
                                        top: e.pageY,
                                        left: 0,
                                        width: e.pageX-5
                                });
                                $("#guides").find("#gxx").css({
                                        top: e.pageY,
                                        left: e.pageX+5,
                                        width: ($(document).width() - e.pageX)
                                });
                                $("#guides").find("#gy").css({
                                        left: e.pageX,
                                        top: 0,
                                        height: e.pageY-5
                                });
                                $("#guides").find("#gyy").css({
                                        left: e.pageX,
                                        top: e.pageY+5,
                                        height: ($(document).height() - e.pageY)
                                });
                        });
                };


                /**
                * Show contextMenu on map
                */
                $.contextMenu = function() {
                        $("#knob").hide();
                        $("#pgrdg_map").removeClass("grabbing");
                        var $contextMenu = $("#knob");
                        $("body").on("contextmenu", "#pgrdg_map:not(.locked), #knob:not(header)", function(e) {
                                e.preventDefault();
                                if($("#clicked_coords").length === 0) {
                                        $("body").prepend('<span style="display: none;" id="clicked_coords"></span>');
                                }
                                var clicked_coords = map.getCoordinateFromPixel([e.clientX, e.clientY]);
                                var hdms = ol.proj.transform(clicked_coords, "EPSG:3857", "EPSG:4326");

                                $("#clicked_coords").text('{"lon": ' + hdms[0] + ',"lat": ' + hdms[1] + '}');

                                $contextMenu.css({
                                        left: (e.pageX - 100),
                                        top: (e.pageY - 200),
                                }).fadeIn(300);

                                return false;
                        });
                        $contextMenu.on("click", "a", function() {
                                $contextMenu.hide();
                        });
                        $("#knob, #pgrdg_map, #pgrdg_map > *").click(function(e) {
                                $contextMenu.hide();
                        });
                };

        /**
        * Find locations
        */
                /**
                * Search location from given coordinates
                * @param  {object} options (format, lat, lon, addressdetails)
                * @return {object}         The results of search in Nominatim OpenStreetmap
                */
                $.find_location = function(options) {
                        $.ajax({
                                url: "API/",
                                type: "get",
                                format: "json",
                                crossDomain: true,
                                data: {
                                        proxy: "true",
                                        type: "get",
                                        header: "text/json",
                                        address: "http://nominatim.openstreetmap.org/reverse",
                                        params: {
                                                format: "json",
                                                lat: options.lat,
                                                lon: options.lon,
                                                zoom: 18,
                                                addressdetails: ((options.addressdetails == 1) ? 1 : 0)
                                        }
                                },
                                error: function(data) {
                                        options.error(data);
                                },
                                success: function(data) {
                                        options.success(data);
                                }
                        });
                };

                /**
                * Search location from given string
                * @param  {string} input The location to search
                * @return {object}       The results of search in Nominatim OpenStreetmap
                */
                $.search_location = function(input) {
                        if(input.length > 0) {
                                $("#map_toolbox #find_location_btn span").removeClass("ion-search").addClass("ion-loading-c").parent("a").addClass("disabled");
                                $.ajax({
                                        url: "API/",
                                        type: "get",
                                        format: "json",
                                        crossDomain: true,
                                        data: {
                                                proxy: "true",
                                                type: "get",
                                                header: "text/json",
                                                address: "http://nominatim.openstreetmap.org/search.php",
                                                params: {
                                                        q: encodeURIComponent(input),
                                                        format: "json",
                                                        addressdetails: 1,
                                                        bounded: 1,
                                                        limit: 10,
                                                        polygon_geojson: 1
                                                }
                                        },
                                        error: function(data) {
                                                alert("An error occurred while communicating with the OpenLS service. Please try again.");
                                                $("#map_toolbox span.ion-loading-c").removeClass("ion-loading-c").addClass("ion-search").parent("a").removeClass("disabled");
                                        },
                                        success: function(data) {
                                                datap = $.parseJSON(data);
                                                $("#selected_zone").text(datap[0].display_name).fadeIn(300).delay(5000).fadeOut(600);
                                                $("#information_zone").html(datap[0].address.city + ", " + ((datap[0].address.county !== undefined) ? "(" + datap[0].address.county + ") " : "") + datap[0].address.state + " - " + datap[0].address.country);

                                                var minLat = datap[0].boundingbox[0],
                                                maxLat = datap[0].boundingbox[1],
                                                minLng = datap[0].boundingbox[2],
                                                maxLng = datap[0].boundingbox[3];

                                                //console.log(datap[0].lon, datap[0].lat);
                                                //console.log(typeof(datap[0].lon));
                                                //$.set_zoom(7);
                                                //view.fitExtent([minLat, maxLat, minLng, maxLng], map.getSize());

                                                //var textent = ol.extent.transform([minLat, minLng, maxLat, maxLng], ol.proj.getTransform('EPSG:4326', 'EPSG:3857'));
                                                //console.log(textent);
                                                $.each(datap, function(k, v) {
                                                        var mc;
                                                        //console.log(datap[k].lon, datap[k].lat);
                                                        if(k === 0) {
                                                                mc = "primary";
                                                        } else {
                                                                mc = "secondary";
                                                        }
                                                        $.add_marker({uuid: datap[k].place_id, lon: datap[k].lon, lat: datap[k].lat, marker_class: mc, name: datap[k].display_name, title: "Search: \"" + input + "\"", content: datap[k].display_name});
                                                });
                                                $("#map_toolbox span.ion-loading-c").removeClass("ion-loading-c").addClass("ion-search").parent("a").removeClass("disabled");
                                                $("#" + datap[0].place_id).popover("show");
                                                $.set_center(Math.floor(datap[0].lon), Math.floor(datap[0].lat));
                                        }
                                });
                        }
                };


         /**
          * Markers, clusters and popup
          */
                $.add_heatmap = function(options) {
                 options = $.extend({
                         radius: 30,
                         opacity: 40,
                         gradient: {
                                 0.45: "rgb(0, 0, 255)",
                                 0.55: "rgb(0, 255, 255)",
                                 0.65: "rgb(0, 255, 0)",
                                 0.95: "yellow",
                                 1.0: "rgb(255, 0, 0)"
                         }
                 });
                 var vector = new ol.layer.Heatmap({
                         source: new ol.source.KML({
                                 projection: 'EPSG:3857',
                                 url: 'http://192.168.20.208/API/?proxy=true&address=http://ol3js.org/en/master/examples/data/kml/2012_Earthquakes_Mag5.kml'
                         }),
                         radius: options.radius
                 });
                 vector.getSource().on('addfeature', function(event) {
                         // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
                         // standards-violating <magnitude> tag in each Placemark.  We extract it from
                         // the Placemark's name instead.
                         var name = event.feature.get('name');
                         var magnitude = parseFloat(name.substr(2));
                         event.feature.set('weight', magnitude - 5);
                 });
                 map.addOverlay(vector);
                };

                /**
                * Add marker on map
                * @param {object} options (lon, lat, uuid, type, name, title, cloud, size, marker_class, content, callback{function})
                * @return {Function} callback Called function
                */
                $.add_marker = function(options, callback) {
                 options = $.extend({
                         lon: 0,
                         lat: 0,
                         uuid: $.uuid(),
                         type: "marker",
                         name: "",
                         title: "",
                         cloud: true,
                         size: "1.5em",
                         marker_class: "primary",
                         content: "Sample text",
                         dynamic_content: "",
                         buttons: true
                 }, options);

                 //$("#map_hidden_elements").append('<div id="' + options.uuid + '" title="' + options.name + '"></div>');
                 if($("#" + options.uuid).length > 0) {
                         $("#" + options.uuid).remove();
                 }
                 var set_center_btn = '<a class="btn btn-default btn-sm" title="Center point on the screen" href="javascript:void(0);" onclick="$.set_center(\'' + options.lon + '\',\'' + options.lat + '\');"><span class="fa fa-crosshairs"></span></a>';
                 var set_zoom_btn = '<a class="btn btn-default btn-sm" title="Zoom here" href="javascript:void(0);" onclick="$.set_center(\'' + options.lon + '\',\'' + options.lat + '\'); $.set_zoom(12); $(\'#' + options.uuid + '\').popover(\'hide\');"><span class="fa fa-search-plus"></span></a>';
                 var remove_point_btn = '<a class="btn btn-default btn-sm right" title="Remove this point" href="javascript:void(0);" onclick="$(\'#' + options.uuid + '\').popover(\'hide\'); $(\'#' + options.uuid + '\').remove();"><span class="fa fa-trash-o"></span></a>';
                 var measure_distance_btn = '<a class="btn btn-default btn-sm right" title="Calculate distance" href="javascript:void(0);" onclick="$.gui_measure_distances(\'point\', {lon: \'' + options.lon + '\', lat:\'' + options.lat + '\', title:\'' + options.name + '\'})"><span class="ion-fork-repo"></span></a>';
                 var circle = L.circle([51.508, -0.11], 500, {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5
                 }).addTo(map);
                 circle.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
                 /*
                 var marker = new ol.Overlay({
                         position: $.set_lonlat(options.lon, options.lat),
                         positioning: "center-center",
                         element: (options.cloud) ? $('<div class="' + options.type + ' ' + options.marker_class + '" style="width:' + options.size + '; height: ' + options.size + '" id="' + options.uuid + '"></div>').css({
                                                 cursor: "pointer"
                                         }).popover({
                                                 html: true,
                                                 title: options.title + '<a href="javascript:void(0);" onclick="$(\'#' + options.uuid + '\').popover(\'hide\');" class="close">&times;</a>',
                                                 content: ((typeof(options.content) == "function") ? options.content() : options.content) + ((options.buttons) ? '<br /><br />' + '<div class="popup_btns row"><div class="col-sm-12 btn-group">' + set_center_btn + set_zoom_btn + remove_point_btn + measure_distance_btn + '</div></div>' : ""),
                                                 placement: "top",
                                                 trigger: "click"
                                         }).bind("click", function() {
                                                 $("#" + options.uuid).next(".popover").find(".popover-content").html(((typeof(options.dynamic_content) == "function") ? options.dynamic_content() : options.dynamic_content));
                                         }) : $('<div class="' + options.type + ' ' + options.marker_class + '" style="width:' + options.size + '; height: ' + options.size + '" id="' + options.uuid + '"></div>'),
                         stopEvent: false
                 });
                 map.addOverlay(marker);
                 */
                };

                $.reset_all_markers = function() {
                 $.each($("#pgrdg_map .marker"), function(k, v) {
                         $(this).parent("div").remove();
                 });
                };

                /**
                * Add point on map
                * @param {object} options (lon, lat, uuid, name, title, marker_class, content, callback{function})
                * @return {Function} callback Called function
                */
                $.add_point = function(options) {
                 options = $.extend({
                         lon: 0,
                         lat: 0,
                         uuid: $.uuid(),
                         name: "",
                         title: "",
                         marker_class: "primary",
                         content: "Sample text",
                         callback: function() {}
                 }, options);
                 if (typeof(callback) == "function") {
                         callback.call(this);
                 }
                 //$("#map_hidden_elements").append('<div id="' + options.uuid + '" title="' + options.name + '"></div>');
                 if($("#" + options.uuid).length > 0) {
                         $("#" + options.uuid).remove();
                 }
                 var set_center_btn = '<a class="btn btn-default btn-sm" title="Center point on the screen" href="javascript:void(0);" onclick="$.set_center(\'' + options.lon + '\',\'' + options.lat + '\');"><span class="fa fa-crosshairs"></span></a>';
                 var set_zoom_btn = '<a class="btn btn-default btn-sm" title="Zoom here" href="javascript:void(0);" onclick="$.set_center(\'' + options.lon + '\',\'' + options.lat + '\'); $.set_zoom(12); $(\'#' + options.uuid + '\').popover(\'hide\');"><span class="fa fa-search-plus"></span></a>';
                 var remove_point_btn = '<a class="btn btn-default btn-sm right" title="Remove this point" href="javascript:void(0);" onclick="$(\'#' + options.uuid + '\').popover(\'hide\'); $(\'#' + options.uuid + '\').remove();"><span class="fa fa-trash-o"></span></a>';
                 var point = new ol.Overlay({
                         position: $.set_lonlat(options.lon, options.lat),
                         positioning: "center-center",
                         element: $('<div class="marker ' + options.marker_class + '" id="' + options.uuid + '"></div>').css({
                                                 cursor: "pointer"
                                         }).bind("click", function() {
                                                 console.log(options.lon, options.lat);
                                         }),
                         stopEvent: false
                 });
                 map.addOverlay(point);
                };

                /**
                * Move point on map
                * @param  {string} uuid Point uuid
                */
                /*
                $.move_point = function(uuid) {
                 $("#" + uuid).addClass("draggable");
                 $("#" + uuid).next().find(".popover-content .content").html('<span class="fa fa-refresh fa-spin"></span>');
                 $("#pgrdg_map").on("mousemove", function(e) {
                         if($("#" + uuid).hasClass("draggable")) {
                                 var $selected = $("#" + uuid).parent("div");
                                 $("#" + uuid).css({ cursor: "move" });
                                 $selected.css({
                                         top: parseInt(e.clientY - 9) + "px",
                                         left: parseInt(e.clientX - 9) + "px"
                                 });
                         }
                 }).on("mouseup", function(e) {
                         // Stop dragging
                         $("#" + uuid).removeClass("draggable");
                         var clicked_coords = map.getCoordinateFromPixel([e.clientX, e.clientY]),
                         hdms = ol.proj.transform(clicked_coords, "EPSG:3857", "EPSG:4326");

                         $.find_location({
                                 lon: hdms[0],
                                 lat: hdms[1],
                                 addressdetails: 1,
                                 error: function(data) {
                                         alert("An error occurred while communicating with the OpenLS service. Please try again.");
                                 },
                                 success: function(data) {
                                         datap = $.parseJSON(data);
                                         console.log(datap);
                                         $("#" + uuid).next().find(".popover-content .content").html(datap.display_name + '<br /><br />' + '<code>' + ol.coordinate.toStringHDMS([hdms[0], hdms[1]]) + '</code>');
                                 }
                         });
                 });
                };
                */

                $.add_geojson_cluster = function(geojson) {
                        var markers = L.markerClusterGroup();
                        var geoJsonLayer = L.geoJson(data, {
        			onEachFeature: function (feature, layer) {
        				layer.bindPopup(feature.properties.address);
        			}
        		});
        		markers.addLayer(geoJsonLayer);

        		map.addLayer(markers);
        		//map.fitBounds(markers.getBounds());
                };

                 /**
                 * Add popup on map
                 * @param {object}   options  (div, lon, lat, uuid, size, name, title, html, callback{function})
                 * @param {Function} callback Called function
                 */
                 $.add_popup = function(options, callback) {
                         options = $.extend({
                                 div: "Popup",
                                 lon: 0,
                                 lat: 0,
                                 uuid: $.uuid(),
                                 size: {
                                         width: 200,
                                         height: 200
                                 },
                                 name: "",
                                 title: "Selected location",
                                 html: "Sample text",
                                 callback: function() {}
                         }, options);
                         if (typeof(callback) == "function") {
                                 callback.call(this);
                         }
                         var set_center_btn = '<a class="btn btn-default btn-sm" title="Center point on the screen" href="javascript:void(0);" onclick="$.set_center(\'' + options.lon + '\',\'' + options.lat + '\');"><span class="fa fa-crosshairs"></span></a>';
                         var set_zoom_btn = '<a class="btn btn-default btn-sm" title="Zoom here" href="javascript:void(0);" onclick="$.set_center(\'' + options.lon + '\',\'' + options.lat + '\'); $.set_zoom(12);$(\'#' + options.uuid + '\').popover(\'hide\');"><span class="fa fa-search-plus"></span></a>';
                         var edit_point_btn = '<a class="btn btn-default btn-sm" title="Move this point" href="javascript:void(0);" onclick="$.move_point(\'' + options.uuid + '\'); $(\'#' + options.uuid + '\').popover(\'hide\');"><span class="fa fa-arrows"></span></a>';
                         var remove_point_btn = '<a class="btn btn-default btn-sm right" title="Remove this point" href="javascript:void(0);" onclick="$(\'#' + options.uuid + '\').popover(\'hide\');"><span class="fa fa-trash-o"></span></a>';
                         var measure_distance_btn = '<a class="btn btn-default btn-sm right" title="Calculate distance" href="javascript:void(0);" onclick="$.gui_measure_distances(\'point\', {lon: \'' + options.lon + '\', lat:\'' + options.lat + ', title:\'' + options.name + '\'})"><span class="ion-fork-repo"></span></a>';
                         var popup = new ol.Overlay({
                                 position: $.set_lonlat(options.lon, options.lat),
                                 positioning: "center-center",
                                 element: $('<div class="marker draggable ' + ((options.marker_class !== undefined) ? options.marker_class : "") + '" id="' + options.uuid + '"></div>').css({
                                                         cursor: "pointer"
                                                 }).popover({
                                                         html: true,
                                                         title: options.title + '<a href="javascript:void(0);" onclick="$(\'#' + options.uuid + '\').popover(\'hide\');" class="close">&times;</a>',
                                                         content: '<div class="content">' + options.content + '<br /><br />' + '<code>' + ol.coordinate.toStringHDMS([options.lon, options.lat]) + '</code>' + '</div><br /><br />' + '<div class="popup_btns row"><div class="col-sm-12 btn-toolbar"><div class="btn-group">' + set_center_btn + set_zoom_btn + '</div><div class="btn-group right">' + edit_point_btn + remove_point_btn + measure_distance_btn + '</div></div></div>',
                                                         placement: "top",
                                                         trigger: "click"
                                                 }),
                                 stopEvent: false
                         });
                         map.addOverlay(popup);
                         $("#" + options.uuid).popover("show");
                 };


 /*=======================================================================================
  *	USER INTERACTIONS
  *======================================================================================*/

        /**
         * Add a popup with some informations where user has clicked
         */
        $.get_click_info = function() {
                var clicked_coords = $.parseJSON($("#clicked_coords").text());
                //console.log(clicked_coords);

                $.find_location({
                        lon: clicked_coords.lon,
                        lat: clicked_coords.lat,
                        addressdetails: 1,
                        error: function(data) {
                                alert("An error occurred while communicating with the OpenLS service. Please try again.");
                        },
                        success: function(data) {
                                datap = $.parseJSON(data);
                        //        console.log(datap);
                                $.add_popup({
                                        lon: clicked_coords.lon,
                                        lat: clicked_coords.lat,
                                        title: "Location info",
                                        content: datap.display_name
                                });
                        }
                });
        };

        /**
        * Show help about shortcuts
        */
        $.show_help = function() {
                if($("header").hasClass("map")) {
                        $.reset_map_toolbox();
                        $("#map_toolbox_help").modal("show");
                }
                //$.add_heatmap();
        };


$(document).ready(function() {
        if(current_path == "Map") {
                $("header.main, section.container, #left_panel").addClass("map");
                $("#logo img").attr("src", "common/media/svg/bioversity-logo_small.svg");
                if($("#breadcrumb").css("top") == "110px") {
                        $("#breadcrumb").css("top", "75px");
                }
                $("#pgrdg_map, .panel_content").fadeIn(600);
                $("#map_toolbox").delay(600).animate({"right": "0"}, 300);

                $.init_map();
        }
});
