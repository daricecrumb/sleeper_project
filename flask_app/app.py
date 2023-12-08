from flask import Flask, logging, request, jsonify
import psycopg2
from dotenv import load_dotenv
import os

app = Flask(__name__)

# Load environment variables from .env.development.local
print("before")
env_path = '../.env.development.local' 
load_dotenv(env_path)
print("after")

# Access environment variables
dbname = os.getenv('POSTGRES_DATABASE')
user = os.getenv('POSTGRES_USER')
password = os.getenv('POSTGRES_PASSWORD')
host = os.getenv('POSTGRES_HOST')

#connection = psycopg2.connect(dbname=dbname, user=user, password=password, host=host)


# Establish a connection to the database

try:
    connection = psycopg2.connect(dbname=dbname, user=user, password=password, host=host)
    app.logger.info('Database connection established successfully.')
except psycopg2.Error as e:
    app.logger.error(f'Error connecting to the database: {e}')



# Define a route
@app.route('/')
def index():
    return 'Hello, this is your Flask app!'

@app.route('/about')
def about():
    return 'This is the about page'

@app.route('/get_player_id', methods=['POST'])
def get_data():
    if request.method == 'POST':
        # Assuming your React app sends JSON data
        data = request.get_json()
        # Access the variable sent by the React app
        variable = data.get('player_id')
        
         # Create a cursor to execute SQL queries
        cursor = connection.cursor()
        # Use the variable to query the database
        query = f"SELECT * FROM player_info WHERE player_id = '{variable}';"
        cursor.execute(query)
        # Fetch the data
        fetched_data = cursor.fetchall()
        # Close the cursor and the connection
        cursor.close()
        connection.close()
        
        # Return the fetched data as a JSON response
        return jsonify({'data': fetched_data})

if __name__ == "__main__":
    app.run(debug=True)

