Fabricator :calendar do
  name {"Conference Room Calendar"}
  description {FFaker::Lorem.sentence}
  address {Calendar.generate_unique_secure_token.downcase! + "@crb.framgia.vn"}
  owner
end
