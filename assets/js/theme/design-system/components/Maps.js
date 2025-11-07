/* eslint-disable no-underscore-dangle */
/* eslint-disable new-cap */

import { parentQuerySelector } from '../../utils/a11y';

// Leaflet
var L = window.L || {};

window.osuny = window.osuny || {};

window.osuny.Map = function (element) {
    this.element = element;
    this.markers = [];
    this.popups = [];
    this.options = {
        popup: { maxWidth: 1000 }
    };
    this.init();
};

window.osuny.Map.prototype.init = function () {
    this.setMap();
    this.setMarkers();
    this.fitToMapBounds();
    this.setAccessibility();
    this.setFilters();
    window.addEventListener('resize', this.resize.bind(this));
};

window.osuny.Map.prototype.resize = function () {
    if (this.popups.length === 1) {
        this.map.closePopup(this.popups[0]);
        this.map.openPopup(this.popups[0]);
        this.fitToMapBounds();
    }
};

window.osuny.Map.prototype.setMap = function () {
    this.mapElement = this.element.querySelector('.map');
    this.map = L.map(this.element, {
        scrollWheelZoom: false
    });

    this.layers = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    this.layers.addTo(this.map);
};

window.osuny.Map.prototype.setFilters = function () {
    this.filters = this.element.parentNode.querySelectorAll('.map-filters input[type="checkbox"]');
    this.filters.forEach(function (filter) {
        filter.addEventListener('change', function () {
            this.updateFilters();
        }.bind(this));
    }.bind(this));
};

window.osuny.Map.prototype.updateFilters = function () {
    var selection = [];

    this.filters.forEach(function (filter) {
        if (filter.checked) {
            selection.push(filter.value);
        }
    });

    if (selection.length === this.filters.length) {
        this.displayAllMarkers();
    } else {
        this.filterMarkers(selection);
    }
};

window.osuny.Map.prototype.displayAllMarkers = function () {
    this.markers.forEach(function (marker) {
        this.map.addLayer(marker);
    }.bind(this));
};

window.osuny.Map.prototype.filterMarkers = function (filters) {
    var intersection = [];
    this.markers.forEach(function (marker) {
        intersection = filters.filter( function (filter) {
            return marker.options.filters.indexOf(filter) !== -1;
        });
        if (intersection.length > 0) {
            this.map.addLayer(marker);
        } else {
            marker.remove();
        }
    }.bind(this));
};

window.osuny.Map.prototype.setMarkers = function () {
    this.setMarkerIcon();
    this.elements = Array.prototype.slice.call(this.element.children);
    this.elements.forEach(this.createMarker.bind(this));

    if (this.popups.length === 1) {
        this.map.openPopup(this.popups[0]);
    }
};

window.osuny.Map.prototype.setMarkerIcon = function () {
    var url = this.element.getAttribute('data-marker-icon') || '/assets/images/map-marker.svg';
    L.Marker.prototype.options.icon = L.icon({
        iconUrl: url,
        iconSize: [17, 26]
    });
};

window.osuny.Map.prototype.createMarker = function (element, opened) {
    var latitude = parseFloat(element.getAttribute('data-latitude')),
        longitude = parseFloat(element.getAttribute('data-longitude')),
        coordinates = [latitude, longitude];
    if (Boolean(coordinates[0]) && Boolean(coordinates[1])) {
        this.addMarker(coordinates, element, opened);
    }
};

window.osuny.Map.prototype.addMarker = function (location, element) {
    var title = element.getAttribute('data-title'),
        filters = element.getAttribute('data-filters') || '[]',
        marker = new L.marker(location, {
            title: title,
            alt: '',
            filters: JSON.parse(filters)
        }),
        popup = new L.Popup(location, this.options.popup);

    marker.id = 'leaflet-item-' + this.map._leaflet_id + this.markers.length;
    element.id = marker.id;
    popup.setContent(element);

    this.map.addLayer(marker);
    marker.bindPopup(popup);

    this.popups.push(popup);
    this.markers.push(marker);
};

window.osuny.Map.prototype.setMarkerAccessibility = function (marker) {
    var icon = marker._icon;

    if (!icon) {
        return;
    }

    icon.setAttribute('aria-label', window.osuny.i18n.maps.marker_label + ' ' + marker.options.title);
    icon.setAttribute('aria-controls', marker.id);
    icon.setAttribute('aria-expanded', 'false');

    marker.addEventListener('popupopen', function () {
        icon.setAttribute('aria-expanded', 'true');
    });

    marker.addEventListener('popupclose', function () {
        icon.setAttribute('aria-expanded', 'false');
    });
};

window.osuny.Map.prototype.fitToMapBounds = function () {
    var group = L.featureGroup(this.markers).addTo(this.map);
    this.map.fitBounds(group.getBounds());
};

window.osuny.Map.prototype.setAccessibility = function () {
    var title = parentQuerySelector(this.element, '.block', '.block-title'),
        p,
        id;

    // Buttons
    if (title) {
        id = title.id;
    }

    this.setZoomAria('_zoomInButton', id, 'zoom_in');
    this.setZoomAria('_zoomOutButton', id, 'zoom_out');

    // Attributions
    p = document.createElement('p');
    p.innerHTML = this.map.attributionControl._container.innerHTML;
    p.querySelector('a[title]').setAttribute('title', window.osuny.i18n.maps.attribution_title);

    this.map.attributionControl._container.innerHTML = '';
    this.map.attributionControl._container.append(p);

    this.markers.forEach(this.setMarkerAccessibility);

    this.map.on('popupopen', this.setPopupAccessibility.bind(this))
};

window.osuny.Map.prototype.setPopupAccessibility = function (event) {
    var button = event.popup._closeButton,
        content = event.popup._content;
    button.setAttribute('aria-label', window.osuny.i18n.maps.popup_close + ' ' + content.getAttribute('data-title'));
};

window.osuny.Map.prototype.setZoomAria = function (buttonKey, id, i18nKey) {
    var button = this.map.zoomControl[buttonKey];
    button.setAttribute('aria-label', window.osuny.i18n.maps[i18nKey]);
    button.setAttribute('title', window.osuny.i18n.maps[i18nKey]);
    if (id) {
        button.setAttribute('aria-describedby', id);
    }
};

window.osuny.page.registerComponent({
    name: 'map',
    selector: '[data-map]',
    klass: window.osuny.Map
});
