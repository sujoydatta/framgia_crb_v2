$(document).on('ready', function(){

  $('.select-all-calendar').click(function(){
    if($(this).is(':checked') ){
      $('.calendar-select > option').prop('selected', 'selected');
      $('.calendar-select').trigger('change');
    } else {
      $('.calendar-select > option').removeAttr('selected');
      $('.calendar-select').trigger('change');
    }
  });

  $(document).on('click', '.btn-multi-book', function(event) {
    event.preventDefault();
    var numberCheckedBox = $('.calendar-id:checkbox:checked').length;

    if (numberCheckedBox === 0) return;

    var form = $(this).parents('form');
    form.submit();
  });

  $('#room-search-submit').on('click', function() {
    var start_date = $('#start_date');
    var start_time = $('#start_time');
    var finish_date = $('#finish_date');
    var finish_time = $('#finish_time');
    var search_error_mes = $('#search-error-message');

    if (start_date.val() == '') {
      start_date.prop('required',true);
      search_error_mes.text(I18n.t('room_search.start_date'));
    } else if (start_time.val() == '') {
      start_time.prop('required',true);
      search_error_mes.text(I18n.t('room_search.start_time'));
    } else if (finish_time.val() == '') {
      finish_time.prop('required',true);
      search_error_mes.text(I18n.t('room_search.finish_time'));
    } else if (finish_date.val() == '') {
      finish_date.prop('required',true);
      search_error_mes.text(I18n.t('room_search.finish_date'));
    }
  });
});
