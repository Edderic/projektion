Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root to: 'project#main'

  get '/:project_uuid', to: 'project#show'
  post '/:project_uuid', to: 'project#save'

end
