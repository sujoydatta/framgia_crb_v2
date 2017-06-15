def path_to(page_name)
  case page_name
  
  when /the homepage/
    root_path
  when /new organization creation page/
    new_organization_path
  when /new calendar creation page/
    new_calendar_path
  else
    raise "Can't find mapping from \"#{page_name}\" to a path."
  end
end
