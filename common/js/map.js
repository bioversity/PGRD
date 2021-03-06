/*jshint scripturl:true*/
/*jshint -W030 */

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

var l = {},
markerMap = {},
default_bbox = [],
draws = [],
drawing = {},
layers = [],
baseLayers,
control,
current_layer,
defaultLayer,
draw_layer,
lat,
lon,
map,
markers,
overlayLayers,
user_layers,
user_search_layers,
user_draw_layers,
zoom;

/**
 * Extract configuration from map config file
 */
$.get_map_config = function(callback) {
        var layer_index = {};

        if($.storage_exists("pgrdg_cache.map_data.config")) {
                if(typeof(callback) == "function") {
                        callback.call(this, storage.get("pgrdg_cache.map_data.config"));
                }
        } else {
                $.cryptAjax({
                        url: "common/include/conf/map.json",
                        dataType: "json",
                        success: function(map_data) {
                                if(typeof(callback) == "function") {
                                        storage.set("pgrdg_cache.map_data.config", map_data);
                                        if(!$.storage_exists("pgrdg_cache.map_data.index")) {
                                                $.each(map_data.map.layers, function(ltype, ldata) {
                                                        if(ltype !== "defaultLayer") {
                                                                $.each(ldata, function(tag, data) {
                                                                        $.each(data, function(t, d) {
                                                                                layer_index[d.layer] = {
                                                                                        type: ltype,
                                                                                        category: tag,
                                                                                        name: d.name
                                                                                };
                                                                        });
                                                                });
                                                        }
                                                });
                                                storage.set("pgrdg_cache.map_data.index", layer_index);
                                        }

                                        callback.call(this, map_data);
                                }
                        }
                });
        }
};

/**
 * Generate map
 */
