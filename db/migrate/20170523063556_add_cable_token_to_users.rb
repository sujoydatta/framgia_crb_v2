class AddCableTokenToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :cable_token, :string
  end
end
