const campusMap = document.querySelector('.campus-map');

class CampusMap {
    constructor (dom) {
        this.dom = dom;
        this.init();
    }

    init () {
        this.markers = [];
        this.setMap = false;
        this.content = this.dom.querySelector('.map');
        this.campus = this.content.querySelector('.campus');
        let map = L.map(this.content, {
            scrollWheelZoom: false
        });
        this.geoloc = {
            latitude: parseFloat(this.campus.getAttribute('data-latitude')),
            longitude: parseFloat(this.campus.getAttribute('data-longitude'))
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

            var popup1 = new L.Popup({'autoClose':false, 'closeButton':false});
            popup1.setLatLng(mapLocation);
            popup1.setContent(this.campus);
            popup1.openOn(map);
            marker.addTo(map).bindPopup(popup1);
            this.markers.push(marker);
            this.setMap = true;
        }

        if (this.setMap) {
            this.listen(map);
            this.getMapBounds(map);
        } 
        else {
            this.campus.classList.add(this.classHidden);
            this.dom.setAttribute('aria-hidden', 'true');
        }
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

if(campusMap){
    new CampusMap(campusMap);
}