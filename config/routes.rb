Rails.application.routes.draw do
  root "welcome#index"

  get 'auth/reddit/callback', to: "sessions#create", as: "callback"
end
