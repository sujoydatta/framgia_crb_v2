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
});
