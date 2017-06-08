class CheckNamesController < ApplicationController
  skip_before_action :authenticate_user!

  def show
    @person = Person.new params[:name]

    if @person.valid?
      render json: {result: true}, status: :created
    else
      render json: @person.errors.full_messages[0],
        status: :unprocessable_entity
    end
  end
end
