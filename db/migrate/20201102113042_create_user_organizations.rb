class CreateUserOrganizations < ActiveRecord::Migration[6.0]
  def change
    create_table :user_organizations do |t|
      t.string :user_uuid, null: false
      t.string :organization_uuid, null: false

      t.timestamps
    end
    add_index :user_organizations, :user_uuid
    add_index :user_organizations, :organization_uuid
  end
end
