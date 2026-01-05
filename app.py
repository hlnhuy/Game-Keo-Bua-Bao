from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from engine import RPSGame

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
game_logic = RPSGame()

# Danh sách chờ cho ván tiếp theo
ready_for_next_round = set()

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('disconnect')
def handle_disconnect():
    # Quan trọng: Xóa người chơi khỏi danh sách khi họ tắt trình duyệt hoặc F5
    if request.sid in game_logic.players:
        del game_logic.players[request.sid]
    if request.sid in ready_for_next_round:
        ready_for_next_round.remove(request.sid)

@socketio.on('join_game')
def handle_join(data):
    game_logic.add_user(request.sid, data['name'])
    
    # Nếu đủ 2 người, lấy 2 người mới nhất để ghép cặp
    if len(game_logic.players) >= 2:
        sids = list(game_logic.players.keys())
        p1_sid, p2_sid = sids[-2], sids[-1]
        
        # Gửi tên đối thủ cho từng người để hiển thị ngay hiệp 1
        emit('start_countdown', {'op_name': game_logic.players[p2_sid]['name']}, room=p1_sid)
        emit('start_countdown', {'op_name': game_logic.players[p1_sid]['name']}, room=p2_sid)

@socketio.on('join_next_round')
def handle_next_round():
    ready_for_next_round.add(request.sid)
    # Đợi cả 2 người cùng sẵn sàng mới bắt đầu hiệp mới
    if len(ready_for_next_round) >= 2:
        sids = list(ready_for_next_round)
        p1_sid, p2_sid = sids[0], sids[1]
        
        emit('start_countdown', {'op_name': game_logic.players[p2_sid]['name']}, room=p1_sid)
        emit('start_countdown', {'op_name': game_logic.players[p1_sid]['name']}, room=p2_sid)
        ready_for_next_round.clear()

@socketio.on('make_choice')
def handle_move(data):
    if request.sid in game_logic.players:
        game_logic.players[request.sid]['choice'] = data['choice']
        
        ready_ids = game_logic.check_ready()
        if ready_ids:
            p1_sid, p2_sid = ready_ids[0], ready_ids[1]
            p1, p2 = game_logic.players[p1_sid], game_logic.players[p2_sid]
            
            res_p1 = game_logic.get_result_for_player(p1['choice'], p2['choice'])
            res_p2 = game_logic.get_result_for_player(p2['choice'], p1['choice'])
            
            if res_p1 == "Thắng": p1['score'] += 1
            if res_p2 == "Thắng": p2['score'] += 1

            emit('game_end', {
                'my_res': res_p1, 'my_choice': p1['choice'], 'op_choice': p2['choice'],
                'my_score': p1['score'], 'op_score': p2['score'], 'op_name': p2['name']
            }, room=p1_sid)
            
            emit('game_end', {
                'my_res': res_p2, 'my_choice': p2['choice'], 'op_choice': p1['choice'],
                'my_score': p2['score'], 'op_score': p1['score'], 'op_name': p1['name']
            }, room=p2_sid)
            
            p1['choice'] = p2['choice'] = None

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)