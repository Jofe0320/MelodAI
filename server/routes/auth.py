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
        response = make_response(jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
            }
        }), 200)
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
        # Log cookies for debugging
        print(f"Cookies received: {request.cookies}")

        # Validate the JWT token from the request
        verify_jwt_in_request()

        # Extract the user_id from the token
        user_id = get_jwt_identity()
        print(f"User ID extracted from token: {user_id}")

        # Retrieve user information from the database
        user = User.query.get(user_id)
        if user:
            return jsonify({'user': {'id': user.id, 'email': user.email, 'username': user.username}})

        # User not found in the database
        return jsonify({'message': 'User not found'}), 404

    except Exception as e:
        # Include user_id and cookies in error response
        error_details = {
            'message': 'Unauthorized access',
            'error': str(e),
            'user_id': user_id if 'user_id' in locals() else None,
            'cookies': request.cookies
        }
        print(f"Error in /me endpoint: {error_details}")
        return jsonify(error_details), 401


@auth_bp.route('/update-username', methods=['PUT'])
def update_username():
    try:
        # Step 1: Parse JSON data
        data = request.get_json()
        current_username = data.get('currentUsername')
        current_password = data.get('currentPassword')
        new_username = data.get('newUsername')

        
        # Step 2: Input Validation
        if not current_username or not current_password or not new_username:
            return jsonify({"error": "Email, password, and new username are required."}), 400
        
        # Step 3: Query the database for the user
        user = User.query.filter_by(username=current_username).first()
        if not user or not user.check_password(current_password):
            return jsonify({"error": "User or password incorrect."}), 404
        

        
        # Step 5: Update the username
        user.username = new_username
        db.session.commit()  # Commit changes to the database
        
        return jsonify({"message": "Username updated successfully."}), 200
    
    except Exception as e:
        # Handle any unexpected errors
        return jsonify({"error": str(e)}), 500
    
@auth_bp.route('/update-password', methods=['PUT'])
def update_password():
    try:
        # Step 1: Parse JSON data
        data = request.get_json()
        current_username = data.get('currentUsername')
        current_password = data.get('currentPassword')
        new_password = data.get('newPassword')

        # Step 2: Input Validation
        if not current_username or not current_password or not new_password:
            return jsonify({"error": "Username, current password, and new password are required."}), 400
        

        # Step 3: Query the database for the user
        user = User.query.filter_by(username=current_username).first()

        if not user or not user.check_password(current_password):
            return jsonify({"error": "User or password incorrect."}), 404

        # Step 4: Update the password
        user.set_password(new_password)
        db.session.commit()

        return jsonify({"message": "Password updated successfully."}), 200

    except Exception as e:
        print("Error:", str(e))  # Debugging the error
        return jsonify({"error": "Something went wrong on the server."}), 500
    

@auth_bp.route('/update-email', methods=['PUT'])
def update_email():
    try:
        # Step 1: Parse JSON data
        data = request.get_json()
        current_username = data.get('currentUsername')
        current_password = data.get('currentPassword')
        new_email = data.get('email')

        # Step 2: Input Validation
        if not current_username or not current_password or not new_email:
            return jsonify({"error": "Username, current password, and new email are required."}), 400
        

        # Step 3: Query the database for the user
        user = User.query.filter_by(username=current_username).first()

        if not user or not user.check_password(current_password):
            return jsonify({"error": "User or password incorrect."}), 404

        # Step 4: Update the password
        user.email = new_email
        db.session.commit()

        return jsonify({"message": "Email updated successfully."}), 200

    except Exception as e:
        print("Error:", str(e))  # Debugging the error
        return jsonify({"error": "Something went wrong on the server."}), 500