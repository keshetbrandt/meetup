from flask import Flask, request, jsonify, render_template, redirect, url_for
import os
import user
from datetime import timedelta, datetime
from main_flow import full_flow, schedule_meeting, data_to_event
import mongoDB_API
import pandas as pd
import scheduleRequest as sr
from tokenMaker import get_google_calendar_cred


app = Flask(__name__)

# Build random secret key
app.secret_key = os.urandom(22)

db = mongoDB_API.conenct_to_db()

@app.route('/homepage', methods=['GET', 'POST'])
def homepage():
    email = request.form["email"].lower()
    if request.method == 'POST':
        return user.get_homepage(email)
    
        #email = request.get_json()["email"]    
        #return jsonify(user.get_homepage(email))
    else: #GET
        user_validation = mongoDB_API.validate_users([email])
        if user_validation != True:
            user.sign_up(email, "first_name", "last_name", None)
            #need to return that i created user so you go in to availability page
        else:
            return  #DELETE THIS LINE
            #need to return that i found user so you go in to homepage    
    
    return render_template('login.html')
    

@app.route('/preferences', methods=['GET', 'POST'])
def availability():
    email = request.args.get('email')
    # email = request.form["email"].lower()

    if request.method == 'POST':

        # availability = []
        # for day in ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]:
        #     start = datetime.strptime(request.form[f"{day}_start"], "%H:%M")
        #     end = datetime.strptime(request.form[f"{day}_end"], "%H:%M")
        #     available = request.form[f"{day}_available"]
        #     availability.append({
        #         "day": day,
        #         "start": start,
        #         "end": end,
        #         "available": available
        #     })
        
        # user.update_availability(email, availability)
        # return f"Updated availability for {email}"
    
        data = request.get_json()
        email = data["email"]
        availability = data["preferences"]
        for day in availability:
                time_format = "%I:%M %p"
                day['start'] = datetime.strptime(day['start'], time_format)
                day['end'] = datetime.strptime(day['end'], time_format)
        updated = user.update_availability(email, availability)

        return jsonify(updated)
    else:
        # return render_template('availability.html')
        availability = user.get_availability(email)
        for day in availability:
            day['start'] = day['start'].strftime("%I:%M %p")
            day['end'] = day['end'].strftime("%I:%M %p")

        return availability


@app.route('/meeting', methods=['GET', 'POST'])
def meeting_request():
    if request.method == 'POST':
        data = request.get_json()
        title = data["title"]
        when = data["when"]
        duration = data["duration"]
        preferred_starting_time = data["preferredTime"]
        location = data["location"]
        description = data["description"]
        participants = data["participants"].strip().split(",")
        participants = [data["useremail"]] + participants
        print("title: ", title , "when: ", when, "duration: ", duration, "preferred_starting_time: ", preferred_starting_time, "location: ", location, "description: ", description, "participants: ", participants)
       
        user_validation = mongoDB_API.validate_users(participants)
        if user_validation != True:
            return jsonify({"message": user_validation +  " is not registered. Please ask them to sign up!"})
        
        request_format = sr.ScheduleRequest(title, participants, duration, when, preferred_starting_time, description, location)
        print("Generated request: ", request_format.to_dict()) 
        result = full_flow(request_format)
        if result["message"] == "success":
            print("Found time! scheduling meeting on: " , result['available_slots'][0])
            schedule_meeting(data_to_event(result))
        return jsonify(result)
    else:
        return render_template('request.html')
    
# @app.route('/schedule', methods=['GET', 'POST'])
# def schedule():
#     if request.method == 'POST':
#         data = request.get_json()
#         return jsonify(schedule_meeting(data))
    
#     else:
#         return render_template('login.html')


# @app.route('/signup', methods=['GET', 'POST'])
# def signup():
#     if request.method == 'POST':
#         email = request.get_json()["email"]
#         first_name = request.get_json()["first_name"]
#         last_name = request.get_json()["last_name"]
#         availability = request.get_json()["availability"]   
#         return jsonify(sign_up(email, first_name, last_name, availability))
#     else:
#         return render_template('signup.html')
    


if __name__ == "__main__":
    app.run(debug=True)
