$(document).on('ready', function(){
  var timeout;
  var pattern = /^(?![0-9]+$)[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/i;
  $('.auto-validate-name').on('input',function(){
    remove_status_validate();
    $('.error_validate_mes').hide();
    if ($('.auto-validate-name').val()){
      clearTimeout(timeout);
      timeout = setTimeout(function(){ validate_data() }, 500);
    }
  });

  function validate_data(){
    add_status_validate('loading');
    var name = $('.auto-validate-name').val();

    function validate_faild(text){
      add_status_validate('error');
      $('.error_validate_mes').text(
        $('.auto-validate-name').attr('placeholder') + ' ' + text);
      $('.error_validate_mes').css('width',$('.auto-validate-name').parent().width());
      $('.error_validate_mes').show();
    }

    if (!(pattern.test(name))){
      validate_faild(I18n.t('validator.name.not_valid_format'));
    } else if (name.length > 39){
      validate_faild(I18n.t('validator.name.too_length'));
    } else {
      $.ajax({
        url: '/check_names',
        type: 'get',
        data: {name: name},
        success: function(result){
          add_status_validate('success');
        },
        error: function(result){
          validate_faild(result.responseText);
        }
      });
    }
  }

  function add_status_validate(status){
    remove_status_validate();
    $('.auto-validate-name').addClass(status);
  }

  function remove_status_validate(){
    $('.auto-validate-name').removeClass('loading');
    $('.auto-validate-name').removeClass('error');
    $('.auto-validate-name').removeClass('success');
  }
});