$.init_map = function(callback) {
        var zindex = 0,
        storage_layer = ($.storage_exists("pgrdg_cache.map_data.layers.current.layer")) ? storage.get("pgrdg_cache.map_data.layers.current.layer") : {},
        storage_overlays = ($.storage_exists("pgrdg_cache.map_data.layers.current.layer.overlay")) ? storage.get("pgrdg_cache.map_data.layers.current.layer.overlay") : {};

        $.get_map_config(function(map_data) {
                lon = map_data.map.default.coordinates.lon;
                lat = map_data.map.default.coordinates.lat;
                zoom = map_data.map.default.zoom.default_zoom;
                default_bbox = map_data.map.default.coordinates.bounding_box;
                map = new L.Map('pgrdg_map', {
                        center: [lat, lon],
                        zoom: zoom,
                                minZoom: map_data.map.default.zoom.min_zoom,
                                maxZoom: map_data.map.default.zoom.max_zoom,

                        inertia: true,
                        zoomControl: true,
                        attributionControl: true,
                        fadeAnimation: true,
                        zoomAnimation: true,
                        markerZoomAnimation: true
                });
                user_layers = new L.LayerGroup();
                user_search_layers = new L.LayerGroup();
                user_draw_layers = new L.LayerGroup();
                draw_layer = new L.FeatureGroup([user_draw_layers]);
                user_layers.addTo(map);
                user_search_layers.setZIndex(1);
                user_search_layers.addTo(map);
                user_draw_layers.setZIndex(2);
                user_draw_layers.addTo(map);

                L.control.scale().addTo(map);

                // For a complete list of available layers see https://github.com/leaflet-extras/leaflet-providers/blob/master/index.html
                if($.obj_len(storage_layer) > 0 && storage_layer.layer !== map_data.map.layers.defaultLayer.layer) {
                        selected_layer = storage_layer;
                } else {
                        selected_layer = map_data.map.layers.defaultLayer;
                }
                defaultLayer = L.tileLayer.provider(selected_layer.layer);
                        defaultLayer.addTo(map);
                baseLayers = map_data.map.layers.baseLayers;
                overlayLayers = map_data.map.layers.overlayLayers;

                $("#change_map").html('<ul class="list-unstyled">');
                var i = 0, h = 0;
                // Levels on the GUI
                $.each(baseLayers, function(group, layers_list) {
                        h++;
                        $.each(layers_list, function(k, v) {
                                if(v.layer == selected_layer.layer) {
                                        $("#change_map ul").append('<li class="selected" onclick="$.change_map_layer(\'' + $.utf8_to_b64(JSON.stringify(v)) + '\')"><a title="Change layer" href="javascript: void(0);" class="btn change_map_btn ' + v.layer.replace(".", "_") + '"><span class="fa fa-check-circle"></span>&nbsp;&nbsp;' + v.name + '</a>');
                                } else {
                                        $("#change_map ul").append('<li onclick="$.change_map_layer(\'' + $.utf8_to_b64(JSON.stringify(v)) + '\')"><a title="Change layer" href="javascript: void(0);" class="btn change_map_btn ' + v.layer.replace(".", "_") + '"><span class="fa fa-circle-o"></span>&nbsp;&nbsp;' + v.name + '</a>');
                                }
                                layers.push(v.layer);
                        });
                        if(h <= $.obj_len(baseLayers)) {
                                $("#change_map ul").append('<li class="divider"></li>');
                        }
                });
                // Overlays
                $.each(map_data.map.layers.overlayLayers, function(group, layers_list) {
                        i++;
                        $.each(layers_list, function(k, v) {
                                if(v.layer !== undefined && v.layer !== null && v.layer !== "") {
                                        if($.storage_exists("pgrdg_cache.map_data.layers.current.overlay." + v.layer.replace(/\./g, "~"))) {
                                                $("#change_map ul").append('<li class="keep_open selected" onclick="$.change_map_layer(\'' + $.utf8_to_b64(JSON.stringify(v)) + '\')"><a title="Add/remove overlay" href="javascript: void(0);" class="btn change_map_btn ' + v.layer.replace(".", "_") + '"><span class="fa fa-check-square"></span>&nbsp;&nbsp;' + v.name + '</a>');
                                                $.show_layer($.utf8_to_b64(JSON.stringify(v)));
                                        } else {
                                                $("#change_map ul").append('<li class="keep_open" onclick="$.change_map_layer(\'' + $.utf8_to_b64(JSON.stringify(v)) + '\')"><a title="Add/remove overlay" href="javascript: void(0);" class="btn change_map_btn ' + v.layer.replace(".", "_") + '"><span class="fa fa-square-o"></span>&nbsp;&nbsp;' + v.name + '</a>');
                                        }
                                        layers.push(v.layer);
                                }
                        });
                        if(i < $.obj_len(map_data.map.layers.overlayLayers)) {
                                $("#change_map ul").append('<li class="divider keep_open"></li>');
                        }
                });
                current_layer = selected_layer.layer;
                l[selected_layer.name] = defaultLayer;
                storage.set("pgrdg_cache.map_data.layers.current.layer", selected_layer);

                var drawControl = new L.Control.Draw({
                        position: 'topleft',
                        draw: {
                                polyline: false,
                                polygon: {
                                        allowIntersection: false,
                                        drawError: {
                                                color: '#b00b00',
                                                timeout: 1000
                                        },
                                        shapeOptions: {
                                                color: "#ff0043",
                                                weight: 2
                                        },
                                        lineJoin: "miter",
                                        showArea: true,
					metric: true
                                },
                                rect: {
                                        shapeOptions: {
                                                color: "#ff0043",
                                                weight: 2
                                        },
                                },
                                circle: {
                                        shapeOptions: {
                                                color: "#ff0043",
                                                weight: 2
                                        }
                                },
                                marker: false
                        },
                        edit: {
                                featureGroup: draw_layer,
                                edit: false,
                                remove: false,
                                selectedPathOptions: {
                                        maintainColor: false,
                                        opacity: 0.3
                                }
                        }
                });
                // map.addControl(drawControl);
                map.on("draw:drawstart", function(e) {
                        $.show_guides();
                });
                map.on("draw:created", function(e) {
                        $.get_drawned_bounds = function(evt) {
                                var formatted = {},
                                latslngs_container = [],
                                latslngs = [];

                                if(evt.layerType !== "circle") {
                                        $.each(evt.layer._latlngs, function(k, v) {
                                                latslngs[k] = [v.lng, v.lat];
                                        });
                                        latslngs.push([evt.layer._latlngs[0].lng, evt.layer._latlngs[0].lat]);
                                        latslngs_container.push(latslngs);

                                        formatted.type = "Polygon";
                                        formatted.coordinates = latslngs_container;
                                } else {
                                        latslngs_container = [evt.layer._latlng.lng, evt.layer._latlng.lat];

                                        formatted.type = "Circle";
                                        formatted.coordinates = latslngs_container;
                                        formatted.radius = Math.ceil(evt.layer._mRadius);
                                }

                                // return L.GeometryUtil.geodesicArea(evt.layer._latlngs);
                                return formatted;
                        };
                        $.execute = function(evt) {
                                var meters = "", area = "";
                                if(evt.layerType == "circle") {
                                        meters = "km<sup>2</sup>";
                                        area = (layer._mRadius / 1000);
                                } else {
                                        meters = "km<sup>2</sup>";
                                        area = L.GeometryUtil.geodesicArea(evt.layer.getLatLngs());
                                }
                                $.sub_toolbox("tools");
                                $("#tools li.selected").removeClass("selected");
                                apprise(i18n[lang].messages.map.selected_area
                                        .replace("{X}", evt.layerType)
                                        .replace("{Y}", $.highlight(area.toFixed(3)))
                                        .replace("{Z}", meters), {
                                                title: i18n[lang].interface.map_selection,
                                                icon: "icon-vector-selection",
                                                titleClass: "text-info",
                                                showHeader: true,
                                                double: true,
                                                cancelBtnClass: "btn-default-grey",
                                                okBtnClass: "btn-default",
                                                textCancel: '<span class="fa fa-trash"></span> ' + i18n[lang].interface.btns.remove_selection,
                                                textOk: i18n[lang].interface.btns.search_in_shape + ' <span class="fa fa-crop"></span>'
                                }, function(r) {
                                        var criteria = {};
                                        if(r === true) {
                                                var formatted = {},
                                                kAPI = {};

                                                if($.storage_exists("pgrdg_cache.search.criteria")) {
                                                        criteria = $.get_storage_selected_forms();
                                                }
                                                if($.storage_exists("pgrdg_cache.search.criteria.select_map_area")) {
                                                        formatted = storage.get("pgrdg_cache.search.criteria.select_map_area");
                                                } else {
                                                        formatted = $.get_drawned_bounds(evt);

                                                        storage.set("pgrdg_cache.search.criteria.select_map_area", formatted);

                                                        var bounds = e.layer.getBounds(),
                                                        bounds_center = bounds.getCenter();
                                                        $.find_location({
                                                                lon: bounds_center.lng,
                                                                lat: bounds_center.lat,
                                                                addressdetails: 1,
                                                                zoom: 0,
                                                                error: function(data) {
                                                                        alert("An error occurred while communicating with the OpenLS service. Please try again.");
                                                                },
                                                                success: function(data) {
                                                                        datap = $.parseJSON(data);
                                                                        storage.set("pgrdg_cache.search.criteria.select_map_area.zone", {name: datap.display_name, ccode: datap.address.country_code});
                                                                }
                                                        });
                                                }
                                                kAPI.storage_group = "pgrdg_cache.summary";
                                                kAPI[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_UNITS;
                                                kAPI.parameters = {};
                                                kAPI.parameters[kAPI_REQUEST_LANGUAGE] = lang;
                                                kAPI.parameters[kAPI_REQUEST_PARAMETERS] = {};
                                                kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = true;
                                                kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA] = criteria;
                                                kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_SHAPE_TAG] = {};
                                                kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_SHAPE_TAG][kAPI_PARAM_INPUT_TYPE] = kAPI_PARAM_INPUT_SHAPE;
                                                kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_SHAPE_TAG][kAPI_PARAM_SHAPE] = formatted;
                                                        if($.storage_exists("pgrdg_cache.search.criteria.fulltext")) {
                                                                kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET] = {};
                                                                kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET][kAPI_PARAM_INPUT_TYPE] = kAPI_PARAM_INPUT_TEXT;
                                                                kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET][kAPI_PARAM_PATTERN] = storage.get("pgrdg_cache.search.criteria.fulltext");
                                                        }
                                                kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_GROUP] = [];
                                                kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SHAPE_OFFSET] = kTAG_GEO_SHAPE_DISP;

                                                $.ask_to_service(kAPI, function(res) {
                                                        if($.obj_len(res[kAPI_RESPONSE_RESULTS]) > 0 || res[kAPI_RESPONSE_RESULTS].length > 0) {
                                                                $.activate_panel("summary", {res: res}, function(){
                                                                        // --> REMOVE ALL .map CLASSES ------------------------------------------------------------------------------------------ //

                                                                        // $("#se_p").show();
                                                                        // $("#breadcrumb").show();
                                                                        $.restore_stage();
                                                                        user_search_layers.clearLayers();
                                                                        draws = [];
                                                                });
                                                        } else {
                                                                apprise(i18n[lang].messages.map.no_data_found.message, {
                                                                        title: i18n[lang].messages.map.no_data_found.title,
                                                                        icon: "warning",
                                                                        class: "drawing"
                                                                });
                                                        }
                                                });
                                        } else if(r =="perhaps") {
                                                layer.editing.enable();
                                        } else {
                                                user_search_layers.clearLayers();
                                                draws = [];
                                        }
                                });
                        };
                        $.remove_selection = function(e) {
                                if($("#apprise").is(":hidden")) {
                                        if($("#apprise.drawing").is(":hidden")) {
                                                $("#apprise.drawing").on("hidden.bs.modal", function() {
                                                        $(".drawing").remove();
                                                });
                                        }
                                        $("#apprise.drawing").modal("hide").on("hidden.bs.modal", function() {
                                                $("#apprise").remove();
                                        });

                                        e.preventDefault();
                                        apprise(i18n[lang].messages.map.are_you_sure_to_remove.message, {
                                                title: i18n[lang].messages.map.are_you_sure_to_remove.title,
                                                icon: "warning",
                                                class: "drawing",
                                                confirm: true
                                        }, function(r) {
                                                if(r) {
                                                        user_search_layers.clearLayers();
                                                        draws = [];
                                                }
                                        });
                                        return false;
                                }
                        };
                        $.proceed = function(evt) {
                                user_search_layers.clearLayers();
                                user_search_layers.addLayer(layer);
                                draws = [];
                                draws.push(layer);

                                layer.editing.enable();
                                $.execute(evt);
                                layer.on("mouseover", function() { $("#pgrdg_map").css("cursor", "pointer"); });
                                layer.on("mouseout", function() { $("#pgrdg_map").css("cursor", "grab"); });
                                layer.on("click", function() {
                                        layer.editing.enable();
                                });
                                layer.on("dblclick", function() {
                                        $.execute(evt);
                                });
                                $(document).bind("keydown", "del", function(e) {
                                        $.remove_selection(e);
                                });
                                $("#pgrdg_map").on("click", function() {
                                        layer.editing.disable();
                                });
                        };

                        var type = e.layerType,
                        layer = e.layer;

                        if(draws.length === 0) {
                                $.proceed(e);
                        } else {
                                apprise(i18n[lang].messages.map.only_one_shape.message, {title: i18n[lang].messages.map.only_one_shape.title, confirm: true}, function(r) {
                                        if(r) {
                                                $.proceed(e);
                                        }
                                });
                        }
                        $.hide_guides();
                });
                drawing.polygon = new L.Draw.Polygon(map);
                drawing.rectangle = new L.Draw.Rectangle(map);
                drawing.circle = new L.Draw.Circle(map);



                /*control = L.control.layers.provided(baseLayers, overlayLayers, {collapsed: true});//.addTo(map);*/
                map.invalidateSize();
                map.setMaxBounds([[-85.0, -200.0], [85.0, 200.0]]);

                $(".leaflet-control-attribution.leaflet-control").html('<div class="attribution">' + $(".leaflet-control-attribution.leaflet-control").html() + '</div><a class="info" href="javascript: void(0);" onclick="$(\'.leaflet-control-attribution.leaflet-control div.attribution\').toggle_layer_description();"><span class="fa fa-info-circle"></span></a>');

                        //console.log(map);
                map.on("zoomend", function(e) {
                        var current_layer_data = $.get_current_layer_options(),
                        selected_layer_obj = storage.get("pgrdg_cache.map_data.layers.current.layer"),
                        min_zoom_for_this_layer = (selected_layer_obj.min_zoom !== undefined) ? selected_layer_obj.min_zoom : current_layer_data.minZoom,
                        max_zoom_for_this_layer = (selected_layer_obj.max_zoom !== undefined) ? selected_layer_obj.max_zoom : parseInt(current_layer_data.maxZoom - 4);
                        e.target.options.minZoom = min_zoom_for_this_layer;
                        e.target.options.maxZoom = max_zoom_for_this_layer;
                });

                if (callback) {
                        callback(map);
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

        return map;
};

