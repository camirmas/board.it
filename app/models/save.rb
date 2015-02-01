class Save < ActiveRecord::Base
  belongs_to :board
  belongs_to :post
end
