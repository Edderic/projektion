class CreateProjectUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :project_users do |t|
      t.boolean :can_change
      t.boolean :can_read
      t.uuid :user_uuid
      t.uuid :project_uuid

      t.timestamps
    end
    add_index :project_users, :user_uuid
    add_index :project_users, :project_uuid
  end
end
