class Post < ActiveRecord::Base
  has_many :saves
  has_many :boards, through: :saves
end
