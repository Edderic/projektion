class AddOwnerIdToProject < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :owner_id, :integer
    add_index :projects, :owner_id
  end
end
