$(document).ready(function() {
  var url = "http://www.reddit.com";
  var jsonP = ".json?jsonp=?";

  $.ajax(url + "/.json?limit=100&count=100", {
    type: 'get',
  }).done(function(data) {
    console.log(data);
    ($('<h2>' + data.data.children[0].data.title + '</h2>')).appendTo('.caption');
    ($('<img class="ui centered rounded bordered image" src =' + data.data.children[0].data.url + '>')).appendTo('.post');
    var i = 0

    arrowUpDown(data, i);
  });

  var inputVal = $('input').val()

  $('input').on('keyup', function(e) {
    if (e.keyCode == 13 && $('input').val()) {
      $.ajax(url + "/r/" + $('input').val() + ".json?limit=100&count=100", {
        type: 'get',
      }).done(function(data) {
        console.log(data);
        $('h2').replaceWith($('<h2>' + data.data.children[0].data.title + '</h2>'));
        $('img').replaceWith($('<img class="ui centered rounded bordered image" src =' + data.data.children[0].data.url + '>'));
        var i = 0

        arrowUpDown(data, i);
      });
    }
  });

});

function arrowUpDown(data, counter) {
  $(document).on('keyup', function(e) {
    console.log('hi');
    var childData = data.data.children[counter].data;
    if (e.keyCode == 40 && counter < 99) {
      counter += 1;
      childData = data.data.children[counter].data;
      $('h2').replaceWith($('<h2>' + childData.title + '</h2>'));
      $('img').replaceWith($('<img class="ui centered rounded bordered image" src =' + childData.url + '>'));
    }
    else if (e.keyCode == 38 && counter > 0) {
      counter -= 1;
      childData = data.data.children[counter].data;
      $('h2').replaceWith($('<h2>' + childData.title + '</h2>'));
      $('img').replaceWith($('<img class="ui centered rounded bordered image" src =' + childData.url + '>'));
    };
  });
}
