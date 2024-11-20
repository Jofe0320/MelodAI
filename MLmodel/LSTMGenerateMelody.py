import random
import numpy as np
import requests
import json
import mido
import queue

# REST API endpoint for TensorFlow Serving
MODEL_SERVER_URL = "http://localhost:8501/v1/models/model_name:predict"

# Initialize start array with tonic, mode, and octave
length = 55  # Set based on your model’s needs
tonic = random.randint(0, 11)
mode = random.randint(0, 1)
octave = int(np.random.normal(6, 1, 1))
dictarray = []

for i in range(length - 5):
    notesfordict = random.randint(0, 11)
    octavefordict = octave + random.randint(-1, 1)
    dictarray.append([notesfordict, octavefordict, tonic, mode])  # Use integers instead of strings

# Function to make predictions by sending data to the REST API
def make_prediction(input_data):
    data = {"instances": [input_data]}  # Wrap input_data in an outer list
    # print("Sending data:", data)  # For debugging

    # Send data as JSON
    response = requests.post(MODEL_SERVER_URL, json=data)
    
    # Print full response details for debugging
    # print("Response status code:", response.status_code)
    # print("Response content:", response.content.decode('utf-8'))

    # Return predictions if available
    response_json = response.json()
    return response_json.get('predictions', None)

temperature = 0.5  # Set temperature for predictions

# Loop for predictions
for i in range(30):
    # Make prediction based on the last sequence
    input_data = dictarray[-(length - 5):]  # Get last sequences for input
    predictions = make_prediction(input_data)[0]
    print(len(predictions), predictions)

    # Parse predictions for notes and octaves
    if predictions:
        for j in range(5):  # Update each note and octave prediction
            pred_note = np.array(predictions[f"output_{j+1}"]) / temperature
            pred_note = np.exp(pred_note) / np.sum(np.exp(pred_note))
            predicted_note = np.argmax(pred_note, axis=0)

            pred_octave = np.array(predictions[f"output_{j+6}"]) / temperature
            pred_octave = np.exp(pred_octave) / np.sum(np.exp(pred_octave))
            predicted_octave = np.argmax(pred_octave, axis=0)

            # Append new predictions to the sequence
            new_sequence = np.stack([[predicted_note], [predicted_octave], [tonic], [mode]], axis=-1)
            dictarray.append(new_sequence.flatten().tolist())  # Add the new sequence to dictarray

# Process predictions to create MIDI
notes = np.array(dictarray)[:, 0:2]  # Extract notes and octaves
note_queue = queue.Queue()

for note, octave in notes:
    note_queue.put(note + octave * 12)

# Create a new MIDI file
midi_file = mido.MidiFile()
track = mido.MidiTrack()
midi_file.tracks.append(track)

# Parameters
velocity = 100
tick_range = (200, 600)

# Loop through notes to add them to MIDI
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

# Save the MIDI file
midi_file.save('output1.mid')
