// element to insert image
joint.shapes.devs.RobustnessModel = joint.shapes.devs.Model.extend({
  markup: '<g class="rotatable"><g class="scalable"><circle/></g><image> </image><text class="label"/><type> </type><g class="inPorts"/><g class="outPorts"/></g>',
  defaults: joint.util.deepSupplement({
    type: 'devs.RobustnessModel',
    position: {x: 50, y: 50},
    inPorts: [''],
    outPorts: [''],
    attrs: {
      /* 'circle': { r:60,cx:100,stroke: 'none', fill: 'purple'}, */ // EDIT: inutilizato, elemento superfluo. Possibile hack per parte cliccabile
      '.label': {text: '', fontSize: 14, fontWeight: 'normal', 'ref-x': 0.7, 'ref-y': 98},
      'image': {'ref-x': -15, 'ref-y': -15, /* ref: 'circle', */width: 140, height: 140},
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

// MV integrated with button to remove
joint.shapes.devs.ModelView = joint.dia.ElementView.extend({
  template: [
    '<div class="devs-RobustnessModel">',
    '<button class="delete">x</button>',
    '</div>',
    '<div class="popup">',
    '<span class="popupText" id="myPopup">',
    '</div>'
  ].join(''),
  initialize: function () {
    _.bindAll(this, 'updateBox')
    joint.dia.ElementView.prototype.initialize.apply(this, arguments)

    this.$box = $(_.template(this.template)())

    this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model))
    //this.$box.find('.delete').on('click', function () {}) TODO
    // Update the box position whenever the underlying model changes.
    this.model.on('change', this.updateBox, this)
    // Remove the box when the model gets removed from the graph.
    this.model.on('remove', this.removeBox, this)

    this.updateBox()
  },
  render: function () {
    joint.dia.ElementView.prototype.render.apply(this, arguments)
    this.paper.$el.prepend(this.$box)
    this.updateBox()
    return this
  },
  updateBox: function () {
    // Set the position and dimension of the box so that it covers the JointJS element.
    var bbox = this.model.getBBox()
    this.$box.css({
      width: bbox.width,
      height: bbox.height,
      left: bbox.x,
      top: bbox.y,
      transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
    })
  },
  removeBox: function (evt) {
    this.$box.remove()  
  }
})

// V adapted to M
joint.shapes.devs.RobustnessModelView = joint.shapes.devs.ModelView

// links extention
joint.shapes.devs.LinkWithCaption = joint.dia.Link.define('devs.LinkWithCaption', {
  markup: [{
    tagName: 'path',
    selector: 'wrapper',
    attributes: {
      'fill': 'none',
      'cursor': 'default',
      'stroke': 'transparent'
    }
  }, {
    tagName: 'path',
    selector: 'line',
    attributes: {
      'fill': 'none',
      'pointer-events': 'none'
    }
  }],
  attrs: {
    line: {
      connection: true,
      strokeWidth: 2,
      stroke: '#34495E',
      targetMarker: {
        'type': 'path',
        'd': 'M 10 -5 0 0 10 5 z',
        'fill': '#3a3939',
        'stroke': '#ffffff'
      }
    },
    wrapper: {
      connection: true,
      strokeWidth: 10,
      strokeLinejoin: 'round'
    }
  },
  defaultLabel: {
    markup: [
      {
        tagName: 'rect',
        selector: 'body'
      },
      {
        tagName: 'text',
        selector: 'label'
      }
    ],
    attrs: {
      // testo etichetta
      body: {
        ref: 'label',
        fill: 'white',
        stroke: 'black',
        strokeWidth: 1,
        refWidth: '120%',
        refHeight: '120%',
        refX: '-10%',
        refY: '-10%',
        cursor: 'pointer'
      },
      label: {
        fill: '#000000', // colore testo etichetta
        fontSize: 14,
        textAnchor: 'middle',
        yAlignment: 'middle',
        pointerEvents: 'none',
        cursor: 'pointer'
      }
    },
    position: {
      distance: 0.5
    }
  },
  labels: [{attrs: {text: {text: 'yourText'}}}],
  type: {text: 'link'},
  customLinkInteractions: true
})

var arrow = true

// links tools extension
joint.linkTools.InfoButton = joint.linkTools.Button.extend({
  name: 'info-button',
  options: {
    markup: [{
      tagName: 'circle',
      selector: 'button',
      attributes: {
        'r': 7,
        'fill': '#001DFF',
        'cursor': 'pointer'
      }
    }, {
      tagName: 'path',
      selector: 'icon',
      attributes: {
        'd': 'M -2 4 2 4 M 0 3 0 0 M -2 -1 1 -1 M -1 -4 1 -4',
        'fill': 'none',
        'stroke': '#FFFFFF',
        'stroke-width': 2,
        'pointer-events': 'none'
      }
    }],
    distance: '100',
    offset: 0,
    action: function (evt) {
      if (arrow) {
        this.model.attr({
          line: {
            targetMarker: {
              'd': ''
            }
          }
        })
        arrow = false
      } else {
        this.model.attr({
          line: {
            targetMarker: {
              'd': 'M 10 -5 0 0 10 5 z'
            }
          }
        })
        arrow = true
      }
    }
  }
})
