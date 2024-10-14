from flask import Flask 
from dotenv import load_dotenv
from models import db
from routes.auth import auth_bp  # Importing your authentication routes
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

load_dotenv()

# Set up the app
app = Flask(__name__, static_folder='../client/build/',    static_url_path='/')
CORS(app)

@app.route('/api/hello')
def hello():
    return "Hola"

# Set up the index route
@app.route('/')
def index():
    return app.send_static_file('index.html')

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://u7v38u17rga1ak:pbf8019097e745f1c0201c31eb27589031deb2bf23263f5aa11a87a876f4ef414@caij57unh724n3.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/dap0rjnlna6o30'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

# Register Blueprints (routes)
# Register the auth blueprint with the '/auth' prefix
app.register_blueprint(auth_bp, url_prefix='/auth')

app.config['JWT_SECRET_KEY'] = 'your_secret_key'  # Replace with a strong secret key

jwt = JWTManager(app)

if __name__ == '__main__':
    app.run(port=(os.getenv('PORT') if os.getenv('PORT') else 8000), debug=False)
