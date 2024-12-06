import os
import subprocess
import uuid
from flask import Blueprint, request, jsonify, send_file
from midi2audio import FluidSynth

# Define the blueprint
convert_bp = Blueprint('convert', __name__)


# Initialize FluidSynth
fs = FluidSynth('../TimGM6mb.sf2')

@convert_bp.route('/convert', methods=['POST'])
def convert_midi_to_mp3():
    """
    Convert a MIDI file to MP3 and return it as a response.
    """
    try:
        # Check if a file is provided
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        midi_file = request.files['file']
        if not midi_file.filename.endswith('.mid'):
            return jsonify({"error": "Invalid file type. Only .mid files are allowed"}), 400

        # Save the uploaded MIDI file
        os.makedirs("uploads", exist_ok=True)
        input_path = os.path.join("uploads", midi_file.filename)
        midi_file.save(input_path)

        # Define the output MP3 file path
        output_filename = os.path.splitext(midi_file.filename)[0] + ".mp3"
        output_path = os.path.join("uploads", output_filename)

        # Convert MIDI to MP3
        fs.midi_to_audio(input_path, output_path)

        # Return the MP3 file
        return send_file(output_path, mimetype="audio/mpeg", as_attachment=True, download_name=output_filename)

    except Exception as e:
        # Handle errors and send error response
        return jsonify({"error": str(e)}), 500

UPLOAD_FOLDER = "../uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@convert_bp.route('/convert-midi-musescore', methods=['POST'])
def convert_midi_to_musescore():
    try:
        # Check if a file is in the request
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        midi_file = request.files['file']
        if midi_file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        # Save the uploaded MIDI file
        input_filename = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4()}.mid")
        midi_file.save(input_filename)

        # Output filename for the MuseScore file
        output_filename = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4()}.mscz")

        # Run MuseScore CLI command to convert MIDI to MuseScore
        # Update the command to include xvfb-run
        command = ["xvfb-run", "musescore3", "-o", output_filename, input_filename]
        subprocess.run(command, check=True)


        # Return the MuseScore file
        return send_file(output_filename, as_attachment=True)

    except subprocess.CalledProcessError as e:
        return jsonify({"error": f"Error during conversion: {e}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up temporary files
        if os.path.exists(input_filename):
            os.remove(input_filename)
        if os.path.exists(output_filename):
            os.remove(output_filename)

@convert_bp.route('/convert-midi-to-mp3', methods=['POST'])
def convert_midi_to_mp3_v2():
    """
    Convert a MIDI file to MP3 using MuseScore CLI with Xvfb.
    """
    try:
        # Check if a file is provided
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        midi_file = request.files['file']
        if not (midi_file.filename.endswith('.mid') or midi_file.filename.endswith('.midi')):
            return jsonify({"error": "Invalid file type. Only .mid and .midi files are allowed"}), 400

        # Save the uploaded MIDI file
        # Ensure uploads directory exists
        upload_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../uploads'))
        os.makedirs(upload_dir, exist_ok=True)

        # Save the uploaded MIDI file
        input_path = os.path.join(upload_dir, midi_file.filename)
        midi_file.save(input_path)

        # Define the output MP3 file path
        output_filename = os.path.splitext(midi_file.filename)[0] + ".mp3"
        output_path = os.path.join("uploads", output_filename)

        # Convert MIDI to MP3 using MuseScore CLI
        result = subprocess.run(
            ["xvfb-run", "musescore3", input_path, "-o", output_path],
            capture_output=True,
            text=True
        )

        # Check for errors in the MuseScore command
        if result.returncode != 0:
            return jsonify({"error": f"MuseScore CLI error: {result.stderr}"}), 500

        # Return the MP3 file
        return send_file(output_path, mimetype="audio/mpeg", as_attachment=True, download_name=output_filename)

    except Exception as e:
        # Handle errors and send error response
        return jsonify({"error": str(e)}), 500