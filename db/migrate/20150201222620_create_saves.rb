class CreateSaves < ActiveRecord::Migration
  def change
    create_table :saves do |t|
      t.integer :post_id
      t.integer :board_id
      t.datetime :date

      t.timestamps null: false
    end
  end
end
