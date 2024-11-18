const locationsMap = document.querySelector('.locations-map');
const dom = document.querySelector('main');

class LocationsMap {
    constructor (dom, locationsMap) {
        this.dom = dom;
        this.map = locationsMap;
        this.init();

        this.markers.forEach(marker => {
            this.setAccessibility(marker);
        });
    }

    init () {
        this.markers = [];
        this.setMap = false;
        this.content = this.map.querySelector('.map');
        this.locations = this.content.querySelectorAll('.location');
        this.openPopup = JSON.parse(this.content.getAttribute('data-open-popup'));
        let map = L.map(this.content, {
            scrollWheelZoom: false
        });
        this.locations.forEach((location) => {
            this.geoloc = {
                latitude: parseFloat(location.getAttribute('data-latitude')),
                longitude: parseFloat(location.getAttribute('data-longitude'))
            };
            this.classHidden = 'hidden';
    
            this.themeMarker = L.icon({
                iconUrl: this.content.getAttribute('data-marker-icon') || '/assets/images/map-marker.svg',
                iconSize: [17, 26]
            });
            
            if (Boolean(this.geoloc.latitude) && Boolean(this.geoloc.longitude)) {
                let mapLocation = [this.geoloc.latitude, this.geoloc.longitude];
                let marker = new L.marker(mapLocation, {
                    icon: this.themeMarker
                });

                marker.id = `leaflet-item-${map._leaflet_id}_${(this.markers.length + 1)}`;
                marker.title = location.querySelector('.location-title').innerText;
                location.id = marker.id;

                const popup = new L.Popup({'autoClose':false, 'closeButton':false, 'maxWidth': 1000});
                popup.setLatLng(mapLocation);
                popup.setContent(location);
                if (this.openPopup) {
                    popup.openOn(map);
                }
                marker.addTo(map).bindPopup(popup);
                this.markers.push(marker);
                this.setMap = true;
                this.listen(map);
                this.getMapBounds(map);
                this.dom.classList.add("page-with-map");
            }
        });
    }

    setAccessibility (marker) {
        let icon = marker._icon;
        if (icon) {
            icon.setAttribute('aria-label', 'Afficher les informations de ' + marker.title);
            icon.setAttribute('aria-controls', marker.id);
            icon.setAttribute('aria-expanded', 'false');
        }

        marker.addEventListener('popupopen', () => {
            icon.setAttribute('aria-expanded', 'true');
        });

        marker.addEventListener('popupclose', () => {
            icon.setAttribute('aria-expanded', 'false');
        });
    }

    listen (map) {
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    }

    getMapBounds (map) {
        this.group = L.featureGroup(this.markers).addTo(map);
        map.fitBounds(this.group.getBounds());
    }
}

if (locationsMap) {
    new LocationsMap(dom, locationsMap);
}
