var hiddenDialog = function(dialogId) {
  var dialog = $('#' + dialogId);
  $(dialog).addClass('dialog-hidden');
  $(dialog).removeClass('dialog-visible');
};

function showDialog(dialogId) {
  var dialog = $('#' + dialogId);
  $(dialog).removeClass('dialog-hidden');
  $(dialog).addClass('dialog-visible');
  $('.overlay-bg').css({
    'height': $(document).height(),
    'display': 'block'
  });
}

function dialogCordinate(jsEvent, dialogId, prongId) {
  var dialog = $('#' + dialogId);
  var dialogW = $(dialog).width();
  var dialogH = $(dialog).height();
  var windowW = $(window).width();
  var xCordinate, yCordinate;
  var prongRotateX, prongXCordinate, prongYCordinate;

  if (jsEvent.clientX - dialogW/2 < 0) {
    xCordinate = jsEvent.clientX - dialogW/2;
  } else if(windowW - jsEvent.clientX < dialogW/2) {
    xCordinate = windowW - 2 * dialogW/2 - 10;
  } else {
    xCordinate = jsEvent.clientX - dialogW/2;
  }

  if(xCordinate < 0) xCordinate = 10;

  if (jsEvent.clientY - dialogH < 0) {
    yCordinate = jsEvent.clientY + 20;
    prongRotateX = 180;
    prongYCordinate = -9;
  } else {
    yCordinate = jsEvent.clientY - dialogH - 20;
    prongRotateX = 0;
    prongYCordinate = dialogH;
  }

  prongXCordinate = jsEvent.clientX - xCordinate - 10;

  $(dialog).css({'top': yCordinate, 'left': xCordinate});
  $('#' + prongId).css({
    'top': prongYCordinate,
    'left': prongXCordinate,
    'transform': 'rotateX(' + prongRotateX + 'deg)'
  });

  $(dialog).removeClass('dialog-hidden');
  $(dialog).addClass('dialog-visible');
}
