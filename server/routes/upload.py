import os
import boto3
from urllib.parse import urlparse
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from models import Song  # Assuming Song is in the models file

BUCKET_NAME = "melodai-generated-songs"  # Replace with your actual S3 bucket name

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    from app import db, s3 
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
    try:
        # Extract user ID from query parameters
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"message": "User ID is required"}), 400

        # Fetch songs for the user from the database
        songs = Song.query.filter_by(user_id=user_id).all()

        if not songs:
            return jsonify({"message": "No songs found for this user"}), 404

        # Serialize the song data
        songs_data = [
            {
                "id": song.id,
                "midi_link": song.midi_link,
                "sheet_music_link": song.sheet_music_link,
                "created_at": song.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                "midi_presigned_url": generate_presigned_url(song.midi_link),  # Add MIDI presigned URL
                "sheet_music_presigned_url": generate_presigned_url(song.sheet_music_link),
            }
            for song in songs
        ]

        return jsonify({"songs": songs_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def generate_presigned_url(file_url):
    """
    Generate a presigned URL for an S3 object.
    """



    s3 = boto3.client(
        's3',
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
        aws_secret_access_key=os.getenv('AWS_SECRET_KEY'),
        region_name=os.getenv('AWS_REGION')
    )

    try:
        parsed_url = urlparse(file_url)
        bucket_name = parsed_url.netloc.split('.')[0]
        object_key = parsed_url.path.lstrip('/')

        # Generate the presigned URL
        presigned_url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': object_key},
            ExpiresIn=3600  # URL valid for 1 hour
        )
        return presigned_url
    except Exception as e:
        print(f"Error generating presigned URL: {e}")
        return None