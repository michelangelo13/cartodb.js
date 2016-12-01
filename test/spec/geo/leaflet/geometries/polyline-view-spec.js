var Polyline = require('../../../../../src/geo/geometry-models/polyline');
var Map = require('../../../../../src/geo/map');
var SharedTestsForPathViews = require('./shared-tests-for-path-views');
var FakeMapView = require('./fake-map-view');
var PathView = require('./fake-path-view');

var createFakeMapView = function () {
  var map = new Map(null, {
    layersFactory: {}
  });
  return new FakeMapView({
    map: map,
    layerGroupModel: {}
  });
};

var getMarkerCoordinates = function (marker) {
  return marker.getCoordinates();
};

var isMarkerDraggable = function (marker) {
  return marker.isDraggable();
};

fdescribe('src/geo/leaflet/geometries/polyline-view.js', function () {
  SharedTestsForPathViews.call(this, Polyline, PathView);

  describe('expandable paths', function () {
    beforeEach(function () {
      this.mapView = createFakeMapView();

      this.geometry = new Polyline({
        editable: true,
        expandable: true
      }, {
        latlngs: [
          [0, 0], [10, 0], [10, 10], [0, 10]
        ]
      });

      this.geometryView = new PathView({
        model: this.geometry,
        mapView: this.mapView
      });

      this.geometryView.render();
    });

    it('should render markers for each vertex, the path, and middle points', function () {
      var paths = this.mapView.getPaths();
      var markers = this.mapView.getMarkers();
      expect(paths.length).toEqual(1);
      expect(markers.length).toEqual(7); // 4 markers + 3 middle points

      // Markers
      expect(getMarkerCoordinates(markers[0])).toEqual({ lat: 0, lng: 0 });
      expect(isMarkerDraggable(markers[0])).toBe(true);

      expect(getMarkerCoordinates(markers[1])).toEqual({ lat: 10, lng: 0 });
      expect(isMarkerDraggable(markers[1])).toBe(true);

      expect(getMarkerCoordinates(markers[2])).toEqual({ lat: 10, lng: 10 });
      expect(isMarkerDraggable(markers[2])).toBe(true);

      expect(getMarkerCoordinates(markers[3])).toEqual({ lat: 0, lng: 10 });
      expect(isMarkerDraggable(markers[3])).toBe(true);

      // Middle points
      expect(getMarkerCoordinates(markers[4])).toEqual({ lat: 5, lng: 0 });
      expect(isMarkerDraggable(markers[4])).toBe(true);

      expect(getMarkerCoordinates(markers[5])).toEqual({ lat: 10, lng: 5 });
      expect(isMarkerDraggable(markers[5])).toBe(true);

      expect(getMarkerCoordinates(markers[6])).toEqual({ lat: 5, lng: 10 });
      expect(isMarkerDraggable(markers[6])).toBe(true);

      expect(paths[0].getCoordinates()).toEqual([
        { lat: 0, lng: 0 }, { lat: 10, lng: 0 }, { lat: 10, lng: 10 }, { lat: 0, lng: 10 }
      ]);
    });

    it('should re-render middle points when map is zoomed', function () {
      spyOn(this.mapView, 'removeLayer');
      spyOn(this.mapView, 'addLayer');

      this.mapView.trigger('zoomend');

      expect(this.mapView.removeLayer.calls.count()).toEqual(3);
      expect(this.mapView.addLayer.calls.count()).toEqual(3);
    });
  });
});
