Rails.application.routes.draw do
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    passwords: 'users/passwords'
  }

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root to: 'project#index'

  get '/projects', to: 'project#index'
  get '/projects/:project_uuid', to: 'project#show'
  post '/projects/:project_uuid', to: 'project#save'

end
