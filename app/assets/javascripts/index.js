var childData;
var url = "http://www.reddit.com";
var jsonP = ".json?jsonp=?";
var i = 0

$(document).ready(function() {

  $.ajax(url + "/.json?limit=100&count=100", {
    type: 'get',
  }).done(function(data) {
    childData = data.data.children[i].data;
    console.log(data);
    mediaType(childData);
    arrowUpDown(data);
  });

  inputRequest();

  $('.save-post').on("click", function() {
    $('.modal')
    .modal('show');
  });

  var userId = $(".all-boards").data('userid');

  $('.all-boards').on("click", ".single-board", function() {
    var boardId = $(this).data('boardid');
    $.ajax('/users/' + userId + '/boards/' + boardId + '/posts', {
      type: 'post',
      data: {
        post: {
          title: childData.title,
          author: childData.author,
          score: childData.score,
          url: childData.url,
          subreddit: childData.subreddit,
          selftext: childData.selftext,
          reddit_id: childData.id,
          media: childData.media,
          board_id: boardId,
        }
      }
    }).done(function(data) {});
  });
});

function inputRequest() {
  $('input').on('keyup', function(e) {
    if (e.keyCode == 13 && $('input').val()) {
      $.ajax(url + "/r/" + $('input').val() + ".json?limit=100&count=100", {
        type: 'get',
      }).done(function(data) {
        childData = data.data.children[0].data;
        console.log(data);
        mediaType(childData);
        arrowUpDown(data);
      });
    }
  });
}

function makeImage(content) {
  $('.contents').html($('<img class="ui centered rounded bordered image" src =' + content + '>'));
}

function makeVideo(content) {
  // var videoUrl = $(content).replace("watch?v=", "embed/");
  // var textUrl = videoUrl.text(videoUrl);
  $('.contents').html($('<iframe width=500 height=350 src="' + content +'">' +
  '</iframe>'));
}

function makeText(content) {
  $('.contents').html($('<p>' + content + '<p>'));
}

function makeLink(content) {
  $('.contents').html($('<a href="' + content + '"' + 'a>'+ content +'<a>'));
}

function makeCaption(content) {
  $('.caption').html($('<h2>' + content + '</h2>'));
}

function mediaType(redditObject) {

  if (redditObject.selftext === "") {
    if (redditObject.thumbnail === "" || redditObject.domain.indexOf('imgur') == -1 && redditObject.domain.indexOf('youtu') == -1 ) {
      makeLink(redditObject.url);
      makeCaption(redditObject.title);
    }
    else if (redditObject.domain.indexOf("youtu") !== -1) {
      makeVideo(redditObject.url);
      makeCaption(redditObject.title);
    }
    else {imgurCheck(redditObject);};
  }
  else {
    makeText(redditObject.selftext);
    makeCaption(redditObject.title);
  }
}

function arrowUpDown(json) {
  $(window).off();

  i = 0;
  $(window).on('keyup', function(e) {
    if (e.keyCode == 40 && i < 99) {
      i += 1;
      console.log(i);
      childData = json.data.children[i].data;
      mediaType(childData);
      $(document).off();
    }
    else if (e.keyCode == 38 && i > 0) {
      i -= 1;
      console.log(i);
      childData = json.data.children[i].data;
      mediaType(childData);
      $(document).off();
    };
  });
}

function imgurCheck(redditObject) {
  var redditURL = redditObject.url;
  var redditDomain = redditObject.domain.indexOf('imgur');
  if (redditDomain !== -1) {
    makeCaption(redditObject.title);
    imgurRequest(redditURL);
  }
  else {
    makeCaption(redditObject.title);
    makeImage(redditObject.url);
  };
}

function imgurRequest(url) {
  var idArray = url.split("imgur.com");
  idArray = idArray[1].split(".");
  var imgurID = idArray[0];
  if (url.indexOf('gallery') !== -1) {
    var galleryURL = "http://api.imgur.com/3" + imgurID
    console.log(imgurID);
    $.ajax({
      url: galleryURL,
      headers:{
        'Authorization':'Client-ID 60e65b3e6c5d4f1'
      },
      type: 'GET',
      dataType: 'json',
    }).done(function(data) {
      console.log(data);
      var imgurImages = data.data.images;
      arrowLeftRight(imgurImages);
    });
  }
  else {
    var imgurURL = "https://api.imgur.com/3/image" + imgurID;
    $.ajax({
      url: imgurURL,
      headers:{
        'Authorization':'Client-ID 60e65b3e6c5d4f1'
      },
      type: 'GET',
      dataType: 'json',
    }).done(function(data) {
      console.log(data);
      var imgurLink = data.data.link;
      makeImage(imgurLink);
    });
  };
}

function arrowLeftRight(galleryData) {
  $(document).off();

  var j = 0;
  console.log(galleryData[j].link);
  makeImage(galleryData[j].link);

  $(document).on('keyup', function(e) {
    if(e.keyCode == 39 && j < (galleryData.length - 1)) {
      console.log(galleryData[j].link);
      j+=1;
      makeImage(galleryData[j].link);
    }
    else if(e.keyCode == 37 && j > 0) {
      console.log(galleryData[j].link);
      j-=1;
      makeImage(galleryData[j].link);
    };
  });
}
