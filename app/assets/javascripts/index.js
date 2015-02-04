var parentData;
var childData;
var input = "";
var url = "http://www.reddit.com";
var jsonP = ".json?jsonp=?";
var i = 0

$(document).ready(function() {

  $.ajax(url + "/.json?limit=25&count=25", {
    type: 'get',
  }).done(function(data) {
    parentData = data.data
    childData = data.data.children[i].data;
    console.log(data);
    mediaType(childData);
    arrowUpDown(data);
  });

  inputRequest();

  $('.save-post').on("click", function() {
    $('.save')
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
          thumbnail: childData.thumbnail,
        }
      }
    }).done(function(data) {});
  });

});

function inputRequest() {
  $('input').on('keyup', function(e) {
    if (e.keyCode == 13 && $('input').val()) {
      input = "/r/" + $('input').val()
      $('input').val("");
      $.ajax(url +  input + "/.json?limit=25&count=25", {
        type: 'get',
      }).done(function(data) {
        i = 0;
        parentData = data.data;
        childData = data.data.children[0].data;
        console.log(data);
        mediaType(childData);
        arrowUpDown(data);
      })
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
  $('.contents').html($('<h3>' + content + '</h3>'));
}

function makeLink(content) {
  $('.contents').html($('<a href="' + content + '"' + 'a>'+ content +'</a>'));
  $('.contents').append($('<iframe class="ui fullscreen modal link" src ="' + content + '"></iframe>'));
  $('.contents').on("click", function() {
    $('.link').modal('show');
  });
}

function makeInfo(content) {
  $('.caption').html($('<h2>' + content.title + '</h2>'));
  $('.score').html($('<h1>' + content.score + '</h1>'));
  $('.subreddit').html($('<p>' + 'submitted by: ' + content.author + ' to: ' + content.subreddit + '</p>'));
}

function mediaType(redditObject) {

  if (redditObject.selftext === "") {
    if (redditObject.thumbnail === "" || redditObject.domain.indexOf('imgur') == -1) {
      makeLink(redditObject.url);
      makeInfo(redditObject);
    }
    else if (redditObject.domain.indexOf("youtu") !== -1) {
      makeVideo(redditObject.url);
      makeInfo(redditObject);
    }
    else {imgurCheck(redditObject);};
  }
  else {
    makeText(redditObject.selftext);
    makeInfo(redditObject);
  }
}

function arrowUpDown(json) {
  $(window).off();
  var after = parentData.after;
  var before = parentData.before;

  $(window).on('keyup', function(e) {
    if (e.keyCode == 40 && i < 24) {
      i += 1;
      console.log(i);
      childData = json.data.children[i].data;
      $('.fullscreen').remove();
      $('.contents').off();
      mediaType(childData);
      $(document).off();
    }
    else if (e.keyCode == 38 && i > 0) {
      i -= 1;
      console.log(i);
      childData = json.data.children[i].data;
      $('.fullscreen').remove();
      $('.contents').off();
      mediaType(childData);
      $(document).off();
    }
    else if (e.keyCode == 40 && i == 24) {
      i = 0;
      $.ajax(url + '/' + input + "/.json?limit=25&count=25&after=" + after, {
        type: 'get',
      }).done(function(data) {
        parentData = data.data
        childData = data.data.children[i].data;
        console.log(input);
        mediaType(childData);
        arrowUpDown(data);
      });
    }
    else if (e.keyCode == 38 && i == 0) {
      i = 24;
      $.ajax(url + '/' + input + "/.json?limit=25&count=25&before=" + before, {
        type: 'get',
      }).done(function(data) {
        parentData = data.data
        childData = data.data.children[i].data;
        console.log(data);
        mediaType(childData);
        i = 24;
        arrowUpDown(data);
      });
    };
  });
}

function imgurCheck(redditObject) {
  var redditURL = redditObject.url;
  var redditDomain = redditObject.domain.indexOf('imgur');
  if (redditDomain !== -1) {
    makeInfo(redditObject);
    imgurRequest(redditURL);
  }
  else {
    makeInfo(redditObject);
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
