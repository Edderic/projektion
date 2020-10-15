class ProjectController < ApplicationController
  def main
  end

  def show
    gon.project_data = project.data
    gon.project_uuid = project.uuid
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
    @project ||= Project.find_or_create_by(uuid: project_uuid)
  end

  def project_uuid
    params['project_uuid']
  end
end
