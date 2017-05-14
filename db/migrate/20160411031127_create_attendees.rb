class CreateAttendees < ActiveRecord::Migration
  def change
    create_table :attendees do |t|
      t.string :email
      t.references :user
      t.references :event
      t.integer :status

      t.timestamps null: false
    end
    add_index :attendees, [:email, :event_id], unique: true
    add_index :attendees, :user_id
  end
end
