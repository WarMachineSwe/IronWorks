/**
 * Creates event clickers to create actor, entity, boundary and control
 */
function ElementClick () {

    $('#actor').on('click', function () {
       new ElementHandler().createActor()
    })

    $('#entity').on('click', function () {
        new ElementHandler().createEntity()
    })

    $('#boundary').on('click', function () {
        new ElementHandler().createBoundary()
    })

    $('#control').on('click', function () {
        new ElementHandler().createController()
    })
}

ElementClick();