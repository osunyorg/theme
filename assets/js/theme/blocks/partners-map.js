// const partnersMap = document.querySelectorAll('.block-partners--map');

// class BlockPartners {
//     constructor (block) {
//         this.block = block;
//         this.content = this.block.querySelector('#map');
//         this.partnersList = this.content.querySelectorAll('.organization')
        
//         this.themeMarker = L.icon({
//             iconUrl: '/assets/images/map-marker.svg',
//             iconSize: [26, 17],
//         });

//         this.listen();
//     }

//     listen () {
//         console.log("lalala")
//         this.map = L.map('map').setView([2.3246629, 48.8862136], 13);

//         L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             maxZoom: 19,
//             attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//         }).addTo(map);

//         this.partnersList.forEach((partner) => {
//             let latitude = parseFloat(partner.getAttribute('data-latitude')),
//             longitude = parseFloat(partner.getAttribute('data-longitude'));
            
//             if (!!latitude && !!longitude) {
//                 setLocation = [latitude, longitude];
//                 console.log(setLocation)
//             }
//             newMarker(setLocation);
//         });
//     }
//     newMarker(setLocation) {
//         var marker = new L.marker(setLocation, {
//             draggable: false
//         });
//         map.addLayer(marker);
//     }

// }

// partnersMap.forEach((partners) => {
//     new BlockPartners(partners);
// });
