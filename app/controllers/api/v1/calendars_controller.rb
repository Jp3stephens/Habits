class Api::V1::CalendarsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_calendars, only: [:show, :edit, :update]

    def index 
        @calendars = current_user.calendars.all
    end


    def show
        if authorized? 
            respond_to do |format|
                format.json {render :show}
            end
        else 
            handle_unauthorized
        end 
    end 

    def create 
        @calendar= current_user.calendars.build(calendar_params)
        @paramStuff = calendar_params
        if authorized?
            respond_to do |format|
                if @calendar.save
                    format.json { render :show, status: :created, location: api_v1_calendar_path(@calendar)}
                else 
                    format.json { render json: @calendar.errors, status: :unprocessable_entity }
                end 
            end
        else 
            handle_unauthorized 
        end 
    end

    def update 
        if authorized?
            respond_to do |format|
                if @calendar.update(calendar_params)
                    format.json{ render :show, status: :ok, location: api_v1_calendar_path(@calendar)}
                else 
                    format.json {render json: @calendar.errors, status: :unprocessable_entity }
                end 
            end 
        else 
            handle_unauthorized
        end
    end 


    private

        def set_calendars
            @calendar = Calendar.find(params[:id])
        end
        
        def calendar_params
            params.require(:calendar).permit(:date_today, :count, :user_id)
        end 

        def authorized? 
            @calendar.user == current_user
        end

        def handle_unauthorized
            unless authorized?
                respond_to do |format|
                    format.json {render :unauthorized, status: 401}
                end 
            end 
        end 
    
end