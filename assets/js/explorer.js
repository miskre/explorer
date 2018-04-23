function timeago() {
  if ($.fn.timeago)
    $('time.ago').timeago()
}

$(document)
  .ready(function() {
    timeago()
  })