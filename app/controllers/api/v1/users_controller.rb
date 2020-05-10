class Api::V1::UsersController < ApplicationController
    before_action :set_user, only: [:show]
    def index 
        @users = current_user
       
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

    private

    def set_user 
        @user = User.find(params[:id])
    end

    def set_params
        params.require(:user).permit(:created_at, :id)
    end
end