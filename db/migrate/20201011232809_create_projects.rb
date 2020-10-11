class CreateProjects < ActiveRecord::Migration[6.0]
  def change
    create_table :projects do |t|
      t.uuid :uuid
      t.json :data

      t.timestamps
    end
  end
end
