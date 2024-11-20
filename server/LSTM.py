import tensorflow as tf
import random
import numpy as np
import mido
import queue
import io

def generate_midi_from_model(model_path='GOOD_MODEL3.keras', output_file='output2.mid', length=55, temperature=0.5):
    # Load the Keras model
    model = tf.keras.models.load_model(model_path)

    # Initial start array, assuming the same tonic and mode
    tonic = random.randint(0,11)
    mode = random.randint(0,1)
    octave = int(np.random.normal(6,1,1)[0])

    notes = np.array([[random.randint(0, 11) for _ in range(length-5)]])  # Only update this part
    octaves = np.array([[max(octave + random.randint(-1,1),0) for _ in range(length-5)]])
    tonics = np.array([[tonic for _ in range(length-5)]])
    modes = np.array([[mode for _ in range(length-5)]])

    start = np.stack([notes, octaves, tonics, modes], axis=-1)

    # Loop for predictions
    for i in range(30):
        # Model predict based on the last sequence
        predictions = model.predict(start[-(length-5):], verbose=0)

        # Extract the predictions
        predictions = [predictions[f'output_{i+1}'] for i in range(10)]

        # Append new predictions to the sequence
        for j in range(5):
            new_sequence = np.stack([np.argmax(predictions[j], axis=1), 
                                     np.argmax(predictions[j+5], axis=1), 
                                     [tonic], 
                                     [mode]], axis=-1)
            start = np.append(start, [new_sequence], axis=1)

    # Process predictions to create MIDI
    notes = start[:, length-5:, 0:2][0]
    note_queue = queue.Queue()
    for note, octave in notes:
        note_queue.put(note + octave * 12)

    # Create a new MIDI file and a track
    midi_file = mido.MidiFile()
    track = mido.MidiTrack()
    midi_file.tracks.append(track)
    running_duration = 0
    tempo = random.randint(200_000, 1_914_486)
    track.append(mido.MetaMessage('set_tempo', tempo=tempo, time=0))

    # Parameters
    velocity = 100
    tick_range = (200, 600)

    # Loop through each note
    while not note_queue.empty() and running_duration < 20:
        if random.random() < 0.7:
            duration = random.randint(*tick_range)
            running_duration += mido.tick2second(duration, 480, tempo)
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
                duration = random.randint(10, 20)
                running_duration += mido.tick2second(duration, 480, tempo)
                track.append(mido.Message('note_on', note=chord_note, velocity=velocity, time=duration))
            for chord_note in chords:
                duration = random.randint(200, 400)
                running_duration += mido.tick2second(duration, 480, tempo)
                track.append(mido.Message('note_off', note=chord_note, velocity=velocity, time=duration))

    # Save the MIDI file
    midi_io = io.BytesIO()
    midi_file.save(file=midi_io)
    midi_io.seek(0)
    print(f"MIDI file created and saved as '{output_file}'")
    return midi_io
   
