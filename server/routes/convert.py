import os
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
