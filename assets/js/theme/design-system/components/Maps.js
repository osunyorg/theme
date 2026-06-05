/* eslint-disable no-underscore-dangle */
/* eslint-disable new-cap */

import { parentQuerySelector } from '../../utils/a11y';

// Leaflet
var L = window.L || {};

window.osuny = window.osuny || {};

window.osuny.Map = function (element) {
    this.element = element;
    this.markers = [];
    this.options = {
        popup: { maxWidth: 1000 }
    };
    this.init();
};

window.osuny.Map.prototype.init = function () {
    this.setMap();
    this.setMarkerIcon();

    var src = this.element.getAttribute('data-map-src');
    if (src) {
        this.loadFromJson(src);
    } else {
        this.loadFromDom();
    }

    window.addEventListener('resize', this.resize.bind(this));
};

window.osuny.Map.prototype.loadFromJson = function (src) {
    var self = this;
    fetch(src)
        .then(function (response) { return response.json(); })
        .then(function (data) {
            (data.organizations || []).forEach(self.createMarkerFromData.bind(self));
            self.finalize();
        });
};

window.osuny.Map.prototype.loadFromDom = function () {
    var elements = this.element.querySelectorAll('[data-longitude]');
    elements.forEach(this.createMarkerFromElement.bind(this));
    this.finalize();
};

window.osuny.Map.prototype.finalize = function () {
    if (this.markers.length === 1) {
        this.markers[0].openPopup();
    }
    this.fitToMapBounds();
    this.setAccessibility();
    this.setFilters();
};

window.osuny.Map.prototype.resize = function () {
    if (this.markers.length === 1) {
        this.markers[0].closePopup();
        this.markers[0].openPopup();
        this.fitToMapBounds();
    }
};

window.osuny.Map.prototype.setMap = function () {
    this.mapElement = this.element.querySelector('.map');
    this.map = L.map(this.element, {
        scrollWheelZoom: false
    });

    this.layers = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        referrerPolicy: "origin"
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

window.osuny.Map.prototype.setMarkerIcon = function () {
    var url = this.element.getAttribute('data-marker-icon') || '/assets/images/map-marker.svg';
    L.Marker.prototype.options.icon = L.icon({
        iconUrl: url,
        iconSize: [17, 26]
    });
};

window.osuny.Map.prototype.createMarkerFromElement = function (element) {
    var latitude = parseFloat(element.getAttribute('data-latitude')),
        longitude = parseFloat(element.getAttribute('data-longitude'));
    if (!latitude || !longitude) {
        return;
    }
    this.addMarker([latitude, longitude], {
        title: element.getAttribute('data-title'),
        filters: JSON.parse(element.getAttribute('data-filters') || '[]'),
        popupContent: element
    });
};

window.osuny.Map.prototype.createMarkerFromData = function (org) {
    var lat = parseFloat(org.lat),
        lng = parseFloat(org.lng);
    if (!lat || !lng) {
        return;
    }
    this.addMarker([lat, lng], {
        title: org.title,
        filters: org.categories || [],
        popupContent: this.buildPopupHTML(org)
    });
};

window.osuny.Map.prototype.escape = function (value) {
    return String(value).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
};

window.osuny.Map.prototype.buildPopupHTML = function (org) {
    var title = this.escape(org.title);
    var html = '<article class="organization" itemscope itemtype="https://schema.org/Organization">'
        + '<div class="organization-content">'
        + '<h2 class="organization-title" itemprop="name">'
        + '<a href="' + this.escape(org.url) + '">' + title + '</a>'
        + '</h2>'
        + '</div>';
    if (org.logo) {
        html += '<div class="media media--logo">'
            + '<figure class="organization-logo organization-logo--default" role="figure" aria-label="' + title + '">'
            + '<img src="' + this.escape(org.logo) + '" alt="' + title + '" loading="lazy">'
            + '</figure>'
            + '</div>';
    }
    html += '</article>';
    return html;
};

window.osuny.Map.prototype.addMarker = function (location, options) {
    var marker = new L.marker(location, {
        title: options.title,
        alt: '',
        filters: options.filters
    });

    marker.id = 'leaflet-item-' + this.map._leaflet_id + this.markers.length;
    marker.bindPopup(options.popupContent, this.options.popup);

    this.map.addLayer(marker);
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
    if (!this.markers.length) {
        return;
    }
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

    this.map.on('popupopen', this.setPopupAccessibility.bind(this));
};

window.osuny.Map.prototype.setPopupAccessibility = function (event) {
    var button = event.popup._closeButton,
        markerTitle = (event.popup._source && event.popup._source.options.title) || '';
    button.setAttribute('aria-label', window.osuny.i18n.maps.popup_close + ' ' + markerTitle);

    // Update aria-controls on the icon to point at the popup container now that it exists.
    var marker = event.popup._source,
        icon = marker && marker._icon,
        container = event.popup._container;
    if (icon && container) {
        if (!container.id) {
            container.id = marker.id;
        }
        icon.setAttribute('aria-controls', container.id);
    }
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
