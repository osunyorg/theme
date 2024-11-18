/* global L */
const organizationsMaps = document.querySelectorAll('.block-organizations--map');
class BlockOrganizations {
    constructor (dom) {
        this.dom = dom;
        this.init();
    }

    init () {
        this.markers = [];
        this.setMap = false;
        this.content = this.dom.querySelector('.map');
        this.organizationsList = this.content.querySelectorAll('.organization');
        this.map = L.map(this.content, {
            scrollWheelZoom: false
        });

        this.classHidden = 'hidden';
        this.themeMarker = L.icon({
            iconUrl: this.content.getAttribute('data-marker-icon') || '/assets/images/map-marker.svg',
            iconSize: [17, 26]
        });
        this.setOrganizations();

        if (this.setMap) {
            this.listen();
            this.getMapBounds();
        } else {
            this.dom.classList.add(this.classHidden);
            this.dom.setAttribute('aria-hidden', 'true');
        }

        this.markers.forEach(marker => {
            this.setAccessibility(marker);
        });
    }

    setOrganizations () {
        this.organizationsList.forEach((organization) => {
            let latitude = parseFloat(organization.getAttribute('data-latitude')),
                longitude = parseFloat(organization.getAttribute('data-longitude')),
                mapLocation = [latitude, longitude];
            if (Boolean(latitude) && Boolean(longitude)) {
                this.newMarker(mapLocation, organization);
                this.setMap = true;
            }
        });
    }

    listen () {
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);
    }

    newMarker (mapLocation, organization) {
        let marker = new L.marker(mapLocation, {
            draggable: false,
            icon: this.themeMarker
        });
        this.classOrganization = organization.classList;
        marker.id = `leaflet-item-${this.map._leaflet_id}_${(this.markers.length + 1)}`;
        marker.title = organization.querySelector('.organization-title').innerText;
        marker.bindPopup('<article id="'+ marker.id +'" class="' + this.classOrganization + '">' + organization.innerHTML + '</article>').openPopup();
        this.map.addLayer(marker);
        this.markers.push(marker);
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

    getMapBounds () {
        this.group = L.featureGroup(this.markers).addTo(this.map);
        this.map.fitBounds(this.group.getBounds());
    }
}

organizationsMaps.forEach((dom) => {
    new BlockOrganizations(dom);
});
