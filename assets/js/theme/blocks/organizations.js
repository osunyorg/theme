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
        let map = L.map(this.content, {
            scrollWheelZoom: false
        });

        this.classHidden = 'hidden';

        this.themeMarker = L.icon({
            iconUrl: this.content.getAttribute('data-marker-icon') || '/assets/images/map-marker.svg',
            iconSize: [17, 26]
        });
        this.setOrganizations(map);

        if (this.setMap) {
            this.listen(map);
            this.getMapBounds(map);
        } else {
            this.dom.classList.add(this.classHidden);
            this.dom.setAttribute('aria-hidden', 'true');
        }
    }

    setOrganizations (map) {
        this.organizationsList.forEach((organization) => {
            let latitude = parseFloat(organization.getAttribute('data-latitude')),
                longitude = parseFloat(organization.getAttribute('data-longitude')),
                mapLocation = [latitude, longitude];
            if (Boolean(latitude) && Boolean(longitude)) {
                this.newMarker(map, mapLocation, organization);
                this.setMap = true;
            }
        });
    }

    listen (map) {
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    }

    newMarker (map, mapLocation, organization) {
        let marker = new L.marker(mapLocation, {
            draggable: false,
            icon: this.themeMarker
        });
        this.classOrganization = organization.classList;
        marker.bindPopup('<article class="' + this.classOrganization + '">' + organization.innerHTML + '</article>').openPopup();
        map.addLayer(marker);
        this.markers.push(marker);
    }

    getMapBounds (map) {
        this.group = L.featureGroup(this.markers).addTo(map);
        map.fitBounds(this.group.getBounds());
    }
}

organizationsMaps.forEach((dom) => {
    new BlockOrganizations(dom);
});
