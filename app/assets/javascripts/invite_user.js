$(document).ready(function(){
  var timeout;
  $('#search-user').on('input', function(){
    $('#result').html(null);
    if ($('#search-user').val()){
      clearTimeout(timeout);
      timeout = setTimeout(function(){ search_user() }, 500);
    }
  });

  function search_user(){
    var user_attribute = $('#search-user').val();
    var org_slug = $('#organ_slug').val();
    $('#search-user').addClass('loading');
    $.ajax({
      url: '/search_user/index',
      type: 'get',
      dateType: 'text',
      data: {
        user_attribute: user_attribute,
        org_slug: org_slug
      },
      success: function(result){
        $('#result').html(result);
        $('#result').find('a').hover(function(){
          $('.name-list').blur();
          $(this).focus();
        });
        $('#search-user').removeClass('loading');
      }
    });
  }

  $(document).keydown(function(e){
    if (e.keyCode == 40){
      if ($('.name-list:focus').length > 0) {
        $('.name-list:focus').closest('li').next().find('a.name-list').focus();
      } else {
        $('.name-list').eq(0).focus();
      }
    }

    if (e.keyCode == 38){
      if ($('.name-list:focus').length > 0){
        $('.name-list:focus').closest('li').prev().find('a.name-list').focus();
      } else {
        $('.name-list').last().focus();
      }
    }
  });

  $('#invite-modal').on('hidden.bs.modal', function() {
    $('#result').empty();
    $('#search-user').val('');
  });
});
