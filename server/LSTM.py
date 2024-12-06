import tensorflow as tf
import random
import numpy as np
import mido
import queue
import io

def generate_midi_from_model(model_path='GOOD_MODEL3.keras', output_file='output2.mid', length=55, temperature=0.5, tonic=0):
    def calculate_scale(tonic, intervals):
        return [(tonic + interval) % 12 for interval in intervals]

    tonic_dict = {symbol: i for i, symbol in enumerate(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])}
    tonic_dict_to_notes = {i : symbol  for i, symbol in enumerate(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])}
    # Generate scales for all keys using the tonic_dict
    # Intervals for different scales
    major_intervals = [0, 2, 4, 5, 7, 9, 11]
    natural_minor_intervals = [0, 2, 3, 5, 7, 8, 10]
    harmonic_minor_intervals = [0, 2, 3, 5, 7, 8, 11]
    melodic_minor_intervals = [0, 2, 3, 5, 7, 9, 11]
    scales = {}
    for note, number in tonic_dict.items():
        # Combine all minor scales into one set to ensure unique notes
        combined_minors = set(
            calculate_scale(number, natural_minor_intervals)
            + calculate_scale(number, harmonic_minor_intervals)
            + calculate_scale(number, melodic_minor_intervals)
        )
        scales[note] = {
            "Major": calculate_scale(number, major_intervals),
            "Combined Minor": sorted(combined_minors),
        }

    duration_array = [2,1.5,1,0.75,0.5,0.375,0.25]
    
    # Load the Keras model
    model = tf.keras.models.load_model(model_path)

    # Initial start array, assuming the same tonic and mode
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
        predictions = model.predict(start[:,-(length-5):], verbose=0)

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
    notes = start[:, length-5:, 0][0]
    octave = int(np.mean(start[:, length-5:, 1]))
    durations = []
    for _ in range(start.shape[1]):
        lambda_ = 0  # Controls how steep the weighting is
        weights = np.exp(lambda_ * np.arange(len(duration_array)))

        # Normalize weights to sum to 1
        weights /= weights.sum()

        # Select a value based on the weights
        durations.append(np.random.choice(duration_array, p=weights))
    note_queue = queue.Queue()
    for i,note in enumerate(notes):
        if int(note) in scales[tonic_dict_to_notes[tonic]]['Major']:
            note_queue.put((int(note+octave*12),durations[i]))

    tick_range = 384
    tempo = 500_000

    # Create a new MIDI file and a track
    midi_file = mido.MidiFile(ticks_per_beat=tick_range)
    track = mido.MidiTrack()
    midi_file.tracks.append(track)
    running_duration = 0
    track.append(mido.MetaMessage('set_tempo', tempo=tempo, time=0))

    # Parameters
    ticks_per_whole_note = 4 * tick_range
    # Loop through each note
    while not note_queue.empty() and running_duration < tick_range * 30 * 2:  # Limit to 30 bars
        added_note, duration_in_beats = note_queue.get()
        duration = int(duration_in_beats * tick_range)  # Convert duration from beats to ticks

        # Calculate remaining ticks in the current whole note
        remaining_ticks = ticks_per_whole_note - (running_duration % ticks_per_whole_note)
        # print(running_duration,duration_in_beats)
        # Align to the next whole note if duration exceeds the remaining ticks
        if duration > remaining_ticks:
            delay = remaining_ticks  # Delay to reach the next whole note boundary
            running_duration += delay
            track.append(mido.MetaMessage('set_tempo', tempo=tempo, time=delay))  # MetaMessage to account for delay

        # Add the note_on and note_off events
        track.append(mido.Message('note_on', note=added_note, velocity=int(min(np.random.normal(100, 16), 127)), time=0))
        track.append(mido.Message('note_off', note=added_note, velocity=0, time=duration))

        # Update running duration
        running_duration += duration

    # Save the MIDI file
    midi_io = io.BytesIO()
    midi_file.save(file=midi_io)
    midi_io.seek(0)
    print(f"MIDI file created and saved as '{output_file}'")
    return midi_io