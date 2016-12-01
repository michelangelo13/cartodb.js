var MultiPolygonView = require('../../../../../src/geo/leaflet/geometries/multi-polygon-view');
var MultiPolygon = require('../../../../../src/geo/geometry-models/multi-polygon');
var SharedTestsForMultiGeometryViews = require('./shared-tests-for-multi-geometry-views');
var createFakeLeafletMapView = require('./create-fake-leaflet-map-view');

describe('src/geo/leaflet/geometries/multi-polygon-view.js', function () {
  beforeEach(function () {
    this.geometry = new MultiPolygon(null, {
      latlngs: [
        [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4]
        ],
        [
          [0, 10],
          [10, 20],
          [20, 30],
          [30, 40]
        ]
      ]
    });
    this.mapView = createFakeLeafletMapView();

    this.geometryView = new MultiPolygonView({
      model: this.geometry,
      mapView: this.mapView
    });
  });

  SharedTestsForMultiGeometryViews.call(this);

  it('should render the geometries', function () {
    expect(this.mapView.getPaths().length).toEqual(2); // 2 geometries
    expect(this.mapView.getMarkers().length).toEqual(8); // 4 markers for each geometry
  });
});
