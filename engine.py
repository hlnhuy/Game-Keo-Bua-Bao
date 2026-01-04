class RPSGame:
    def __init__(self):
        self.players = {} # Lưu trữ: {sid: {"name": str, "choice": str, "score": int}}

    def add_user(self, sid, name):
        # Tạo mới người chơi với điểm số bằng 0
        self.players[sid] = {"name": name, "choice": None, "score": 0}