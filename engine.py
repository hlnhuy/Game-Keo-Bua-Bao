class RPSGame:
    def __init__(self):
        self.players = {} # Lưu trữ: {sid: {"name": str, "choice": str, "score": int}}

    def add_user(self, sid, name):
        # Tạo mới người chơi với điểm số bằng 0
        self.players[sid] = {"name": name, "choice": None, "score": 0}

    def check_ready(self):
        # Kiểm tra xem có ít nhất 2 người đã đưa ra quyết định (kể cả 'none')
        ready_ids = [sid for sid, data in self.players.items() if data.get('choice') is not None]
        return ready_ids if len(ready_ids) >= 2 else None

    def get_result_for_player(self, p1_move, p2_move):
        # Xử lý trường hợp bỏ cuộc (không chọn)
        if p1_move == 'none' and p2_move == 'none': return "Hòa"
        if p1_move == 'none': return "Thua"
        if p2_move == 'none': return "Thắng"
        
        # Quy tắc Kéo - Búa - Bao cơ bản
        if p1_move == p2_move: return "Hòa"
        rules = {'keo': 'bao', 'bao': 'bua', 'bua': 'keo'}
        return "Thắng" if rules[p1_move] == p2_move else "Thua"
        