/**
 * Enable drawing selection polygon
 * @param  {object} map Main map object
 */
$.draw_polygon = function(map) {
        drawing.polygon.enable();
        $("#draw_polygon_btn").closest("li").addClass("selected");
};

/**
 * Enable drawing selection rectangle
 * @param  {object} map  Main map object
 */
$.draw_rectangle = function(map) {
        drawing.rectangle.enable();
        $("#draw_rectangle_btn").closest("li").addClass("selected");
};

/**
 * Enable drawing selection circle
 * @param  {object} map  Main map object
 */
$.draw_circle = function(map) {
        drawing.circle.enable();
        $("#draw_circle_btn").closest("li").addClass("selected");
};

/**
 * Reset a previous generated map
 */
$.reset_map = function() {
        //$("#pgrdg_map").html("");
        $("#pgrdg_map").remove();
        $('<div id="pgrdg_map" style="display: none;">').insertAfter("#map");

        //$.init_map();
};

/*=======================================================================================
 *	POSITIONING AND CENTERING
 *======================================================================================*/

        /**
 * Return current boundingbox
 */
$.get_current_bbox = function() { return map.getBounds(); };

/**
 * Return current boundingbox in EPSG 43826
 */
// $.get_current_bbox_epsg = function() { return ol.proj.transform(map.getView().getView2D().calculateExtent(map.getSize()), "EPSG:3857", "EPSG:4326"); };

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
// $.set_lonlat = function(lon, lat) { return ol.proj.transform([parseFloat(lon), parseFloat(lat)], "EPSG:4326", "EPSG:3857"); };

/**
 * Set coordinates giving boundingbox axis
 */
// $.set_lonlat_bbox = function(a, b, c, d) { return ol.extent.transform([parseFloat(a), parseFloat(b), parseFloat(c), parseFloat(d)], ol.proj.getTransform("EPSG:4326", "EPSG:3857")); };

/**
 * Center map on given coordinates
 * @param {string} lon  Longitude
 * @param {string} lat  Latitude
 */
$.set_center = function(lon, lat, zoom) {
        if(zoom === undefined) {
                zoom = 0;
        }
        map.panTo(L.latLng(parseFloat(lat), parseFloat(lon)), {animate: false});
        if(zoom !== 0) {
                $.set_zoom(parseFloat(zoom));
        }
};

$.get_center_bbox = function(boundingbox) {
        var minLat = boundingbox[0],
        maxLat = boundingbox[1],
        minLng = boundingbox[2],
        maxLng = boundingbox[3],
        southWest = new L.LatLng(minLat, minLng),
        northEast = new L.LatLng(maxLat, maxLng);

        return [southWest, northEast];
};

/**
 * Center map on given boundingbox
 */
$.set_center_bbox = function(boundingbox) {
        center = $.get_center_bbox(boundingbox);
        bounds = new L.LatLngBounds(center[0], center[1]);
        map.fitBounds(bounds, {
                maxZoom: 9
        });
};

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
                                loc_data.zoom = 1;
                                break;
                        case "Africa":
                                loc_data.lon = 18;
                                loc_data.lat = -2;
                                loc_data.zoom = 4;
                                break;
                        case "Antarctica":
                                loc_data.lon = -10;
                                loc_data.lat = 75;
                                loc_data.zoom = 3;
                                break;
                        case "Asia":
                                loc_data.lon = 90;
                                loc_data.lat = 50;
                                loc_data.zoom = 4;
                                break;
                        case "Europe":
                                loc_data.lon = 12;
                                loc_data.lat = 55;
                                loc_data.zoom = 4;
                                break;
                        case "North America":
                                loc_data.lon = -98;
                                loc_data.lat = 48;
                                loc_data.zoom = 4;
                                break;
                        case "South America":
                                loc_data.lon = -58;
                                loc_data.lat = -28;
                                loc_data.zoom = 4;
                                break;
                        case "Oceania":
                                loc_data.lon = 130;
                                loc_data.lat = -15;
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
                                                        $.set_center(position.coords.longitude, position.coords.latitude, 13);
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
                        $.set_center(loc_data.lon, loc_data.lat, loc_data.zoom);
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
$.increase_zoom = function() { $.set_zoom(($.get_current_zoom() + 1)); };
/**
 * Decrease zoom level
 */
