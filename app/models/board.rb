class Board < ActiveRecord::Base
  belongs_to :user
  has_many :saves
  has_many :posts, through: :saves

  validates :title, presence: true
end
