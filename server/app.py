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

MODEL_SERVER_URL = os.getenv("MODEL_SERVER_URL", "http://tensorflow:8501/v1/models/model_name:predict")

# Function to make predictions by sending data to the REST API
def make_prediction(input_data):
    data = {"instances": [input_data]}
    response = requests.post(MODEL_SERVER_URL, json=data)
    response_json = response.json()
    return response_json.get('predictions', None)

# Melody generation API endpoint
@app.route('/generate_melody', methods=['GET'])
def generate_melody():
    # Get query parameters, with random defaults for `mode` and `octave`
    tonic = int(request.args.get('tonic', 0))  # Default to 0 if not provided
    mode = int(request.args.get('mode', random.randint(0, 1)))
    octave = int(request.args.get('octave', int(np.random.normal(6, 1, 1))))
    length = 55

    dictarray = []
    for i in range(length - 5):
        notesfordict = random.randint(0, 11)
        octavefordict = octave + random.randint(-1, 1)
        dictarray.append([notesfordict, octavefordict, tonic, mode])

    temperature = 0.5

    # Generate predictions
    for i in range(30):
        input_data = dictarray[-(length - 5):]
        predictions = make_prediction(input_data)[0]

        if predictions:
            for j in range(5):
                pred_note = np.array(predictions[f"output_{j+1}"]) / temperature
                pred_note = np.exp(pred_note) / np.sum(np.exp(pred_note))
                predicted_note = np.argmax(pred_note, axis=0)

                pred_octave = np.array(predictions[f"output_{j+6}"]) / temperature
                pred_octave = np.exp(pred_octave) / np.sum(np.exp(pred_octave))
                predicted_octave = np.argmax(pred_octave, axis=0)

                new_sequence = np.stack([[predicted_note], [predicted_octave], [tonic], [mode]], axis=-1)
                dictarray.append(new_sequence.flatten().tolist())

    # Convert predictions to MIDI
    notes = np.array(dictarray)[:, 0:2]
    note_queue = queue.Queue()
    for note, octave in notes:
        note_queue.put(note + octave * 12)

    midi_file = mido.MidiFile()
    track = mido.MidiTrack()
    midi_file.tracks.append(track)

    velocity = 100
    tick_range = (200, 600)

    while not note_queue.empty():
        if random.random() < 0.7:
            duration = random.randint(*tick_range)
            added_note = note_queue.get()
            track.append(mido.Message('note_on', note=added_note, velocity=velocity, time=0))
            track.append(mido.Message('note_off', note=added_note, velocity=velocity, time=duration))
        else:
            chords = []
            if note_queue.qsize() <= 2:
                break
            for _ in range(random.randint(2, min(4, note_queue.qsize()))):
                chords.append(note_queue.get())

            for chord_note in chords:
                track.append(mido.Message('note_on', note=chord_note, velocity=velocity, time=random.randint(10, 20)))
            for chord_note in chords:
                duration = random.randint(200, 400)
                track.append(mido.Message('note_off', note=chord_note, velocity=velocity, time=duration))

    # Save MIDI to an in-memory file
    midi_io = io.BytesIO()
    midi_file.save(file=midi_io)
    midi_io.seek(0)

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

