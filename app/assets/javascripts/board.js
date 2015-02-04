$(document).ready(function() {
  $('.menu-button').on('click', function() {
    $('.sidebar').sidebar('setting', 'transition', 'overlay')
    .sidebar('toggle');
  });

  $('.add-board-button').on("click", function() {
    var boardForm = '\
    <div class="ui form add-board">\
      <div class="field">\
        <label>Name</label>\
        <input type="text" name="some_name" value="">\
      </div>\
      <div class="ui green submit button board-create">\
      <i class="checkmark icon"></i>\
      Complete\
      </div>\
        <i class="big remove icon hide-form"></i>\
    </div>';

    if ($(".add-board").length === 0) {
      $(".boards-view").prepend(boardForm);
      $('.boards-view').find(".add-board").hide().slideDown(300);
    }
  });

  $('.boards-view').on("click", ".board-create", function() {
    var id = $(".boards-view").data('userid');
    var name = $(this).prev().find("input").val();
    $(this).prev().find("input").val("");

    $.ajax('/users/' + id + '/boards', {
      type: 'post',
      data: {
        board: {
          title: name
        }
      }
    }).done(function(data) {
      var board = '\
      <div class="ui card" data-boardId="' + data.id + '">\
        <div class="content">\
          <div class="header left floated">' + data.title + '</div>\
        </div>\
      </div>\
      ';
      $(".cards").append(board);
      $(".cards").find("[data-boardId='" + data.id + "']").hide().fadeIn(200);
    });
  });

  $('.boards-view').on("click", ".hide-form", function() {
    $(this).parent().slideUp(300, function() {
      $(this).remove();
    });
  });

  $(document).on("click", ".board-show .delete", function() {
    var userId = $(".boards-view").data('userid');
    var boardId = $(".board-show").data('boardid');
    var confirmDelete = confirm("Are you sure you want to delete this?");

    if (confirmDelete) {
      $.ajax('/users/' + userId + '/boards/' + boardId, {
        type: 'delete'
      }).done(function(data) {
        $('.board-show').modal('hide');
        $(".cards").find("[data-boardId='" + data.id + "']").fadeOut(function() {
          $(this).remove();
        });
      });
    }
  });

  $(document).on("click", ".board-show .update", function(event) {
    var boardTitle = $.trim($(this).parent().text());
    var editForm = '\
    <div class="ui form edit-board">\
      <label class="edit-board-label">Title</label>\
      <input type="text" value="' + boardTitle + '">\
      <div class="ui green submit button board-update">\
        <i class="checkmark icon"></i>\
      </div>\
    </div>\
    ';
    $(this).parent().replaceWith(editForm);
  });

  $(document).on("click", ".board-show .board-update", function() {
    var userId = $(".boards-view").data('userid');
    var boardId = $(".board-show").data('boardid');
    var updatedTitle = $.trim($(this).prev().val());

    $.ajax('/users/' + userId + '/boards/' + boardId, {
      type: 'patch',
      data: {
        board: {
          title: updatedTitle
        }
      }
    }).done(function(data) {
      var card = $(".cards").find("[data-boardId='" + data.id + "']");
      var newHeader = '\
      <div class="header">\
        ' + data.title + '\
        <i class="remove icon delete""></i><i class="edit icon update"></i>\
      </div>\
      ';
      $(".board-show .edit-board").replaceWith(newHeader);
      $(card).find(".header").text(data.title);
    });
  });

  $(".cards").on("click", ".card", function() {
    var boardTitle = $(this).find(".header").text();
    var userId = $(".boards-view").data('userid');
    var boardId = $(this).closest(".card").data('boardid');

    if($(".board-show")) {
      $(".board-show").remove();
    }

    $.ajax("/users/" + userId + "/boards/" + boardId + "/posts", {
      type: 'get'
    }).done(function(data) {
      var can_modify = $(".modifiable").length !== 0;

      if (can_modify) {
        var boardModalStart = '\
        <div class="ui modal board-show" data-boardId="' + boardId + '">\
          <i class="close icon"></i>\
          <div class="header">\
            ' + boardTitle + '\
            <i class="remove icon delete""></i><i class="edit icon update"></i>\
          </div>\
        ';
      } else {
        var boardModalStart = '\
        <div class="ui modal board-show" data-boardId="' + boardId + '">\
          <i class="close icon"></i>\
          <div class="header">\
            ' + boardTitle + '\
          </div>\
        ';
      }
      var boardModalEnd = '</div>';

      for (var i = 0; i < data.length; i++) {
        if (can_modify) {
          var imageURL = data[i].thumbnail ? data[i].thumbnail : "https://www.redditstatic.com/about/assets/reddit-alien.png";
          var listItem = '\
            <div class="content ui vertical segment" data-postId="' + data[i].id + '">\
              <div class="ui small image">\
                <img src="' + imageURL + '">\
              </div>\
              <div class="description">\
                <div class="ui header"><span class="score">' + data[i].score + '\
                 | </span><a href="' + data[i].url + '" target="_blank">\
                 ' + data[i].title + '</a></div>\
                <p>posted by: <a href="http://reddit.com/u/' + data[i].author + '\
                " target="_blank">\
                ' + data[i].author + '</a> to: \
                <a href="http://reddit.com/r/' + data[i].subreddit + '" target="_blank">\
                ' + data[i].subreddit + '</a></p>\
                <p>' + data[i].selftext + '</p>\
                <div class="ui right floated red button post-delete">Delete</div>\
              </div>\
            </div>\
          ';
        } else {
          var listItem = '\
          <div class="content ui vertical segment" data-postId="' + data[i].id + '">\
            <div class="ui medium image">\
              <img src="http://www.adweek.com/files/imagecache/node-detail/news_article/lilbub-hed2-2013.gif">\
            </div>\
            <div class="description">\
              <div class="ui header">' + data[i].title + '</div>\
                <p>' + data[i].author + ' | Score: ' + data[i].score + '</p>\
                <p>' + data[i].selftext + '</p>\
              </div>\
            </div>\
          ';
        }
        boardModalStart += listItem;
      }
      $(".boards-view").append(boardModalStart + boardModalEnd);
      $('.board-show').modal('show');
    });
  });

  $(document).on("click", ".post-delete", function() {
    var postId = $(this).closest(".content").data("postid");
    var userId = $(".boards-view").data('userid');
    var boardId = $(this).closest(".board-show").data('boardid');
    var confirmDelete = confirm("Are you sure you want to delete this post?");

    if (confirmDelete) {
      $.ajax("/users/" + userId + "/boards/" + boardId + "/posts/" + postId, {
        type: 'delete'
      }).done(function(data) {
        $(document).find("[data-postId='" + postId + "']").fadeOut(function() {
          $(this).remove();
        });
      });
    }
  });
});
