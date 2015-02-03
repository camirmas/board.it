class PostsController < ApplicationController
  before_action :set_user
  before_action :set_board

  def index
    @posts = @board.posts.all
    render json: @posts
  end

  def create
    @post = @board.posts.new(post_params)

    if @post.save
      render json: @post
    else
    end
  end

  def update
    @post = @board.posts.find(params[:id])

    if @post.update(post_params)
      render json: @post
    else
    end
  end

  def destroy
    @post = @board.posts.find(params[:id])

    if @post.destroy
      render json: @post
    else
    end
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  end

  def set_board
    @board = @user.boards.find(params[:board_id])
  end

  def post_params
    params.require(:post).permit(
      :title,
      :author,
      :score,
      :url,
      :subreddit,
      :selftext,
      :reddit_id,
      :media,
      :board_id,
    )
  end
end
