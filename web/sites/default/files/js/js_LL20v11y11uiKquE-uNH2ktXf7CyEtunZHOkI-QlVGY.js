/**
 * @file
 * JavaScript behaviors for jquery.inputmask integration.
 */

(function ($, Drupal) {

  'use strict';

  // Revert: Set currency prefix to empty by default #2066.
  // @see https://github.com/RobinHerbots/Inputmask/issues/2066
  if (window.Inputmask) {
    window.Inputmask.extendAliases({
      currency: {
        prefix: '$ ',
        groupSeparator: ',',
        alias: 'numeric',
        placeholder: '0',
        autoGroup: true,
        digits: 2,
        digitsOptional: false,
        clearMaskOnLostFocus: false
      },
      currency_negative: {
        prefix: '$ ',
        groupSeparator: ',',
        alias: 'numeric',
        placeholder: '0',
        autoGroup: true,
        digits: 2,
        digitsOptional: false,
        clearMaskOnLostFocus: false
      },
      currency_positive_negative: {
        prefix: '$ ',
        groupSeparator: ',',
        alias: 'numeric',
        placeholder: '0',
        autoGroup: true,
        digits: 2,
        digitsOptional: false,
        clearMaskOnLostFocus: false
      }
    });
  }

  /**
   * Initialize input masks.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformInputMask = {
    attach: function (context) {
      if (!$.fn.inputmask) {
        return;
      }

      $(context).find('input.js-webform-input-mask').once('webform-input-mask').inputmask();
    }
  };

})(jQuery, Drupal);
;
/**
 * @file
 * JavaScript behaviors for select menu.
 */

(function ($, Drupal) {

  'use strict';

  /**
   * Disable select menu options using JavaScript.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformSelectOptionsDisabled = {
    attach: function (context) {
      $('select[data-webform-select-options-disabled]', context).once('webform-select-options-disabled').each(function () {
        var $select = $(this);
        var disabled = $select.attr('data-webform-select-options-disabled').split(/\s*,\s*/);
        $select.find('option').filter(function isDisabled() {
          return ($.inArray(this.value, disabled) !== -1);
        }).attr('disabled', 'disabled');
      });
    }
  };

})(jQuery, Drupal);
;
/**
 * @file
 * JavaScript behaviors for other elements.
 */

(function ($, Drupal) {

  'use strict';

  /**
   * Toggle other input (text) field.
   *
   * @param {boolean} show
   *   TRUE will display the text field. FALSE with hide and clear the text field.
   * @param {object} $element
   *   The input (text) field to be toggled.
   * @param {string} effect
   *   Effect.
   */
  function toggleOther(show, $element, effect) {
    var $input = $element.find('input');
    var hideEffect = (effect === false) ? 'hide' : 'slideUp';
    var showEffect = (effect === false) ? 'show' : 'slideDown';

    if (show) {
      // Limit the other inputs width to the parent's container.
      // If the parent container is not visible it's width will be 0
      // and ignored.
      var width = $element.parent().width();
      if (width) {
        $element.width(width);
      }

      // Display the element.
      $element[showEffect]();
      // If not initializing, then focus the other element.
      if (effect !== false) {
        $input.trigger('focus');
      }
      // Require the input.
      $input.prop('required', true).attr('aria-required', 'true');
      // Restore the input's value.
      var value = $input.data('webform-value');
      if (typeof value !== 'undefined') {
        $input.val(value);
        var input = $input.get(0);
        // Move cursor to the beginning of the other text input.
        // @see https://stackoverflow.com/questions/21177489/selectionstart-selectionend-on-input-type-number-no-longer-allowed-in-chrome
        if ($.inArray(input.type, ['text', 'search', 'url', 'tel', 'password']) !== -1) {
          input.setSelectionRange(0, 0);
        }
      }
      // Refresh CodeMirror used as other element.
      $element.parent().find('.CodeMirror').each(function (index, $element) {
        $element.CodeMirror.refresh();
      });
    }
    else {
      // Hide the element.
      $element[hideEffect]();
      // Save the input's value.
      $input.data('webform-value', $input.val());
      // Empty and un-required the input.
      $input.val('').prop('required', false).removeAttr('aria-required');
    }
  }

  /**
   * Attach handlers to select other elements.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformSelectOther = {
    attach: function (context) {
      $(context).find('.js-webform-select-other').once('webform-select-other').each(function () {
        var $element = $(this);

        var $select = $element.find('select');
        var $input = $element.find('.js-webform-select-other-input');

        $select.on('change', function () {
          var isOtherSelected = $select
            .find('option[value="_other_"]')
            .is(':selected');
          toggleOther(isOtherSelected, $input);
        });

        var isOtherSelected = $select
          .find('option[value="_other_"]')
          .is(':selected');
        toggleOther(isOtherSelected, $input, false);
      });
    }
  };

  /**
   * Attach handlers to checkboxes other elements.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformCheckboxesOther = {
    attach: function (context) {
      $(context).find('.js-webform-checkboxes-other').once('webform-checkboxes-other').each(function () {
        var $element = $(this);
        var $checkbox = $element.find('input[value="_other_"]');
        var $input = $element.find('.js-webform-checkboxes-other-input');

        $checkbox.on('change', function () {
          toggleOther(this.checked, $input);
        });

        toggleOther($checkbox.is(':checked'), $input, false);
      });
    }
  };

  /**
   * Attach handlers to radios other elements.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformRadiosOther = {
    attach: function (context) {
      $(context).find('.js-webform-radios-other').once('webform-radios-other').each(function () {
        var $element = $(this);

        var $radios = $element.find('input[type="radio"]');
        var $input = $element.find('.js-webform-radios-other-input');

        $radios.on('change', function () {
          toggleOther(($radios.filter(':checked').val() === '_other_'), $input);
        });

        toggleOther(($radios.filter(':checked').val() === '_other_'), $input, false);
      });
    }
  };

  /**
   * Attach handlers to buttons other elements.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformButtonsOther = {
    attach: function (context) {
      $(context).find('.js-webform-buttons-other').once('webform-buttons-other').each(function () {
        var $element = $(this);

        var $buttons = $element.find('input[type="radio"]');
        var $input = $element.find('.js-webform-buttons-other-input');
        var $container = $(this).find('.js-webform-webform-buttons');

        // Create set onchange handler.
        $container.on('change', function () {
          toggleOther(($(this).find(':radio:checked').val() === '_other_'), $input);
        });

        toggleOther(($buttons.filter(':checked').val() === '_other_'), $input, false);
      });
    }
  };

})(jQuery, Drupal);
;
