from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)  # Increase length to 256

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Song(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # ForeignKey references 'user' table
    midi_link = db.Column(db.String, nullable=False)  # Link to the MIDI file
    sheet_music_link = db.Column(db.String, nullable=False)  # Link to the sheet music file
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp for when the song was added

    # Relationship to the User model
    user = db.relationship('User', backref=db.backref('songs', lazy=True))