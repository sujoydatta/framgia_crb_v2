When(/^I am on "(.*?)"$/) do |page_name|
  case page_name
  
  when "the homepage"
    root_path
  end
end
