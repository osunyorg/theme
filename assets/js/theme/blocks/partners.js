const partnersMaps = document.querySelectorAll('.block-partners--map');

class BlockPartners {
    constructor (dom) {
        this.dom = dom;
        
        this.init();
    }
    init() {
        this.markers = [];
        this.setMap = false;
        this.content = this.dom.querySelector('.map');
        this.partnersList = this.content.querySelectorAll('.organization');
        let map = L.map(this.content, {
            scrollWheelZoom: false
        });

        this.classPartner = 'organization';
        this.classHidden = 'hidden';

        this.themeMarker = L.icon({
            iconUrl: this.content.getAttribute('data-marker-icon') || '/assets/images/map-marker.svg',
            iconSize: [17, 26],
        });
        this.setPartners(map);

        if (this.setMap) {
            this.listen(map);
            this.getMapBounds(map);
        } else { 
            this.dom.classList.add(this.classHidden);
            this.dom.setAttribute("aria-hidden", "true")
            return;
        }
    }
    setPartners (map) {
        this.partnersList.forEach((partner) => {
            let latitude = parseFloat(partner.getAttribute('data-latitude')),
                longitude = parseFloat(partner.getAttribute('data-longitude')),
                mapLocation = [latitude, longitude];
            if (!!latitude && !!longitude) {
                this.newMarker(map, mapLocation, partner);
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

    newMarker(map, mapLocation, partner) {
        let marker = new L.marker(mapLocation, {
            draggable: false,
            icon: this.themeMarker
        });
        marker.bindPopup('<article class="' + this.classPartner + '">' + partner.innerHTML + '</article>').openPopup();
        map.addLayer(marker);
        this.markers.push(marker);
    }

    getMapBounds(map) {
        this.group = L.featureGroup(this.markers).addTo(map);
        map.fitBounds(this.group.getBounds());
    }

}

partnersMaps.forEach((dom) => {
    new BlockPartners(dom);
});