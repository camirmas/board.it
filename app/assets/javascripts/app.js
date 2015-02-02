$(document).ready(function() {
  var url = "http://www.reddit.com";
  var jsonP = ".json?jsonp=?";

  $.ajax(url + "/r/pics.json?limit=100&count=50", {
    type: 'get',
  }).done(function(data) {
    console.log(data);
    ($('<ul>' + data.data.children[0].data.title + '</ul>')).appendTo('.caption');
    ($('<img class="ui centered rounded bordered image" src =' + data.data.children[0].data.url + '>')).appendTo('.post');
    var i = 0

    $(document).on('keyup', function(e) {
      console.log('hi');
      var childData = data.data.children[i].data;
      if (e.keyCode == 40 && i < 99) {
        i += 1;
        childData = data.data.children[i].data;
        $('ul').replaceWith($('<ul>' + childData.title + '</ul>'));
        $('img').replaceWith($('<img class="ui centered rounded bordered image" src =' + childData.url + '>'));
      }
      else if (e.keyCode == 38 && i > 0) {
        i -= 1;
        childData = data.data.children[i].data;
        $('ul').replaceWith($('<ul>' + childData.title + '</ul>'));
        $('img').replaceWith($('<img class="ui centered rounded bordered image" src =' + childData.url + '>'));
      };
    });
  });
});
