Rails.application.routes.draw do
  root "welcome#index"

  get 'auth/reddit/callback', to: "sessions#create", as: "callback"
  get '/logout', to: 'sessions#destroy', as: 'logout'

  get '/noko', to: 'noko#grab_text'

  resources :users do
    resources :boards do
      resources :posts
    end
  end
end
