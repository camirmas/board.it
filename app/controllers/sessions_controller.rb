class SessionsController < ApplicationController
  def create
    user = User.from_omniauth(user_params)
    session[:access_token] = request.env['omniauth.auth']['credentials']['token']
    session[:access_token_secret] = request.env['omniauth.auth']['credentials']['secret']
    session[:user_id] = user.id
    redirect_to root_path
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_path
  end

  private

  def user_params
    User.from_omniauth(env["omniauth.auth"])
  end
end
