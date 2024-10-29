# Use TensorFlow Serving as the base image
FROM tensorflow/serving

# Copy the SavedModel to the correct location inside the Docker image
COPY LstmModel /models/model_name/1

# Set environment variable for the model name
ENV MODEL_NAME=model_name

# Expose port 8501 for TensorFlow Serving (this is the default REST API port)
EXPOSE 8500 8501

# Command to start TensorFlow Serving, listening on port 8501
CMD ["tensorflow_model_server", "--port=8500", "--rest_api_port=8501", "--model_name=model_name", "--model_base_path=/models/model_name"]

