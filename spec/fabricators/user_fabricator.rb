Fabricator :user do
  name {FFaker::Lorem.word.gsub(/\s+/, "-").to_sym}
  email {FFaker::Internet.email}
  password "12345678"
end
