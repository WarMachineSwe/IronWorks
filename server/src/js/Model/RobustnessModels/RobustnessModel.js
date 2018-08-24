/**
 * Factory method to create robustness models
 */
function RobustnessModel () {
  /**
   * Creates robustness elements
   * @param element
   * @returns {*}
   */
  this.createElement = function (element) {
    if (element === 'b') {
      return new Boundary().boundary
    } else if (element === 'a') {
      return new Actor().actor
    } else if (element === 'e') {
      return new Entity().entity
    } else if (element === 'c') {
      return new Control().control
    } else if (element === 's') {
      return new SubControl().subcontrol
    }
  }

  /**
   * Checks if link between elements is doable
   * Links NOT doable are:
   *   actor -> control  a -> c
   *   actor -> entity      a -> e
   *
   *   boundary -> boundary b -> b
   *   boundary -> entity   b -> e
   *
   *   entity -> boundary   e -> b
   *   entity -> actor      e -> a
   *   entity -> entity     e -> e
   *
   *   control -> actor  c -> a
   * @param source {string} type of source cell
   * @param target {string} type of target cell
   * @returns {boolean} true iff link between them is doable
   */
  this.validateByCellType = function (source, target) {
    // handles sub-control
    if (source === 's') {
      return false // sub controls cannot make links with nobody
    }

    if (target === 's') {
      return false
    }

    // robustness link's rules
    if (source === 'a' && (target === 'a' || target === 'c' || target === 'e')) {
      return false
    }
    if (source === 'b' && (target === 'b' || target === 'e' || target==='a')) {
      return false
    }
    if (source === 'e' && (target === 'b' || target === 'a' || target === 'e')) {
      return false
    }
    return !(source === 'c' && target === 'a')
  }

  /**
   * Checks if link between elements is doable
   * @param sourceCell {joint cell} first element
   * @param targetCell {joint cell} second element
   */
  this.robustnessValidation = function (sourceCell, targetCell) {
    var source = sourceCell.model.attr('type/text')
    var target = targetCell.model.attr('type/text')
    return this.validateByCellType(source, target)
  }
}

/**
 * Creates boundary element
 * @returns {joint.shape} Boundary element
 */
function Boundary () {
  this.boundary = new joint.shapes.devs.RobustnessModel({
    type: 'devs.RobustnessModel',
    attrs: {
      text: {text: 'Boundary'},
      image: {'xlink:href': 'img/Boundary.png'},
      type: {text: 'b'}
    },
    ports: {
      groups: {
        'in': // input link
          {
            position: {
              args: {
                dx: 32,
                dy: -39
              }
            },
            attrs: {
              '.port-body': {
                stroke: 'none',
                fill: 'transparent',
                r: 30,
                cx: 40.6,
                cy: 54

              }

            }
          }
      }
    }
  })
  this.boundary.attr('text/text', 'Boundary')
}

/**
 * Creates actor element
 * @returns {joint.shape} Actor element
 */
function Actor () {
  this.actor = new joint.shapes.devs.RobustnessModel({
    type: 'devs.RobustnessModel',
    attrs: {
      text: {text: 'Actor'},
      image: {'xlink:href': 'img/Actor.png'},
      type: {text: 'a'}
    },
    ports: {
      groups: {
        'in': // input link
          {
            position: {
              args: {
                dx: 22,
                dy: -35
              }
            },
            attrs: {
              '.port-body': {
                stroke: 'none',
                fill: 'transparent',
                r: 26,
                cx: 33.5,
                cy: 50

              }

            }
          }
      }
    }
  })
  this.actor.attr('text/text', 'Actor')
}

/**
 * Creates entity
 * @returns {joint.shape} Entity element
 */
function Entity () {
  this.entity = new joint.shapes.devs.RobustnessModel({
    // entity image and other feature
    type: 'devs.RobustnessModel',
    attrs: {
      text: {text: 'Entity'},
      image: {'xlink:href': 'img/Entity.png'},
      type: {text: 'e'}
    },
    ports: {
      groups: {
        'in': // input link
          {
            position: {
              args: {
                dx: 18.3,
                dy: -40
              }
            },
            attrs: {
              '.port-body': {
                stroke: 'none',
                fill: 'transparent',
                r: 30,
                cx: 35.8,
                cy: 54.2

              }

            }
          }
      }
    }

  })
  this.entity.attr('text/text', 'Entity')
}

/**
 * Creates control element
 * @returns {joint.shape} Control element
 */
function Control () {
  this.control = new joint.shapes.devs.RobustnessModel({
    type: 'devs.RobustnessModel',
    attrs: {
      text: {text: 'Control'},
      image: {'xlink:href': 'img/Control.png'},
      type: {text: 'c'}
    },
    ports: {
      groups: {
        'in': // input link
          {
            position: {
              args: {
                dx: 18,
                dy: -36
              }
            },
            attrs: {
              '.port-body': {
                stroke: 'none',
                fill: 'transparent',
                opacity: '0.5',
                r: 30,
                cy: 54.8,
                cx: 37

              }

            }
          }
      }
    }
  })
  this.control.attr('text/text', 'Control')
}

/**
 * Creates sub-control element
 * @returns {joint.shape} Sub-control element
 */
function SubControl () {
  this.subcontrol = new joint.shapes.devs.RobustnessModelSupport({
    type: 'devs.RobustnessModelSupport',
    attrs: {
      text: {text: 'Control'},
      image: {'xlink:href': 'img/Control.png'},
      type: {text: 's'}
    },
    ports: {
      groups: {
        'in': // input link
          {
            position: {
              args: {
                dx: 18,
                dy: -36
              }
            },
            attrs: {
              '.port-body': {
                stroke: 'none',
                fill: 'transparent',
                opacity: '0.5',
                r: 30,
                cy: 54.8,
                cx: 37
              }
            }
          }
      }
    }
  })
  this.subcontrol.attr('text/text', 'SubControl')
}
