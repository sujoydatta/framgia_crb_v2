$(document).ready(function(){
  $('.logo-upload').change(function(){
    if (this.files && this.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $('.upload-image .logo-preview')
          .attr('src', e.target.result);
      };

      reader.readAsDataURL(this.files[0]);
    }
  });

  $('a[data-toggle="tab"]').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

  $('a[data-toggle="tab"]').on('shown.bs.tab', function () {
    var id = $(this).attr('href');
    localStorage.setItem('selectedTab', id);
  });

  var selectedTab = localStorage.getItem('selectedTab');
  if (selectedTab !== null) {
    $('a[data-toggle="tab"][href="' + selectedTab + '"]').tab('show');
  }

  $('.tabs li a').one('click', function(){
    var url = $(this).attr('data-url');
    var tab = $(this).attr('data-tab');
    if (url) {
      if (tab == 'activities') {
        $.ajax({
          url: url,
          method: 'get',
          success: function(result){
            $('#activities').html(result.content);
          },
          error: function(error){
            alert(error);
          }
        });
      }
    }
  });

  $(document).delegate('.pagination-activities a', 'click', function(e){
    e.preventDefault();
    var url = $(this).attr('href');
    $.ajax({
      url: url,
      method: 'get',
      success: function(result){
        $('#activities').html(result.content);
      },
      error: function(error){
        alert(error);
      }
    });
  });
});