$.decrease_zoom = function() { $.set_zoom(($.get_current_zoom() - 1)); };


/*=======================================================================================
 *	LAYERS
 *======================================================================================*/

/**
 * Get generated layer and build relative menu
 */
$.get_generated_layers = function(selected) {
        //console.dir(user_layers.getLayers());
        var icon = "", item_id = "", show = false;
        if($.storage_exists("pgrdg_cache.map_data.user_layers")) {
                if($.storage_exists("pgrdg_cache.map_data.user_layers.results")) {
                        $.each(storage.get("pgrdg_cache.map_data.user_layers.results"), function(id, search_data) {
                                var label = i18n[lang].interface.search;
                                console.log("Not working... you must generate an MD5(CRITERIA + DOMAIN)... See form.js on line 365");
                                console.warn(search_data);
                                item_id = $.md5(search_data[kAPI_PARAM_CRITERIA] + search_data[kAPI_PARAM_DOMAIN]);
                                if(search_data[kAPI_PARAM_CRITERIA].fulltext !== undefined && search_data[kAPI_PARAM_CRITERIA].fulltext !== "") {
                                        label += ': "' + search_data[kAPI_PARAM_CRITERIA].fulltext.replace(/"/g, "") + '"';
                                }
                                if(search_data[kAPI_PARAM_CRITERIA].node !== undefined && $.obj_len(search_data[kAPI_PARAM_CRITERIA].node) > 0) {
                                        $.each(search_data[kAPI_PARAM_CRITERIA].node, function(gk, gv) {
                                                if(gv.is_patch === undefined || gv.is_patch !== true) {
                                                        label += " in " + gv.name;
                                                } else {
                                                        label += " " + gv.name.toLowerCase() + "s";
                                                }
                                        });
                                }
                                // Check all loaded layers and compare with current
                                var $li = $('<li>'),
                                $a1 = $('<a>'),
                                $a2 = $('<a>'),
                                $span1 = $('<span>'),
                                $span2 = $('<span>');

                                $li.attr("id", item_id).addClass("keep_open");
                                $a1.addClass("btn pull-left").attr({
                                        href: "javascript: void(0);",
                                        onclick: '$(this).toggle_layer_btn(\'' + item_id + '\');',
                                        title: i18n[lang].messages.search.switch_layer
                                });
                                $a2.addClass("btn pull-right").attr({
                                        href: "javascript: void(0);",
                                        onclick: '$.remove_selected_search(\'' + item_id + '\', \'map_data.user_layers.results\', \'true\');',
                                        title: i18n[lang].messages.search.remove_search
                                });
                                $span1.addClass("fa " + ((selected == item_id) ? "fa-check-square" : "fa-square-o"));
                                $span2.addClass("fa fa-trash");
                                $a1.html($span1);
                                $a1.append(" " + label);
                                $a2.html($span2);
                                $li.html($a1);
                                $li.append($a2);

                                $.each($("#user_layers li"), function(k, v) {
                                        $(this).find("a.pull-left span").removeClass("fa-check-square").addClass("fa-square-o");
                                });
                                if(selected == item_id) {
                                        $("li#" + item_id).find("a.pull-left span").removeClass("fa-square-o").addClass("fa-check-square");
                                }
                                if($("li#" + item_id).length === 0) {
                                        $("#selected_layer").append($li);
                                }
                                console.log(item_id, $("li#" + item_id).length, selected);
                        });
                        show = true;
                }
                if($.storage_exists("pgrdg_cache.map_data.user_layers.searches")) {
                        $.each(storage.get("pgrdg_cache.map_data.user_layers.searches"), function(id, search_data) {
                                var label = i18n[lang].interface.search;
                                if(search_data.input !== undefined && search_data.input !== "") {
                                        label += ' in map: "' + search_data.input + '"';
                                }
                                if(selected == $.md5(search_data.input)) {
                                        icon = "fa-check-circle";
                                } else {
                                        icon = "fa-circle-o";
                                }
                                if($("li#" + $.md5(search_data.input)).length === 0) {
                                        $("#selected_layer").append('<li id="' + $.md5(search_data.input) + '" class="keep_open"><a class="btn pull-left" href="javascript: void(0);" onclick="$(this).search_location(\'' + search_data.input + '\');" title="' + i18n[lang].messages.search.switch_layer + '"><span class="fa ' + icon + '"></span> ' + label + '</a><a href="javascript: void(0);" onclick="$.remove_selected_search(\'' + $.md5(search_data.input) + '\', \'map_data.user_layers.searches\');" class="btn pull-right" title="' + i18n[lang].messages.search.remove_search + '"><span class="fa fa-trash"></span></a></li>');
                                }
                        });
                        show = true;
                }
        } else {
                show = false;
        }
        if(show) {
                $("#user_level_btn").show();
        } else {
                $("#user_level_btn").hide();
        }
};

/**
 * Retrieve the level data
 */
$.get_level_data = function(level) {
        if(level.options !== undefined) {
                return level.options;
        }
};

/**
 * Return the current layer object data
 */
$.get_current_layer_options = function() {
        var ll = {};
        $.each(l, function(name, layer_data) {
                ll = layer_data.options;
        });
        return ll;
};

/**
 * Return the current layer
 */
$.current_layer = function() { return current_layer; };

/**
 * Return the index of a given layer
 */
$.get_layer_index = function(identifier) {
        var index = storage.get("pgrdg_cache.map_data.index");
        return index[identifier];
};

/**
 * Show selected layer
 */
$.show_layer = function(selected_layer) {
        var selected_layer_obj = $.parseJSON($.b64_to_utf8(selected_layer)),
        selected_layer_name = selected_layer_obj.name,
        selected_layer_identifier = selected_layer_obj.layer,
        selected_layer_index = $.get_layer_index(selected_layer_identifier),
        overlay = {},
        overlay_exists = false;

        if(selected_layer_index.type !== "baseLayers") {
                if($.storage_exists("pgrdg_cache.map_data.layers.current.overlay")) {
                        overlay = storage.get("pgrdg_cache.map_data.layers.current.overlay");
                }
        }

        selected_layer = selected_layer_obj.layer;
        l[selected_layer_name] = L.tileLayer.provider(selected_layer_obj.layer);

        var current_layer_data = $.get_current_layer_options(),
        min_zoom_for_this_layer = (selected_layer_obj.min_zoom !== undefined) ? selected_layer_obj.min_zoom : current_layer_data.minZoom,
        max_zoom_for_this_layer = (selected_layer_obj.max_zoom !== undefined) ? selected_layer_obj.max_zoom : parseInt(current_layer_data.maxZoom - 4);

        map.options.maxZoom = min_zoom_for_this_layer;
        map.options.maxZoom = max_zoom_for_this_layer;
        if($.get_current_zoom() > max_zoom_for_this_layer){
                map.invalidateSize();
                //l[selected_layer_name]._clearBgBuffer();
                setTimeout(function() {
                        map.setZoom(max_zoom_for_this_layer);
                }, 0);
        } else {
                setTimeout(function() {
                        map.setZoom($.get_current_zoom());
                }, 0);
        }
        $.hide_all_layers(selected_layer_name);
        map.addLayer(l[selected_layer_name]);
        l[selected_layer_name].setZIndex(selected_layer_obj.zindex);
        if(selected_layer_index.type == "baseLayers") {
                storage.set("pgrdg_cache.map_data.layers.current.layer", selected_layer_obj);
        } else {
                overlay[selected_layer_identifier.replace(/\./g, "~")] = selected_layer_obj;
                //console.log(selected_layer_identifier.replace(/\./g, "~"));
                storage.set("pgrdg_cache.map_data.layers.current.overlay", overlay);
        }

        $(".leaflet-control-attribution.leaflet-control").html('<div class="attribution">' + $(".leaflet-control-attribution.leaflet-control").html() + '</div><a class="info" href="javascript: void(0);" onclick="$(\'.leaflet-control-attribution.leaflet-control div.attribution\').toggle_layer_description();"><span class="fa fa-info-circle"></span></a>');
};

/**
 * Hide selected layer
 */
$.hide_layer = function(selected_layer_name) {
        map.removeLayer(l[selected_layer_name]);
};

/**
 * Hide all level 0 layers
 */
$.hide_all_layers = function(selected_layer_obj){
        $.each(l, function(name, level) {
                if(name !== selected_layer_obj.name && selected_layer_obj.zindex === 1) {
                        var level_data = $.get_level_data(level);
                        if(level_data !== undefined && level_data.zIndex === 1) {
                                $.hide_layer(name);
                                delete l[name];
                        }
                }
        });
};

/**
 * Switch displayed layer
 */
$.change_map_layer = function(selected_layer, zindex) {
        var selected_layer_obj = $.parseJSON($.b64_to_utf8(selected_layer)),
        storage_layer = storage.get("pgrdg_cache.map_data.layers.current.layer.layer");
        $this = $("#change_map a." + selected_layer_obj.layer.replace(".", "_")).find("span");
        if(selected_layer_obj.layer !== $.current_layer()) {
                if($this.hasClass("fa-circle-o") || $this.hasClass("fa-check-circle")) {
                        $("#change_map li").find("span.fa-check-circle").closest("li").removeClass("selected").find("span").removeClass("fa-check-circle").addClass("fa-circle-o");
                        $("#change_map a." + selected_layer_obj.layer.replace(".", "_")).parent("li").addClass("selected").find("span").removeClass("fa-circle-o").addClass("fa-check-circle");
                        $.show_layer(selected_layer);
                        current_layer = selected_layer_obj.layer;
                } else {
                        if($this.hasClass("fa-square-o")) {
                                $("#change_map a." + selected_layer_obj.layer.replace(".", "_")).parent("li").addClass("selected").find("span").removeClass("fa-square-o").addClass("fa-check-square");
                                $.show_layer(selected_layer);
                                current_layer = storage_layer;
                        } else {
                                $("#change_map a." + selected_layer_obj.layer.replace(".", "_")).parent("li").removeClass("selected").find("span").removeClass("fa-check-square").addClass("fa-square-o");
                                $.hide_layer(selected_layer_obj.name);
                                $.remove_storage("pgrdg_cache.map_data.layers.current.overlay." + selected_layer_obj.layer.replace(/\./g, "~"));
                                current_layer = storage_layer;
                        }
                }
                $.hide_all_layers(selected_layer_obj);
        } else {
                if($this.hasClass("fa-check-square")) {
                        $("#change_map a." + selected_layer_obj.layer.replace(".", "_")).parent("li").removeClass("selected").find("span").removeClass("fa-check-square").addClass("fa-square-o");
                        $.hide_layer(selected_layer_obj.name);
                }
        }
        $(".leaflet-control-attribution.leaflet-control").find("a.info").html("");
        $(".leaflet-control-attribution.leaflet-control").html('<div class="attribution">' + $(".leaflet-control-attribution.leaflet-control").html() + '</div><a class="info" href="javascript: void(0);" onclick="$(\'.leaflet-control-attribution.leaflet-control div.attribution\').toggle_layer_description();"><span class="fa fa-info-circle"></span></a>');
        $.sub_toolbox("change_map");
};


/*=======================================================================================
 *	MAP ENVIRONMENT AND STAGE
 *======================================================================================*/

/*=======================================================================================
 *	MAP TOOLBOX
 *======================================================================================*/
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
 * Toggle visibility of layer description
 */
$.fn.toggle_layer_description = function() {
        if($(this).is(":visible")) {
                $(this).stop().fadeOut();
        } else {
                $(this).fadeIn(100, function() {
                        $(this).delay(5000).fadeOut();
                });
        }
};

/**
* Generate right subtoolbox panel
* @param  {string} action Selected tool
*/
$.sub_toolbox = function(action) {
        if($("#" + action).css("display") == "none") {
                $.reset_map_toolbox();

                $("#" + action + "_btn").parent("li").addClass("selected");
                $("#" + action).fadeIn(function() {
                        $(this).addClass("open");
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

                                                // $("body, #pgrdg_map").on("mousedown", function(e) {
                                                //         if(!$(e.target).closest("li").hasClass("keep_open")) {
                                                //                $.sub_toolbox("close");
                                                //         }
                                                // });
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
                                case "user_level":
                                        break;
                                case "tools":
                                        // if(!$("#user_level_btn").is(":visible")) {
                                        //         $(this).switchClass("level3", "level4", 100);
                                        // } else {
                                        //         $(this).switchClass("level2", "level3", 100);
                                        // }
                                        break;
                        }
                });
        } else {
                if(action == "close") {
                        $("#map_sub_toolbox div").fadeOut(300);
                        $("#" + action + "_btn").parent("li").removeClass("selected");
                } else {
                        $("#" + action + "_btn").parent("li").removeClass("selected");
                        switch(action) {
                                case "find_location":
                                        $("#" + action).fadeOut(300);
                                        break;
                                case "change_map":
                                        $("#" + action).fadeOut(300);
                                        break;
                                case "user_level":
                                        $("#" + action).fadeOut(300);
                                        break;
                                case "tools":
                                        $("#" + action).fadeOut(300);
                                        break;
                                default:
                                        $("#" + action).fadeOut(300, function() {

                                        });
                                        break;
                        }
                }
        }
};


