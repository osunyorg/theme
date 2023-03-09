const partnersMaps = document.querySelectorAll('.block-partners--map');

class BlockPartners {
    constructor (dom) {
        this.dom = dom;
        this.init();
    }
    init() {
        this.content = this.dom.querySelector('#map');
        this.partnersList = this.content.querySelectorAll('.organization')

        this.classPartner = 'organization';
        
        let map = L.map('map').setView([44.833328, -0.56667], 13);
        this.themeMarker = L.icon({
            iconUrl: '/assets/images/map-marker.svg',
            iconSize: [17, 26],
        });

        this.listen(map);
    }

    listen (map) {
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        this.partnersList.forEach((partner) => {
            this.setLocation(map, partner);
        });
    }

    setLocation(map, partner) {
        let latitude = parseFloat(partner.getAttribute('data-latitude')),
            longitude = parseFloat(partner.getAttribute('data-longitude'));
        
        if (!!latitude && !!longitude) {
            this.mapLocation = [latitude, longitude];
        }
        this.newMarker(this.mapLocation, map, partner);
    }

    newMarker(mapLocation, map, partner) {
        let marker = new L.marker(mapLocation, {
            draggable: false,
            icon: this.themeMarker
        });
        marker.bindPopup('<article class="' + this.classPartner + '">' + partner.innerHTML + '</article>').openPopup();
        map.addLayer(marker);
    }

}

partnersMaps.forEach((dom) => {
    new BlockPartners(dom);
});