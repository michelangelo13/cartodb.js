var _ = require('underscore');
var GeometryViewBase = require('./geometry-view-base');

var DRAG_DEBOUNCE_TIME_IN_MILIS = 0;

var PointViewBase = GeometryViewBase.extend({
  initialize: function (options) {
    GeometryViewBase.prototype.initialize.apply(this, arguments);
    this.model.on('change:latlng', this._onLatlngChanged, this);
    this.model.on('change:iconUrl change:iconAnchor', this._updateMarkersIcon, this);

    this._marker = null;
    if (options.nativeMarker) {
      this._marker = options.nativeMarker;
      this._updateMarkersIcon();
    }

    // This method is debounced and we need to initialize it here so that:
    //  1. Binding/unbinding can use the debounced function as the callback.
    //  2. Debouncing can be easily disabled in the tests
    this._onDrag = _.debounce(this._updateModelFromMarker.bind(this), DRAG_DEBOUNCE_TIME_IN_MILIS);

    _.bindAll(this, '_onDragStart', '_onDrag', '_onDragEnd', '_onMouseDown', '_onMouseClick');
  },

  getNativeMarker: function () {
    return this._marker;
  },

  unsetMarker: function () {
    this._unbindMarkerEvents();
    delete this._marker;
  },

  _onLatlngChanged: function () {
    this._renderMarkerIfNotRendered();

    if (!this.isDragging()) {
      this._updateMarkerFromModel();
    }
  },

  render: function () {
    if (this.model.get('latlng')) {
      this._renderMarkerIfNotRendered();
    }
  },

  _renderMarkerIfNotRendered: function () {
    var isEditable = this.model.isEditable();
    if (this._isMarkerRendered()) {
      this._unbindMarkerEvents();
    } else {
      this._marker = this._createMarker();
      this.mapView.addLayer(this._marker);
    }

    if (isEditable) {
      this._bindMarkerEvents();
    }
  },

  _isMarkerRendered: function () {
    return this._marker && this.mapView.hasLayer(this._marker);
  },

  _removeMarker: function () {
    if (this._marker) {
      // this._unbindMarkerEvents();
      this.mapView.removeLayer(this._marker);
    }
  },

  _onDragStart: function () {
    this._isDragging = true;
  },

  _onDragEnd: function () {
    this._isDragging = false;
  },

  _onMouseDown: function () {
    this._mouseDownClicked = true;
    this.trigger('mousedown', this.model);
  },

  _onMouseClick: function () {
    // Some point views reuse existing markers.
    // We want to only trigger the 'click' event if marker
    // was clicked while being associated to this view.
    if (this._mouseDownClicked) {
      this.trigger('click', this.model);
      this._mouseDownClicked = false;
    }
  },

  isDragging: function () {
    return !!this._isDragging;
  },

  clean: function () {
    GeometryViewBase.prototype.clean.apply(this);
    this._removeMarker();
  },

  _updateModelFromMarker: function () {
    throw new Error('subclasses of PointViewBase must implement _updateModelFromMarker');
  },

  _updateMarkerFromModel: function () {
    throw new Error('subclasses of PointViewBase must implement _updateMarkerFromModel');
  },

  _updateMarkersIcon: function () {
    throw new Error('subclasses of PointViewBase must implement _updateMarkersIcon');
  },

  _createMarkerIcon: function () {
    throw new Error('subclasses of PointViewBase must implement _createMarkerIcon');
  },

  _createMarker: function () {
    throw new Error('subclasses of PointViewBase must implement _createMarker');
  },

  _unbindMarkerEvents: function () {
    throw new Error('subclasses of PointViewBase must implement _unbindMarkerEvents');
  },

  _bindMarkerEvents: function () {
    throw new Error('subclasses of PointViewBase must implement _bindMarkerEvents');
  }
});

module.exports = PointViewBase;
