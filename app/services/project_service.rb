class ProjectService
  def find_projects_accessible_to_user(user)
    projects_for_user(user).map do |project|

      data = JSON.parse(project["data"])

      {
        owned: project["owner_uuid"] == user.uuid,
        name: data["simName"],
        uuid: project["uuid"]
      }
    end
  end

  private

  def projects_for_user(user)
    @projects_for_user ||= ActiveRecord::Base.connection.exec_query(
      <<-SQL
        with relevant_user_orgs as
          (select * from user_organizations where user_uuid = '#{user.uuid}')

        select * from relevant_user_orgs

          inner join organizations
          on (relevant_user_orgs.organization_uuid = organizations.uuid)

          inner join projects on
            (organizations.uuid = projects.organization_uuid)
      SQL
    )
  end
end
