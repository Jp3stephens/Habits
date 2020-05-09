class TodoItem < ApplicationRecord
  default_scope {order(created_at: :desc)}
  belongs_to :user
  validates :title, presence: true, uniqueness: {message: "That habit already exists!"}
  
  validates :color, presence: true
end