/*=======================================================================================
 *	GRAPHIC INTERACTION FUNCTIONS
 *======================================================================================*/
/**
 * Lock/unlock interactions on map
 */
$.toggle_lock_view = function() {
        var current_view = $.get_current_bbox();
        if(!$("#pgrdg_map").hasClass("locked")) {
                $(".leaflet-control-zoom").animate({"left": "-50px"}, 300);
                $(".leaflet-control-attribution div.attribution").stop().fadeOut(0, function() {
                        $(".leaflet-control-attribution").animate({"margin-right": "-120px"}, 300);
                });
                $("#pgrdg_map").removeClass("grabbing");
                $("#pgrdg_map").addClass("locked");
                $("#lock_view_btn").addClass("pulse");
                $.reset_map_toolbox();
                $.disable_map_toolbox();
                $("#selected_zone").html('<span style="position: fixed; top: 50%; right: 50%; margin-top: -80px; opacity: 0.5; text-shadow: 0px 0px 100px rgb(0, 0, 0);" class="fa fa-lock fa-2x"></span>' + i18n[lang].interface.map_locked).stop().show();
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
                $("#selected_zone").text("Map unlocked").show().delay(5000).hide();
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
        $("#guides").show();
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
 * Hide guides on map
 */
$.hide_guides = function() {
        $("#guides").hide();
};

/**
 * Show/hide the main menu
 */
$.sh_menu = function() {
        if($("#nav").is(":visible")) {
                $("#nav").hide("slide", { direction: "right" }, 100);
                $("#show_hide_menu_btn").closest("li").removeClass("selected");
        } else {
                $("#nav").show("slide", { direction: "right" }, 100);
                $("#show_hide_menu_btn").closest("li").addClass("selected");
        }
};

/**
 * Show/hide the breadcrumb
 */
$.sh_breadcrumb = function() {
        if($("#breadcrumb").is(":visible")) {
                $("#breadcrumb").hide("slide", { direction: "right" }, 100);
                $("#show_hide_breadcrumb_btn").closest("li").removeClass("selected");
        } else {
                $("#show_hide_breadcrumb_btn span.fa").addClass("fa-1rspin");
                $("#breadcrumb").show("slide", { direction: "right" }, 100, function() {
                        $("#show_hide_breadcrumb_btn span.fa").removeClass("fa-1rspin");
                });
                $("#show_hide_breadcrumb_btn").closest("li").addClass("selected");
        }
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


/*=======================================================================================
 *	FIND LOCATIONS
 *======================================================================================*/
/**
* Search location from given coordinates
* @param  {object} options (format, lat, lon, addressdetails)
* @return {object}         The results of search in Nominatim OpenStreetmap
*/
$.find_location = function(options) {
        options = $.extend({
                "accept-language": lang,
                format: "json",
                lat: 0,
                lon: 0,
                addressdetails: 0,
                zoom: 18
        }, options);

        var query = {
                format: options.format,
                "accept-language": options["accept-language"],
                lat: options.lat,
                lon: options.lon,
                zoom: options.zoom,
                addressdetails: options.addressdetails
        };

        $.ajax({
                url: "API/",
                type: "get",
                format: "json",
                crossDomain: true,
                data: {
                        proxy: "true",
                        type: "get",
                        header: "text/json",
                        address: "http://nominatim.openstreetmap.org/reverse?" + $.param(query),
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
$.fn.search_location = function(input) {
        $.show_results = function(datap, callback) {
                var place_id = "";
                $("#information_zone").html('<h3>' + i18n[lang].messages.search.results_for.replace("{X}", input) + '</h3><ul class="fa-ul"></ul>');
                $.each(datap, function(k, v) {
                        var mc,
                        title = i18n[lang].messages.search.search_of.replace("{X}", '"' + input + '"'),
                        content = v.display_name;
                        //console.log(datap[k].lon, datap[k].lat);
                        if(k === 0) {
                                mc = "primary";
                        } else {
                                mc = "secondary";
                        }
                        if(v.geojson !== undefined && $.obj_len(v.geojson) > 0) {
                                $.add_geojson_cluster({
                                        id: v.place_id,
                                        geojson: v.geojson,
                                        lon: v.lon,
                                        lat: v.lat,
                                        service: false,
                                        name: v.display_name,
                                        title: title,
                                        content: content,
                                        center: false
                                });
                        } else {
                                $.add_marker({
                                        uuid: v.place_id,
                                        lon: v.lon,
                                        lat: v.lat,
                                        marker_class: mc,
                                        name: v.display_name,
                                        title: title,
                                        content: content
                                });
                        }
                        $("#information_zone ul").append('<li><a class="btn ' + ((k === 0) ? 'disabled' : '') + '" href="javascript: void(0);" onclick="$(this).select_marker({marker_id: \'' + v.place_id + '\', title: \'' + title.replace(/"/g, "&quot;") + '\', content: \'' + content.replace(/"/g, "&quot;") + '\'});" title="' + v.display_name + '"><span class="fa fa-fw fa-angle-right"></span>' + v.display_name + '</a></li>');

                        markerMap[v.place_id] = v;
                });
                $("#map_toolbox span.ion-loading-c").removeClass("ion-loading-c").addClass("ion-search").parent("a").removeClass("disabled");
                $("#find_location input").prop("disabled", false);

                map.fitBounds([
                        [parseFloat(datap[0].boundingbox[0]), parseFloat(datap[0].boundingbox[2])],
                        [parseFloat(datap[0].boundingbox[1]), parseFloat(datap[0].boundingbox[3])]
                ]);
                $("#" + datap[0].place_id).popover("show");
                map.invalidateSize();

                if (typeof(callback) == "function") {
                        callback.call(this, place_id);
                }
        };

        $("#loader").show();
        user_search_layers.clearLayers();
        map.closePopup();
        if($(this).find("span").length > 0 && $(this).find("span").hasClass("fa-check-circle")) {
                $("#information_zone").html("");
                $("#selected_zone").stop().hide();

                $(this).find("span").removeClass("fa-check-circle").addClass("fa-circle-o");
                $("#loader").hide();
        } else {
                $.each($(this).closest("ul").find("li"), function(k, v) {
                        if($(this).find("a.pull-left span").length > 0 && $(this).find("a.pull-left span").hasClass("fa-check-circle")) {
                                $(this).find("a.pull-left span").removeClass("fa-check-circle").addClass("fa-circle-o");
                        }
                });
                if($(this).find("span").length > 0 && $(this).find("span").hasClass("fa-circle-o")) {
                        $(this).find("span").removeClass("fa-circle-o").addClass("fa-check-circle");
                }
                if(input.length > 0) {
                        $("#map_toolbox #find_location_btn span").removeClass("ion-search").addClass("ion-loading-c").parent("a").addClass("disabled");
                        $("#find_location input").attr("disabled", true);
                        $("#information_zone").html("");
                        $("#selected_zone").html(i18n[lang].messages.search.map_search_place.replace("{X}", input)).fadeIn(300).delay(5000).fadeOut(600);

                        if(!$.storage_exists("pgrdg_cache.map_data.user_layers.searches." + $.md5(input))) {
                                $.ajax({
                                        url: "API/",
                                        type: "get",
                                        format: "json",
                                        crossDomain: true,
                                        data: {
                                                proxy: "true",
                                                type: "get",
                                                header: "text/json",
                                                address: "http://nominatim.openstreetmap.org/search.php?q=" + encodeURIComponent(input) + "&format=json&addressdetails=true&bounded=true&limit=10&polygon_geojson=true"
                                        },
                                        success: function(data) {
                                                var datap = $.parseJSON(data);
                                                if($.obj_len(datap) > 0) {
                                                        storage.set("pgrdg_cache.map_data.user_layers.searches." + $.md5(input), {input: input, results: datap});

                                                        $("#selected_zone").text(datap[0].display_name).fadeIn(300).delay(5000).fadeOut(600).stop();

                                                        $.show_results(datap, function(place_id) {
                                                                $("#selected_zone").stop().hide();
                                                                $("#loader").hide();
                                                        });
                                                        $.get_generated_layers($.md5(input));
                                                } else {
                                                        $("#selected_zone").text(i18n[lang].messages.search.no_search_results.message).delay(5000).fadeOut(600).stop();
                                                        $("#map_toolbox span.ion-loading-c").removeClass("ion-loading-c").addClass("ion-search").parent("a").removeClass("disabled");
                                                        $("#find_location input").prop("disabled", false);
                                                }
                                        },
                                        error: function(data) {
                                                $("#selected_zone").text(i18n[lang].messages.search.no_search_results.message).delay(5000).fadeOut(600);
                                                $("#map_toolbox span.ion-loading-c").removeClass("ion-loading-c").addClass("ion-search").parent("a").removeClass("disabled");
                                                $("#find_location input").prop("disabled", false);
                                        }
                                });
                        } else {
                                $.show_results(storage.get("pgrdg_cache.map_data.user_layers.searches." + $.md5(input) + ".results"), function(place_id) {
                                        $("#selected_zone").stop().hide();
                                        $("#loader").hide();
                                });
                        }
                }
        }
};


/**
 * Remove a given search id from map and storage
 */
$.remove_selected_search = function(id, storage_path, confirm) {
        $.exec_removal = function() {
                if($("li#" + id).find("span:first-child").hasClass("fa-check-circle")) {
                        user_search_layers.clearLayers();
                        map.closePopup();
                }
                if($("li#" + id).find("span:first-child").hasClass("fa-check-square")) {
                        user_layers.clearLayers();
                        map.closePopup();
                        $.each($("li#" + id).closest("ul").find("li"), function(k, v) {
                                if($(this).find("a.pull-left span").hasClass("fa fa-check-square")) {
                                        if($(this).attr("id") !== id) {
                                                if($.storage_exists("pgrdg_cache.map_data.user_layers.results." + $(this).attr("id"))) {
                                                        $.add_geojson_cluster({
                                                                id: $(this).attr("id"),
                                                                geojson: storage.get("pgrdg_cache.map_data.user_layers.results." + $(this).attr("id") + ".results"),
                                                                title: "OK",
                                                                content: "Yeah"
                                                        });
                                                }
                                        }
                                }
                        });
                }
                $("li#" + id).remove();
                $("#information_zone").fadeOut(300, function() { $(this).html(""); });
                $.remove_storage("pgrdg_cache." + storage_path + "." + id, function() {
                        if($.obj_len(storage.get("pgrdg_cache." + storage_path)) === 0) {
                                $.remove_storage({
                                        check: false,
                                        name: "pgrdg_cache." + storage_path
                                }, function() {
                                        $("#user_layers").hide();
                                        if($.obj_len(storage.get("pgrdg_cache.map_data.user_layers")) === 0) {
                                                $("#user_level_btn").hide();
                                        }
                                });
                        }
                });
        };

        var remove = false;
        if(confirm === undefined) {
                confirm = false;
        }
        if(confirm) {
                apprise(i18n[lang].messages.map.are_you_sure_to_remove_this_layer.message, {title: i18n[lang].messages.map.are_you_sure_to_remove_this_layer.title, icon: "warning", confirm: true}, function(r) {
                        if(r) {
                                $.exec_removal();
                        }
                });
        } else {
                $.exec_removal();
        }
};

/**
 * Activate markers clicking on the list placed on the left
 */
$.fn.select_marker = function(options) {
        options = $.extend({
                marker_id: "",
                title: "",
                content: ""
        }, options);

        $.each($(this).closest("ul").find("li a"), function(item) {
                $(this).removeClass("disabled");
        });
        $(this).addClass("disabled");
        var ma = markerMap[options.marker_id],
        popup = L.popup()
            .setLatLng(L.latLng((ma.lat + 10), ma.lon))
            .setContent('<h4 class="text-info"><span class="fa-map-marker text-danger fa fa-lg"></span> ' + options.title + '</h4>' + '<p>' + options.content + '</p>');

        //$.each($(this).closest("ul").find("li"), function(k, v) {
        //        $(this).find("a").text($(this).find("a").text());
        //});
        $("#selected_zone").html(options.content).show().stop().delay(5000).hide();
        map.closePopup();
        if(map.geojson.type == "Point") {
                $.set_center(ma.lon, ma.lat, 10);
                map.invalidateSize();
        } else {
                map.fitBounds([
                        [parseFloat(ma.boundingbox[0]), parseFloat(ma.boundingbox[2])],
                        [parseFloat(ma.boundingbox[1]), parseFloat(ma.boundingbox[3])]
                ]);
                map.invalidateSize();
        }
};

/**
 * Toggle visibility of a given layer by button
 */
$.fn.toggle_layer_btn = function(selected_layer) {
        if($(this).find("span").hasClass("fa-square-o")) {
                $(this).find("span").removeClass("fa-square-o").addClass("fa-check-square");
                $("#loader").removeClass("system").fadeIn(100, function() {
                        map.addLayer(user_layers);
                        if($.storage_exists("pgrdg_cache.map_data.user_layers.results." + selected_layer)) {
                                $.add_geojson_cluster({
                                        id: selected_layer,
                                        geojson: storage.get("pgrdg_cache.map_data.user_layers.results." + selected_layer + ".results"),
                                        title: "OK",
                                        content: "Yeah"
                                }, function() {
                                        $("#loader").fadeOut(150);
                                });
                        }
                });
        } else {
                $(this).find("span").removeClass("fa-check-square").addClass("fa-square-o");
                // console.log(map);
                // map.removeLayer(user_layers);
                user_layers.clearLayers();
                map.closePopup();
                $.each($(this).closest("ul").find("li"), function(k, v) {
                        if($(this).find("a.pull-left span").hasClass("fa fa-check-square")) {
                                if($.storage_exists("pgrdg_cache.map_data.user_layers.results." + $(this).attr("id"))) {
                                        $.add_geojson_cluster({
                                                id: selected_layer,
                                                geojson: storage.get("pgrdg_cache.map_data.user_layers.results." + $(this).attr("id") + ".results"),
                                                title: "OK",
                                                content: "Yeah"
                                        });
                                }
                        }
                });
        }
};

/**
 * Markers, clusters and popup
 */
$.add_heatmap = function(options, heatdata) {
        options = $.extend({
                radius: 20,
                blur: 15,
                maxZoom: 17
        });
        if(heatdata === undefined) {
                heatdata = [
                        [-37.8210922667, 175.2209316333, "2"],
                        [-37.8210819833, 175.2213903167, "3"],
                        [-37.8210881833, 175.2215004833, "3A"],
                        [-37.8211946833, 175.2213655333, "1"],
                        [-37.8209458667, 175.2214051333, "5"],
                        [-37.8208292333, 175.2214374833, "7"],
                        [-37.8325816, 175.2238798667, "537"],
                        [-37.8315855167, 175.2279767, "454"],
                        [-37.8096336833, 175.2223743833, "176"],
                        [-37.80970685, 175.2221815833, "178"],
                        [-37.8102146667, 175.2211562833, "190"],
                        [-37.8088037167, 175.2242227, "156"],
                        [-37.8112330167, 175.2193425667, "210"],
                        [-37.8116368667, 175.2193005167, "212"],
                        [-37.80812645, 175.2255449333, "146"],
                        [-37.8080231333, 175.2286383167, "125"],
                        [-37.8089538667, 175.2222222333, "174"],
                        [-37.8080905833, 175.2275400667, "129"],
                        [-37.8194342167, 175.22322975, "9"]
                ];
        }
        var heat = L.heatLayer(heatdata, options);
        map.addLayer(heat);
        console.log("Heatmap added. Visible?");
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
        /*var set_center_btn = '<a class="btn btn-default btn-sm" title="Center point on the screen" href="javascript:void(0);" onclick="$.set_center(\'' + options.lon + '\',\'' + options.lat + '\');"><span class="fa fa-crosshairs"></span></a>',
        set_zoom_btn = '<a class="btn btn-default btn-sm" title="Zoom here" href="javascript:void(0);" onclick="$.set_center(\'' + options.lon + '\',\'' + options.lat + '\'); $.set_zoom(12); $(\'#' + options.uuid + '\').popover(\'hide\');"><span class="fa fa-search-plus"></span></a>',
        remove_point_btn = '<a class="btn btn-default btn-sm right" title="Remove this point" href="javascript:void(0);" onclick="$(\'#' + options.uuid + '\').popover(\'hide\'); $(\'#' + options.uuid + '\').remove();"><span class="fa fa-trash-o"></span></a>',
        measure_distance_btn = '<a class="btn btn-default btn-sm right" title="Calculate distance" href="javascript:void(0);" onclick="$.gui_measure_distances(\'point\', {lon: \'' + options.lon + '\', lat:\'' + options.lat + '\', title:\'' + options.name + '\'})"><span class="ion-fork-repo"></span></a>',
        */
        var circle = L.circle([options.lat, options.lon], 3000, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5
        }).addTo(map);
        circle.bindPopup('<h4>' + options.title + '</h4>' + ((typeof(options.content) == "function") ? options.content() : options.content)).openPopup();
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

/**
 * Cancel all markers (and clusters) in map
 */
$.reset_all_markers = function(map, markers) {
        if(map === undefined || markers === undefined) {
                $("#pgrdg_map .leaflet-marker-pane").html("");
        } else {
                map.removeLayer(markers);
        }
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

/**
 * Add cluster on the map from given geojson
 * @param {object} geojson The geojson object with markers and polygons
 */
$.add_geojson_cluster = function(options, callback) {
        options = $.extend({
                geojson: "",
                id: "",
                service: true,
                name: "",
                title: "",
                content: "",
                center: true,
        }, options);

        var markers = L.markerClusterGroup(),
        geoJsonLayer = L.geoJson(options.geojson);
        if(options.service) {
                markers.addLayer(geoJsonLayer);
                user_layers.addLayer(markers);
        } else {
                markers.addLayer(geoJsonLayer);
                user_search_layers.addLayer(markers);
        }
        if(options.center) {
                var marker_position = markers.getBounds().getCenter();
                var bbx = {};
                bbx.southwest = [markers.getBounds().getSouthWest().lat, markers.getBounds().getSouthWest().lng];
                bbx.northeast = [markers.getBounds().getNorthEast().lat, markers.getBounds().getNorthEast().lng];

                // $.set_center_bbox(marker_position.lng, marker_position.lat);
	        map.fitBounds([bbx.southwest, bbx.northeast]);

                if (typeof(callback) == "function") {
                        callback.call(this);
                }
        }

        markers.on("click", function(m) {
                //console.log(m);
                var i = 0,
                $marker_title = $("#marker_content").find(".modal-header"),
                $marker_body = $("#marker_content").find(".modal-body");

                if(options.service) {
                        $marker_body.html('<center class="text-muted"><span class="fa fa-refresh fa-spin"></span> Extracting data</center>');
                        $("#marker_content").modal("show").on("shown.bs.modal", function(){
                                if(i === 0) {
                                        var objp = {};
                                        objp.storage_group = "pgrdg_cache.results";
                                        objp[kAPI_REQUEST_OPERATION] = kAPI_OP_GET_UNIT;
                                        objp.parameters = {};
                                        objp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
                                        objp.parameters[kAPI_REQUEST_PARAMETERS] = {};
                                        objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = true;
                                        objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_ID] = m.layer.feature.properties.id;
                                        objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DATA] = kAPI_RESULT_ENUM_DATA_FORMAT;
                                        objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DOMAIN] = m.layer.feature.properties.domain;
                                        $.ask_to_service(objp, function(marker_content) {
                                                $("#marker_content .modal-title").html('<span class="fa-map-marker text-danger fa fa-lg"></span> ' + '<span class="text-primary">' + m.layer.feature.properties.id + '</span>');
                                                $.each(marker_content.results, function(domain, rows) {
                                                        //$("#marker_content").find(".modal-title").html(rows[7].name + " " + domain);
                                                        $("#marker_content").find(".modal-body").html($.parse_row_content(rows));//

                                                });
                                        });
                                        $("#marker_content a.text-info").popover({
                                                container: "body",
                                                placement: "auto",
                                                html: "true",
                                                trigger: "hover"
                                        });
                                }
                                i++;
                        });
                } else {
                        var popup = L.popup()
                            .setLatLng(L.latLng(options.lat, options.lon))
                            .setContent('<h4 class="text-info"><span class="fa-map-marker text-danger fa fa-lg"></span> ' + options.title + '</h4>' + '<p>' + options.content + '</p>')
                            .openOn(map);
                }
        });
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
        $.add_heatmap();
};


/*======================================================================================*/

$(document).ready(function() {
        // $(document).keyup(function(e) {
        //         if (e.keyCode == 27) {
        //                 $(".modal.fade:not(.in)").modal("hide").on("hidden.bs.modal", function() {
        //                         $(this).remove();
        //                 });
        //         }
        // });
        if(current_path == "Map") {
                $("header.main, section.container, #left_panel").addClass("map");
                $("#logo img").attr("src", "common/media/svg/bioversity-logo_small_white.svg");
                // if($("#breadcrumb").css("top") == "110px") {
                //         $("#breadcrumb").css("top", "75px");
                // }
                $("#pgrdg_map, .panel_content").fadeIn(600);
                $("#map_toolbox").delay(600).animate({"right": "0"}, 300);
                // $("#breadcrumb").animate({"right": "50px"}, 300);

                $("#breadcrumb .breadcrumb li.pull-right").hide();

                map = $.init_map(function() {
                        $.get_generated_layers("storage");
                });
        } else {
                $("#breadcrumb .breadcrumb li.pull-right").show();
        }
});
