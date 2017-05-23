Fabricator :event do
  title {FFaker::Lorem.word}
  user_id
  description {FFaker::Lorem.sentence}
  start_date {DateTime.new(2016,2,3,8,0,0,"+7")}
  finish_date {DateTime.new(2016,2,3,8,0,0,"+7")}
  start_repeat {DateTime.new(2016,2,3,8,0,0,"+7")}
  end_repeat {DateTime.new(2016,2,3,8,0,0,"+7")}
  calendar
  repeat_type 1
  repeat_every 7
end
