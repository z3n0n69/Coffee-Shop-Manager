
import mysql.connector

"""

class Person:
    def __init__(self, name, age):
        self.name = name 
        self.age = age 



p1 = Person("John", 17)

print(p1.name)
print(p1.age)

"""


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
        
        

    


mydb = mysql.connector.connect(

        host="localhost", 
        user = "root", 
        password = "root"

        )

loginfetch = FetchDB("admin", "admin", "users", "logins")


testdbquery = loginfetch.loginverifier(mydb)
print(testdbquery)

