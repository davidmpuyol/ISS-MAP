var map;
        var marker;
        var distanciaRecorrida = 0;
        function getDistancia(lat1,lon1,lat2,lon2) {
          var R = 6371; // Radius of the earth in km
          var dLat = degreeToRadians(lat2-lat1);
          var dLon = degreeToRadians(lon2-lon1); 
          var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(degreeToRadians(lat1)) * Math.cos(degreeToRadians(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
            ; 
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
          var d = R * c; // Distance in km
          return parseInt(d);
        }
        function degreeToRadians(deg) {
          return deg * (Math.PI/180)
        }
        function moveISS() {
            $.getJSON('https://api.wheretheiss.at/v1/satellites/25544', function(data) {
                var lat = data.latitude;
                var lon = data.longitude;
                actualizarPosicion(parseFloat(lat),parseFloat(lon));
            });
            setTimeout(moveISS, 1000);
        }
        function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
              center: {lat: 0, lng: 0},
              zoom: 8,
            });
            moveISS();
        }
        function actualizarPosicion(latitud, longitud){
            if(typeof marker == 'undefined'){
                let posicion = {lat: latitud, lng: longitud};
                var icon = {
                  url: './images/iss.ico',
                  size: new google.maps.Size(71, 71),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(25, 25),
                  scaledSize: new google.maps.Size(50, 50)
                };
                marker = new google.maps.Marker({position: posicion, icon: icon});
                marker.setMap(map);
                map.setCenter(marker.position);
            }
            else{
                let coordenadasLinea = [
                    {lat: marker.position.lat(), lng: marker.position.lng()},
                    {lat: latitud, lng: longitud}
                ];
                let latitudAnterior = marker.position.lat();
                let longitudAnterior = marker.position.lng();
                marker.setPosition(new google.maps.LatLng(latitud,longitud));
                var line = new google.maps.Polyline({
                    path: coordenadasLinea,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 3,
                    map: map
                });
                let distancia = getDistancia(latitudAnterior,longitudAnterior,marker.position.lat(),marker.position.lng());
                distanciaRecorrida += distancia;
                document.getElementById("textoDistancia").innerHTML = distanciaRecorrida+ " Km";
            }            
        }
        function error(error){
            let mensaje;
            if(error.PERMISSION_DENIED){
                mensaje = "Error: permiso denegado";
            }
            else if(error.POSITION_UNAVAILABLE){
                mensaje = "Error: Posición no encontrada";
            }
            else if(error.TIMEOUT){
                mensaje = "Tiempo de espera agotado";
            }
            alert(mensaje);
        }