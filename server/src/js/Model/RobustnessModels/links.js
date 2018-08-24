// links

/**
 * links extension
 */
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
      body: { // label text
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
  labels: [{attrs: {text: {text: 'label name'}}}],
  type: {text: 'link'},
  customLinkInteractions: true
})

/**
 * links tools extension
 */
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
      var link = new Link(this)
      link.toggleArrow()
    }
  }
})
