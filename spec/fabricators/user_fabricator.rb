Fabricator :user do
  name {FFaker::PhoneNumber.area_code}
  email {FFaker::Internet.email}
  password "12345678"
end
