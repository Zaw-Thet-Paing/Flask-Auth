from config import app, db, bcrypt
from flask import request, jsonify, session, abort
from models import User, db

@app.route('/home', methods=['GET'])
def home_page():
    if not session.get('user_id'):
        return jsonify({
            'message': "Unauthorized"
        }), 401
    return jsonify({
        'message': 'home page'
    }), 200


@app.route('/register', methods=['POST'])
def register_page():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({
            "message": "Name, email, and password are required"
        }), 400

    new_user = User.query.filter_by(email=email).first() is not None

    if new_user:
        return jsonify({
            "message": "User already exists"
        }), 409
    
    hashed_password = bcrypt.generate_password_hash(password)

    new_user = User(name=name, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    session['user_id'] = new_user.id
    return jsonify({
        "message": "User created!",
        "data": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email
        }
    }), 201


@app.route('/login', methods=['POST'])
def login_page():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({
            "message": "Email, and password are required"
        }), 400

    user = User.query.filter_by(email=email).first()

    if user is None or not bcrypt.check_password_hash(user.password, password):
        return jsonify({
            "message": "Invalid Credential"
        }), 401

    session['user_id'] = user.id
    return jsonify({
        "message": "user login success",
        "data": {
            "id": user.id,
            "name": user.name, 
            "email": user.email
        }
    })


@app.route('/logout', methods=['POST'])
def logout_page():
    if 'user_id' in session:
        session.pop('user_id')
        return jsonify({
            'message': 'User logged out successfully'
        })
    return jsonify({
        "message": "user not logged in"
    }), 400


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)