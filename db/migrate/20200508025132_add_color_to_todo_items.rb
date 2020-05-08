class AddColorToTodoItems < ActiveRecord::Migration[6.0]
  def change
    add_column :todo_items, :color, :integer
  end
end
