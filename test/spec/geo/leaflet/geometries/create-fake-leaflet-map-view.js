var FakeLeafletMapView = require('./fake-leaflet-map-view');
var Map = require('../../../../../src/geo/map');

module.exports = function () {
  var map = new Map(null, {
    layersFactory: {}
  });
  return new FakeLeafletMapView({
    map: map,
    layerGroupModel: {}
  });
};
