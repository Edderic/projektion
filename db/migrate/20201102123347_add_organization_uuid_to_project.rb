class AddOrganizationUuidToProject < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :organization_uuid, :uuid
    add_index :projects, :organization_uuid
  end
end
