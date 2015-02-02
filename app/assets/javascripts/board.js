var prevBoard;

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
        <i class="remove icon hide-form"></i>\
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
          <i class="large remove icon right floated delete"></i>\
          <i class="large edit icon right floated update"></i>\
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

  $(".boards-view").on("click", ".delete", function() {
    var userId = $(".boards-view").data('userid');
    var boardId = $(this).closest(".card").data('boardid');
    var res = confirm("Are you sure you want to delete this?");

    if (res) {
      $.ajax('/users/' + userId + '/boards/' + boardId, {
        type: 'delete'
      }).done(function(data) {
        $(".cards").find("[data-boardId='" + data.id + "']").fadeOut(function() {
          $(this).remove();
        });
      });
    }
  });

  $(".boards-view").on("click", ".update", function() {
    var boardTitle = $(this).prev().prev().text();
    var editForm = '\
    <div class="ui form edit-board">\
      <label>Title</label>\
      <input type="text" value="' + boardTitle + '">\
      <div class="ui green submit button board-update">\
        <i class="checkmark icon"></i>\
      </div>\
    </div>\
    ';
    $(this).parent().empty().append(editForm);
  });

  $(".boards-view").on("click", ".board-update", function() {
    var userId = $(".boards-view").data('userid');
    var boardId = $(this).closest(".card").data('boardid');
    var updatedTitle = $(this).prev().val();

    $.ajax('/users/' + userId + '/boards/' + boardId, {
      type: 'patch',
      data: {
        board: {
          title: updatedTitle
        }
      }
    }).done(function(data) {
      var card = $(".cards").find("[data-boardId='" + data.id + "']");
      card.remove();
      var board = '\
      <div class="ui card" data-boardId="' + data.id + '">\
        <div class="content">\
          <div class="header left floated">' + data.title + '</div>\
          <i class="large remove icon right floated delete"></i>\
          <i class="large edit icon right floated update"></i>\
        </div>\
      </div>\
      ';
      $(".cards").append(board);
    });
  });
});
