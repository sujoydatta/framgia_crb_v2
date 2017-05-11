$(document).on('ready', function() {
  $('.add-attendee').on('click', function() {
    var id = $('#list-attendee').find('li').length;
    var email = $('.attendee-email').val();

    if (validateEmail(email)){
      var list_attendee = document.getElementById('list-attendee');

      if (!exitEmail(email)) {
        var attendee_form = $('#group_attendee_' + (id - 1)).clone()[0];
        var group_attendee = $('#group_attendee_' + (id - 1));

        $(group_attendee).find('li')[0].innerHTML = email;
        $(group_attendee).find('input[type=hidden]')[0].value = email;
        $(group_attendee).find('input[type=hidden]')[1].value = false;
        $(group_attendee).find('input[type=hidden]')[2].value = $('.attendee-email').attr('data-user-id');
        $(group_attendee).show();

        attendee_form.id = 'group_attendee_' + id;
        $(attendee_form).find('input[type=hidden]')[0].name = 'event[attendees_attributes][' + id + '][email]';
        $(attendee_form).find('input[type=hidden]')[1].name = 'event[attendees_attributes][' + id + '][_destroy]';
        $(attendee_form).find('input[type=hidden]')[2].name = 'event[attendees_attributes][' + id + '][user_id]';
        $(attendee_form).find('input[type=hidden]')[1].value = true;

        list_attendee.appendChild(attendee_form);
        $('.attendee-email').val('');
        $('.attendee-email').focus();
        $(this).unbind('click');
      } else {
        alert(I18n.t('events.flashs.attendee_added'));
      }
    } else {
      alert(I18n.t('events.flashs.invalid_email'));
    }
  });

  $('.attendee-email').autocomplete({
    source: '/search',
    create: function(){
      $(this).data('ui-autocomplete')._renderItem = function(ul, item) {
        return $('<li>').append('<a class="selected-item" data-id=' + item.user_id + '>' + item.email + '</a>').appendTo(ul);
      };
    }
  });

  $(document).on('click', '.selected-item', function(){
    $('.attendee-email').val($(this).text());
    $('.attendee-email').attr('data-user-id', $(this).data('id'));
  });

  $('#list-attendee').on('click', '.remove_attendee', function(){
    $($(this).parent().find('input[type=hidden]')[1]).val(true);
    $(this).parent().hide();
  });


  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return !re.test(email.value);
  }

  function exitEmail(email) {
    for (var i = 0; i < $('#list-attendee').find('li').length; i++) {
      if (email == $('#list-attendee').find('li')[i].innerHTML && $($('#list-attendee').find('li')[i]).parent().find('input[type=hidden]')[1].value == 'false') {
        return true;
      }
    }
    return false;
  }
});
