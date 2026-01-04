from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from engine import RPSGame

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
game_logic = RPSGame()

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)