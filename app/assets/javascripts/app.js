$(document).ready(function() {
  var url = "http://www.reddit.com";
  var jsonP = ".json?jsonp=?";

  $.ajax(url + '/u/cjirmas/' + jsonP, {
    type: 'get',
    dataType: 'jsonp'
  }).done(function(data) {
    // console.log(data);
    for(var i = 0; i < data.data.children.length; i++) {
      var childData = data.data.children[i].data;
      // console.log(childData.title);
    }
  });
});
