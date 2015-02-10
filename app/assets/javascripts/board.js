$(document).ready(function() {
  $('.menu-button').on('click', function() {
    $('.sidebar').sidebar('setting', 'transition', 'overlay')
    .sidebar('toggle');
    $('body').removeClass('pushable');
  });

  if (window.location.href.indexOf("boards") === -1) {
    $('.add-board-button').remove();
  }

  $('.add-board-button').on("click", function() {
    var source = $("#add-board-template").html();

    if ($(".add-board").length === 0) {
      $(".boards-view").prepend(source);
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
      var source   = $("#board-template").html();
      var template = Handlebars.compile(source);
      var context  = { id: data.id, title: data.title };
      var html     = template(context);

      $(".cards").append(html);
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
    var source   = $("#board-edit-template").html();
    var template = Handlebars.compile(source);
    var context  = { title: boardTitle };
    var html     = template(context);

    $(this).parent().replaceWith(html);
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
    window.location.hash = boardId;

    if($(".board-show")) {
      $(".board-show").remove();
    }

    $.ajax("/users/" + userId + "/boards/" + boardId + "/posts", {
      type: 'get'
    }).done(function(data) {
      var can_modify = $(".modifiable").length !== 0;
      tempType = can_modify ? "#board-show-user-template" : "#board-show-template";
      var source   = $(tempType).html();
      var template = Handlebars.compile(source);
      var context  = {
        userId: userId,
        boardId: boardId,
        title: boardTitle,
        posts: []
      };

      for (var i = 0; i < data.length; i++) {
        var imageURL = data[i].thumbnail ? data[i].thumbnail : "noisy_net.png";
        context.posts.push({
          postId: data[i].id,
          imageURL: imageURL,
          url: data[i].url,
          score: data[i].score,
          name: data[i].title,
          author: data[i].author,
          subreddit: data[i].subreddit,
          selftext: data[i].selftext
        });
      }
      var html = template(context);
      $(".boards-view").append(html);
      $('.board-show').modal('show').modal('setting', {
        onHide: function() {
          window.location.hash = "";
        }
      });
    });
  });

  $(document).on("click", ".post-delete", function() {
    var postId  = $(this).closest(".content").data("postid");
    var userId  = $(".boards-view").data('userid');
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

  if (window.location.hash !== "") {
    var boardId = parseInt(window.location.hash.split("#")[1]);
    $("[data-boardId='" + boardId + "']").trigger("click");
  }
});
