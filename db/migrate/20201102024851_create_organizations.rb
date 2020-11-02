class CreateOrganizations < ActiveRecord::Migration[6.0]
  def change
    create_table :organizations do |t|
      t.string :name
      t.uuid :uuid

      t.timestamps
    end

    add_index :organizations, :uuid
  end
end
