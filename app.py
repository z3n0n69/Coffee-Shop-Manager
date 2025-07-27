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

dbchecklogincreds = "SELECT * FROM "











app = Flask(__name__) #flask constructor 
    
@app.route('/', methods=['GET'])  # Define a route for the login endpoint

def login_request(): 
    return render_template('login.html')

@app.route('/login_request', methods=['POST'])  # Define a route for handling login requests

def handle_login_request():


    if request.method == "POST": 

        input_username = request.form.get('input_username_login') 
        input_password = request.form.get('input_password_login')
        #validation logic 

        dbquerycursor = mydb.cursor() 
        dbquerycursor.execute("USE users")
        dbquerycursor.execute("SELECT * FROM logins WHERE Username = %s AND Password = %s", (input_username, input_password))
        result = dbquerycursor.fetchone()
        print(result)
        
        if result == None: #if user is not in the database 
            response = '''
                <html>
                    <head>
                        <meta http-equiv = 'refresh' content= "2; url=/">
                    </head>
                    
                    <body>
                        <h1>Invalid Login. Redirecting...</h1>
                    </body>

                </html>


            '''
            return make_response(response)
        
        else: 
            return render_template('dashboard.html')
                
        
        
        
    



if __name__ == '__main__':
    app.run(debug=True)  # Run the Flask application in debug mode