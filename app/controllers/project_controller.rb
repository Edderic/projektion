class ProjectController < ApplicationController
  def main
  end

  def show
    gon.project_data = project.data
  end

  def save
    project.update(
      data: params['data']
    )

    render plain: { message: 'Successfully updated project' }.to_json,
      content_type: 'application/json'
  end

  private

  def project
    @project ||= Project.find_or_create_by(uuid: project_id)
  end

  def project_id
    params['project_id']
  end
end
