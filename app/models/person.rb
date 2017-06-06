class Person
  include ActiveModel::Validations
  validates_with NameValidator

  attr_accessor :name

  def initialize name = nil
    @name = name
  end

  def new_record?
    true
  end

  class << self
    def names
      connection = ActiveRecord::Base.connection
      result = connection.exec_query("SELECT org.name FROM organizations as org UNION SELECT users.name FROM users")
      result.rows.flatten
    end
  end
end
