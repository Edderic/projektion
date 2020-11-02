class CreateProjectUsers < ActiveRecord::Migration[6.0]
  def change
    create_table "project_users", force: :cascade do |t|
      t.boolean "can_change"
      t.boolean "can_read"
      t.uuid "user_uuid"
      t.uuid "project_uuid"
      t.datetime "created_at", precision: 6, null: false
      t.datetime "updated_at", precision: 6, null: false
      t.index ["project_uuid"], name: "index_project_users_on_project_uuid"
      t.index ["user_uuid"], name: "index_project_users_on_user_uuid"
    end
  end
end
