var L = require('leaflet');
var PointViewBase = require('../../geometry-views/base/point-view-base.js');

var PointView = PointViewBase.extend({
  _updateModelFromMarker: function () {
    if (this._marker) {
      var latLng = this._marker.getLatLng();
      this.model.setCoordinates([ latLng.lat, latLng.lng ]);
    }
  },

  _updateMarkerFromModel: function () {
    this._marker.setLatLng(this.model.getCoordinates());
  },

  _updateMarkersIcon: function () {
    if (this._marker) {
      var newIcon = this._createMarkerIcon();
      this._marker.setIcon(newIcon);
    }
  },

  _createMarkerIcon: function () {
    // return L.divIcon({ html: '<p>' + this.cid + '</p>' });
    return L.icon({
      iconUrl: this.model.get('iconUrl'),
      iconAnchor: this.model.get('iconAnchor')
    });
  },

  _createMarker: function () {
    var isEditable = this.model.isEditable();
    var markerOptions = {
      icon: this._createMarkerIcon()
    };

    markerOptions.draggable = !!isEditable;

    return L.marker(this.model.get('latlng'), markerOptions);
  },

  _unbindMarkerEvents: function () {
    this._marker.off('dragstart', this._onDragStart);
    this._marker.off('drag', this._onDrag);
    this._marker.off('dragend', this._onDragEnd);
    this._marker.off('mousedown', this._onMouseDown);
    this._marker.off('click', this._onMouseClick);
  },

  _bindMarkerEvents: function () {
    this._marker.on('dragstart', this._onDragStart);
    this._marker.on('drag', this._onDrag);
    this._marker.on('dragend', this._onDragEnd);
    this._marker.on('mousedown', this._onMouseDown);
    this._marker.on('click', this._onMouseClick);
  }
});

module.exports = PointView;
