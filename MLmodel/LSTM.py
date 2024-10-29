import tensorflow as tf

# Number of classes (e.g., number of unique notes or categories)
num_notes = 12  # Adjust based on your specific classification task
num_octaves = 11
length = 55
# Initializing the Model
input_layer = tf.keras.layers.Input(shape=(length-5, 4))

# LSTM Layers
note_lstm = tf.keras.layers.LSTM(256, return_sequences=True)(input_layer)
note_lstm = tf.keras.layers.LSTM(256, return_sequences=False)(note_lstm)

octave_lstm = tf.keras.layers.LSTM(256, return_sequences=True)(input_layer)
octave_lstm = tf.keras.layers.LSTM(256, return_sequences=False)(octave_lstm)



# Dense Layers
note1 = tf.keras.layers.Dense(128, activation='relu')(note_lstm)
note2 = tf.keras.layers.Dense(128, activation='relu')(note_lstm)
note3 = tf.keras.layers.Dense(128, activation='relu')(note_lstm)
note4 = tf.keras.layers.Dense(128, activation='relu')(note_lstm)
note5 = tf.keras.layers.Dense(128, activation='relu')(note_lstm)

# Output layer for classification
output_1 = tf.keras.layers.Dense(num_notes, activation='softmax', name='output_1')(note1)
output_2 = tf.keras.layers.Dense(num_notes, activation='softmax', name='output_2')(note2)
output_3 = tf.keras.layers.Dense(num_notes, activation='softmax', name='output_3')(note3)
output_4 = tf.keras.layers.Dense(num_notes, activation='softmax', name='output_4')(note4)
output_5 = tf.keras.layers.Dense(num_notes, activation='softmax', name='output_5')(note5)

octave1 = tf.keras.layers.Dense(128, activation='relu')(octave_lstm)
octave2 = tf.keras.layers.Dense(128, activation='relu')(octave_lstm)
octave3 = tf.keras.layers.Dense(128, activation='relu')(octave_lstm)
octave4 = tf.keras.layers.Dense(128, activation='relu')(octave_lstm)
octave5 = tf.keras.layers.Dense(128, activation='relu')(octave_lstm)

output_6 = tf.keras.layers.Dense(num_octaves, activation='softmax', name='output_6')(octave1)
output_7 = tf.keras.layers.Dense(num_octaves, activation='softmax', name='output_7')(octave2)
output_8 = tf.keras.layers.Dense(num_octaves, activation='softmax', name='output_8')(octave3)
output_9 = tf.keras.layers.Dense(num_octaves, activation='softmax', name='output_9')(octave4)
output_10 = tf.keras.layers.Dense(num_octaves, activation='softmax', name='output_10')(octave5)


# Defining the model with one output
model = tf.keras.models.Model(inputs=input_layer, outputs=[
    {'output_1': output_1, 
     'output_2': output_2, 
     'output_3': output_3, 
     'output_4': output_4, 
     'output_5': output_5,
     'output_6': output_6,
     'output_7': output_7,
     'output_8': output_8,
     'output_9': output_9,
     'output_10': output_10}])

# Compiling the model with appropriate loss function and metrics for classification
model.compile(
    optimizer=tf.keras.optimizers.Adamax(learning_rate=0.001, clipvalue=3.0),
    loss=
    {'output_1': 'sparse_categorical_crossentropy', 
     'output_2': 'sparse_categorical_crossentropy', 
     'output_3': 'sparse_categorical_crossentropy', 
     'output_4': 'sparse_categorical_crossentropy', 
     'output_5': 'sparse_categorical_crossentropy',
     'output_6': 'sparse_categorical_crossentropy',
     'output_7': 'sparse_categorical_crossentropy',
     'output_8': 'sparse_categorical_crossentropy',
     'output_9': 'sparse_categorical_crossentropy',
     'output_10': 'sparse_categorical_crossentropy'},
    metrics=
    {'output_1': 'accuracy', 
     'output_2': 'accuracy', 
     'output_3': 'accuracy', 
     'output_4': 'accuracy', 
     'output_5': 'accuracy',
     'output_6': tf.keras.metrics.TopKCategoricalAccuracy(k=3),
     'output_7': tf.keras.metrics.TopKCategoricalAccuracy(k=3),
     'output_8': tf.keras.metrics.TopKCategoricalAccuracy(k=3),
     'output_9': tf.keras.metrics.TopKCategoricalAccuracy(k=3),
     'output_10': tf.keras.metrics.TopKCategoricalAccuracy(k=3)}  # Track accuracy during training
)

# Show the model summary
model.summary()

# Load the weights into the model
model.load_weights('GOOD_MODEL3.keras')

# Save the model in TensorFlow's SavedModel format
# Save the model in TensorFlow's SavedModel format, compatible with TensorFlow Serving
# Save the model in TensorFlow's SavedModel format, compatible with TensorFlow Serving
model.export('LstmModel')

