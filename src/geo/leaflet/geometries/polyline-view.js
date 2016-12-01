var L = require('leaflet');
var PathViewBase = require('../../geometry-views/base/path-view-base');
var PointView = require('./point-view');

var PolylineView = PathViewBase.extend({
  PointViewClass: PointView,

  _createGeometry: function () {
    return L.polyline(this.model.getCoordinates(), {
      color: this.model.get('lineColor'),
      weight: this.model.get('lineWeight'),
      opacity: this.model.get('lineOpacity')
    });
  },

  _updatePathFromModel: function () {
    this._geometry.setLatLngs(this.model.getCoordinates());
  }
});

module.exports = PolylineView;
