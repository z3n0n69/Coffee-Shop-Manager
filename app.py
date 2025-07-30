from flask import Flask, request, render_template, make_response 
import mysql.connector 




"""
NOTES: 
* Must connect to MySQL database - DONE 
* Create a function to request access to the Coffee Shop Manager App. 
* Create a function to validate login credentials. - DONE
* Create a class to have all the function needed for making queries for the database

"""





#mySQL connection setup 

usersSchema = "users"
loginsTable = "logins"
requestSchema = "accessrequest"
requestTable = "pendingrequest"

mydb = mysql.connector.connect(

        host="localhost", 
        user = "root", 
        password = "root"

        )

#Class for fetching something in the database 

class FetchDB: 
    
    def __init__(self, username, password, schema, table):
        self.username = username 
        self.password = password 
        self.schema = schema 
        self.table = table 
    


    def loginverifier(self, database): 
        dbcommand = database.cursor() 
        dbcommand.execute("USE users")
        dbcommand.execute("SELECT * FROM logins WHERE Username = %s AND Password = %s", (self.username, self.password))
        result = dbcommand.fetchone()
        return result
    
    def requestaccess(self, database)
         
        







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
        fetchLogin = FetchDB(input_username, input_password,usersSchema,loginsTable )
        fetchedResult = fetchLogin.loginverifier(mydb)
        
        
        print(fetchedResult)
        
        if fetchedResult == None: #if user is not in the database 
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


@app.route('/request_access_page')

def request_access_page():
    return render_template('signup.html')


#Request access page
@app.route('/request_access' , methods = ['POST'])

def request_access(): 
    if request.method == "POST":
        requestinput_employeeID = request.form.get('requestinput_employeeID')
        requestinput_employeeName = request.form.get('requestinput_employeeName')
        requestinput_password = request.form.get('requestinput_password')

        #putting this to the request database
        dbquerycursor = mydb.cursor()   



if __name__ == '__main__':
    app.run(debug=True)  # Run the Flask application in debug mode