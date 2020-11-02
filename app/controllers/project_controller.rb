class ProjectController < ApplicationController
  before_action :authenticate_user!

  def index
    gon.projects = projects
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

  def projects
    ProjectService.
      new.
      find_projects_accessible_to_user(current_user)
  end

  def project_uuid
    params['project_uuid']
  end
end
