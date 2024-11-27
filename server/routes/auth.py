# server/routes/auth.py
from flask import Blueprint, make_response, request, jsonify
from models import db, User
from flask_jwt_extended import create_access_token, verify_jwt_in_request
from flask_jwt_extended import jwt_required, get_jwt_identity
# Create a Blueprint for the authentication routes
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Check if the user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 400

    # Create a new user
    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        # Create the JWT token
        access_token = create_access_token(identity=user.id)
        
        # Set the token in an HttpOnly cookie
        response = make_response(jsonify({'message': 'Login successful'}), 200)
        response.set_cookie(
            'token', 
            access_token, 
            httponly=True,  # Prevent JavaScript access
            secure=True,    # Only send over HTTPS
            samesite='Strict'  # Prevent CSRF
        )
        return response

    return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/protected', methods=['GET'])
def protected():
    try:
        # Validate the token from the cookie
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        return jsonify({'message': f'Hello user {current_user_id}'}), 200
    except Exception as e:
        return jsonify({'message': 'Invalid token'}), 401
    
@auth_bp.route('/logout', methods=['POST'])
def logout():
    # Clear the token cookie
    response = make_response(jsonify({'message': 'Logout successful'}), 200)
    response.delete_cookie('token')  # Delete the token
    return response

@auth_bp.route('/me', methods=['GET'])
def get_user():
    try:
        verify_jwt_in_request()  # Validate the token
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user:
            return jsonify({'user': {'id': user.id, 'email': user.email, 'username': user.username}})
        return jsonify({'message': 'User not found'}), 404
    except Exception:
        return jsonify({'message': 'Unauthorized'}), 401
