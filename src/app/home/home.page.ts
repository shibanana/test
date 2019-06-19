import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
declare var google;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public markers=[];
  public start: any;
  public end: any;
  public lat : number;
  public lng : number;
  public map;
  
  constructor(public geolocation: Geolocation) {
    this.geolocation.getCurrentPosition().then((resp) => {
      //  this.lat=resp.coords.latitude;
      //  this.lng=resp.coords.longitude;
      ;
     }).catch((error) => {
       console.log('Error getting location', error);
     });
     function AutocompleteDirectionsHandler(map) {
      map=this.map;
      this.originPlaceId = null;
      this.destinationPlaceId = null;
      this.travelMode = 'WALKING';
      this.directionsService = new google.maps.DirectionsService;
      this.directionsDisplay = new google.maps.DirectionsRenderer;
      this.directionsDisplay.setMap(map);
    
      var originInput = document.getElementById('origin-input');
      var destinationInput = document.getElementById('destination-input');
      var modeSelector = document.getElementById('mode-selector');
    
      var originAutocomplete = new google.maps.places.Autocomplete(originInput);
      // Specify just the place data fields that you need.
      originAutocomplete.setFields(['place_id']);
    
      var destinationAutocomplete =
          new google.maps.places.Autocomplete(destinationInput);
      // Specify just the place data fields that you need.
      destinationAutocomplete.setFields(['place_id']);
    
      this.setupClickListener('changemode-walking', 'WALKING');
      this.setupClickListener('changemode-transit', 'TRANSIT');
      this.setupClickListener('changemode-driving', 'DRIVING');
    
      this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
      this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
    
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(
          destinationInput);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
    }
    
    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    AutocompleteDirectionsHandler.prototype.setupClickListener = function(
        id, mode) {
      var radioButton = document.getElementById(id);
      var me = this;
    
      radioButton.addEventListener('click', function() {
        me.travelMode = mode;
        me.route();
      });
    };
    
    AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(
        autocomplete, mode) {
        
      var me = AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener;
      console.log(me)
      autocomplete.bindTo('bounds', this.map);
    
      autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
    
        if (!place.place_id) {
          window.alert('Please select an option from the dropdown list.');
          return;
        }
        if (mode === 'ORIG') {
          me.originPlaceId = place.place_id;
        } else {
          me.destinationPlaceId = place.place_id;
        }
        me.route();
      });
    };
    
    AutocompleteDirectionsHandler.prototype.route = function() {
      if (!this.originPlaceId || !this.destinationPlaceId) {
        return;
      }
      var me = this;
    
      this.directionsService.route(
          {
            origin: {'placeId': this.originPlaceId},
            destination: {'placeId': this.destinationPlaceId},
            travelMode: this.travelMode
          },
          function(response, status) {
            if (status === 'OK') {
              me.directionsDisplay.setDirections(response);
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });
    };
  }

  ngOnInit(){
    this.loadMap()
    
  }
  
  
  

  createMap(){
   
    
      this.map = new google.maps.Map(document.getElementById('map'),{
        mapTypeControl: false,
        center: {lat:this.lat, lng: this.lng},
        zoom: 13
      });
      this.loadMap()
    
}

loadMap(){
  let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.lat=data.coords.latitude;
      this.lng=data.coords.longitude;
      this.deleteMarkers()
      var markers=new google.maps.Marker({
        position:{
          lat:data.coords.latitude,
          lng:data.coords.longitude,
        },
        map:this.map
      })
      this.markers.push(markers) 
    });  
}

 setMapOnAll(map) {
  for (var i = 0; i < this.markers.length; i++) {
    this.markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
//  clearMarkers() {
//   this.setMapOnAll();
// }

// Shows any markers currently in the array.
 showMarkers() {
  this.setMapOnAll(null);
}

// Deletes all markers in the array by removing references to them.
 deleteMarkers() {
  this.setMapOnAll(null);
  this.markers = [];
}
}
