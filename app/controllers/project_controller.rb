class ProjectController < ApplicationController
  def main
  end

  def save
    project_id = params['project_id']

    if project_id
      project = Project.find(uuid: project_id)
      project.update(
        data: params['project_data']
      )

      render :json, {
        message: 'Successfully updated project'
      }
    else
      Project.create(
        uuid: project_id,
        data: params['project_data']
      )

      render :json, {
        message: 'Successfully created project!'
      }
    end
  end
end
