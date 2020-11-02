class AddIndexingToUserOrganizations < ActiveRecord::Migration[6.0]
  def change
    add_index :user_organizations, :user_uuid
    add_index :user_organizations, :organization_uuid
  end
end
