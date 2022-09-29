jQuery(document).ready(function(){
    //alert(drupalSettings.custom_variable);
    (function ($) {
      $(document).ready(function () {
          var url = new URL(location.href);
          for (const [key, value] of url.searchParams.entries()) {
              $(`#${key}`).val(value);
          }
    
      });
    })(jQuery);
    
    
    
    } );