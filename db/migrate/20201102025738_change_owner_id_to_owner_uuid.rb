class ChangeOwnerIdToOwnerUuid < ActiveRecord::Migration[6.0]
  def change
    remove_column :projects, :owner_id
    add_column :projects, :owner_uuid, :uuid
    add_index :projects, :owner_uuid
  end
end
