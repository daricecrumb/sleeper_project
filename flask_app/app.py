from flask import Flask

app = Flask(__name__)



# Define a route
@app.route('/')
def index():
    return 'Hello, this is your Flask app!'

@app.route('/about')
def about():
    return 'This is the about page'

if __name__ == "__main__":
    app.run(debug=True)