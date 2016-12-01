var _ = require('underscore');

var Map = require('../../../../../src/geo/map');

var FakeMapView = require('./fake-map-view');
var PointView = require('./fake-point-view');

var createFakeMapView = function () {
  var map = new Map(null, {
    layersFactory: {}
  });
  return new FakeMapView({
    map: map,
    layerGroupModel: {}
  });
};

var Point = require('../../../../../src/geo/geometry-models/point.js');

var getMarkerCoordinates = function (marker) {
  return marker.getCoordinates();
};

var isMarkerDraggable = function (marker) {
  return marker.isDraggable();
};

var fireMarkerEvent = function (marker, event) {
  marker.trigger(event);
};

fdescribe('src/geo/leaflet/geometries/point-view.js', function () {
  beforeEach(function () {
    spyOn(_, 'debounce').and.callFake(function (func) { return function () { func.apply(this, arguments); }; });

    this.point = new Point({
      latlng: [
        -40,
        40
      ]
    });
    this.mapView = createFakeMapView();

    this.pointView = new PointView({
      model: this.point,
      mapView: this.mapView
    });

    this.pointView.render();
  });

  it('should add a marker to the map', function () {
    var markers = this.mapView.getMarkers();
    expect(markers.length).toEqual(1);
    expect(getMarkerCoordinates(markers[0])).toEqual({
      lat: -40,
      lng: 40
    });
    expect(isMarkerDraggable(markers[0])).toBe(false);
  });

  it('should add a marker to the map when the model gets a lat and lng', function () {
    this.point = new Point();
    this.mapView = createFakeMapView();

    this.pointView = new PointView({
      model: this.point,
      mapView: this.mapView
    });

    this.pointView.render();

    var markers = this.mapView.getMarkers();
    expect(markers.length).toEqual(0);

    this.point.set('latlng', [ -45, 45 ]);

    markers = this.mapView.getMarkers();
    expect(markers.length).toEqual(1);
  });

  describe('when the model is updated', function () {
    it("should update the marker's latlng", function () {
      var markers = this.mapView.getMarkers();
      expect(markers.length).toEqual(1);
      expect(getMarkerCoordinates(markers[0])).toEqual({
        lat: -40,
        lng: 40
      });

      this.point.set('latlng', [ -45, 45 ]);

      markers = this.mapView.getMarkers();
      expect(markers.length).toEqual(1);
      expect(getMarkerCoordinates(markers[0])).toEqual({
        lat: -45,
        lng: 45
      });
    });
  });

  describe('when the model is removed', function () {
    it('should remove the marker if model is removed', function () {
      expect(this.mapView.getMarkers().length).toEqual(1);

      this.point.remove();

      expect(this.mapView.getMarkers().length).toEqual(0);
    });

    it('should remove the view', function () {
      spyOn(this.pointView, 'remove');

      this.point.remove();

      expect(this.pointView.remove).toHaveBeenCalled();
    });
  });

  describe('editable points', function () {
    beforeEach(function () {
      this.point = new Point({
        latlng: [
          -40,
          40
        ],
        editable: true
      });

      this.mapView = createFakeMapView();

      this.pointView = new PointView({
        model: this.point,
        mapView: this.mapView
      });

      this.pointView.render();
      this.marker = this.mapView.getMarkers()[0];
    });

    it('should add an editable marker to the map', function () {
      expect(isMarkerDraggable(this.marker)).toBe(true);
    });

    it("should update model's latlng when the marker is dragged & dropped", function () {
      spyOn(this.marker, 'getCoordinates').and.returnValue({
        lat: -90,
        lng: 90
      });

      fireMarkerEvent(this.marker, 'dragstart');
      fireMarkerEvent(this.marker, 'drag');
      fireMarkerEvent(this.marker, 'dragend');

      expect(this.point.getCoordinates()).toEqual([ -90, 90 ]);
    });

    it("shouldn't update the marker's latlng while dragging", function () {
      fireMarkerEvent(this.marker, 'dragstart');

      this.point.set('latlng', [
        -50,
        50
      ]);

      expect(this.marker.getCoordinates().lat).toEqual(-40);
      expect(this.marker.getCoordinates().lng).toEqual(40);

      fireMarkerEvent(this.marker, 'drag');
      fireMarkerEvent(this.marker, 'dragend');

      this.point.set('latlng', [
        -50,
        50
      ]);

      expect(this.marker.getCoordinates().lat).toEqual(-50);
      expect(this.marker.getCoordinates().lng).toEqual(50);
    });

    it('should bind marker events', function () {
      var callback = jasmine.createSpy('callback');
      var marker = this.mapView.getMarkers()[0];

      this.pointView.on('mousedown', callback);
      fireMarkerEvent(marker, 'mousedown');

      expect(callback).toHaveBeenCalled();
    });

    it('should unbind marker events when the view is cleaned', function () {
      var callback = jasmine.createSpy('callback');
      var marker = this.mapView.getMarkers()[0];

      this.pointView.on('mousedown', callback);
      this.pointView.clean();

      fireMarkerEvent(marker, 'mousedown');

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('.clean', function () {
    it('should remove the marker from the map', function () {
      var markers = this.mapView.getMarkers();
      expect(markers.length).toEqual(1);

      this.pointView.clean();

      markers = this.mapView.getMarkers();
      expect(markers.length).toEqual(0);
    });
  });
});
