from flask import Flask, request, render_template, make_response 
import mysql.connector 




"""
NOTES: 
* Must connect to MySQL database - DONE 
* Create a function to request access to the Coffee Shop Manager App.
* Create a function to validate login credentials.



"""





#mySQL connection setup 

mydb = mysql.connector.connect(

    host="localhost", 
    user = "root", 
    password = "root"

)


def dbrequest_access(): 
    """
    Function to request access to the Coffee Shop Manager App.
    This function can be used to handle user requests for access.
    """










app = Flask(__name__) #flask constructor 
    
@app.route('/')  # Define a route for the login endpoint

def index(): 
    return render_template('login.html')  # Render the index.html template


@app.route('/login', methods = ['POST']) # Define a route for the login endpoint with POST method 

#login validation
def login(): 
    if request.method == 'POST': 
        username = request.form['username']
        password = request.form['password'] 
        return make_response(render_template("dashboard.html")) 
    else: 
        return make_response(render_template("login.html", error="Invalid credentials"))


@app.route('/accessrequest')
def access_request_page(): 
    return render_template('request.html')

if __name__ == '__main__':
    app.run(debug=True)  # Run the Flask application in debug mode