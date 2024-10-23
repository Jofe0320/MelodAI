from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from ..models import Song  # Assuming Song is in the models file

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
