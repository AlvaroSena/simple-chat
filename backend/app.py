from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app)
io = SocketIO(app, cors_allowed_origins='*')

@app.route('/')
def index():
    return render_template('index.html')

@io.on('sendMessage')
def send_message(data):
    print(data)

    emit('receivedMessage', data, broadcast=True)
    
if __name__ == '__main__':
    io.run(app)