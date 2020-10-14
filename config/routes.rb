Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root to: 'project#main'

  get '/:project_id', to: 'project#show'
  post '/:project_id', to: 'project#save'

end
