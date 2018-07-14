function RobustnessModel() {

    this.createElement = function(element){
        if(element === 'b')
            return new Boundary().boundary
        else if(element === 'a')
            return new Actor().actor
        else if(element === 'e')
            return new Entity().entity
        else if(element === 'c')
            return new Controller().controller
        else
            return null
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
                'in': // link in ingresso
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
    db.set('change', true)
    var name = document.getElementById('textField1')
    if (name.value === '') {
        this.boundary.attr('text/text', 'Boundary')
    } else {
        this.boundary.attr('text/text', name.value)
    }

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
                'in': // link in ingresso
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
    db.set('change', true)
    var name = document.getElementById('textField')
    if (name.value === '') {
        this.actor.attr('text/text', 'Actor')
    } else {
        this.actor.attr('text/text', name.value)
    }

}

/**
 * Creates entity
 * @returns {joint.shape} Entity element
 */
function Entity () {
    this.entity = new joint.shapes.devs.RobustnessModel({
        // immagine della entity e proprietà
        type: 'devs.RobustnessModel',
        attrs: {
            text: {text: 'Entity'},
            image: {'xlink:href': 'img/Entity.png'},
            type: {text: 'e'}
        },
        ports: {
            groups: {
                'in': // link in ingresso
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
    db.set('change', true)
    var name = document.getElementById('textField2')
    if (name.value === '') {
        this.entity.attr('text/text', 'Entity')
    } else {
        this.entity.attr('text/text', name.value)
    }


}

/**
 * Creates controller element
 * @returns {joint.shape} Controller element
 */
function Controller () {
    this.controller = new joint.shapes.devs.RobustnessModel({
        type: 'devs.RobustnessModel',
        attrs: {
            text: {text: 'Controller'},
            image: {'xlink:href': 'img/Control.png'},
            type: {text: 'c'}
        },
        ports: {
            groups: {
                'in': // link in ingresso
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
    db.set('change', true)
    var name = document.getElementById('textField3')
    if (name.value === '') {
        this.controller.attr('text/text', 'Controller')
    } else {
        this.controller.attr('text/text', name.value)
    }

}

