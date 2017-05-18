class StringUtils < String
  attr_accessor :user_name

  def initialize name
    @name = name
  end

  def to_slug
    value = respond_to?(:mb_chars) ? @name.mb_chars : ActiveSupport::Multibyte::Chars.new(@name)
    value = value.normalize(:kd).gsub(/[^\x00-\x7F]/n, "").to_s
    value.gsub!(/["]+/, "")
    value.gsub!(/\W+/, " ")
    value.strip!
    value.gsub!(" ", "")
    value
  end
end
