class WelcomeController < ApplicationController
  before_action :set_user

  def index
    @boards = @user.boards.all
  end

  private

  def set_user
    @user = current_user
  end

end
