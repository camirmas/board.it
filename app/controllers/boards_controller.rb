class BoardsController < ApplicationController
  before_action :set_user

  def index
    @boards = @user.boards.all

    respond_to do |format|
      format.html
      format.json { render json: @boards }
    end
  end

  def create
    @board = @user.boards.new(board_params)

    if can_modify?(@user) && @board.save
      render json: @board
    else
    end
  end

  def update
    @board = @user.boards.find(params[:id])

    if can_modify?(@user) && @board.update(board_params)
      render json: @board
    else
    end
  end

  def destroy
    @board = @user.boards.find(params[:id])

    if can_modify?(@user) && @board.destroy
      render json: @board
    else
    end
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  end

  def board_params
    params.require(:board).permit(:title)
  end
end
