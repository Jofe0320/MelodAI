import io
import queue
import random
from flask import Flask, send_file, send_from_directory,request
from dotenv import load_dotenv
import numpy as np
from models import db
from routes.auth import auth_bp  # Importing your authentication routes
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os
import boto3
import mido
import requests
# Import and register blueprints (routes)
from routes.upload import upload_bp
from LSTM import generate_midi_from_model

load_dotenv()

# Set up the app
app = Flask(__name__, static_folder='client/build/',    static_url_path='/')
CORS(app)

@app.route('/api/hello')
def hello():
    return "Hola"

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    # Serve static files if they exist
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        # Serve index.html for client-side routing to work
        return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

MODEL_SERVER_URL = os.getenv("MODEL_SERVER_URL", "http://localhost:8501/v1/models/model_name:predict")

# Function to make predictions by sending data to the REST API
def make_prediction(input_data):
    data = {"instances": [input_data]}
    response = requests.post(MODEL_SERVER_URL, json=data)
    response_json = response.json()
    return response_json.get('predictions', None)

# Melody generation API endpoint
@app.route('/generate_melody', methods=['GET'])
def generate_melody():
    # Call generate_midi_from_model and get the in-memory MIDI file
    midi_io = generate_midi_from_model()

    # Return MIDI file as response without saving to disk
    return send_file(
        midi_io,
        as_attachment=True,
        download_name="generated_melody.mid",
        mimetype="audio/midi"
    )

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

# Initialize S3
s3 = boto3.client(
    's3',
    aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
    region_name=os.environ.get('AWS_REGION')
)

app.register_blueprint(upload_bp)

if __name__ == '__main__':
    # port = int(os.getenv('PORT') or 8000)  # Defaults to 8000 if PORT is not set
    app.run(host='0.0.0.0', port=8000, debug=False)

