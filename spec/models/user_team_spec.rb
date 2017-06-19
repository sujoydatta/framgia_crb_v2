require "rails_helper"

RSpec.describe UserTeam, type: :model do
  it{should belong_to :user}
  it{should belong_to :team}

  it{should define_enum_for(:role).with([:owner, :member])}
end
