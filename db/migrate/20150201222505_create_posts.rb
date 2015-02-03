class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string :title
      t.string :author
      t.integer :score
      t.text :url
      t.string :subreddit
      t.text :selftext
      t.string :reddit_id
      t.string :media

      t.timestamps null: false
    end
  end
end
