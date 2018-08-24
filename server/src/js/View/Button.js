/**
 * Facade for HTML 2-state button
 * @param htmlButton {HTML button got with $) button
 */
function TwoStateButton (htmlButton) {
  this.button = htmlButton

  /**
   * Checks if 2-state button is active
   */
  this.isActive = function () {
    return this.button.hasClass('active')
  }

  /**
   * Makes 2-state button is active
   */
  this.active = function () {
    if (!this.isActive()) {
      this.button.addClass('active')
    }
  }

  /**
   * Makes 2-state button is inactive
   */
  this.inactive = function () {
    if (this.isActive()) {
      this.button.removeClass('active')
    }
  }

  /**
   * Toggle 2-state button state
   */
  this.toggle = function () {
    if (this.isActive()) {
      this.inactive()
    } else {
      this.active()
    }
  }

  /**
   * Sets active iff boolean is true
   * @param boolean condition to set
   */
  this.setState = function (boolean) {
    if (boolean) {
      this.active()
    } else {
      this.inactive()
    }
  }
}
