class Setting < ApplicationRecord
  belongs_to :owner, polymorphic: true
  validates_presence_of :timezone_name
end
