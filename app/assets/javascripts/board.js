$(document).ready(function() {
  $('.menu-button').on('click', function() {
    $('.sidebar').sidebar('setting', 'transition', 'overlay')
    .sidebar('toggle');
  });
});
