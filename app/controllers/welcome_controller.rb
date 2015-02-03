class WelcomeController < ApplicationController
  before_action :set_user

  def index
    if current_user
      @boards = @user.boards.all
    end
  end

  private

  def set_user
    @user = current_user
  end

end
