from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from models import Song  # Assuming Song is in the models file

BUCKET_NAME = "melodai-generated-songs"  # Replace with your actual S3 bucket name

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    from ..app import db, s3 
    user_id = request.form.get('user_id')
    midi_file = request.files['midi']
    sheet_music_file = request.files['sheet_music']

    # Upload MIDI file
    midi_filename = secure_filename(midi_file.filename)
    s3.upload_fileobj(midi_file, BUCKET_NAME, midi_filename)
    midi_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{midi_filename}"

    # Upload Sheet Music file
    sheet_music_filename = secure_filename(sheet_music_file.filename)
    s3.upload_fileobj(sheet_music_file, BUCKET_NAME, sheet_music_filename)
    sheet_music_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{sheet_music_filename}"

    # Save song details to the database
    new_song = Song(user_id=user_id, midi_link=midi_url, sheet_music_link=sheet_music_url)
    db.session.add(new_song)
    db.session.commit()

    return jsonify({"message": "Files uploaded and saved successfully!"})

@upload_bp.route('/songs', methods=['GET'])
def get_user_songs():
    """
    Fetch and present songs uploaded by a specific user.
    """
    user_id = request.args.get('user_id')  # Get the user ID from the query parameter

    # Validate that the user_id was provided
    if not user_id:
        return jsonify({"message": "User ID is required"}), 400

    # Fetch songs belonging to the user from the database
    songs = Song.query.filter_by(user_id=user_id).all()

    # Check if the user has uploaded any songs
    if not songs:
        return jsonify({"message": "No songs found for this user"}), 404

    # Serialize the song data into JSON format
    songs_data = [
        {
            "id": song.id,
            "midi_link": song.midi_link,
            "sheet_music_link": song.sheet_music_link,
            "created_at": song.created_at.strftime('%Y-%m-%d %H:%M:%S')  # Optional: formatted timestamp
        }
        for song in songs
    ]

    return jsonify({"songs": songs_data}), 200
