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
        this.markers = [];
        
        let map = L.map('map').setView([44.833328, -0.56667], 13);
        this.themeMarker = L.icon({
            iconUrl: '/assets/images/map-marker.svg',
            iconSize: [17, 26],
        });
        this.listen(map);
        this.getMapBounds(map);
    }

    listen (map) {
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        this.partnersList.forEach((partner) => {
            let latitude = parseFloat(partner.getAttribute('data-latitude')),
                longitude = parseFloat(partner.getAttribute('data-longitude')),
                mapLocation = [latitude, longitude];
            if (!!latitude && !!longitude) {
                this.newMarker(map, mapLocation, partner);
            }
        });
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
        console.log(L.featureGroup(this.markers))
        this.group = L.featureGroup(this.markers).addTo(map);
        map.fitBounds(this.group.getBounds());
    }

}

partnersMaps.forEach((dom) => {
    new BlockPartners(dom);
});