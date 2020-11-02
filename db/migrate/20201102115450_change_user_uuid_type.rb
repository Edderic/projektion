class ChangeUserUuidType < ActiveRecord::Migration[6.0]
  def change
    remove_column :user_organizations, :user_uuid
    remove_column :user_organizations, :organization_uuid
    add_column :user_organizations, :user_uuid, :uuid
    add_column :user_organizations, :organization_uuid, :uuid
  end
end
