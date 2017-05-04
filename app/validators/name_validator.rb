class NameValidator < ActiveModel::Validator
  def validate record
    # name may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen
    if !(record.name =~ /^(?!-)(?!.*--)[A-Za-z0-9-]+(?<!-)$/i)
      record.errors[:name] << "may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen"
    elsif record.name.length > 39
      record.errors[:name] << "is too long (maximum is 39 characters)"
    elsif Person.names.include?(record.name)
      record.errors[:name] << "is already taken"
    end
  end
end
