// model + view

/**
 * Simple basic model + view
 */
joint.shapes.devs.ModelView = joint.dia.ElementView.extend({
  initialize: function () {
    _.bindAll(this, 'updateBox')
    joint.dia.ElementView.prototype.initialize.apply(this, arguments)

    this.$box = $(_.template(this.template)())
    this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model))

    // Remove the box when the model gets removed from the GRAPH
    this.model.on('remove', this.removeBox, this) // derived classes should define this

    // Update the box position whenever the underlying model changes.
    this.model.on('change', this.updateBox, this)
  },
  render: function () {
    joint.dia.ElementView.prototype.render.apply(this, arguments)
    this.paper.$el.prepend(this.$box)
    this.updateBox()
    return this
  },
  updateBox: function () {
    // Set the position and dimension of the box so that it covers the element
    var bbox = this.model.getBBox()
    this.$box.css({
      width: bbox.width,
      height: bbox.height,
      left: bbox.x,
      top: bbox.y,
      transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
    })
  }
})

/**
 * MV integrated with button to remove
 */
joint.shapes.devs.ModelViewWithButton = joint.shapes.devs.ModelView.extend({
  template: [
    '<div class="devs-RobustnessModel">',
    '<button class="delete">x</button>',
    '</div>'
  ].join(''),
  removeBox: function (evt) {
    DB.set('change', true) // log change
    var idToRemove = this.model.id

    // entities
    var wasEntity = DB.removeFromArray('entities', 'entityId', idToRemove) // remove from db

    // remove controllers
    try {
      var subControllers = DB.getFromArray('controls', 'id', idToRemove, [])['sub']
      if (subControllers) {
        for (var k = 0; k < subControllers.length; k++) { // remove sub-controllers from screen
          GRAPH.getCell(subControllers[k]['id']).remove()
        }
      }
    } catch (error) {
    }

    var wasController = DB.removeFromArray('controls', 'id', idToRemove) // remove from db

    // sub-controllers
    var wasSubController = false
    var controls = DB.get('controls', [])
    for (var i = 0; i < controls.length; i++) {
      var sub = controls[i]['sub']
      for (var j = 0; j < sub.length; j++) {
        if (sub[j]['id'] === idToRemove) {
          wasSubController = true
          sub.splice(j, 1) // remove
        }
      }
      controls[i]['sub'] = sub // update
    }
    DB.set('controls', controls) // update
    $('#closeEditor').click() // trigger close description

    this.$box.remove() // remove from canvas
  }
})

// model

/**
 * Element to insert image
 */
joint.shapes.devs.RobustnessModel = joint.shapes.devs.Model.extend({
  markup: '<g class="rotatable"><g class="scalable"><circle/></g><image></image><text class="label"/><type></type><g class="inPorts"/><g class="outPorts"/></g>',
  defaults: joint.util.deepSupplement({
    type: 'devs.RobustnessModel',
    position: {x: 50, y: 50},
    inPorts: [''],
    outPorts: [''],
    attrs: {
      '.label': {text: '', fontSize: 14, fontWeight: 'normal', 'ref-x': 0.7, 'ref-y': 98},
      'image': {'ref-x': -15, 'ref-y': -15, width: 140, height: 140},
      'type': {text: ''}
    },
    ports: {
      groups: {
        'in': {
          attrs: {
            magnet: 'passive'
          }
        }
      }
    }

  }, joint.shapes.devs.Model.prototype.defaults)
})

/**
 * Models to support main models
 */
joint.shapes.devs.RobustnessModelSupport = joint.shapes.devs.RobustnessModel

// view

/**
 * Basic support
 */
joint.shapes.devs.RobustnessModelSupportView = joint.shapes.devs.ModelView

/**
 * V adapted to M
 */
joint.shapes.devs.RobustnessModelView = joint.shapes.devs.ModelViewWithButton
