class ProjectController < ApplicationController
  def main
  end

  def save
    project_id = params['project_id']

    project = Project.find_or_create_by(uuid: project_id)
    project.update(
      data: params['data']
    )

    render plain: { message: 'Successfully updated project' }.to_json,
      content_type: 'application/json'
  end
end
