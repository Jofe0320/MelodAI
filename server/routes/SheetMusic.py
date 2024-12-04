import os
import subprocess
from flask import Blueprint, request, jsonify, send_file

# Define the blueprint
sheet_music_bp = Blueprint('sheet_music', __name__)

@sheet_music_bp.route('/generate_pdf', methods=['POST'])
def generate_pdf():
    """
    Convert a MIDI file to PDF sheet music using MuseScore CLI with Xvfb.
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

        # Define the output PDF file path
        output_filename = os.path.splitext(midi_file.filename)[0] + ".pdf"
        output_path = os.path.join("uploads", output_filename)

        # Generate PDF using MuseScore CLI with Xvfb
        result = subprocess.run(
            ["xvfb-run", "musescore3", input_path, "-o", output_path],
            capture_output=True,
            text=True
        )

        # Check for errors in the MuseScore command
        if result.returncode != 0:
            return jsonify({"error": f"MuseScore CLI error: {result.stderr}"}), 500

        # Return the PDF file
        return send_file(output_path, mimetype="application/pdf", as_attachment=True, download_name=output_filename)

    except Exception as e:
        # Handle errors and send error response
        return jsonify({"error": str(e)}), 500
