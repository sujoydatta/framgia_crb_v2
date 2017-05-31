Fabricator(:workspace) do
  name {FFaker::Lorem.word}
  address {FFaker::Lorem.sentence}
  organization
end
